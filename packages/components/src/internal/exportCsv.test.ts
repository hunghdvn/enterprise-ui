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
