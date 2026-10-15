import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Renders a back button when set. */
  onBack?: () => void;
  backLabel?: string;
  className?: string;
  /** Heading level for the title (page titles should be h1). */
  level?: 1 | 2;
}
