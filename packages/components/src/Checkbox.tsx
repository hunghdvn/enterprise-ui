import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visual size of the checkbox control. */
  size?: CheckboxSize;
  /** Visible label associated with the native checkbox. */
  children: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { size = 'md', className, children, ...props },
  ref,
) {
  const classes = [styles.checkbox, styles[size], className].filter(Boolean).join(' ');

  return (
    <label className={classes}>
      <input {...props} ref={ref} className={styles.control} type="checkbox" />
      <span className={styles.label}>{children}</span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
