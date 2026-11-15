import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
import { SegmentedControl } from './SegmentedControl';

const css = readFileSync(join(import.meta.dirname, 'SegmentedControl.module.css'), 'utf8');

const items = [
  { value: 'list', label: 'Danh sách' },
  { value: 'grid', label: 'Lưới' },
  { value: 'table', label: 'Bảng' },
];

test('renders a named radiogroup with the first option checked', () => {
  render(<SegmentedControl aria-label="Chế độ xem" items={items} />);
  const group = screen.getByRole('radiogroup', { name: 'Chế độ xem' });
  expect(group).toHaveAttribute('data-size', 'md');
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('aria-checked', 'true');
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'false');
});

test('defaultValue selects a later option', () => {
  render(<SegmentedControl aria-label="Chế độ" items={items} defaultValue="grid" />);
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'true');
});

test('clicking selects and fires onChange once; clicking checked does not re-fire', () => {
  const onChange = vi.fn();
  render(<SegmentedControl aria-label="Chế độ" items={items} onChange={onChange} />);
  fireEvent.click(screen.getByRole('radio', { name: 'Lưới' }));
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'true');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenLastCalledWith('grid');
  fireEvent.click(screen.getByRole('radio', { name: 'Lưới' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('controlled value wins; a missing value keeps the first enabled option tabbable', () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <SegmentedControl aria-label="Chế độ" items={items} value="grid" onChange={onChange} />,
  );
  fireEvent.click(screen.getByRole('radio', { name: 'Danh sách' }));
  expect(onChange).toHaveBeenCalledWith('list');
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'true');

  rerender(<SegmentedControl aria-label="Chế độ" items={items} value="missing" />);
  for (const radio of screen.getAllByRole('radio')) {
    expect(radio).toHaveAttribute('aria-checked', 'false');
  }
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('tabindex', '0');
});

test('roving tabindex follows the checked option', () => {
  render(<SegmentedControl aria-label="Chế độ" items={items} />);
  fireEvent.click(screen.getByRole('radio', { name: 'Bảng' }));
  expect(screen.getByRole('radio', { name: 'Bảng' })).toHaveAttribute('tabindex', '0');
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('tabindex', '-1');
});

test('arrows move focus and selection, wrap, and skip disabled options', () => {
  const onChange = vi.fn();
  const mixed = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
    { value: 'c', label: 'C' },
  ];
  render(<SegmentedControl aria-label="Chế độ" items={mixed} onChange={onChange} />);
  const a = screen.getByRole('radio', { name: 'A' });
  a.focus();
  fireEvent.keyDown(a, { key: 'ArrowRight' });
  const c = screen.getByRole('radio', { name: 'C' });
  expect(c).toHaveAttribute('aria-checked', 'true');
  expect(document.activeElement).toBe(c);
  fireEvent.keyDown(c, { key: 'ArrowRight' });
  expect(a).toHaveAttribute('aria-checked', 'true');
  expect(document.activeElement).toBe(a);
  fireEvent.keyDown(a, { key: 'End' });
  expect(document.activeElement).toBe(c);
  fireEvent.keyDown(c, { key: 'Home' });
  expect(document.activeElement).toBe(a);
  fireEvent.keyDown(a, { key: 'ArrowLeft' });
  expect(document.activeElement).toBe(c);
});

test('a disabled option is skipped and cannot be activated', () => {
  const onChange = vi.fn();
  const mixed = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
    { value: 'c', label: 'C' },
  ];
  render(<SegmentedControl aria-label="Chế độ" items={mixed} onChange={onChange} />);
  const b = screen.getByRole('radio', { name: 'B' });
  expect(b).toBeDisabled();
  fireEvent.click(b);
  expect(onChange).not.toHaveBeenCalled();
});

test('disabled root blocks activation', () => {
  const onChange = vi.fn();
  render(<SegmentedControl aria-label="Chế độ" items={items} onChange={onChange} disabled />);
  for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  fireEvent.click(screen.getByRole('radio', { name: 'Bảng' }));
  expect(onChange).not.toHaveBeenCalled();
});

