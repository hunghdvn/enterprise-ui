import { cloneElement, useContext, useId, type ReactElement } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
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
  const hintId = useId();
  const controlId = useId();
  const contextErrors = useContext(FormErrorsContext);
  const resolvedError = error ?? (name ? contextErrors[name] : undefined);
  const childProps = children.props as Record<string, unknown>;
  const existingDescribedBy = childProps['aria-describedby'] as string | undefined;
  const childId = (childProps.id as string | undefined) ?? controlId;

  // The control is a sibling of the texts, so the hint and the error reach it
  // through aria-describedby. Wrapping the control in the label used to fold
  // them into the control's accessible name instead.
  const describedBy = [existingDescribedBy, errorId, hint ? hintId : undefined]
    .filter(Boolean)
    .join(' ');

  // Only set what actually applies: cloneElement with an explicit `undefined`
  // would drop a caller-supplied attribute instead of leaving it alone.
  const cloneProps: Record<string, unknown> = { id: childId };
  if (required && childProps['aria-required'] === undefined) cloneProps['aria-required'] = true;
  if (resolvedError) cloneProps['aria-invalid'] = 'true';
  if (describedBy) cloneProps['aria-describedby'] = describedBy;
  const child = cloneElement(children, cloneProps);

  const labelText = (
    <>
      {label}
      {required && (
        <span className={styles.required} aria-hidden="true">
          {' '}
          *
        </span>
      )}
    </>
  );

  // A child that renders its own <label> (Checkbox) must not also be pointed at
  // one: two labels for a single control concatenate the accessible name, so
  // Field stays plain text there and lets the Checkbox label own the input.
  const selfLabelled = children.type === Checkbox;

  return (
    <div className={styles.field}>
      {selfLabelled ? (
        <span className={styles.label}>{labelText}</span>
      ) : (
        <label className={styles.label} htmlFor={childId}>
          {labelText}
        </label>
      )}
      {child}
      {resolvedError && (
        <span id={errorId} role="alert" className={styles.error}>
          {resolvedError}
        </span>
      )}
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
}
