import { act, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { flushSync } from 'react-dom';
import { join } from 'node:path';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const OCT_15 = new Date(2026, 9, 15);
const OCT_31 = new Date(2026, 9, 31);

/**
 * A controlled parent that keeps the latest month the component asked for and applies it when a
 * button says so, one commit later (`auto`), or after a delay (`applyAfter`). `value` is a fixed
 * prop — the harness never applies `onChange` — so tests can tell the cursor from the selection.
 * A real click moves focus to the button it hits, so tests that assert where focus lands apply
 * through `auto`/`applyAfter`; the button suits tests about the view and the requests.
 */
function DeferredCalendar({
  onChange,
  value = OCT_15,
  auto = false,
  applyAfter,
}: {
  onChange: (date: Date) => void;
  value?: Date | null;
  /** Apply every request as it arrives, without a click (a router parent). */
  auto?: boolean;
  /** Apply the latest request this many ms after it arrives (a debounced router). */
  applyAfter?: number;
}) {
  const [view, setView] = useState(new Date(2026, 9, 1));
  const [requested, setRequested] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (auto && requested) setView(requested);
  }, [auto, requested]);
  useEffect(() => {
    if (applyAfter === undefined || !requested) return;
    const timer = setTimeout(() => setView(requested), applyAfter);
    return () => clearTimeout(timer);
  }, [applyAfter, requested]);
  return (
    <>
      <button type="button" onClick={() => requested && setView(requested)}>
        áp dụng yêu cầu cuối
      </button>
      {/* A month the component never asked for. */}
      <button type="button" onClick={() => setView(new Date(2026, 8, 1))}>
        tự sang 9/2026
      </button>
      <span data-testid="last-request">
        {requested ? `${requested.getFullYear()}-${requested.getMonth() + 1}` : ''}
      </span>
      <Calendar value={value} onChange={onChange} view={view} onViewChange={setRequested} />
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

/**
 * A controlled parent that stores `{year, month}` and builds a fresh `view` Date on every render
 * (each `onViewChange` re-renders it), applying the latest request a second later like a debounced
 * router.
 */
function RebuildingCalendar({
  value = OCT_31,
  start = { y: 2026, m: 9 },
}: {
  value?: Date | null;
  start?: { y: number; m: number };
}) {
  const [shown, setShown] = useState(start);
  const [requested, setRequested] = useState<Date | null>(null);
  useEffect(() => {
    if (!requested) return;
    const timer = setTimeout(
      () => setShown({ y: requested.getFullYear(), m: requested.getMonth() }),
      1000,
    );
    return () => clearTimeout(timer);
  }, [requested]);
  return (
    <Calendar
      value={value}
      onChange={() => {}}
      view={new Date(shown.y, shown.m, 1)}
      onViewChange={setRequested}
    />
  );
}

/**
 * A parent whose router opens each month of `route` on its own, one per second, with no key
 * press involved. Pass a stable array: a new one restarts the route.
 */
function TimedRouterCalendar({
  route,
  isDisabled,
}: {
  route: Date[];
  isDisabled?: (date: Date) => boolean;
}) {
  const [view, setView] = useState(new Date(2026, 9, 1));
  useEffect(() => {
    const timers = route.map((month, i) => setTimeout(() => setView(month), (i + 1) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [route]);
  return (
    <Calendar
      value={OCT_31}
      onChange={() => {}}
      view={view}
      onViewChange={setView}
      isDisabled={isDisabled}
    />
  );
}

const NOV_1 = new Date(2026, 10, 1);
const TO_NOV = [NOV_1];

/** Advances the fake clock inside `act` so the renders and effects the timers cause flush. */
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

/** The `data-date` of every element that received focus while `run` executed. */
function focusMoves(run: () => void): (string | undefined)[] {
  const moves: (string | undefined)[] = [];
  const record = (e: FocusEvent) => moves.push((e.target as HTMLElement).dataset.date);
  document.addEventListener('focusin', record);
  try {
    run();
  } finally {
    document.removeEventListener('focusin', record);
  }
  return moves;
}

test('page keys and chevrons ask relative to the rendered month while the parent defers', () => {
  render(<DeferredCalendar onChange={() => {}} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // October is still on screen, so every press asks for the month after it.
  expect(screen.getByTestId('last-request')).toHaveTextContent(/^2026-11$/);
  // The opposite direction asks for the month before October; it does not cancel November.
  fireEvent.keyDown(cell, { key: 'PageUp' });
  expect(screen.getByTestId('last-request')).toHaveTextContent(/^2026-9$/);
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  // Chevrons follow the same rule: from September, both clicks ask for October.
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(screen.getByTestId('last-request')).toHaveTextContent(/^2026-10$/);
});

test('a parent that re-creates the visible month keeps the landing handoff', () => {
  vi.useFakeTimers();
  render(<RebuildingCalendar />);
  const cell = day(OCT_31);
  cell.focus();
  // The request re-renders the parent, which passes a new Date for October before November lands.
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(document.activeElement).toBe(cell);
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 31/10 unmounted with October: focus lands on 30/11 instead of falling to <body>.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a same-month re-render with a new Date moves no focus', () => {
  vi.useFakeTimers();
  const NOV_20 = new Date(2026, 10, 20);
  render(<RebuildingCalendar value={NOV_20} start={{ y: 2026, m: 10 }} />);
  day(NOV_20).focus();
  for (let i = 0; i < 4; i++) {
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowRight' });
  }
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-24');
  // PageDown re-renders the parent with a new Date for November; December has not landed.
  const moves = focusMoves(() =>
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'PageDown' }),
  );
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(moves).toEqual([]);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-24');
});

test('each month a parent renders while the grid holds focus keeps focus in the grid', () => {
  vi.useFakeTimers();
  render(<TimedRouterCalendar route={[NOV_1, new Date(2026, 11, 1)]} />);
  day(OCT_31).focus();
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 31/10 unmounted with October while the grid held focus: focus lands on 30/11, not <body>.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-12-30');
});

test('a parent that renders the same month again moves no focus', () => {
  vi.useFakeTimers();
  // A FIFO router drains a duplicate request for November with its own Date object.
  render(<TimedRouterCalendar route={[NOV_1, new Date(2026, 10, 1)]} />);
  day(OCT_31).focus();
  advance(1000);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
  expect(focusMoves(() => advance(1000))).toEqual([]);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a month the parent opens after the user left the grid does not take focus', () => {
  vi.useFakeTimers();
  render(<TimedRouterCalendar route={TO_NOV} />);
  const cell = day(OCT_31);
  cell.focus();
  cell.blur();
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toBe(document.body);
});

/**
 * Makes every DOM removal blur the focused node it takes away first, as Chromium does while React
 * removes it: the focusout fires with the node still connected and enabled, focus already on
 * <body>. jsdom only drops focus silently. Restore the returned spy when done.
 */
function blurOnRemoval() {
  const removeChild = Node.prototype.removeChild;
  return vi.spyOn(Node.prototype, 'removeChild').mockImplementation(function <T extends Node>(
    this: Node,
    child: T,
  ): T {
    const active = document.activeElement;
    if (active instanceof HTMLElement && child.contains(active)) active.blur();
    return removeChild.call(this, child) as T;
  });
}

test('the blur a browser sends while a render removes the focused day keeps focus in the grid', () => {
  vi.useFakeTimers();
  const removal = blurOnRemoval();
  try {
    render(<TimedRouterCalendar route={[NOV_1, new Date(2026, 11, 1)]} />);
    day(OCT_31).focus();
    advance(1000);
    expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
    expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
    // The grid still owns focus afterwards: the next month the parent opens keeps it too.
    advance(1000);
    expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
    expect(document.activeElement).toHaveAttribute('data-date', '2026-12-30');
  } finally {
    removal.mockRestore();
  }
});

test('focus that moved to another control is not pulled back after that control lets go', () => {
  vi.useFakeTimers();
  render(
    <>
      <TimedRouterCalendar route={TO_NOV} />
      <button type="button">Bộ lọc</button>
    </>,
  );
  day(OCT_31).focus();
  const other = screen.getByRole('button', { name: 'Bộ lọc' });
  other.focus();
  other.blur();
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toBe(document.body);
});

/** Focuses 31/10, then disables it the way a parent would, with the blur a browser may send. */
function disableFocusedDay() {
  vi.useFakeTimers();
  const { rerender } = render(<TimedRouterCalendar route={TO_NOV} />);
  const cell = day(OCT_31);
  cell.focus();
  rerender(
    <TimedRouterCalendar route={TO_NOV} isDisabled={(d) => d.getTime() === OCT_31.getTime()} />,
  );
  // A browser may blur a focused control after it is disabled; jsdom does not, so send that
  // focusout by hand. Losing focus this way is the render's doing, not the user leaving the grid.
  fireEvent.focusOut(cell);
}

test('a day disabled under focus does not make the grid give up focus', () => {
  disableFocusedDay();
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a pointer press outside the grid gives up focus kept through a disabled day', () => {
  disableFocusedDay();
  fireEvent.pointerDown(document.body);
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toBe(document.body);
});

test('the window losing focus gives up focus kept through a disabled day', () => {
  disableFocusedDay();
  fireEvent.blur(window);
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toBe(document.body);
});

test('an arrow before the parent applies a page keeps focus on the moved day when it lands', () => {
  vi.useFakeTimers();
  render(<DeferredCalendar onChange={() => {}} applyAfter={1000} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // The arrow moves the cursor to 16/10 while October is still on screen.
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  advance(1000);
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

test('a move a parent snaps back to its starting day leaves no intent to mute the next month', () => {
  function Harness() {
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 10));
    return (
      <Calendar
        value={value}
        // The parent refuses the 16th and selects the 15th instead; other picks it ignores.
        onChange={(d) => {
          if (d.getDate() === 16) setValue(new Date(2026, 9, 15));
        }}
        isDisabled={(d) => d.getMonth() === 10}
      />
    );
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 15));
  cell.focus();
  fireEvent.click(cell);
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  // The snap put the cursor back on the 15th, where the move started: the move is settled.
  expect(document.activeElement).toBe(cell);
  const next = screen.getByRole('button', { name: 'Tháng sau' });
  next.focus();
  fireEvent.click(next);
  // November is closed, so the cursor stays put; a leftover intent would mute this message.
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 11 năm 2026');
});

test('a parent that clones the view Date still gets the landing handoff', () => {
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    return (
      <Calendar
        value={OCT_31}
        onChange={() => {}}
        view={view}
        onViewChange={(next) => setView(new Date(next.getFullYear(), next.getMonth(), 1))}
      />
    );
  }
  render(<Harness />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // The handoff keys on the rendered month, not on the Date object the calendar emitted: the day
  // that unmounted (31/11 does not exist) still gets focus back.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('an arrow crossing the parent applies later lands focus on the crossed-to day', () => {
  vi.useFakeTimers();
  render(<DeferredCalendar onChange={() => {}} value={OCT_31} applyAfter={1000} />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(screen.getByTestId('last-request')).toHaveTextContent('2026-11');
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // The cursor already sits on 1/11, so the landing follows it rather than the 31st.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-01');
});

test('a landing follows the cursor already in that month, not a selection elsewhere in it', () => {
  vi.useFakeTimers();
  // The parent keeps 2/11 selected and applies view requests a second later.
  render(<DeferredCalendar onChange={() => {}} value={new Date(2026, 10, 2)} applyAfter={1000} />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.click(cell);
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // The cursor already moved to 1/11; focusing the selected 2/11 would split focus from the tab stop.
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-01');
  expect(tabStop()).toHaveAttribute('data-date', '2026-11-01');
});

test('a new selection that arrives with its month lands focus on it once', () => {
  vi.useFakeTimers();
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    const [value, setValue] = useState<Date | null>(OCT_15);
    useEffect(() => {
      // The parent selects 2/11 while October stays on screen, then opens November with 20/11.
      const first = setTimeout(() => setValue(new Date(2026, 10, 2)), 1000);
      const second = setTimeout(() => {
        setView(NOV_1);
        setValue(new Date(2026, 10, 20));
      }, 2000);
      return () => [first, second].forEach(clearTimeout);
    }, []);
    return <Calendar value={value} onChange={setValue} view={view} onViewChange={setView} />;
  }
  render(<Harness />);
  day(OCT_31).focus();
  advance(1000);
  // Straight to 20/11: a cursor still on 2/11 from the earlier selection must not be focused first.
  expect(focusMoves(() => advance(1000))).toEqual(['2026-11-20']);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-20');
});

test('a parent that renders the crossing month before the cursor still gets focus', () => {
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    return (
      <Calendar
        value={OCT_31}
        onChange={() => {}}
        view={view}
        onViewChange={(next) => flushSync(() => setView(next))}
      />
    );
  }
  render(<Harness />);
  const cell = day(OCT_31);
  cell.focus();
  const moves = focusMoves(() => fireEvent.keyDown(cell, { key: 'ArrowRight' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // The view committed before the cursor did; the intent must survive that commit and land on 1/11
  // straight away, with no stop on 30/11 for a screen reader to read first.
  expect(moves).toEqual(['2026-11-01']);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-01');
  // The day label names November, so the status must not say the month a second time.
  expect(screen.getByRole('status')).toHaveTextContent(/^$/);
});

test('a click before the parent applies a page keeps its day-of-month when it lands', () => {
  vi.useFakeTimers();
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} applyAfter={1000} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // A real click focuses the day it selects.
  const clicked = day(new Date(2026, 9, 20));
  clicked.focus();
  fireEvent.click(clicked);
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 20));
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-20');
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
  // 31/10 unmounts with the month; the focus intent must move focus to 1/11 instead of letting
  // it fall to <body>.
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

// --- round-21 focus ownership regressions ---------------------------------------------------

test('a window refocus keeps grid ownership for the next month', () => {
  vi.useFakeTimers();
  render(<TimedRouterCalendar route={TO_NOV} />);
  day(OCT_31).focus();
  fireEvent.blur(window);
  // Returning from another app/window must re-arm ownership: the day still holds DOM focus.
  fireEvent.focus(window);
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a non-primary pointer press outside keeps grid ownership', () => {
  vi.useFakeTimers();
  render(<TimedRouterCalendar route={TO_NOV} />);
  day(OCT_31).focus();
  // A right-click does not move keyboard focus, so it is not a user exit from the grid.
  fireEvent.pointerDown(document.body, { button: 2 });
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a browser focusin on body after disabling the focused day keeps the handoff', () => {
  disableFocusedDay();
  // A browser may focus <body> when the focused control becomes disabled. That focus is the
  // render's doing, not the user leaving the grid.
  fireEvent.focusIn(document.body);
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a browser focusin on body after a month removes the focused day keeps the handoff', () => {
  vi.useFakeTimers();
  render(<TimedRouterCalendar route={[NOV_1, new Date(2026, 11, 1)]} />);
  day(OCT_31).focus();
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
  // The browser's removal focus fixup may put focus on <body>; the grid still owns the handoff.
  fireEvent.focusIn(document.body);
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-12-30');
});

test('focus placed on a day from a parent layout effect is owned', () => {
  vi.useFakeTimers();
  function Harness() {
    const wrap = useRef<HTMLDivElement>(null);
    const [view, setView] = useState(new Date(2026, 9, 1));
    useLayoutEffect(() => {
      wrap.current?.querySelector<HTMLElement>('[data-date="2026-10-31"]')?.focus();
    }, []);
    useEffect(() => {
      const timer = setTimeout(() => setView(NOV_1), 1000);
      return () => clearTimeout(timer);
    }, []);
    return (
      <div ref={wrap}>
        <Calendar value={OCT_31} onChange={() => {}} view={view} />
      </div>
    );
  }
  render(<Harness />);
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a parent onFocus stopPropagation does not hide grid ownership', () => {
  vi.useFakeTimers();
  render(
    <div onFocus={(e) => e.stopPropagation()}>
      <TimedRouterCalendar route={TO_NOV} />
    </div>,
  );
  day(OCT_31).focus();
  advance(1000);
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});


