import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type UIEvent,
} from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { toCSV } from '../internal/exportCsv';
import { buildGroups, type Group } from '../internal/gridLogic';
import { Pagination } from '../Pagination/Pagination';
import { Select } from '../Select/Select';
import { useIsMobile } from '../internal/useIsMobile';
import { computeWindow, contentHeight } from '../internal/windowing';
import styles from './Table.module.css';
import type { Column, SortEntry, TableProps } from './types';

/** Scrollport cap applied when `maxHeight` is omitted in virtual mode. */
const DEFAULT_VIRTUAL_MAX_HEIGHT = '70vh';

/** Blank choice at the top of a select filter cell — clears the filter. */
const FILTER_ALL_LABEL = 'Tất cả';

const cx = (...parts: string[]): string => parts.filter(Boolean).join(' ');

/**
 * One windowable body item: a data row, a group header — which is a full
 * `role=row` of its own (toggle + label + count + summary) and therefore
 * counts as exactly one row of the window math, per the ledger ruling — or an
 * expanded detail row, which likewise renders as one `role=row` but occupies
 * `expandedHeight` pixels instead of `rowHeight`. Group headers and rows cost
 * `rowHeight` px each; details cost `expandedHeight` px — heights are no
 * longer uniform once a row is expanded, which is why the offsets below are
 * built here rather than through the fixed-height `windowing` helpers.
 */
type BodyItem<T> =
  | { kind: 'row'; key: string; row: T }
  | { kind: 'group'; key: string; group: Group<T> }
  | { kind: 'detail'; key: string; row: T };

/**
 * First index in `offsets` (strictly ascending px, one sentinel entry past
 * the last item) whose offset exceeds `value` — an upper-bound binary search,
 * so scrolling costs O(log n) whatever the row count.
 */
