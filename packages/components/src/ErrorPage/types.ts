import type { ReactNode } from 'react';

/** Route-level statuses supported by the template. */
export type ErrorStatus = 403 | 404 | 500;

/** Landmark wrapper for the page content. Use `div` when the page already has a `main`. */
export type ErrorPageLandmark = 'main' | 'div' | 'section';

export interface ErrorPageProps {
  /** HTTP status; drives the default icon, title and description. */
  status: ErrorStatus;
  /** Override the default title; null/empty falls back to the status default. */
  title?: ReactNode;
  /** Override the default description; null or '' hides it. */
  description?: ReactNode;
  /** Override the default icon; null hides it. */
  icon?: ReactNode;
  /** Recovery actions (buttons/links); the caller owns navigation and retry. */
  actions?: ReactNode;
  /** Heading level (default 1; use 2 when nested under a page heading). */
  level?: 1 | 2;
  /** Wrapper element; default `main`. */
  as?: ErrorPageLandmark;
  /**
   * Fill the viewport height (default true); set false when embedding in a page or modal.
   * The page is an inline-size container: inside a shrink-to-fit parent (inline-block, a flex
   * item without a width, an absolutely positioned box without a width) give it an explicit width.
   */
  fill?: boolean;
  className?: string;
}
