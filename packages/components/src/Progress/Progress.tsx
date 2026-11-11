import { useId } from 'react';
import { cx } from '../internal/cx';
import { isPresent } from '../internal/isPresent';
import styles from './Progress.module.css';
import type { ProgressProps } from './types';

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'sm',
  className = '',
  ...rest
}: ProgressProps) {
  const labelId = useId();
  const resolvedMax = Number.isFinite(max) && max > 0 ? max : 100;
  const resolvedValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), resolvedMax) : 0;
  const percent = (resolvedValue / resolvedMax) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={resolvedMax}
      aria-valuenow={resolvedValue}
      aria-labelledby={isPresent(label) ? labelId : undefined}
      data-size={size}
      className={cx(styles.root, className)}
      {...rest}
    >
      {(isPresent(label) || showValue) && (
        <div className={styles.header}>
          {isPresent(label) && <span id={labelId}>{label}</span>}
          {showValue && (
            <span aria-hidden="true" className={styles.value}>
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
