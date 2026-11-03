import type { ReactNode } from 'react';

export interface CalendarProps {
  /** Selected date (controlled). */
  value?: Date | null;
  /**
   * Called with a day when the user commits it: click, Enter/Space, or an arrow/Home/End move.
   * PageUp/PageDown never call it; they only change the viewed month.
   */
  onChange?: (date: Date) => void;
  /** Viewed month (controlled). Defaults to value's month or today. */
  view?: Date;
  /**
   * Called with the first day of the month when the user asks for another month (chevrons or
   * PageUp/PageDown). The selection is untouched; the parent must apply the month to move it.
   */
  onViewChange?: (view: Date) => void;
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
