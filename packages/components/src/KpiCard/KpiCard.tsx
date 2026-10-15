import type { ReactNode } from 'react';
import styles from './KpiCard.module.css';
import type { KpiCardProps } from './types';

/**
 * Slot content actually renders something: `null`/`undefined`/`false` are
 * absent by design, and `""`/`0` would leave an empty pill or a stray "0"
 * (follow-up N1) — so they count as absent too.
 */
function isPresent(value: ReactNode): boolean {
  return value != null && value !== false && value !== '' && value !== 0;
}

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = 'neutral',
  icon,
  children,
}: KpiCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {isPresent(icon) && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      {isPresent(delta) && (
        <div className={styles.delta} data-tone={deltaTone}>
          <span className={styles.dot} aria-hidden="true" />
          <span>{delta}</span>
        </div>
      )}
      {children}
    </div>
  );
}
