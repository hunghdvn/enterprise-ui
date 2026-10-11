import { useId, type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md';
  error?: string;
}

export function Input({
  size = 'sm',
  error,
  className = '',
  id: idProp,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  ...rest
}: InputProps) {
  const autoId = useId();
  const errorId = useId();
  const id = idProp ?? autoId;
  const describedBy = error
    ? [describedByProp, errorId].filter(Boolean).join(' ')
    : describedByProp;
  return (
    <span className={styles.wrap}>
      <input
        id={id}
        data-size={size}
        aria-invalid={error ? 'true' : ariaInvalid}
        aria-describedby={describedBy}
        className={`${styles.input} ${className}`}
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
