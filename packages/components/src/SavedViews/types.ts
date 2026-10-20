export interface SavedView<T> {
  id: string;
  label: string;
  /** Opaque filter-state snapshot — the parent defines the shape. */
  value: T;
}

/**
 * Presentational-only saved-views manager (P2). The parent owns `views`,
 * `activeId` and all filter state; the component renders the trigger +
 * popover and reports `onApply` / `onSave` / `onDelete`.
 */
export interface SavedViewsProps<T> {
  views: SavedView<T>[];
  /** `null` = no view applied (free-form filters). */
  activeId: string | null;
  onApply: (id: string) => void;
  onSave: (label: string) => void;
  onDelete?: (id: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  savePlaceholder?: string;
  /** Trigger label when no view is active. */
  label?: string;
  className?: string;
  'aria-label'?: string;
}
