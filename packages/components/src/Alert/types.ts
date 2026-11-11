import type { HTMLAttributes, ReactNode } from 'react';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visual and semantic tone. Default `'info'`. */
  tone?: AlertTone;
  /** Optional bold heading above the message. */
  title?: ReactNode;
  /** Message body. */
  children?: ReactNode;
  /** Shows the close button and fires when it is pressed. */
  onDismiss?: () => void;
  /** Accessible name for the close button. Default `'Đóng thông báo'`. */
  dismissLabel?: string;
}
