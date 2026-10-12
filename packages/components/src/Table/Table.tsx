import { useLayoutEffect, useRef, useState, type MouseEvent, type UIEvent } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { computeWindow, contentHeight } from '../internal/windowing';
import styles from './Table.module.css';
import type { Column, SortEntry, TableProps } from './types';

/** Scrollport cap applied when `maxHeight` is omitted in virtual mode. */
const DEFAULT_VIRTUAL_MAX_HEIGHT = '70vh';

/** Blank choice at the top of a select filter cell — clears the filter. */
const FILTER_ALL_LABEL = 'Tất cả';

const cx = (...parts: string[]): string => parts.filter(Boolean).join(' ');

/**
 * One track per column for the single grid template every row shares — header,
 * body, virtual, and the filter/group/detail rows later tasks add. A pinned
 * column is a fixed `width` px track so its sticky offset (the px sum of the
 * pinned columns before/after it) lines up with the track exactly; a regular
 * column stays flexible with a floor of its `width`, or the default cell
 * minimum when unset, so the grid can overflow and scroll horizontally — which
 * is what the pins exist for.
 */
function trackOf<T>(column: Column<T>): string {
  if (column.pinned && column.width != null) return `${column.width}px`;
  const min = column.width != null ? `${column.width}px` : 'var(--cell-min-width)';
  return `minmax(${min}, 1fr)`;
}

function gridTemplateOf<T>(columns: Column<T>[], selectable: boolean): string {
  const tracks = columns.map(trackOf);
  return (selectable ? ['36px', ...tracks] : tracks).join(' ');
}

/**
 * Cumulative sticky offsets in px: a left-pinned column sticks at the summed
 * `width`s of the pinned columns before it, a right-pinned column at the
 * summed `width`s of the pinned columns after it (accumulated right-to-left),
 * so neighbouring pins never overlap. The stylesheet cannot know these sums,
 * which is why each cell gets its offset inline.
 */
function pinOffsetsOf<T>(columns: Column<T>[]): {
  left: Map<string, number>;
  right: Map<string, number>;
} {
  const left = new Map<string, number>();
  const right = new Map<string, number>();
  let acc = 0;
  for (const column of columns) {
    if (column.pinned !== 'left') continue;
    left.set(column.key, acc);
    acc += column.width ?? 0;
  }
  acc = 0;
  for (let i = columns.length - 1; i >= 0; i -= 1) {
    const column = columns[i];
    if (column.pinned !== 'right') continue;
    right.set(column.key, acc);
    acc += column.width ?? 0;
  }
  return { left, right };
}

