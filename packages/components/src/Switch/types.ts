import type { InputHTMLAttributes, ReactNode } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visible label text — the switch's accessible name. Required. */
  children: ReactNode;
  size?: 'sm' | 'md';
}
