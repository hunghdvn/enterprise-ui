import type { HTMLAttributes, ReactNode } from 'react';

export type DescriptionsColumns = 1 | 2 | 3;
export type DescriptionsLayout = 'horizontal' | 'vertical';
export type DescriptionsSize = 'sm' | 'md';

export interface DescriptionItem {
  /** Term rendered in `<dt>`. */
  label: ReactNode;
  /** Value rendered in `<dd>`. */
  value: ReactNode;
  /** Grid columns to span, clamped to `1..columns`. Default `1`. */
  span?: number;
}

export interface DescriptionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: DescriptionItem[];
  /** Grid columns. Default `2`. */
  columns?: DescriptionsColumns;
  /** Label beside (`horizontal`) or above (`vertical`) the value. Default `'horizontal'`. */
  layout?: DescriptionsLayout;
  /** Cell dividers around the grid. Default `false`. */
  bordered?: boolean;
  /** Text scale. Default `'md'`. */
  size?: DescriptionsSize;
}
