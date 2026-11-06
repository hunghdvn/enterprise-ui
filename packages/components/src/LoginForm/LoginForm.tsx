import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Field } from '../Form/Field';
import { Form } from '../Form/Form';
import { Icon } from '../Icon';
import { Input } from '../Input/Input';
import { isPresent } from '../internal/isPresent';
import styles from './LoginForm.module.css';
import type { LoginFormProps, LoginFormValues } from './types';

export function LoginForm({
  value,
  onChange,
  onSubmit,
  error,
  errors,
  loading = false,
  disabled = false,
  emailLabel = 'Email',
  passwordLabel = 'Mật khẩu',
  rememberLabel = 'Ghi nhớ đăng nhập',
  submitLabel = 'Đăng nhập',
  showRemember = true,
  forgotPassword,
  children,
  className = '',
  'aria-label': ariaLabel = 'Đăng nhập',
  ...rest
}: LoginFormProps) {
  const busy = loading || disabled;
  const update = (patch: Partial<LoginFormValues>) => onChange({ ...value, ...patch });

  return (
    <Form
      {...rest}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      errors={errors}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        if (busy) return;
        onSubmit(value);
      }}
    >
      {isPresent(error) && (
        <div className={styles.error} role="alert">
          <Icon name="alert-circle" size={16} className={styles.errorIcon} />
          <span>{error}</span>
        </div>
      )}
      <Field label={emailLabel} name="email" required>
        <Input
          type="email"
          name="email"
          autoComplete="username"
          inputMode="email"
          value={value.email}
          disabled={disabled}
          onChange={(event) => update({ email: event.target.value })}
        />
      </Field>
      <Field label={passwordLabel} name="password" required>
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          value={value.password}
          disabled={disabled}
          onChange={(event) => update({ password: event.target.value })}
        />
      </Field>
      {(showRemember || isPresent(forgotPassword)) && (
        <div className={styles.meta} data-alone={showRemember ? undefined : 'true'}>
          {showRemember && (
            <Checkbox
              name="remember"
              checked={value.remember}
              disabled={disabled}
              onChange={(event) => update({ remember: event.target.checked })}
            >
              {rememberLabel}
            </Checkbox>
          )}
          {isPresent(forgotPassword) && <div className={styles.forgot}>{forgotPassword}</div>}
        </div>
      )}
      <Button type="submit" loading={loading} disabled={disabled} className={styles.submit}>
        {submitLabel}
      </Button>
      {children}
    </Form>
  );
}
