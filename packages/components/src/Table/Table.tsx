import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
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

/** Fixed width of one leading control track (select checkbox / expand toggle). */
const CONTROL_TRACK = 36;

/** Gap between mobile cards — mirrored inside virtual card slots (finding #13). */
const CARD_GAP = 8;

/** Fallback drag-start width when the header cell cannot be measured (jsdom reports 0). */
const UNMEASURED_FALLBACK_WIDTH = 120;

/** Keyboard step for resize handles (×4 with Shift). */
const KEYBOARD_STEP = 8;

/** Clearance kept between a revealed resize handle and the cover it clears. */
const REVEAL_MARGIN = 4;

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
 * body, virtual, and the filter/group/detail rows. Widths come from
 * `widthOf` (live `columnWidths` override wins over `Column.width`), the one
 * source shared with the pin offsets so a resize can never drift one without
 * the other: a live override is an exact px track even on regular columns
 * (otherwise dragging a flexible column would visually do nothing), while the
 * declared `Column.width` alone stays a `minmax` floor preserving the
 * pre-resize model.
 */
/**
 * Live width for a column plus whether it comes from a live caller override.
 * Unknown keys (including prototype shadows like `toString`) and non-finite
 * values count as unset and fall back to the declared `Column.width`; the
 * final value floors at 1px so neither path can collapse a track (N3).
 * `trackOf` keys exactness off `isOverride` — the same predicate — so an
 * unset-looking value can never take the exact branch (N4).
 */
function widthOf<T>(
  column: Column<T>,
  columnWidths: Record<string, number> | undefined,
): { value: number; isOverride: boolean } | undefined {
  const owned =
    columnWidths != null && Object.prototype.hasOwnProperty.call(columnWidths, column.key)
      ? columnWidths[column.key]
      : undefined;
  const isOverride = typeof owned === 'number' && Number.isFinite(owned);
  const raw = isOverride ? (owned as number) : column.width;
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return undefined;
  return { value: Math.max(1, raw), isOverride };
}

function effectiveWidthOf<T>(
  column: Column<T>,
  columnWidths: Record<string, number> | undefined,
): number | undefined {
  return widthOf(column, columnWidths)?.value;
}

function trackOf<T>(column: Column<T>, columnWidths: Record<string, number> | undefined): string {
  const resolved = widthOf(column, columnWidths);
  const effective = resolved?.value;
  // A live override is an exact px track — even on regular columns. A mere
  // `minmax` floor would let `1fr` absorb the drag, so resizing a flexible
  // column would visually do nothing (blocking finding 1). The declared
  // `Column.width` alone stays a floor, preserving the pre-resize model.
  if (resolved?.isOverride) return `${effective as number}px`;
  if (column.pinned && effective != null) return `${effective}px`;
  const min = effective != null ? `${effective}px` : 'var(--cell-min-width)';
  return `minmax(${min}, 1fr)`;
}

/**
 * Bring a resize handle out from under a stuck cover (review S1/S2).
 *
 * `scrollIntoView({inline:'nearest'})` cannot do this job: a handle that
 * slides beneath a sticky or pinned neighbor is still geometrically inside
 * the scrollport — the cover paints over it, it never pushes it out — so
 * `nearest` finds nothing to scroll, and on the boundary it aligns the strip
 * flush with the scrollport edge, exactly the band an edge cover hugs.
 * Hit-test the handle's center instead: when a cell of this grid paints over
 * it, scroll the port just enough to clear that cover's edge.
 */
function revealHandle(handle: HTMLElement): void {
  const scroll = handle.closest<HTMLElement>(`.${styles.scroll}`);
  if (!scroll) return;
  const rect = handle.getBoundingClientRect();
  const hit =
    typeof document.elementFromPoint === 'function'
      ? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      : null;
  if (hit == null || hit === scroll || !scroll.contains(hit)) {
    // No hit-testing at all (jsdom) or the center resolves off the scroll
    // region's subtree: the strip is out of view geometrically — leave the
    // platform's nearest-edge scroll to it.
    handle.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    return;
  }
  if (hit === handle || handle.contains(hit)) return;
  const cover =
    hit.closest<HTMLElement>('[role="gridcell"], [role="columnheader"], [role="rowheader"]') ?? hit;
  if (cover.contains(handle)) return;
  const coverRect = cover.getBoundingClientRect();
  if (coverRect.left <= rect.left) {
    // A cover hugging the left side: scroll left until the strip rides clear
    // of its right edge.
    scroll.scrollLeft -= coverRect.right + REVEAL_MARGIN - rect.left;
  } else {
    // Mirror case — a right-side cover: scroll right until the strip clears
    // its left edge.
    scroll.scrollLeft += rect.right + REVEAL_MARGIN - coverRect.left;
  }
}

