import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Renders a back button when set. */
  onBack?: () => void;
  backLabel?: string;
}
