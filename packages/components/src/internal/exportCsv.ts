import type { Column } from '../Table/types';

/** RFC4180: quote cells containing quote/CR/LF/comma; double embedded quotes. */
function escapeCell(value: string): string {
  const quoted = /["\r\n,]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  // CSV formula injection: a leading = + - @ (or tab/CR) is evaluated as a
  // formula by Excel/LibreOffice despite quoting — this download is
  // Excel-targeted (UTF-8 BOM), so prefix Excel's text marker to keep it text.
  return /^[=+\-@\t\r]/.test(value) ? `'${quoted}` : quoted;
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
