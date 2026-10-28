import type { ReactNode } from 'react';

export interface CalendarProps {
  /** Selected date (controlled). */
  value?: Date | null;
  onChange?: (date: Date) => void;
  /** Viewed month (controlled). Defaults to value's month or today. */
  view?: Date;
  onViewChange?: (view: Date) => void;
  /** Optional events keyed by ISO date (YYYY-MM-DD) rendered inside the day cell. */
  events?: Record<string, ReactNode>;
  /** Predicate to disable a day. */
  isDisabled?: (date: Date) => boolean;
  /** Size of day cells. */
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}
