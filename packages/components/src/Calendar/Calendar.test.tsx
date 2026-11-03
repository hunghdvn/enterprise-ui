import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useEffect, useRef, useState } from 'react';
import { cssBlock, cssRule } from '../internal/cssRule';
import { formatDay } from '../internal/date';
import { Calendar } from './Calendar';
import styles from './Calendar.module.css';

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

/** The single roving tab stop; asserting the count makes a missing day fail loudly. */
function tabStop(): HTMLElement {
  const stops = screen.getAllByRole('gridcell').filter((c) => c.getAttribute('tabindex') === '0');
  expect(stops).toHaveLength(1);
  return stops[0];
}

/** Stable `value` for tests that re-render: a fresh object each render would reset the cursor. */
const OCT_15 = new Date(2026, 9, 15);
const OCT_31 = new Date(2026, 9, 31);

/**
 * A controlled parent that keeps the latest month the component asked for and applies it only
 * when a button says so (or, with `auto`, one commit later). Page keys never commit a selection,
 * so this harness only has to move `view` and expose what was requested.
 */
function DeferredCalendar({
  onChange,
  value = OCT_15,
  auto = false,
}: {
  onChange: (date: Date) => void;
  value?: Date | null;
  /** Apply every request as it arrives, without a click (a debounced/router parent). */
  auto?: boolean;
}) {
  const [view, setView] = useState(new Date(2026, 9, 1));
  const [requested, setRequested] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (auto && requested) setView(requested);
  }, [auto, requested]);
  return (
    <>
      <button type="button" onClick={() => requested && setView(requested)}>
        áp dụng yêu cầu cuối
      </button>
      {/* A month the component never asked for. */}
      <button type="button" onClick={() => setView(new Date(2026, 8, 1))}>
        tự sang 9/2026
      </button>
      {/* Back to the month the request started from, with the router's own object. */}
      <button type="button" onClick={() => setView(new Date(2026, 9, 1))}>
        tự về 10/2026
      </button>
      <span data-testid="last-request">
        {requested ? `${requested.getFullYear()}-${requested.getMonth() + 1}` : ''}
      </span>
      <Calendar value={value} onChange={onChange} view={view} onViewChange={setRequested} />
    </>
  );
}

/**
 * A controlled parent that queues every requested month and applies one per click (or two in one
 * commit). Models a router that drains page requests over several commits; `last-request` exposes
 * what the latest key press asked for.
 */
function QueuedCalendar({ value = OCT_15 }: { value?: Date | null }) {
  const [view, setView] = useState(new Date(2026, 9, 1));
  const [queue, setQueue] = useState<Date[]>([]);
  const last = queue[queue.length - 1];
  return (
    <>
      <button
        type="button"
        onClick={() => {
          const [next, ...rest] = queue;
          if (!next) return;
          setQueue(rest);
          setView(next);
        }}
      >
        nhả một tháng
      </button>
      <button
        type="button"
        onClick={() => {
          const [, second, ...rest] = queue;
          if (!second) return;
          setQueue(rest);
          // The parent applied both requests without committing in between.
          setView(second);
        }}
      >
        nhả hai tháng
      </button>
      {/* The very next month, but as the router's own object, not an echo of our request. */}
      <button type="button" onClick={() => setView(new Date(2026, 10, 1))}>
        tự sang 11/2026
      </button>
      <span data-testid="queue">
        {queue.map((m) => `${m.getFullYear()}-${m.getMonth() + 1}`).join(',')}
      </span>
      <span data-testid="last-request">
        {last ? `${last.getFullYear()}-${last.getMonth() + 1}` : ''}
      </span>
      <Calendar value={value} view={view} onViewChange={(next) => setQueue((q) => [...q, next])} />
    </>
  );
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

test('day labels follow the Vietnamese day pattern', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  // pinned literally so a formatter regression on any day (not just 15/10) fails
  expect(screen.getByRole('gridcell', { name: '20 tháng 10, 2026' })).toBeInTheDocument();
});

test('the visible number matches the day-of-month', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  // the accessible label already contains "20"; assert the rendered span itself
  const cell = day(new Date(2026, 9, 20));
  expect(cell.firstElementChild?.textContent).toBe('20');
});

