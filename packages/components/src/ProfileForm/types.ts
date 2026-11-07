import type { HTMLAttributes, ReactNode } from 'react';

export interface ProfileFormValues {
  displayName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
}

/**
 * Pass-through attributes go to the root wrapper (the element the caller lays out), not the
 * inner `<form>`: `className` for placement, `hidden`, `style`, `id`, `data-*`. Form-only
 * attributes (`action`, `method`) are meaningless here because the component owns submit and
 * always prevents the native one.
 */
export interface ProfileFormProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onSubmit' | 'children' | 'className'
> {
  value: ProfileFormValues;
  /**
   * Called with the whole next value. Apply it immediately (or with a functional state update):
   * two edits that arrive before a render would otherwise spread the same stale value.
   */
  onChange: (value: ProfileFormValues) => void;
  /**
   * Called with the values read from the form on submit, so autofill that never fires `onChange`
   * is still included. The component already prevented the native submit. When the DOM read
   * differs from `value`, `onChange` is called with the same object first, so the next render
   * cannot clear it.
   */
  onSubmit: (value: ProfileFormValues) => void;
  /** Field errors keyed by a `ProfileFormValues` key; the caller owns validation. */
  errors?: Partial<Record<keyof ProfileFormValues, string>>;
  /** Fields marked required; default `['displayName', 'email']`. */
  required?: readonly (keyof ProfileFormValues)[];
  loading?: boolean;
  disabled?: boolean;
  /** Avatar or initials block above the fields; the caller owns upload. */
  avatar?: ReactNode;
  /** Hint under the avatar, e.g. accepted formats and size limit. */
  avatarHint?: ReactNode;
  displayNameLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  jobTitleLabel?: string;
  departmentLabel?: string;
  submitLabel?: string;
  cancelLabel?: string;
  /** Renders the secondary cancel button when set. */
  onCancel?: () => void;
  /**
   * Extra class for the **root wrapper** (the element that sits in the caller's layout), so
   * placement (`flex`, `grid-column`, `margin`) takes effect. The `<form>` keeps its own class;
   * style its descendants from here if needed.
   */
  className?: string;
}
