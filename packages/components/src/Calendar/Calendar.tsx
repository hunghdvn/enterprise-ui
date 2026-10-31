import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import {
  WEEKDAYS,
  addDays,
  clampDay,
  daysInMonth,
  firstDayOffset,
  formatDay,
  formatMonth,
  isoKey,
  sameDay,
  startOfDay,
} from '../internal/date';
import type { CalendarProps } from './types';
import styles from './Calendar.module.css';

/** First enabled day at or after `start` (dir 1) / at or before it (dir -1), bounded to the month. */
function scanMonth(
  y: number,
  m: number,
  start: number,
  dir: 1 | -1,
  isDisabled?: (d: Date) => boolean,
): Date | null {
  const total = daysInMonth(y, m);
  for (let i = 0; i < total; i++) {
    const day = start + i * dir;
    if (day < 1 || day > total) return null;
    const candidate = new Date(y, m, day);
    if (!isDisabled?.(candidate)) return candidate;
  }
  return null;
}

/** Nearest enabled day in a month, preferring forward from `day`; null when the month is closed. */
function nearestEnabled(
  y: number,
  m: number,
  day: number,
  isDisabled?: (d: Date) => boolean,
): Date | null {
  const start = clampDay(y, m, day);
  return scanMonth(y, m, start, 1, isDisabled) ?? scanMonth(y, m, start, -1, isDisabled);
}

/** Event entries that actually render; booleans and empty strings would leave a blank line. */
function eventList(ev: ReactNode): ReactNode[] {
  const list = ev == null ? [] : Array.isArray(ev) ? ev : [ev];
  return list.filter((item) => item != null && item !== false && item !== true && item !== '');
}

