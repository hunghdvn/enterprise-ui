import type { ReactNode } from 'react';

/**
 * Whether a ReactNode value should be treated as present slot content.
 * React renders 0 and empty strings differently from nullish/boolean values,
 * so those values must be handled explicitly.
 */
export function isPresent(value: ReactNode): boolean {
  return value != null && value !== false && value !== '' && value !== 0;
}
