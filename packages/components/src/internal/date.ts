/**
 * Calendar math shared by date-aware components (Calendar, DateRangePicker) so
 * month grids agree on day boundaries, keys and week offsets.
 */

/** Monday-first weekday headers shared by the month grids. */
export const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/** Columns in a month grid; also feeds the `--cal-cols` custom property. */
export const DAYS_PER_WEEK = WEEKDAYS.length;

/** Midnight of `d`, in local time. */
export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** True when both dates fall on the same calendar day (time of day is ignored). */
export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** `YYYY-MM-DD` key used by `events` maps. */
export function isoKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** True when both dates fall in the same calendar month (day and time are ignored). */
export function sameMonth(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** `YYYY-M` identity of a month (0-based, unpadded) used by Calendar's view state. */
export function monthKeyOf(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

/** Number of days in a month (month is 0-based). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Leading blank cells before day 1, with Monday as the first column. */
export function firstDayOffset(year: number, month: number): number {
  const dow = new Date(year, month, 1).getDay();
  return (dow + 6) % 7;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Clamps a day-of-month to the length of the target month (31 → 30, 29 Feb, …). */
export function clampDay(year: number, month: number, day: number): number {
  return Math.min(day, daysInMonth(year, month));
}

/** "15 tháng 10, 2026" — the accessible label of a single day. */
export function formatDay(d: Date): string {
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** "tháng 10 năm 2026" — the heading of a month grid. */
export function formatMonth(d: Date): string {
  return d.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
}
