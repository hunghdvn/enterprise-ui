import type { InputHTMLAttributes, ReactNode } from 'react';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value'
> {
  /** Required: the value emitted by the group and submitted by the form. */
  value: string;
  /** Visible label text — the radio's accessible name. Required. */
  children: ReactNode;
  size?: 'sm' | 'md';
}
