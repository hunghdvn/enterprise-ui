import type { CSSProperties, HTMLAttributes } from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children' | 'aria-hidden'
> {
  /** Shape. Default `'text'`. */
  variant?: SkeletonVariant;
  /** CSS width; numbers become px. */
  width?: CSSProperties['width'];
  /** CSS height; numbers become px. */
  height?: CSSProperties['height'];
}
