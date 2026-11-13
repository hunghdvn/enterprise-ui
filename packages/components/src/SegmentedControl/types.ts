import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/types';

export type SegmentedControlSize = 'sm' | 'md';

export interface SegmentedControlItem {
  /** Unique value reported to `onChange`. */
  value: string;
  label: ReactNode;
  icon?: IconName;
  disabled?: boolean;
  /** Accessible name when `label` is not text (e.g. an icon-only option). */
  'aria-label'?: string;
}

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'aria-label'
> {
  items: readonly SegmentedControlItem[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled; defaults to the first option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Default `'md'`. */
  size?: SegmentedControlSize;
  /** Disables every option. */
  disabled?: boolean;
  /** Required group name. */
  'aria-label': string;
}
