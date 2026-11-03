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

/** Day that should receive focus once the commit carrying it lands. */
type FocusIntent = { key: string; previousKey: string };

/**
 * A chain of page-key months the parent has not finished rendering. It is the base for the next
 * press while the month it started from is still visible, so a parent that applies view changes
 * in a later commit does not collapse repeated keys into one month. `expected` scopes provenance
 * to this chain: any commit on one of those months is the parent applying it (even when the Date
 * was recreated), and the newest one completes the chain.
 */
interface PageRequest {
  /** Month visible when the chain's base was set; the chain only grows while it is still shown. */
  from: Date;
  /** Newest month a page key asked for; with a withdrawal, the month a FIFO parent may still drain. */
  target: Date;
  /** Month keys this chain emitted, oldest first. The last one completes it. */
  expected: string[];
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
    setInternalView((prev) => (sameMonth(prev, value) ? prev : monthStart(value)));
  }, [valueKey, value, view]);

  // Reposition the cursor once a month change has actually rendered: a chevron, a page key or an
  // external `view` all land here, while a controlled parent that rejects the change does not.
  /** Day that should receive focus once the commit carrying it lands. */
  const focusIntentRef = useRef<FocusIntent | null>(null);
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

    const intent = focusIntentRef.current;
    const cursorKey = isoKey(cursor);

    let target: string | null = null;
    if (intent) {
      if (intent.key === cursorKey) {
        focusIntentRef.current = null;
        target = intent.key;
      } else if (cursorKey === intent.previousKey) {
        // A parent can render the new `view` before the cursor update that carries the intent
        // (flushSync, a sync external store); keep it for the next commit.
        return;
      } else {
        // The cursor settled on another day (a parent snapped/clamped the selection). Follow
        // the day that actually won instead of leaving an intent that mutes every later month.
        focusIntentRef.current = null;
        target = cursorKey;
      }
    }
    // Honour focus moves requested by keyboard navigation; otherwise only follow the cursor
    // while focus already lives in the grid, so external value changes never steal it. `body`
    // counts as "lost focus" because the previously focused day may have re-rendered away;
    // focus on another control (a chevron, a dialog) is left alone.
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
    // The flag is true only when this effect really moved focus to a day (or followed a keyboard
    // move into one); focus staying on the grid leaves it false so the month is still announced.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorTime, year, month]);

  // A page key moves the view under a focused day. Once a month the chain asked for renders — a
  // FIFO parent may render several, oldest first — put focus back into the grid unless the parent
  // focused something of its own (a dialog opened from `onViewChange`). This is also how a page
  // into a fully disabled month hands focus to the grid instead of leaving it on `<body>`. Runs
  // after the focus effect so the announcement decision below sees the handoff. Depends on the
  // view object too: a parent can apply a month on the same key without changing `monthKey`.
  useEffect(() => {
    const request = pageRequestRef.current;
    if (!request) return;
    const key = monthKeyOf(currentView);
    // Provenance is scoped to this chain and compared by month key, so a parent that stores
    // `{year, month}` or clones the Date still acks; any other month is the parent navigating on
    // its own and cancels the chain without inheriting its handoff.
    if (!request.expected.includes(key)) {
      pageRequestRef.current = null;
      return;
    }
    // The newest month the chain asked for (or its withdrawal) completes it.
    if (request.expected[request.expected.length - 1] === key) pageRequestRef.current = null;
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
  }, [monthKey, currentView]);

  const [monthAnnouncement, setMonthAnnouncement] = useState('');
  // Announce the month that is actually rendered (covers chevrons, Page keys and external `view`).
  const announcedRef = useRef(monthKey);
  useEffect(() => {
    if (announcedRef.current === monthKey) return;
    // A focus handoff may land in the next commit (a parent can render the view before the cursor
    // update); the handoff records whether a day label will name the month, so decide after it so
    // the duplicate message can be suppressed.
    if (focusIntentRef.current !== null) return;
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
    // A day move keeps a queued page (the parent may still apply it) and hands the focus effect
    // the destination so it can follow the cursor even if the focused day re-rendered away.
    if (next.getTime() === cursor.getTime()) return;
    focusIntentRef.current = { key: isoKey(next), previousKey: isoKey(cursor) };
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
    // visible month moves, the user is paging from what they see. A chain whose newest key is the
    // withdrawal month (not its target) has been withdrawn and never grows from its target.
    const newest = request?.expected[request.expected.length - 1];
    const pending =
      request && newest === monthKeyOf(request.target) && sameMonth(currentView, request.from)
        ? request
        : null;
    const base = pending?.target ?? currentView;
    const target = new Date(base.getFullYear(), base.getMonth() + delta, 1);

    if (pending && sameMonth(target, currentView)) {
      // Net zero: emit the visible month again so a last-wins parent can withdraw the queued one,
      // and remember it as the chain's newest key because a FIFO parent drains the refused months
      // first: the landing handoff must survive them instead of dropping focus on `<body>`.
      pageRequestRef.current = {
        ...pending,
        expected: [...pending.expected, monthKeyOf(currentView)],
      };
      setView(monthStart(currentView));
      return;
    }

    const targetKey = monthKeyOf(target);
    pageRequestRef.current = pending
      ? { ...pending, target, expected: [...pending.expected, targetKey] }
      : {
          from: currentView,
          target,
          // Keep what an earlier chain already asked for: a FIFO parent may still drain those
          // months after this new press, and they are ours, not external navigation.
          expected: [...(request?.expected ?? []), targetKey],
        };
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
