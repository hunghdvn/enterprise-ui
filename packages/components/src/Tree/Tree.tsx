import { Fragment, useId, useEffect, useMemo, useRef, useState } from 'react';
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
  const uid = useId();
  // The keyboard-active node — roving tabindex anchor. -1 sentinel = none
  // (empty tree); otherwise clamped to the visible range below.
  const [activeIndex, setActiveIndex] = useState(0);

  const flat = useMemo(() => flattenVisible(nodes, expandedIds), [nodes, expandedIds]);

  // Derived (Combobox/SavedViews pattern): the clamp never calls setState
  // during render, so React StrictMode cannot double-fire it (review #4).
  const clampedIndex = useMemo(
    () => (flat.length === 0 ? -1 : Math.max(0, Math.min(activeIndex, flat.length - 1))),
    [activeIndex, flat.length],
  );

  // Focus retention when the visible set shrinks (a parent deleting the
  // focused node must not strand keyboard focus on <body>). The effect runs
  // after the commit, so the focus move happens against the fresh DOM
  // (review #3).
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  // Focus retention when the visible set shrinks (a parent deleting the
  // focused node must not strand keyboard focus on <body>). The effect runs
  // after the commit, so the focus move happens against the fresh DOM
  // (review #3). We only act when focus actually fell to <body> — normal
  // keyboard navigation already moved it via moveActive().
  useEffect(() => {
    const currentId = flat[clampedIndex]?.node.id ?? null;
    // Only steal focus when it has actually fallen to <body>/null (the focused
    // node was removed or focus left the document). A focus sitting on an
    // unrelated element (e.g. an outside button) must be left alone — acting
    // on it made an expand jump focus into the tree (review round-3 #1).
    const active = document.activeElement;
    const focusLost = active === document.body || active === null;
    if (focusLost && currentId) {
      nodeRefs.current.get(currentId)?.focus();
    }
  }, [flat, clampedIndex]);

  const flatIndexById = useMemo(() => {
    const m = new Map<string, number>();
    flat.forEach((f, i) => m.set(f.node.id, i));
    return m;
  }, [flat]);

  const toggleSelect = (node: TreeNode) => {
    if (node.disabled) return;
    onSelect?.(node.id);
  };

  const pendingFocusRef = useRef<string | null>(null);
  const moveActive = (next: FlatNode | undefined, index: number) => {
    if (!next) return;
    // Defer the DOM focus to the commit that follows: moving focus inside the
    // event handler would let the re-render strip focusability from the
    // previously-focused item (classic roving-tabindex pitfall with React's
    // async commit). The effect below applies it against the fresh DOM.
    pendingFocusRef.current = next.node.id;
    setActiveIndex(index);
  };
  // Apply any pending focus after the commit so the focused node's new
  // tabindex is already in the DOM (review #5 focus-into-children).
  useEffect(() => {
    if (pendingFocusRef.current) {
      nodeRefs.current.get(pendingFocusRef.current)?.focus();
      pendingFocusRef.current = null;
    }
  });

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

  const renderNode = (node: TreeNode, level: number): React.ReactNode => {
    const hasChildren = !!node.children?.length;
    const expanded = hasChildren && expandedIds.includes(node.id);
    const selected = node.id === selectedId;
    const index = flatIndexById.get(node.id) ?? -1;
    const focused = index === clampedIndex;
    return (
      <Fragment key={node.id}>
        <div
          id={`${uid}-${node.id}`}
          role="treeitem"
          aria-level={level}
          aria-expanded={hasChildren ? expanded : undefined}
          aria-selected={selected}
          aria-disabled={node.disabled || undefined}
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
        {expanded && hasChildren && (
          <div role="group" aria-labelledby={`${uid}-${node.id}`}>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      className={className ? `${styles.tree} ${className}` : styles.tree}
      onKeyDown={onKeyDown}
    >
      {nodes.map((node) => renderNode(node, 1))}
      {flat.length === 0 && <div className={styles.empty}>Không có dữ liệu</div>}
    </div>
  );
}
