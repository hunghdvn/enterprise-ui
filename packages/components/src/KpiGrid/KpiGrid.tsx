import styles from './KpiGrid.module.css';
import type { KpiGridProps } from './types';

export function KpiGrid({ children, minCardWidth = 220 }: KpiGridProps) {
  // Caller misuse must not collapse the grid: non-finite falls back to the
  // default, tiny values floor at one readable card width.
  const safe = Number.isFinite(minCardWidth) ? Math.max(120, minCardWidth) : 220;
  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${safe}px, 1fr))` }}
    >
      {children}
    </div>
  );
}
