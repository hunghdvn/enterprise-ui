import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { formatDay } from '../internal/date';
import { Calendar } from './Calendar';

afterEach(() => {
  vi.useRealTimers();
});

/** Text of the month heading the grid is labelled by (the status region repeats the month). */
function monthHeading(): string {
  const grid = screen.getByRole('grid');
  const id = grid.getAttribute('aria-labelledby');
  return id ? (document.getElementById(id)?.textContent ?? '') : '';
}

/** The accessible name of a day comes from the shared formatter. */
function day(date: Date): HTMLElement {
  return screen.getByRole('gridcell', { name: formatDay(date) });
}

function dayButton(date: Date): HTMLButtonElement {
  return day(date) as HTMLButtonElement;
}

test('renders month grid with weekdays', () => {
  render(
    <Calendar value={new Date(2026, 9, 15)} onChange={() => {}} view={new Date(2026, 9, 1)} />,
  );
  expect(screen.getByText('T2')).toBeInTheDocument();
  const grid = screen.getByRole('grid');
  expect(grid).toBeInTheDocument();
  expect(day(new Date(2026, 9, 15))).toHaveAttribute('aria-selected', 'true');
  // a day owns the tab stop, so the grid must not be a second one
  expect(grid).toHaveAttribute('tabindex', '-1');
});

test('a null value selects no day', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  const selected = screen
    .getAllByRole('gridcell')
    .filter((cell) => cell.getAttribute('aria-selected') === 'true');
  expect(selected).toHaveLength(0);
});

test('clicking a day calls onChange', () => {
  const onChange = vi.fn();
  render(<Calendar value={null} onChange={onChange} view={new Date(2026, 9, 1)} />);
  fireEvent.click(day(new Date(2026, 9, 10)));
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 9, 10));
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
  const cell = dayButton(new Date(2026, 9, 5));
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
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 9, 12));
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
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 9, 19));
});

test('ArrowLeft skips disabled days backwards', () => {
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
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 9, 11));
});

test('ArrowUp skips disabled days backwards by a week', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 19)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDate() === 12}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowUp' });
  // 19 − 7 = 12 is disabled, so the skip has to keep walking backwards to 5
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 9, 5));
});

test('focus follows the cursor into the next month', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 31));
    return <Calendar value={v} onChange={setV} />;
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
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
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
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
  expect(screen.getByRole('grid')).toHaveAttribute('tabindex', '-1');
});

test('paging through a fully disabled month never rewrites the selection', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 31)}
      onChange={onChange}
      isDisabled={(d) => d.getMonth() === 8}
    />,
  );
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(onChange).not.toHaveBeenCalled();
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  // focus must stay usable instead of falling back to <body>
  const grid = screen.getByRole('grid');
  expect(document.activeElement).toBe(grid);
  // a closed month has no visible base day: arrows must not commit an invisible date
  fireEvent.keyDown(grid, { key: 'ArrowRight' });
  fireEvent.keyDown(grid, { key: 'ArrowLeft' });
  expect(onChange).not.toHaveBeenCalled();
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  expect(document.activeElement).toBe(grid);
  fireEvent.keyDown(grid, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  // the day-of-month survives the trip through September (the old clamp came back as 30)
  expect(onChange).not.toHaveBeenCalled();
});

test('a rejected chevron click keeps the cursor in the rendered month', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 15)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      onViewChange={() => {}}
    />,
  );
  const cell = day(new Date(2026, 9, 15));
  cell.focus();
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(document.activeElement).toBe(cell);
  // the cursor still sits on a visible October day, so the next arrow selects one
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 16));
});

test('a rejected jump into a closed month keeps focus on the mounted day', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 31)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      onViewChange={() => {}}
      isDisabled={(d) => d.getMonth() === 8}
    />,
  );
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  // the day is still rendered, so focus must not be handed to the grid
  expect(document.activeElement).toBe(cell);
  expect(onChange).not.toHaveBeenCalled();
});