test('a single-digit day is not zero-padded', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  // two-digit days cannot catch a `padStart(2, '0')` regression; 5 would render as "05"
  expect(day(new Date(2026, 9, 5)).firstElementChild?.textContent).toBe('5');
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

test('Home/End stay in the rendered month when the cursor is outside it', () => {
  const onChange = vi.fn();
  function Harness() {
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 10));
    return (
      <>
        <button type="button" onClick={() => setValue(new Date(2027, 2, 10))}>
          đặt 3/2027
        </button>
        <Calendar value={value} onChange={onChange} view={new Date(2026, 9, 1)} />
      </>
    );
  }
  render(<Harness />);
  fireEvent.click(screen.getByRole('button', { name: 'đặt 3/2027' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'End' });
  // not 31/3/2027: Home/End are bounded to the rendered October grid
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 31));
  const endCell = document.activeElement as HTMLElement;
  expect(endCell).toHaveAttribute('data-date', '2026-10-31');
  fireEvent.keyDown(endCell, { key: 'Home' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 1));
  expect(document.activeElement).toHaveAttribute('data-date', '2026-10-01');
});

test('page keys anchor to the visible tab stop, not an off-month cursor day', () => {
  const onChange = vi.fn();
  function Harness() {
    const [view, setView] = useState(new Date(2026, 1, 1));
    return (
      <Calendar
        value={new Date(2027, 2, 31)}
        onChange={onChange}
        view={view}
        onViewChange={setView}
      />
    );
  }
  render(<Harness />);
  expect(monthHeading()).toMatch(/tháng 2 năm 2026/i);
  // March 31 does not exist in February; the visible tab stop is 28/2, so the page keeps 28.
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2026-02-28');
  stop.focus();
  fireEvent.keyDown(stop, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 3 năm 2026/i);
  expect(tabStop()).toHaveAttribute('data-date', '2026-03-28');
  expect(onChange).not.toHaveBeenCalled();
});

test('page keys anchor to the tab stop when the value day is disabled', () => {
  const onChange = vi.fn();
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    return (
      <Calendar
        value={new Date(2026, 9, 17)}
        onChange={onChange}
        view={view}
        onViewChange={setView}
        isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
      />
    );
  }
  render(<Harness />);
  // Saturday 17/10 is the value but cannot hold focus; the tab stop is Monday 19/10.
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2026-10-19');
  stop.focus();
  fireEvent.keyDown(stop, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // Thursday 19/11, not Tuesday 17/11 from the disabled cursor day.
  expect(tabStop()).toHaveAttribute('data-date', '2026-11-19');
  expect(onChange).not.toHaveBeenCalled();
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
  const stop = tabStop();
  expect(stop).toBeEnabled();
  expect(screen.getByRole('grid')).toHaveAttribute('tabindex', '-1');
});

test('arrow navigation starts from the tab stop when the value is disabled', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 17)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
    />,
  );
  // Saturday 17/10 is the value but cannot hold focus; the tab stop moved to Monday 19/10.
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2026-10-19');
  stop.focus();
  fireEvent.keyDown(stop, { key: 'ArrowRight' });
  // the old base (Sat 17) skipped forward to the same Monday instead of moving on to Tuesday
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 20));
});

test('a fully disabled rendered month ignores arrows even when value sits in it', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 15)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getMonth() === 9}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'ArrowRight' });
  expect(onChange).not.toHaveBeenCalled();
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(document.activeElement).toBe(grid);
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
  expect(tabStop()).toHaveAttribute('data-date', '2026-10-31');
  expect(document.activeElement).toHaveAttribute('data-date', '2026-10-31');
  expect(onChange).not.toHaveBeenCalled();
});

