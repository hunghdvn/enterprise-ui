import type { ReactNode } from 'react';

export interface CalendarProps {
  /** Selected date (controlled). */
  value?: Date | null;
  onChange?: (date: Date) => void;
  /** Viewed month (controlled). Defaults to value's month or today. */
  view?: Date;
  onViewChange?: (view: Date) => void;
  /**
   * Events keyed by ISO date (YYYY-MM-DD). A single node renders one line; an array renders one
   * line per node. The full list stays in the day's accessible description even when the cell
   * clips it visually (sm shows 1 line, md 2).
   */
  events?: Record<string, ReactNode>;
  /** Predicate to disable a day. */
  isDisabled?: (date: Date) => boolean;
  /** Size of day cells. */
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}
