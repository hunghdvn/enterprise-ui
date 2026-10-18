import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Button } from '../Button/Button';
import { useIsMobile } from '../internal/useIsMobile';
import styles from './SplitView.module.css';
import type { SplitViewProps } from './types';

const DEFAULT_MASTER_WIDTH = 380;
const DEFAULT_MASTER_HEIGHT = 280;
const KEYBOARD_STEP = 8;

interface DragState {
  pointerId: number;
  startSize: number;
  startX: number;
  startY: number;
}

function clamp(value: number, min: number, max: number | undefined): number {
  return Math.max(min, Math.min(value, max === undefined ? Infinity : max));
}

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
  masterHeight = 280,
  orientation = 'horizontal',
  resizable = true,
  minSize = 280,
  maxSize,
  onMasterWidthChange,
  onMasterHeightChange,
  backLabel = 'Quay lại',
}: SplitViewProps) {
  const isMobile = useIsMobile();
  const detailRef = useRef<HTMLDivElement | null>(null);
  const masterRef = useRef<HTMLDivElement | null>(null);
  // Previous key across runs (`undefined` = not seen yet): focus moves only
  // on the null→key transition, never on mount — a preselected mobile load
  // must not steal focus with no user selection.
  const prevKey = useRef<string | null | undefined>(undefined);

  const isVertical = orientation === 'vertical';
  // Controlled size along the active axis. The parent owns it — SplitView
  // only reflects `masterWidth`/`masterHeight` and reports changes back.
  const currentSize = isVertical ? masterHeight : masterWidth;
  const defaultSize = isVertical ? DEFAULT_MASTER_HEIGHT : DEFAULT_MASTER_WIDTH;
  const sizeStyle = isVertical ? { height: currentSize } : { width: currentSize };

  const dragRef = useRef<DragState | null>(null);
  const report = (next: number) => {
    const clamped = clamp(next, minSize, maxSize);
    if (isVertical) onMasterHeightChange?.(clamped);
    else onMasterWidthChange?.(clamped);
  };
  const beginDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Only the primary button starts a drag (right/middle must not). A pointer
    // down always clears any stale drag first (self-healing on touch).
    if (e.button !== 0) return;
    const onChange = isVertical ? onMasterHeightChange : onMasterWidthChange;
    if (!onChange) return;
    e.preventDefault();
    e.currentTarget.focus();
    // Pointer capture keeps the move stream while the cursor leaves the window.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no pointer-capture support; window listeners below are the fallback */
    }
    dragRef.current = {
      pointerId: e.pointerId,
      startSize: currentSize,
      startX: e.clientX,
      startY: e.clientY,
    };
    const move = (ev: PointerEvent) => {
      const d = dragRef.current;
      // A foreign pointer must neither drive nor end this drag.
      if (!d || ev.pointerId !== d.pointerId) return;
      if (ev.buttons === 0) {
        endDrag(ev);
        return;
      }
      const delta = isVertical ? ev.clientY - d.startY : ev.clientX - d.startX;
      report(d.startSize + delta);
    };
    const endDrag = (ev?: PointerEvent) => {
      if (ev && dragRef.current && ev.pointerId !== dragRef.current.pointerId) return;
      dragRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
  };
  const onSplitterKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const onChange = isVertical ? onMasterHeightChange : onMasterWidthChange;
    if (!onChange) return;
    const isAxisKey = isVertical
      ? e.key === 'ArrowUp' || e.key === 'ArrowDown'
      : e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      report(defaultSize);
      return;
    }
    if (!isAxisKey) return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    report(currentSize + dir * (e.shiftKey ? 4 : 1) * KEYBOARD_STEP);
  };

  // Screen-reader users get no announcement on an instant pane swap — move
  // focus into the detail when it appears from a selection, preferring the
  // detail heading over the bare container; moving back returns focus to the
  // master pane so keyboard/SR users don't land on body.
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
      <div className={styles.split} data-orientation={orientation}>
        <div className={styles.master} style={sizeStyle}>
          {master}
        </div>
        {resizable && (
          <div
            role="separator"
            aria-orientation={isVertical ? 'horizontal' : 'vertical'}
            aria-label="Thay đổi kích thước"
            aria-valuemin={minSize}
            aria-valuenow={currentSize}
            aria-valuemax={maxSize}
            tabIndex={0}
            onPointerDown={beginDrag}
            onKeyDown={onSplitterKeyDown}
            className={
              isVertical ? `${styles.splitter} ${styles.splitterVertical}` : styles.splitter
            }
          >
            <span
              className={isVertical ? styles.splitterGripVertical : styles.splitterGrip}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          </div>
        )}
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
        <Button variant="ghost" size="sm" onClick={onBack} aria-label={backLabel || 'Quay lại'}>
          ‹ {backLabel}
        </Button>
      </div>
      <div ref={detailRef} tabIndex={-1} className={styles.detailFocus}>
        {detail}
      </div>
    </div>
  );
}