test('a page into a closed month from a shifted tab stop hands focus to the grid', () => {
  render(
    <Calendar
      value={new Date(2026, 9, 17)}
      onChange={() => {}}
      isDisabled={(d) => d.getMonth() === 8 || d.getDay() === 0 || d.getDay() === 6}
    />,
  );
  // Saturday 17/10 is the value but cannot hold focus; the tab stop is Monday 19/10.
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2026-10-19');
  stop.focus();
  fireEvent.keyDown(stop, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  // parking the cursor on the tab stop before paging must not consume the grid handoff
  expect(document.activeElement).toBe(screen.getByRole('grid'));
});

test('a controlled view that accepts a closed month hands focus to the grid', () => {
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    return (
      <Calendar
        value={new Date(2026, 9, 31)}
        onChange={() => {}}
        view={view}
        onViewChange={setView}
        isDisabled={(d) => d.getMonth() === 8}
      />
    );
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  // the focused day unmounted; focus must not fall back to <body>
  const grid = screen.getByRole('grid');
  expect(document.activeElement).toBe(grid);
  expect(grid).toHaveAttribute('tabindex', '0');
});

test('paging into a closed month never steals focus from a dialog', () => {
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    const dialogRef = useRef<HTMLButtonElement>(null);
    return (
      <>
        <Calendar
          value={new Date(2026, 9, 31)}
          onChange={() => {}}
          view={view}
          onViewChange={(next) => {
            setView(next);
            dialogRef.current?.focus();
          }}
          isDisabled={(d) => d.getMonth() === 8}
        />
        <button ref={dialogRef} type="button">
          Đóng hộp thoại
        </button>
      </>
    );
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  // the parent opened and focused a dialog in onViewChange; the grid must not take focus back
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Đóng hộp thoại' }));
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
  const next = screen.getByRole('button', { name: 'Tháng sau' });
  cell.focus();
  // a real click focuses the chevron before the handler runs; jsdom's click does not
  next.focus();
  fireEvent.click(next);
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(document.activeElement).toBe(next);
  // the cursor still sits on a visible October day, so the next arrow selects one
  cell.focus();
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

test('a rejected page into a normal month never commits its hidden date', () => {
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
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the parent kept October: the view and the cursor stay, and no date is committed
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(cell);
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 16));
});

test('a controlled parent that applies the page later moves the view and cursor then', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} value={OCT_31} />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the parent deferred the month change: the view and the cursor stay put
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(tabStop()).toHaveAttribute('data-date', '2026-11-30');
  expect(onChange).not.toHaveBeenCalled();
});

test('focus follows a page the parent applies without a click', () => {
  const onChange = vi.fn();
  // `auto` models a debounced/router parent: the view lands in a later commit while focus is
  // still in the grid (a real browser keeps focus on a clicked button, so the button harness
  // cannot pin the handoff).
  render(<DeferredCalendar onChange={onChange} value={OCT_31} auto />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 30/11 shares neither the day number nor the week row with 31/10, so the button is rebuilt and
  // this is a real focus move rather than the reused node keeping focus by accident.
  expect(document.activeElement).not.toBe(cell);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
  expect(onChange).not.toHaveBeenCalled();
});

test('repeated page keys move one month per rendered commit', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} auto />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
});

test('page keys accumulate months while the parent defers', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  // the base is the month already requested, not the month still on screen
  expect(screen.getByTestId('last-request')).toHaveTextContent('2027-1');
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 1 năm 2027/i);
  expect(onChange).not.toHaveBeenCalled();
});

test('a page round trip withdraws the queued month instead of over-shooting', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageUp' });
  // PageDown asked for November; PageUp must ask for October again, not September
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-10');
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
});

test('a page round trip clears the request so the next press starts from the visible month', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageUp' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // A surviving November request would use its target as the base and ask for December.
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-11');
});

test('a net-zero round trip keeps focus when a fifo parent still drains the refused month', () => {
  render(<QueuedCalendar value={OCT_31} />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageUp' });
  // The view has not changed yet, so the focused day stays mounted and keeps focus.
  expect(document.activeElement).toBe(cell);
  // A fifo parent still drains the withdrawn November first: the day unmounts, and the handoff
  // must move focus into the rendered month instead of dropping it on <body>.
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
  // Then the withdrawal month lands back and focus returns to the selection.
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-10-31');
});

test('a landed request does not revive when an external view returns to its month', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // Apply November: the request landed and must end there.
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // The router navigates back to October with its own object.
  fireEvent.click(screen.getByRole('button', { name: 'tự về 10/2026' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageDown' });
  // A revived November request would use its target as the base and ask for December.
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-11');
});

test('a page direction flip keeps the latest press', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-11');
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(tabStop()).toHaveAttribute('data-date', '2026-11-15');
});

test('a parent that opens another month drops the deferred page base', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.click(screen.getByRole('button', { name: 'tự sang 9/2026' }));
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageDown' });
  // one month after September, not January after the stale December target
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-10');
});

test('a chevron restarts paging from the rendered month', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the queued page target is December; a chevron is a fresh navigation and drops it
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageDown' });
  // November + 1 = December; a stale December base would have asked for January
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-12');
});

