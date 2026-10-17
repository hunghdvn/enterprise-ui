import type { ReactNode } from 'react';
import styles from './DemoPlayground.module.css';

export interface DemoPlaygroundProps {
  children: ReactNode;
  controls?: ReactNode;
}

export function DemoPlayground({ children, controls }: DemoPlaygroundProps) {
  return (
    <div className={styles.playground}>
      {controls && <div className={styles.controls}>{controls}</div>}
      <div className={styles.demo}>{children}</div>
    </div>
  );
}
