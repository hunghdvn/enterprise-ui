import type { ReactNode } from 'react';

export interface CalendarProps {
  /** Selected date (controlled). */
  value?: Date | null;
  onChange?: (date: Date) => void;
  /** Viewed month (controlled). Defaults to value's month or today. */
  view?: Date;
  onViewChange?: (view: Date, requestId?: number) => void;
  /**
   * Echo of the requestId issued by a page key. Pass a number on every render to opt into strict
   * landing (a page request only lands when this matches); leave it off for month-key landing.
   */
  viewRequestId?: number;
  /**
   * Events keyed by ISO date (YYYY-MM-DD). A single node renders one line; an array renders one
   * line per node. The full list stays in the day's accessible description even when the cell
   * clips it visually (1 line at `size="sm"`, 2 at `size="md"`).
   */
  events?: Record<string, ReactNode>;
  /** Predicate to disable a day. */
  isDisabled?: (date: Date) => boolean;
  /** Size of day cells. */
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}
