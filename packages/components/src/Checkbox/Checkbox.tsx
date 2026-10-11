import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  size?: 'sm' | 'md';
}

export function Checkbox({ size = 'sm', className = '', children, ...rest }: CheckboxProps) {
  return (
    <label data-size={size} className={`${styles.label} ${className}`}>
      <input type="checkbox" className={styles.box} {...rest} />
      {children}
    </label>
  );
}
