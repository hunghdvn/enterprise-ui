import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'success';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
  /** Optional leading decorative icon content, hidden from assistive technology via aria-hidden. */
  icon?: ReactNode;
}
