import { cloneElement, useContext, useId, type ReactElement } from 'react';
import { FormErrorsContext } from './Form';
import styles from './Form.module.css';

export interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /** Key into Form `errors` map. Explicit `error` prop takes precedence. */
  name?: string;
  children: ReactElement;
}

export function Field({ label, error, hint, required, name, children }: FieldProps) {
  const errorId = useId();
  const controlId = useId();
  const contextErrors = useContext(FormErrorsContext);
  const resolvedError = error ?? (name ? contextErrors[name] : undefined);
  const childProps = children.props as Record<string, unknown>;
  const existingDescribedBy = childProps['aria-describedby'] as string | undefined;
  const mergedDescribedBy = resolvedError
    ? [existingDescribedBy, errorId].filter(Boolean).join(' ')
    : existingDescribedBy;
  const childId = (childProps.id as string | undefined) ?? controlId;
  const needsClone =
    resolvedError !== undefined || childProps.id === undefined;
  const child = needsClone
    ? cloneElement(children, {
        id: childId,
        ...(resolvedError
          ? { 'aria-invalid': 'true', 'aria-describedby': mergedDescribedBy }
          : {}),
      })
    : children;
  return (
    <label htmlFor={childId} className={styles.field}>
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
      {resolvedError ? (
        <span id={errorId} role="alert" className={styles.error}>
          {resolvedError}
        </span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </label>
  );
}
