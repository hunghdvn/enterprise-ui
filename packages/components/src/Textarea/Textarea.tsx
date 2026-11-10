import { useId } from 'react';
import styles from './Textarea.module.css';
import type { TextareaProps } from './types';

export function Textarea({
  size = 'sm',
  error,
  className = '',
  id: idProp,
  rows = 3,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const errorId = useId();
  const id = idProp ?? autoId;
  const describedBy = error
    ? [describedByProp, errorId].filter(Boolean).join(' ')
    : describedByProp;
  return (
    <span className={styles.wrap}>
      <textarea
        id={id}
        rows={rows}
        data-size={size}
        aria-invalid={error ? 'true' : ariaInvalid}
        aria-describedby={describedBy}
        className={`${styles.textarea} ${className}`}
        {...rest}
      />
      {error && (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </span>
  );
}
