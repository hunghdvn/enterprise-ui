export interface DateRange {
  from: Date | null;
  to: Date | null;
}

/**
 * Presentational-only date-range picker (P2). The parent owns the range and
 * all constraints (min/max, presets, validation); the component renders the
 * trigger + calendar panel and reports `onChange`.
 */
export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
