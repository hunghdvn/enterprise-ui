import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import {
  DAYS_PER_WEEK,
  WEEKDAYS,
  daysInMonth,
  firstDayOffset,
  formatMonth,
  sameDay,
  startOfDay,
} from '../internal/date';
import type { DateRange, DateRangePickerProps } from './types';
import styles from './DateRangePicker.module.css';

const GAP_PX = 4;
const EST_CHROME = 48;

/** Column count comes from `WEEKDAYS.length` so the grid math and the CSS cannot drift. */
const GRID_STYLE = { '--drp-cols': DAYS_PER_WEEK } as CSSProperties;

function inRange(d: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  const t = d.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

function formatRange(value: DateRange, placeholder: string): string {
  if (!value.from && !value.to) return placeholder;
  const f = value.from ? value.from.toLocaleDateString('vi-VN') : '...';
  const t = value.to ? value.to.toLocaleDateString('vi-VN') : '...';
  return `${f} → ${t}`;
}

function presetRange(label: string): DateRange {
  const now = new Date();
  const today = startOfDay(now);
  switch (label) {
    case 'Hôm nay':
      return { from: today, to: new Date(today) };
    case '7 ngày qua': {
      const d = new Date(today);
      d.setDate(d.getDate() - 6);
      return { from: startOfDay(d), to: today };
    }
    case '30 ngày qua': {
      const d = new Date(today);
      d.setDate(d.getDate() - 29);
      return { from: startOfDay(d), to: today };
    }
    case 'Tháng này':
      return {
        from: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
        to: startOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
      };
    default:
      return { from: null, to: null };
  }
}

type Cell = { date: Date; out: boolean };

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Chọn khoảng ngày',
  size = 'sm',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: DateRangePickerProps) {
  const uid = useId();
  const dialogId = `date-range-${uid.replace(/:/g, '')}`;
  const monthLabelId = `date-range-month-${uid.replace(/:/g, '')}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mouseInsideRoot = useRef(false);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => (value.from ? new Date(value.from) : new Date()));
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  const from = value.from ? startOfDay(value.from) : null;
  const to = value.to ? startOfDay(value.to) : null;

  const openAt = () => {
    if (disabled) return;
    setOpen(true);
    setView(value.from ? new Date(value.from) : new Date());
    const cr = triggerRef.current?.getBoundingClientRect();
    if (cr) {
      const height = 260 + EST_CHROME;
      const spaceBelow = (window.innerHeight || 0) - cr.bottom - GAP_PX;
      const top = spaceBelow >= height ? cr.bottom + GAP_PX : Math.max(0, cr.top - height - GAP_PX);
      const width = Math.max(cr.width, 280);
      const left = Math.max(8, Math.min(cr.left, (window.innerWidth || 0) - width - 8));
      setPosition({ top, left, width });
    } else {
      setPosition(null);
    }
  };

  const close = (focusTrigger = false) => {
    setOpen(false);
    setPosition(null);
    if (focusTrigger) triggerRef.current?.focus();
  };

  // Focus the panel on open (light focus trap).
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Click-away, scroll and focus-boundary dismissal.
  useEffect(() => {
    if (!open) return;
    const root = wrapRef.current;
    const onDocMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.target instanceof Node && root && root.contains(e.target)) {
        mouseInsideRoot.current = true;
      } else {
        mouseInsideRoot.current = false;
        if (e.target instanceof Node && root && !root.contains(e.target)) close(false);
      }
    };
    const onMouseUp = () => {
      // reset after the interaction completes
      setTimeout(() => {
        mouseInsideRoot.current = false;
      }, 0);
    };
    const onScroll = (e: Event) => {
      const target = e.target;
      if (target instanceof Node && root?.contains(target)) return;
      close(false);
    };
    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null;
      if (related && root?.contains(related)) return;
      if (!related && mouseInsideRoot.current) return;
      close(false);
    };
    const onResize = () => {
      const cr = triggerRef.current?.getBoundingClientRect();
      if (cr) {
        const height = 260 + EST_CHROME;
        const spaceBelow = (window.innerHeight || 0) - cr.bottom - GAP_PX;
        const top =
          spaceBelow >= height ? cr.bottom + GAP_PX : Math.max(0, cr.top - height - GAP_PX);
        const width = Math.max(cr.width, 280);
        const left = Math.max(8, Math.min(cr.left, (window.innerWidth || 0) - width - 8));
        setPosition({ top, left, width });
      }
    };
    document.addEventListener('mousedown', onDocMouseDown, true);
    document.addEventListener('mouseup', onMouseUp, true);
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('focusout', onFocusOut, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown, true);
      document.removeEventListener('mouseup', onMouseUp, true);
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('focusout', onFocusOut, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const pickDay = (d: Date) => {
    if (disabled) return;
    const day = startOfDay(d);
    if (!from || (from && to)) {
      onChange({ from: day, to: null });
    } else if (day.getTime() < from.getTime()) {
      onChange({ from: day, to: from });
    } else {
      onChange({ from, to: day });
    }
  };

  const year = view.getFullYear();
  const month = view.getMonth();
  const offset = firstDayOffset(year, month);
  const totalDays = daysInMonth(year, month);

  // Build cells including adjacent-month pads (spec D4).
  const cells: Cell[] = [];
  for (let i = 0; i < offset; i++) {
    cells.push({ date: new Date(year, month, 1 - offset + i), out: true });
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ date: new Date(year, month, d), out: false });
  }
  const next = new Date(year, month, totalDays + 1);
  while (cells.length % DAYS_PER_WEEK !== 0) {
    cells.push({ date: new Date(next), out: true });
    next.setDate(next.getDate() + 1);
  }

  const triggerLabel = formatRange(value, placeholder);
  const popoverOpen = open && !disabled && !!position;

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) close(false);
      else openAt();
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      close(true);
    }
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={cx(styles.wrap, className)}
      data-disabled={disabled || undefined}
      style={GRID_STYLE}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        data-size={size}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        disabled={disabled}
        onClick={() => (open ? close(false) : openAt())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles['trigger-icon']} aria-hidden="true">
          <Icon name="calendar" size={14} />
        </span>
        <span className={styles['trigger-label']}>{triggerLabel}</span>
        <span className={styles.chevron} aria-hidden="true">
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {popoverOpen && position && (
        <div
          ref={panelRef}
          id={dialogId}
          role="dialog"
          aria-label={ariaLabel ?? 'Chọn khoảng ngày'}
          className={styles.panel}
          tabIndex={-1}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
          }}
          onKeyDown={handlePanelKeyDown}
        >
          <div className={styles['panel-header']}>
            <button
              type="button"
              className={styles['nav-btn']}
              onClick={() => setView(new Date(year, month - 1, 1))}
              aria-label="Tháng trước"
            >
              <Icon name="chevron-left" size={14} />
            </button>
            <span id={monthLabelId} className={styles['month-label']} aria-live="polite">
              {formatMonth(view)}
            </span>
            <button
              type="button"
              className={styles['nav-btn']}
              onClick={() => setView(new Date(year, month + 1, 1))}
              aria-label="Tháng sau"
            >
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
          <div className={styles.weekdays} role="row">
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday} role="columnheader">
                {w}
              </span>
            ))}
          </div>
          <div className={styles.grid} role="grid" aria-labelledby={monthLabelId}>
            {(() => {
              const rows: Cell[][] = [];
              for (let i = 0; i < cells.length; i += DAYS_PER_WEEK)
                rows.push(cells.slice(i, i + DAYS_PER_WEEK));
              return rows.map((row, ri) => (
                <div key={ri} role="row" className={styles.row} style={{ display: 'contents' }}>
                  {row.map((cell) => {
                    const d = cell.date;
                    const isStart = sameDay(d, from);
                    const isEnd = sameDay(d, to);
                    const inside = inRange(d, from, to);
                    return (
                      <button
                        key={d.getTime()}
                        type="button"
                        role="gridcell"
                        aria-selected={isStart || isEnd}
                        className={cx(
                          styles.day,
                          cell.out && styles['day-out'],
                          isStart && styles['day-start'],
                          isEnd && styles['day-end'],
                          inside && !isStart && !isEnd && styles['day-in'],
                        )}
                        onClick={() => pickDay(d)}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              ));
            })()}
          </div>
          <div className={styles.presets}>
            {['Hôm nay', '7 ngày qua', '30 ngày qua', 'Tháng này'].map((label) => (
              <button
                key={label}
                type="button"
                className={styles.preset}
                onClick={() => {
                  if (disabled) return;
                  onChange(presetRange(label));
                  close(true);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
