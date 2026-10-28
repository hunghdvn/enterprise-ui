import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Calendar } from './Calendar';

test('renders month grid with weekdays', () => {
  render(<Calendar value={new Date(2026, 9, 15)} onChange={() => {}} />);
  expect(screen.getByText('T2')).toBeInTheDocument();
  expect(screen.getByRole('grid')).toBeInTheDocument();
  expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute('aria-selected', 'true');
});

test('clicking a day calls onChange', () => {
  const onChange = vi.fn();
  render(<Calendar value={null} onChange={onChange} />);
  fireEvent.click(screen.getByRole('gridcell', { name: '10' }));
  expect(onChange).toHaveBeenCalledWith(expect.any(Date));
  expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(10);
});

test('disabled day is not clickable', () => {
  const onChange = vi.fn();
  render(<Calendar value={null} onChange={onChange} isDisabled={(d) => d.getDate() === 5} />);
  const cell = screen.getByRole('gridcell', { name: '5' }) as HTMLButtonElement;
  expect(cell).toBeDisabled();
  fireEvent.click(cell);
  expect(onChange).not.toHaveBeenCalled();
});

test('events render in day cells', () => {
  render(
    <Calendar value={null} onChange={() => {}} events={{ '2026-10-10': <span>Meeting</span> }} />,
  );
  expect(screen.getByText('Meeting')).toBeInTheDocument();
});

test('prev/next month navigate', () => {
  render(<Calendar value={new Date(2026, 9, 10)} onChange={() => {}} />);
  const label = () => screen.getByText(/tháng \d+ năm \d+/i).textContent;
  const before = label();
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(label()).not.toBe(before);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng trước' }));
  expect(label()).toBe(before);
});

test('controlled view', () => {
  function Harness() {
    const [v, setV] = useState(new Date(2026, 9, 1));
    return <Calendar value={null} onChange={() => {}} view={v} onViewChange={setV} />;
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(screen.getByText(/tháng 11 năm 2026/i)).toBeInTheDocument();
});

test('today is marked aria-current', () => {
  const now = new Date();
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(now.getFullYear(), now.getMonth(), 1)}
    />,
  );
  const todayCell = screen
    .getAllByRole('gridcell')
    .find((c) => c.getAttribute('aria-current') === 'date');
  expect(todayCell).toBeDefined();
});

test('keyboard arrow moves selection', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 10));
    return <Calendar value={v} onChange={setV} view={new Date(2026, 9, 1)} />;
  }
  render(<Harness />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowRight' });
  expect(screen.getByRole('gridcell', { name: '11' })).toHaveAttribute('aria-selected', 'true');
});
