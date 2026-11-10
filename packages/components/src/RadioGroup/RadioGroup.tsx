import { createContext, useContext, useId } from 'react';
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
  const describedBy =
    [rest['aria-describedby'], hint ? hintId : undefined, resolvedError ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <fieldset
      {...rest}
      role="radiogroup"
      aria-required={required ? 'true' : undefined}
      aria-invalid={resolvedError ? 'true' : undefined}
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
          value={{ name: name ?? generatedName, value, defaultValue, size, onChange }}
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
