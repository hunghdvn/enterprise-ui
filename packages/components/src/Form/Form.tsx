import type { FormHTMLAttributes } from 'react';
import styles from './Form.module.css';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  errors?: Record<string, string>;
}

export function Form({ errors, className = '', children, ...rest }: FormProps) {
  void errors;
  return (
    <form {...rest} noValidate className={`${styles.form} ${className}`}>
      {children}
    </form>
  );
}
