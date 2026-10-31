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

/** Event entries that actually render; booleans and empty strings would leave a blank line. */
function eventList(ev: ReactNode): ReactNode[] {
  const list = ev == null ? [] : Array.isArray(ev) ? ev : [ev];
  return list.filter((item) => item != null && item !== false && item !== true && item !== '');
}

/** A PageUp/PageDown request waiting for its target month to actually render. */
interface PendingPage {
  /** Month that was rendered when the key was pressed; scopes the request to that commit. */
  fromMonthKey: string;
  /** Month the request should land on; advances when the key repeats while it waits. */
  target: Date;
  /** Day-of-month to keep; resolved against `isDisabled` only when the request is applied. */
  anchorDay: number;
  /** Selected day when the key was pressed; a newer selection wins over this request. */
  valueKey: string;
}

/** Day or grid that should receive focus once the commit carrying it lands. */
type FocusIntent =
  { kind: 'day'; key: string; previousKey: string } | { kind: 'grid'; monthKey: string };

/**
 * Resolve a waiting request against the props as they are when it is applied, not as they were
 * when the key was pressed: a list that started blocking the day, or a newer selection, wins.
 */
function resolvePage(
  request: PendingPage,
  isDisabled: ((d: Date) => boolean) | undefined,
  value: Date | null,
  valueKey: string,
): { cursor: Date | null; select: Date | null } {
  const year = request.target.getFullYear();
  const month = request.target.getMonth();
  const cursor = nearestEnabled(year, month, request.anchorDay, isDisabled);
  if (!cursor) return { cursor: null, select: null };
  // Only the anchor day itself is a selection, a skipped disabled day just moves the cursor, and
  // a selection that changed while the request waited is never overwritten by it.
  const anchor = new Date(year, month, clampDay(year, month, request.anchorDay));
  const select =
    sameDay(cursor, anchor) && valueKey === request.valueKey && !sameDay(cursor, value)
      ? cursor
      : null;
  return { cursor, select };
}

