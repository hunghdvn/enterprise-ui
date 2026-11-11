import type { CSSProperties, HTMLAttributes } from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Shape. Default `'text'`. */
  variant?: SkeletonVariant;
  /** CSS width; numbers become px. */
  width?: CSSProperties['width'];
  /** CSS height; numbers become px. */
  height?: CSSProperties['height'];
}
