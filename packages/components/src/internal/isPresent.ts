import type { ReactNode } from 'react';

/**
 * Whether a ReactNode value should be treated as present slot content.
 * React renders 0 and empty strings differently from nullish/boolean values,
 * so those values must be handled explicitly. `true` and an empty array render
 * nothing at all, so a wrapper around them would be a stray box (an empty
 * 52px icon circle, an action row with only its margin).
 */
export function isPresent(value: ReactNode): boolean {
  if (value == null || typeof value === 'boolean') return false;
  if (value === '' || value === 0) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}
