import { useId, type SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

/**
 * Single-select native wrapper. `multiple` and array `value`/`defaultValue`
 * are omitted on purpose: the Ctrl/Cmd-click multi-select UX was rejected in
 * review — chips + search live in `<Combobox multiple>` instead (decision
 * 2026-10-19). An array value would compile off the inherited type but select
 * nothing, so the narrowing is enforced, not just documented.
 */
export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size' | 'multiple' | 'value' | 'defaultValue'
> {
  size?: 'sm' | 'md';
  error?: string;
  /** Single value only — arrays belong to `<Combobox multiple>`. */
  value?: string | number;
  /** Single value only — arrays belong to `<Combobox multiple>`. */
  defaultValue?: string | number;
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