test('icons render and an item aria-label can name an icon-only option', () => {
  const { container } = render(
    <SegmentedControl
      aria-label="Chế độ"
      items={[
        { value: 'list', label: '', icon: 'layout-list', 'aria-label': 'Danh sách' },
        { value: 'grid', label: <span aria-hidden="true">Lưới</span>, icon: 'layout-grid' },
      ]}
    />,
  );
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toBeInTheDocument();
  expect(container.querySelectorAll('svg')).toHaveLength(2);
});

test('className and rest land on the root; empty items renders nothing', () => {
  const { container } = render(
    <SegmentedControl aria-label="Chế độ" items={items} className="custom" id="view" />,
  );
  const group = container.querySelector('[role="radiogroup"]')!;
  expect(group).toHaveClass('custom');
  expect(group).toHaveAttribute('id', 'view');

  const { container: empty } = render(<SegmentedControl aria-label="Chế độ" items={[]} />);
  expect(empty).toBeEmptyDOMElement();
});

test('size sets data-size on the root', () => {
  const { container } = render(
    <>
      <SegmentedControl aria-label="Nhỏ" items={items} size="sm" />
      <SegmentedControl aria-label="Vừa" items={items} size="md" />
    </>,
  );
  const groups = container.querySelectorAll('[role="radiogroup"]');
  expect(groups[0]).toHaveAttribute('data-size', 'sm');
  expect(groups[1]).toHaveAttribute('data-size', 'md');
});

test('a disabled first option is not auto-selected', () => {
  const gated = [
    { value: 'table', label: 'Bảng', disabled: true },
    { value: 'list', label: 'Danh sách' },
  ];
  render(<SegmentedControl aria-label="Chế độ" items={gated} />);
  expect(screen.getByRole('radio', { name: 'Bảng' })).toHaveAttribute('aria-checked', 'false');
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('aria-checked', 'true');
});

test('defaultValue pointing at a disabled option falls back to the first enabled one', () => {
  const gated = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
  ];
  render(<SegmentedControl aria-label="Chế độ" items={gated} defaultValue="b" />);
  expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('aria-checked', 'false');
  expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('aria-checked', 'true');
});

test('defaultValue matching nothing renders no selection but keeps a tab stop', () => {
  render(<SegmentedControl aria-label="Chế độ" items={items} defaultValue="ghost" />);
  for (const radio of screen.getAllByRole('radio')) {
    expect(radio).toHaveAttribute('aria-checked', 'false');
  }
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('tabindex', '0');
});

test('a controlled value on a disabled option stays checked but hands over the tab stop', () => {
  const gated = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
    { value: 'c', label: 'C' },
  ];
  render(<SegmentedControl aria-label="Chế độ" items={gated} value="b" />);
  const b = screen.getByRole('radio', { name: 'B' });
  expect(b).toHaveAttribute('aria-checked', 'true');
  expect(b).toHaveAttribute('tabindex', '-1');
  expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('tabindex', '0');
});

test('all options disabled leaves no tab stop and does not crash', () => {
  const gated = [
    { value: 'a', label: 'A', disabled: true },
    { value: 'b', label: 'B', disabled: true },
  ];
  render(<SegmentedControl aria-label="Chế độ" items={gated} />);
  for (const radio of screen.getAllByRole('radio')) {
    expect(radio).toHaveAttribute('aria-checked', 'false');
    expect(radio).toHaveAttribute('tabindex', '-1');
  }
});

test('ArrowUp and ArrowDown mirror ArrowLeft and ArrowRight', () => {
  render(<SegmentedControl aria-label="Chế độ" items={items} />);
  const first = screen.getByRole('radio', { name: 'Danh sách' });
  first.focus();
  fireEvent.keyDown(first, { key: 'ArrowDown' });
  const second = screen.getByRole('radio', { name: 'Lưới' });
  expect(document.activeElement).toBe(second);
  fireEvent.keyDown(second, { key: 'ArrowUp' });
  expect(document.activeElement).toBe(first);
});

