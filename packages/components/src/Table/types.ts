import type { ReactNode } from 'react';

export type Status = 'idle' | 'loading' | 'empty' | 'error';

export type Align = 'left' | 'right' | 'center';

export type SortDir = 'asc' | 'desc';

export interface SortEntry {
  key: string;
  dir: 'asc' | 'desc';
}

export interface Column<T> {
  key: string;
  title: string;
  align?: Align;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
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
}
