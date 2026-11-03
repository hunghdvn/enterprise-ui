import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import {
  DAYS_PER_WEEK,
  WEEKDAYS,
  addDays,
  clampDay,
  daysInMonth,
  firstDayOffset,
  formatDay,
  formatMonth,
  isoKey,
  monthKeyOf,
  monthStart,
  sameDay,
  sameMonth,
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

/** Day a month render settles on: the selection when it lives in that month, else the cursor day. */
function settleDay(
  value: Date | null,
  cursor: Date,
  monthView: Date,
  isDisabled?: (d: Date) => boolean,
): Date | null {
  const day = value && sameMonth(value, monthView) ? value.getDate() : cursor.getDate();
  return nearestEnabled(monthView.getFullYear(), monthView.getMonth(), day, isDisabled);
}

/** Event entries that actually render; booleans and empty strings would leave a blank line. */
function eventList(ev: ReactNode): ReactNode[] {
  const list = ev == null ? [] : Array.isArray(ev) ? ev : [ev];
  return list.filter((item) => item != null && item !== false && item !== true && item !== '');
}

/**
 * A chain of page-key months the parent has not finished rendering. It is the base for the next
 * press while the month it started from is still visible, so a parent that applies view changes
 * in a later commit does not collapse repeated keys into one month. A net-zero press marks the
 * chain `withdrawn` instead of dropping it: a FIFO parent still drains the refused months first,
 * and the landing handoff has to survive them so focus never falls to `<body>`.
 */
interface PageRequest {
  /** Month visible when the chain's base was set; the chain only grows while it is still shown. */
  from: Date;
  /** Newest month a page key asked for. */
  target: Date;
  /** True once a press withdrew the chain; the parent may still render its earlier months. */
  withdrawn: boolean;
}

/** Whole event lines that fit each cell; the rest stay in the accessible description. Internal:
 *  the capacity is documented on the `events` prop rather than exported as API. */
const CALENDAR_EVENT_LINES = { sm: 1, md: 2 } as const;

/** Column count is set from `WEEKDAYS.length` so CSS geometry and key handling cannot drift. */
const GRID_STYLE = { '--cal-cols': DAYS_PER_WEEK } as CSSProperties;

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
    view ?? (value ? monthStart(value) : new Date()),
  );
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (view) setInternalView(view);
  }, [view]);

  const currentView = view ?? internalView;
  const year = currentView.getFullYear();
  const month = currentView.getMonth();
  const monthKey = monthKeyOf(currentView);

  /**
   * Exact months handed to `onViewChange`, newest last (bounded). A controlled `view` that is one
   * of these objects is the parent applying our navigation; any other object is external (router,
   * month picker) even when it lands on the same month, and must not inherit the page handoff.
   */
  const emittedViewsRef = useRef<Date[]>([]);
  const setView = useCallback(
    (next: Date) => {
      const emitted = emittedViewsRef.current;
      emitted.push(next);
      if (emitted.length > 16) emitted.splice(0, emitted.length - 16);
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
    setInternalView((prev) => (sameMonth(prev, value) ? prev : monthStart(value)));
  }, [valueKey, value, view]);

  // Reposition the cursor once a month change has actually rendered: a chevron, a page key or an
  // external `view` all land here, while a controlled parent that rejects the change does not.
  /** One-shot: a keyboard day move asks focus to follow the cursor in the commit carrying it. */
  const focusIntentRef = useRef(false);
  /** The page request the parent has not rendered yet (if any). */
  const pageRequestRef = useRef<PageRequest | null>(null);

  useEffect(() => {
    if (sameMonth(cursor, currentView)) return;
    // Keep the day-of-month so paging away and back never loses it; a selection in the month
    // being shown wins (view and value set together).
    const next = settleDay(value, cursor, currentView, isDisabled);
    // A fully disabled month has no focusable day: leave the cursor (and its day-of-month)
    // where it is and let `tabStop` fall back to the grid instead of clamping into it.
    if (!next) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCursor(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  /** True when the last commit focused an element whose own label already names the month. */
  const focusNamesMonthRef = useRef(false);
  const cursorTime = cursor.getTime();
  useEffect(() => {
    focusNamesMonthRef.current = false;
    const grid = gridRef.current;
    if (!grid) return;

    const cursorKey = isoKey(cursor);

    // Honour focus moves requested by keyboard navigation; otherwise only follow the cursor
    // while focus already lives in the grid, so external value changes never steal it. `body`
    // counts as "lost focus" because the previously focused day may have re-rendered away;
    // focus on another control (a chevron, a dialog) is left alone.
    let target: string | null = null;
    if (focusIntentRef.current) {
      focusIntentRef.current = false;
      target = cursorKey;
    }
    const active = document.activeElement;
    const focusInside = grid.contains(active);
    if (!focusInside && target === null) return;
    if (!focusInside && active !== null && active !== document.body) return;
    const el = grid.querySelector<HTMLButtonElement>(`[data-date="${target ?? cursorKey}"]`);
    if (el && !el.disabled) {
      const alreadyFocused = document.activeElement === el;
      el.focus({ preventScroll: true });
      // A day button reused for the same day number keeps focus without firing a focus event,
      // so its new label is never spoken: only a real focus move may suppress the month status.
      focusNamesMonthRef.current = !alreadyFocused && document.activeElement === el;
    }
    // Focus staying on the grid is not a day-label move, so the flag above stays false and the
    // month announcement is not suppressed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorTime, year, month]);

  // A page key moves the view under a focused day. Once a month we handed to `onViewChange`
  // renders (a FIFO parent may render several, oldest first), put focus back into the grid
  // unless the parent focused something of its own (a dialog opened from `onViewChange`). This
  // is also how a page into a fully disabled month hands focus to the grid instead of leaving it
  // on `<body>`. Runs after the focus effect so the announcement decision below sees the handoff.
  useEffect(() => {
    const request = pageRequestRef.current;
    if (!request) return;
    const emitted = emittedViewsRef.current;
    // Identity is the only signal available: a controlled `view` that is one of the objects we
    // emitted is the parent applying our navigation, any other object is the parent navigating
    // on its own, even when it lands on a month we asked for. External commits keep the request
    // (the user may still be on their way back to `from`) but must not inherit its handoff.
    if (!emitted.includes(currentView)) return;
    // The newest emission completes the chain; older echoes may still be followed by the rest
    // of a fifo queue or by the withdrawal month.
    if (emitted[emitted.length - 1] === currentView) pageRequestRef.current = null;
    const grid = gridRef.current;
    if (!grid) return;
    const active = document.activeElement;
    // The day the month effect is about to put the cursor on, so focus can land on it without
    // waiting for the cursor commit.
    const nextDay = settleDay(value, cursor, currentView, isDisabled);
    const targetEl = nextDay
      ? grid.querySelector<HTMLButtonElement>(`[data-date="${isoKey(nextDay)}"]`)
      : null;
    if (targetEl && active === targetEl) {
      // React keys the cells by day number, so the same button is often reused for the same day
      // in the new month. It keeps focus without a focus event, so its new label is not read and
      // the month status must speak instead. The focus effect above already decided the flag:
      // it is true only when that commit really moved focus to this day.
      return;
    }
    // A day button reused for the same day number in the new month keeps focus (jsdom and
    // browsers keep it on a node that was only disabled), so a grid descendant counts as lost.
    if (active !== document.body && !grid.contains(active)) return;
    if (targetEl) {
      targetEl.focus({ preventScroll: true });
      // A real focus move reads the day label, which already names the month.
      focusNamesMonthRef.current = true;
      return;
    }
    // A fully disabled month has no day to focus: the grid itself is the only tab stop left.
    const alreadyFocused = active === grid;
    grid.focus({ preventScroll: true });
    // A grid that already held focus (two closed months in a row) must still speak the new month.
    focusNamesMonthRef.current = !alreadyFocused && ariaLabel === undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  const [monthAnnouncement, setMonthAnnouncement] = useState('');
  // Announce the month that is actually rendered (covers chevrons, Page keys and external `view`).
  const announcedRef = useRef(monthKey);
  useEffect(() => {
    if (announcedRef.current === monthKey) return;
    // The focus effect consumes its one-shot intent in the commit that carries it; if it could
    // not run (no grid yet), defer this decision so a day label can still suppress the message.
    if (focusIntentRef.current) return;
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
  }, [monthKey, cursorTime]);

  const cursorInView = sameMonth(cursor, currentView);
  // Roving tab stop: always resolve to an enabled day in the visible month so the grid stays
  // reachable by Tab even when the cursor sits on a disabled/off-month date or the month is
  // closed (then the grid itself becomes the tab stop). Day and page navigation start from this
  // same day, so a disabled/off-month `value` cannot seed an invisible move.
  const tabStop =
    cursorInView && !isDisabled?.(cursor)
      ? cursor
      : nearestEnabled(year, month, cursor.getDate(), isDisabled);

  const changeMonth = (target: Date) => {
    // A chevron is a fresh navigation: it drops any queued page request. The month effect above
    // moves the cursor after the new month has rendered; moving it here would also move it when
    // a controlled parent rejects the change.
    pageRequestRef.current = null;
    setView(target);
  };

  const setCursorIntent = (next: Date) => {
    // A day move keeps a queued page (the parent may still apply it) and asks the focus effect
    // to follow the cursor even if the previously focused day re-rendered away.
    if (next.getTime() === cursor.getTime()) return;
    focusIntentRef.current = true;
    if (!sameMonth(next, currentView)) setView(monthStart(next));
    setCursor(next);
  };

  const moveCursor = (next: Date) => {
    setCursorIntent(next);
    onChange?.(next);
  };

  /**
   * PageUp/PageDown: move the view one month. The roving cursor keeps its day-of-month (clamped,
   * skipping disabled days) and focus follows it once that month renders; the selection is
   * untouched — Enter, click or an arrow key commits a day.
   */
  const pageMonth = (delta: 1 | -1) => {
    // A page key is pressed inside the grid, so parking the cursor on the visible tab stop keeps
    // the day-of-month from a hidden disabled/off-month cursor day.
    const anchor = tabStop ?? cursor;
    if (anchor.getTime() !== cursor.getTime()) setCursor(anchor);

    const request = pageRequestRef.current;
    // Trust the queued target only while the parent has not rendered any month yet: once the
    // visible month moves, the user is paging from what they see. Keeping a stale target would
    // swallow a reversal after a partial drain or skip a month opened from outside.
    const pending =
      request && !request.withdrawn && sameMonth(currentView, request.from) ? request : null;
    const base = pending?.target ?? currentView;
    const target = new Date(base.getFullYear(), base.getMonth() + delta, 1);

    if (sameMonth(target, currentView)) {
      // Net zero: emit the visible month again so a last-wins parent can withdraw the queued one.
      // The chain is kept as `withdrawn` because a FIFO parent drains the refused months first:
      // the landing handoff must survive them instead of dropping focus on `<body>`.
      if (request) pageRequestRef.current = { ...request, withdrawn: true };
      setView(monthStart(currentView));
      return;
    }

    pageRequestRef.current = { from: currentView, target, withdrawn: false };
    setView(target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const base = tabStop;
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
          e.key === 'ArrowUp'
            ? -DAYS_PER_WEEK
            : e.key === 'ArrowDown'
              ? DAYS_PER_WEEK
              : e.key === 'ArrowLeft'
                ? -1
                : 1;
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
        if (!sameMonth(cursor, currentView)) return;
        if (!isDisabled?.(cursor)) onChange?.(cursor);
        e.preventDefault();
        handled = true;
        break;
      default:
        return;
    }
    if (handled || !next) return;
    e.preventDefault();
    const stepSize = e.key === 'ArrowUp' || e.key === 'ArrowDown' ? DAYS_PER_WEEK : 1;
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
  while (cells.length % DAYS_PER_WEEK !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += DAYS_PER_WEEK)
    weeks.push(cells.slice(i, i + DAYS_PER_WEEK));

  // Lines that do not fit the cell stay in the day's accessible description (sr-only) instead
  // of being display:none, which would remove them from the text alternative.
  const visibleEvents = CALENDAR_EVENT_LINES[size];

  return (
    <div className={cx(styles.wrap, className)} data-size={size} style={GRID_STYLE}>
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
                        // A click is a direct selection; a queued page request stays for its
                        // landing handoff.
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
