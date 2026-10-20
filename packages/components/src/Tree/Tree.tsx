import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Icon } from '../Icon';
import type { TreeProps, TreeNode } from './types';
import styles from './Tree.module.css';

interface FlatNode {
  node: TreeNode;
  level: number;
  hasChildren: boolean;
  parentId: string | null;
}

/** Depth-first visible walk: only expanded branches contribute their children. */
function flattenVisible(nodes: TreeNode[], expandedIds: string[], level = 1): FlatNode[] {
  const out: FlatNode[] = [];
  for (const node of nodes) {
    const hasChildren = !!node.children?.length;
    const expanded = hasChildren && expandedIds.includes(node.id);
    out.push({ node, level, hasChildren, parentId: null });
    if (expanded && node.children) {
      for (const child of flattenVisible(node.children, expandedIds, level + 1)) {
        // Re-parent onto the closest visible ancestor for the ← collapse step.
        out.push({ ...child, parentId: child.parentId ?? node.id });
      }
    }
  }
  return out;
}

export function Tree({
  nodes,
  expandedIds,
  onToggleExpand,
  selectedId,
  onSelect,
  className,
  'aria-label': ariaLabel,
}: TreeProps) {
  const listRef = useRef<HTMLDivElement>(null);
  // The keyboard-active node — roving tabindex anchor. -1 sentinel = first
  // visible node (adjusted during render below, the React-sanctioned
  // derived-state pattern).
  const [activeIndex, setActiveIndex] = useState(0);

  const flat = useMemo(() => flattenVisible(nodes, expandedIds), [nodes, expandedIds]);

  // Clamp the active index when the visible set shrinks (a parent deleting a
  // node must not strand the keyboard focus past the end — Combobox #9c).
  const clampedIndex = flat.length === 0 ? -1 : Math.max(0, Math.min(activeIndex, flat.length - 1));
  if (activeIndex !== clampedIndex) setActiveIndex(clampedIndex);

  const nodeRefs = useRef(new Map<string, HTMLElement>());

  const toggleSelect = (node: TreeNode) => {
    if (node.disabled) return;
    onSelect?.(node.id);
  };

  const moveActive = (next: FlatNode | undefined, index: number) => {
    if (!next) return;
    // Commit the roving-tabindex change BEFORE moving DOM focus: focusing
    // first would let the subsequent re-render strip focusability from the
    // previously-focused item and drop focus to <body> (classic roving
    // tabindex pitfall with React's async commit).
    flushSync(() => setActiveIndex(index));
    // Roving focus follows the active node so screen readers announce it.
    nodeRefs.current.get(next.node.id)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const current = flat[clampedIndex];
    if (!current) return;
    const { node, hasChildren } = current;
    const expanded = hasChildren && expandedIds.includes(node.id);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        moveActive(flat[clampedIndex + 1], clampedIndex + 1);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        moveActive(flat[clampedIndex - 1], clampedIndex - 1);
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (hasChildren && !expanded) onToggleExpand(node.id);
        else if (expanded) moveActive(flat[clampedIndex + 1], clampedIndex + 1); // into children
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (hasChildren && expanded) onToggleExpand(node.id);
        else if (current.parentId) {
          // Collapse is leftward too: jump to the closest visible ancestor.
          const parentIndex = flat.findIndex((f) => f.node.id === current.parentId);
          if (parentIndex >= 0) moveActive(flat[parentIndex], parentIndex);
        }
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        toggleSelect(node);
        break;
      }
      default:
    }
  };

  return (
    <div
      ref={listRef}
      role="tree"
      aria-label={ariaLabel}
      className={className ? `${styles.tree} ${className}` : styles.tree}
      onKeyDown={onKeyDown}
    >
      {flat.map(({ node, level, hasChildren }, index) => {
        const expanded = hasChildren && expandedIds.includes(node.id);
        const selected = node.id === selectedId;
        const focused = index === clampedIndex;
        return (
          <div
            key={node.id}
            role="treeitem"
            aria-level={level}
            aria-selected={selected}
            aria-expanded={hasChildren ? expanded : undefined}
            tabIndex={focused ? 0 : -1}
            data-disabled={node.disabled || undefined}
            data-selected={selected || undefined}
            className={[
              styles.item,
              focused ? styles['item-focused'] : '',
              node.disabled ? styles['item-disabled'] : '',
            ].join(' ')}
            style={{ paddingInlineStart: `calc(${(level - 1) * 16}px + 8px)` }}
            ref={(el) => {
              if (el) nodeRefs.current.set(node.id, el);
              else nodeRefs.current.delete(node.id);
            }}
            onClick={() => {
              setActiveIndex(index);
              if (hasChildren) onToggleExpand(node.id);
              toggleSelect(node);
            }}
          >
            <span className={styles.toggle} aria-hidden="true">
              {hasChildren && (
                <span className={expanded ? styles['chevron-open'] : styles.chevron}>
                  <Icon name="chevron-down" size={14} />
                </span>
              )}
            </span>
            <span className={styles['item-label']}>{node.label}</span>
          </div>
        );
      })}
      {flat.length === 0 && <div className={styles.empty}>Không có dữ liệu</div>}
    </div>
  );
}
