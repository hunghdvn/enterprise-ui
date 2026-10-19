import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Button } from '../Button/Button';
import { matchesMobileMedia, useIsMobile } from '../internal/useIsMobile';
import type { SplitViewProps } from './types';
import styles from './SplitView.module.css';

const DEFAULT_MASTER_WIDTH = 380;
const DEFAULT_MASTER_HEIGHT = 280;
const DEFAULT_MIN_SIZE = 280;
const KEYBOARD_STEP = 8;
const MAX_SIZE_RATIO = 0.8;

function clamp(value: number, min: number, max: number): number {
  // Single source of truth for the bounds math (N7). `max` is always a real
  // number at the call sites — `Infinity` means "no upper clamp" — so there is
  // no `undefined` branch to drift out of sync.
  return Math.max(min, Math.min(value, max));
}

// Non-finite fallback for the size inputs: TS-legal NaN/Infinity (a missed
// `Number()` parse) must never reach style, ARIA or a report.
function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

// Latest props visible to pointer/keyboard handlers that outlive a render
// (so an orientation/bounds/handler change mid-drag is reflected live).
type LiveSnapshot = {
  isVertical: boolean;
  effectiveSize: number;
  minFloor: number;
  effectiveMax: number;
  onW: ((size: number) => void) | undefined;
  onH: ((size: number) => void) | undefined;
};

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
 *
 * `minSize`/`maxSize` bind wherever the component itself sizes the pane:
 * while `resizable`, the rendered size, `aria-valuenow` and the drag/keyboard
 * origin all derive from one clamped value (N1), and a clamp that rewrites
 * the caller's value is reported back ONCE so the parent's state converges
 * with the UI (measured-cap shrink must not strand the parent on a stale
 * size). A locked pane (`resizable={false}`) renders no splitter/ARIA and
 * shows the caller's size verbatim.
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
  minSize = DEFAULT_MIN_SIZE,
  maxSize,
  onMasterWidthChange,
  onMasterHeightChange,
  backLabel = 'Quay lại',
}: SplitViewProps) {
  const isMobile = useIsMobile();
  // `isMobile` is two-phase by design (false until the hook's effect
  // confirms) — a real phone's first commit would otherwise paint the desktop
  // pane and let a stray pointerdown reach the parent (round-4 #3). One live
  // media read settles the RENDER BRANCH — which is what makes the
  // drag/keyboard handlers unreachable on a phone's first commit — plus the
  // measure effect and the reconcile gate; the hook's change listener keeps
  // both in sync afterwards. SSR caveat: an SSR hydrate on a phone would
  // mismatch (server renders desktop, this read renders mobile) — the
  // package targets Vite CSR; revisit with `useSyncExternalStore` if SSR
  // lands (round-5 #2).
  const mobileLayout = isMobile || matchesMobileMedia();
  // Single predicate for "a splitter exists to reconcile with": the desktop
  // render's splitter conditional and the reconcile gate must never drift.
  const showSplitter = resizable && !mobileLayout;
  const detailRef = useRef<HTMLDivElement | null>(null);
  const masterRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Previous key across runs (`undefined` = not seen yet): focus moves only
  // on the null→key transition, never on mount — a preselected mobile load
  // must not steal focus with no user selection.
  const prevKey = useRef<string | null | undefined>(undefined);

  const isVertical = orientation === 'vertical';
  const defaultSize = isVertical ? DEFAULT_MASTER_HEIGHT : DEFAULT_MASTER_WIDTH;
  // Controlled size along the active axis. The parent owns it — SplitView
  // only reflects `masterWidth`/`masterHeight` and reports changes back.
  // Non-finite controlled sizes are TS-legal (e.g. a missed `Number()` parse)
  // and poison style/ARIA, so they fall back to the axis default — silently,
  // on locked panes too. The written contract lives in `types.ts` (round-5 #2).
  const rawSize = isVertical ? masterHeight : masterWidth;
  const currentSize = finiteOr(rawSize, defaultSize);

  // minSize joins masterWidth/masterHeight (fallback above) and maxSize
  // (below): all four size inputs fall back to their defaults when
  // non-finite, so nothing can render or report "NaN" (round-3 item 4 +
  // round-4 #2). `minFloor` keeps the resizable pane from collapsing to a
  // 0px sliver (mirrors Table's `Math.max(1, minColumnWidth)`); a locked pane
  // renders the caller's size verbatim — 0 included.
  const safeMin = finiteOr(minSize, DEFAULT_MIN_SIZE);
  const minFloor = Math.max(1, safeMin);

  // Default ceiling = 0.8× the measured track. Track layout is unavailable
  // in jsdom/SSR/before first paint → `undefined`, which `effectiveMax` below
  // maps to `Infinity` (no upper clamp), so behavior in tests/docs is
  // unchanged unless the consumer passes `maxSize` explicitly.
  const [trackSize, setTrackSize] = useState(0);
  // Set while a re-measure is in flight: the reconcile effect must not act on
  // the PREVIOUS track's cap (round-6 #1 — on an orientation flip the stale
  // cap silently shrank a persisted 900 to the old 480 and nothing restored
  // it). Cleared by `seenTrackRef` once the fresh measurement has rendered.
  const measurePendingRef = useRef(false);
  const seenTrackRef = useRef(0);
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const measure = () => {
      const sz = isVertical ? node.clientHeight : node.clientWidth;
      // Compare against the last CONSUMED measurement (not the state) so a
      // re-observation of the same size never re-triggers a pending cycle.
      if (sz > 0 && sz !== seenTrackRef.current) {
        measurePendingRef.current = true;
        setTrackSize(sz);
      }
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(node);
    return () => ro.disconnect();
  }, [isVertical, mobileLayout]);
  // Runs after every commit where the track changed (declared before the
  // reconcile effect): the fresh cap is now visible, so episodes may resume.
  // The seen-value guard keeps the mount run (same 0) from clearing a pending
  // flag the measure effect just set in the same flush.
  useEffect(() => {
    if (seenTrackRef.current !== trackSize) {
      seenTrackRef.current = trackSize;
      measurePendingRef.current = false;
    }
  }, [trackSize]);

  // `maxSize={Infinity}` is an explicit "no ceiling" (a `hasLimit ? l : Infinity`
  // pattern) — honored verbatim: no clamp and no `aria-valuemax`, even after
  // the track is measured. Other non-finite values (NaN from a missed parse)
  // fall back to the measured default (round-4 #4). `Number.isFinite`
  // swallows `undefined` too, so no separate undefined check is needed.
  const explicitNoCap = maxSize === Infinity;
  const safeMax = Number.isFinite(maxSize) ? maxSize : undefined;
  const defaultMax = explicitNoCap
    ? undefined
    : safeMax !== undefined
      ? safeMax
      : trackSize > 0
        ? Math.round(trackSize * MAX_SIZE_RATIO)
        : undefined;
  // Keep the ceiling >= the floor so aria-valuenow is never out of
  // [valuemin, valuemax]; an undefined ceiling stays a no-clamp (Infinity).
  const effectiveMax = defaultMax === undefined ? Infinity : Math.max(defaultMax, minFloor);

  // Reconcile the controlled size into the legal range in ONE place — but only
  // where the component itself sizes the pane. While `resizable` the splitter
  // (and its ARIA) renders, so this clamped value drives the rendered
  // width/height, aria-valuenow and the drag/keyboard origin together, and
  // aria-valuenow can never fall outside [valuemin, valuemax] (review N1).
  // A locked pane (`resizable={false}`) renders no splitter/ARIA at all and
  // shows the caller's value VERBATIM: the caller owns a static split
  // completely, and min/max never silently rewrite it (review M2 — the docs
  // always said the bounds apply to dragging while the code clamped even the
  // locked path).
  const effectiveSize = resizable ? clamp(currentSize, minFloor, effectiveMax) : currentSize;
  const sizeStyle = isVertical ? { height: effectiveSize } : { width: effectiveSize };

  // One builder for the handler snapshot: the type, the ref init and the
  // layout-effect refresh all share it, so a field can never be added to one
  // copy and forgotten in another (review item 6 — `currentSize` used to live
  // here as a write-only field after N1 moved every reader to `effectiveSize`).
  const buildSnapshot = (): LiveSnapshot => ({
    isVertical,
    effectiveSize,
    minFloor,
    effectiveMax,
    onW: onMasterWidthChange,
    onH: onMasterHeightChange,
  });
  const liveRef = useRef<LiveSnapshot>(buildSnapshot());
  // Refs must not be written during render — refresh from a layout effect.
  // No dependency array: it runs after every render, so handlers attached to
  // `window` (which outlive the render that created them) always see the
  // latest bounds/axis (finding #8) and a forgotten dep can never stale them.
  useLayoutEffect(() => {
    liveRef.current = buildSnapshot();
  });

  const report = useCallback((next: number) => {
    const l = liveRef.current;
    const clamped = clamp(next, l.minFloor, l.effectiveMax);
    if (l.isVertical) l.onH?.(clamped);
    else l.onW?.(clamped);
  }, []);

  // Converge the parent's state with the rendered size whenever a clamp had
  // to rewrite the caller's value (round-3 item 3): a persisted
  // `masterWidth={900}` from a wider window must not sit at 900 in the parent
  // while the measured cap renders 400 — the first drag would otherwise jump
  // ~500px. One report per out-of-range EPISODE. The episode is identified by
  // the RAW caller input + axis + rendered value: keying on the sanitized
  // value aliased distinct caller inputs (a NaN mount and a later 380 mount
  // shared one episode, so the second was never reported — round-5 #1b), and
  // an axis-blind key let an ignored width report swallow the height report
  // after an orientation flip (round-4 #1a). One gate, one reset: a locked
  // pane, an inert splitter (no handler) or a mobile layout renders no
  // reconcilable size — the episode ends there, and so does an in-range
  // value, so a later episode always reports again.
  const reconcileKeyRef = useRef('');
  useEffect(() => {
    // A re-measure is in flight: this render's cap is stale (it belongs to
    // the previous track), so do not report from it — the effect re-runs
    // once the fresh track has rendered (round-6 #1).
    if (measurePendingRef.current) return;
    const onChange = showSplitter
      ? isVertical
        ? onMasterHeightChange
        : onMasterWidthChange
      : undefined;
    if (!onChange || currentSize === effectiveSize) {
      reconcileKeyRef.current = '';
      return;
    }
    const key = `${isVertical ? 'h' : 'w'}|${rawSize}|${effectiveSize}`;
    if (reconcileKeyRef.current === key) return;
    reconcileKeyRef.current = key;
    report(currentSize);
  }, [
    showSplitter,
    isVertical,
    rawSize,
    trackSize,
    onMasterWidthChange,
    onMasterHeightChange,
    currentSize,
    effectiveSize,
    report,
  ]);

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
      report(startSize + delta); // raw delta — report() clamps (the render reconcile above is the other owner)
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
    if (!mobileLayout) {
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
  }, [mobileLayout, selectedKey]);

  if (!mobileLayout) {
    return (
      <div ref={containerRef} className={styles.split} data-orientation={orientation}>
        <div className={styles.master} style={sizeStyle}>
          {master}
        </div>
        {showSplitter && (
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