export function Table<T extends object>(props: TableProps<T>) {
  const {
    columns,
    data,
    sorts = [],
    onSort,
    selectedKeys,
    onSelect,
    rowKey,
    status = 'idle',
    onRetry,
    summary,
    virtual = false,
    rowHeight = 32,
    overscan = 8,
    showFilterRow = false,
    columnFilters,
    onColumnFilter,
  } = props;
  // Windowing state lives above the status early-returns so the hook order is
  // identical whatever `status` says. The scroll listener sits on `.scroll`
  // (the element the window is measured against) and is removed with the
  // component — no leak.
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget;
    setScrollTop(scroller.scrollTop);
    setViewportHeight(scroller.clientHeight);
  };
  // Measure before paint — an overscan-only first frame would flash — and
  // re-measure whenever the scrollport or the window resizes, so the window is
  // never stale before the next scroll event. ResizeObserver is guarded (jsdom
  // has none) and catches container resizes such as `maxHeight` edits or card
  // layout. Both listeners detach on unmount or when virtual turns off.
  useLayoutEffect(() => {
    if (!virtual) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const measure = () => setViewportHeight(scroller.clientHeight);
    measure();
    window.addEventListener('resize', measure);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(scroller);
    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, [virtual]);
  // Scrollport bound is a prop, not CSS: omitted → the 70vh default, any CSS
  // height wins, explicit `undefined` means "no table cap" (the embedding
  // layout sizes the scrollport). Key presence is checked because a
  // destructuring default would swallow an explicit undefined.
  const scrollMaxHeight = 'maxHeight' in props ? props.maxHeight : DEFAULT_VIRTUAL_MAX_HEIGHT;

  if (status === 'empty') {
    return (
      <div className={styles.state} role="status">
        Không có dữ liệu
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className={styles.state} role="alert">
        <span>Lỗi tải dữ liệu</span>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      </div>
    );
  }
  if (status === 'loading') {
    return (
      <div className={styles.state} role="status" aria-busy="true">
        Đang tải…
      </div>
    );
  }

  const selectable = selectedKeys !== undefined && onSelect !== undefined;
  const selected: string[] = selectedKeys ?? [];
  const keyOf = (row: T, index: number): string => {
    if (rowKey) return rowKey(row);
    const fields = row as Record<string, unknown>;
    const raw: unknown = fields['key'] ?? fields['code'] ?? fields['id'];
    if (typeof raw === 'string' || typeof raw === 'number') return String(raw);
    return String(index);
  };
  const allKeys = data.map((r, i) => keyOf(r, i));
  const selectedCount = allKeys.filter((k) => selected.includes(k)).length;
  const allSelected = selectable && data.length > 0 && selectedCount === data.length;
  const someSelected = selectedCount > 0 && selectedCount < allKeys.length;

  // Select-all is page-scoped and merges: it unions the current page's keys
  // with what is already selected, and unchecking removes only this page's
  // keys — a selection made on another page survives. Row toggles behave the
  // same way, so both paths keep the selection set global.
  const toggleAll = () => {
    if (!onSelect) return;
    const next = new Set(selected);
    for (const k of allKeys) {
      if (allSelected) next.delete(k);
      else next.add(k);
    }
    onSelect(Array.from(next));
  };
  const toggleOne = (k: string) => {
    if (!onSelect) return;
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelect(Array.from(next));
  };

  const colCount = columns.length + (selectable ? 1 : 0);

  const gridTemplateColumns = gridTemplateOf(columns, selectable);
  const pinOffsets = pinOffsetsOf(columns);
  // Sticky class + inline cumulative offset: the class (`.pinL`/`.pinR`) owns
  // `position: sticky` and the stacking, the inline style owns the offset —
  // same pair on header and body cells, so every row path (plain, virtual,
  // and the ones later tasks add) pins identically.
  const pinClass = (c: Column<T>): string =>
    c.pinned === 'left' ? styles.pinL : c.pinned === 'right' ? styles.pinR : '';
  const pinStyle = (c: Column<T>): { left: string } | { right: string } | undefined => {
    if (c.pinned === 'left') return { left: `${pinOffsets.left.get(c.key) ?? 0}px` };
    if (c.pinned === 'right') return { right: `${pinOffsets.right.get(c.key) ?? 0}px` };
    return undefined;
  };

  // Window over the rows when virtual; without it `win` covers every row, so
  // both modes share one render path. The slice index `i` stays local so
  // Task 6/7 can count group headers/detail rows in the same window math.
  const win = virtual
    ? computeWindow(scrollTop, viewportHeight, rowHeight, data.length, overscan)
    : { start: 0, end: data.length, offsetY: 0 };
  const body = data.slice(win.start, win.end).map((row, i) => {
    const k = allKeys[win.start + i];
    const isSelected = selected.includes(k);
    return (
      <div
        key={k}
        className={virtual ? `${styles.row} ${styles.vrow}` : styles.row}
        role="row"
        data-selected={isSelected}
        style={
          virtual
            ? { gridTemplateColumns, top: win.offsetY + i * rowHeight, height: rowHeight }
            : { gridTemplateColumns }
        }
      >
        {selectable && (
          <div className={`${styles.c} ${styles.cellSelect}`} role="gridcell" data-align="center">
            <input
              type="checkbox"
              aria-label={`Chọn dòng ${k}`}
              className={styles.check}
              checked={isSelected}
              onChange={() => toggleOne(k)}
            />
          </div>
        )}
        {columns.map((c) => {
          const value: unknown = (row as Record<string, unknown>)[c.key];
          return (
            <div
              key={c.key}
              className={cx(styles.c, pinClass(c))}
              style={pinStyle(c)}
              role="gridcell"
              data-align={c.align ?? 'left'}
            >
              {c.render ? c.render(row) : value == null ? '' : String(value)}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className={styles.wrap}>
      <div
        className={styles.scroll}
        data-virtual={virtual}
        ref={scrollRef}
        onScroll={handleScroll}
        style={virtual ? { maxHeight: scrollMaxHeight } : undefined}
      >
        <div
          className={styles.grid}
          role="grid"
          aria-rowcount={data.length + 1 + (showFilterRow ? 1 : 0) + (summary ? 1 : 0)}
          aria-colcount={colCount}
        >
          <div className={styles.head} role="row" style={{ gridTemplateColumns }}>
            {selectable && (
              <div
                className={`${styles.h} ${styles.cellSelect}`}
                role="columnheader"
                data-align="center"
              >
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  className={styles.check}
                  checked={allSelected === true}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                />
              </div>
            )}
            {columns.map((c) => {
              if (!c.sortable) {
                return (
                  <div
                    key={c.key}
                    className={cx(styles.h, pinClass(c))}
                    style={pinStyle(c)}
                    role="columnheader"
                    data-align={c.align ?? 'left'}
                  >
                    <span>{c.title}</span>
                  </div>
                );
              }
              const entry = sorts.find((s) => s.key === c.key);
              const ariaSort = entry ? (entry.dir === 'asc' ? 'ascending' : 'descending') : 'none';
              // none → asc → desc → none, for this column only.
              const cycled = (): SortEntry | undefined => {
                if (!entry) return { key: c.key, dir: 'asc' };
                if (entry.dir === 'asc') return { key: c.key, dir: 'desc' };
                return undefined;
              };
              const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
                if (!onSort) return;
                const nextEntry = cycled();
                if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
                  // Plain click resets the array to just this column's rule
                  // (empty when the rule was just removed).
                  onSort(nextEntry ? [nextEntry] : []);
                  return;
                }
                // Shift/Ctrl/Meta edits this column's entry in place, keeping
                // every other entry and its priority order untouched.
                const index = sorts.findIndex((s) => s.key === c.key);
                const next = [...sorts];
                if (nextEntry) {
                  if (index === -1) next.push(nextEntry);
                  else next[index] = nextEntry;
                } else if (index !== -1) {
                  next.splice(index, 1);
                }
                onSort(next);
              };
              return (
                <div
                  key={c.key}
                  role="columnheader"
                  aria-sort={ariaSort}
                  className={cx(styles.h, pinClass(c))}
                  style={pinStyle(c)}
                  data-align={c.align ?? 'left'}
                >
                  <button type="button" onClick={handleClick} className={styles.sortBtn}>
                    <span>{c.title}</span>
                    <span aria-hidden="true" className={styles.arrow}>
                      {!entry ? '↕' : entry.dir === 'asc' ? '↑' : '↓'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          {showFilterRow && (
            // One row directly under the header, on the same shared grid
            // template as every other row path — so tracks, pins, and the
            // horizontal scroll stay aligned. It lives outside the virtual
            // spacer (always visible while the body windows) and scrolls
            // beneath the sticky header. Presentational: each edit just calls
            // `onColumnFilter`; filtering `data` stays the caller's job.
            <div className={styles.filterRow} role="row" style={{ gridTemplateColumns }}>
              {selectable && <div className={cx(styles.c, styles.cellSelect)} role="gridcell" />}
              {columns.map((c) => {
                const cellClass = cx(styles.c, pinClass(c));
                const cellStyle = pinStyle(c);
                // A column without a filter still needs its cell, or every
                // later control would shift a track left and drift from the
                // header/body rows above and below.
                if (!c.filterable) {
                  return (
                    <div key={c.key} className={cellClass} style={cellStyle} role="gridcell" />
                  );
                }
                const value = columnFilters?.[c.key] ?? '';
                const ariaLabel = `Lọc ${c.title}`;
                const commit = (next: string) => onColumnFilter?.(c.key, next);
                const filterType = c.filterType ?? 'text';
                return (
                  <div key={c.key} className={cellClass} style={cellStyle} role="gridcell">
                    {filterType === 'select' ? (
                      <Select
                        size="sm"
                        aria-label={ariaLabel}
                        className={styles.filterCtl}
                        value={value}
                        onChange={(event) => commit(event.target.value)}
                      >
                        <option value="">{FILTER_ALL_LABEL}</option>
                        {(c.filterOptions ?? []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        size="sm"
                        type={filterType}
                        aria-label={ariaLabel}
                        className={styles.filterCtl}
                        value={value}
                        onChange={(event) => commit(event.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {virtual ? (
            // The spacer owns the full scroll height (contentHeight) while
            // only the window is in the DOM; rows sit absolute inside it at
            // their pixel offset. `presentation` keeps the rows owned by the
            // grid for assistive tech.
            <div
              className={styles.spacer}
              role="presentation"
              style={{ height: contentHeight(data.length, rowHeight) }}
            >
              {body}
            </div>
          ) : (
            body
          )}
          {summary && (
            <div className={styles.foot} role="row">
              <span className={styles.footText} role="gridcell" aria-colspan={colCount}>
                {summary}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
