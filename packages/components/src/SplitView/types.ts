import type { ReactNode } from 'react';

export interface SplitViewProps {
  /** List pane (usually FilterBar + Table). */
  master: ReactNode;
  /** Detail pane (usually PageHeader + sections). */
  detail: ReactNode;
  /** Null = nothing selected (mobile shows the master pane). */
  selectedKey: string | null;
  /** Mobile back navigation — caller clears `selectedKey`. */
  onBack: () => void;
  /** Master pane width in px on desktop. */
  masterWidth?: number;
  backLabel?: string;
}
