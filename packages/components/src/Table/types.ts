import type { ReactNode } from 'react';

export type Status = 'idle' | 'loading' | 'empty' | 'error';

export type Align = 'left' | 'right' | 'center';

export type SortDir = 'asc' | 'desc';

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
  sortKey?: string;
  sortDir?: SortDir;
  onSort?: (key: string) => void;
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
}
