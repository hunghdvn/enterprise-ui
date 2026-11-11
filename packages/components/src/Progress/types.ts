import type { HTMLAttributes, ReactNode } from 'react';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value. Clamped to `0..max`. */
  value: number;
  /** Upper bound. Default `100`; non-positive/non-finite falls back to 100. */
  max?: number;
  /** Visible label above the bar; used as the progressbar's accessible name. */
  label?: ReactNode;
  /** Show the rounded percentage opposite the label. Default `false`. */
  showValue?: boolean;
  /** Track height. Default `'sm'`. */
  size?: 'sm' | 'md';
}
