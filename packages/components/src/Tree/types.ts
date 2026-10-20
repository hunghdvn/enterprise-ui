import type { ReactNode } from 'react';

export interface TreeNode {
  id: string;
  label: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

/**
 * Presentational-only hierarchical tree (P2 "Tree/Org"). The parent owns
 * `expandedIds` and `selectedId`; the component renders the hierarchy and
 * reports `onToggleExpand` / `onSelect`.
 */
export interface TreeProps {
  nodes: TreeNode[];
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
  selectedId: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  'aria-label'?: string;
}