test('an arrow while a page is queued still restores focus when the page lands', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // Moving the roving cursor is a day selection, not a new view navigation: the queued page
  // still owns the landing handoff.
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-16');
});

test('a rejected page still announces the month the parent opens later', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
  fireEvent.click(screen.getByRole('button', { name: 'tự sang 9/2026' }));
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  // a page request that never landed must not mute later announcements
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 9 năm 2026');
});

test('the tab stop falls back to the last enabled day before a blocked tail', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 2, 20)}
      onChange={onChange}
      isDisabled={(d) => d.getDate() >= 20}
    />,
  );
  // 20..31 are blocked, so the nearest enabled day is found by scanning backwards
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2026-03-19');
  stop.focus();
  fireEvent.keyDown(stop, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 4 năm 2026/i);
  expect(tabStop()).toHaveAttribute('data-date', '2026-04-19');
  expect(onChange).not.toHaveBeenCalled();
});

test('a parent that snaps the arrow selection moves focus to the day that won', () => {
  function Harness() {
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 15));
    return <Calendar value={value} onChange={() => setValue(new Date(2026, 9, 20))} />;
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 15));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  // the parent ignored the requested 16th: focus follows the selection it actually applied
  expect(document.activeElement).toHaveAttribute('data-date', '2026-10-20');
});

test('a draining parent pages from the visible month, not the stale queue target', () => {
  render(<QueuedCalendar />);
  const cell = day(OCT_15);
  cell.focus();
  // Three presses queue November, December, January one after another.
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(screen.getByTestId('queue')).toHaveTextContent('2026-11,2026-12,2027-1');
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageDown' });
  // November is visible, so the next page is December — not February after the stale January
  // target. A parent that has already rendered a month resets the base to what the user sees.
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-12');
});

test('a draining parent lands every queued month, not just the first', () => {
  render(<QueuedCalendar value={new Date(2026, 9, 25)} />);
  const cell = day(new Date(2026, 9, 25));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // 25/10 is in a different week row than 25/11, so each landing is a real focus move.
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-25');
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(document.activeElement).toHaveAttribute('data-date', '2026-12-25');
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 1 năm 2027/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2027-01-25');
});

test('a page reversal after a partial drain ends on the visible month', () => {
  render(<QueuedCalendar />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // Drain November and December, leaving January queued while December is on screen.
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageUp' });
  // December is visible: PageUp asks for November, not a withdrawal into December.
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-11');
  // The fifo parent still holds January, so it renders first; the handoff must survive it (the
  // already-emitted month is ours, not external navigation) and settle on November at the end.
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 1 năm 2027/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2027-01-15');
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-15');
});

test('a coalesced drain keeps the request for the months still queued', () => {
  render(<QueuedCalendar value={new Date(2026, 9, 25)} />);
  const cell = day(new Date(2026, 9, 25));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // The parent applies November and December in one commit; the handoff must still run for the
  // month it landed on, and January must clear the request afterwards.
  fireEvent.click(screen.getByRole('button', { name: 'nhả hai tháng' }));
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-12-25');
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 1 năm 2027/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2027-01-25');
});

test('an external month change does not inherit a queued page handoff', () => {
  render(<QueuedCalendar />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  (document.activeElement as HTMLElement).blur();
  // The router opens the very next month, but with its own object rather than our echo.
  fireEvent.click(screen.getByRole('button', { name: 'tự sang 11/2026' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toBe(document.body);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageDown' });
  // The visible month is November, so the next page is December; the stale January target must
  // not turn this into February. The queue tail cannot prove a new emission, so assert the log.
  expect(screen.getByTestId('queue')).toHaveTextContent('2026-11,2026-12,2027-1,2026-12');
});

test('a backward drain keeps the page handoff through the queued months', () => {
  render(<QueuedCalendar value={OCT_31} />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(screen.getByTestId('queue')).toHaveTextContent('2026-9,2026-8');
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  // September is only on the way to August: the landing effect must still restore focus.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-09-30');
  fireEvent.click(screen.getByRole('button', { name: 'nhả một tháng' }));
  expect(monthHeading()).toMatch(/tháng 8 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-08-30');
});

test('a click keeps the queued page for its landing handoff', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  const clicked = day(new Date(2026, 9, 20));
  fireEvent.click(clicked);
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 20));
  // The queued November request must survive the direct selection: another page press still
  // accumulates on it and asks for December, not November again.
  fireEvent.keyDown(clicked, { key: 'PageDown' });
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-12');
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-12-20');
});

test('grid Enter keeps the queued page request', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'PageDown' });
  // Enter on the grid commits the roving cursor but must not cancel the month still queued.
  fireEvent.keyDown(grid, { key: 'Enter' });
  fireEvent.keyDown(grid, { key: 'PageDown' });
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-12');
});

test('an arrow that crosses a month asks for the month, not the committed day', () => {
  const onChange = vi.fn();
  const onViewChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 28)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      onViewChange={onViewChange}
    />,
  );
  const cell = day(new Date(2026, 9, 28));
  cell.focus();
  // A week down from 28/10 lands on 4/11: the commit keeps that day while the view request must
  // be the first of the month, so only a mid-month crossing tells the two apart.
  fireEvent.keyDown(cell, { key: 'ArrowDown' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 10, 4));
  expect(onViewChange).toHaveBeenLastCalledWith(new Date(2026, 10, 1));
});

