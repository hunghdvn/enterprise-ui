import styles from './KpiCard.module.css';
import type { KpiCardProps } from './types';

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
        {icon != null && icon !== 0 && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      {delta != null && delta !== 0 && (
        <div className={styles.delta} data-tone={deltaTone}>
          <span className={styles.dot} aria-hidden="true" />
          <span>{delta}</span>
        </div>
      )}
      {children}
    </div>
  );
}
