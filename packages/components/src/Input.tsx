import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Control height and text density. */
  inputSize?: InputSize;
  /** Marks the field as invalid and exposes aria-invalid. */
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', invalid = false, className, ...props },
  ref,
) {
  const classes = [styles.input, styles[inputSize], invalid ? styles.invalid : '', className]
    .filter(Boolean)
    .join(' ');

  return <input {...props} ref={ref} className={classes} aria-invalid={invalid || undefined} />;
});

Input.displayName = 'Input';
