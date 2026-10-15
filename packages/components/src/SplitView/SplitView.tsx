import { useEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import { useIsMobile } from '../internal/useIsMobile';
import styles from './SplitView.module.css';
import type { SplitViewProps } from './types';

/**
 * Master-detail 2-pane: side-by-side on desktop, single-pane with back
 * navigation on mobile. Mobile panes render unboxed full-bleed by design
 * (no card surface) — the desktop card treatment would waste 360px widths.
 */
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
  const masterRef = useRef<HTMLDivElement | null>(null);
  // Previous key across runs (`undefined` = not seen yet): focus moves only
  // on real transitions, never on mount — a preselected mobile load must not
  // steal focus with no user selection (finding 6).
  const prevKey = useRef<string | null | undefined>(undefined);

  // Screen-reader users get no announcement on an instant pane swap — move
  // focus into the detail when it appears from a selection, preferring the
  // detail heading over the bare container; moving back returns focus to the
  // master pane so keyboard/SR users don't land on body (finding 7).
  useEffect(() => {
    if (!isMobile) {
      prevKey.current = selectedKey;
      return;
    }
    if (prevKey.current === null && selectedKey !== null) {
      const root = detailRef.current;
      const heading = root?.querySelector<HTMLElement>('h1, h2, [data-autofocus]');
      if (heading) {
        // Headings are not focusable by default — make this one
        // programmatically focusable without changing its tab order.
        if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
        heading.focus();
      } else root?.focus();
    } else if (prevKey.current != null && selectedKey === null) {
      masterRef.current?.focus();
    }
    prevKey.current = selectedKey;
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

  const showDetail = selectedKey !== null;
  if (!showDetail) {
    return (
      <div ref={masterRef} tabIndex={-1} className={styles.single}>
        {master}
      </div>
    );
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
