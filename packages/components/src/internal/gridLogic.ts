import type { Column, SortEntry } from '../Table/types';

export type FilterType = 'text' | 'select' | 'number' | 'date';

export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Filter metadata layered on Task 1's `Column` (the filter fields themselves
 * land on `Column` with the filter-row task). Every extra field is optional,
 * so plain `Column<T>[]` stays assignable to this type.
 */
export type FilterableColumn<T> = Column<T> & {
  filterable?: boolean;
  filterType?: FilterType;
  filterOptions?: FilterOption[];
};

export interface Group<T> {
  key: string;
  label: string;
  rows: T[];
}

const EMPTY_LABEL = '(Trống)';
const GROUP_SEPARATOR = ' / ';

/** NFD-strip combining marks, lowercase, then map đ → d (NFD never splits đ). */
function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd');
}

function cellString(row: object, key: string): string {
  const value = (row as unknown as Record<string, unknown>)[key];
  return value === null || value === undefined ? '' : String(value);
}

interface ActiveFilter {
  key: string;
  type: FilterType;
  value: string;
}

function matchesFilter(row: object, filter: ActiveFilter): boolean {
  const raw = cellString(row, filter.key);
  switch (filter.type) {
    case 'select':
    case 'number':
    case 'date':
      // Raw string comparison — no numeric/date parsing, so partial values
      // like '5000' or '2026-01' do not match '150000' / '2026-01-05'.
      return raw === filter.value;
    case 'text':
    default:
      return normalizeText(raw).includes(normalizeText(filter.value));
  }
}

/**
 * Keeps rows matching every active filter (AND semantics). Blank values and
 * keys without a matching column are ignored; a column without `filterType`
 * filters as text. Never mutates `rows`.
 */
export function applyColumnFilters<T extends object>(
  rows: T[],
  filters: Record<string, string>,
  columns: FilterableColumn<T>[],
): T[] {
  const active: ActiveFilter[] = [];
  for (const key of Object.keys(filters)) {
    const value = filters[key].trim();
    if (value === '') continue;
    const column = columns.find((c) => c.key === key);
    if (!column) continue;
    active.push({ key, type: column.filterType ?? 'text', value });
  }
  return rows.filter((row) => active.every((filter) => matchesFilter(row, filter)));
}

function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a < b ? -1 : 1;
  const left = String(a);
  const right = String(b);
  return left === right ? 0 : left < right ? -1 : 1;
}

function isNil(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Stable multi-key sort: `sorts` apply in order (first entry wins ties), and
 * nullish values stay last regardless of direction. Returns a new array.
 */
export function applySorts<T>(rows: T[], sorts: SortEntry[]): T[] {
  if (sorts.length === 0) return [...rows];
  const valueOf = (row: T, key: string): unknown =>
    (row as unknown as Record<string, unknown>)[key];
  return [...rows].sort((a, b) => {
    for (const { key, dir } of sorts) {
      const left = valueOf(a, key);
      const right = valueOf(b, key);
      if (isNil(left) || isNil(right)) {
        if (isNil(left) && isNil(right)) continue;
        return isNil(left) ? 1 : -1;
      }
      const cmp = compareValues(left, right);
      if (cmp !== 0) return dir === 'asc' ? cmp : -cmp;
    }
    return 0;
  });
}

/**
 * Buckets rows by up to `groupBy`'s first two keys (spec §4.8 allows two this
 * round), preserving first-appearance group order and input row order inside
 * each group. Single-key groups key/label on the raw value; composite groups
 * join with ' / '. An empty `groupBy` yields no groups.
 *
 * `rowKey` is part of the spec §5 signature for callers that pass the same key
 * function they render with; bucketing is one stable pass over `rows`, so row
 * identities are not consulted here.
 */
export function buildGroups<T extends object>(
  rows: T[],
  groupBy: string[],
  rowKey: (r: T, i: number) => string,
): Group<T>[] {
  void rowKey;

  const keys = groupBy.slice(0, 2);
  if (keys.length === 0) return [];

  const groups: Group<T>[] = [];
  const byKey = new Map<string, Group<T>>();
  for (const row of rows) {
    const parts = keys.map((key) => {
      const raw = (row as unknown as Record<string, unknown>)[key];
      return raw === null || raw === undefined ? null : String(raw);
    });
    // Structural identity, never the display label: length-prefixed framing
    // over NUL-joined parts, with a bare '-' reserved for nullish — so a
    // value containing ' / ' ('a' + 'b / c' vs 'a / b' + 'c') or a null vs ''
    // can never merge two groups. Labels stay the human join for display.
    const groupKey = parts
      .map((part) => (part === null ? '-' : `${part.length}:${part}`))
      .join('\x00');
    const label = parts.map((part) => part ?? EMPTY_LABEL).join(GROUP_SEPARATOR);
    let group = byKey.get(groupKey);
    if (!group) {
      group = { key: groupKey, label, rows: [] };
      byKey.set(groupKey, group);
      groups.push(group);
    }
    group.rows.push(row);
  }
  return groups;
}
