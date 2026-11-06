import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  /** Logo or product mark shown above the title. */
  brand?: ReactNode;
  /** Page heading. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** Form or message content. */
  children: ReactNode;
  /** Secondary links or legal copy under the content. */
  footer?: ReactNode;
  /** Marketing panel; when set, desktop renders two columns. */
  aside?: ReactNode;
  /** Accessible name for the complementary landmark. */
  asideLabel?: string;
  /** Heading level for the title (default 1; use 2 when nested under a page heading). */
  level?: 1 | 2;
  className?: string;
}