export function Calendar({
  value = null,
  onChange,
  view,
  onViewChange,
  events,
  isDisabled,
  size = 'sm',
  className,
  'aria-label': ariaLabel,
}: CalendarProps) {
  const uid = useId();
  const monthLabelId = `calendar-month-${uid.replace(/:/g, '')}`;
  const gridRef = useRef<HTMLDivElement>(null);

  const [internalView, setInternalView] = useState<Date>(
    view ?? (value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date()),
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (view) setInternalView(view);
  }, [view]);

  const currentView = view ?? internalView;
  const year = currentView.getFullYear();
  const month = currentView.getMonth();
  const monthKey = `${year}-${month}`;

  const setView = useCallback(
    (next: Date) => {
      if (view === undefined) setInternalView(next);
      onViewChange?.(next);
    },
    [view, onViewChange],
  );

  const today = startOfDay(new Date());
  const offset = firstDayOffset(year, month);
  const total = daysInMonth(year, month);

  const [cursor, setCursor] = useState<Date>(() => startOfDay(value ?? new Date()));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value) setCursor(startOfDay(value));
  }, [value]);

  // Follow an external selection: a new `value` brings its month into view (unless the view is
  // controlled). Guarding on the day key — not the object identity — keeps a parent that
  // re-creates `value` on every render from yanking the viewer back after paging.
  const valueKey = value ? isoKey(value) : '';
  const lastValueKeyRef = useRef(valueKey);
  useEffect(() => {
    if (lastValueKeyRef.current === valueKey) return;
    lastValueKeyRef.current = valueKey;
    if (view !== undefined || !value) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInternalView((prev) =>
      prev.getFullYear() === value.getFullYear() && prev.getMonth() === value.getMonth()
        ? prev
        : new Date(value.getFullYear(), value.getMonth(), 1),
    );
  }, [valueKey, value, view]);

  // Reposition the cursor once a month change has actually rendered. Component-driven changes
  // (chevrons, Page keys) may already have moved it in the same batch — then this is a no-op.
  // A controlled change the parent rejects never gets here, because `monthKey` did not change.
  useEffect(() => {
    if (cursor.getFullYear() === year && cursor.getMonth() === month) return;
    // The selection wins when it lives in the month being shown (view and value set together),
    // otherwise keep the day-of-month so paging away and back never loses it.
    const day =
      value && value.getFullYear() === year && value.getMonth() === month
        ? value.getDate()
        : cursor.getDate();
    const next = nearestEnabled(year, month, day, isDisabled);
    // A fully disabled month has no focusable day: leave the cursor (and its day-of-month)
    // where it is and let `tabStop` fall back to the grid instead of clamping into it.
    if (!next) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCursor(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  const pendingFocusRef = useRef<string | null>(null);
  /** True when the last commit focused an element whose own label already names the month. */
  const focusNamesMonthRef = useRef(false);
  const cursorTime = cursor.getTime();
  useEffect(() => {
    focusNamesMonthRef.current = false;
    const grid = gridRef.current;
    if (!grid) return;
    const target = pendingFocusRef.current;
    pendingFocusRef.current = null;
    const active = document.activeElement;
    const focusInside = grid.contains(active);
    // Honour focus moves requested by keyboard navigation; otherwise only follow the cursor
    // while focus already lives in the grid, so external value changes never steal it.
    // `body` counts as "lost focus" because the previously focused day may have re-rendered away.
    if (!focusInside && target === null) return;
    if (!focusInside && active !== null && active !== document.body) return;
    // A stale intent (cursor moved elsewhere in the meantime) must not pull focus backwards.
    const wanted = target === isoKey(cursor) ? target : null;
    const el = grid.querySelector<HTMLButtonElement>(`[data-date="${wanted ?? isoKey(cursor)}"]`);
    if (el && !el.disabled) {
      const alreadyFocused = document.activeElement === el;
      el.focus({ preventScroll: true });
      // A day button reused for the same day number in the same week slot keeps focus without
      // firing a focus event, so its new label is never spoken: only a real focus move may
      // suppress the month status.
      focusNamesMonthRef.current = !alreadyFocused && document.activeElement === el;
    } else if (active === grid) {
      // The grid itself holds focus (a fully closed month). Its name is the month heading
      // unless the caller supplied an aria-label, which may not mention the month.
      focusNamesMonthRef.current = ariaLabel === undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorTime, year, month]);

  const [monthAnnouncement, setMonthAnnouncement] = useState('');
  // Announce the month that is actually rendered (covers chevrons, Page keys and external `view`).
  const announcedRef = useRef(monthKey);
  useEffect(() => {
    if (announcedRef.current === monthKey) return;
    announcedRef.current = monthKey;
    // Keyboard day navigation moves focus to the day, whose label already carries the month;
    // a second polite message would make screen readers read the month twice.
    if (focusNamesMonthRef.current) {
      // Clear the previous sentence instead of leaving it: returning to that month later must
      // change the live region again, otherwise React bails out and nothing is announced.
      setMonthAnnouncement('');
      return;
    }
    setMonthAnnouncement(`Đã chuyển sang ${formatMonth(currentView)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  const changeMonth = (target: Date) => {
    // The month effect above moves the cursor after the new month has rendered. Moving it here
    // would also move it when a controlled parent rejects the change.
    setView(target);
  };

  const setCursorIntent = (next: Date) => {
    if (next.getFullYear() === year && next.getMonth() === month) {
      if (next.getTime() !== cursor.getTime()) pendingFocusRef.current = isoKey(next);
      setCursor(next);
      return;
    }
    pendingFocusRef.current = isoKey(next);
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
    setCursor(next);
  };

  const moveCursor = (next: Date) => {
    setCursorIntent(next);
    onChange?.(next);
  };

  /** PageUp/PageDown: always change the month, move the cursor only to a selectable day. */
  const pageMonth = (delta: number) => {
    const ny = delta < 0 && month === 0 ? year - 1 : delta > 0 && month === 11 ? year + 1 : year;
    const nm = (month + delta + 12) % 12;
    const anchor = new Date(ny, nm, clampDay(ny, nm, cursor.getDate()));
    setView(new Date(ny, nm, 1));
    // a fully disabled month keeps the viewer intact but never selects a forbidden date
    const target = nearestEnabled(ny, nm, cursor.getDate(), isDisabled);
    if (!target) {
      // The focused day unmounts with its month. An uncontrolled view is guaranteed to change,
      // so hand focus to the grid while it is still mounted; a controlled parent may reject the
      // change, and then the day is still on screen and must keep focus.
      if (view === undefined && gridRef.current?.contains(document.activeElement)) {
        gridRef.current.focus({ preventScroll: true });
      }
      return;
    }
    setCursor(target);
    pendingFocusRef.current = isoKey(target);
    if (sameDay(target, anchor) && !sameDay(target, value)) onChange?.(target);
  };

  const cursorInView = cursor.getFullYear() === year && cursor.getMonth() === month;
  // Day navigation always starts inside the rendered month: after an external view change, or
  // a closed month, the cursor may still sit elsewhere (or nowhere) and must not seed the move.
  const navBase = cursorInView ? cursor : nearestEnabled(year, month, cursor.getDate(), isDisabled);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const base = navBase;
    let next: Date | null = null;
    let handled = false;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowDown': {
        if (!base) {
          // A fully closed month has no visible day to start from; also keep the page still.
          e.preventDefault();
          return;
        }
        const step =
          e.key === 'ArrowUp' ? -7 : e.key === 'ArrowDown' ? 7 : e.key === 'ArrowLeft' ? -1 : 1;
        next = addDays(base, step);
        break;
      }
      case 'PageUp': {
        pageMonth(-1);
        e.preventDefault();
        handled = true;
        break;
      }
      case 'PageDown': {
        pageMonth(1);
        e.preventDefault();
        handled = true;
        break;
      }
      case 'Home':
      case 'End': {
        // bounded to the visible month: never spills into a neighbouring month
        const found =
          e.key === 'Home'
            ? scanMonth(year, month, 1, 1, isDisabled)
            : scanMonth(year, month, total, -1, isDisabled);
        e.preventDefault();
        if (!found) return;
        moveCursor(found);
        handled = true;
        break;
      }
      case 'Enter':
      case ' ':
        if (e.target !== e.currentTarget) return;
        if (cursor.getFullYear() !== year || cursor.getMonth() !== month) return;
        if (!isDisabled?.(cursor)) onChange?.(cursor);
        e.preventDefault();
        handled = true;
        break;
      default:
        return;
    }
    if (handled || !next) return;
    e.preventDefault();
    const stepSize = e.key === 'ArrowUp' || e.key === 'ArrowDown' ? 7 : 1;
    const dir = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
    let candidate = next;
    let guard = 0;
    while (isDisabled?.(candidate) && guard < 400) {
      candidate = addDays(candidate, dir * stepSize);
      guard++;
    }
    if (isDisabled?.(candidate)) return;
    moveCursor(candidate);
  };

  const monthLabel = formatMonth(currentView);

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Roving tab stop: always resolve to an enabled day in the visible month so the grid stays
  // reachable by Tab even when the cursor sits on a disabled/off-month date or the month is
  // closed (then the grid itself becomes the tab stop).
  const tabStop =
    cursorInView && !isDisabled?.(cursor)
      ? cursor
      : nearestEnabled(year, month, cursor.getDate(), isDisabled);
  // Lines that do not fit the cell stay in the day's accessible description (sr-only) instead
  // of being display:none, which would remove them from the text alternative.
  const visibleEvents = size === 'sm' ? 1 : 2;

  return (
    <div className={cx(styles.wrap, className)} data-size={size}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          aria-label="Tháng trước"
          onClick={() => changeMonth(new Date(year, month - 1, 1))}
        >
          <Icon name="chevron-left" size={14} />
        </button>
        <span id={monthLabelId} className={styles['month-label']}>
          {monthLabel}
        </span>
        <span className={styles['sr-only']} role="status" aria-live="polite">
          {monthAnnouncement}
        </span>
        <button
          type="button"
          className={styles.nav}
          aria-label="Tháng sau"
          onClick={() => changeMonth(new Date(year, month + 1, 1))}
        >
          <Icon name="chevron-right" size={14} />
        </button>
      </div>
      <div
        ref={gridRef}
        className={styles.grid}
        role="grid"
        aria-label={ariaLabel ?? undefined}
        aria-labelledby={ariaLabel ? undefined : monthLabelId}
        tabIndex={tabStop ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div className={styles['weekday-row']} role="row">
          {WEEKDAYS.map((w) => (
            <div key={w} className={styles.weekday} role="columnheader">
              {w}
            </div>
          ))}
        </div>
        <div className={styles['days-grid']} role="rowgroup">
          {weeks.map((week, wi) => (
            <div key={wi} role="row" style={{ display: 'contents' }}>
              {week.map((d, di) => {
                if (d === null)
                  return (
                    <div
                      key={`b-${wi}-${di}`}
                      className={styles.blank}
                      role="gridcell"
                      aria-hidden="true"
                    />
                  );
                const date = new Date(year, month, d);
                const disabled = isDisabled ? isDisabled(date) : false;
                const selected = sameDay(date, value);
                const isToday = sameDay(date, today);
                const tabIndex = sameDay(date, tabStop) ? 0 : -1;
                const evItems = eventList(events?.[isoKey(date)]);
                const evId = `cal-ev-${uid.replace(/:/g, '')}-${isoKey(date)}`;
                return (
                  <button
                    key={d}
                    type="button"
                    role="gridcell"
                    data-date={isoKey(date)}
                    aria-label={formatDay(date)}
                    aria-describedby={evItems.length > 0 ? evId : undefined}
                    aria-selected={selected}
                    aria-current={isToday ? 'date' : undefined}
                    aria-disabled={disabled || undefined}
                    tabIndex={tabIndex}
                    disabled={disabled}
                    className={cx(
                      styles.day,
                      selected && styles['day-selected'],
                      isToday && styles['day-today'],
                      disabled && styles['day-disabled'],
                    )}
                    onClick={() => {
                      if (!disabled) {
                        setCursor(date);
                        onChange?.(date);
                      }
                    }}
                  >
                    <span className={styles['day-num']}>{d}</span>
                    {evItems.length > 0 && (
                      <span id={evId} className={styles['day-events']}>
                        {evItems.map((item, i) => (
                          <span
                            key={i}
                            className={cx(
                              styles['day-event'],
                              i >= visibleEvents && styles['sr-only'],
                            )}
                          >
                            {item}
                            {i < evItems.length - 1 ? ' ' : null}
                          </span>
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
