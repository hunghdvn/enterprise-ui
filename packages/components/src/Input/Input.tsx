import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md';
  error?: string;
}

export function Input({
  size = 'sm',
  error,
  className = '',
  'aria-invalid': ariaInvalid,
  ...rest
}: InputProps) {
  return (
    <span className={styles.wrap}>
      <input
        data-size={size}
        aria-invalid={error ? 'true' : ariaInvalid}
        className={`${styles.input} ${className}`}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
    </span>
  );
}
