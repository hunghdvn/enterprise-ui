/**
 * Fixed-height row windowing math for the virtualized Table. Pure — the
 * caller owns the scroll state and translates rows by `offsetY`.
 */

export interface WindowRange {
  /** First row index to render (inclusive), padded by `overscan`. */
  start: number;
  /** Row index after the last one to render (exclusive), padded by `overscan`. */
  end: number;
  /** Pixel offset of `start`; translate the rendered block by this amount. */
  offsetY: number;
}

export function computeWindow(
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  total: number,
  overscan: number,
): WindowRange {
  // Degenerate inputs must not divide by zero or produce a negative window.
  const row = rowHeight <= 0 ? 1 : rowHeight;
  const count = total < 0 ? 0 : total;
  const start = Math.max(0, Math.floor(scrollTop / row) - overscan);
  const end = Math.min(count, Math.ceil((scrollTop + viewportHeight) / row) + overscan);
  return { start, end, offsetY: start * row };
}

export function contentHeight(count: number, rowHeight: number): number {
  const row = rowHeight <= 0 ? 1 : rowHeight;
  return (count < 0 ? 0 : count) * row;
}
