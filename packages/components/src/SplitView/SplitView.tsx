import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Button } from '../Button/Button';
import { useIsMobile } from '../internal/useIsMobile';
import type { SplitViewProps } from './types';
import styles from './SplitView.module.css';

const DEFAULT_MASTER_WIDTH = 380;
const DEFAULT_MASTER_HEIGHT = 280;
const KEYBOARD_STEP = 8;
const MAX_SIZE_RATIO = 0.8;

function clamp(value: number, min: number, max: number): number {
  // Single source of truth for dragging/keyboard bounds (clean N7). `max` is
  // always a real number at the call sites — Infinity means "no upper clamp" —
  // so there is no `undefined` branch to drift out of sync. The floor is always
  // >= 1 so the master pane can never collapse to a 0px sliver (mirrors
  // Table's `Math.max(1, minColumnWidth)`).
  return Math.max(min, Math.min(value, max));
}

/**
 * Master-detail 2-pane: side-by-side on desktop, single-pane with back
 * navigation on mobile. Mobile panes render unboxed full-bleed by design
 * (no card surface) — the desktop card treatment would waste 360px widths.
 *
 * The master pane size is **controlled**: the parent passes `masterWidth`/
 * `masterHeight` and owns the state, reporting changes back via
 * `onMasterWidthChange` / `onMasterHeightChange`. SplitView never stores the
 * size internally (a drag is "live" — it reports deltas immediately, like the
 * Table column resize handle).
 */
