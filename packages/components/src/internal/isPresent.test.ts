import type { ReactNode } from 'react';
import { isPresent } from './isPresent';

test.each([null, undefined, false, '', 0, -0] as const)(
  'treats %j as absent slot content',
  (value) => {
    expect(isPresent(value as ReactNode)).toBe(false);
  },
);

test.each(['★', 1, true, NaN] as const)('treats %p as present slot content', (value) => {
  expect(isPresent(value as ReactNode)).toBe(true);
});
