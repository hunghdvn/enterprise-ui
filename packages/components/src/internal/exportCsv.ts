import type { Column } from '../Table/types';

/** RFC4180: quote cells containing quote/CR/LF/comma; double embedded quotes. */
function escapeCell(value: string): string {
  // CSV formula injection first: the text marker goes on the RAW value so it
  // ends up INSIDE the RFC4180 quotes. Prefixing outside the quotes emits a
  // field that no longer starts with `"` — parsers split it and shift every
  // later column (follow-up finding 1).
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  if (!/["\r\n,]/.test(safe)) return safe;
  return `"${safe.replace(/"/g, '""')}"`;
}

/**
 * Renders rows as UTF-8 CSV: a BOM, one header line of column titles, then one
 * line per row with raw cell values (nullish → empty). Rows and columns are
 * emitted in the order given — filtering/sorting happens upstream.
 */
export function toCSV<T extends object>(rows: T[], columns: Column<T>[]): string {
  const cell = (row: T, column: Column<T>): string => {
    const value = (row as unknown as Record<string, unknown>)[column.key];
    return escapeCell(value === null || value === undefined ? '' : String(value));
  };
  const header = columns.map((column) => escapeCell(column.title)).join(',');
  const body = rows.map((row) => columns.map((column) => cell(row, column)).join(','));
  return `\uFEFF${[header, ...body].join('\n')}`;
}
