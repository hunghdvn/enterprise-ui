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
  /** Master pane width in px on desktop (horizontal orientation). */
  masterWidth?: number;
  /** Master pane height in px on desktop (vertical orientation). */
  masterHeight?: number;
  /**
   * Layout axis. `horizontal` (default) keeps the master on the left and the
   * splitter resizes its width; `vertical` stacks the master on top and the
   * splitter resizes its height.
   */
  orientation?: SplitViewOrientation;
  /** Whether the master pane can be resized by dragging the splitter. */
  resizable?: boolean;
  /** Hard floor for the master pane size (px). Default 280. */
  minSize?: number;
  /** Hard ceiling for the master pane size (px). Defaults to 80% of the track. */
  maxSize?: number;
  /** Resize event — horizontal axis (width). */
  onMasterWidthChange?: (size: number) => void;
  /** Resize event — vertical axis (height). */
  onMasterHeightChange?: (size: number) => void;
  backLabel?: string;
}
