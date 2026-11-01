/// <reference types="node" />
import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useEffect, useRef, useState } from 'react';
import { cssRule } from '../internal/cssRule';
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
 * A controlled parent that records what `onViewChange` asked for and applies a request only when a
 * button says so (or, with `auto`, one commit later). Requests are kept in order so a test can
 * apply an older one on purpose — the stale and out-of-order cases — and `useRequestId` echoes the
 * request id back through `viewRequestId` for the strict landing path.
 */
function DeferredCalendar({
  onChange,
  value = OCT_15,
  isDisabled,
  auto = false,
  initialView = new Date(2026, 9, 1),
  useRequestId = false,
}: {
  onChange: (date: Date) => void;
  value?: Date | null;
  isDisabled?: (date: Date) => boolean;
  /** Apply every request as it arrives, without a click (a debounced/router parent). */
  auto?: boolean;
  initialView?: Date;
  /** Echo the request id back through `viewRequestId` (the strict API). */
  useRequestId?: boolean;
}) {
  const [view, setView] = useState(initialView);
  const [requested, setRequested] = useState<{ view: Date; id: number }[]>([]);
  const [appliedId, setAppliedId] = useState<number | undefined>(undefined);
  const last = requested[requested.length - 1];
  const apply = (next: Date | undefined, id: number | undefined) => {
    if (next) {
      setView(next);
      if (id !== undefined) setAppliedId(id);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (auto && last) apply(last.view, last.id);
  }, [auto, last]);
  return (
    <>
      <button type="button" onClick={() => apply(requested[0]?.view, requested[0]?.id)}>
        áp dụng yêu cầu đầu
      </button>
      <button type="button" onClick={() => apply(last?.view, last?.id)}>
        áp dụng yêu cầu cuối
      </button>
      {/* Answers the last request with a different Date object for the same month. */}
      <button
        type="button"
        onClick={() => {
          if (!last) return;
          setView(new Date(last.view.getFullYear(), last.view.getMonth(), 1));
          setAppliedId(last.id);
        }}
      >
        áp dụng bản sao
      </button>
      {/* A month the component never asked for: sets `view` directly, never touches the id. */}
      <button type="button" onClick={() => setView(new Date(2026, 8, 1))}>
        tự sang 9/2026
      </button>
      <button type="button" onClick={() => setView(new Date(2026, 10, 1))}>
        tự sang 11/2026
      </button>
      <Calendar
        value={value}
        onChange={onChange}
        view={view}
        viewRequestId={useRequestId ? (appliedId ?? 0) : undefined}
        onViewChange={(next, requestId) =>
          setRequested((prev) => [...prev, { view: next, id: requestId ?? 0 }])
        }
        isDisabled={isDisabled}
      />
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
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 2, 28));
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
  // Thursday 19/11, not Tuesday 17/11 from the disabled cursor day.
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 19));
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
  expect(onChange).not.toHaveBeenCalled();
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
  // the parent kept October, so November 15 must not leak out through onChange
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(cell);
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 16));
});

test('a page request survives a view applied in a later commit', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} value={OCT_31} />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the parent deferred the request: nothing hidden may be committed yet
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 30));
});

test('focus follows a page request the parent applies without a click', () => {
  const onChange = vi.fn();
  // `auto` models a debounced/router parent: the view lands in a later commit while focus is
  // still in the grid (a real browser keeps focus on a clicked button, so the button harness
  // cannot pin the handoff).
  render(<DeferredCalendar onChange={onChange} value={OCT_31} auto />);
  const cell = day(OCT_31);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 30));
  // 30/11 shares neither the day number nor the week row with 31/10, so the button is rebuilt and
  // this is a real focus move rather than the reused node keeping focus by accident.
  expect(document.activeElement).not.toBe(cell);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-30');
});

test('a direct move cancels a page request that is still waiting', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 16));
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // the stale request must not select its hidden 15/11
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 16));
});

test('Enter supersedes a page request that is still waiting', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'PageDown' });
  // Enter commits the visible cursor day; the in-flight page must not fire afterwards
  fireEvent.keyDown(grid, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith(OCT_15);
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('a click supersedes a page request that is still waiting', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  day(OCT_15).focus();
  fireEvent.keyDown(day(OCT_15), { key: 'PageDown' });
  fireEvent.click(day(new Date(2026, 9, 20)));
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 20));
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('a chevron supersedes a page request that is still waiting', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the chevron asks for the same month the key already asked for; whichever request the parent
  // applies, the page key's hidden 15/11 must be gone
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
});