function gridTemplateOf<T>(
  columns: Column<T>[],
  selectable: boolean,
  expandable: boolean,
  columnWidths: Record<string, number> | undefined,
): string {
  const tracks = columns.map((c) => trackOf(c, columnWidths));
  // Fixed CONTROL_TRACK-wide control tracks come first: select, then the master-detail
  // toggle, then every data column — one template shared by the header,
  // filter, body, group and detail rows.
  const controls = [
    ...(selectable ? [`${CONTROL_TRACK}px`] : []),
    ...(expandable ? [`${CONTROL_TRACK}px`] : []),
  ];
  return [...controls, ...tracks].join(' ');
}

/**
 * Cumulative sticky offsets in px: a left-pinned column sticks at the summed
 * `width`s of the pinned columns before it, a right-pinned column at the
 * summed `width`s of the pinned columns after it (accumulated right-to-left),
 * so neighbouring pins never overlap. `leadingControlWidth` is the summed
 * width of the fixed control tracks (`CONTROL_TRACK` each) that
 * `gridTemplateOf` prepends — left accumulation starts past them, or the
 * first pinned data cell paints over the checkboxes. The stylesheet cannot
 * know these sums, which is why each cell gets its offset inline.
 */
function pinOffsetsOf<T>(
  columns: Column<T>[],
  leadingControlWidth = 0,
  columnWidths: Record<string, number> | undefined = undefined,
): {
  left: Map<string, number>;
  right: Map<string, number>;
} {
  const left = new Map<string, number>();
  const right = new Map<string, number>();
  // Left accumulation starts past the fixed CONTROL_TRACK control tracks (select,
  // then expand) that `gridTemplateOf` prepends — a pinned data cell at
  // inline `left:0` would otherwise paint over the checkbox cells.
  let acc = leadingControlWidth;
  for (const column of columns) {
    if (column.pinned !== 'left') continue;
    left.set(column.key, acc);
    acc += effectiveWidthOf(column, columnWidths) ?? 0;
  }
  acc = 0;
  for (let i = columns.length - 1; i >= 0; i -= 1) {
    const column = columns[i];
    if (column.pinned !== 'right') continue;
    right.set(column.key, acc);
    acc += effectiveWidthOf(column, columnWidths) ?? 0;
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
    columnWidths,
    onColumnWidth,
    onColumnWidthReset,
    resizable = false,
    minColumnWidth = 40,
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
  // `status` and `isMobileView` are deps without being read: every scrollport
  // remount (loading→idle flip) must re-run measure+observe on the fresh node
  // and drop the stale scroll offset — otherwise a table that mounts its grid
  // after an async load renders only overscan rows in a blank viewport until
  // the first scroll event. A breakpoint cross REUSES the same `.scroll` DOM
  // node across branches, so the reset syncs the DOM offset too, not just the
  // React state (follow-up finding 2).
  useLayoutEffect(() => {
    if (!virtual) return;
    const scroller = scrollRef.current;
    if (!scroller) return;
    const measure = () => setViewportHeight(scroller.clientHeight);
    measure();
    scroller.scrollTop = 0;
    setScrollTop(0);
    window.addEventListener('resize', measure);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(scroller);
    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, [virtual, status, isMobileView]);
  // Scrollport bound is a prop, not CSS: omitted → the 70vh default, any CSS
  // height wins, explicit `undefined` means "no table cap" (the embedding
  // layout sizes the scrollport). Key presence is checked because a
  // destructuring default would swallow an explicit undefined.
  const scrollMaxHeight = 'maxHeight' in props ? props.maxHeight : DEFAULT_VIRTUAL_MAX_HEIGHT;

  // Footer bar (spec §4.10): summary + Pagination + export. It is table-level
  // chrome, not a row affordance, so it is built once — before the status
  // early-returns — for every branch: grid, cards, and the settled empty /
  // error states. `Pagination` owns the out-of-range clamp and calls `onPage`
  // back with the clamped page, so no slice math lives here — the table stays
  // presentational. When the bar exists the in-grid summary row steps aside
  // (one summary, never two); without bar props P1's sticky grid-footer row
  // is untouched. A caller deriving `status` from an empty page slice still
  // gets the pager (and its clamp report-back) in the empty state to
  // navigate away.
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

  // Shared footer for the settled states (finding #10): empty/error render
  // it through this helper instead of each branch hand-threading
  // `{footerBar}`. Card/grid branches render `{footerBar}` directly
  // (identical DOM — the fragment here adds no node). Loading stays
  // chrome-free by an explicit omission in its branch below.
  const withFooter = (content: ReactNode) => (
    <>
      {content}
      {footerBar}
    </>
  );

  // Live drag state lives in a ref (not state): drags report straight to the
  // caller without re-rendering the grid per pixel. `minWidth` floors
  // itself at 1px so a caller-passed 0 cannot produce zero-width columns.
  const minWidth = Math.max(1, minColumnWidth);
  const resizeDrag = useRef<{
    key: string;
    pointerId: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  const resizeCleanup = useRef<(() => void) | null>(null);
  // Window listeners belong to the drag, not the component lifetime: a
  // second unmount-guard drops a mid-drag listener pair if the table
  // unmounts before release (no leak, no report to a dead caller).
  useEffect(() => {
    return () => {
      resizeCleanup.current?.();
      resizeCleanup.current = null;
      resizeDrag.current = null;
    };
  }, []);
  // Post-commit reveal (S2): a keyboard step reports a width, and only the
  // caller's re-render gives the strip its new geometry — measuring inline in
  // the handler would read the old template. Focus never re-fires for the
  // surviving span, so a step hands its handle to the next commit.
  const revealAfterRender = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const handle = revealAfterRender.current;
    if (!handle) return;
    revealAfterRender.current = null;
    revealHandle(handle);
  });
  // Drag-start width prefers the measured header cell (flexible columns have
  // no declared width to start from); jsdom measures 0, so fall back to the
  // effective width, then a constant.
  const resolveStartWidth = (column: Column<T>, handle: HTMLElement | null): number => {
    const measured = handle?.closest('[role="columnheader"]')?.getBoundingClientRect().width;
    if (measured != null && measured > 0) return Math.round(measured);
    return effectiveWidthOf(column, columnWidths) ?? UNMEASURED_FALLBACK_WIDTH;
  };
  const reportWidth = (key: string, width: number): void => {
    onColumnWidth?.(key, Math.max(minWidth, Math.round(width)));
  };
  const beginResize = (column: Column<T>) => (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!onColumnWidth) return;
    // Only the primary button starts a drag (right/middle would resize behind
    // the context menu). A pointerdown always closes a stale drag first
    // (self-healing, P2): ignoring it instead would deadlock touch, whose
    // pointerIds increment - a lost pointerup would leave the table
    // unresizable until unmount.
    if (event.button !== 0) return;
    resizeCleanup.current?.();
    event.preventDefault();
    // Focus the handle: preventDefault above suppresses click-focus, which
    // would otherwise leave keyboard controls dead after any mouse use.
    event.currentTarget.focus();
    // Pointer capture keeps the move stream coming to the handle even when the
    // cursor leaves the window; guarded for engines without it (the window
    // listeners below are the fallback).
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      /* ignore - window listeners below are the fallback */
    }
    const startWidth = resolveStartWidth(column, event.currentTarget);
    resizeDrag.current = {
      key: column.key,
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth,
    };
    // Listeners ride on window so releasing outside the grid still ends the
    // drag — `pointercancel` (touch takeover, browser gesture) ends it the
    // same way, or the next window move would report a stale drag. All three
    // detach on release; the unmount guard above covers table teardown.
    const move = (e: PointerEvent): void => {
      // Only the dragging pointer drives the drag: a second finger's moves
      // must neither report the first column nor end its drag (N6). A primary
      // move with no button held still ends it (lost pointerup, finding 2).
      const drag = resizeDrag.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      if (e.buttons === 0) {
        end();
        return;
      }
      reportWidth(drag.key, drag.startWidth + (e.clientX - drag.startX));
    };
    const end = (e?: PointerEvent): void => {
      // A second pointer's release must not end the first pointer's drag.
      if (e && resizeDrag.current && e.pointerId !== resizeDrag.current.pointerId) return;
      resizeDrag.current = null;
      resizeCleanup.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    resizeCleanup.current = end;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };
  const stepResize = (
    column: Column<T>,
    direction: 1 | -1,
    large: boolean,
    handle: HTMLElement | null,
  ): void => {
    if (!onColumnWidth) return;
    // Keyboard steps from the same measured-or-effective start as drags (the
    // keydown target IS the handle), so the first Arrow press continues the
    // rendered edge instead of jumping from a stale declaration.
    const current = resolveStartWidth(column, handle);
    reportWidth(column.key, current + direction * KEYBOARD_STEP * (large ? 4 : 1));
    // The strip can end up under a stuck cover once the new track renders;
    // hand it to the post-commit reveal (S2).
    if (handle) revealAfterRender.current = handle;
  };
  // One wiring point for the data-column resize handles (never on the select
  // / expand control tracks): drag + keyboard + double-click reset. A handle
  // that cannot report (no `onColumnWidth`) does not render at all — a
  // dead affordance is worse than none.
  const renderResizeHandle = (column: Column<T>): ReactNode => {
    if (!resizable || !onColumnWidth) return null;
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        aria-label={`Đổi rộng cột ${column.title}`}
        tabIndex={0}
        className={styles.resizeHandle}
        onPointerDown={beginResize(column)}
        onFocus={(event) => {
          // A focused handle must not stay an invisible tab stop under a
          // stuck cover (S1): reveal hit-tests the center instead of trusting
          // geometry the cover does not move.
          revealHandle(event.currentTarget);
        }}
        onKeyDown={(event: ReactKeyboardEvent<HTMLSpanElement>) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            stepResize(
              column,
              event.key === 'ArrowRight' ? 1 : -1,
              event.shiftKey,
              event.currentTarget,
            );
          } else if (event.key === 'Delete' || event.key === 'Backspace') {
            // Keyboard-only users get the reset too (double-click equivalent).
            event.preventDefault();
            onColumnWidthReset?.(column.key);
          }
        }}
        onDoubleClick={() => onColumnWidthReset?.(column.key)}
      />
    );
  };

  if (status === 'empty') {
    return (
      // Same `.wrap` card as the grid/cards branches (finding #4): the pager
      // and export keep their border/radius and sticky context instead of
      // rendering as a bare sibling below the state box.
      <div className={styles.wrap}>
        {withFooter(
          <div className={styles.state} role="status">
            Không có dữ liệu
          </div>,
        )}
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className={styles.wrap}>
        {withFooter(
          <div className={styles.state} role="alert">
            <span>Lỗi tải dữ liệu</span>
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Thử lại
            </Button>
          </div>,
        )}
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
  // Heights mirror the windowing.ts clamps (<= 0 → 1px): the pixel offsets
  // below must agree with the rendered heights, or rows stack at top:0 with
  // zero scroll range and the first rows become unreachable (finding #14).
  const safeRowHeight = rowHeight <= 0 ? 1 : rowHeight;
  const safeDetailHeight = Math.max(1, Math.round(expandedHeight ?? safeRowHeight * 2.5));
  const safeCardHeight = Math.max(1, Math.round(cardHeight ?? safeRowHeight * 2.5));
  const expanded = new Set(expandedKeys);

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
      ? computeWindow(scrollTop, viewportHeight, safeCardHeight, cards.length, overscan)
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
          // whole `safeCardHeight` slots, so each card is a gap shorter and
          // the CARD_GAP `.cards` gap lives inside the slot instead of vanishing
          // (finding #13). Floored at 1px: tiny `cardHeight` values must not
          // produce zero/negative boxes that overlap inside the stride.
          virtual
            ? {
                height: Math.max(1, safeCardHeight - CARD_GAP),
                top: cardWin.offsetY + i * safeCardHeight,
              }
            : { minHeight: safeCardHeight }
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
                style={{ height: contentHeight(cards.length, safeCardHeight) }}
              >
                {cardNodes}
              </div>
            ) : (
              cardNodes
            )}
          </div>
        </div>
        {summary && !hasFooterBar && (
          // Card mode has no grid footer row: without a footer bar the
          // summary would vanish on mobile entirely (finding #8).
          <div className={styles.foot}>
            <span className={styles.footText}>{summary}</span>
          </div>
        )}
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

  const gridTemplateColumns = gridTemplateOf(columns, selectable, expandable, columnWidths);
  // Declared pins per side: the grid advertises them so the stylesheet can
  // scope P1's unconditional first/last stickiness away from conflicting
  // edges (finding #6) — and the leading control cells pin explicitly at
  // their own offsets instead of relying on the first-child default.
  const hasLeftPin = columns.some((c) => c.pinned === 'left');
  const hasRightPin = columns.some((c) => c.pinned === 'right');
  const pinOffsets = pinOffsetsOf(
    columns,
    (selectable ? CONTROL_TRACK : 0) + (expandable ? CONTROL_TRACK : 0),
    columnWidths,
  );
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
  // Cells of a live-override column render exact px tracks, so their
  // `--cell-min-width` floor must stand down exactly like pinned cells -
  // otherwise a 40px track keeps 120px boxes that overlap the next column
  // (leftover N5). Same `isOverride` predicate as `trackOf`, never a second
  // opinion about which columns are exact.
  const exactClassOf = (c: Column<T>): string =>
    widthOf(c, columnWidths)?.isOverride ? styles.exact : '';

  // One wiring point for the six leading-control cells (header/body/filter
  // × select/expand, finding #9): explicit left pin at the track offset
  // while left pins exist, P1 first-child default otherwise. `base` is
  // styles.h for header cells, styles.c everywhere else.
  const controlCellProps = (base: string, track: number) => ({
    className: cx(base, styles.cellSelect, hasLeftPin ? styles.pinL : ''),
    style: hasLeftPin ? { left: `${track * CONTROL_TRACK}px` } : undefined,
  });

  // One props point for the two data-header branches (N11): template class,
  // pin pair, clean accessible name (the handle label must not merge into
  // it), and the handle-host marker that keeps the cell positioned under the
  // pin stand-down.
  const headerCellProps = (c: Column<T>, handle: ReactNode) => ({
    className: cx(styles.h, pinClass(c), exactClassOf(c), handle ? styles.handleHost : ''),
    style: pinStyle(c),
    ...(typeof c.title === 'string' ? { 'aria-label': c.title } : {}),
  });

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
    contentTotal += item.kind === 'detail' ? safeDetailHeight : safeRowHeight;
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
    const absoluteIndex = win.start + i;
    const top = offsets[absoluteIndex];
    // Zebra + screen-reader position follow the absolute index, never the
    // window: scrolling must not flip stripes (finding #10) nor misreport
    // the row number (finding #11). Rows are 1-based after the header (+1
    // more while the filter row shows).
    const stripe = absoluteIndex % 2 === 0;
    const rowIndex =
      virtual && showFilterRow ? absoluteIndex + 3 : virtual ? absoluteIndex + 2 : undefined;
    if (item.kind === 'group') {
      const { group } = item;
      const isCollapsed = collapsed.has(group.key);
      return (
        <div
          key={item.key}
          className={virtual ? `${styles.groupRow} ${styles.vrow}` : styles.groupRow}
          role="row"
          aria-rowindex={rowIndex}
          style={
            virtual ? { gridTemplateColumns, top, height: safeRowHeight } : { gridTemplateColumns }
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
          aria-rowindex={rowIndex}
          style={
            virtual
              ? { gridTemplateColumns, top, height: safeDetailHeight }
              : { gridTemplateColumns, height: safeDetailHeight }
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
        data-stripe={stripe}
        aria-rowindex={rowIndex}
        style={
          virtual ? { gridTemplateColumns, top, height: safeRowHeight } : { gridTemplateColumns }
        }
      >
        {selectable && (
          <div {...controlCellProps(styles.c, 0)} role="gridcell" data-align="center">
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
          // checkbox: same CONTROL_TRACK control track, `aria-expanded` mirrors the
          // controlled `expandedKeys`.
          <div
            {...controlCellProps(styles.c, selectable ? 1 : 0)}
            role="gridcell"
            data-align="center"
          >
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
              className={cx(styles.c, pinClass(c), exactClassOf(c))}
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
          data-left-pins={hasLeftPin || undefined}
          data-right-pins={hasRightPin || undefined}
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
              <div {...controlCellProps(styles.h, 0)} role="columnheader" data-align="center">
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
                {...controlCellProps(styles.h, selectable ? 1 : 0)}
                role="columnheader"
                data-align="center"
              />
            )}
            {columns.map((c) => {
              // The handle's label would otherwise merge into the header's
              const resizeHandle = renderResizeHandle(c);
              if (!c.sortable) {
                return (
                  <div
                    key={c.key}
                    {...headerCellProps(c, resizeHandle)}
                    role="columnheader"
                    data-align={c.align ?? 'left'}
                  >
                    <span>{c.title}</span>
                    {resizeHandle}
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
                  {...headerCellProps(c, resizeHandle)}
                  data-align={c.align ?? 'left'}
                >
                  <button type="button" onClick={handleClick} className={styles.sortBtn}>
                    <span>{c.title}</span>
                    <span aria-hidden="true" className={styles.arrow}>
                      {!entry ? '↕' : entry.dir === 'asc' ? '↑' : '↓'}
                    </span>
                  </button>
                  {resizeHandle}
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
              {selectable && <div {...controlCellProps(styles.c, 0)} role="gridcell" />}
              {expandable && (
                <div {...controlCellProps(styles.c, selectable ? 1 : 0)} role="gridcell" />
              )}
              {columns.map((c) => {
                const cellClass = cx(styles.c, pinClass(c), exactClassOf(c));
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
