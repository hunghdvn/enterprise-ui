import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/types';

export type TimelineTone = 'neutral' | 'blue' | 'green' | 'orange' | 'red';
export type TimelineSize = 'sm' | 'md';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Pre-formatted display string, e.g. "12/11/2026 · 09:15". */
  time?: ReactNode;
  /** Machine-readable ISO value for `<time datetime>`. */
  dateTime?: string;
  /** Decorative marker tone; default `'neutral'`. */
  tone?: TimelineTone;
  /** Replaces the default dot with an icon. */
  icon?: IconName;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  items: readonly TimelineItem[];
  /** Default `'md'`. */
  size?: TimelineSize;
}
