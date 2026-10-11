import type { HTMLAttributes } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'blue' | 'orange' | 'green' | 'red' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className = '', children, ...rest }: BadgeProps) {
  return (
    <span data-tone={tone} className={`${styles.badge} ${className}`} {...rest}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
