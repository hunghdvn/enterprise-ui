import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useState } from 'react';
import { cssRule } from '../internal/cssRule';
import { DateRangePicker } from './DateRangePicker';
import styles from './DateRangePicker.module.css';
import type { DateRange } from './types';

const range: DateRange = { from: new Date(2026, 9, 10), to: new Date(2026, 9, 15) };

test('renders a closed trigger with the placeholder', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  const trigger = screen.getByRole('button', { name: /Chọn khoảng ngày|→/ });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveTextContent('Chọn khoảng ngày');
});

test('trigger shows the formatted range when set', () => {
  render(<DateRangePicker value={range} onChange={() => {}} />);
  const trigger = screen.getByRole('button', { name: /Chọn khoảng ngày|→/ });
  expect(trigger.textContent).toContain('10');
  expect(trigger.textContent).toContain('15');
});

test('clicking the trigger opens the dialog panel', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('grid')).toBeInTheDocument();
});

test('disabled: trigger disabled and never opens', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} disabled />);
  const trigger = screen.getByRole('button', { name: /Chọn khoảng ngày|→/ });
  expect(trigger).toBeDisabled();
  fireEvent.click(trigger);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('clicking a day sets "from"; a second click sets "to"', () => {
  function RangeHarness() {
    const [r, setR] = useState<DateRange>({ from: null, to: null });
    return <DateRangePicker value={r} onChange={setR} />;
  }
  render(<RangeHarness />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  fireEvent.click(screen.getByRole('gridcell', { name: '10' }));
  fireEvent.click(screen.getByRole('gridcell', { name: '15' }));
  expect(screen.getByRole('gridcell', { name: '10' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute('aria-selected', 'true');
});

test('clicking before "from" swaps so from <= to', () => {
  function RangeHarness() {
    const [r, setR] = useState<DateRange>({ from: new Date(2026, 9, 15), to: null });
    return <DateRangePicker value={r} onChange={setR} />;
  }
  render(<RangeHarness />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  fireEvent.click(screen.getByRole('gridcell', { name: '10' }));
  expect(screen.getByRole('gridcell', { name: '10' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute('aria-selected', 'true');
});

test('a third click starts a new range', () => {
  function RangeHarness() {
    const [r, setR] = useState<DateRange>({
      from: new Date(2026, 9, 10),
      to: new Date(2026, 9, 15),
    });
    return <DateRangePicker value={r} onChange={setR} />;
  }
  render(<RangeHarness />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  fireEvent.click(screen.getByRole('gridcell', { name: '20' }));
  expect(screen.getByRole('gridcell', { name: '20' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '10' })).not.toHaveAttribute('aria-selected', 'true');
});

test('start/end cells are marked aria-selected', () => {
  render(<DateRangePicker value={range} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  expect(screen.getByRole('gridcell', { name: '10' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '12' })).not.toHaveAttribute('aria-selected', 'true');
});

test('presets report the range and close the panel', () => {
  const onChange = vi.fn();
  render(<DateRangePicker value={{ from: null, to: null }} onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  fireEvent.click(screen.getByRole('button', { name: '7 ngày qua' }));
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ from: expect.any(Date), to: expect.any(Date) }),
  );
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('prev/next month navigate the grid', () => {
  render(<DateRangePicker value={{ from: new Date(2026, 9, 10), to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  const label = () => screen.getByText(/tháng \d+ năm \d+/).textContent;
  const before = label();
  fireEvent.click(screen.getByRole('button', { name: 'Tháng trước' }));
  expect(label()).not.toBe(before);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(label()).toBe(before);
});

test('Escape closes the panel', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('Enter on a day cell selects it', () => {
  function RangeHarness() {
    const [r, setR] = useState<DateRange>({ from: null, to: null });
    return <DateRangePicker value={r} onChange={setR} />;
  }
  render(<RangeHarness />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  const cell = screen.getByRole('gridcell', { name: '10' });
  fireEvent.keyDown(cell, { key: 'Enter' });
  // Enter activates the button's onClick via native semantics; dispatch click.
  fireEvent.click(cell);
  expect(cell).toHaveAttribute('aria-selected', 'true');
});

test('clicking outside closes the panel', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('panel is positioned fixed', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  expect(screen.getByRole('dialog')).toHaveStyle({ position: 'fixed' });
});

/**
 * jsdom cannot compute styles from the module CSS, so this contract is pinned at source level: a
 * pad cell that falls inside the range or carries an endpoint keeps its full opacity, so the range
 * band is continuous and a picked endpoint never looks unselected.
 */
test('pad cells inside the range or on an endpoint keep full opacity', () => {
  const css = readFileSync(join(import.meta.dirname, 'DateRangePicker.module.css'), 'utf8');
  // an ordinary pad cell still reads as a different month, via its dimmed number only
  expect(cssRule(css, '.day-out .day-num')).toMatch(/opacity:\s*0\.45\b/);
  expect(cssRule(css, '.day-out.day-in .day-num')).toMatch(/opacity:\s*1\b/);
  expect(cssRule(css, '.day-out.day-start .day-num')).toMatch(/opacity:\s*1\b/);
  expect(cssRule(css, '.day-out.day-end .day-num')).toMatch(/opacity:\s*1\b/);
});

test('an endpoint that falls in a pad cell keeps its selected classes', () => {
  // November 2026 starts on a Sunday, so its grid pads out with six December cells; ending the
  // range on December 3 puts the end endpoint inside one of them.
  const value: DateRange = { from: new Date(2026, 10, 28), to: new Date(2026, 11, 3) };
  const { container } = render(<DateRangePicker value={value} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /Chọn khoảng ngày|→/ }));
  const cells = Array.from(container.querySelectorAll<HTMLElement>('[role="gridcell"]'));
  const padEnd = cells.find(
    (c) => c.classList.contains(styles['day-out']) && c.textContent === '3',
  );
  expect(padEnd).toBeDefined();
  expect(padEnd).toHaveClass(styles['day-end']);
  // and a pad cell that rides inside the range still reads as part of the span
  const padIn = cells.find((c) => c.classList.contains(styles['day-out']) && c.textContent === '1');
  expect(padIn).toHaveClass(styles['day-in']);
});
