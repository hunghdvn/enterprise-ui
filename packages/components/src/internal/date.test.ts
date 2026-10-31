import {
  addDays,
  clampDay,
  daysInMonth,
  firstDayOffset,
  formatDay,
  formatMonth,
  isoKey,
  sameDay,
  startOfDay,
} from './date';

test('startOfDay clears the time without mutating the input', () => {
  const input = new Date(2026, 9, 15, 13, 45, 30, 500);
  const out = startOfDay(input);
  expect(out).not.toBe(input);
  expect(out.getHours()).toBe(0);
  expect(out.getMinutes()).toBe(0);
  expect(out.getSeconds()).toBe(0);
  expect(out.getMilliseconds()).toBe(0);
  expect(input.getHours()).toBe(13);
});

test('sameDay ignores the time of day', () => {
  expect(sameDay(new Date(2026, 9, 15, 8), new Date(2026, 9, 15, 23, 59))).toBe(true);
  expect(sameDay(new Date(2026, 9, 15), new Date(2026, 9, 16))).toBe(false);
  expect(sameDay(new Date(2026, 9, 15), new Date(2027, 9, 15))).toBe(false);
});

test('sameDay treats null and undefined as no match', () => {
  expect(sameDay(null, new Date(2026, 9, 15))).toBe(false);
  expect(sameDay(new Date(2026, 9, 15), null)).toBe(false);
  expect(sameDay(undefined, undefined)).toBe(false);
});

test('isoKey pads single-digit months and days', () => {
  expect(isoKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  expect(isoKey(new Date(2026, 11, 31))).toBe('2026-12-31');
});

test('daysInMonth handles 30/31-day months and leap years', () => {
  expect(daysInMonth(2026, 9)).toBe(31); // October
  expect(daysInMonth(2026, 3)).toBe(30); // April
  expect(daysInMonth(2026, 1)).toBe(28); // February 2026
  expect(daysInMonth(2028, 1)).toBe(29); // February 2028
  expect(daysInMonth(2026, 11)).toBe(31); // December rolls the year over
});

test('firstDayOffset is Monday-first', () => {
  // 1/10/2026 is a Thursday → three blanks before it
  expect(firstDayOffset(2026, 9)).toBe(3);
  // 1/6/2026 is a Monday → no blanks
  expect(firstDayOffset(2026, 5)).toBe(0);
  // 1/11/2026 is a Sunday → the last column
  expect(firstDayOffset(2026, 10)).toBe(6);
});

test('addDays crosses month and year boundaries without mutating the input', () => {
  const base = new Date(2026, 9, 31);
  expect(addDays(base, 1)).toEqual(new Date(2026, 10, 1));
  expect(addDays(base, -31)).toEqual(new Date(2026, 8, 30));
  expect(addDays(new Date(2026, 11, 31), 1)).toEqual(new Date(2027, 0, 1));
  expect(base).toEqual(new Date(2026, 9, 31));
});

test('clampDay caps at the length of the target month', () => {
  expect(clampDay(2026, 10, 31)).toBe(30); // 31/11 → 30
  expect(clampDay(2026, 1, 31)).toBe(28); // 31/2 → 28
  expect(clampDay(2028, 1, 31)).toBe(29); // leap year
  expect(clampDay(2026, 9, 15)).toBe(15); // already valid
});

test('formatDay renders the full Vietnamese day label', () => {
  expect(formatDay(new Date(2026, 9, 15))).toBe('15 tháng 10 năm 2026');
});

test('formatMonth renders the Vietnamese month heading', () => {
  expect(formatMonth(new Date(2026, 9, 1))).toBe('tháng 10 năm 2026');
});