export function SplitView({
  master,
  detail,
  selectedKey,
  onBack,
  masterWidth = DEFAULT_MASTER_WIDTH,
  masterHeight = DEFAULT_MASTER_HEIGHT,
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Previous key across runs (`undefined` = not seen yet): focus moves only
  // on the null→key transition, never on mount — a preselected mobile load
  // must not steal focus with no user selection.
  const prevKey = useRef<string | null | undefined>(undefined);

  const isVertical = orientation === 'vertical';
  // Controlled size along the active axis. The parent owns it — SplitView
  // only reflects `masterWidth`/`masterHeight` and reports changes back.
  const currentSize = isVertical ? masterHeight : masterWidth;
  const defaultSize = isVertical ? DEFAULT_MASTER_HEIGHT : DEFAULT_MASTER_WIDTH;

  // The hard floor always leaves room for the grip so the master pane can
  // never collapse to a 0px sliver (mirrors Table's `Math.max(1, minColumnWidth)`).
  const minFloor = Math.max(1, minSize);

  // Default ceiling = 0.8× the measured track. Track layout is unavailable
  // in jsdom/SSR/before first paint → undefined (treated as no clamp by
  // `clamp`), so behavior in tests/docs is unchanged unless the consumer
  // passes `maxSize` explicitly.
  const [trackSize, setTrackSize] = useState(0);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const measure = () => {
      const sz = isVertical ? node.clientHeight : node.clientWidth;
      if (sz > 0) setTrackSize(sz);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(node);
    return () => ro.disconnect();
  }, [isVertical, isMobile]);

  const defaultMax =
    maxSize !== undefined
      ? maxSize
      : trackSize > 0
        ? Math.round(trackSize * MAX_SIZE_RATIO)
        : undefined;
  // Keep the ceiling >= the floor so aria-valuenow is never out of
  // [valuemin, valuemax]; an undefined ceiling stays a no-clamp (Infinity).
  const effectiveMax = defaultMax === undefined ? Infinity : Math.max(defaultMax, minFloor);

  // Reconcile the controlled size into the legal range in ONE place: this
  // clamped value drives the rendered width/height, aria-valuenow and the
  // drag/keyboard origin, so size, ARIA and the keyboard step can never
  // disagree (review N1). `Infinity` (no clamp) leaves currentSize untouched.
  const effectiveSize = clamp(currentSize, minFloor, effectiveMax);
  const sizeStyle = isVertical ? { height: effectiveSize } : { width: effectiveSize };

  // Latest props visible to pointer/keyboard handlers that outlive a render
  // (so an orientation/bounds/handler change mid-drag is reflected live).
  const liveRef = useRef<{
    isVertical: boolean;
    currentSize: number;
    effectiveSize: number;
    minFloor: number;
    effectiveMax: number;
    onW: ((size: number) => void) | undefined;
    onH: ((size: number) => void) | undefined;
  }>({
    isVertical,
    currentSize,
    effectiveSize,
    minFloor,
    effectiveMax,
    onW: onMasterWidthChange,
    onH: onMasterHeightChange,
  });
  // Refs must not be written during render — keep the snapshot current from a
  // layout effect so handlers attached to `window` (which outlive the render
  // that created them) see the latest bounds/axis (finding #8).
  useLayoutEffect(() => {
    liveRef.current = {
      isVertical,
      currentSize,
      effectiveSize,
      minFloor,
      effectiveMax,
      onW: onMasterWidthChange,
      onH: onMasterHeightChange,
    };
  }, [
    isVertical,
    currentSize,
    effectiveSize,
    minFloor,
    effectiveMax,
    onMasterWidthChange,
    onMasterHeightChange,
  ]);

  const report = useCallback((next: number) => {
    const l = liveRef.current;
    const clamped = clamp(next, l.minFloor, l.effectiveMax);
    if (l.isVertical) l.onH?.(clamped);
    else l.onW?.(clamped);
  }, []);

  // The active drag's teardown. Window listeners belong to the drag, not the
  // component lifetime: a second `pointerdown` (or an unmount before release)
  // drops the stale listener pair so a dead caller is never reported to and
  // no listeners leak (mirrors Table.tsx:547-604).
  const teardownRef = useRef<(() => void) | null>(null);
  useEffect(
    () => () => {
      teardownRef.current?.();
      teardownRef.current = null;
    },
    [],
  );

  const beginDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Only the primary button starts a drag (right/middle must not). The
    // take-over below also clears any stale drag on pointerdown — without it a
    // lost pointerup (touch/cancel) would deadlock the next pointerId forever.
    if (e.button !== 0) return;
    const l = liveRef.current;
    const onChange = l.isVertical ? l.onH : l.onW;
    // Intentionally inert per spec G1/G4: a handle that cannot report stays
    // rendered (NOT removed like Table's, which returns null without a handler).
    // `no onMasterWidthChange keeps the splitter inert` is the locked contract.
    if (!onChange) return;
    e.preventDefault();
    // Capture the element once: React 18 nulls `currentTarget` after dispatch,
    // which would make releasePointerCapture below a silent no-op (cleanup N5).
    const el = e.currentTarget;
    el.focus(); // preventDefault suppressed click-focus, so focus by hand
    // Tear down any stale drag BEFORE capturing the new pointer, so we never
    // release the just-captured pointer (cleanup N5 ordering).
    teardownRef.current?.();
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* no-op: window listeners below are the fallback */
    }
    const startSize = l.effectiveSize;
    const startX = e.clientX;
    const startY = e.clientY;
    const pointerId = e.pointerId;
    const move = (ev: PointerEvent) => {
      // A foreign pointer must neither drive nor end this drag. A primary move
      // with no button held still ends it (lost pointerup).
      if (ev.pointerId !== pointerId) return;
      if (ev.buttons === 0) {
        end();
        return;
      }
      const live = liveRef.current;
      const delta = live.isVertical ? ev.clientY - startY : ev.clientX - startX;
      report(startSize + delta); // report() is the single clamp site (cleanup N7)
    };
    const end = (ev?: PointerEvent) => {
      // A second pointer's release must not end the first pointer's drag.
      if (ev && ev.pointerId !== pointerId) return;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      try {
        el.releasePointerCapture(pointerId);
      } catch {
        /* no-op */
      }
      teardownRef.current = null;
    };
    teardownRef.current = end;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  const onSplitterKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const l = liveRef.current;
    const onChange = l.isVertical ? l.onH : l.onW;
    if (!onChange) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault(); // Backspace would navigate back in some browsers
      report(defaultSize);
      return;
    }
    const isAxisKey = isVertical
      ? e.key === 'ArrowUp' || e.key === 'ArrowDown'
      : e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    if (!isAxisKey) return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    report(l.effectiveSize + dir * (e.shiftKey ? 4 : 1) * KEYBOARD_STEP);
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
      <div ref={containerRef} className={styles.split} data-orientation={orientation}>
        <div className={styles.master} style={sizeStyle}>
          {master}
        </div>
        {resizable && (
          <div
            role="separator"
            aria-orientation={isVertical ? 'horizontal' : 'vertical'}
            aria-label="Thay đổi kích thước"
            aria-valuemin={minFloor}
            aria-valuenow={effectiveSize}
            aria-valuemax={effectiveMax === Infinity ? undefined : effectiveMax}
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