test('a page request answered with another month is dropped', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the parent shows September instead: the page did not land, so nothing may be committed
  fireEvent.click(screen.getByRole('button', { name: 'tự sang 9/2026' }));
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  // nor can the dropped request wake up when the parent later applies it
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
});

test('a page request lands when the parent answers with a cloned Date', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // `setView(startOfMonth(d))`, a router round trip or a store re-create hands back a different
  // object for the same month: the month is the acknowledgement, not the object identity.
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng bản sao' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 15));
});

test('paging forward and back while the parent defers commits nothing', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const grid = screen.getByRole('grid');
  grid.focus();
  // move the cursor so a later commit of the same day would be observable
  fireEvent.keyDown(grid, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 9, 16));
  fireEvent.keyDown(grid, { key: 'PageDown' }); // asks for November
  fireEvent.keyDown(grid, { key: 'PageUp' }); // and back: the target is October again
  // the target month is the one already on screen, so nothing is left to wait for: applying the
  // parked request must not re-commit the day the round trip started from
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('paging forward and back with no selection leaves nothing selected', () => {
  const onChange = vi.fn();
  // Without a value there is no old selection to protect the guard: a parked October request
  // would happily commit the anchor day, so the net-zero press has to drop the request itself.
  render(<DeferredCalendar onChange={onChange} value={null} />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'PageDown' }); // asks for November
  fireEvent.keyDown(grid, { key: 'PageUp' }); // and back: the target is October again
  expect(onChange).not.toHaveBeenCalled();
  // the net-zero press cancels the request and withdraws it from the parent's queue, so the
  // parked November request is dead: draining it must not commit anything either
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu đầu' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // with `value = null` every cell is unselected, so the commit is only observable via onChange
  expect(onChange).not.toHaveBeenCalled();
});

test('a stacked page request survives the parent applying the earlier one', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // still waiting for November, so the second press asks for December on top
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the parent applies only the first request: November is on the way to December
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu đầu' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  // the newer request must survive that commit, not be dropped with the older one
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 11, 15));
});

test('a stacked backward page survives the parent applying the earlier one', () => {
  const onChange = vi.fn();
  const nov15 = new Date(2026, 10, 15);
  render(
    <DeferredCalendar onChange={onChange} value={nov15} initialView={new Date(2026, 10, 1)} />,
  );
  const cell = day(nov15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageUp' });
  fireEvent.keyDown(cell, { key: 'PageUp' }); // still waiting, so this asks for September
  // the parent applies only the first request: October lies between November and September
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu đầu' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 9 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 8, 15));
});

test('a stacked page request survives a year boundary', () => {
  const onChange = vi.fn();
  const dec15 = new Date(2026, 11, 15);
  render(
    <DeferredCalendar onChange={onChange} value={dec15} initialView={new Date(2026, 11, 1)} />,
  );
  const cell = day(dec15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.keyDown(cell, { key: 'PageDown' }); // still waiting, so this asks for February
  // January 2027 is between December and February, even though its month number (0) is the
  // smallest of the three: a comparison that only looks at the month number drops the request.
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu đầu' }));
  expect(monthHeading()).toMatch(/tháng 1 năm 2027/i);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 2 năm 2027/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2027, 1, 15));
});

test('a selection made while a page request waits sets the landing day', () => {
  const onChange = vi.fn();
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    const [value, setValue] = useState<Date | null>(OCT_15);
    const [requested, setRequested] = useState<Date | null>(null);
    return (
      <>
        <button type="button" onClick={() => setValue(new Date(2026, 10, 20))}>
          chọn 20/11
        </button>
        <button type="button" onClick={() => requested && setView(requested)}>
          áp dụng
        </button>
        <Calendar value={value} onChange={onChange} view={view} onViewChange={setRequested} />
      </>
    );
  }
  render(<Harness />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the parent picks a day in the target month while the request is still waiting
  fireEvent.click(screen.getByRole('button', { name: 'chọn 20/11' }));
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // the tab stop must sit on the day that is actually selected, not the remembered 15th
  expect(tabStop()).toHaveAttribute('data-date', '2026-11-20');
  expect(onChange).not.toHaveBeenCalled();
});

