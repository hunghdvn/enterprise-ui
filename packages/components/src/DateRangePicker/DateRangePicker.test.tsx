import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from './types';

const range: DateRange = { from: new Date(2026, 9, 10), to: new Date(2026, 9, 15) };

test('renders a closed trigger with the placeholder', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Chọn khoảng ngày' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveTextContent('Chọn khoảng ngày');
});

test('trigger shows the formatted range when set', () => {
  render(<DateRangePicker value={range} onChange={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Chọn khoảng ngày' });
  expect(trigger.textContent).toContain('10');
  expect(trigger.textContent).toContain('15');
});

test('clicking the trigger opens the dialog panel', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByRole('grid')).toBeInTheDocument();
});

test('disabled: trigger disabled and never opens', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} disabled />);
  const trigger = screen.getByRole('button', { name: 'Chọn khoảng ngày' });
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
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
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
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
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
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  fireEvent.click(screen.getByRole('gridcell', { name: '20' }));
  expect(screen.getByRole('gridcell', { name: '20' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '10' })).not.toHaveAttribute('aria-selected', 'true');
});

test('start/end cells are marked aria-selected', () => {
  render(<DateRangePicker value={range} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  expect(screen.getByRole('gridcell', { name: '10' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('gridcell', { name: '12' })).not.toHaveAttribute('aria-selected', 'true');
});

test('presets report the range and close the panel', () => {
  const onChange = vi.fn();
  render(<DateRangePicker value={{ from: null, to: null }} onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  fireEvent.click(screen.getByRole('button', { name: '7 ngày qua' }));
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ from: expect.any(Date), to: expect.any(Date) }),
  );
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('prev/next month navigate the grid', () => {
  render(<DateRangePicker value={{ from: new Date(2026, 9, 10), to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  const label = () => screen.getByText(/tháng \d+ năm \d+/).textContent;
  const before = label();
  fireEvent.click(screen.getByRole('button', { name: 'Tháng trước' }));
  expect(label()).not.toBe(before);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(label()).toBe(before);
});

test('Escape closes the panel', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('clicking outside closes the panel', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('disabled: trigger disabled and never opens', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} disabled />);
  const trigger = screen.getByRole('button', { name: 'Chọn khoảng ngày' });
  expect(trigger).toBeDisabled();
  fireEvent.click(trigger);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('panel is positioned fixed', () => {
  render(<DateRangePicker value={{ from: null, to: null }} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Chọn khoảng ngày' }));
  expect(screen.getByRole('dialog')).toHaveStyle({ position: 'fixed' });
});
