import { cloneElement, useId, type ReactElement } from 'react';
import styles from './Form.module.css';

export interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactElement;
}

export function Field({ label, error, hint, required, children }: FieldProps) {
  const errorId = useId();
  const describedBy = error ? errorId : undefined;
  const child = error
    ? cloneElement(children, { 'aria-invalid': 'true', 'aria-describedby': describedBy })
    : children;
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </span>
      {child}
      {error ? (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </label>
  );
}