test('repeated page keys while the parent defers accumulate months', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // still waiting for November, so the second press has to start from the waiting target
  fireEvent.keyDown(cell, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 11, 15));
});

test('a waiting page request is re-checked against isDisabled when it lands', () => {
  const onChange = vi.fn();
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    const [blocked, setBlocked] = useState(false);
    const [requested, setRequested] = useState<Date | null>(null);
    return (
      <>
        <button type="button" onClick={() => setBlocked(true)}>
          chặn 15/11
        </button>
        <button type="button" onClick={() => requested && setView(requested)}>
          áp dụng
        </button>
        <Calendar
          value={OCT_15}
          onChange={onChange}
          view={view}
          onViewChange={setRequested}
          isDisabled={blocked ? (d) => d.getMonth() === 10 && d.getDate() === 15 : undefined}
        />
      </>
    );
  }
  render(<Harness />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the block list changes while the parent is still sitting on the request
  fireEvent.click(screen.getByRole('button', { name: 'chặn 15/11' }));
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // 15/11 is blocked now: the request may move the cursor but must never commit it
  expect(onChange).not.toHaveBeenCalled();
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-16');
});

test('a waiting page request never overwrites a selection made while it waited', () => {
  const onChange = vi.fn();
  function Harness() {
    const [view, setView] = useState(new Date(2026, 9, 1));
    const [value, setValue] = useState<Date | null>(OCT_15);
    const [requested, setRequested] = useState<Date | null>(null);
    return (
      <>
        <button type="button" onClick={() => setValue(new Date(2026, 9, 20))}>
          chọn 20/10
        </button>
        <button type="button" onClick={() => requested && setView(requested)}>
          áp dụng
        </button>
        <Calendar value={value} onChange={onChange} view={view} onViewChange={setRequested} />
      </>
    );
  }
  render(<Harness />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // the parent picks another day while the page request is still in flight
  fireEvent.click(screen.getByRole('button', { name: 'chọn 20/10' }));
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  // the newer selection wins: the request must not commit 15/11 over it
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

test('page keys roll the year over in both directions', () => {
  function Harness() {
    const [v, setV] = useState<Date | null>(new Date(2026, 0, 15));
    return <Calendar value={v} onChange={setV} />;
  }
  render(<Harness />);
  const jan = day(new Date(2026, 0, 15));
  jan.focus();
  fireEvent.keyDown(jan, { key: 'PageUp' });
  expect(monthHeading()).toMatch(/tháng 12 năm 2025/i);
  expect(day(new Date(2025, 11, 15))).toHaveAttribute('aria-selected', 'true');
  const dec = day(new Date(2025, 11, 15));
  dec.focus();
  fireEvent.keyDown(dec, { key: 'PageDown' });
  expect(monthHeading()).toMatch(/tháng 1 năm 2026/i);
  expect(day(new Date(2026, 0, 15))).toHaveAttribute('aria-selected', 'true');
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

test('a parent that snaps the paged day still announces later months', () => {
  function Harness() {
    const [value, setValue] = useState<Date | null>(new Date(2026, 9, 15));
    const [view, setView] = useState(new Date(2026, 9, 1));
    return (
      <>
        <input aria-label="ngoài lịch" />
        <Calendar
          value={value}
          onChange={(next) => setValue(next.getDay() === 0 ? new Date(2026, 10, 16) : next)}
          view={view}
          onViewChange={setView}
        />
      </>
    );
  }
  render(<Harness />);
  const cell = day(new Date(2026, 9, 15));
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' }); // 15/11 is Sunday → the parent snaps to 16/11
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(document.activeElement).toHaveAttribute('data-date', '2026-11-16');
  // leave the grid, then change month: a stale focus intent would mute this announcement
  screen.getByRole('textbox', { name: 'ngoài lịch' }).focus();
  fireEvent.click(screen.getByRole('button', { name: 'Tháng sau' }));
  expect(monthHeading()).toMatch(/tháng 12 năm 2026/i);
  expect(screen.getByRole('status')).toHaveTextContent('Đã chuyển sang tháng 12 năm 2026');
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
  expect(selected).toMatch(/^\s*background:\s*var\(--surface-disabled[,)]/m);
  expect(selected).toMatch(/^\s*color:\s*var\(--text-disabled[,)]/m);
  // the fill is only ~1.8:1 against the light grid, so the cell needs a 3:1 boundary of its own
  expect(selected).toMatch(/^\s*outline:\s*2px dashed var\(--text-disabled[,)]/m);
  // dimming the content on top of a muted fill is what pushed the number under 4.5:1
  expect(cssRule(css, '.day-disabled.day-selected .day-num')).toMatch(/opacity:\s*1\b/);
  // the today dot reads the theme ring, so the dark-theme override reaches it
  expect(cssRule(css, '.day-disabled.day-today.day-selected::after')).toMatch(
    /^\s*border-color:\s*var\(--today-ring\)/m,
  );
  // an event chip on the muted fill takes the same theme-aware foreground as the day number
  expect(cssRule(css, '.day-disabled.day-selected .day-event')).toMatch(
    /^\s*color:\s*var\(--text-disabled[,)]/m,
  );
  // forced colors strip the theme fills, so the live selection needs an outline cue of its own or
  // only the blocked cell (with its dashed outline) would still look selected
  expect(cssRule(css, '.day-selected')).toMatch(/^\s*outline:\s*2px solid CanvasText/m);
});

test('a disabled day that is also selected carries both state classes', () => {
  render(<Calendar value={OCT_15} onChange={() => {}} isDisabled={(d) => d.getDate() === 15} />);
  const cell = day(OCT_15);
  // the CSS contract above is only meaningful if the component really applies both classes
  expect(cell.className).toContain(styles['day-disabled']);
  expect(cell.className).toContain(styles['day-selected']);
});

test('a page request is not committed when the parent opens the target month on its own', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} useRequestId />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // parent ignores the request, then opens November via a month picker / deep link / preset
  fireEvent.click(screen.getByRole('button', { name: 'tự sang 11/2026' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  expect(day(new Date(2026, 10, 15))).toHaveAttribute('aria-selected', 'false');
});

test('a page request lands when the parent echoes the request id', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} useRequestId />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  // parent applies the request and echoes the id back through `viewRequestId`
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 15));
});

test('a direction flip in a stacked request is not dropped', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' }); // Nov
  fireEvent.keyDown(cell, { key: 'PageDown' }); // Dec (stacked)
  fireEvent.keyDown(cell, { key: 'PageUp' }); // Nov (flip)
  // the flipped request (target 11, actual direction forward) must survive the parent applying
  // the last one
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 15));
});

