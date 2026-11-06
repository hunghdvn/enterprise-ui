import type { ReactNode } from 'react';

/** Landmark wrapper for the content column. Use `div` when the page already has a `main`. */
export type AuthLayoutLandmark = 'main' | 'div' | 'section';

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
  /** Marketing panel; when set, the layout renders two columns if it is wide enough. */
  aside?: ReactNode;
  /** Accessible name for the complementary landmark. */
  asideLabel?: string;
  /** Heading level for the title (default 1; use 2 when nested under a page heading). */
  level?: 1 | 2;
  /** Wrapper element for the card column; default `main`. */
  as?: AuthLayoutLandmark;
  /**
   * Fill the viewport height (default true); set false when embedding in a page or modal.
   * The layout is an inline-size container: inside a shrink-to-fit parent (inline-block, a flex
   * item without a width, an absolutely positioned box without a width) give it an explicit width.
   */
  fill?: boolean;
  className?: string;
}
