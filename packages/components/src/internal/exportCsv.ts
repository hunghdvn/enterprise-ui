import type { Column } from '../Table/types';

/** RFC4180: quote cells containing quote/CR/LF/comma; double embedded quotes. */
function escapeCell(value: string): string {
  if (!/["\r\n,]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
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