test('a net-zero round trip withdraws the request so the parent drops it', () => {
  const onChange = vi.fn();
  render(<DeferredCalendar onChange={onChange} useRequestId />);
  const grid = screen.getByRole('grid');
  grid.focus();
  fireEvent.keyDown(grid, { key: 'PageDown' }); // asks for November
  fireEvent.keyDown(grid, { key: 'PageUp' }); // and back: the target is October again
  // the net-zero press cancels the request and withdraws it from the parent's queue, so the
  // parked November request is dead: applying it must not commit a selection the user never made
  fireEvent.click(screen.getByRole('button', { name: 'áp dụng yêu cầu cuối' }));
  expect(monthHeading()).toMatch(/tháng 10 năm 2026/i);
  expect(onChange).not.toHaveBeenCalled();
  expect(day(new Date(2026, 9, 15))).toHaveAttribute('aria-selected', 'true');
});

test('a page request lands on month-key alone without the request-id API (documented limitation)', () => {
  const onChange = vi.fn();
  // Backwards-compat parent: no `viewRequestId`, so a parent that ignores the request and later
  // opens the target month on its own is indistinguishable from one that answered it. This is the
  // documented limitation of the no-token fallback; the request-id API above closes the gap.
  render(<DeferredCalendar onChange={onChange} />);
  const cell = day(OCT_15);
  cell.focus();
  fireEvent.keyDown(cell, { key: 'PageDown' });
  fireEvent.click(screen.getByRole('button', { name: 'tự sang 11/2026' }));
  expect(monthHeading()).toMatch(/tháng 11 năm 2026/i);
  expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 15));
});
