import { Children, createContext, useContext, isValidElement, useId } from 'react';
import { FormErrorsContext } from '../Form/Form';
import { cx } from '../internal/cx';
import styles from './RadioGroup.module.css';
import type { RadioGroupProps } from './types';

export interface RadioGroupCtx {
  name: string;
  value?: string;
  defaultValue?: string;
  size: 'sm' | 'md';
  onChange?: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupCtx | null>(null);

export function RadioGroup({
  legend,
  hint,
  error,
  name,
  value,
  defaultValue,
  onChange,
  orientation = 'vertical',
  size = 'sm',
  required,
  className = '',
  children,
  ...rest
}: RadioGroupProps) {
  const hintId = useId();
  const errorId = useId();
  const generatedName = useId();
  const contextErrors = useContext(FormErrorsContext);
  const resolvedError = error ?? (name !== undefined ? contextErrors[name] : undefined);
  // A Radio that owns its checked state must not be joined by a second seeded
  // selection from the group default; two checked radios in one group is an
  // impossible state. Only direct Radio children are inspected — the documented
  // usage — and each Radio still guards itself for wrapped children.
  const childrenOwnChecked = Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      ((child.props as { checked?: unknown }).checked !== undefined ||
        (child.props as { defaultChecked?: unknown }).defaultChecked !== undefined),
  );
  const resolvedDefaultValue = childrenOwnChecked ? undefined : defaultValue;
  const describedBy =
    [rest['aria-describedby'], hint ? hintId : undefined, resolvedError ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <fieldset
      {...rest}
      role="radiogroup"
      aria-required={required ? 'true' : rest['aria-required']}
      aria-invalid={resolvedError ? 'true' : rest['aria-invalid']}
      aria-describedby={describedBy}
      data-size={size}
      data-orientation={orientation}
      className={cx(styles.group, className)}
    >
      <legend className={styles.legend}>
        {legend}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </legend>
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      <div className={styles.options}>
        <RadioGroupContext.Provider
          value={{
            name: name ?? generatedName,
            value,
            defaultValue: resolvedDefaultValue,
            size,
            onChange,
          }}
        >
          {children}
        </RadioGroupContext.Provider>
      </div>
      {resolvedError && (
        <span id={errorId} role="alert" className={styles.error}>
          {resolvedError}
        </span>
      )}
    </fieldset>
  );
}
