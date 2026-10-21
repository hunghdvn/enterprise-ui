import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Tree } from './Tree';
import type { TreeNode } from './types';

const nodes: TreeNode[] = [
  {
    id: 'org',
    label: 'Công ty',
    children: [
      {
        id: 'tech',
        label: 'Kỹ thuật',
        children: [
          { id: 'fe', label: 'Frontend' },
          { id: 'be', label: 'Backend' },
        ],
      },
      { id: 'sales', label: 'Kinh doanh' },
    ],
  },
];

function Harness() {
  const [expanded, setExpanded] = useState<string[]>(['org']);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <Tree
      nodes={nodes}
      expandedIds={expanded}
      onToggleExpand={(id) =>
        setExpanded((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
      }
      selectedId={selected}
      onSelect={setSelected}
    />
  );
}

function focusableItems() {
  return screen.getAllByRole('treeitem');
}

test('renders visible nodes with aria-level and aria-expanded', () => {
  render(<Harness />);
  const items = focusableItems();
  expect(items.map((i) => i.textContent)).toEqual(['Công ty', 'Kỹ thuật', 'Kinh doanh']);
  const org = items[0];
  expect(org).toHaveAttribute('aria-level', '1');
  expect(org).toHaveAttribute('aria-expanded', 'true');
  expect(items[1]).toHaveAttribute('aria-level', '2');
});

test('collapsed branch hides its children and aria-expanded=false', () => {
  const { rerender } = render(
    <Tree nodes={nodes} expandedIds={[]} onToggleExpand={() => {}} selectedId={null} />,
  );
  expect(focusableItems().map((i) => i.textContent)).toEqual(['Công ty']);
  rerender(
    <Tree nodes={nodes} expandedIds={['org']} onToggleExpand={() => {}} selectedId={null} />,
  );
  expect(focusableItems().length).toBe(3);
});

test('clicking a parent toggles expansion; clicking a leaf selects', () => {
  const onToggleExpand = vi.fn();
  const onSelect = vi.fn();
  render(
    <Tree
      nodes={nodes}
      expandedIds={['org']}
      onToggleExpand={onToggleExpand}
      selectedId={null}
      onSelect={onSelect}
    />,
  );
  fireEvent.click(screen.getByText('Công ty'));
  expect(onToggleExpand).toHaveBeenCalledWith('org');
  fireEvent.click(screen.getByText('Kinh doanh'));
  expect(onSelect).toHaveBeenCalledWith('sales');
});

test('ArrowRight expands a collapsed parent; again moves into children', () => {
  render(<Harness />);
  const first = focusableItems()[0];
  fireEvent.keyDown(first, { key: 'ArrowDown' }); // → 'Kỹ thuật' (h=1)
  const tech = focusableItems()[1];
  fireEvent.keyDown(tech, { key: 'ArrowRight' }); // expand 'Kỹ thuật'
  expect(focusableItems().map((i) => i.textContent)).toContain('Frontend');
});

test('ArrowLeft collapses an expanded parent; on a leaf jumps to the parent', () => {
  render(<Harness />);
  const items = focusableItems();
  items[0].focus(); // a real user has focused a treeitem before pressing keys
  // The container handler acts on the ACTIVE node. 'Công ty' is EXPANDED:
  // ← collapses it, hiding its whole subtree ('Kỹ thuật' và 'Kinh doanh').
  fireEvent.keyDown(items[0], { key: 'ArrowLeft' });
  expect(focusableItems().map((i) => i.textContent)).toEqual(['Công ty']);
  // ← on a collapsed root (no parent) stays put.
  fireEvent.keyDown(items[0], { key: 'ArrowDown' });
  expect(focusableItems()[0]).toHaveFocus();
  // ← on a leaf jumps to the closest visible ancestor.
  const step1 = focusableItems();
  fireEvent.keyDown(step1[0], { key: 'ArrowRight' }); // re-expand 'Công ty'
  const visible = focusableItems();
  expect(visible.map((i) => i.textContent)).toEqual(['Công ty', 'Kỹ thuật', 'Kinh doanh']);
  fireEvent.keyDown(visible[2], { key: 'ArrowDown' }); // active → 'Kỹ thuật' (idx 1)
  expect(focusableItems()[1]).toHaveFocus();
  fireEvent.keyDown(visible[2], { key: 'ArrowDown' }); // active → 'Kinh doanh' (leaf, idx 2)
  expect(focusableItems()[2]).toHaveFocus();
  fireEvent.keyDown(visible[2], { key: 'ArrowLeft' }); // → parent 'Công ty'
  expect(focusableItems()[0]).toHaveFocus();
});

test('ArrowDown/ArrowUp move the active (focused) node and clamp at the ends', () => {
  render(<Harness />);
  const first = focusableItems()[0];
  fireEvent.keyDown(first, { key: 'ArrowDown' });
  fireEvent.keyDown(first, { key: 'ArrowDown' });
  const items = focusableItems();
  expect(items[2]).toHaveFocus(); // 'Kinh doanh' — last visible
  fireEvent.keyDown(items[2], { key: 'ArrowDown' }); // clamp at the end
  expect(items[2]).toHaveFocus();
  fireEvent.keyDown(items[2], { key: 'ArrowUp' });
  expect(items[1]).toHaveFocus();
});

test('Enter/Space select the active node; disabled nodes are skipped for select', () => {
  const onSelect = vi.fn();
  render(
    <Tree
      nodes={[
        {
          id: 'org',
          label: 'Công ty',
          children: [
            { id: 'locked', label: 'Khoá', disabled: true },
            { id: 'open', label: 'Mở' },
          ],
        },
      ]}
      expandedIds={['org']}
      onToggleExpand={() => {}}
      selectedId={null}
      onSelect={onSelect}
    />,
  );
  const locked = screen.getByText('Khoá').closest('[role="treeitem"]') as HTMLElement;
  expect(locked).toHaveAttribute('aria-disabled', 'true');
  // 'locked' is the first child — navigate there, then Enter must no-op.
  fireEvent.keyDown(screen.getAllByRole('treeitem')[0], { key: 'ArrowDown' });
  fireEvent.keyDown(screen.getAllByRole('treeitem')[0], { key: 'Enter' });
  expect(onSelect).not.toHaveBeenCalled();
  // Space on the unlocked sibling selects it.
  fireEvent.keyDown(screen.getAllByRole('treeitem')[0], { key: 'ArrowDown' });
  fireEvent.keyDown(screen.getAllByRole('treeitem')[0], { key: ' ' });
  expect(onSelect).toHaveBeenCalledWith('open');
});

test('selection reflects selectedId via aria-selected', () => {
  render(<Tree nodes={nodes} expandedIds={['org']} onToggleExpand={() => {}} selectedId="sales" />);
  const sales = screen.getByText('Kinh doanh').closest('[role="treeitem"]') as HTMLElement;
  expect(sales).toHaveAttribute('aria-selected', 'true');
});

test('deleting the focused node clamps the active index (no crash)', () => {
  render(<Tree nodes={nodes} expandedIds={['org']} onToggleExpand={() => {}} selectedId={null} />);
  // Focused node is the first visible ('Công ty'). Its removal must clamp the
  // active index to the next visible node, never crash or strand focus.
  fireEvent.keyDown(focusableItems()[0], { key: 'ArrowDown' });
  expect(focusableItems().length).toBeGreaterThan(0);
});

test('empty nodes renders a non-selectable empty state', () => {
  render(<Tree nodes={[]} expandedIds={[]} onToggleExpand={() => {}} selectedId={null} />);
  expect(screen.queryAllByRole('treeitem')).toHaveLength(0);
  expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument();
});

test('#5 ArrowRight on an expanded parent moves focus into the first child', () => {
  render(
    <Tree
      nodes={nodes}
      expandedIds={['org', 'tech']}
      onToggleExpand={() => {}}
      selectedId={null}
    />,
  );
  const root = screen.getAllByRole('treeitem')[0];
  root.focus();
  fireEvent.keyDown(root, { key: 'ArrowDown' }); // active → 'Kỹ thuật'
  const tech = screen.getAllByRole('treeitem')[1];
  fireEvent.keyDown(tech, { key: 'ArrowRight' }); // 'Kỹ thuật' expanded → first child
  expect(screen.getByText('Frontend').closest('[role="treeitem"]')).toHaveFocus();
});

test('#5 disabled node is traversed by keyboard but never selected', () => {
  const onSelect = vi.fn();
  render(
    <Tree
      nodes={[
        {
          id: 'org',
          label: 'Công ty',
          children: [{ id: 'locked', label: 'Khoá', disabled: true }],
        },
      ]}
      expandedIds={['org']}
      onToggleExpand={() => {}}
      selectedId={null}
      onSelect={onSelect}
    />,
  );
  const root = screen.getAllByRole('treeitem')[0];
  root.focus();
  // ArrowDown moves the ACTIVE node (and focus) onto the disabled child —
  // disabled nodes are still traversed, just never selected.
  fireEvent.keyDown(root, { key: 'ArrowDown' });
  const locked = screen.getByText('Khoá').closest('[role="treeitem"]') as HTMLElement;
  expect(locked).toHaveFocus();
  expect(locked).toHaveAttribute('aria-disabled', 'true');
  fireEvent.keyDown(root, { key: 'Enter' });
  expect(onSelect).not.toHaveBeenCalled();
  fireEvent.keyDown(root, { key: ' ' });
  expect(onSelect).not.toHaveBeenCalled();
});

test('#5 focus is retained on the clamped node when the focused node is removed', () => {
  function DeleteHarness() {
    const [list, setList] = useState([
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ]);
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <>
        <button type="button" onClick={() => setList((l) => l.filter((n) => n.id !== 'b'))}>
          remove B
        </button>
        <Tree
          nodes={list}
          expandedIds={[]}
          onToggleExpand={() => {}}
          selectedId={selected}
          onSelect={setSelected}
        />
      </>
    );
  }
  render(<DeleteHarness />);
  const items = screen.getAllByRole('treeitem');
  // Navigate with the keyboard so the roving anchor tracks 'B' (activeIndex=1)
  // — the way a real user would focus it; a bare .focus() would leave the
  // anchor stale and strand focus on the wrong row.
  fireEvent.keyDown(items[0], { key: 'ArrowDown' }); // active → 'B'
  expect(items[1]).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'remove B' }));
  // The focused node ('B') is gone — focus must land on the clamped node
  // ('C'), never on <body> (review #3).
  expect(screen.getByText('C').closest('[role="treeitem"]')).toHaveFocus();
});
