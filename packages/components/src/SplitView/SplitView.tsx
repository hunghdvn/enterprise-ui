import { useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import { useIsMobile } from '../internal/useIsMobile';
import styles from './SplitView.module.css';
import type { SplitViewProps } from './types';

export function SplitView({
  master,
  detail,
  selectedKey,
  onBack,
  masterWidth = 380,
  backLabel = 'Quay lại',
}: SplitViewProps) {
  const isMobile = useIsMobile();
  const detailRef = useRef<HTMLDivElement | null>(null);
  const showDetail = !isMobile || selectedKey !== null;

  // Screen-reader users get no announcement on an instant pane swap — move
  // focus to the detail container when the mobile detail appears.
  useEffect(() => {
    if (isMobile && selectedKey !== null) detailRef.current?.focus();
  }, [isMobile, selectedKey]);

  if (!isMobile) {
    return (
      <div className={styles.split}>
        <div className={styles.master} style={{ width: masterWidth }}>
          {master}
        </div>
        <div className={styles.detail}>{detail}</div>
      </div>
    );
  }

  if (!showDetail) {
    return <div className={styles.single}>{master}</div>;
  }

  return (
    <div className={styles.single}>
      <div className={styles.mobileBar}>
        <Button variant="ghost" size="sm" onClick={onBack} aria-label={backLabel}>
          ‹ {backLabel}
        </Button>
      </div>
      <div ref={detailRef} tabIndex={-1} className={styles.detailFocus}>
        {detail}
      </div>
    </div>
  );
}
