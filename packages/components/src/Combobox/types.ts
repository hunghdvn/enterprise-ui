import type { InputHTMLAttributes, ReactNode } from 'react';

export interface ComboboxOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Text used for filtering when `label` is not a string. */
  searchText?: string;
}

/**
 * Single-select (`multiple=false`) values are `string`; multi is `string[]`.
 * The component narrows by `multiple` at runtime (spec §3: `string | string[]`).
 *
 * Extends `InputHTMLAttributes` so the widget integrates with a `Field`/`Form`
 * wrapper that clones `id`, `name`, `aria-describedby`, `aria-invalid`, etc.
 * onto the real `<input>` (review #11). Combobox-specific props shadow the
 * native ones with the narrower signatures below.
 */
export interface ComboboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'onChange'
  | 'size'
  | 'value'
  | 'defaultValue'
  | 'multiple'
  | 'readOnly'
  | 'aria-label'
  | 'aria-labelledby'
> {
  options: ComboboxOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  minSelectWidth?: number;
  maxDropdownHeight?: number;
  /** Re-declared after the Omit so a `Field` wrapper can forward them (#11). */
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
