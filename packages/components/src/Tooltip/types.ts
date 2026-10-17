import type { ReactElement, ReactNode } from 'react';
export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}
