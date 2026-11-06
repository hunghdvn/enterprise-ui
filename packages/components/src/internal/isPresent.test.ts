import type { ReactNode } from 'react';
import { isPresent } from './isPresent';

test.each([null, undefined, false, true, '', 0, -0, []] as const)(
  'treats %j as absent slot content',
  (value) => {
    expect(isPresent(value as ReactNode)).toBe(false);
  },
);

test.each(['★', 1, NaN, ['a'], [0], { toString: () => 'x' }] as const)(
  'treats %p as present slot content',
  (value) => {
    expect(isPresent(value as ReactNode)).toBe(true);
  },
);
