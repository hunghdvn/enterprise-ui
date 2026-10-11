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
  selectedKeys?: string[];
  onSelect?: (keys: string[]) => void;
  rowKey?: (row: T) => string;
  status?: Status;
  onRetry?: () => void;
  summary?: ReactNode;
}
