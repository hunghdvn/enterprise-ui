import type { ButtonHTMLAttributes } from 'react';

export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'success';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
}
