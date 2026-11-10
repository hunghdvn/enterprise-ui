import { cx } from '../internal/cx';
import styles from './Switch.module.css';
import type { SwitchProps } from './types';

export function Switch({ size = 'sm', className = '', children, ...rest }: SwitchProps) {
  return (
    <label data-size={size} className={cx(styles.label, className)}>
      <span className={styles.control}>
        <input type="checkbox" role="switch" className={styles.input} {...rest} />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
      {children}
    </label>
  );
}