test('an arrow crossing into an accepted month keeps focus on the committed day', () => {
  const onChange = vi.fn();
  render(<Calendar value={new Date(2026, 9, 31)} onChange={onChange} />);
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 31/10 unmounts with the month; the one-shot focus intent must move focus to 1/11 instead
  // of letting it fall to <body>.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-01');
});

test('Home and End commit the first/last enabled day of the visible month', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 15)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'End' });
  // 31/10/2026 is a Saturday; the last enabled day is Friday the 30th.
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 30));
  fireEvent.keyDown(day(new Date(2026, 9, 30)), { key: 'Home' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 1));
});

test('grid Enter does not commit a cursor outside the visible month', () => {
  const onChange = vi.fn();
  function Harness() {
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 15));
    return (
      <>
        <button type="button" onClick={() => setValue(new Date(2027, 2, 10))}>
          đặt 3/2027
        </button>
        <Calendar value={value} onChange={onChange} view={new Date(2026, 9, 1)} />
      </>
    );
  }
  render(<Harness />);
  // The cursor follows the new value into March while the controlled view stays in October.
  fireEvent.click(screen.getByRole('button', { name: 'đặt 3/2027' }));
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'Enter' });
  expect(onChange).not.toHaveBeenCalled();
});

test('grid Enter does not commit a disabled cursor', () => {
  const onChange = vi.fn();
  render(
    <Calendar
      value={new Date(2026, 9, 15)}
      onChange={onChange}
      view={new Date(2026, 9, 1)}
      isDisabled={(d) => d.getDate() === 15}
    />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'Enter' });
  expect(onChange).not.toHaveBeenCalled();
});

