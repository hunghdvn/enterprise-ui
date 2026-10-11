import { useId, type SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md';
  error?: string;
}

export function Select({
  size = 'sm',
  error,
  className = '',
  children,
  id: idProp,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const errorId = useId();
  const id = idProp ?? autoId;
  const describedBy = error
    ? [describedByProp, errorId].filter(Boolean).join(' ')
    : describedByProp;
  return (
    <span className={styles.wrap}>
      <select
        id={id}
        data-size={size}
        aria-invalid={error ? 'true' : ariaInvalid}
        aria-describedby={describedBy}
        className={`${styles.select} ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </span>
  );
}