test('dropping the controlled view keeps arrows anchored to the rendered month', () => {
  function Harness() {
    const [controlled, setControlled] = useState(true);
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 10));
    return (
      <>
        <button type="button" onClick={() => setValue(new Date(2027, 2, 10))}>
          đặt 3/2027
        </button>
        <button type="button" onClick={() => setControlled(false)}>
          thả view
        </button>
        <Calendar
          value={value}
          onChange={setValue}
          view={controlled ? new Date(2026, 9, 1) : undefined}
        />
      </>
    );
  }
  render(<Harness />);
  // a value outside the pinned month moves the cursor but not the view
  fireEvent.click(screen.getByRole('button', { name: 'đặt 3/2027' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  fireEvent.click(screen.getByRole('button', { name: 'thả view' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  const stop = screen.getAllByRole('gridcell').find((c) => c.getAttribute('tabindex') === '0');
  expect(stop).toHaveAttribute('data-date', '2026-10-10');
  (stop as HTMLElement).focus();
  fireEvent.keyDown(stop as HTMLElement, { key: 'ArrowRight' });
  // base is the visible October day, not the March value
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(day(new Date(2026, 9, 11))).toHaveAttribute('aria-selected', 'true');
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
  const cell20 = day(new Date(2026, 9, 20));
  fireEvent.click(cell20);
  expect(document.activeElement).toBe(cell20);
});

test('an external value still brings its month into view after paging', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 10));
    return (
      <>
        <button type="button" onClick={() => setV(new Date(2027, 4, 9))}>
          đặt 5/2027
        </button>
        <Calendar value={v} onChange={setV} />
      </>
    );
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  fireEvent.click(screen.getByRole('button', { name: 'đặt 5/2027' }));
  expect(monthHeading()).toMatch(/tháng 5 năm 2027/i);
});

test('clearing then setting a value brings the new month into view', () => {
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
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  fireEvent.click(screen.getByRole('button', { name: 'xoá' }));
  fireEvent.click(screen.getByRole('button', { name: 'đặt 5/2027' }));
  expect(monthHeading()).toMatch(/tháng 5 năm 2027/i);
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

test('an events array renders every entry, not just the first', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-15': ['Release v1.2', 'Review PR'] }}
    />,
  );
  expect(screen.getByText('Release v1.2')).toBeInTheDocument();
  expect(screen.getByText('Review PR')).toBeInTheDocument();
  expect(day(new Date(2026, 9, 15))).toHaveAccessibleDescription('Release v1.2 Review PR');
});

test('an empty first event neither hides nor drops the rest', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-15': ['', 'Retro'] }}
    />,
  );
  expect(screen.getByText('Retro')).toBeInTheDocument();
  expect(day(new Date(2026, 9, 15))).toHaveAccessibleDescription('Retro');
});

test('every event stays in the description when md clips the extra lines', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      size="md"
      events={{ '2026-10-15': ['Release', 'Review', 'Retro'] }}
    />,
  );
  const cell = day(new Date(2026, 9, 15));
  expect(cell).toHaveAccessibleDescription('Release Review Retro');
  for (const label of ['Release', 'Review', 'Retro']) {
    expect(screen.getByText(label)).toBeInTheDocument();
  }
});

test('a numeric zero event is a real event', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-10': 0 }}
    />,
  );
  const cell = day(new Date(2026, 9, 10));
  expect(cell).toHaveAttribute('aria-describedby');
  expect(cell).toHaveAccessibleDescription('0');
});

test('prev/next month navigate', () => {
  render(<Calendar value={new Date(2026, 9, 10)} onChange={() => {}} />);
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng trước' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
});

test('controlled view', () => {
  function Harness() {
    const [v, setV] = useState(new Date(2026, 9, 1));
    return <Calendar value={null} onChange={() => {}} view={v} onViewChange={setV} />;
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
});

test('onViewChange without view still updates internal view', () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 15));
  const onViewChange = vi.fn();
  render(<Calendar value={null} onChange={() => {}} onViewChange={onViewChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(onViewChange).toHaveBeenCalled();
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
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
  expect(day(now)).toHaveAttribute('aria-current', 'date');
});

test('Enter on a day button selects it', () => {
  const onChange = vi.fn();
  render(
    <Calendar value={new Date(2026, 9, 10)} onChange={onChange} view={new Date(2026, 9, 1)} />,
  );
  const cell = day(new Date(2026, 9, 15));
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
  expect(day(new Date(2026, 10, 1))).toHaveAttribute('aria-selected', 'true');
});

test('weeks are wrapped in role=row', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  const rows = screen.getAllByRole('row');
  // one weekday header row plus five October weeks (1/10/2026 is a Thursday)
  expect(rows).toHaveLength(6);
  for (const row of rows.slice(1)) {
    // blank padding cells are aria-hidden, so count the grid DOM rather than the a11y tree
    expect(row.querySelectorAll('[role="gridcell"]')).toHaveLength(7);
  }
});

