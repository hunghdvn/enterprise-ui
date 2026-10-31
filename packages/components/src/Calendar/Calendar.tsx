import { useCallback, useEffect, useRef, useState, useId } from 'react';
import { Icon } from '../Icon';
import type { CalendarProps } from './types';
import styles from './Calendar.module.css';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isoKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstOffset(year: number, month: number): number {
  const dow = new Date(year, month, 1).getDay();
  return (dow + 6) % 7;
}

function fmtFull(d: Date): string {
  return `${d.getDate()} tháng ${d.getMonth() + 1} năm ${d.getFullYear()}`;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function clampDay(y: number, m: number, day: number): number {
  return Math.min(day, daysInMonth(y, m));
}

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

/** Nearest enabled day in a month, preferring forward from `day`. */
function nearestEnabled(
  y: number,
  m: number,
  day: number,
  isDisabled?: (d: Date) => boolean,
): Date {
  const start = clampDay(y, m, day);
  return (
    scanMonth(y, m, start, 1, isDisabled) ??
    scanMonth(y, m, start, -1, isDisabled) ??
    new Date(y, m, start)
  );
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

  const userPagedRef = useRef(false);
  useEffect(() => {
    if (value && !userPagedRef.current && !view) {
      setInternalView(new Date(value.getFullYear(), value.getMonth(), 1));
    }
  }, [value, view]);

  const currentView = view ?? internalView;
  const setView = useCallback(
    (next: Date) => {
      if (view === undefined) setInternalView(next);
      onViewChange?.(next);
    },
    [view, onViewChange],
  );

  const year = currentView.getFullYear();
  const month = currentView.getMonth();
  const today = startOfDay(new Date());

  const offset = firstOffset(year, month);
  const total = daysInMonth(year, month);

  const [cursor, setCursor] = useState<Date>(value ? startOfDay(value) : startOfDay(new Date()));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value) setCursor(startOfDay(value));
  }, [value]);

  const pendingFocusRef = useRef<string | null>(null);
  const cursorTime = cursor.getTime();
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const target = pendingFocusRef.current;
    pendingFocusRef.current = null;
    const active = document.activeElement;
    const focusInside = grid.contains(active);
    // Honour focus moves requested by keyboard navigation; otherwise only follow the
    // cursor while focus already lives in the grid, so external value changes never steal it.
    // `body` counts as "lost focus" because the previously focused day may have re-rendered away.
    if (!focusInside && target === null) return;
    if (!focusInside && active !== null && active !== document.body) return;
    grid
      .querySelector<HTMLElement>(`[data-date="${target ?? isoKey(cursor)}"]`)
      ?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorTime, year, month]);

  const [monthAnnouncement, setMonthAnnouncement] = useState('');
  const changeMonth = (delta: number) => {
    userPagedRef.current = true;
    const target = new Date(year, month + delta, 1);
    setView(target);
    // announce once for pointer users; keyboard navigation is announced by the focused day
    setMonthAnnouncement(`Đã chuyển sang tháng ${target.getMonth() + 1}/${target.getFullYear()}`);
    // keep the roving tab stop inside the visible month without stealing focus
    if (cursor.getFullYear() !== target.getFullYear() || cursor.getMonth() !== target.getMonth()) {
      setCursor(
        nearestEnabled(target.getFullYear(), target.getMonth(), cursor.getDate(), isDisabled),
      );
    }
  };

  const moveCursor = (next: Date) => {
    if (next.getFullYear() !== year || next.getMonth() !== month) {
      setView(new Date(next.getFullYear(), next.getMonth(), 1));
    }
    setCursor(next);
    pendingFocusRef.current = isoKey(next);
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const base = cursor;
    let next: Date | null = null;
    let handled = false;
    switch (e.key) {
      case 'ArrowRight':
        next = addDays(base, 1);
        break;
      case 'ArrowLeft':
        next = addDays(base, -1);
        break;
      case 'ArrowDown':
        next = addDays(base, 7);
        break;
      case 'ArrowUp':
        next = addDays(base, -7);
        break;
      case 'PageUp': {
        userPagedRef.current = true;
        const ny = base.getMonth() === 0 ? base.getFullYear() - 1 : base.getFullYear();
        const nm = base.getMonth() === 0 ? 11 : base.getMonth() - 1;
        const d = new Date(ny, nm, clampDay(ny, nm, base.getDate()));
        setView(new Date(ny, nm, 1));
        const target = isDisabled?.(d) ? nearestEnabled(ny, nm, d.getDate(), isDisabled) : d;
        setCursor(target);
        pendingFocusRef.current = isoKey(target);
        // only commit a selection when the anchored day itself is selectable
        if (target.getTime() === d.getTime()) onChange?.(d);
        e.preventDefault();
        handled = true;
        break;
      }
      case 'PageDown': {
        userPagedRef.current = true;
        const ny = base.getMonth() === 11 ? base.getFullYear() + 1 : base.getFullYear();
        const nm = base.getMonth() === 11 ? 0 : base.getMonth() + 1;
        const d = new Date(ny, nm, clampDay(ny, nm, base.getDate()));
        setView(new Date(ny, nm, 1));
        const target = isDisabled?.(d) ? nearestEnabled(ny, nm, d.getDate(), isDisabled) : d;
        setCursor(target);
        pendingFocusRef.current = isoKey(target);
        if (target.getTime() === d.getTime()) onChange?.(d);
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
    let candidate = next;
    let guard = 0;
    while (isDisabled?.(candidate) && guard < 400) {
      candidate = addDays(candidate, stepSize);
      guard++;
    }
    if (isDisabled?.(candidate)) return;
    moveCursor(candidate);
  };

  const monthLabel = currentView.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const cursorInView = cursor.getFullYear() === year && cursor.getMonth() === month;
  // Roving tab stop: always resolve to an enabled day in the visible month so the grid is
  // reachable by Tab even when the cursor sits on a disabled/off-month date.
  const tabStopStart = Math.min(cursor.getDate(), total);
  let tabStop: Date | null = null;
  if (cursorInView && !isDisabled?.(cursor)) {
    tabStop = cursor;
  } else {
    tabStop =
      scanMonth(year, month, tabStopStart, 1, isDisabled) ??
      scanMonth(year, month, tabStopStart, -1, isDisabled);
  }

  return (
    <div className={className ? `${styles.wrap} ${className}` : styles.wrap} data-size={size}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.nav}
          aria-label="Tháng trước"
          onClick={() => changeMonth(-1)}
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
          onClick={() => changeMonth(1)}
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
        tabIndex={-1}
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
                const ev = events?.[isoKey(date)];
                const evId = `cal-ev-${uid.replace(/:/g, '')}-${isoKey(date)}`;
                return (
                  <button
                    key={d}
                    type="button"
                    role="gridcell"
                    data-date={isoKey(date)}
                    aria-label={fmtFull(date)}
                    aria-describedby={ev != null ? evId : undefined}
                    aria-selected={selected}
                    aria-current={isToday ? 'date' : undefined}
                    aria-disabled={disabled || undefined}
                    tabIndex={tabIndex}
                    disabled={disabled}
                    className={[
                      styles.day,
                      selected ? styles['day-selected'] : '',
                      isToday ? styles['day-today'] : '',
                      disabled ? styles['day-disabled'] : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (!disabled) {
                        setCursor(date);
                        onChange?.(date);
                      }
                    }}
                  >
                    <span className={styles['day-num']}>{d}</span>
                    {ev != null && (
                      <span id={evId} className={styles['day-events']}>
                        {ev}
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
