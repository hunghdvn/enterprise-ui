import type { ReactNode } from 'react';

export type NotificationKind = 'info' | 'success' | 'warning' | 'danger';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  /** Pre-formatted by the parent (e.g. "2 phút trước"). */
  time: string;
  unread?: boolean;
  kind?: NotificationKind;
  icon?: ReactNode;
}

/**
 * Presentational-only notification bell + panel (P2). The parent owns the
 * notification list and all read/unread state; the component renders the
 * trigger, badge and panel and reports `onSelect` / `onMarkRead` /
 * `onMarkAllRead` / `onRemove`.
 */
export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead?: () => void;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
