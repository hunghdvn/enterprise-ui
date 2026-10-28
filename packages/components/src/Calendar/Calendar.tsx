import { useCallback, useRef, useState } from 'react';
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
  const initialView = view ?? (value ? new Date(value) : new Date());
  const [internalView, setInternalView] = useState(initialView);
  const currentView = view ?? internalView;
  const setView = useCallback(
    (next: Date) => {
      if (onViewChange) onViewChange(next);
      else setInternalView(next);
    },
    [onViewChange],
  );

  const year = currentView.getFullYear();
  const month = currentView.getMonth();
  const today = startOfDay(new Date());

  const offset = firstOffset(year, month);
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const gridRef = useRef<HTMLDivElement>(null);

  const changeMonth = (delta: number) => {
    setView(new Date(year, month + delta, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const sel = value ? startOfDay(value) : null;
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowRight':
        if (sel) next = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() + 1);
        break;
      case 'ArrowLeft':
        if (sel) next = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() - 1);
        break;
      case 'ArrowDown':
        if (sel) next = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() + 7);
        break;
      case 'ArrowUp':
        if (sel) next = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() - 7);
        break;
      case 'PageUp':
        changeMonth(-1);
        e.preventDefault();
        return;
      case 'PageDown':
        changeMonth(1);
        e.preventDefault();
        return;
      case 'Home':
        if (sel) next = new Date(year, month, 1);
        break;
      case 'End':
        if (sel) next = new Date(year, month, total);
        break;
      case 'Enter':
      case ' ':
        if (sel) onChange?.(sel);
        e.preventDefault();
        return;
      default:
        return;
    }
    if (next) {
      e.preventDefault();
      if (next.getMonth() !== month) setView(new Date(next.getFullYear(), next.getMonth(), 1));
      onChange?.(next);
    }
  };

  const monthLabel = currentView.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

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
        <span className={styles['month-label']} aria-live="polite">
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
        aria-label={ariaLabel ?? 'Lịch'}
        aria-labelledby={undefined}
        tabIndex={0}
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
          {cells.map((d, i) => {
            if (d === null)
              return (
                <div key={`b-${i}`} className={styles.blank} role="gridcell" aria-hidden="true" />
              );
            const date = new Date(year, month, d);
            const disabled = isDisabled ? isDisabled(date) : false;
            const selected = sameDay(date, value ?? null);
            const isToday = sameDay(date, today);
            const ev = events?.[isoKey(date)];
            return (
              <button
                key={d}
                type="button"
                role="gridcell"
                aria-selected={selected}
                aria-current={isToday ? 'date' : undefined}
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
                  if (!disabled) onChange?.(date);
                }}
              >
                <span className={styles['day-num']}>{d}</span>
                {ev && <span className={styles['day-events']}>{ev}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
