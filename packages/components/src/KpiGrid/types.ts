import type { ReactNode } from 'react';

export interface KpiGridProps {
  children: ReactNode;
  /** Minimum card width in px before wrapping. */
  minCardWidth?: number;
}
