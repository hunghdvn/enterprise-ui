import { toCSV } from './exportCsv';
import type { Column } from '../Table/types';

interface Row {
  a?: string;
  code?: string;
  total?: number;
}

const cols: Column<Row>[] = [{ key: 'a', title: 'a' }];

test('toCSV escapes quotes commas newlines with BOM', () => {
  expect(toCSV([{ a: 'x"y,z\nviệt' }], cols)).toBe('﻿a\n"x""y,z\nviệt"');
});

test('toCSV uses column titles as the header row', () => {
  const columns: Column<Row>[] = [
    { key: 'code', title: 'Mã đơn' },
    { key: 'total', title: 'Tổng' },
  ];
  expect(toCSV([{ code: 'SO-1', total: 150000 }], columns)).toBe('﻿Mã đơn,Tổng\nSO-1,150000');
});

test('toCSV only quotes cells that need it', () => {
  expect(toCSV([{ a: 'plain' }, { a: 'a,b' }, { a: 'a\r\nb' }], cols)).toBe(
    '﻿a\nplain\n"a,b"\n"a\r\nb"',
  );
});

test('toCSV renders nullish cells as empty', () => {
  expect(toCSV([{}], cols)).toBe('﻿a\n');
});

test('toCSV with no rows returns just the header', () => {
  expect(toCSV([], cols)).toBe('﻿a');
});

test('toCSV neutralizes formula-injection prefixes', () => {
  // Cells starting with = + - @ (or tab/CR) are evaluated as formulas by
  // Excel/LibreOffice despite quoting — the text marker keeps them text, and
  // it sits INSIDE the RFC4180 quotes so the field still parses as one.
  expect(toCSV([{ a: '=HYPERLINK("x")' }], cols)).toBe('﻿a\n"\'=HYPERLINK(""x"")"');
  expect(toCSV([{ a: '=1+1' }, { a: '+1' }, { a: '-5' }, { a: '@x' }], cols)).toBe(
    "﻿a\n'=1+1\n'+1\n'-5\n'@x",
  );
  // A flagged value needing quotes stays a single quoted field.
  expect(toCSV([{ a: '-1,500' }, { a: '=SUM(A1,B1)' }], cols)).toBe(
    '﻿a\n"\'-1,500"\n"\'=SUM(A1,B1)"',
  );
  // Plain values (including interior markers) are untouched.
  expect(toCSV([{ a: 'a=b' }, { a: '5-3' }], cols)).toBe('﻿a\na=b\n5-3');
});
