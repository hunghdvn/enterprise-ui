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
   * flexes, keeping the horizontal scroll the pins exist for.
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
   * Group keys whose rows are hidden. The header row (label, count, summary)
   * stays visible — only the group's body rows disappear. Controlled: remove
   * a key and the rows come back.
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
   * Opt-in — providing this is what turns the feature on (default undefined).
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
   */
  renderCard?: (row: T) => ReactNode;
  /**
   * Card height in px — fixed so the virtual window can offset cards without
   * measuring them (default `Math.round(rowHeight * 2.5)`).
   */
  cardHeight?: number;
}