test('Home and End move focus and selection and fire onChange', () => {
  const onChange = vi.fn();
  render(<SegmentedControl aria-label="Chế độ" items={items} onChange={onChange} />);
  const first = screen.getByRole('radio', { name: 'Danh sách' });
  first.focus();
  fireEvent.keyDown(first, { key: 'End' });
  const last = screen.getByRole('radio', { name: 'Bảng' });
  expect(document.activeElement).toBe(last);
  expect(last).toHaveAttribute('aria-checked', 'true');
  expect(onChange).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(last, { key: 'Home' });
  expect(document.activeElement).toBe(first);
  expect(first).toHaveAttribute('aria-checked', 'true');
  expect(onChange).toHaveBeenLastCalledWith('list');
});

test('an IME composition keystroke does not move the selection', () => {
  render(<SegmentedControl aria-label="Chế độ" items={items} />);
  const first = screen.getByRole('radio', { name: 'Danh sách' });
  first.focus();
  fireEvent.keyDown(first, { key: 'ArrowRight', keyCode: 229 });
  expect(document.activeElement).toBe(first);
  expect(first).toHaveAttribute('aria-checked', 'true');
});

test('a numeric zero label renders and names the option', () => {
  render(
    <SegmentedControl
      aria-label="Mức độ"
      items={[
        { value: '0', label: 0 },
        { value: '1', label: 1 },
      ]}
    />,
  );
  expect(screen.getByRole('radio', { name: '0' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: '1' })).toBeInTheDocument();
});

test('an icon-only option renders no label span', () => {
  render(
    <SegmentedControl
      aria-label="Chế độ"
      items={[{ value: 'list', label: '', icon: 'layout-list', 'aria-label': 'Danh sách' }]}
    />,
  );
  const radio = screen.getByRole('radio', { name: 'Danh sách' });
  expect(radio.querySelector('span')).toBeNull();
  expect(radio.querySelector('svg')).not.toBeNull();
});

test('children are rejected at the type level and never rendered', () => {
  render(
    // @ts-expect-error children are deliberately omitted from SegmentedControlProps.
    <SegmentedControl aria-label="Chế độ" items={items}>
      Thừa
    </SegmentedControl>,
  );
  expect(screen.queryByText('Thừa')).toBeNull();
});

test('module CSS pins the track, selected state, focus ring and sizes', () => {
  expect(cssRule(css, '.root')).toMatch(/display:\s*inline-flex/);
  // A grid parent would otherwise stretch the inline-flex track to the column width.
  expect(cssRule(css, '.root')).toMatch(/width:\s*fit-content/);
  // fit-content keeps the track behind its options; a max-width cap would let a nowrap row
  // spill past the rounded background (Tabs' segmented track has no cap either).
  expect(cssRule(css, '.root')).not.toMatch(/max-width/);
  expect(cssRule(css, '.root')).toMatch(/border-radius:\s*999px/);
  expect(cssRule(css, '.root')).toMatch(/background:\s*var\(--surface-muted\)/);
  // Unchecked labels rest at --text: --text-muted on --surface-muted is 4.34:1 (light) /
  // 4.04:1 (dark), below AA; hover keeps feedback via --action-text like Tabs.
  expect(cssRule(css, '.option')).toMatch(/color:\s*var\(--text\)/);
  expect(cssRule(css, ".option:hover:not(:disabled):not([aria-checked='true'])")).toMatch(
    /color:\s*var\(--action-text\)/,
  );
  expect(cssRule(css, ".option[aria-checked='true']")).toMatch(/background:\s*var\(--surface\)/);
  expect(cssRule(css, ".option[aria-checked='true']")).toMatch(/box-shadow:\s*var\(--shadow-sm\)/);
  expect(cssRule(css, '.option:focus-visible')).toMatch(/outline:\s*2px solid var\(--focus-ring\)/);
  expect(cssRule(css, ".root[data-size='sm']")).toContain('--sc-height');
  expect(cssRule(css, ".root[data-size='md']")).toContain('--sc-height');
});
