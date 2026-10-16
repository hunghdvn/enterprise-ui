import type { ReactNode } from 'react';

export type Status = 'idle' | 'loading' | 'empty' | 'error';

export type Align = 'left' | 'right' | 'center';

export type SortDir = 'asc' | 'desc';

export interface SortEntry {
  key: string;
  dir: 'asc' | 'desc';
}

/** One choice in a `filterType: 'select'` filter cell. */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Pagination state handed to the shared `Pagination` the table embeds in its
 * footer bar. `page` is 1-indexed and can arrive out of range (a filter
 * shrank `total`): `Pagination` clamps it to the valid range itself and
 * reports the clamped value back through `onPage`.
 */
export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  /** Receives the next 1-based page — already clamped to `[1, ceil(total/pageSize)]`. */
  onPage: (page: number) => void;
}

export interface Column<T> {
  key: string;
  title: string;
  align?: Align;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  /**
   * Pins the column to the left or right edge while the table scrolls
   * horizontally. The sticky offset accumulates: a left-pinned column sits at
   * the summed `width`s of the pinned columns before it, a right-pinned one
   * at the summed `width`s of the pinned columns after it.
   */
  pinned?: 'left' | 'right';
  /**
   * Track width in px. Required when `pinned` — the sticky offset and the px
   * track are computed from it, so a pinned column without a width cannot
   * line up. On a regular column it becomes the grid track's minimum
   * (`minmax(width, 1fr)`): the column never shrinks below it but still
   * flexes, keeping the horizontal scroll the pins exist for. A live
   * `columnWidths[key]` (resize) wins over this declared value AND makes the
   * track exact px instead of flexible.
   */
  width?: number;
  /**
   * Renders a filter control for this column in the filter row
   * (`showFilterRow`). The table only collects the string — applying it to
   * `data` is the caller's job (`applyColumnFilters` in `internal/gridLogic`).
   */
  filterable?: boolean;
  /** Control kind in the filter row. Default `'text'`. */
  filterType?: 'text' | 'select' | 'number' | 'date';
  /** Choices rendered by a `filterType: 'select'` filter cell. */
  filterOptions?: FilterOption[];
  /**
   * Declares how the column's values aggregate (spec §5 hint field): `sum` /
   * `avg` over numeric values, `count` over rows. Type-level hint only — the
   * table renders no aggregate today; callers use it to build `summary` or
   * `renderGroupSummary` output themselves.
   */
  aggregate?: 'sum' | 'avg' | 'count';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  /**
   * Ordered multi-sort rules: first entry has the highest priority. The table
   * is presentational, so it never sorts `data` itself — callers apply `sorts`
   * to the rows they pass in and hand the result back through `onSort`.
   * Absent or empty means unsorted.
   */
  sorts?: SortEntry[];
  /** Receives the full next sort array (not a per-column delta). */
  onSort?: (next: SortEntry[]) => void;
  /**
   * Selection is **global** while every interaction with it is **page-scoped**:
   * the table only ever sees the rows of the page it renders (`data`), so a
   * row toggle adds/removes that row's key, select-all *unions* the current
   * page's keys into the set, and unchecking select-all removes only the
   * current page's keys. Keys selected on other pages are preserved, which is
   * why callers must keep the whole selection in state and pass it back —
   * a selection reduced to the visible page would silently drop the rest.
   */
  selectedKeys?: string[];
  /** Receives the full next selection (not just the page's delta). */
  onSelect?: (keys: string[]) => void;
  /**
   * Derives a stable React key for a row. Required when data has no unique
   * `key`/`code`/`id` field or when those values can repeat — duplicate keys
   * cause wrong row rendering and selection acting on the wrong row.
   */
  rowKey?: (row: T) => string;
  status?: Status;
  onRetry?: () => void;
  summary?: ReactNode;
  /**
   * Opt-in fixed-height windowing: only the rows around the viewport render,
   * the rest exist as scroll height only. Never turns itself on by row count —
   * a table that silently switches rendering strategy on data growth is a
   * surprise, so callers flip it explicitly (default false).
   */
  virtual?: boolean;
  /** Fixed row height in px the window math uses: 32 compact / 44 comfortable. Default 32. */
  rowHeight?: number;
  /** Rows rendered above and below the viewport as a scroll buffer. Default 8. */
  overscan?: number;
  /**
   * Bounds the virtual scrollport height (inline `max-height` on the scroll
   * container). Omitted → the table's `70vh` default; pass any CSS height
   * (`'480px'`, `'100%'`, `'calc(100vh - 320px)'`) to fit an embedding
   * card/modal; pass `undefined` explicitly to drop the table's cap so the
   * caller's own layout sizes the scrollport. Only meaningful with `virtual`.
   */
  maxHeight?: string;
  /**
   * Renders a filter row directly under the header: one control per
   * `filterable` column. Purely presentational — values live in
   * `columnFilters`, every edit comes back through `onColumnFilter`, and the
   * table never filters `data` itself (default false).
   */
  showFilterRow?: boolean;
  /** Controlled filter value per column key. A missing key means blank. */
  columnFilters?: Record<string, string>;
  /** Receives the column key and its next raw string value on every edit. */
  onColumnFilter?: (key: string, value: string) => void;
  /**
   * Groups the body: one header row per group (toggle + label + row count +
   * `renderGroupSummary`) above that group's rows. Column keys — `buildGroups`
   * buckets by at most the first two (spec §4.8 caps it there this round).
   * Presentational: the table never reorders `data` itself, so callers pass
   * rows already in the order they want groups to appear in.
   */
  groupBy?: string[];
  /**
   * Group keys whose rows are hidden. Keys are structural and opaque (see
   * `buildGroups`) — pass them back verbatim, never reconstruct them from
   * labels. The header row (label, count, summary) stays visible — only the
   * group's body rows disappear. Controlled: remove a key and the rows come back.
   */
  collapsedGroups?: string[];
  /** Receives the group key on every header toggle click, collapsed or not. */
  onToggleGroup?: (groupKey: string) => void;
  /** Per-group summary rendered inside the group header (count/sum/…). */
  renderGroupSummary?: (groupKey: string, rows: T[]) => ReactNode;
  /**
   * Renders the master-detail panel for an expanded row: the table adds an
   * expand toggle column (first, after the select checkbox) and one extra
   * `role=row` with a full-colspan gridcell right under the expanded row.
   * In mobile card mode the same content renders inside the expanded card,
   * under the fallback card's Chi tiết toggle. Opt-in — providing this is
   * what turns the feature on (default undefined).
   */
  renderExpanded?: (row: T) => ReactNode;
  /**
   * Row keys whose detail rows are shown. Controlled: the table never expands
   * on its own — a toggle click comes back through `onToggleExpand` and the
   * caller passes the updated array back.
   */
  expandedKeys?: string[];
  /** Receives the row key on every expand/collapse toggle click, collapsed or not. */
  onToggleExpand?: (key: string) => void;
  /**
   * Detail row height in px. Fixed — the virtual window budgets exactly this
   * many pixels for the detail instead of measuring it at runtime (default
   * `Math.round(rowHeight * 2.5)`).
   */
  expandedHeight?: number;
  /**
   * Renders a mobile card for a row. On viewports at most 768px wide the
   * table swaps the grid for a list of `<article>` cards; without it the
   * fallback card renders the first column as the title and the rest as
   * `label: value` pairs. Desktop always keeps the grid.
   *
   * **Cards are read-only-flat** (documented scope, pinned by tests): cards
   * render `data` as a flat list — the selection checkboxes, filter row,
   * group headers and the grid's summary row are grid-only affordances and
   * never render in card mode, whatever props are passed. Filtering and
   * sorting still reach cards through the `data` the caller passes (the
   * table is presentational). Table-level footer chrome — summary text,
   * pagination and the export button — does render below the cards. With
   * `renderExpanded`, an expanded card shows its detail content too.
   *
   * A custom `renderCard` owns its own expand affordance: the built-in
   * `Chi tiết` toggle renders only in the fallback card (the
   * `renderExpanded` content still appears inside the expanded card either
   * way).
   */
  renderCard?: (row: T) => ReactNode;
  /**
   * Card height in px — fixed so the virtual window can offset cards without
   * measuring them (default `Math.round(rowHeight * 2.5)`).
   */
  cardHeight?: number;
  /**
   * Renders the sticky footer bar under the scrollport: `summary` (which
   * then leaves the grid rows — one summary, never two), the shared
   * `Pagination` (it clamps out-of-range pages itself and reports the
   * clamped page via `onPage`), and, with `exportable`, the export button.
   * Presentational: the table never slices `data` — callers paginate
   * upstream and pass the current page's rows. The bar also renders under
   * the mobile card list. Without `pagination` and `exportable`, P1
   * behaviour is untouched: `summary` stays the grid's sticky footer row.
   */
  pagination?: TablePagination;
  /** Adds the "Xuất CSV" button to the footer bar (default false). */
  exportable?: boolean;
  /** Downloaded file name for the default CSV export. Default `'datagrid.csv'`. */
  exportFileName?: string;
  /**
   * Overrides the default CSV download, called with the rows and columns
   * the button would have written — `data` as passed in (already
   * filtered/sorted by the caller: presentational) and every column.
   * Default builds `toCSV(data, columns)` (UTF-8 BOM + RFC4180 escapes)
   * and downloads it through a Blob anchor.
   */
  onExport?: (rows: T[], columns: Column<T>[]) => void;
  /**
   * Live column-width overrides in px, keyed by column key. Fully controlled:
   * the table never stores widths itself, it only reports interactions
   * through `onColumnWidth`/`onColumnWidthReset`. An entry wins over the
   * column's declared `width` AND changes the track kind: overridden columns
   * render exact px tracks (even unpinned ones, so drags govern), while the
   * declared `width` alone stays a flexible `minmax` floor. Unknown keys are
   * ignored. Default `{}`.
   */
  columnWidths?: Record<string, number>;
  /** Receives the dragged/keyboard-stepped width for a column on every move. */
  onColumnWidth?: (key: string, width: number) => void;
  /**
   * Double-click on a resize handle calls this with the column key so the
   * caller can delete its `columnWidths` entry and fall back to the declared
   * `width` (or the flexible track). Delete/Backspace on a focused handle
   * fires it too, so keyboard-only users can reset. A separate callback
   * because a width value alone cannot express "reset".
   */
  onColumnWidthReset?: (key: string) => void;
  /**
   * Shows a resize handle on every data column header (never on the select /
   * expand control tracks). Handles render only together with `onColumnWidth`
   * — a separator that reports nowhere is worse than none. Opt-in like
   * `virtual` — resizing changes layout, so callers flip it explicitly
   * (default false).
   */
  resizable?: boolean;
  /** Floor in px for dragged/stepped widths (itself floored at 1). Default 40. */
  minColumnWidth?: number;
}
