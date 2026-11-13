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

test('module CSS pins the track, selected state, focus ring and sizes', () => {
  expect(cssRule(css, '.root')).toMatch(/display:\s*inline-flex/);
  // A grid parent would otherwise stretch the inline-flex track to the column width.
  expect(cssRule(css, '.root')).toMatch(/width:\s*fit-content/);
  expect(cssRule(css, '.root')).toMatch(/background:\s*var\(--surface-muted\)/);
  expect(cssRule(css, ".option[aria-checked='true']")).toMatch(/background:\s*var\(--surface\)/);
  expect(cssRule(css, ".option[aria-checked='true']")).toMatch(/box-shadow:\s*var\(--shadow-sm\)/);
  expect(cssRule(css, '.option:focus-visible')).toMatch(/outline:\s*2px solid var\(--focus-ring\)/);
  expect(cssRule(css, ".root[data-size='sm']")).toContain('--sc-height');
  expect(cssRule(css, ".root[data-size='md']")).toContain('--sc-height');
});
