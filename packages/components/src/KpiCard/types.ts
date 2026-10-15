import type { ReactNode } from 'react';

export type KpiDeltaTone = 'green' | 'red' | 'neutral';

export interface KpiCardProps {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: KpiDeltaTone;
  icon?: ReactNode;
  /** Sparkline/chart slot (caller-owned, e.g. svg). */
  children?: ReactNode;
}
