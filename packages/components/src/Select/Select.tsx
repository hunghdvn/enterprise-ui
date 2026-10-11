import type { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md';
  error?: string;
}

export function Select({ size = 'sm', error, className = '', children, 'aria-invalid': ariaInvalid, ...rest }: SelectProps) {
  return (
    <span className={styles.wrap}>
      <select
        data-size={size}
        aria-invalid={error ? 'true' : ariaInvalid}
        className={`${styles.select} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </span>
  );
}
