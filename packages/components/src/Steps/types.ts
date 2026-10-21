import type { ReactNode } from 'react';

export interface Step {
  id: string;
  label: ReactNode;
  description?: string;
  /** Optional step — shown with a "(tuỳ chọn)" hint, never blocks completion. */
  optional?: boolean;
}

/**
 * Presentational-only wizard/stepper (P2). The parent owns `currentStep` and
 * all step content; the component renders the indicator + prev/next/finish
 * navigation and reports via `onChange` (index === `steps.length` means the
 * user pressed "Hoàn tất" — the wizard is complete).
 */
export interface StepsProps {
  steps: Step[];
  /** 0-based index of the active step. `steps.length` = all done. */
  currentStep: number;
  /** Receives the next/prev index, or `steps.length` for "Hoàn tất". */
  onChange?: (index: number) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
