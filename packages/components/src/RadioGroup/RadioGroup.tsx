import { createContext, isValidElement, useContext, useId, type ReactNode } from 'react';
import { FormErrorsContext } from '../Form/Form';
import { cx } from '../internal/cx';
import styles from './RadioGroup.module.css';
import type { RadioGroupProps } from './types';

/** True when any element in the tree (including wrapped/fragment children) sets
 * a truthy `checked`/`defaultChecked`. Falsy values are just the prop default
 * and must not suppress the group's defaultValue. */
function ownsChecked(node: ReactNode): boolean {
  if (node === null || node === undefined || typeof node !== 'object') return false;
  if (Array.isArray(node)) return node.some(ownsChecked);
  if (!isValidElement(node)) return false;
  const props = node.props as {
    checked?: unknown;
    defaultChecked?: unknown;
    children?: ReactNode;
  };
  if (props.checked === true || props.defaultChecked === true) return true;
  return ownsChecked(props.children);
}

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
  // A truthy checked/defaultChecked anywhere in the tree means the caller is
  // choosing selections explicitly; seeding the group default as well can
  // select two radios, so the whole group default steps aside. Falsy values are
  // just the prop default and keep the group default working. Wrapped and
  // fragment children are inspected recursively.
  const resolvedDefaultValue = ownsChecked(children) ? undefined : defaultValue;
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
