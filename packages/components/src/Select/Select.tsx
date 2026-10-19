import { useId, type SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

/**
 * Single-select native wrapper. `multiple` is omitted on purpose: the
 * Ctrl/Cmd-click multi-select UX was rejected in review — chips + search live
 * in `<Combobox multiple>` instead (decision 2026-10-19).
 */
export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size' | 'multiple'
> {
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