test('returning from a closed month does not repeat the month after the day label', () => {
  render(<Calendar value={OCT_31} onChange={() => {}} isDisabled={(d) => d.getMonth() === 8} />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  expect(document.activeElement).toBe(screen.getByRole('grid'));
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  // The focus effect moves focus to 31/10, whose label already names October. The landing
  // effect must not clear that flag and make the live region say the month again.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-10-31');
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
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
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2026-10-10');
  stop.focus();
  fireEvent.keyDown(stop, { key: 'ArrowRight' });
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

test('boolean entries do not leave blank event lines', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-15': [false, true, 'Real'] }}
    />,
  );
  const cell = day(new Date(2026, 9, 15));
  expect(cell).toHaveAccessibleDescription('Real');
  expect(screen.getByText('Real').parentElement?.children).toHaveLength(1);
});

test('null entries do not leave blank event lines', () => {
  render(
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      events={{ '2026-10-15': [null, 'Real'] }}
    />,
  );
  const cell = day(new Date(2026, 9, 15));
  expect(cell).toHaveAccessibleDescription('Real');
  expect(screen.getByText('Real').parentElement?.children).toHaveLength(1);
});

test('event lines beyond the cell capacity are sr-only, never removed', () => {
  const renderCalendar = (size: 'sm' | 'md') => (
    <Calendar
      value={null}
      onChange={() => {}}
      view={new Date(2026, 9, 1)}
      size={size}
      events={{ '2026-10-15': ['Release', 'Review', 'Retro'] }}
    />
  );
  const { rerender } = render(renderCalendar('md'));
  expect(day(new Date(2026, 9, 15))).toHaveAccessibleDescription('Release Review Retro');
  // md has room for two lines before the tail becomes visually hidden but stays described
  expect(screen.getByText('Release').className).not.toMatch(/sr-only/);
  expect(screen.getByText('Review').className).not.toMatch(/sr-only/);
  expect(screen.getByText('Retro').className).toMatch(/sr-only/);

  rerender(renderCalendar('sm'));
  // sm has room for one line only; the rest remain in the text alternative
  expect(screen.getByText('Release').className).not.toMatch(/sr-only/);
  expect(screen.getByText('Review').className).toMatch(/sr-only/);
  expect(screen.getByText('Retro').className).toMatch(/sr-only/);
  expect(day(new Date(2026, 9, 15))).toHaveAccessibleDescription('Release Review Retro');
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

test('today keeps its marker while selected', () => {
  const now = new Date();
  render(
    <Calendar
      value={now}
      onChange={() => {}}
      view={new Date(now.getFullYear(), now.getMonth(), 1)}
    />,
  );
  // the dot is styled from day-today while the fill comes from day-selected
  const cell = day(now);
  expect(cell.className).toMatch(/day-today/);
  expect(cell.className).toMatch(/day-selected/);
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

test('Enter and Space on the grid commit the roving day', () => {
  const onChange = vi.fn();
  render(
    <Calendar value={new Date(2026, 9, 15)} onChange={onChange} view={new Date(2026, 9, 1)} />,
  );
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'Enter' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 15));
  fireEvent.keyDown(grid, { key: ' ' });
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 15));
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

test('PageUp/PageDown change month and clamp the roving day', () => {
  const onChange = vi.fn();
  render(<Calendar value={new Date(2026, 9, 31)} onChange={onChange} />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 31/11 does not exist → clamp to 30, and nothing is selected
  expect(tabStop()).toHaveAttribute('data-date', '2026-11-30');
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  // back in the selection's own month the cursor returns to the selected day
  expect(tabStop()).toHaveAttribute('data-date', '2026-10-31');
});

test('page keys roll the year over in both directions', () => {
  const onChange = vi.fn();
  render(<Calendar value={new Date(2026, 0, 15)} onChange={onChange} />);
  const jan = day(new Date(2026, 0, 15));
  jan.focus();
  fireEvent.keyDown(jan, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 12 năm 2025/i);
  expect(tabStop()).toHaveAttribute('data-date', '2025-12-15');
  fireEvent.keyDown(tabStop(), { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 1 năm 2026/i);
  expect(tabStop()).toHaveAttribute('data-date', '2026-01-15');
  expect(onChange).not.toHaveBeenCalled();
});

test('paging onto a disabled day moves the cursor without selecting', () => {
  const onChange = vi.fn();
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    return (
      <Calendar
        value={new Date(2026, 9, 20)}
        onChange={onChange}
        view={view}
        onViewChange={setView}
        isDisabled={(d) => d.getMonth() === 10 && d.getDate() === 20}
      />
    );
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 20));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 20/11 is disabled: the cursor skips to 21/11 but no date is committed
  expect(onChange).not.toHaveBeenCalled();
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-21');
  fireEvent.click(document.activeElement as HTMLElement);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 21));
});

test('month change is announced and matches the rendered month', () => {
  function Harness() {
    const [v, setV] = useState(new Date(2026, 9, 1));
    return <Calendar value={null} onChange={() => {}} view={v} onViewChange={setV} />;
  }
  render(<Harness />);
  // nothing announced on mount
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11 năm 2026');
});

test('a month change rejected by the parent is not announced', () => {
  render(<Calendar value={null} onChange={() => {}} view={new Date(2026, 9, 1)} />);
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  // the parent keeps the view in October: nothing rendered differently, nothing to announce
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
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
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-01');
});

test('PageDown still announces when the day button is reused', () => {
  render(<Calendar value={new Date(2026, 9, 15)} onChange={() => {}} />);
  const cell = day(new Date(2026, 9, 15));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // Both months render day 15 in the same week row and cells are keyed by day number, so React
  // reuses the button: no focus event fires and the month must be announced explicitly.
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11 năm 2026');
});

test('a page that really moves focus does not announce the month twice', () => {
  render(<Calendar value={new Date(2026, 9, 31)} onChange={() => {}} />);
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 30/11 lives in a different week row, so the old button unmounts and a real focus event fires;
  // its label already names November, so the status must stay empty instead of repeating it.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
});

test('a real day focus suppresses the month even when the grid has its own label', () => {
  render(<Calendar value={new Date(2026, 9, 31)} onChange={() => {}} aria-label="Lịch làm việc" />);
  const cell = day(new Date(2026, 9, 31));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // The landing handoff focuses 30/11 directly; falling back to the grid instead would read the
  // grid's own label and then announce the month as well.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
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
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
});

test('a second closed month announces because focus was already on the grid', () => {
  render(
    <Calendar
      value={new Date(2026, 8, 15)}
      onChange={() => {}}
      isDisabled={(d) => d.getMonth() === 7 || d.getMonth() === 6}
    />,
  );
  const cell = day(new Date(2026, 8, 15));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  // August: the day unmounted, so focus really moves to the grid and its heading names it
  expect(monthHeading()).toMatch(/tháng 8 năm 2026/i);
  expect(document.activeElement).toBe(screen.getByRole('grid'));
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
  fireEvent.keyDown(screen.getByRole('grid'), { key: 'PageUp' });
  // July: focus was already on the grid, so no focus event names the new month
  expect(monthHeading()).toMatch(/tháng 7 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 7 năm 2026');
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
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
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
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2027-03-15');
  // the cursor really moved: ArrowRight stays in March instead of jumping back to October
  stop.focus();
  fireEvent.keyDown(stop, { key: 'ArrowRight' });
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
  const stop = tabStop();
  expect(stop).toHaveAttribute('data-date', '2026-11-20');
});

/**
 * jsdom cannot compute module-CSS styles or measure contrast, so the blocked-selection contract is
 * pinned at source level. It lives here (not in the tokens package) because it names this
 * component's own classes: renaming them must not turn the token suite red.
 */
test('a blocked selection keeps a readable, visibly disabled style', () => {
  const css = readFileSync(join(import.meta.dirname, 'Calendar.module.css'), 'utf8');
  // the theme supplies a light blue-300/blue-800 pair in light mode and the muted surface/text in
  // dark: an overridden rule must still win, hence the anchored, last-match parsing
  const selected = cssRule(css, '.day-disabled.day-selected');
  expect(selected).toMatch(/^\s*background:\s*var\(--blocked-selection-bg[,)]/m);
  expect(selected).toMatch(/^\s*color:\s*var\(--blocked-selection-text[,)]/m);
  // the fill is only ~1.8:1 against the light grid, so the cell needs a 3:1 boundary of its own
  expect(selected).toMatch(/^\s*outline:\s*2px dashed var\(--blocked-selection-text[,)]/m);
  // dimming the content on top of a muted fill is what pushed the number under 4.5:1
  expect(cssRule(css, '.day-disabled.day-selected .day-num')).toMatch(/opacity:\s*1\b/);
  // the today dot reads the theme ring, so the dark-theme override reaches it
  expect(cssRule(css, '.day-disabled.day-today.day-selected::after')).toMatch(
    /^\s*border-color:\s*var\(--today-ring\)/m,
  );
  // an event chip on the muted fill takes the same theme-aware foreground as the day number
  expect(cssRule(css, '.day-disabled.day-selected .day-event')).toMatch(
    /^\s*color:\s*var\(--blocked-selection-text[,)]/m,
  );
  // forced colors strip the theme fills, so the live selection needs an outline cue of its own or
  // only the blocked cell (with its dashed outline) would still look selected. Scoped to the
  // forced-colors block so the rule cannot quietly move outside it.
  expect(cssRule(cssBlock(css, '@media (forced-colors: active)'), '.day-selected')).toMatch(
    /^\s*outline:\s*2px solid CanvasText/m,
  );
});

test('a disabled day that is also selected carries both state classes', () => {
  render(<Calendar value={OCT_15} onChange={() => {}} isDisabled={(d) => d.getDate() === 15} />);
  const cell = day(OCT_15);
  // the CSS contract above is only meaningful if the component really applies both classes
  expect(cell.className).toContain(styles['day-disabled']);
  expect(cell.className).toContain(styles['day-selected']);
});
