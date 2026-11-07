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

export interface SettingsProfileProps {
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
