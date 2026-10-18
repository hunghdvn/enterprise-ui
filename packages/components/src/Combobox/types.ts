import type { ReactNode } from 'react';

export interface ComboboxOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Text used for filtering when `label` is not a string. */
  searchText?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  minSelectWidth?: number;
  maxDropdownHeight?: number;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