function firstOffsetAfter(offsets: number[], value: number): number {
  let lo = 0;
  let hi = offsets.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (offsets[mid] > value) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/**
 * Variable-height sibling of `computeWindow` (windowing.ts stays fixed-height
 * and pure per the ledger ruling; this mapping is owned locally by Table).
 * `offsets[i]` is the px start of item `i` and `offsets[n]` the total height,
 * so a window [start, end) spans `overscan` items around the viewport in px,
 * not in uniform row steps — an expanded detail shifts everything after it by
 * `expandedHeight` and the offsets follow. On uniform rows this reduces to
 * exactly `computeWindow`'s floor/ceil math.
 */
function variableWindow(
  offsets: number[],
  scrollTop: number,
  viewportHeight: number,
  overscan: number,
): { start: number; end: number; offsetY: number } {
  const total = offsets.length - 1;
  // Last item starting at or before the viewport top, minus the overscan pad…
  const start = Math.max(0, firstOffsetAfter(offsets, scrollTop) - 1 - overscan);
  // …first item still starting below the viewport bottom (mirrors
  // `ceil((top + height) / row)`) plus the same pad, capped at the content.
  const end = Math.min(
    total,
    Math.max(start, firstOffsetAfter(offsets, scrollTop + viewportHeight - 1) + overscan),
  );
  return { start, end, offsetY: offsets[Math.min(start, total)] };
}

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

function gridTemplateOf<T>(columns: Column<T>[], selectable: boolean, expandable: boolean): string {
  const tracks = columns.map(trackOf);
  // Fixed 36px control tracks come first: select, then the master-detail
  // toggle, then every data column — one template shared by the header,
  // filter, body, group and detail rows.
  const controls = [...(selectable ? ['36px'] : []), ...(expandable ? ['36px'] : [])];
  return [...controls, ...tracks].join(' ');
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
    groupBy = [],
    collapsedGroups = [],
    onToggleGroup,
    renderGroupSummary,
    renderExpanded,
    expandedKeys = [],
    onToggleExpand,
    expandedHeight,
    renderCard,
    cardHeight,
    pagination,
    exportable = false,
    exportFileName,
    onExport,
  } = props;
  // Breakpoint state lives with the windowing state above the status
  // early-returns so the hook order is identical whatever `status` says.
  const isMobileView = useIsMobile();
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

  // Master-detail opt-in hinges on `renderExpanded` alone: it both adds the
  // toggle column and renders the detail content. Heights are fixed px
  // defaults per spec §4.6/§4.7 — never measured at runtime, because the
  // virtual window budgets them ahead of paint.
  const expandable = renderExpanded !== undefined;
  const detailHeight = Math.round(expandedHeight ?? rowHeight * 2.5);
  const cardItemHeight = Math.round(cardHeight ?? rowHeight * 2.5);
  const expanded = new Set(expandedKeys);

  // Footer bar (spec §4.10): summary + Pagination + export, built once for
  // both render branches (cards get it too — it is table-level chrome, not a
  // row affordance). `Pagination` owns the out-of-range clamp and calls
  // `onPage` back with the clamped page, so no slice math lives here — the
  // table stays presentational. When the bar exists the in-grid summary row
  // steps aside (one summary, never two); without bar props P1's sticky
  // grid-footer row is untouched. Status early-returns above keep it out of
  // loading/empty/error states, same as the grid itself.
  const hasFooterBar = pagination !== undefined || exportable;
  const handleExport = () => {
    if (onExport) {
      onExport(data, columns);
      return;
    }
    // Default: BOM CSV of the visible rows/columns (already filtered/sorted
    // by the caller) downloaded through a Blob anchor. The anchor goes into
    // the document before the click — detached-anchor clicks race some
    // browsers — and the object URL is revoked 100ms after the click, not
    // synchronously, so the download is not cut off while it resolves.
    const blob = new Blob([toCSV(data, columns)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = exportFileName ?? 'datagrid.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };
  const footerBar = hasFooterBar ? (
    <div className={styles.gridFoot}>
      {summary && <span className={styles.gridFootSummary}>{summary}</span>}
      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onPage}
        />
      )}
      {exportable && (
        <Button variant="secondary" size="sm" className={styles.exportBtn} onClick={handleExport}>
          Xuất CSV
        </Button>
      )}
    </div>
  ) : null;

  if (isMobileView) {
    // Below the breakpoint the grid is replaced by a list of `<article>`
    // cards — same scroll container, same windowing (uniform `cardHeight`
    // slots, so the fixed-height helper applies directly). Documented scope:
    // cards are READ-ONLY-FLAT — they render `data` as a flat list, so the
    // grid-only affordances (selection checkboxes, filter row, group
    // headers, the grid summary row) never reach this branch whatever props
    // are passed; filtering/sorting still apply through the caller's `data`.
    // Table-level chrome does come along: the footer bar (summary +
    // pagination + export) renders under the cards, and an expanded card
    // shows its `renderExpanded` content (key in `expandedKeys`). Fallback
    // card: first column is the title, the rest are `label: value` pairs,
    // plus the Chi tiết toggle when master-detail is on.
    const cards = data.map((row, i) => ({ key: allKeys[i], row }));
    const cardWin = virtual
      ? computeWindow(scrollTop, viewportHeight, cardItemHeight, cards.length, overscan)
      : { start: 0, end: cards.length, offsetY: 0 };
    const fallbackCard = (row: T, key: string): ReactNode => {
      const [titleColumn, ...fieldColumns] = columns;
      const valueOf = (c: Column<T>): ReactNode => {
        const raw: unknown = (row as Record<string, unknown>)[c.key];
        return c.render ? c.render(row) : raw == null ? '' : String(raw);
      };
      return (
        <>
          <div className={styles.cardTitle}>{titleColumn ? valueOf(titleColumn) : key}</div>
          <dl className={styles.cardFields}>
            {fieldColumns.map((c) => (
              <Fragment key={c.key}>
                <dt>{c.title}</dt>
                <dd>{valueOf(c)}</dd>
              </Fragment>
            ))}
          </dl>
          {expandable && (
            <button
              type="button"
              className={styles.cardAction}
              aria-expanded={expanded.has(key)}
              onClick={() => onToggleExpand?.(key)}
            >
              Chi tiết
            </button>
          )}
        </>
      );
    };
    const cardNodes = cards.slice(cardWin.start, cardWin.end).map((card, i) => (
      <article
        key={card.key}
        className={virtual ? `${styles.card} ${styles.vrow}` : styles.card}
        style={
          // Virtual cards sit in fixed slots — the window math offsets them by
          // `cardItemHeight` px, so the height must be exact. Non-virtual cards
          // are in normal flow: `cardHeight` is only a floor (min-height), and
          // a fixed height there would turn every card into a cramped scrollbox
          // (content scrolling inside an 80px slot).
          virtual
            ? { height: cardItemHeight, top: cardWin.offsetY + i * cardItemHeight }
            : { minHeight: cardItemHeight }
        }
      >
        {renderCard ? renderCard(card.row) : fallbackCard(card.row, card.key)}
        {renderExpanded && expanded.has(card.key) && (
          // Master-detail in card mode: the same detail content the grid's
          // detail row shows, inside the expanded card (the card's own
          // overflow scrolls it) — so Chi tiết is never a dead control.
          <div className={styles.cardDetail}>{renderExpanded(card.row)}</div>
        )}
      </article>
    ));
    return (
      <div className={styles.wrap}>
        <div
          className={styles.scroll}
          data-virtual={virtual}
          ref={scrollRef}
          onScroll={handleScroll}
          style={virtual ? { maxHeight: scrollMaxHeight } : undefined}
        >
          <div className={styles.cards}>
            {virtual ? (
              <div
                className={styles.spacer}
                role="presentation"
                style={{ height: contentHeight(cards.length, cardItemHeight) }}
              >
                {cardNodes}
              </div>
            ) : (
              cardNodes
            )}
          </div>
        </div>
        {footerBar}
      </div>
    );
  }

  const selectedCount = allKeys.filter((k) => selected.includes(k)).length;
  const allSelected = selectable && data.length > 0 && selectedCount === data.length;
  const someSelected = selectedCount > 0 && selectedCount < allKeys.length;

  // `keyOf` runs over the full `data` BEFORE grouping, so every position has
  // its precomputed key. Grouped rendering must reproduce plain mode's "one
  // distinct key per position" invariant even when the same object instance
  // sits at two positions (no key/code/id → plain mode stays distinct via the
  // index fallback). `buildGroups` buckets row references in input order, so
  // keys are queued per reference in `data` order and consumed once per
  // occurrence while the groups iterate — a repeated instance yields its own
  // key per position instead of collapsing to the last index. Note
  // `buildGroups` ignores its `rowKey` argument (`void rowKey` — it buckets
  // on groupBy field values and never re-derives keys); the precomputed-key
  // function is passed only for its spec §5 signature. `groupBy` empty → no
  // groups, plain body.
  const groups = buildGroups(data, groupBy, (_row, i) => allKeys[i]);
  const collapsed = new Set<string>(collapsedGroups);
  const keysByRow = new Map<T, string[]>();
  if (groups.length > 0) {
    data.forEach((row, i) => {
      const queue = keysByRow.get(row);
      if (queue) queue.push(allKeys[i]);
      else keysByRow.set(row, [allKeys[i]]);
    });
  }

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

  const colCount = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);

  const gridTemplateColumns = gridTemplateOf(columns, selectable, expandable);
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

  // Body items: with `groupBy` each group contributes one header row plus its
  // rows (the rows drop out while the group is collapsed); without it every
  // item is a data row — so plain, grouped, virtual and non-virtual bodies
  // share one render path.
  const visibleItems: BodyItem<T>[] =
    groups.length > 0
      ? groups.flatMap((group): BodyItem<T>[] => {
          const header: BodyItem<T> = { kind: 'group', key: `group:${group.key}`, group };
          if (collapsed.has(group.key)) return [header];
          return [
            header,
            ...group.rows.map((row) => ({
              kind: 'row' as const,
              // Queued once per `data` position above, consumed once here (a
              // reference belongs to exactly one group, in input order), so
              // the queue always has a key for this occurrence — no cast.
              key: keysByRow.get(row)?.shift() ?? '',
              row,
            })),
          ];
        })
      : data.map((row, i) => ({ kind: 'row' as const, key: allKeys[i], row }));

  // Master-detail: an expanded row is followed by its detail `role=row` in
  // the flat list, so the window slices rows and details together and a
  // collapsed group still hides its expanded rows' details with them.
  const items: BodyItem<T>[] = expandable
    ? visibleItems.flatMap((item): BodyItem<T>[] =>
        item.kind === 'row' && expanded.has(item.key)
          ? [item, { kind: 'detail', key: `detail:${item.key}`, row: item.row }]
          : [item],
      )
    : visibleItems;

  // Pixel start of every item (rows/group headers at `rowHeight`, details at
  // `expandedHeight`) plus one sentinel holding the total. The virtual spacer
  // is exactly that total and each windowed item sits at `offsets[index]` —
  // the variable-height mapping the ledger assigns to this task. Without
  // virtual the offsets stay unused; rendering every item keeps it simple.
  const offsets: number[] = [];
  let contentTotal = 0;
  for (const item of items) {
    offsets.push(contentTotal);
    contentTotal += item.kind === 'detail' ? detailHeight : rowHeight;
  }
  offsets.push(contentTotal);

  // Window over the items when virtual — a group header costs one row of
  // height, an expanded detail `expandedHeight` px — without it `win` covers
  // every item, so both modes share one render path.
  const win = virtual
    ? variableWindow(offsets, scrollTop, viewportHeight, overscan)
    : { start: 0, end: items.length, offsetY: 0 };
  const body = items.slice(win.start, win.end).map((item, i) => {
    // Absolute px start of this item — with uniform rows it equals
    // `win.offsetY + i * rowHeight`, with an expanded detail in the window
    // it follows the pixel offsets instead of the row count.
    const top = offsets[win.start + i];
    if (item.kind === 'group') {
      const { group } = item;
      const isCollapsed = collapsed.has(group.key);
      return (
        <div
          key={item.key}
          className={virtual ? `${styles.groupRow} ${styles.vrow}` : styles.groupRow}
          role="row"
          style={
            virtual ? { gridTemplateColumns, top, height: rowHeight } : { gridTemplateColumns }
          }
        >
          <div className={styles.groupCell} role="gridcell" aria-colspan={colCount}>
            <button
              type="button"
              className={styles.groupToggle}
              aria-label={`${isCollapsed ? 'Mở rộng' : 'Thu gọn'} ${group.label}`}
              aria-expanded={!isCollapsed}
              onClick={() => onToggleGroup?.(group.key)}
            >
              <span aria-hidden="true">{isCollapsed ? '▸' : '▾'}</span>
            </button>
            <span className={styles.groupLabel}>{group.label}</span>
            <span className={styles.groupCount}>({group.rows.length})</span>
            {renderGroupSummary && (
              <span className={styles.groupSummary}>
                {renderGroupSummary(group.key, group.rows)}
              </span>
            )}
          </div>
        </div>
      );
    }
    if (item.kind === 'detail') {
      // One `role=row` with a single full-colspan gridcell, at a fixed
      // `expandedHeight` px — in virtual mode that height is the row's whole
      // slot budget, so the offsets above never need to measure content.
      return (
        <div
          key={item.key}
          className={virtual ? `${styles.detail} ${styles.vrow}` : styles.detail}
          role="row"
          style={
            virtual
              ? { gridTemplateColumns, top, height: detailHeight }
              : { gridTemplateColumns, height: detailHeight }
          }
        >
          <div className={styles.detailCell} role="gridcell" aria-colspan={colCount}>
            {renderExpanded?.(item.row)}
          </div>
        </div>
      );
    }
    const { row, key: k } = item;
    const isSelected = selected.includes(k);
    const isExpanded = expanded.has(k);
    return (
      <div
        key={k}
        className={virtual ? `${styles.row} ${styles.vrow}` : styles.row}
        role="row"
        data-selected={isSelected}
        style={virtual ? { gridTemplateColumns, top, height: rowHeight } : { gridTemplateColumns }}
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
        {expandable && (
          // The master-detail toggle column sits first after the select
          // checkbox: same 36px control track, `aria-expanded` mirrors the
          // controlled `expandedKeys`.
          <div className={`${styles.c} ${styles.cellSelect}`} role="gridcell" data-align="center">
            <button
              type="button"
              className={styles.groupToggle}
              aria-label={`${isExpanded ? 'Thu gọn' : 'Mở rộng'} ${k}`}
              aria-expanded={isExpanded}
              onClick={() => onToggleExpand?.(k)}
            >
              <span aria-hidden="true">{isExpanded ? '▾' : '▸'}</span>
            </button>
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
          // Rows all count: data rows, group headers (each one row) and one
          // row per expanded detail — `items.length` tracks exactly what the
          // body renders, collapsed groups' rows excluded. The summary counts
          // only while it is a grid row; with a footer bar it lives there,
          // outside the grid.
          aria-rowcount={
            items.length + 1 + (showFilterRow ? 1 : 0) + (summary && !hasFooterBar ? 1 : 0)
          }
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
            {expandable && (
              // Toggle column header: an empty control track, mirroring the
              // select one, so every row below keeps its toggle first.
              <div
                className={`${styles.h} ${styles.cellSelect}`}
                role="columnheader"
                data-align="center"
              />
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
              {expandable && <div className={cx(styles.c, styles.cellSelect)} role="gridcell" />}
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
            // The spacer owns the full scroll height — the sum of every
            // item's own height (rows/group headers at rowHeight, details at
            // expandedHeight) — while only the window is in the DOM; rows sit
            // absolute inside it at their pixel offset. `presentation` keeps
            // the rows owned by the grid for assistive tech.
            <div className={styles.spacer} role="presentation" style={{ height: contentTotal }}>
              {body}
            </div>
          ) : (
            body
          )}
          {summary && !hasFooterBar && (
            <div className={styles.foot} role="row">
              <span className={styles.footText} role="gridcell" aria-colspan={colCount}>
                {summary}
              </span>
            </div>
          )}
        </div>
      </div>
      {footerBar}
    </div>
  );
}
