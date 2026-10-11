import styles from './Button.module.css';
import type { ButtonProps } from './types';

export function Button({
  variant = 'primary',
  size = 'sm',
  loading,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      className={`${styles.btn} ${className}`}
      {...rest}
    >
      {loading ? '...' : children}
    </button>
  );
}
