import type { FormHTMLAttributes, ReactNode } from 'react';

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginFormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onChange' | 'onSubmit' | 'children' | 'className'
> {
  value: LoginFormValues;
  onChange: (value: LoginFormValues) => void;
  onSubmit: (value: LoginFormValues) => void;
  /** Form-level error, e.g. wrong credentials or a locked account. */
  error?: ReactNode;
  /** Field errors keyed by `email` or `password`; the caller owns validation. */
  errors?: Record<string, string>;
  loading?: boolean;
  disabled?: boolean;
  emailLabel?: string;
  passwordLabel?: string;
  rememberLabel?: string;
  submitLabel?: string;
  /** Set false to hide the remember checkbox; the forgot-password slot still renders alone. */
  showRemember?: boolean;
  /** Caller-composed forgot-password link/button shown opposite the checkbox. */
  forgotPassword?: ReactNode;
  /** Extra content after the submit button (SSO providers, legal copy). */
  children?: ReactNode;
  className?: string;
}
