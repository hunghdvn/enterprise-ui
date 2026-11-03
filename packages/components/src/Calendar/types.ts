import type { ReactNode } from 'react';

export interface CalendarProps {
  /** Selected date (controlled). */
  value?: Date | null;
  /**
   * Called with a day when the user commits it: click, Enter/Space, or an arrow/Home/End move.
   * PageUp/PageDown change the viewed month instead.
   */
  onChange?: (date: Date) => void;
  /** Viewed month (controlled). Defaults to value's month or today. */
  view?: Date;
  /**
   * Called with the first day of the month when the user asks to change it: chevrons, Page keys,
   * or an arrow crossing a month boundary (which also commits its day through `onChange`). A
   * parent that renders one of the months the calendar asked for acks the request (the Date may
   * be recreated); rendering any other month cancels it. A page round trip that withdraws a
   * queued month re-emits the visible one so a last-wins parent can cancel the request.
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
