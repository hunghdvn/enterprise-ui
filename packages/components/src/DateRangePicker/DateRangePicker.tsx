import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { DateRange, DateRangePickerProps } from './types';
import styles from './DateRangePicker.module.css';

const GAP_PX = 4;
const EST_CHROME = 48;
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function inRange(d: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false;
  const t = d.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOffset(year: number, month: number): number {
  // Monday-first: 0=Mon .. 6=Sun
  const dow = new Date(year, month, 1).getDay();
  return (dow + 6) % 7;
}

function formatRange(value: DateRange, placeholder: string): string {
  if (!value.from && !value.to) return placeholder;
  const f = value.from ? value.from.toLocaleDateString('vi-VN') : '...';
  const t = value.to ? value.to.toLocaleDateString('vi-VN') : '...';
  return `${f} → ${t}`;
}

// Computed on demand in the click handler (event, not render) so the
// `new Date()` reads do not trip the react-hooks/purity rule. Kept at
// module scope so the lint rule does not see impure calls in the component.
function presetRange(label: string): DateRange {
  const now = new Date();
  const today = startOfDay(now);
  switch (label) {
    case 'Hôm nay':
      return { from: today, to: today };
    case '7 ngày qua':
      return { from: startOfDay(new Date(Date.now() - 6 * 86400000)), to: today };
    case '30 ngày qua':
      return { from: startOfDay(new Date(Date.now() - 29 * 86400000)), to: today };
    case 'Tháng này':
      return {
        from: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
        to: startOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
      };
    default:
      return { from: null, to: null };
  }
}

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => (value.from ? new Date(value.from) : new Date()));
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  const from = value.from ? startOfDay(value.from) : null;
  const to = value.to ? startOfDay(value.to) : null;

  const openAt = () => {
    setOpen(true);
    setView(value.from ? new Date(value.from) : new Date());
    const cr = triggerRef.current?.getBoundingClientRect();
    if (cr) {
      const height = 260 + EST_CHROME;
      const spaceBelow = (window.innerHeight || 0) - cr.bottom - GAP_PX;
      const top = spaceBelow >= height ? cr.bottom + GAP_PX : Math.max(0, cr.top - height - GAP_PX);
      setPosition({ top, left: cr.left, width: Math.max(cr.width, 280) });
    } else {
      setPosition(null);
    }
  };

  const close = () => {
    setOpen(false);
    setPosition(null);
  };

  // Click-away, scroll and focus-boundary dismissal (Combobox/SavedViews).
  useEffect(() => {
    if (!open) return;
    const root = wrapRef.current;
    const onDocMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.target instanceof Node && root && !root.contains(e.target)) close();
    };
    const onScroll = (e: Event) => {
      const target = e.target;
      if (target instanceof Node && root?.contains(target)) return;
      close();
    };
    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null;
      if (related && root?.contains(related)) return;
      close();
    };
    const onResize = () => {
      const cr = triggerRef.current?.getBoundingClientRect();
      if (cr) {
        const height = 260 + EST_CHROME;
        const spaceBelow = (window.innerHeight || 0) - cr.bottom - GAP_PX;
        const top =
          spaceBelow >= height ? cr.bottom + GAP_PX : Math.max(0, cr.top - height - GAP_PX);
        setPosition({ top, left: cr.left, width: Math.max(cr.width, 280) });
      }
    };
    document.addEventListener('mousedown', onDocMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('focusout', onFocusOut, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('focusout', onFocusOut, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const pickDay = (d: Date) => {
    const day = startOfDay(d);
    if (!from || (from && to)) {
      // Start a new range.
      onChange({ from: day, to: null });
    } else if (day.getTime() < from.getTime()) {
      // Clicked before the start → swap so from <= to.
      onChange({ from: day, to: from });
    } else {
      onChange({ from, to: day });
    }
  };

  const year = view.getFullYear();
  const month = view.getMonth();
  const offset = firstDayOffset(year, month);
  const totalDays = daysInMonth(year, month);
  const cells: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(new Date(year, month, d));
  // pad to complete the last week
  while (cells.length % 7 !== 0) cells.push(null);

  const triggerLabel = formatRange(value, placeholder);

  return (
    <div
      ref={wrapRef}
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      data-disabled={disabled || undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        data-size={size}
        aria-label={ariaLabel ?? 'Chọn khoảng ngày'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openAt())}
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          <Icon name="calendar" size={14} />
        </span>
        <span className={styles.triggerLabel}>{triggerLabel}</span>
        <span className={styles.chevron} aria-hidden="true">
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {open && position && (
        <div
          id={dialogId}
          role="dialog"
          aria-label={ariaLabel ?? 'Chọn khoảng ngày'}
          className={styles.panel}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            if (e.key === 'Escape') {
              e.preventDefault();
              close();
            }
          }}
        >
          <div className={styles.panelHeader}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setView(new Date(year, month - 1, 1))}
              aria-label="Tháng trước"
            >
              <Icon name="chevron-left" size={14} />
            </button>
            <span className={styles.monthLabel}>
              {view.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setView(new Date(year, month + 1, 1))}
              aria-label="Tháng sau"
            >
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday}>
                {w}
              </span>
            ))}
          </div>
          <div className={styles.grid} role="grid">
            {cells.map((d, i) => {
              if (!d) return <span key={`blank-${i}`} className={styles.blank} />;
              const isStart = sameDay(d, from);
              const isEnd = sameDay(d, to);
              const inside = inRange(d, from, to);
              return (
                <button
                  key={d.getTime()}
                  type="button"
                  role="gridcell"
                  aria-selected={isStart || isEnd}
                  className={[
                    styles.day,
                    isStart ? styles['day-start'] : '',
                    isEnd ? styles['day-end'] : '',
                    inside && !isStart && !isEnd ? styles['day-in'] : '',
                  ].join(' ')}
                  onClick={() => pickDay(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
          <div className={styles.presets}>
            {['Hôm nay', '7 ngày qua', '30 ngày qua', 'Tháng này'].map((label) => (
              <button
                key={label}
                type="button"
                className={styles.preset}
                onClick={() => {
                  onChange(presetRange(label));
                  close();
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
