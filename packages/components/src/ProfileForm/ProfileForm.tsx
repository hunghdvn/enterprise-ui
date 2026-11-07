import type { ChangeEvent } from 'react';
import { Button } from '../Button/Button';
import { Field } from '../Form/Field';
import { Form } from '../Form/Form';
import { Input } from '../Input/Input';
import { isPresent } from '../internal/isPresent';
import { cx } from '../internal/cx';
import styles from './ProfileForm.module.css';
import type { ProfileFormProps, ProfileFormValues } from './types';

const FIELDS: readonly (keyof ProfileFormValues)[] = [
  'displayName',
  'email',
  'phone',
  'jobTitle',
  'department',
];

/**
 * Reads what is actually in the form. Browser or password-manager autofill can write into the
 * inputs without firing a React change event; submitting the `value` prop would then send stale
 * data. A missing control keeps the controlled value instead of blanking the field.
 */
function readFormValue(form: HTMLFormElement, current: ProfileFormValues): ProfileFormValues {
  const next = { ...current };
  for (const key of FIELDS) {
    const element = form.elements.namedItem(key);
    if (element instanceof HTMLInputElement) next[key] = element.value;
  }
  return next;
}

export function ProfileForm({
  value,
  onChange,
  onSubmit,
  errors,
  required = ['displayName', 'email'],
  loading = false,
  disabled = false,
  avatar,
  avatarHint,
  displayNameLabel = 'Họ và tên',
  emailLabel = 'Email',
  phoneLabel = 'Số điện thoại',
  jobTitleLabel = 'Chức danh',
  departmentLabel = 'Phòng ban',
  submitLabel = 'Lưu thay đổi',
  cancelLabel = 'Huỷ',
  onCancel,
  className = '',
  'aria-label': ariaLabel = 'Hồ sơ cá nhân',
  ...rest
}: ProfileFormProps) {
  const busy = loading || disabled;
  const isRequired = (key: keyof ProfileFormValues) => required.includes(key);

  const setField = (key: keyof ProfileFormValues) => (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: event.target.value });

  // Form accepts `Record<string, string>`; the prop is narrowed to known keys, so drop empty
  // messages here rather than casting the caller's object.
  const formErrors = errors
    ? Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
    : undefined;

  return (
    <Form
      {...rest}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      errors={formErrors}
      className={cx(styles.form, className)}
      onSubmit={(event) => {
        event.preventDefault();
        // Enter in a field still submits natively; a disabled button must not let it through.
        if (busy) return;
        const next = readFormValue(event.currentTarget, value);
        if (FIELDS.some((key) => next[key] !== value[key])) {
          // Tell the caller about autofilled values so the next render cannot clear them.
          onChange(next);
        }
        onSubmit(next);
      }}
    >
      {isPresent(avatar) && (
        <div className={styles.avatar}>
          {avatar}
          {isPresent(avatarHint) && <p className={styles.avatarHint}>{avatarHint}</p>}
        </div>
      )}
      <div className={styles.grid}>
        <Field label={displayNameLabel} name="displayName" required={isRequired('displayName')}>
          <Input
            name="displayName"
            autoComplete="name"
            value={value.displayName}
            disabled={disabled}
            onChange={setField('displayName')}
          />
        </Field>
        <Field label={emailLabel} name="email" required={isRequired('email')}>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={value.email}
            disabled={disabled}
            onChange={setField('email')}
          />
        </Field>
        <Field label={phoneLabel} name="phone" required={isRequired('phone')}>
          <Input
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            value={value.phone}
            disabled={disabled}
            onChange={setField('phone')}
          />
        </Field>
        <Field label={jobTitleLabel} name="jobTitle" required={isRequired('jobTitle')}>
          <Input
            name="jobTitle"
            autoComplete="organization-title"
            value={value.jobTitle}
            disabled={disabled}
            onChange={setField('jobTitle')}
          />
        </Field>
        <Field label={departmentLabel} name="department" required={isRequired('department')}>
          <Input
            name="department"
            autoComplete="organization"
            value={value.department}
            disabled={disabled}
            onChange={setField('department')}
          />
        </Field>
      </div>
      <div className={styles.footer}>
        <Button type="submit" variant="primary" loading={loading} disabled={disabled}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={disabled}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </Form>
  );
}
