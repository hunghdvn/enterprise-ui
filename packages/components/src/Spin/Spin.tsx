import styles from './Spin.module.css';
import type { SpinProps } from './types';

export function Spin({ size = 'md', tip, fullscreen = false }: SpinProps) {
  const spinner = (
    <span className={`${styles.spinner} ${styles[size]}`} role="status" aria-live="polite" />
  );

  const content = (
    <>
      {spinner}
      {tip && <span className={styles.tip}>{tip}</span>}
    </>
  );

  if (fullscreen) {
    return <div className="fullscreen">{content}</div>;
  }

  return <div className={styles.root}>{content}</div>;
}
