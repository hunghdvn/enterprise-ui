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

  const interactedRef = useRef(false);
  const cursorTime = cursor.getTime();
  useEffect(() => {
    if (!interactedRef.current) return;
    const el = gridRef.current?.querySelector<HTMLElement>(`[data-date="${isoKey(cursor)}"]`);
    if (el) el.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorTime, year, month]);

  const changeMonth = (delta: number) => {
    userPagedRef.current = true;
    setView(new Date(year, month + delta, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    interactedRef.current = true;
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
        const nd = clampDay(ny, nm, base.getDate());
        const d = new Date(ny, nm, nd);
        setCursor(d);
        setView(new Date(ny, nm, 1));
        if (!isDisabled?.(d)) onChange?.(d);
        e.preventDefault();
        handled = true;
        break;
      }
      case 'PageDown': {
        userPagedRef.current = true;
        const ny = base.getMonth() === 11 ? base.getFullYear() + 1 : base.getFullYear();
        const nm = base.getMonth() === 11 ? 0 : base.getMonth() + 1;
        const nd = clampDay(ny, nm, base.getDate());
        const d = new Date(ny, nm, nd);
        setCursor(d);
        setView(new Date(ny, nm, 1));
        if (!isDisabled?.(d)) onChange?.(d);
        e.preventDefault();
        handled = true;
        break;
      }
      case 'Home':
        next = new Date(year, month, 1);
        break;
      case 'End':
        next = new Date(year, month, total);
        break;
      case 'Enter':
      case ' ':
        if (e.target !== e.currentTarget) return;
        if (cursor && !isDisabled?.(cursor)) onChange?.(cursor);
        e.preventDefault();
        handled = true;
        break;
      default:
        return;
    }
    if (handled) return;
    if (next) {
      e.preventDefault();
      const dir = e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'End' ? -1 : 1;
      let candidate = next;
      let guard = 0;
      while (isDisabled?.(candidate) && guard < 400) {
        candidate = addDays(candidate, dir);
        guard++;
      }
      if (isDisabled?.(candidate)) return;
      if (candidate.getMonth() !== month || candidate.getFullYear() !== year) {
        setView(new Date(candidate.getFullYear(), candidate.getMonth(), 1));
      }
      setCursor(candidate);
      onChange?.(candidate);
    }
  };

  const monthLabel = currentView.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const cursorInView = cursor.getFullYear() === year && cursor.getMonth() === month;
  let fallbackSet = false;

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
        <span id={monthLabelId} className={styles['month-label']} aria-live="polite">
          {monthLabel}
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
                const isCursor = sameDay(date, cursor);
                let tabIndex = -1;
                if (isCursor && !disabled) tabIndex = 0;
                else if (!cursorInView && !fallbackSet && !disabled) {
                  tabIndex = 0;
                  fallbackSet = true;
                }
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
