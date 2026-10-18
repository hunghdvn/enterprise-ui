import styles from './Button.module.css';
import type { ButtonProps } from './types';

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
      {loading && <span aria-hidden="true">… </span>}
      {icon != null && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
