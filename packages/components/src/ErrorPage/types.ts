import type { ReactNode } from 'react';

/** Route-level statuses the template ships defaults for. */
export type ErrorStatus = 403 | 404 | 500;

/** Landmark wrapper for the page content. Use `div` when the page already has a `main`. */
export type ErrorPageLandmark = 'main' | 'div' | 'section';

export interface ErrorPageProps {
  /**
   * HTTP status; selects the default icon, title and description (required).
   * An unsupported value falls back to the 500 copy instead of throwing, so a
   * `status={res.status as ErrorStatus}` call site cannot break the page.
   */
  status: ErrorStatus;
  /** Override the default title; null/empty falls back to the status default. */
  title?: ReactNode;
  /** Override the default description; null or '' hides it. */
  description?: ReactNode;
  /** Override the default icon; null hides it. */
  icon?: ReactNode;
  /** Recovery actions (buttons/links); the caller owns navigation and retry. */
  actions?: ReactNode;
  /** Heading level (default 1; use 3 inside a modal whose title is already an h2). */
  level?: 1 | 2 | 3;
  /** Wrapper element; default `main`. */
  as?: ErrorPageLandmark;
  /**
   * Fill the viewport height (default true); set false when embedding in a page or modal.
   * Inside AppShell or any layout that already renders a page header, pass `fill={false}` —
   * a `100dvh` root under a header always scrolls.
   * The page is an inline-size container: inside a shrink-to-fit parent (inline-block, a flex
   * item without a width, an absolutely positioned box without a width) give it an explicit width.
   */
  fill?: boolean;
  className?: string;
}
