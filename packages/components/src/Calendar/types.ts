import type { ReactNode } from 'react';

export interface CalendarProps {
  /** Selected date (controlled). */
  value?: Date | null;
  /**
   * Called with a day when the user commits it: click, Enter/Space, or an arrow/Home/End move.
   * PageUp/PageDown change the viewed month instead.
   */
  onChange?: (date: Date) => void;
  /**
   * Viewed month (controlled). Defaults to value's month or today. While the grid holds keyboard
   * focus, a newly rendered month — from the user or from the parent — moves focus to the day the
   * cursor settles on, or to the grid when that month has no enabled day.
   */
  view?: Date;
  /**
   * Called with the first day of the month when the user asks to change it: chevrons, Page keys,
   * or an arrow crossing a month boundary (which also commits its day through `onChange`). Each
   * request is relative to the month currently rendered, as with any controlled input: if the
   * parent applies `view` later, repeated presses before it renders ask for the same neighbouring
   * month, and a press the other way asks for the month on the other side (it cancels nothing).
   * Arrow keys and Home/End likewise start from the day shown in the grid.
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
