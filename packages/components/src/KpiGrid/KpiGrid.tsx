import styles from './KpiGrid.module.css';
import type { KpiGridProps } from './types';

export function KpiGrid({ children, minCardWidth = 220 }: KpiGridProps) {
  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))` }}
    >
      {children}
    </div>
  );
}
