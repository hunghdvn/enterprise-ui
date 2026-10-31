import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Calendar } from './Calendar';

afterEach(() => {
  vi.useRealTimers();
});

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
  expect(calls).toEqual([12]);
});

test('keyboard skip keeps the week row for ArrowDown', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 5)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDate() === 12}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowDown' });
  const calls = onChange.mock.calls.map((c) => (c[0] as Date).getDate());
  expect(calls).toEqual([19]);
});

test('backwards keys skip disabled days backwards', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 13)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDate() === 12}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowLeft' });
  expect(onChange.mock.calls.map((c) => (c[0] as Date).getDate())).toEqual([11]);

  onChange.mockClear();
  fireEvent.keyDown(grid, { key: 'ArrowUp' });
  expect(onChange.mock.calls.map((c) => (c[0] as Date).getDate())).toEqual([4]);
});

test('focus follows the cursor into the next month', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 31));
    return <Calendar value={v} onChange={setV} />;
  }
  render(<Harness />);
  const cell = screen.getByRole('gridcell', { name: /^31 tháng 10 năm 2026$/i });
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(screen.getByText(/tháng 11 năm 2026/i)).toBeInTheDocument();
  const active = document.activeElement as HTMLElement;
  expect(active.getAttribute('data-date')).toBe('2026-11-30');
});

test('external value change does not steal focus', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 10));
    return (
      <>
        <input aria-label="khác" />
        <button type="button" onClick={() => setV(new Date(2026, 9, 20))}>
          đổi
        </button>
        <Calendar value={v} onChange={setV} view={new Date(2026, 9, 1)} />
      </>
    );
  }
  render(<Harness />);
  const input = screen.getByRole('textbox', { name: 'khác' });
  input.focus();
  fireEvent.click(screen.getByRole('button', { name: 'đổi' }));
  expect(document.activeElement).toBe(input);
});

test('Home/End stay inside the visible month when it is fully disabled', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 31)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getMonth() === 9}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'Home' });
  fireEvent.keyDown(grid, { key: 'End' });
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByText(/tháng 10 năm 2026/i)).toBeInTheDocument();
  // the closed month is still reachable by keyboard
  expect(grid).toHaveAttribute('tabindex', '0');
});

test('grid keeps a tab stop when the value is a disabled date', () => {
  render(
    <Calendar
      value={new Date(2026, 9, 5)}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDate() === 5}
    />,
  );
  const stops = screen.getAllByRole('gridcell').filter((c) => c.getAttribute('tabindex') === '0');
  expect(stops).toHaveLength(1);
  expect(stops[0]).toBeEnabled();
});

test('PageUp into a fully disabled month never selects a forbidden date', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 31)}
      onChange={onChange}
      isDisabled={(d) => d.getMonth() === 8}
    />,
  );
  const cell = screen.getByRole('gridcell', { name: /^31 tháng 10 năm 2026$/i });
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByText(/tháng 9 năm 2026/i)).toBeInTheDocument();
  // focus must stay usable instead of falling back to <body>
  expect(document.activeElement).toBe(screen.getByRole('grid'));
  fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'PageDown' });
  expect(screen.getByText(/tháng 10 năm 2026/i)).toBeInTheDocument();
});

test('stale focus intent does not pull focus back after a later click', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 1));
    return <Calendar value={v} onChange={setV} view={new Date(2026, 9, 1)} />;
  }
  render(<Harness />);
  const grid = screen.getByRole('grid');
  grid.focus();
  // Home resolves to the current cursor → no cursor change, so no pending intent may survive
  fireEvent.keyDown(grid, { key: 'Home' });
  const cell20 = screen.getByRole('gridcell', { name: /^20 tháng 10 năm 2026$/i });
  fireEvent.click(cell20);
  expect(document.activeElement).toBe(cell20);
});

test('latch resets so a later external value can bring its month back', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 10));
    return (
      <>
        <button type="button" onClick={() => setV(null)}>
          xoá
        </button>
        <button type="button" onClick={() => setV(new Date(2027, 4, 9))}>
          đặt 5/2027
        </button>
        <Calendar value={v} onChange={setV} />
      </>
    );
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(screen.getByText(/tháng 11 năm 2026/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'xoá' }));
  fireEvent.click(screen.getByRole('button', { name: 'đặt 5/2027' }));
  expect(screen.getByText(/tháng 5 năm 2027/i)).toBeInTheDocument();
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
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 15));
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
  // keydown on the button itself is handled by native activation; grid guard prevents double-emit
  expect(onChange).not.toHaveBeenCalled();
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
  expect(screen.getByRole('grid', { name: 'Tháng sinh' })).toBeInTheDocument();
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
  expect(cell).toHaveAccessibleDescription(/Meeting/);
});

test('days without events have no description', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-10': 'Meeting' }}
    />,
  );
  const withEvent = screen.getByRole('gridcell', { name: /^10 tháng 10 năm 2026$/i });
  const without = screen.getByRole('gridcell', { name: /^11 tháng 10 năm 2026$/i });
  expect(withEvent).toHaveAccessibleDescription('Meeting');
  expect(without).toHaveAccessibleDescription('');
});

test('two instances do not share event ids', () => {
  render(
    <>
      <Calendar
        value={null}
        onChange={() => {}}
        view={new Date(2026, 9, 1)}
        events={{ '2026-10-10': 'A' }}
        aria-label="Lịch 1"
      />
      <Calendar
        value={null}
        onChange={() => {}}
        view={new Date(2026, 9, 1)}
        events={{ '2026-10-10': 'B' }}
        aria-label="Lịch 2"
      />
    </>,
  );
  const ids = screen
    .getAllByRole('gridcell', { name: /^10 tháng 10 năm 2026$/i })
    .map((c) => c.getAttribute('aria-describedby'));
  expect(ids[0]).toBeTruthy();
  expect(ids[1]).toBeTruthy();
  expect(ids[0]).not.toBe(ids[1]);
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
  // 31/11 does not exist → clamp to 30
  expect(screen.getByRole('gridcell', { name: /^30 tháng 11 năm 2026$/i })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  fireEvent.keyDown(grid, { key: 'PageUp' });
  expect(screen.getByText(/tháng 10 năm 2026/i)).toBeInTheDocument();
  expect(screen.getByRole('gridcell', { name: /^30 tháng 10 năm 2026$/i })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('month change is announced politely and matches the rendered month', () => {
  function Harness() {
    const [v, setV] = useState(new Date(2026, 9, 1));
    return <Calendar value={null} onChange={() => {}} view={v} onViewChange={setV} />;
  }
  render(<Harness />);
  // nothing announced on mount
  expect(screen.getByRole('status')).toHaveTextContent('');
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(screen.getByText(/tháng 11 năm 2026/i)).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11/2026');
});

test('external view change is announced and pulls the cursor into the month', () => {
  function Harness() {
    const [v, setV] = useState(new Date(2026, 9, 1));
    return (
      <>
        <button type="button" onClick={() => setV(new Date(2027, 2, 1))}>
          sang 3/2027
        </button>
        <Calendar value={new Date(2026, 9, 15)} onChange={() => {}} view={v} />
      </>
    );
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'sang 3/2027' }));
  expect(screen.getByText(/tháng 3 năm 2027/i)).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 3/2027');
  const stops = screen.getAllByRole('gridcell').filter((c) => c.getAttribute('tabindex') === '0');
  expect(stops).toHaveLength(1);
  // the cursor moved into March 2027, so ArrowRight must not jump the view back to October
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowRight' });
  expect(screen.getByText(/tháng 3 năm 2027/i)).toBeInTheDocument();
});
