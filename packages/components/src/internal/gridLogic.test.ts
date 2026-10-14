import { applyColumnFilters, applySorts, buildGroups } from './gridLogic';
import type { FilterableColumn } from './gridLogic';

interface Row {
  code: string;
  customer?: string;
  status?: string;
  total?: number;
  date?: string;
}

const rows: Row[] = [
  { code: 'SO-1', customer: 'An Phát' },
  { code: 'SO-2', customer: 'Bảo Long' },
  { code: 'SO-3', customer: 'Cường Minh' },
];

const filterCols: FilterableColumn<Row>[] = [
  { key: 'code', title: 'Mã' },
  { key: 'customer', title: 'Khách hàng', filterType: 'text' },
];

test('filter text ignores Vietnamese diacritics', () => {
  const out = applyColumnFilters(rows, { customer: 'an phat' }, filterCols);
  expect(out.map((r) => r['code'])).toEqual(['SO-1']);
});

test('filter text normalizes diacritics in the filter value too', () => {
  const out = applyColumnFilters(rows, { customer: 'Ăn PHÁT' }, filterCols);
  expect(out.map((r) => r['code'])).toEqual(['SO-1']);
});

test('filter text maps đ to d after normalization', () => {
  const danang: Row[] = [{ code: 'SO-DN', customer: 'Đà Nẵng' }];
  const out = applyColumnFilters(danang, { customer: 'da nang' }, filterCols);
  expect(out.map((r) => r['code'])).toEqual(['SO-DN']);
});

test('filter without filterType defaults to text matching', () => {
  const out = applyColumnFilters(rows, { code: 'so-1' }, filterCols);
  expect(out.map((r) => r['code'])).toEqual(['SO-1']);
});

test('select filter matches exactly, not by substring', () => {
  const statusRows: Row[] = [
    { code: 'SO-1', status: 'open' },
    { code: 'SO-2', status: 'Opened' },
    { code: 'SO-3', status: 'done' },
  ];
  const cols: FilterableColumn<Row>[] = [
    { key: 'code', title: 'Mã' },
    { key: 'status', title: 'TT', filterType: 'select' },
  ];
  const out = applyColumnFilters(statusRows, { status: 'open' }, cols);
  expect(out.map((r) => r['code'])).toEqual(['SO-1']);
});

test('number filter compares the raw string form', () => {
  const money: Row[] = [
    { code: 'SO-1', total: 150000 },
    { code: 'SO-2', total: 1500000 },
  ];
  const cols: FilterableColumn<Row>[] = [
    { key: 'code', title: 'Mã' },
    { key: 'total', title: 'Tổng', filterType: 'number' },
  ];
  expect(applyColumnFilters(money, { total: '150000' }, cols).map((r) => r['code'])).toEqual([
    'SO-1',
  ]);
  expect(applyColumnFilters(money, { total: '5000' }, cols)).toEqual([]);
});

test('date filter compares the raw string form', () => {
  const dated: Row[] = [
    { code: 'SO-1', date: '2026-01-05' },
    { code: 'SO-2', date: '2026-01-06' },
  ];
  const cols: FilterableColumn<Row>[] = [
    { key: 'code', title: 'Mã' },
    { key: 'date', title: 'Ngày', filterType: 'date' },
  ];
  const out = applyColumnFilters(dated, { date: '2026-01-05' }, cols);
  expect(out.map((r) => r['code'])).toEqual(['SO-1']);
});

test('blank and unknown filter values are ignored', () => {
  expect(applyColumnFilters(rows, { customer: '   ' }, filterCols)).toEqual(rows);
  expect(applyColumnFilters(rows, { missing: 'x' }, filterCols)).toEqual(rows);
});

test('multiple filters combine with AND', () => {
  const both: Row[] = [
    { code: 'SO-1', customer: 'An Phát', status: 'open' },
    { code: 'SO-2', customer: 'An Dương', status: 'done' },
    { code: 'SO-3', customer: 'Bảo Long', status: 'open' },
  ];
  const cols: FilterableColumn<Row>[] = [
    { key: 'code', title: 'Mã' },
    { key: 'customer', title: 'KH', filterType: 'text' },
    { key: 'status', title: 'TT', filterType: 'select' },
  ];
  const out = applyColumnFilters(both, { customer: 'an', status: 'open' }, cols);
  expect(out.map((r) => r['code'])).toEqual(['SO-1']);
});

test('applyColumnFilters does not mutate the input', () => {
  const before = [...rows];
  applyColumnFilters(rows, { customer: 'an' }, filterCols);
  expect(rows).toEqual(before);
});

const sortRows: Row[] = [
  { code: 'SO-2', total: 5 },
  { code: 'SO-1', total: 3 },
  { code: 'SO-3', total: 5 },
];

test('applySorts sorts ascending by value without mutating input', () => {
  const out = applySorts(sortRows, [{ key: 'total', dir: 'asc' }]);
  expect(out.map((r) => r['code'])).toEqual(['SO-1', 'SO-2', 'SO-3']);
  expect(sortRows.map((r) => r['code'])).toEqual(['SO-2', 'SO-1', 'SO-3']);
});

test('applySorts sorts descending, keeping ties in input order', () => {
  const out = applySorts(sortRows, [{ key: 'total', dir: 'desc' }]);
  expect(out.map((r) => r['code'])).toEqual(['SO-2', 'SO-3', 'SO-1']);
});

