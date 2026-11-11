import { cx } from '../internal/cx';
import styles from './Skeleton.module.css';
import type { SkeletonProps } from './types';

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...rest
}: SkeletonProps) {
  return (
    <span
      {...rest}
      aria-hidden="true"
      data-variant={variant}
      className={cx(styles.skeleton, className)}
      style={{ width, height, ...style }}
    />
  );
}
