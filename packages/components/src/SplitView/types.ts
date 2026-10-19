import type { ReactNode } from 'react';

export type SplitViewOrientation = 'horizontal' | 'vertical';

export interface SplitViewProps {
  /** List pane (usually FilterBar + Table). */
  master: ReactNode;
  /** Detail pane (usually PageHeader + sections). */
  detail: ReactNode;
  /** Null = nothing selected (mobile shows the master pane). */
  selectedKey: string | null;
  /** Mobile back navigation — caller clears `selectedKey`. */
  onBack: () => void;
  /**
   * Master pane width in px on desktop (horizontal orientation). Non-finite
   * values (NaN/Infinity) fall back to the axis default (380) — silently,
   * including on a locked pane.
   */
  masterWidth?: number;
  /**
   * Master pane height in px on desktop (vertical orientation). Non-finite
   * values (NaN/Infinity) fall back to the axis default (280) — silently,
   * including on a locked pane.
   */
  masterHeight?: number;
  /**
   * Layout axis. `horizontal` (default) keeps the master on the left and the
   * splitter resizes its width; `vertical` stacks the master on top and the
   * splitter resizes its height.
   */
  orientation?: SplitViewOrientation;
  /**
   * Whether the master pane can be resized by dragging the splitter. While
   * resizable, `minSize`/`maxSize` bound the rendered size, ARIA and the
   * drag/keyboard origin, and a clamp that rewrites the caller's value is
   * reported back once (convergence). `false` locks the pane: no splitter or
   * ARIA renders and the caller's size shows verbatim — bounds do not apply.
   * Non-finite sizes still fall back to their defaults even when locked.
   */
  resizable?: boolean;
  /**
   * Hard floor for the master pane size (px) while the pane is resizable
   * (drag/keyboard). A locked pane (`resizable={false}`) renders the caller's
   * size verbatim. Default 280. Non-finite values fall back to the default.
   */
  minSize?: number;
  /**
   * Hard ceiling for the master pane size (px) while the pane is resizable.
   * Defaults to 80% of the measured track. `Infinity` opts out of the ceiling
   * entirely (explicit no-cap: no clamp, no `aria-valuemax`); other
   * non-finite values fall back to the measured default.
   */
  maxSize?: number;
  /**
   * Resize event — horizontal axis (width). Fires for drag/keyboard steps AND
   * once per out-of-range episode when a clamp has to rewrite the value the
   * caller passed (a measured-cap shrink included). Not called while the pane
   * is locked or on mobile (no size is rendered there).
   */
  onMasterWidthChange?: (size: number) => void;
  /** Vertical-axis twin of `onMasterWidthChange` (same fire-on-clamp contract). */
  onMasterHeightChange?: (size: number) => void;
  backLabel?: string;
}