test('applySorts orders strings ascending by code point', () => {
  const s: Row[] = [{ code: 'B' }, { code: 'A' }, { code: 'C' }];
  expect(applySorts(s, [{ key: 'code', dir: 'asc' }]).map((r) => r['code'])).toEqual([
    'A',
    'B',
    'C',
  ]);
});

test('applySorts applies multi-column sorts by priority', () => {
  const multi: Row[] = [
    { code: 'A', status: 'open', total: 1 },
    { code: 'B', status: 'done', total: 2 },
    { code: 'C', status: 'open', total: 3 },
    { code: 'D', status: 'done', total: 4 },
  ];
  const out = applySorts(multi, [
    { key: 'status', dir: 'asc' },
    { key: 'total', dir: 'desc' },
  ]);
  expect(out.map((r) => r['code'])).toEqual(['D', 'B', 'C', 'A']);
});

test('applySorts keeps nullish values last in both directions', () => {
  const withNull: Row[] = [
    { code: 'NO-NULL' },
    { code: 'SO-2', total: 2 },
    { code: 'SO-1', total: 1 },
  ];
  expect(applySorts(withNull, [{ key: 'total', dir: 'asc' }]).map((r) => r['code'])).toEqual([
    'SO-1',
    'SO-2',
    'NO-NULL',
  ]);
  expect(applySorts(withNull, [{ key: 'total', dir: 'desc' }]).map((r) => r['code'])).toEqual([
    'SO-2',
    'SO-1',
    'NO-NULL',
  ]);
});

test('applySorts with no rules keeps input order', () => {
  const out = applySorts(sortRows, []);
  expect(out.map((r) => r['code'])).toEqual(['SO-2', 'SO-1', 'SO-3']);
  expect(out).not.toBe(sortRows);
});

test('buildGroups buckets rows by a single groupBy key', () => {
  const grouped: Row[] = [
    { code: 'SO-1', status: 'open' },
    { code: 'SO-2', status: 'done' },
    { code: 'SO-3', status: 'open' },
  ];
  const groups = buildGroups(grouped, ['status'], (r) => r.code);
  // Keys are structural (length-prefixed framing), never the display label —
  // values containing the ' / ' separator cannot merge groups.
  expect(groups.map((g) => g.key)).toEqual(['4:open', '4:done']);
  expect(groups.map((g) => g.label)).toEqual(['open', 'done']);
  expect(groups[0].rows.map((r) => r.code)).toEqual(['SO-1', 'SO-3']);
  expect(groups[1].rows.map((r) => r.code)).toEqual(['SO-2']);
});

test('buildGroups combines two groupBy keys into one composite group', () => {
  const rows2: Row[] = [
    { code: 'SO-1', status: 'open', customer: 'An' },
    { code: 'SO-2', status: 'open', customer: 'Bình' },
    { code: 'SO-3', status: 'done', customer: 'An' },
    { code: 'SO-4', status: 'open', customer: 'An' },
  ];
  const groups = buildGroups(rows2, ['status', 'customer'], (r) => r.code);
  expect(groups.map((g) => g.key)).toEqual([
    '4:open\x002:An',
    '4:open\x004:Bình',
    '4:done\x002:An',
  ]);
  expect(groups[0].rows.map((r) => r.code)).toEqual(['SO-1', 'SO-4']);
});

test('buildGroups uses only the first two groupBy keys', () => {
  const rows2: Row[] = [
    { code: 'SO-1', status: 'open', customer: 'An' },
    { code: 'SO-2', status: 'done', customer: 'Bình' },
  ];
  const groups = buildGroups(rows2, ['status', 'customer', 'code'], (r) => r.code);
  expect(groups.map((g) => g.key)).toEqual(['4:open\x002:An', '4:done\x004:Bình']);
});

test('buildGroups returns no groups without groupBy', () => {
  expect(buildGroups(rows, [], (r) => r.code)).toEqual([]);
});

test('buildGroups keys are structural: separators and nullish values cannot collide', () => {
  const tricky: Row[] = [
    { code: 'SO-1', status: 'a', customer: 'b / c' },
    { code: 'SO-2', status: 'a / b', customer: 'c' },
    { code: 'SO-3', customer: 'An' },
    { code: 'SO-4', status: '', customer: 'An' },
  ];
  const groups = buildGroups(tricky, ['status', 'customer'], (r) => r.code);
  // Four distinct groups even though the display labels of the first two
  // coincide and the last two share one label.
  expect(groups).toHaveLength(4);
  expect(groups.map((g) => g.label)).toEqual(['a / b / c', 'a / b / c', '(Trống) / An', ' / An']);
  expect(new Set(groups.map((g) => g.key)).size).toBe(4);
  expect(groups[0].rows.map((r) => r.code)).toEqual(['SO-1']);
  expect(groups[1].rows.map((r) => r.code)).toEqual(['SO-2']);
});

test('buildGroups labels nullish group values', () => {
  const rows2: Row[] = [{ code: 'SO-1' }, { code: 'SO-2', status: 'open' }];
  const groups = buildGroups(rows2, ['status'], (r) => r.code);
  expect(groups.map((g) => g.label)).toEqual(['(Trống)', 'open']);
  // Missing vs '' are distinct structural keys (null sentinel vs 0-length).
  expect(groups[0].key).toBe('-');
  expect(groups[0].rows.map((r) => r.code)).toEqual(['SO-1']);
});
