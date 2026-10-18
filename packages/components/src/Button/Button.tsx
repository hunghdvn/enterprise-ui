import type { ReactNode } from 'react';
import styles from './Button.module.css';
import type { ButtonProps } from './types';

function isPresent(value: ReactNode): boolean {
  return value != null && value !== false && value !== '' && value !== 0;
}

export function Button({
  variant = 'primary',
  size = 'sm',
  loading,
  icon,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${styles.btn} ${className}`}
      {...rest}
    >
      {loading && <span aria-hidden="true">…</span>}
      {isPresent(icon) && (
        <span aria-hidden="true" className={styles.icon}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
