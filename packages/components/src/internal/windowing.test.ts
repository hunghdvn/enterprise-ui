import { computeWindow, contentHeight } from './windowing';

test('computeWindow pads both sides with overscan', () => {
  expect(computeWindow(64, 320, 32, 1000, 8)).toEqual({ start: 0, end: 20, offsetY: 0 });
});

test('computeWindow starts at the first row without overscan', () => {
  expect(computeWindow(0, 320, 32, 1000, 0)).toEqual({ start: 0, end: 10, offsetY: 0 });
});

test('computeWindow moves the window as the viewport scrolls', () => {
  // 1000/32 = 31.25 → floor 31; (1000+320)/32 = 41.25 → ceil 42
  expect(computeWindow(1000, 320, 32, 1000, 0)).toEqual({ start: 31, end: 42, offsetY: 992 });
  expect(computeWindow(1000, 320, 32, 1000, 8)).toEqual({ start: 23, end: 50, offsetY: 736 });
});

test('computeWindow clamps end to the row total', () => {
  expect(computeWindow(0, 320, 32, 5, 8)).toEqual({ start: 0, end: 5, offsetY: 0 });
});

test('computeWindow clamps non-positive rowHeight to 1', () => {
  const expected = { start: 5, end: 15, offsetY: 5 };
  expect(computeWindow(5, 10, 0, 100, 0)).toEqual(expected);
  expect(computeWindow(5, 10, -4, 100, 0)).toEqual(expected);
});

test('computeWindow clamps negative total to 0 rows', () => {
  expect(computeWindow(0, 320, 32, -5, 8)).toEqual({ start: 0, end: 0, offsetY: 0 });
});

test('contentHeight multiplies count by rowHeight with the same clamps', () => {
  expect(contentHeight(1000, 32)).toBe(32000);
  expect(contentHeight(-5, 32)).toBe(0);
  expect(contentHeight(10, 0)).toBe(10);
  expect(contentHeight(10, -2)).toBe(10);
});
