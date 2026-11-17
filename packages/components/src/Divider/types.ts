import type { HTMLAttributes } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md';
export type DividerAlign = 'start' | 'center' | 'end';

export interface DividerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Default `'horizontal'`. */
  orientation?: DividerOrientation;
  /** Optional centred label; horizontal only. An empty or whitespace-only string means no label. */
  label?: string;
  /** Spacing along the cross axis; default `'md'`. */
  spacing?: DividerSpacing;
  /** Label alignment for a labelled horizontal divider; default `'center'`. */
  align?: DividerAlign;
}
