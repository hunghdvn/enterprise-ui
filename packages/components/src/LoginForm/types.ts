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
  /**
   * Called with the whole next value. Apply it immediately (or with a functional state update):
   * two edits that arrive before a render would otherwise spread the same stale value.
   */
  onChange: (value: LoginFormValues) => void;
  /**
   * Called with the values read from the form on submit, so autofill that never fires `onChange`
   * is still included. The component already prevented the native submit.
   */
  onSubmit: (value: LoginFormValues) => void;
  /**
   * Form-level error, e.g. wrong credentials or a locked account. Clear it when a new submit
   * starts so the same message is announced again on a repeat failure.
   */
  error?: ReactNode;
  /** Field errors keyed by `email` or `password`; the caller owns validation. */
  errors?: Partial<Record<'email' | 'password', string>>;
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
  /**
   * Extra content rendered after the submit button and outside the `<form>` (SSO providers,
   * legal copy), so a plain button here cannot submit the form.
   */
  children?: ReactNode;
  className?: string;
}
