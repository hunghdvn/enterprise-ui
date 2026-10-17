import type { ReactNode } from 'react';
import styles from './Empty.module.css';
import type { EmptyProps } from './types';

function isPresent(value: ReactNode): boolean {
  return value != null && value !== false && value !== '' && value !== 0;
}

const DEFAULT_ICON = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="6" y="6" width="36" height="36" rx="4" />
  </svg>
);

export function Empty({ description, action, icon }: EmptyProps) {
  const desc = description ?? 'Không có dữ liệu';
  return (
    <div className={styles.root}>
      <div className={styles.icon}>{isPresent(icon) ? icon : DEFAULT_ICON}</div>
      <div className={styles.description}>{desc}</div>
      {isPresent(action) && <div className={styles.action}>{action}</div>}
    </div>
  );
}