/** Whole event lines that fit each cell; the rest stay in the accessible description. */
export const CALENDAR_EVENT_LINES = { sm: 1, md: 2 } as const;

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
  /** Exact `Date` last handed to `onViewChange`, so an echo can be told from an unrelated view. */
  const requestedViewRef = useRef<Date | null>(null);

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
  const monthKey = monthKeyOf(currentView);

  const setView = useCallback(
    (next: Date) => {
      // The exact `Date` handed to `onViewChange`. A later controlled `view` that is this very
      // object is the parent accepting our request; any other object is the parent navigating on
      // its own, even when it lands on the same month.
      requestedViewRef.current = next;
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
      sameMonth(prev, value) ? prev : new Date(value.getFullYear(), value.getMonth(), 1),
    );
  }, [valueKey, value, view]);

  // Reposition the cursor once a month change has actually rendered. Chevrons only request the
  // month, so an accepted change lands here and a rejected controlled change never gets here.
  const [pendingPage, setPendingPage] = useState<PendingPage | null>(null);
  /** The one focus handoff still waiting for the commit that carries it. */
  const focusIntentRef = useRef<FocusIntent | null>(null);

  /**
   * A page request only applies when the month it asks for is the one we requested through
   * `onViewChange` — the parent echoing it back. A parent that rejects the page and later shows
   * that month for its own reasons (month picker, deep link) must not inherit the hidden commit.
   */
  const pageLanded = (request: PendingPage): boolean =>
    monthKeyOf(request.target) === monthKey &&
    (view === undefined || requestedViewRef.current === view);

  useEffect(() => {
    // An accepted page key applies its own cursor (and focus) below; a rejected one never
    // reaches this effect because `monthKey` did not change.
    if (pendingPage && pageLanded(pendingPage)) return;
    if (sameMonth(cursor, currentView)) return;
    // The selection wins when it lives in the month being shown (view and value set together),
    // otherwise keep the day-of-month so paging away and back never loses it.
    const day = value && sameMonth(value, currentView) ? value.getDate() : cursor.getDate();
    const next = nearestEnabled(year, month, day, isDisabled);
    // A fully disabled month has no focusable day: leave the cursor (and its day-of-month)
    // where it is and let `tabStop` fall back to the grid instead of clamping into it.
    if (!next) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCursor(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  // Page keys only request a month. Applying the cursor and selection here — after that month
  // actually rendered — keeps a controlled parent that clamps its range from committing a date
  // nobody can see, and lets a fully disabled target hand focus to the grid instead.
  useEffect(() => {
    if (!pendingPage) return;
    if (pageLanded(pendingPage)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingPage(null);
      requestedViewRef.current = null;
      // Re-validate against the props as they are now: the selection or `isDisabled` may have
      // changed while the parent was deciding whether to show the month.
      const { cursor: next, select } = resolvePage(pendingPage, isDisabled, value, valueKey);
      if (!next) {
        focusIntentRef.current = { kind: 'grid', monthKey };
        return;
      }
      setCursor(next);
      focusIntentRef.current = { kind: 'day', key: isoKey(next), previousKey: isoKey(cursor) };
      if (select) onChange?.(select);
      return;
    }
    // The request lives for exactly one `onViewChange` round trip: it is dropped when the view
    // settles on any other month (the parent rejected or overrode it) as well as when the target
    // month is already rendered without carrying our commit. `pageMonth` re-arms it for a repeat.
    if (monthKey !== pendingPage.fromMonthKey || monthKeyOf(pendingPage.target) === monthKey) {
      setPendingPage(null);
      requestedViewRef.current = null;
    }
    // `view` is a dependency so a controlled parent answering with the same month still runs the
    // landing check above: without it the request would sit armed until some later month change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPage, monthKey, view]);

  /** True when the last commit focused an element whose own label already names the month. */
  const focusNamesMonthRef = useRef(false);
  const cursorTime = cursor.getTime();
  useEffect(() => {
    focusNamesMonthRef.current = false;
    const grid = gridRef.current;
    if (!grid) return;

    const intent = focusIntentRef.current;
    const cursorKey = isoKey(cursor);

    // Grid handoff: the target month had no focusable day, so the grid itself takes focus.
    if (intent?.kind === 'grid') {
      if (intent.monthKey !== monthKey) {
        focusIntentRef.current = null;
        return;
      }
      focusIntentRef.current = null;
      const active = document.activeElement;
      // A closed month unmounts the focused day; only take focus back when it was lost to the
      // page or already lived in the grid, never from a dialog opened in `onViewChange`.
      if (!grid.contains(active) && active !== null && active !== document.body) return;
      const alreadyFocused = active === grid;
      grid.focus({ preventScroll: true });
      // Only a real focus move onto the grid replaces the month announcement. A grid that
      // already held focus (two closed months in a row) must still speak the new month.
      focusNamesMonthRef.current =
        !alreadyFocused && document.activeElement === grid && ariaLabel === undefined;
      return;
    }

    let target: string | null = null;
    if (intent) {
      if (intent.key === cursorKey) {
        focusIntentRef.current = null;
        target = intent.key;
      } else if (cursorKey === intent.previousKey) {
        // The cursor update that carries this intent has not committed yet (page keys apply
        // the cursor after the target month renders); keep the intent for the next commit.
        return;
      } else {
        // The cursor settled on another day (a parent snapped/clamped the selection). Follow
        // the day that actually won instead of leaving an intent that mutes every later month.
        focusIntentRef.current = null;
        target = cursorKey;
      }
    }
    // Honour focus moves requested by keyboard navigation; otherwise only follow the cursor
    // while focus already lives in the grid, so external value changes never steal it.
    // `body` counts as "lost focus" because the previously focused day may have re-rendered away.
    const active = document.activeElement;
    const focusInside = grid.contains(active);
    if (!focusInside && target === null) return;
    if (!focusInside && active !== null && active !== document.body) return;
    const el = grid.querySelector<HTMLButtonElement>(`[data-date="${target ?? cursorKey}"]`);
    if (el && !el.disabled) {
      const alreadyFocused = document.activeElement === el;
      el.focus({ preventScroll: true });
      // A day button reused for the same day number in the same week slot keeps focus without
      // firing a focus event, so its new label is never spoken: only a real focus move may
      // suppress the month status.
      focusNamesMonthRef.current = !alreadyFocused && document.activeElement === el;
    }
    // A grid that already holds focus is not a focus move, so the month is still announced.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorTime, year, month]);

  const [monthAnnouncement, setMonthAnnouncement] = useState('');
  // Announce the month that is actually rendered (covers chevrons, Page keys and external `view`).
  const announcedRef = useRef(monthKey);
  useEffect(() => {
    if (announcedRef.current === monthKey) return;
    // The page-key handover applies its cursor in the next commit; decide after it lands so a
    // focused day (whose label names the month) can suppress the duplicate message.
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

  /** Drop every waiting handoff: a page request and the focus it was going to claim. */
  const cancelIntent = () => {
    setPendingPage(null);
    focusIntentRef.current = null;
  };

  const changeMonth = (target: Date) => {
    // A chevron is a fresh navigation: it supersedes any page request and its focus handoff.
    // The month effect above moves the cursor after the new month has rendered. Moving it here
    // would also move it when a controlled parent rejects the change.
    cancelIntent();
    setView(target);
  };

  const setCursorIntent = (next: Date) => {
    // Any direct move supersedes a page request whose target month has not been applied yet.
    cancelIntent();
    const intent = { kind: 'day' as const, key: isoKey(next), previousKey: isoKey(cursor) };
    if (sameMonth(next, currentView)) {
      if (next.getTime() !== cursor.getTime()) focusIntentRef.current = intent;
      setCursor(next);
      return;
    }
    focusIntentRef.current = intent;
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
    setCursor(next);
  };

  const moveCursor = (next: Date) => {
    setCursorIntent(next);
    onChange?.(next);
  };

  /** PageUp/PageDown: request the month; cursor/selection land once that month renders. */
  const pageMonth = (delta: number) => {
    // Key repeat while the request is still waiting stacks up: two PageDowns ask for two
    // months ahead, starting from the month the wait already targets.
    const waiting = pendingPage && pendingPage.fromMonthKey === monthKey ? pendingPage : null;
    const from = waiting ? waiting.target : currentView;
    const targetView = new Date(from.getFullYear(), from.getMonth() + delta, 1);
    // A closed current month has no tab stop; its cursor day still carries the page anchor.
    const day = waiting ? waiting.anchorDay : (tabStop?.getDate() ?? cursor.getDate());
    setPendingPage({ fromMonthKey: monthKey, target: targetView, anchorDay: day, valueKey });
    setView(targetView);
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
        cancelIntent();
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
                        // A click is a direct selection: it drops any page request still waiting.
                        cancelIntent();
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