test('month label has an id and grid references it', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  const grid = screen.getByRole('grid');
  const labelledBy = grid.getAttribute('aria-labelledby');
  expect(labelledBy).toBeTruthy();
  const label = document.getElementById(labelledBy!);
  expect(label?.textContent).toMatch(/tháng 10 năm 2026/i);
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
  expect(day(new Date(2026, 9, 10))).toHaveAccessibleDescription(/Meeting/);
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
  expect(day(new Date(2026, 9, 10))).toHaveAccessibleDescription('Meeting');
  expect(day(new Date(2026, 9, 11))).toHaveAccessibleDescription('');
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
    .getAllByRole('gridcell', { name: formatDay(new Date(2026, 9, 10)) })
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
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 31/11 does not exist → clamp to 30
  expect(day(new Date(2026, 10, 30))).toHaveAttribute('aria-selected', 'true');
  fireEvent.keyDown(grid, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(day(new Date(2026, 9, 30))).toHaveAttribute('aria-selected', 'true');
});

test('month change is announced and matches the rendered month', () => {
  function Harness() {
    const [v, setV] = useState(new Date(2026, 9, 1));
    return <Calendar value={null} onChange={() => {}} view={v} onViewChange={setV} />;
  }
  render(<Harness />);
  // nothing announced on mount
  expect(screen.getByRole('status')).toHaveTextContent('');
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11 năm 2026');
});

test('a month change rejected by the parent is not announced', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  // the parent keeps the view in October: nothing rendered differently, nothing to announce
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent('');
});

test('arrow-key month crossing does not announce the month twice', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 31));
    return <Calendar value={v} onChange={setV} />;
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // the focused day ("1 tháng 11, 2026") already carries the month
  expect(screen.getByRole('status')).toHaveTextContent('');
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-01');
});

test('PageDown still announces when the day button is reused', () => {
  render(<Calendar value={new Date(2026, 9, 15)} onChange={() => {}} />);
  const cell = day(new Date(2026, 9, 15));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 15/10 and 15/11 share a week slot, so React keeps the same button and no focus event fires
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11 năm 2026');
});

test('paging into a closed month announces even when the grid has its own label', () => {
  render(
    <Calendar
      value={new Date(2026, 9, 31)}
      onChange={() => {}}
      isDisabled={(d) => d.getMonth() === 8}
      aria-label="Lịch làm việc"
    />,
  );
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(screen.getByText('tháng 9 năm 2026')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 9 năm 2026');
});

test('a closed month labelled by its heading does not repeat the month', () => {
  render(
    <Calendar
      value={new Date(2026, 9, 31)}
      onChange={() => {}}
      isDisabled={(d) => d.getMonth() === 8}
    />,
  );
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  expect(document.activeElement).toBe(screen.getByRole('grid'));
  // focus lands on the grid, whose accessible name is the month heading: no second message
  expect(screen.getByRole('status')).toHaveTextContent('');
});

test('a suppressed month change clears the status so a later return still announces', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 9, 30));
    return <Calendar value={v} onChange={setV} />;
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11 năm 2026');
  const cell = day(new Date(2026, 10, 30));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  // focus landed on a new day whose label names December: the month is not repeated
  expect(screen.getByRole('status')).toHaveTextContent('');
  fireEvent.click(screen.getByRole('button', { name: 'Tháng trước' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11 năm 2026');
});

test('external view change is announced and moves the roving cursor into the month', () => {
  function Harness() {
    const [v, setV] = useState(new Date(2026, 9, 1));
    return (
      <>
        <button type="button" onClick={() => setV(new Date(2027, 2, 1))}>
          sang 3/2027
        </button>
        <Calendar value={new Date(2026, 9, 15)} onChange={() => {}} view={v} onViewChange={setV} />
      </>
    );
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'sang 3/2027' }));
  expect(monthHeading()).toMatch(/tháng 3 năm 2027/i);
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 3 năm 2027');
  const stop = screen.getAllByRole('gridcell').find((c) => c.getAttribute('tabindex') === '0');
  expect(stop).toHaveAttribute('data-date', '2027-03-15');
  // the cursor really moved: ArrowRight stays in March instead of jumping back to October
  (stop as HTMLElement).focus();
  fireEvent.keyDown(stop as HTMLElement, { key: 'ArrowRight' });
  expect(monthHeading()).toMatch(/tháng 3 năm 2027/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2027-03-16');
});

test('view and value set together land the tab stop on the new value', () => {
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 10));
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setView(new Date(2026, 10, 1));
            setValue(new Date(2026, 10, 20));
          }}
        >
          sang 11
        </button>
        <Calendar value={value} onChange={setValue} view={view} onViewChange={setView} />
      </>
    );
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'sang 11' }));
  expect(day(new Date(2026, 10, 20))).toHaveAttribute('aria-selected', 'true');
  const stop = screen.getAllByRole('gridcell').find((c) => c.getAttribute('tabindex') === '0');
  expect(stop).toHaveAttribute('data-date', '2026-11-20');
});
