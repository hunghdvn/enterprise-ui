import { createContext, type FormHTMLAttributes } from 'react';
import styles from './Form.module.css';

export const FormErrorsContext = createContext<Record<string, string>>({});

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  errors?: Record<string, string>;
}

export function Form({ errors, className = '', children, ...rest }: FormProps) {
  return (
    <form {...rest} noValidate className={`${styles.form} ${className}`}>
      <FormErrorsContext.Provider value={errors ?? {}}>
        {children}
      </FormErrorsContext.Provider>
    </form>
  );
}
