import type { ReactNode } from 'react';

export interface SettingsSection {
  /** Stable id used by `activeKey` / `onSectionChange`. */
  key: string;
  /** Nav label; also the heading text of the pane. */
  label: string;
  /** Muted line under the pane heading. */
  description?: ReactNode;
  /** Pane body: a form, a group of toggles, a danger zone. */
  content: ReactNode;
}

/**
 * Wrapper element. `main` (default) is right for a standalone page; AppShell's content area is a
 * `div` with its own `<header>`, so the template must supply the landmark and scope its header
 * inside it (a `header` inside `main` is not a `banner`). Pass `div` when the page already renders
 * its own `<main>`, e.g. embedded in a docs page or a modal.
 */
export type SettingsProfileLandmark = 'main' | 'div' | 'section';

export interface SettingsProfileProps {
  /**
   * Wrapper element; default `main`. Keep `main` inside AppShell — its content area is a `div`,
   * so the page would otherwise lose its main landmark. Use `div` only when an ancestor already
   * renders `<main>`.
   */
  as?: SettingsProfileLandmark;
  /** Page heading; default 'Cài đặt'. */
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Header actions (invite, export, audit log). */
  actions?: ReactNode;
  sections: SettingsSection[];
  /** Controlled active section; omit for uncontrolled. */
  activeKey?: string;
  /** Initial section when uncontrolled; defaults to the first section. */
  defaultActiveKey?: string;
  onSectionChange?: (key: string) => void;
  /** Accessible name for the section nav landmark; default 'Mục cài đặt'. */
  navLabel?: string;
  /** Page heading level; default 1. Panes then use h2 (h3 when this is 2). */
  level?: 1 | 2;
  className?: string;
}
