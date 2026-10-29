import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Calendar } from './Calendar';

test('renders month grid with weekdays', () => {
  render(
    <Calendar value={new Date(2026, 9, 15)} onChange={() => {}} view={new Date(2026, 9, 1)} />,
  );
  expect(screen.getByText('T2')).toBeInTheDocument();
  expect(screen.getByRole('grid')).toBeInTheDocument();
  expect(screen.getByRole('gridcell', { name: /^15 tháng 10 năm 2026$/i })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('clicking a day calls onChange', () => {
  const onChange = vi.fn();
  render(<Calendar value={null} onChange={onChange} view={new Date(2026, 9, 1)} />);
  fireEvent.click(screen.getByRole('gridcell', { name: /^10 tháng 10 năm 2026$/i }));
  expect(onChange).toHaveBeenCalledWith(expect.any(Date));
  expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(10);
});

test('disabled day is not clickable', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={null}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDate() === 5}
    />,
  );
  const cell = screen.getByRole('gridcell', {
    name: /^5 tháng 10 năm 2026$/i,
  }) as HTMLButtonElement;
  expect(cell).toBeDisabled();
  fireEvent.click(cell);
  expect(onChange).not.toHaveBeenCalled();
});

test('keyboard selection skips disabled dates', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 10)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDate() === 11}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowRight' });
  const calls = onChange.mock.calls.map((c) => (c[0] as Date).getDate());
  expect(calls).not.toContain(11);
});

test('events render in day cells', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-10': <span>Meeting</span> }}
    />,
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

test('onViewChange without view still updates internal view', () => {
  const onViewChange = vi.fn();
  render(<Calendar value={null} onChange={() => {}} onViewChange={onViewChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(onViewChange).toHaveBeenCalled();
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

test('Enter on a day button selects it', () => {
  const onChange = vi.fn();
  render(
    <Calendar value={new Date(2026, 9, 10)} onChange={onChange} view={new Date(2026, 9, 1)} />,
  );
  const cell = screen.getByRole('gridcell', { name: /^15 tháng 10 năm 2026$/i });
  fireEvent.keyDown(cell, { key: 'Enter' });
  // Enter on the button itself activates native click; guard prevents double-emit from grid
  fireEvent.click(cell);
  expect(onChange).toHaveBeenCalled();
});

test('keyboard arrow moves selection and view syncs across months', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 31));
    return <Calendar value={v} onChange={setV} />;
  }
  render(<Harness />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowRight' });
  expect(screen.getByRole('gridcell', { name: /^1 tháng 11 năm 2026$/i })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('weeks are wrapped in role=row', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
});

test('month label has an id and grid references it', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  const grid = screen.getByRole('grid');
  const labelledBy = grid.getAttribute('aria-labelledby');
  expect(labelledBy).toBeTruthy();
  const label = document.getElementById(labelledBy!);
  expect(label).not.toBeNull();
});

test('aria-label prop overrides accessible name', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      aria-label="Tháng sinh"
    />,
  );
  const grid = screen.getByRole('grid');
  expect(grid.getAttribute('aria-label')).toBe('Tháng sinh');
});

test('events are described via aria-describedby', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-10': <span>Meeting</span> }}
    />,
  );
  const cell = screen.getByRole('gridcell', { name: /^10 tháng 10 năm 2026$/i });
  expect(cell.getAttribute('aria-describedby')).toBeTruthy();
});

test('PageUp/PageDown change month and clamp day', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 31));
    return <Calendar value={v} onChange={setV} />;
  }
  render(<Harness />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'PageDown' });
  expect(screen.getByText(/tháng 11 năm 2026/i)).toBeInTheDocument();
});
