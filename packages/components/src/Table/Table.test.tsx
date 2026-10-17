import { useState } from 'react';
import { flushSync } from 'react-dom';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { toCSV } from '../internal/exportCsv';
import { Table } from './Table';

const cols = [
  { key: 'code', title: 'Mã đơn', sortable: true },
  { key: 'total', title: 'Giá trị', align: 'right' as const, sortable: true },
];

const rows = [{ code: 'SO-1', total: '₫ 10M' }];

test('sorts, selects, shows empty and error', () => {
  const onSort = vi.fn();
  const { rerender } = render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
      sorts={[{ key: 'code', dir: 'asc' }]}
      onSort={onSort}
    />,
  );
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenCalledWith([{ key: 'code', dir: 'desc' }]);
  rerender(<Table columns={cols} data={[]} status="empty" />);
  expect(screen.getByText(/Không có dữ liệu/i)).toBeInTheDocument();
  rerender(<Table columns={cols} data={[]} status="error" onRetry={() => {}} />);
  expect(screen.getByRole('button', { name: /Thử lại/i })).toBeInTheDocument();
});

test('exposes grid role with aria-sort on the columnheader', () => {
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
      sorts={[{ key: 'code', dir: 'asc' }]}
      onSort={() => {}}
    />,
  );
  expect(screen.getByRole('grid')).toBeInTheDocument();
  const cell = screen.getByText('Mã đơn').closest('[role="columnheader"]');
  expect(cell).toHaveAttribute('aria-sort', 'ascending');
  expect(cell?.querySelector('button')).not.toBeNull();
});

test('sort cycles none-asc-desc-none on plain click', () => {
  const onSort = vi.fn();
  render(<Table columns={cols} data={rows} sorts={[]} onSort={onSort} />);
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenCalledWith([{ key: 'code', dir: 'asc' }]);
});

test('shift-click keeps the previous column rule', () => {
  const onSort = vi.fn();
  render(
    <Table columns={cols} data={rows} sorts={[{ key: 'code', dir: 'asc' }]} onSort={onSort} />,
  );
  fireEvent.click(screen.getByText('Giá trị'), { shiftKey: true });
  expect(onSort).toHaveBeenCalledWith([
    { key: 'code', dir: 'asc' },
    { key: 'total', dir: 'asc' },
  ]);
});

test('aria-sort follows the entry through the full cycle', () => {
  const onSort = vi.fn();
  const { rerender } = render(<Table columns={cols} data={rows} sorts={[]} onSort={onSort} />);
  const header = () => screen.getByText('Mã đơn').closest('[role="columnheader"]');
  expect(header()).toHaveAttribute('aria-sort', 'none');
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenLastCalledWith([{ key: 'code', dir: 'asc' }]);
  rerender(
    <Table columns={cols} data={rows} sorts={[{ key: 'code', dir: 'asc' }]} onSort={onSort} />,
  );
  expect(header()).toHaveAttribute('aria-sort', 'ascending');
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenLastCalledWith([{ key: 'code', dir: 'desc' }]);
  rerender(
    <Table columns={cols} data={rows} sorts={[{ key: 'code', dir: 'desc' }]} onSort={onSort} />,
  );
  expect(header()).toHaveAttribute('aria-sort', 'descending');
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenLastCalledWith([]);
  rerender(<Table columns={cols} data={rows} sorts={[]} onSort={onSort} />);
  expect(header()).toHaveAttribute('aria-sort', 'none');
});

test('plain click resets a multi-column sort to the clicked column', () => {
  const onSort = vi.fn();
  render(
    <Table
      columns={cols}
      data={rows}
      sorts={[
        { key: 'code', dir: 'asc' },
        { key: 'total', dir: 'asc' },
      ]}
      onSort={onSort}
    />,
  );
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenCalledWith([{ key: 'code', dir: 'desc' }]);
});

test('modifier click edits only the clicked entry, keeping order', () => {
  const onSort = vi.fn();
  const { rerender } = render(
    <Table
      columns={cols}
      data={rows}
      sorts={[
        { key: 'code', dir: 'desc' },
        { key: 'total', dir: 'asc' },
      ]}
      onSort={onSort}
    />,
  );
  // desc → none: only that entry disappears, the rest keeps its order.
  fireEvent.click(screen.getByText('Mã đơn'), { ctrlKey: true });
  expect(onSort).toHaveBeenLastCalledWith([{ key: 'total', dir: 'asc' }]);
  rerender(
    <Table
      columns={cols}
      data={rows}
      sorts={[
        { key: 'code', dir: 'asc' },
        { key: 'total', dir: 'asc' },
      ]}
      onSort={onSort}
    />,
  );
  // asc → desc: the entry flips in place, position unchanged.
  fireEvent.click(screen.getByText('Giá trị'), { metaKey: true });
  expect(onSort).toHaveBeenLastCalledWith([
    { key: 'code', dir: 'asc' },
    { key: 'total', dir: 'desc' },
  ]);
});

test('selects rows via checkboxes', () => {
  const onSelect = vi.fn();
  const data = [
    { code: 'SO-1', total: '₫ 10M' },
    { code: 'SO-2', total: '₫ 20M' },
  ];
  const { rerender } = render(
    <Table
      columns={cols}
      data={data}
      selectedKeys={['SO-1']}
      onSelect={onSelect}
      rowKey={(r) => String(r['code'])}
    />,
  );
  expect(screen.getByRole('checkbox', { name: /SO-1/i })).toBeChecked();
  fireEvent.click(screen.getByRole('checkbox', { name: /SO-2/i }));
  expect(onSelect).toHaveBeenCalledWith(['SO-1', 'SO-2']);
  fireEvent.click(screen.getByRole('checkbox', { name: /chọn tất cả/i }));
  expect(onSelect).toHaveBeenCalledWith(['SO-1', 'SO-2']);
  rerender(
    <Table
      columns={cols}
      data={data}
      selectedKeys={['SO-1', 'SO-2']}
      onSelect={onSelect}
      rowKey={(r) => String(r['code'])}
    />,
  );
  fireEvent.click(screen.getByRole('checkbox', { name: /chọn tất cả/i }));
  expect(onSelect).toHaveBeenCalledWith([]);
});

test('select-all merges the current page into the selection', () => {
  const onSelect = vi.fn();
  const data = [
    { code: 'SO-1', total: '₫ 10M' },
    { code: 'SO-2', total: '₫ 20M' },
  ];
  const { rerender } = render(
    <Table columns={cols} data={data} selectedKeys={['SO-9']} onSelect={onSelect} />,
  );
  // 'SO-9' belongs to another page and is not on this one — it must survive.
  fireEvent.click(screen.getByRole('checkbox', { name: /chọn tất cả/i }));
  expect(onSelect).toHaveBeenLastCalledWith(['SO-9', 'SO-1', 'SO-2']);
  rerender(
    <Table
      columns={cols}
      data={data}
      selectedKeys={['SO-9', 'SO-1', 'SO-2']}
      onSelect={onSelect}
    />,
  );
  fireEvent.click(screen.getByRole('checkbox', { name: /chọn tất cả/i }));
  // Unchecking removes this page's keys only, not the other page's.
  expect(onSelect).toHaveBeenLastCalledWith(['SO-9']);
});

// `T extends object`: consumers hand us interface row types, not index
// signatures — the constraint must not reject them and key extraction must
// still work through the `key`/`code`/`id` fallback.
interface Order {
  code: string;
  customer: string;
}

test('accepts an interface row type', () => {
  const orders: Order[] = [
    { code: 'SO-1', customer: 'Acme' },
    { code: 'SO-2', customer: 'Globex' },
  ];
  render(
    <Table<Order> columns={[...cols, { key: 'customer', title: 'Khách hàng' }]} data={orders} />,
  );
  expect(screen.getByText('SO-1')).toBeInTheDocument();
  expect(screen.getByText('Globex')).toBeInTheDocument();
});

test('falls back to a rowKey interface field for keys', () => {
  const onSelect = vi.fn();
  render(
    <Table<Order>
      columns={cols}
      data={[{ code: 'SO-1', customer: 'Acme' }]}
      selectedKeys={[]}
      onSelect={onSelect}
    />,
  );
  fireEvent.click(screen.getByRole('checkbox', { name: /SO-1/i }));
  expect(onSelect).toHaveBeenCalledWith(['SO-1']);
});

test('shows loading state and summary footer', () => {
  const { rerender } = render(<Table columns={cols} data={[]} status="loading" />);
  expect(screen.getByText(/Đang tải/i)).toBeInTheDocument();
  rerender(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
      summary={<span>Tổng: 1 đơn</span>}
    />,
  );
  expect(screen.getByText('Tổng: 1 đơn')).toBeInTheDocument();
});

test('summary footer is a grid row with a grid cell', () => {
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
      summary={<span>Tổng: 1 đơn</span>}
    />,
  );
  const grid = screen.getByRole('grid');
  const rows = within(grid).getAllByRole('row');
  const footer = rows[rows.length - 1];
  expect(footer).toHaveTextContent('Tổng: 1 đơn');
  expect(within(footer).getByRole('gridcell')).toBeInTheDocument();
});

test('aria-rowcount includes the summary row, which spans every column', () => {
  const threeCols = [
    { key: 'code', title: 'Mã đơn' },
    { key: 'customer', title: 'Khách hàng' },
    { key: 'total', title: 'Giá trị', align: 'right' as const },
  ];
  const threeRows = [
    { code: 'SO-1', customer: 'Acme', total: '₫ 300M' },
    { code: 'SO-2', customer: 'Globex', total: '₫ 300M' },
    { code: 'SO-3', customer: 'Initech', total: '₫ 246M' },
  ];
  const { rerender } = render(
    <Table columns={threeCols} data={threeRows} summary={<span>Tổng 846M</span>} />,
  );
  const grid = screen.getByRole('grid');
  expect(grid).toHaveAttribute('aria-rowcount', '5');
  expect(grid).toHaveAttribute('aria-colcount', '3');

  const rows = within(grid).getAllByRole('row');
  expect(rows).toHaveLength(5);
  const footer = rows[rows.length - 1];
  expect(footer).toHaveTextContent('Tổng 846M');
  expect(within(footer).getByRole('gridcell')).toHaveAttribute('aria-colspan', '3');

  rerender(<Table columns={threeCols} data={threeRows} />);
  expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '4');
});

test('summary colspan includes the checkbox column when selectable', () => {
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
      selectedKeys={[]}
      onSelect={() => {}}
      summary={<span>Tổng: 1 đơn</span>}
    />,
  );
  const grid = screen.getByRole('grid');
  expect(grid).toHaveAttribute('aria-colcount', '3');
  expect(grid).toHaveAttribute('aria-rowcount', '3');
  const rows = within(grid).getAllByRole('row');
  const footer = rows[rows.length - 1];
  expect(within(footer).getByRole('gridcell')).toHaveAttribute('aria-colspan', '3');
});

test('supports custom render and right alignment', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        {
          key: 'total',
          title: 'Giá trị',
          align: 'right',
          render: (r) => <strong>{String(r['total'])}</strong>,
        },
      ]}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
    />,
  );
  expect(screen.getByText('₫ 10M').closest('[data-align="right"]')).not.toBeNull();
});

test('pinned columns stick with inline offsets and px widths', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', pinned: 'left', width: 120 },
        { key: 'customer', title: 'KH' },
        { key: 'total', title: 'Tổng', pinned: 'right', width: 100 },
      ]}
      data={[{ code: 'SO-1', customer: 'A', total: '1' }]}
    />,
  );
  const head = screen.getByText('Mã').closest('[role="columnheader"]')!;
  expect(head.className).toMatch(/pinL/);
  expect(head).toHaveStyle({ left: '0px' });
  const tail = screen.getByText('Tổng').closest('[role="columnheader"]')!;
  expect(tail.className).toMatch(/pinR/);
  expect(tail).toHaveStyle({ right: '0px' });
});

test('pinned offsets accumulate and reach body cells in plain and virtual rows', () => {
  const pinCols = [
    { key: 'code', title: 'Mã', pinned: 'left' as const, width: 120 },
    { key: 'customer', title: 'KH', pinned: 'left' as const, width: 80 },
    { key: 'status', title: 'TT' },
    { key: 'total', title: 'Tổng', pinned: 'right' as const, width: 100 },
    { key: 'note', title: 'GC', pinned: 'right' as const, width: 60 },
  ];
  const data = [{ code: 'SO-1', customer: 'A', status: 'open', total: '9', note: 'x' }];
  const check = () => {
    const headL = screen.getByText('KH').closest('[role="columnheader"]')!;
    expect(headL.className).toMatch(/pinL/);
    // 120px = the width of "Mã", the pinned column before it.
    expect(headL).toHaveStyle({ left: '120px' });
    const headR = screen.getByText('Tổng').closest('[role="columnheader"]')!;
    expect(headR.className).toMatch(/pinR/);
    // 60px = the width of "GC", the pinned column after it.
    expect(headR).toHaveStyle({ right: '60px' });
    const bodyL = screen.getByText('SO-1').closest('[role="gridcell"]')!;
    expect(bodyL.className).toMatch(/pinL/);
    expect(bodyL).toHaveStyle({ left: '0px' });
    const bodyR = screen.getByText('x').closest('[role="gridcell"]')!;
    expect(bodyR.className).toMatch(/pinR/);
    expect(bodyR).toHaveStyle({ right: '0px' });
    // One shared template: pinned tracks in px, regular columns minmax(min, 1fr).
    const row = screen.getByText('SO-1').parentElement as HTMLElement;
    expect(row.style.gridTemplateColumns).toContain('120px');
    expect(row.style.gridTemplateColumns).toContain('minmax(');
  };
  const { rerender } = render(<Table columns={pinCols} data={data} />);
  check();
  rerender(<Table columns={pinCols} data={data} virtual />);
  check();
});

test('filter row commits per-column values', () => {
  const onColumnFilter = vi.fn();
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', filterable: true },
        {
          key: 'status',
          title: 'TT',
          filterable: true,
          filterType: 'select',
          filterOptions: [{ value: 'open', label: 'Mở' }],
        },
      ]}
      data={[{ code: 'SO-1', status: 'open' }]}
      showFilterRow
      columnFilters={{ code: '' }}
      onColumnFilter={onColumnFilter}
    />,
  );
  fireEvent.change(screen.getByLabelText('Lọc Mã'), { target: { value: 'SO-1' } });
  expect(onColumnFilter).toHaveBeenCalledWith('code', 'SO-1');
});

test('filter row renders every select option and commits their value', () => {
  const onColumnFilter = vi.fn();
  render(
    <Table
      columns={[
        {
          key: 'status',
          title: 'TT',
          filterable: true,
          filterType: 'select',
          filterOptions: [
            { value: 'open', label: 'Mở' },
            { value: 'done', label: 'Xong' },
          ],
        },
      ]}
      data={[{ status: 'open' }]}
      showFilterRow
      columnFilters={{ status: '' }}
      onColumnFilter={onColumnFilter}
    />,
  );
  const select = screen.getByLabelText('Lọc TT');
  expect(
    within(select)
      .getAllByRole('option')
      .map((o) => o.textContent),
  ).toEqual(['Tất cả', 'Mở', 'Xong']);
  fireEvent.change(select, { target: { value: 'done' } });
  expect(onColumnFilter).toHaveBeenCalledWith('status', 'done');
});

test('filter row sits under the header with a cell per column in virtual mode', () => {
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}`, total: String(i) }));
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', filterable: true },
        { key: 'total', title: 'Tổng' },
      ]}
      data={data}
      showFilterRow
      columnFilters={{}}
      onColumnFilter={() => {}}
      virtual
      rowHeight={32}
      overscan={8}
    />,
  );
  const grid = screen.getByRole('grid');
  const rows = within(grid).getAllByRole('row');
  const filterRow = screen.getByLabelText('Lọc Mã').closest<HTMLElement>('[role="row"]')!;
  // Directly under the header row, outside the windowed body.
  expect(rows[1]).toBe(filterRow);
  // Every column keeps a cell — the filterable input plus a placeholder for
  // the column without a filter — so the shared template never drifts.
  expect(within(filterRow).getAllByRole('gridcell')).toHaveLength(2);
  // Header + filter row + window: still far under the 60-row budget.
  expect(rows.length).toBeLessThan(60);
  expect(grid).toHaveAttribute('aria-rowcount', '10002');
});

test('groups collapse and show group summary', () => {
  const onToggleGroup = vi.fn();
  render(
    <Table
      columns={cols}
      data={[
        { code: 'SO-1', status: 'open' },
        { code: 'SO-2', status: 'open' },
        { code: 'SO-3', status: 'done' },
      ]}
      groupBy={['status']}
      collapsedGroups={[]}
      onToggleGroup={onToggleGroup}
      renderGroupSummary={(_, rows) => <span>{rows.length} đơn</span>}
    />,
  );
  expect(screen.getByText(/open/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Thu gọn open/ }));
  // Group keys are structural (opaque to callers) — the label stays human.
  expect(onToggleGroup).toHaveBeenCalledWith('4:open');
  expect(screen.getAllByText(/2 đơn/).length).toBeGreaterThan(0);
});

test('collapsed group hides its rows but keeps the header and summary', () => {
  const groupRows = [
    { code: 'SO-1', status: 'open' },
    { code: 'SO-2', status: 'open' },
    { code: 'SO-3', status: 'done' },
  ];
  const summaryOf = (_key: string, rows: typeof groupRows) => <span>{rows.length} đơn</span>;
  const { rerender } = render(
    <Table
      columns={cols}
      data={groupRows}
      groupBy={['status']}
      collapsedGroups={['4:open']}
      onToggleGroup={() => {}}
      renderGroupSummary={summaryOf}
    />,
  );
  // Header + summary stay, the collapsed group's rows are hidden.
  expect(screen.getByText('open')).toBeInTheDocument();
  expect(screen.getByText('2 đơn')).toBeInTheDocument();
  expect(screen.queryByText('SO-1')).toBeNull();
  expect(screen.queryByText('SO-2')).toBeNull();
  // The other group is untouched.
  expect(screen.getByText('SO-3')).toBeInTheDocument();
  rerender(
    <Table
      columns={cols}
      data={groupRows}
      groupBy={['status']}
      collapsedGroups={[]}
      onToggleGroup={() => {}}
      renderGroupSummary={summaryOf}
    />,
  );
  expect(screen.getByText('SO-1')).toBeInTheDocument();
  expect(screen.getByText('SO-2')).toBeInTheDocument();
});

test('virtual groups count each header as one windowed row', () => {
  const data = Array.from({ length: 100 }, (_, i) => ({
    code: `SO-${i}`,
    status: i % 2 === 0 ? 'done' : 'open',
  }));
  render(
    <Table
      columns={cols}
      data={data}
      groupBy={['status']}
      collapsedGroups={[]}
      onToggleGroup={() => {}}
      virtual
      rowHeight={32}
      overscan={8}
    />,
  );
  const grid = screen.getByRole('grid');
  // 1 header row + 100 data rows + 2 group headers = 103.
  expect(grid).toHaveAttribute('aria-rowcount', '103');
  const rows = within(grid).getAllByRole('row');
  // Header + windowed items (the group header included) stay under 60.
  expect(rows.length).toBeLessThan(60);
  expect(screen.getByRole('button', { name: /Thu gọn done/ })).toBeInTheDocument();
});

test('grouped rows keep distinct keys when the same object appears twice', () => {
  // The same instance at two positions, without key/code/id fields: plain
  // mode derives keys by index and stays distinct — grouped rendering must
  // reproduce that invariant instead of collapsing both rows to one key.
  const shared = { status: 'open', note: 'ghi chú' };
  const data = [shared, shared];
  const columns = [{ key: 'note', title: 'Ghi chú' }];
  const keysInGrid = (): (string | null)[] =>
    within(screen.getByRole('grid'))
      .getAllByRole('checkbox', { name: /^Chọn dòng/ })
      .map((box) => box.getAttribute('aria-label'));
  const { rerender } = render(
    <Table
      columns={columns}
      data={data}
      groupBy={['status']}
      collapsedGroups={[]}
      onToggleGroup={() => {}}
      selectedKeys={[]}
      onSelect={() => {}}
    />,
  );
  expect(keysInGrid()).toEqual(['Chọn dòng 0', 'Chọn dòng 1']);
  // Plain (ungrouped) mode keeps the same distinct keys for the same data.
  rerender(<Table columns={columns} data={data} selectedKeys={[]} onSelect={() => {}} />);
  expect(keysInGrid()).toEqual(['Chọn dòng 0', 'Chọn dòng 1']);
});

test('virtual 10k renders a window under 60 rows and moves on scroll', () => {
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
  render(<Table columns={cols} data={data} virtual rowHeight={32} overscan={8} />);
  const grid = screen.getByRole('grid');
  const scroller = grid.parentElement!;
  Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
  const first = within(grid).getAllByRole('row').length;
  expect(first).toBeLessThan(60);
  fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
  expect(within(grid).getAllByRole('row').length).toBeLessThan(60);
  expect(screen.queryByText('SO-0')).toBeNull();
  expect(screen.getByText('SO-156')).toBeInTheDocument();
});

test('virtual scrollport maxHeight defaults to 70vh and takes a caller override', () => {
  const data = [{ code: 'SO-1' }, { code: 'SO-2' }];
  const { rerender } = render(<Table columns={cols} data={data} virtual />);
  const scroller = screen.getByRole('grid').parentElement as HTMLDivElement;
  // Default preserved: the table bounds its own scrollport at 70vh.
  expect(scroller.style.maxHeight).toBe('70vh');
  // Any CSS height wins — e.g. embedding in a fixed-height card or modal.
  rerender(<Table columns={cols} data={data} virtual maxHeight="480px" />);
  expect(scroller.style.maxHeight).toBe('480px');
  // Explicit undefined: no table-imposed cap — the layout sizes the
  // scrollport itself.
  rerender(<Table columns={cols} data={data} virtual maxHeight={undefined} />);
  expect(scroller.style.maxHeight).toBe('');
  // Not virtual → no scrollport cap; .wrap keeps owning overflow as before.
  rerender(<Table columns={cols} data={data} />);
  expect(scroller.style.maxHeight).toBe('');
});

test('virtual window re-measures the viewport on resize without a scroll event', () => {
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
  render(<Table columns={cols} data={data} virtual rowHeight={32} overscan={8} />);
  const grid = screen.getByRole('grid');
  const scroller = grid.parentElement as HTMLDivElement;
  Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
  fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
  // Window [148, 175): SO-200 is outside it.
  expect(screen.queryByText('SO-200')).toBeNull();
  const before = within(grid).getAllByRole('row').length;
  // The scrollport grows; a window resize must re-read clientHeight and widen
  // the window — no scroll event involved.
  Object.defineProperty(scroller, 'clientHeight', { value: 3200, configurable: true });
  fireEvent(window, new Event('resize'));
  expect(within(grid).getAllByRole('row').length).toBeGreaterThan(before);
  expect(screen.getByText('SO-200')).toBeInTheDocument();
  expect(screen.queryByText('SO-0')).toBeNull();
});

// --- Task 7: master-detail expand + mobile cards ----------------------------

/**
 * Stubs `window.matchMedia` for `useIsMobile`, returning the restore function
 * (same shape as `internal/useIsMobile.test.ts`). Card tests must stub it —
 * jsdom's own matchMedia decides desktop for every table that does not.
 */
function stubMatchMedia(matches: boolean): () => void {
  const original = window.matchMedia;
  const mql = (query: string): MediaQueryList =>
    ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
  Object.defineProperty(window, 'matchMedia', {
    value: mql,
    configurable: true,
    writable: true,
  });
  return () =>
    Object.defineProperty(window, 'matchMedia', {
      value: original,
      configurable: true,
      writable: true,
    });
}

test('expand toggles detail with full colspan', () => {
  const onToggleExpand = vi.fn();
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '1' }]}
      renderExpanded={(r) => <div>Chi tiết {String(r['code'])}</div>}
      expandedKeys={[]}
      onToggleExpand={onToggleExpand}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: /Mở rộng SO-1/ }));
  expect(onToggleExpand).toHaveBeenCalledWith('SO-1');
});

test('expanded row renders one detail row spanning every column', () => {
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '1' }]}
      renderExpanded={(r) => <div>Chi tiết {String(r['code'])}</div>}
      expandedKeys={['SO-1']}
      onToggleExpand={() => {}}
      expandedHeight={96}
    />,
  );
  const detailRow = screen.getByText('Chi tiết SO-1').closest<HTMLElement>('[role="row"]')!;
  // One role=row holding exactly one gridcell spanning all tracks: 2 columns
  // plus the toggle column.
  expect(within(detailRow).getAllByRole('gridcell')).toHaveLength(1);
  expect(within(detailRow).getByRole('gridcell')).toHaveAttribute('aria-colspan', '3');
  expect(detailRow).toHaveStyle({ height: '96px' });
  expect(screen.getByRole('button', { name: /Thu gọn SO-1/ })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('virtual offsets stay correct with expand and group combined', () => {
  const data = [
    { code: 'SO-1', total: '1', status: 'open' },
    { code: 'SO-2', total: '2', status: 'open' },
    { code: 'SO-3', total: '3', status: 'done' },
    { code: 'SO-4', total: '4', status: 'done' },
  ];
  render(
    <Table
      columns={cols}
      data={data}
      groupBy={['status']}
      collapsedGroups={[]}
      onToggleGroup={() => {}}
      renderExpanded={(r) => <div>Chi tiết {String(r['code'])}</div>}
      expandedKeys={['SO-1']}
      onToggleExpand={() => {}}
      virtual
      rowHeight={32}
      overscan={8}
    />,
  );
  const grid = screen.getByRole('grid');
  // Items: open header, SO-1, detail, SO-2, done header, SO-3, SO-4 = 7 rows
  // plus the column header row. The detail counts as one row, not 2.5.
  expect(grid).toHaveAttribute('aria-rowcount', '8');
  const spacer = grid.querySelector('[role="presentation"]')!;
  expect(spacer).toHaveStyle({ height: '272px' }); // 6 × 32 + the 80px detail
  const detailRow = screen.getByText('Chi tiết SO-1').closest<HTMLElement>('[role="row"]')!;
  expect(detailRow).toHaveStyle({ top: '64px' }); // group header (32) + SO-1 (32)
  const so2Row = screen.getByText('SO-2').closest<HTMLElement>('[role="row"]')!;
  expect(so2Row).toHaveStyle({ top: '144px' }); // 64 + the detail's 80px slot
});

test('virtual window spends expandedHeight slots on an expanded detail', () => {
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}`, total: String(i) }));
  render(
    <Table
      columns={cols}
      data={data}
      renderExpanded={(r) => <div>Chi tiết {String(r['code'])}</div>}
      expandedKeys={['SO-0']}
      onToggleExpand={() => {}}
      virtual
      rowHeight={32}
      overscan={8}
    />,
  );
  const grid = screen.getByRole('grid');
  // Rowcount counts rows (10000 + 1 detail), not pixel slots.
  expect(grid).toHaveAttribute('aria-rowcount', '10002');
  const spacer = grid.querySelector('[role="presentation"]')!;
  // 10000 × 32 + 80 (the default round(32 × 2.5)) — the detail's exact budget.
  expect(spacer).toHaveStyle({ height: `${10000 * 32 + 80}px` });
  const detailRow = screen.getByText('Chi tiết SO-0').closest<HTMLElement>('[role="row"]')!;
  expect(detailRow).toHaveStyle({ top: '32px' }); // right under SO-0
  const scroller = grid.parentElement as HTMLElement;
  Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
  fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
  expect(within(grid).getAllByRole('row').length).toBeLessThan(60);
  expect(screen.queryByText('SO-0')).toBeNull();
  // 80 + 32k ≤ 5000 → SO-153 (offset 4976) is the last row at/before the top,
  // so it sits inside the window — offsets shifted by the detail, not by 0.
  expect(screen.getByText('SO-153')).toBeInTheDocument();
});

test('mobile renders card articles instead of the grid', () => {
  const restore = stubMatchMedia(true);
  try {
    render(
      <Table
        columns={cols}
        data={rows}
        renderCard={(r) => <span>Card {String(r['code'])}</span>}
      />,
    );
    expect(screen.queryByRole('grid')).toBeNull();
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(1);
    expect(cards[0]).toHaveTextContent('Card SO-1');
  } finally {
    restore();
  }
});

test('desktop keeps the grid when renderCard is provided', () => {
  const restore = stubMatchMedia(false);
  try {
    render(<Table columns={cols} data={rows} renderCard={() => <span>Card</span>} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.queryByRole('article')).toBeNull();
  } finally {
    restore();
  }
});

test('card fallback shows a title, label/value pairs and a Chi tiết button', () => {
  const onToggleExpand = vi.fn();
  const restore = stubMatchMedia(true);
  try {
    render(
      <Table
        columns={cols}
        data={[{ code: 'SO-1', total: '₫ 10M' }]}
        renderExpanded={(r) => <div>Chi tiết {String(r['code'])}</div>}
        expandedKeys={[]}
        onToggleExpand={onToggleExpand}
      />,
    );
    expect(screen.queryByRole('grid')).toBeNull();
    const card = screen.getByRole('article');
    // First column is the title — it does not repeat as a label/value pair.
    expect(card).toHaveTextContent('SO-1');
    expect(card).not.toHaveTextContent('Mã đơn');
    // Remaining columns render as label: value (label = column title).
    expect(card).toHaveTextContent('Giá trị');
    expect(card).toHaveTextContent('₫ 10M');
    fireEvent.click(within(card).getByRole('button', { name: /Chi tiết/ }));
    expect(onToggleExpand).toHaveBeenCalledWith('SO-1');
  } finally {
    restore();
  }
});

test('non-virtual cards use min-height so content grows, virtual cards keep the fixed slot', () => {
  const restore = stubMatchMedia(true);
  try {
    const data = [
      { code: 'SO-1', total: '₫ 10M' },
      { code: 'SO-2', total: '₫ 20M' },
    ];
    const { rerender } = render(<Table columns={cols} data={data} cardHeight={80} />);
    const card = screen.getAllByRole('article')[0];
    // Non-virtual: `cardHeight` is a floor, never a fixed box — long content
    // grows the card instead of scrolling inside a cramped 80px slot.
    expect(card.style.minHeight).toBe('80px');
    expect(card.style.height).toBe('');
    // Virtual: each 80px slot holds the card plus its 8px gap, so the height
    // is exact and consecutive tops stay 80px apart.
    rerender(<Table columns={cols} data={data} cardHeight={80} virtual />);
    const vcards = screen.getAllByRole('article');
    expect(vcards.map((c) => c.style.height)).toEqual(['72px', '72px']);
    expect(vcards.map((c) => c.style.top)).toEqual(['0px', '80px']);
    expect(vcards[0].style.minHeight).toBe('');
  } finally {
    restore();
  }
});

test('mobile cards render the summary below the list without a footer bar', () => {
  const restore = stubMatchMedia(true);
  try {
    render(<Table columns={cols} data={rows} summary={<span>Tổng: 1 đơn</span>} />);
    // No pagination/exportable means no footer bar — the summary must still
    // reach mobile users instead of vanishing with the grid footer.
    expect(screen.getByText('Tổng: 1 đơn')).toBeInTheDocument();
  } finally {
    restore();
  }
});

test('virtual cards window with cardHeight', () => {
  const restore = stubMatchMedia(true);
  try {
    const data = Array.from({ length: 100 }, (_, i) => ({ code: `SO-${i}`, total: String(i) }));
    render(
      <Table
        columns={cols}
        data={data}
        renderCard={(r) => <span>{String(r['code'])}</span>}
        virtual
        rowHeight={32}
        overscan={8}
        cardHeight={64}
      />,
    );
    expect(screen.getAllByRole('article').length).toBeLessThan(60);
    const scroller = document.querySelector<HTMLElement>('[data-virtual="true"]')!;
    Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
    fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
    expect(screen.queryByText('SO-0')).toBeNull();
    // floor(5000 / 64) = 78, minus overscan 8 → the window opens at SO-70.
    expect(screen.getByText('SO-70')).toBeInTheDocument();
    expect(screen.getAllByRole('article').length).toBeLessThan(60);
  } finally {
    restore();
  }
});

test('virtual observes the scrollport with ResizeObserver and cleans up', () => {
  const observe = vi.fn();
  const disconnect = vi.fn();
  let roCallback: ResizeObserverCallback | undefined;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = observe;
      disconnect = disconnect;
      constructor(callback: ResizeObserverCallback) {
        roCallback = callback;
      }
    },
  );
  try {
    const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
    const { unmount } = render(
      <Table columns={cols} data={data} virtual rowHeight={32} overscan={8} />,
    );
    const grid = screen.getByRole('grid');
    const scroller = grid.parentElement as HTMLDivElement;
    expect(observe).toHaveBeenCalledWith(scroller);
    Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
    fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
    expect(screen.queryByText('SO-200')).toBeNull();
    // Container resize (maxHeight change, card layout) → same re-measure path.
    Object.defineProperty(scroller, 'clientHeight', { value: 3200, configurable: true });
    act(() => roCallback?.([], {} as ResizeObserver));
    expect(screen.getByText('SO-200')).toBeInTheDocument();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
  }
});

// --- Task 8: pagination footer + export + mobile card scope ------------------

/**
 * jsdom ships no `URL.createObjectURL`/`revokeObjectURL`, so the default CSV
 * download path only becomes observable with both stubbed (same
 * save/define/restore shape as `stubMatchMedia` above). `blobs` collects the
 * payloads the table tried to download.
 */
/** Reads a Blob's bytes — jsdom's Blob has no `.text()`, FileReader works. */
function blobBytes(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsArrayBuffer(blob);
  });
}

function stubObjectURL(): { blobs: Blob[]; restore: () => void } {
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  const blobs: Blob[] = [];
  const create = vi.fn((blob: Blob) => {
    blobs.push(blob);
    return `blob:mock-${blobs.length}`;
  });
  const revoke = vi.fn();
  Object.defineProperty(URL, 'createObjectURL', {
    value: create,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: revoke,
    configurable: true,
    writable: true,
  });
  return {
    blobs,
    restore: () => {
      Object.defineProperty(URL, 'createObjectURL', {
        value: originalCreate,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: originalRevoke,
        configurable: true,
        writable: true,
      });
    },
  };
}

test('pagination footer clamps out-of-range page', () => {
  const onPage = vi.fn();
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1' }]}
      pagination={{ page: 99, pageSize: 5, total: 8, onPage }}
    />,
  );
  expect(screen.getByRole('navigation', { name: /Phân trang/ })).toBeInTheDocument();
  // The clamp must also report back: ceil(8 / 5) = 2 is the page the parent
  // should re-slice to, not the out-of-range 99 it passed in.
  expect(onPage).toHaveBeenCalledWith(2);
});

test('pagination footer forwards page changes to onPage', () => {
  const onPage = vi.fn();
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1' }]}
      pagination={{ page: 1, pageSize: 5, total: 8, onPage }}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Trang sau' }));
  expect(onPage).toHaveBeenLastCalledWith(2);
});

// --- PR #6 review findings -------------------------------------------------

test('virtual measures a scrollport that mounts after a status flip', () => {
  const observe = vi.fn();
  const disconnect = vi.fn();
  let roCallback: ResizeObserverCallback | undefined;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = observe;
      disconnect = disconnect;
      constructor(callback: ResizeObserverCallback) {
        roCallback = callback;
        void observe;
        void disconnect;
      }
    },
  );
  try {
    const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
    const props = {
      columns: cols,
      data,
      virtual: true as const,
      rowHeight: 32,
      overscan: 8,
    };
    const { rerender } = render(<Table {...props} status="loading" />);
    expect(screen.queryByRole('grid')).toBeNull();
    // The grid (and its scrollport) mounts on the flip to idle — the effect
    // must observe the fresh node instead of bailing on the loading frame's
    // null ref.
    rerender(<Table {...props} status="idle" />);
    const grid = screen.getByRole('grid');
    const scroller = grid.parentElement as HTMLDivElement;
    expect(observe).toHaveBeenCalledWith(scroller);
    Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
    fireEvent(window, new Event('resize'));
    // A real window of rows renders — not just the overscan-only first frame.
    expect(screen.getByText('SO-0')).toBeInTheDocument();
    expect(within(grid).getAllByRole('row').length).toBeGreaterThan(10);
    void roCallback;
  } finally {
    vi.unstubAllGlobals();
  }
});

test('virtual resets the window when the scrollport remounts', () => {
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
  const props = { columns: cols, data, virtual: true as const, rowHeight: 32, overscan: 8 };
  const { rerender } = render(<Table {...props} status="idle" />);
  const scroller = screen.getByRole('grid').parentElement as HTMLDivElement;
  Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
  fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
  expect(screen.queryByText('SO-0')).toBeNull();
  // The status flip unmounts the scrollport; the fresh one starts at the top
  // instead of rendering from the stale offset into a blank viewport.
  rerender(<Table {...props} status="empty" />);
  rerender(<Table {...props} status="idle" />);
  expect(screen.getByText('SO-0')).toBeInTheDocument();
});

test('empty and error states keep the footer bar so pagination stays usable', () => {
  const onPage = vi.fn();
  const bar = {
    summary: <span>Tổng</span>,
    pagination: { page: 99, pageSize: 5, total: 8, onPage },
    exportable: true as const,
  };
  const { rerender } = render(<Table columns={cols} data={[]} status="empty" {...bar} />);
  expect(screen.getByText(/Không có dữ liệu/)).toBeInTheDocument();
  // The pager still mounts — and its clamp still reports back — instead of
  // vanishing with the grid when the caller's page slice is empty.
  expect(screen.getByRole('navigation', { name: /Phân trang/ })).toBeInTheDocument();
  expect(onPage).toHaveBeenCalledWith(2);
  expect(screen.getByRole('button', { name: /Xuất CSV/ })).toBeInTheDocument();
  expect(screen.getByText('Tổng')).toBeInTheDocument();
  rerender(<Table columns={cols} data={[]} status="error" onRetry={() => {}} {...bar} />);
  expect(screen.getByRole('navigation', { name: /Phân trang/ })).toBeInTheDocument();
});

test('pinned offsets include leading select/expand control tracks', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', pinned: 'left', width: 120 },
        { key: 'total', title: 'Tổng' },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
      selectedKeys={[]}
      onSelect={() => {}}
      renderExpanded={() => <div>detail</div>}
      expandedKeys={[]}
      onToggleExpand={() => {}}
    />,
  );
  // 36px select + 36px expand precede the first data column.
  expect(screen.getByText('Mã').closest('[role="columnheader"]')).toHaveStyle({ left: '72px' });
  const selectCell = screen
    .getByRole('checkbox', { name: /chọn tất cả/i })
    .closest('[role="columnheader"]')!;
  expect(selectCell.className).toMatch(/pinL/);
  expect(selectCell).toHaveStyle({ left: '0px' });
  const headers = () => within(screen.getByRole('grid')).getAllByRole('columnheader');
  // The expand track sits one control width in (header cells: select,
  // expand placeholder, then data columns).
  expect(headers()[1]).toHaveStyle({ left: '36px' });
});

test('expand control pins at track 0 without selection', () => {
  render(
    <Table
      columns={[{ key: 'code', title: 'Mã', pinned: 'left', width: 120 }]}
      data={[{ code: 'SO-1' }]}
      renderExpanded={() => <div>detail</div>}
      expandedKeys={[]}
      onToggleExpand={() => {}}
    />,
  );
  expect(screen.getByText('Mã').closest('[role="columnheader"]')).toHaveStyle({ left: '36px' });
  // Without selection the expand track is first: offset 0.
  const headers = within(screen.getByRole('grid')).getAllByRole('columnheader');
  expect(headers[0]).toHaveStyle({ left: '0px' });
});

test('right pins advertise data-right-pins and stick at cumulative offsets', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã' },
        { key: 'total', title: 'Tổng', pinned: 'right', width: 100 },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
    />,
  );
  const grid = screen.getByRole('grid');
  expect(grid).toHaveAttribute('data-right-pins', 'true');
  expect(grid).not.toHaveAttribute('data-left-pins');
  expect(screen.getByText('Tổng').closest('[role="columnheader"]')).toHaveStyle({
    right: '0px',
  });
});

test('body and filter control cells share the header pin offsets', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', pinned: 'left', width: 120 },
        { key: 'total', title: 'Tổng' },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
      selectedKeys={[]}
      onSelect={() => {}}
      renderExpanded={() => <div>detail</div>}
      expandedKeys={[]}
      onToggleExpand={() => {}}
      showFilterRow
      columnFilters={{}}
      onColumnFilter={() => {}}
    />,
  );
  const grid = screen.getByRole('grid');
  const rows = within(grid).getAllByRole('row');
  // Header (0), filter (1), body (2): select at 0, expand at 36 in each.
  const bodySelect = screen
    .getByRole('checkbox', { name: /Chọn dòng SO-1/ })
    .closest('[role="gridcell"]')!;
  expect(bodySelect).toHaveStyle({ left: '0px' });
  expect(
    screen.getByRole('button', { name: /Mở rộng SO-1/ }).closest('[role="gridcell"]'),
  ).toHaveStyle({ left: '36px' });
  const filterCells = within(rows[1]).getAllByRole('gridcell');
  expect(filterCells[0]).toHaveStyle({ left: '0px' });
  expect(filterCells[1]).toHaveStyle({ left: '36px' });
});

test('error keeps the footer inside the wrap; loading stays chrome-free', () => {
  const bar = {
    summary: <span>Tổng</span>,
    pagination: { page: 1, pageSize: 5, total: 8, onPage: () => {} },
    exportable: true as const,
  };
  const { rerender } = render(
    <Table columns={cols} data={[]} status="error" onRetry={() => {}} {...bar} />,
  );
  const nav = screen.getByRole('navigation', { name: /Phân trang/ });
  const wrap = nav.closest('div[class*="wrap"]');
  expect(wrap).not.toBeNull();
  expect(wrap).toContainElement(screen.getByText('Lỗi tải dữ liệu'));
  // Loading is transient: no pager, no export, no summary chrome.
  rerender(<Table columns={cols} data={[]} status="loading" {...bar} />);
  expect(screen.getByText(/Đang tải/)).toBeInTheDocument();
  expect(screen.queryByRole('navigation')).toBeNull();
  expect(screen.queryByRole('button', { name: /Xuất CSV/ })).toBeNull();
  expect(screen.queryByText('Tổng')).toBeNull();
});

test('default edge stickiness yields to explicit pins', () => {
  const { rerender } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã' },
        { key: 'total', title: 'Tổng', pinned: 'left', width: 100 },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
    />,
  );
  const grid = screen.getByRole('grid');
  // The grid advertises declared pins so the stylesheet can scope the
  // unconditional P1 first/last stickiness away from conflicting edges.
  expect(grid).toHaveAttribute('data-left-pins', 'true');
  expect(grid).not.toHaveAttribute('data-right-pins');
  expect(screen.getByText('Tổng').closest('[role="columnheader"]')).toHaveStyle({
    left: '0px',
  });
  rerender(
    <Table
      columns={[
        { key: 'code', title: 'Mã' },
        { key: 'total', title: 'Tổng' },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
    />,
  );
  expect(screen.getByRole('grid')).not.toHaveAttribute('data-left-pins');
});

test('zebra striping follows the absolute row index, not the window', () => {
  const three = [{ code: 'SO-1' }, { code: 'SO-2' }, { code: 'SO-3' }];
  const { unmount } = render(<Table columns={cols} data={three} />);
  // Plain mode: first body row tinted, matching the pre-virtual look.
  expect(
    within(screen.getByRole('grid'))
      .getAllByRole('row')
      .slice(1)
      .map((r) => r.getAttribute('data-stripe')),
  ).toEqual(['true', 'false', 'true']);
  unmount();
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
  render(<Table columns={cols} data={data} virtual rowHeight={32} overscan={8} />);
  const grid = screen.getByRole('grid');
  const scroller = grid.parentElement as HTMLDivElement;
  Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
  // Scroll by an odd row count — parity must stick to the absolute index so
  // the body never shimmers.
  fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
  const first = within(grid).getAllByRole('row')[1];
  expect(first).toHaveTextContent('SO-148');
  expect(first).toHaveAttribute('data-stripe', 'true');
});

test('virtual rows carry aria-rowindex from the absolute position', () => {
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
  const { rerender } = render(
    <Table columns={cols} data={data} virtual rowHeight={32} overscan={8} />,
  );
  const grid = screen.getByRole('grid');
  const scroller = grid.parentElement as HTMLDivElement;
  Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
  fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
  // Header is row 1: first windowed body row (SO-148) is row 150.
  expect(within(grid).getAllByRole('row')[1]).toHaveAttribute('aria-rowindex', '150');
  rerender(
    <Table
      columns={cols}
      data={data}
      virtual
      rowHeight={32}
      overscan={8}
      showFilterRow
      columnFilters={{}}
    />,
  );
  // The filter row shifts body rows one position down.
  expect(within(screen.getByRole('grid')).getAllByRole('row')[2]).toHaveAttribute(
    'aria-rowindex',
    '151',
  );
});

test('virtual clamps non-positive row heights instead of collapsing', () => {
  const data = [{ code: 'SO-1' }, { code: 'SO-2' }, { code: 'SO-3' }];
  render(<Table columns={cols} data={data} virtual rowHeight={0} overscan={8} />);
  const grid = screen.getByRole('grid');
  const body = within(grid).getAllByRole('row').slice(1);
  // Every row reachable at a 1px floor — no zero-height stack at top:0.
  expect(body).toHaveLength(3);
  for (const row of body) expect(row.style.height).toBe('1px');
});

test('zebra striping holds at an odd window start', () => {
  const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
  render(<Table columns={cols} data={data} virtual rowHeight={31} overscan={8} />);
  const grid = screen.getByRole('grid');
  const scroller = grid.parentElement as HTMLDivElement;
  Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
  // floor(5000 / 31) - 8 = 153: an odd start — a window-relative parity would
  // tint SO-153, the absolute index keeps it untinted.
  fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
  const first = within(grid).getAllByRole('row')[1];
  expect(first).toHaveTextContent('SO-153');
  expect(first).toHaveAttribute('data-stripe', 'false');
});

test('virtual re-measures on mount without waiting for a resize', () => {
  // jsdom reports clientHeight 0, so stub the prototype: the scrollport reads
  // a real viewport the moment it mounts, with no event fired afterwards.
  const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    value: 320,
    configurable: true,
  });
  try {
    const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
    const props = { columns: cols, data, virtual: true as const, rowHeight: 32, overscan: 8 };
    const { rerender } = render(<Table {...props} status="loading" />);
    rerender(<Table {...props} status="idle" />);
    // No scroll, no resize — the mount-time measure alone opens the window.
    const grid = screen.getByRole('grid');
    expect(within(grid).getAllByRole('row').length).toBeGreaterThan(10);
    expect(screen.getByText('SO-0')).toBeInTheDocument();
  } finally {
    // Restore unconditionally: jsdom defines `clientHeight` on
    // `Element.prototype`, so there may be no own descriptor to put back —
    // leaving the stubbed value on the prototype would leak 320px into every
    // later test (follow-up finding 1).
    if (descriptor) Object.defineProperty(HTMLElement.prototype, 'clientHeight', descriptor);
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>).clientHeight;
  }
});

test('breakpoint cross resets the reused scrollport offset', () => {
  // A live matchMedia stub: flipping `matches` notifies the hook, so the
  // desktop grid branch and the mobile card branch share one `.scroll` node
  // exactly like a real viewport cross.
  let matches = false;
  const listeners = new Set<(event: { matches: boolean }) => void>();
  const original = window.matchMedia;
  Object.defineProperty(window, 'matchMedia', {
    value: () => ({
      matches,
      media: '',
      onchange: null,
      addEventListener: (_t: string, fn: (event: { matches: boolean }) => void) => {
        listeners.add(fn);
      },
      removeEventListener: (fn: (event: { matches: boolean }) => void) => {
        listeners.delete(fn);
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
    configurable: true,
    writable: true,
  });
  try {
    const data = Array.from({ length: 10000 }, (_, i) => ({ code: `SO-${i}` }));
    render(
      <Table
        columns={cols}
        data={data}
        renderCard={(r) => <span>{String(r['code'])}</span>}
        virtual
        rowHeight={32}
        overscan={8}
      />,
    );
    const scroller = document.querySelector('[data-virtual="true"]') as HTMLDivElement;
    Object.defineProperty(scroller, 'clientHeight', { value: 320, configurable: true });
    fireEvent.scroll(scroller, { target: { scrollTop: 5000 } });
    expect(scroller.scrollTop).toBe(5000);
    expect(screen.queryByText('SO-0')).toBeNull();
    // Cross to mobile: the same DOM node survives, so resetting only React
    // state would leave a 5000px DOM offset against a 0-based window.
    matches = true;
    act(() => {
      listeners.forEach((fn) => fn({ matches: true }));
    });
    const cards = screen.getAllByRole('article');
    expect(document.querySelector('[data-virtual="true"]')).toBe(scroller);
    expect(scroller.scrollTop).toBe(0);
    expect(cards[0]).toHaveTextContent('SO-0');
  } finally {
    Object.defineProperty(window, 'matchMedia', {
      value: original,
      configurable: true,
      writable: true,
    });
  }
});

test('tiny virtual card heights floor instead of overlapping', () => {
  const restore = stubMatchMedia(true);
  try {
    const data = [
      { code: 'SO-1', total: '₫ 10M' },
      { code: 'SO-2', total: '₫ 20M' },
    ];
    render(<Table columns={cols} data={data} cardHeight={8} virtual />);
    const vcards = screen.getAllByRole('article');
    // Slot 8 minus the 8px gap floors at 1px — never zero/negative boxes
    // overlapping inside the stride.
    expect(vcards.map((c) => c.style.height)).toEqual(['1px', '1px']);
    expect(vcards.map((c) => c.style.top)).toEqual(['0px', '8px']);
  } finally {
    restore();
  }
});

test('expanded detail floors a non-positive expandedHeight', () => {
  const data = [{ code: 'SO-1', total: '₫ 10M' }];
  render(
    <Table
      columns={cols}
      data={data}
      renderExpanded={() => <div>detail</div>}
      expandedKeys={['SO-1']}
      onToggleExpand={() => {}}
      expandedHeight={0}
    />,
  );
  const detail = screen.getByText('detail').closest('[role="row"]') as HTMLElement;
  expect(detail.style.height).toBe('1px');
});

test('empty-state footer stays inside the wrap card', () => {
  render(
    <Table
      columns={cols}
      data={[]}
      status="empty"
      pagination={{ page: 1, pageSize: 5, total: 8, onPage: () => {} }}
    />,
  );
  const nav = screen.getByRole('navigation', { name: /Phân trang/ });
  // Pager and state box share the `.wrap` container — no bare square sibling.
  const wrap = nav.closest('div[class*="wrap"]');
  expect(wrap).not.toBeNull();
  expect(wrap).toContainElement(screen.getByText(/Không có dữ liệu/));
});

test('footer bar groups summary, pagination and export below the scrollport', () => {
  render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1' }]}
      summary={<span>Tổng: 1 đơn</span>}
      pagination={{ page: 1, pageSize: 5, total: 8, onPage: () => {} }}
      exportable
    />,
  );
  const grid = screen.getByRole('grid');
  // With a footer bar the summary leaves the grid rows — exactly one instance,
  // in the bar — so the grid's aria-rowcount stops counting it.
  expect(within(grid).queryByText('Tổng: 1 đơn')).toBeNull();
  expect(grid).toHaveAttribute('aria-rowcount', '2');
  const nav = screen.getByRole('navigation', { name: /Phân trang/ });
  const bar = nav.parentElement!;
  expect(bar).toContainElement(screen.getByText('Tổng: 1 đơn'));
  expect(bar).toContainElement(screen.getByRole('button', { name: /Xuất CSV/ }));
  // The bar sits outside the scrollport (the grid's parent), so rows scroll
  // under it while the controls stay put.
  expect(bar.previousElementSibling).toBe(grid.parentElement);
});

test('export downloads default csv when no onExport', async () => {
  const { restore } = stubObjectURL();
  const appendSpy = vi.spyOn(document.body, 'appendChild');
  try {
    render(<Table columns={cols} data={[{ code: 'SO-1' }]} exportable exportFileName="d.csv" />);
    fireEvent.click(screen.getByRole('button', { name: /Xuất CSV/ }));
    expect(URL.createObjectURL).toHaveBeenCalled();
    // The robustness lines are pinned: the anchor goes into the document
    // (detached clicks race some browsers), carries the file name, leaves
    // afterwards, and the object URL is revoked on a delay — not synchronously.
    const anchor = appendSpy.mock.calls
      .map((call) => call[0] as Node)
      .find((node) => node instanceof HTMLAnchorElement) as HTMLAnchorElement;
    expect(anchor).toBeInstanceOf(HTMLAnchorElement);
    expect(anchor.download).toBe('d.csv');
    // `anchor.remove()` detaches natively (not via the spied method), so the
    // post-click detachment itself is the assertion.
    expect(anchor.parentNode).toBeNull();
    // The revoke is deferred, not synchronous: immediately after the click it
    // must NOT have run yet — a sync revoke would cut off large downloads.
    expect(vi.mocked(URL.revokeObjectURL)).not.toHaveBeenCalled();
    // The revoke is deferred 100ms after the click — let it run against the
    // stub before restoring jsdom's (absent) original, or the timer throws.
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(vi.mocked(URL.revokeObjectURL)).toHaveBeenCalledWith('blob:mock-1');
  } finally {
    appendSpy.mockRestore();
    restore();
  }
});

test('default export downloads a BOM csv of the visible rows and columns', async () => {
  const { blobs, restore } = stubObjectURL();
  try {
    const data = [{ code: 'SO-1', total: '₫ 10M' }];
    render(<Table columns={cols} data={data} exportable exportFileName="d.csv" />);
    fireEvent.click(screen.getByRole('button', { name: /Xuất CSV/ }));
    expect(blobs).toHaveLength(1);
    expect(blobs[0].type).toBe('text/csv;charset=utf-8');
    // The payload is exactly what `toCSV` builds from the visible data —
    // BOM bytes first, then header titles + RFC4180 escapes (unit-tested in
    // exportCsv.test). jsdom's Blob has no `.text()`, so FileReader reads it.
    const bytes = await blobBytes(blobs[0]);
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes)).toBe(toCSV(data, cols));
    // Let the deferred 100ms revoke run against the stub before restoring
    // jsdom's (absent) original, or the timer throws after the test.
    await new Promise((resolve) => setTimeout(resolve, 150));
  } finally {
    restore();
  }
});

test('export button prefers the onExport override over the default download', () => {
  const onExport = vi.fn();
  const { restore } = stubObjectURL();
  try {
    render(<Table columns={cols} data={rows} exportable onExport={onExport} />);
    fireEvent.click(screen.getByRole('button', { name: /Xuất CSV/ }));
    expect(onExport).toHaveBeenCalledWith(rows, cols);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  } finally {
    restore();
  }
});

test('export button stays hidden without exportable', () => {
  render(<Table columns={cols} data={rows} />);
  expect(screen.queryByRole('button', { name: /Xuất CSV/ })).toBeNull();
});

test('expanded card renders its renderExpanded content', () => {
  const restore = stubMatchMedia(true);
  try {
    const view = (expandedKeys: string[]) => (
      <Table
        columns={cols}
        data={rows}
        renderExpanded={(r) => <div>Nội dung {String(r['code'])}</div>}
        expandedKeys={expandedKeys}
        onToggleExpand={() => {}}
      />
    );
    const { rerender } = render(view([]));
    const card = screen.getByRole('article');
    // Collapsed: no detail content, toggle reports collapsed.
    expect(card).not.toHaveTextContent('Nội dung SO-1');
    expect(within(card).getByRole('button', { name: /Chi tiết/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    // Controlled expand (the key arrives through expandedKeys) — the card
    // shows the detail content instead of a dead Chi tiết toggle (T7 gap).
    rerender(view(['SO-1']));
    const expandedCard = screen.getByRole('article');
    expect(within(expandedCard).getByText('Nội dung SO-1')).toBeInTheDocument();
    expect(within(expandedCard).getByRole('button', { name: /Chi tiết/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    // Controlled collapse removes it again.
    rerender(view([]));
    expect(screen.queryByText('Nội dung SO-1')).toBeNull();
  } finally {
    restore();
  }
});

test('cards are read-only-flat: no select, filter row, group headers or grid summary', () => {
  const restore = stubMatchMedia(true);
  try {
    render(
      <Table
        columns={cols}
        data={[
          { code: 'SO-1', total: '₫ 10M', status: 'open' },
          { code: 'SO-2', total: '₫ 20M', status: 'open' },
        ]}
        selectedKeys={[]}
        onSelect={() => {}}
        showFilterRow
        columnFilters={{}}
        onColumnFilter={() => {}}
        groupBy={['status']}
        collapsedGroups={[]}
        onToggleGroup={() => {}}
        summary={<span>Tổng: 2 đơn</span>}
        pagination={{ page: 1, pageSize: 5, total: 2, onPage: () => {} }}
        exportable
      />,
    );
    // Documented contract (read-only-flat): cards render `data` as a flat
    // list — grid-only affordances (selection, filter row, group headers,
    // the grid's summary row) never reach the card branch, whatever props
    // are passed. Filtering/sorting still apply through `data` itself.
    expect(screen.queryByRole('grid')).toBeNull();
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(screen.queryByLabelText(/^Lọc /)).toBeNull();
    expect(screen.queryByRole('button', { name: /Thu gọn/ })).toBeNull();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    // The table-level footer (summary + pagination + export) is not a row
    // affordance — it still renders below the cards.
    const nav = screen.getByRole('navigation', { name: /Phân trang/ });
    const bar = nav.parentElement!;
    expect(bar).toContainElement(screen.getByText('Tổng: 2 đơn'));
    expect(bar).toContainElement(screen.getByRole('button', { name: /Xuất CSV/ }));
  } finally {
    restore();
  }
});

// --- Column resize -----------------------------------------------------------

const resizeCols = [
  { key: 'code', title: 'Mã đơn', sortable: true, width: 120 },
  { key: 'total', title: 'Giá trị', align: 'right' as const },
];

test('no resize handles by default or on control tracks', () => {
  const { rerender } = render(
    <Table columns={resizeCols} data={rows} selectedKeys={[]} onSelect={() => {}} />,
  );
  expect(screen.queryByRole('separator')).toBeNull();
  rerender(
    <Table
      columns={resizeCols}
      data={rows}
      resizable
      onColumnWidth={() => {}}
      selectedKeys={[]}
      onSelect={() => {}}
      renderExpanded={() => <div>detail</div>}
      expandedKeys={[]}
      onToggleExpand={() => {}}
    />,
  );
  const header = screen.getByText('Mã đơn').closest('[role="columnheader"]')!;
  expect(
    within(header as HTMLElement).getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
  ).toBeInTheDocument();
  // Control tracks (select checkbox, expand toggle) never get a handle.
  const selectHeader = screen
    .getByRole('checkbox', { name: /chọn tất cả/i })
    .closest('[role="columnheader"]')!;
  expect(within(selectHeader as HTMLElement).queryByRole('separator')).toBeNull();
  const headers = within(screen.getByRole('grid')).getAllByRole('columnheader');
  // select, expand placeholder, then data columns — the placeholder is empty.
  expect(within(headers[1] as HTMLElement).queryByRole('separator')).toBeNull();
});

test('resizable without a reporter renders no handles', () => {
  // A separator that reports nowhere is worse than none (review finding).
  render(<Table columns={resizeCols} data={rows} resizable />);
  expect(screen.queryByRole('separator')).toBeNull();
});

test('dragging a handle reports startWidth plus dx', () => {
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  // jsdom has no PointerEvent constructor — dispatch real MouseEvents under
  // the pointer* type names, exactly what the window listeners observe.
  fireEvent(handle, new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }));
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 150 }),
    );
  });
  // jsdom measures 0px, so the run starts from the declared 120px width.
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 170);
  act(() => {
    window.dispatchEvent(new window.MouseEvent('pointerup', { bubbles: true }));
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 999 }),
    );
  });
  // Released: further moves report nothing new.
  expect(onColumnWidth).toHaveBeenCalledTimes(1);
});

test('drag clamps at the minimum column width', () => {
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  fireEvent(
    screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
    new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }),
  );
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: -1000 }),
    );
  });
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 40);
  act(() => {
    window.dispatchEvent(new window.MouseEvent('pointerup', { bubbles: true }));
  });
});

test('keyboard arrows resize in 8px steps, 32px with shift', () => {
  const onColumnWidth = vi.fn();
  render(
    <Table
      columns={resizeCols}
      data={rows}
      resizable
      columnWidths={{ code: 120 }}
      onColumnWidth={onColumnWidth}
    />,
  );
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  fireEvent.keyDown(handle, { key: 'ArrowRight' });
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 128);
  fireEvent.keyDown(handle, { key: 'ArrowLeft', shiftKey: true });
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 88);
});

test('double-click resets the column override', () => {
  const onColumnWidthReset = vi.fn();
  render(
    <Table
      columns={resizeCols}
      data={rows}
      resizable
      columnWidths={{ code: 200 }}
      onColumnWidth={() => {}}
      onColumnWidthReset={onColumnWidthReset}
    />,
  );
  fireEvent.doubleClick(screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }));
  expect(onColumnWidthReset).toHaveBeenCalledWith('code');
});

test('Delete key resets the column override for keyboard users', () => {
  const onColumnWidthReset = vi.fn();
  render(
    <Table
      columns={resizeCols}
      data={rows}
      resizable
      columnWidths={{ code: 200 }}
      onColumnWidth={() => {}}
      onColumnWidthReset={onColumnWidthReset}
    />,
  );
  fireEvent.keyDown(screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }), {
    key: 'Delete',
  });
  expect(onColumnWidthReset).toHaveBeenCalledWith('code');
});

test('pin offsets track overrides across multiple left pins', () => {
  // A single index-0 pin sits at left:0 with or without its override — only
  // the SECOND pin's offset proves accumulation follows the live width.
  const pinCols = [
    { key: 'code', title: 'Mã', pinned: 'left' as const, width: 120 },
    { key: 'customer', title: 'KH', pinned: 'left' as const, width: 80 },
    { key: 'total', title: 'Tổng' },
  ];
  const props = {
    columns: pinCols,
    data: [{ code: 'SO-1', customer: 'A', total: '1' }],
    resizable: true as const,
    onColumnWidth: () => {},
  };
  const { rerender } = render(<Table {...props} columnWidths={{}} />);
  expect(screen.getByText('KH').closest('[role="columnheader"]')).toHaveStyle({
    left: '120px',
  });
  rerender(<Table {...props} columnWidths={{ code: 200 }} />);
  expect(screen.getByText('KH').closest('[role="columnheader"]')).toHaveStyle({
    left: '200px',
  });
});

test('dropping an override restores the flexible track, never 0px', () => {
  const flexCols = [
    { key: 'code', title: 'Mã đơn', sortable: true },
    { key: 'total', title: 'Giá trị', align: 'right' as const },
  ];
  const { rerender } = render(
    <Table
      columns={flexCols}
      data={rows}
      resizable
      columnWidths={{ code: 200 }}
      onColumnWidth={() => {}}
    />,
  );
  let header = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('200px');
  // Caller deletes the key (the reset contract): the track goes flexible,
  // floored by the cell minimum — never a collapsed 0px track.
  rerender(
    <Table columns={flexCols} data={rows} resizable columnWidths={{}} onColumnWidth={() => {}} />,
  );
  header = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('minmax(var(--cell-min-width)');
});

test('pointercancel ends the drag like pointerup', () => {
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  fireEvent(
    screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
    new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }),
  );
  act(() => {
    window.dispatchEvent(new window.MouseEvent('pointercancel', { bubbles: true }));
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 999 }),
    );
  });
  // Cancelled before any move: nothing reported, no stale drag lingers.
  expect(onColumnWidth).not.toHaveBeenCalled();
});

test('non-primary button never starts a drag', () => {
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  fireEvent(
    screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
    new window.MouseEvent('pointerdown', { bubbles: true, button: 2, clientX: 100 }),
  );
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 999 }),
    );
  });
  expect(onColumnWidth).not.toHaveBeenCalled();
});

test('a newer pointerdown takes over a stale drag (self-healing)', () => {
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  const handles = screen.getAllByRole('separator');
  expect(handles).toHaveLength(2);
  fireEvent(handles[0], new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }));
  // A lost pointerup would leave the first drag armed forever on touch
  // (incrementing pointerIds) — the new pointerdown heals it and owns the
  // drag instead of merging into it.
  fireEvent(handles[1], new window.MouseEvent('pointerdown', { bubbles: true, clientX: 0 }));
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 50 }),
    );
  });
  expect(onColumnWidth).toHaveBeenCalledTimes(1);
  expect(onColumnWidth).toHaveBeenLastCalledWith('total', 170);
});

test('moves from another pointer never drive the drag', () => {
  const withId = (type: string, pointerId: number, clientX: number) => {
    const event = new window.MouseEvent(type, { bubbles: true, buttons: 1, clientX });
    (event as unknown as Record<string, unknown>).pointerId = pointerId;
    return event;
  };
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  fireEvent(
    screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
    withId('pointerdown', 1, 100),
  );
  act(() => {
    // Second finger moves: ignored, drag stays armed.
    window.dispatchEvent(withId('pointermove', 2, 999));
  });
  expect(onColumnWidth).not.toHaveBeenCalled();
  act(() => {
    // Second finger release: must not end the first drag either.
    window.dispatchEvent(withId('pointerup', 2, 0));
    window.dispatchEvent(withId('pointermove', 1, 150));
  });
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 170);
});

test('unmounting mid-drag drops the listeners', () => {
  const onColumnWidth = vi.fn();
  const { unmount } = render(
    <Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />,
  );
  fireEvent(
    screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
    new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }),
  );
  unmount();
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 999 }),
    );
  });
  expect(onColumnWidth).not.toHaveBeenCalled();
});

test('minColumnWidth other than the default clamps drags', () => {
  const onColumnWidth = vi.fn();
  render(
    <Table
      columns={resizeCols}
      data={rows}
      resizable
      minColumnWidth={10}
      onColumnWidth={onColumnWidth}
    />,
  );
  fireEvent(
    screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
    new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }),
  );
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: -1000 }),
    );
  });
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 10);
  act(() => {
    window.dispatchEvent(new window.MouseEvent('pointerup', { bubbles: true }));
  });
});

test('drag starts from the measured cell when the DOM reports one', () => {
  const onColumnWidth = vi.fn();
  const measured = vi
    .spyOn(window.HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({ width: 300 } as DOMRect);
  try {
    render(
      <Table
        columns={[{ key: 'note', title: 'Ghi chú' }]}
        data={rows}
        resizable
        onColumnWidth={onColumnWidth}
      />,
    );
    fireEvent(
      screen.getByRole('separator', { name: /Đổi rộng cột Ghi chú/ }),
      new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }),
    );
    act(() => {
      window.dispatchEvent(
        new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 120 }),
      );
    });
    // Declared width absent: 300 measured + 20 dx.
    expect(onColumnWidth).toHaveBeenLastCalledWith('note', 320);
  } finally {
    measured.mockRestore();
  }
});

test('non-finite and zero overrides fall back instead of collapsing', () => {
  const { rerender } = render(
    <Table
      columns={[{ key: 'code', title: 'Mã', pinned: 'left', width: 120 }]}
      data={rows}
      resizable
      columnWidths={{ code: Number.NaN }}
      onColumnWidth={() => {}}
    />,
  );
  // NaN counts as unset: the declared 120px track and offset survive.
  let header = screen.getByText('Mã').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('120px');
  expect(header).toHaveStyle({ left: '0px' });
  // A literal 0 floors at 1px — never a collapsed track.
  rerender(
    <Table
      columns={[{ key: 'code', title: 'Mã', pinned: 'left', width: 120 }]}
      data={rows}
      resizable
      columnWidths={{ code: 0 }}
      onColumnWidth={() => {}}
    />,
  );
  header = screen.getByText('Mã').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('1px');
});

test('non-sortable headers get a handle and a clean accessible name', () => {
  render(
    <Table
      columns={[{ key: 'code', title: 'Mã đơn' }]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const cell = screen.getByRole('columnheader', { name: 'Mã đơn' });
  expect(
    within(cell as HTMLElement).getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
  ).toBeInTheDocument();
});

test('right-pin offsets follow overrides too', () => {
  const { rerender } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã' },
        { key: 'total', title: 'Tổng', pinned: 'right', width: 100 },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
      resizable
      columnWidths={{}}
      onColumnWidth={() => {}}
    />,
  );
  expect(screen.getByText('Tổng').closest('[role="columnheader"]')).toHaveStyle({
    right: '0px',
  });
  rerender(
    <Table
      columns={[
        { key: 'code', title: 'Mã' },
        { key: 'total', title: 'Tổng', pinned: 'right', width: 100 },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
      resizable
      columnWidths={{ total: 160 }}
      onColumnWidth={() => {}}
    />,
  );
  const header = screen.getByText('Tổng').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('160px');
});

test('width overrides flow into the template and pin offsets', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', pinned: 'left', width: 120 },
        { key: 'total', title: 'Tổng' },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
      resizable
      columnWidths={{ code: 200, nope: 5 }}
      onColumnWidth={() => {}}
    />,
  );
  const header = screen.getByText('Mã').closest('[role="columnheader"]') as HTMLElement;
  // Unknown keys change nothing: the template holds only real columns.
  expect(header.parentElement!.getAttribute('style')).not.toContain('5px');
  // Template uses the 200px override as an exact track (not a minmax floor),
  // and the pin offset follows it.
  expect(screen.getByText('Mã').closest('[role="columnheader"]')).toHaveStyle({
    left: '0px',
  });
  const template = header.parentElement!.getAttribute('style') ?? '';
  expect(template).toContain('200px');
  expect(template).not.toContain('minmax(200px');
});

test('a button-less move ends the drag instead of reporting', () => {
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  fireEvent(handle, new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100 }));
  // Pointerdown focuses the handle for keyboard follow-up.
  expect(document.activeElement).toBe(handle);
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 150 }),
    );
  });
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 170);
  // Lost pointerup: a move with no button held ends the drag — the next
  // held move reports nothing new.
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 0, clientX: 200 }),
    );
  });
  act(() => {
    window.dispatchEvent(
      new window.MouseEvent('pointermove', { bubbles: true, buttons: 1, clientX: 250 }),
    );
  });
  expect(onColumnWidth).toHaveBeenCalledTimes(1);
});

test('keyboard steps from the measured cell, not a stale declaration', () => {
  const measured = vi
    .spyOn(window.HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({ width: 300 } as DOMRect);
  try {
    const onColumnWidth = vi.fn();
    render(
      <Table
        columns={[{ key: 'note', title: 'Ghi chú', width: 120 }]}
        data={rows}
        resizable
        onColumnWidth={onColumnWidth}
      />,
    );
    // Declared 120, rendered 300: the first Arrow continues the edge.
    fireEvent.keyDown(screen.getByRole('separator', { name: /Đổi rộng cột Ghi chú/ }), {
      key: 'ArrowRight',
    });
    expect(onColumnWidth).toHaveBeenLastCalledWith('note', 308);
  } finally {
    measured.mockRestore();
  }
});

test('prototype-shadow keys never poison the template', () => {
  const shadowCols = [{ key: 'toString', title: 'T' }];
  const { rerender } = render(
    <Table columns={shadowCols} data={rows} resizable columnWidths={{}} onColumnWidth={() => {}} />,
  );
  // No own override: flexible track, no inherited member leaking in.
  let header = screen.getByText('T').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('minmax(var(--cell-min-width)');
  // An own numeric override is exact.
  rerender(
    <Table
      columns={shadowCols}
      data={rows}
      resizable
      columnWidths={{ toString: 200 }}
      onColumnWidth={() => {}}
    />,
  );
  header = screen.getByText('T').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toMatch(/:\s*200px;/);
});

test('two right pins accumulate under an override', () => {
  const pinCols = [
    { key: 'code', title: 'Mã' },
    { key: 'mid', title: 'Giữa', pinned: 'right' as const, width: 100 },
    { key: 'total', title: 'Tổng', pinned: 'right' as const, width: 60 },
  ];
  const props = {
    columns: pinCols,
    data: [{ code: 'SO-1', mid: 'M', total: '1' }],
    resizable: true as const,
    onColumnWidth: () => {},
  };
  const { rerender } = render(<Table {...props} columnWidths={{}} />);
  expect(screen.getByText('Giữa').closest('[role="columnheader"]')).toHaveStyle({
    right: '60px',
  });
  // Widening the last pin pushes the inner one out by the same delta.
  rerender(<Table {...props} columnWidths={{ total: 160 }} />);
  expect(screen.getByText('Giữa').closest('[role="columnheader"]')).toHaveStyle({
    right: '160px',
  });
});

test('override cells stand their min-width floor down', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', width: 120 },
        { key: 'total', title: 'Tổng' },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
      resizable
      columnWidths={{ code: 40 }}
      onColumnWidth={() => {}}
    />,
  );
  // Exact-track columns (header + body + filter cells) carry the floor-free
  // class so a 40px track is not overlapped by 120px boxes; untouched columns
  // keep theirs.
  const codeHeader = screen.getByText('Mã').closest('[role="columnheader"]')!;
  expect(codeHeader.className).toMatch(/exact/);
  const totalHeader = screen.getByText('Tổng').closest('[role="columnheader"]')!;
  expect(totalHeader.className).not.toMatch(/exact/);
  const bodyCode = screen.getByText('SO-1').closest('[role="gridcell"]')!;
  expect(bodyCode.className).toMatch(/exact/);
  const bodyTotal = screen.getByText('1').closest('[role="gridcell"]')!;
  expect(bodyTotal.className).not.toMatch(/exact/);
});

test('override cells in the filter row stand their floor down too', () => {
  render(
    <Table
      columns={[
        { key: 'code', title: 'Mã', width: 120, filterable: true },
        { key: 'total', title: 'Tổng' },
      ]}
      data={[{ code: 'SO-1', total: '1' }]}
      resizable
      showFilterRow
      columnFilters={{}}
      columnWidths={{ code: 40 }}
      onColumnWidth={() => {}}
    />,
  );
  const grid = screen.getByRole('grid');
  const filterRow = within(grid).getAllByRole('row')[1];
  const cells = within(filterRow).getAllByRole('gridcell');
  expect(cells[0].className).toMatch(/exact/);
  expect(cells[1].className).not.toMatch(/exact/);
});

test('non-finite overrides fall back to the declared width flexibly', () => {
  const { rerender } = render(
    <Table
      columns={[{ key: 'code', title: 'Mã', width: 120 }]}
      data={rows}
      resizable
      columnWidths={{ code: Number.NaN }}
      onColumnWidth={() => {}}
    />,
  );
  // NaN counts as unset: declared 120 stays a flexible floor, never exact.
  let header = screen.getByText('Mã').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('minmax(120px');
  expect(header.className).not.toMatch(/exact/);
  rerender(
    <Table
      columns={[{ key: 'toString', title: 'T', width: 120 }]}
      data={rows}
      resizable
      columnWidths={{}}
      onColumnWidth={() => {}}
    />,
  );
  header = screen.getByText('T').closest('[role="columnheader"]') as HTMLElement;
  expect(header.parentElement!.getAttribute('style')).toContain('minmax(120px');
});

test('a distinct second pointer takes over the drag', () => {
  const withId = (type: string, pointerId: number, clientX: number) => {
    const event = new window.MouseEvent(type, { bubbles: true, buttons: 1, clientX });
    (event as unknown as Record<string, unknown>).pointerId = pointerId;
    return event;
  };
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  const handles = screen.getAllByRole('separator');
  fireEvent(handles[0], withId('pointerdown', 1, 100));
  // Same-id synthetics in the older takeover test cannot prove the gate —
  // this second pointer carries a genuinely different id.
  fireEvent(handles[1], withId('pointerdown', 2, 0));
  act(() => {
    window.dispatchEvent(withId('pointermove', 2, 50));
  });
  expect(onColumnWidth).toHaveBeenCalledTimes(1);
  expect(onColumnWidth).toHaveBeenLastCalledWith('total', 170);
});

test("another pointer's hover never ends the armed drag", () => {
  const withId = (type: string, pointerId: number, clientX: number, buttons = 1) => {
    const event = new window.MouseEvent(type, { bubbles: true, buttons, clientX });
    (event as unknown as Record<string, unknown>).pointerId = pointerId;
    return event;
  };
  const onColumnWidth = vi.fn();
  render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={onColumnWidth} />);
  fireEvent(
    screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ }),
    withId('pointerdown', 1, 100),
  );
  act(() => {
    // Hovering stylus/mouse from another pointer: button-less AND foreign —
    // the drag must survive both.
    window.dispatchEvent(withId('pointermove', 2, 999, 0));
  });
  act(() => {
    window.dispatchEvent(withId('pointermove', 1, 150));
  });
  expect(onColumnWidth).toHaveBeenLastCalledWith('code', 170);
});

test('focus falls back to the platform scroll when nothing can be hit-tested', () => {
  const proto = window.HTMLElement.prototype as Partial<HTMLElement>;
  const original = proto.scrollIntoView;
  const scrollIntoView = vi.fn();
  proto.scrollIntoView = scrollIntoView;
  try {
    render(<Table columns={resizeCols} data={rows} resizable onColumnWidth={() => {}} />);
    const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
    // jsdom has no layout and no hit-testing: the reveal hands the strip to
    // the platform scroll — once, with the handle as the receiver (S3.b),
    // never a proxy.
    fireEvent.focus(handle);
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
    expect(scrollIntoView.mock.contexts[0]).toBe(handle);
  } finally {
    // jsdom ships no `scrollIntoView` at all, so a plain assign-back would
    // leave an own `undefined` on the prototype instead of removing the patch
    // (S3.a).
    if (original === undefined) delete proto.scrollIntoView;
    else proto.scrollIntoView = original;
  }
});

/** jsdom has no layout: pin the numbers this fixture's assertions read. */
const mockRect = (el: Element, left: number, right: number): void => {
  el.getBoundingClientRect = () =>
    ({
      left,
      right,
      top: 0,
      bottom: 32,
      width: right - left,
      height: 32,
      x: left,
      y: 0,
    }) as DOMRect;
};

/**
 * Reveal fixture: mocked viewport metrics plus coordinate-honest hit-testing,
 * so a wrong probe point or a wrong scroll target actually fails. `boxes` are
 * in paint order — the first containing box wins, like a real
 * elementFromPoint. `maxScroll` must be metric-honest for the scene: derive
 * it as `contentWidth − portWidth`, where `contentWidth` is the focused
 * column's content right edge plus the trailing content (the pinned block
 * when the column is adjacent to a pin). Phantom slack hides clamp bugs (T4).
 */
const setupReveal = (options: {
  scroller: HTMLElement;
  port: [number, number];
  scrollLeft: number;
  maxScroll: number;
  gutter?: number;
  sticky?: Element[];
  boxes: Array<[HTMLElement, number, number]>;
}): (() => void) => {
  const computed = vi.spyOn(window, 'getComputedStyle').mockImplementation(
    (el) =>
      ({
        overflowX: el === options.scroller ? 'auto' : 'visible',
        position: options.sticky?.includes(el) ? 'sticky' : 'static',
      }) as CSSStyleDeclaration,
  );
  mockRect(options.scroller, options.port[0], options.port[1]);
  Object.defineProperty(options.scroller, 'clientWidth', {
    configurable: true,
    value: options.port[1] - options.port[0],
  });
  Object.defineProperty(options.scroller, 'scrollWidth', {
    configurable: true,
    value: options.port[1] - options.port[0] + options.maxScroll,
  });
  Object.defineProperty(options.scroller, 'offsetWidth', {
    configurable: true,
    value: options.port[1] - options.port[0] + (options.gutter ?? 0),
  });
  options.scroller.scrollLeft = options.scrollLeft;
  for (const [el, left, right] of options.boxes) mockRect(el, left, right);
  document.elementFromPoint = vi.fn((x: number, y: number) => {
    if (y < 0 || y > 32) return null;
    return options.boxes.find(([, left, right]) => x >= left && x <= right)?.[0] ?? null;
  });
  return () => {
    delete (document as Partial<Document>).elementFromPoint;
    computed.mockRestore();
  };
};

test('a focused handle under a stuck cover is scrolled clear of it', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn', pinned: 'left', width: 130 },
        { key: 'total', title: 'Giá trị', align: 'right' },
        { key: 'note', title: 'Ghi chú', width: 394 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  // Default mode: `.wrap` scrolls, `.scroll` stays visible — the reveal must
  // resolve the real port, not the `[data-virtual]` div (T2).
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Giá trị/ });
  const cover = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  // Strip content right 330 + 394 trailing → content 724 = port 521 + 203.
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 203,
    maxScroll: 203,
    boxes: [
      [cover, 324, 454],
      [handle, 442, 451],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Left of the cover the strip cannot fit beside the band (324 is the port
    // edge), so the pick is the right-side clear: 203 − (454 + 4 − 442).
    expect(scroller.scrollLeft).toBe(187);
    expect(document.elementFromPoint).toHaveBeenCalledWith(446.5, 16);
  } finally {
    restore();
  }
});

test('an adjacent strip reveals into the range clamp, flush against the pin', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  // The 2-column pinned scene: strip content right 730 plus the trailing pin
  // (130) → content 860 = port 521 + 339 (T4's trailing == pin width).
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Clearing right of the cover would end past the port; the leftward move
    // asks for 343, clamps to maxScroll 339 and still parks flush against
    // the band's left edge — accepted, not vetoed (T4). Strip lands [706,715].
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('a straddling strip still reveals when only its center is buried', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  // Strip content right 669 + trailing 130 → content 799 = port 521 + 278.
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 278,
    boxes: [
      [cover, 715, 845],
      [handle, 712, 721],
    ],
  });
  try {
    // Center 716.5 is under the cover while the left edge (712) is not: a
    // probe on any other point misses the occlusion and reveals nothing.
    // The leftward move (10) clamps to 6 and still parks flush.
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(278);
  } finally {
    restore();
  }
});

test('an unclamped leftward clear keeps the full margin', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'note', title: 'Ghi chú', width: 53 },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  // A wider strip (17px): strip content right 738 + trailing 183 (pin 130 +
  // note 53) → content 921 = port 521 + 400. Leftward asks 79 ≤ 128 available,
  // so no clamp.
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 400,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 790],
    ],
  });
  try {
    // 272 + 79 = 351; the rightward clear (76, smaller move) is port-blocked
    // at 866 — a gate that ignores the port would drag the strip 155 left.
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(351);
  } finally {
    restore();
  }
});

test('a tiled pin cluster clears as one band, not just the hit pin', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn', pinned: 'left', width: 120 },
        { key: 'mid', title: 'Giữa', pinned: 'left', width: 120 },
        { key: 'total', title: 'Giá trị', align: 'right', width: 300 },
        { key: 'note', title: 'Ghi chú', width: 600 },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 145 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Giá trị/ });
  const outer = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  const inner = screen.getByText('Giữa').closest('[role="columnheader"]') as HTMLElement;
  const rightPin = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  // Declared sum 120 + 120 + 300 + 600 + 145 = 1285 = port 800 + 485; at
  // sl 431 the measured layout is exact: total [−191, 109] (the strip), the
  // index pins stuck [0, 120] / [120, 240], the right pin stuck [655, 800].
  const restore = setupReveal({
    scroller,
    port: [0, 800],
    scrollLeft: 431,
    maxScroll: 485,
    sticky: [outer, inner, rightPin],
    boxes: [
      [outer, 0, 120],
      [inner, 120, 240],
      [handle, 100, 109],
      [rightPin, 655, 800],
    ],
  });
  try {
    fireEvent.focus(handle);
    // The band is [0, 240]: a single-pin clear (124 − 100 = 24) would land
    // the strip inside the inner pin, and merging the far right pin in
    // leaves no feasible move at all. Band clear: 431 − (240 + 4 − 100).
    expect(scroller.scrollLeft).toBe(287);
  } finally {
    restore();
  }
});

test('virtual mode reveals against the virtual scroller', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn', pinned: 'left', width: 130 },
        { key: 'total', title: 'Giá trị', align: 'right' },
        { key: 'note', title: 'Ghi chú', width: 394 },
      ]}
      data={rows}
      resizable
      virtual
      onColumnWidth={() => {}}
    />,
  );
  const scroller = container.querySelector('[data-virtual]') as HTMLElement;
  const wrap = scroller.parentElement as HTMLElement;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Giá trị/ });
  const cover = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 203,
    maxScroll: 203,
    boxes: [
      [cover, 324, 454],
      [handle, 442, 451],
    ],
  });
  try {
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(187);
    expect(wrap.scrollLeft).toBe(0);
  } finally {
    restore();
  }
});

test('a keyboard step reveals the strip after the width commit', () => {
  function Controlled() {
    const [widths, setWidths] = useState<Record<string, number>>({});
    return (
      <Table
        columns={[
          { key: 'code', title: 'Mã đơn' },
          { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
        ]}
        data={rows}
        resizable
        columnWidths={widths}
        onColumnWidth={(key, width) => setWidths((prev) => ({ ...prev, [key]: width }))}
      />
    );
  }
  const { container } = render(<Controlled />);
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    // The step fires no focus (the span survives the re-render), so only the
    // post-commit reveal can uncover the strip the step slid under the cover;
    // the range clamp parks it flush at maxScroll.
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('a consumer that commits inside the callback still reveals', () => {
  function Controlled() {
    const [widths, setWidths] = useState<Record<string, number>>({});
    return (
      <Table
        columns={[
          { key: 'code', title: 'Mã đơn' },
          { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
        ]}
        data={rows}
        resizable
        columnWidths={widths}
        onColumnWidth={(key, width) =>
          flushSync(() => setWidths((prev) => ({ ...prev, [key]: width })))
        }
      />
    );
  }
  const { container } = render(<Controlled />);
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    // flushSync commits before the handler returns: the arm must be placed
    // before reporting or the consuming effect already ran without it (M1).
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('Delete reset arms the reveal too', () => {
  function Controlled() {
    const [widths, setWidths] = useState<Record<string, number>>({ total: 200 });
    return (
      <Table
        columns={[
          { key: 'code', title: 'Mã đơn' },
          { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
        ]}
        data={rows}
        resizable
        columnWidths={widths}
        onColumnWidth={() => {}}
        onColumnWidthReset={() => setWidths({})}
      />
    );
  }
  const { container } = render(<Controlled />);
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    // A reset narrows the track just like a step: the focused strip can end
    // up buried, so the same reveal must run (T3).
    fireEvent.keyDown(handle, { key: 'Delete' });
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('double-click reset arms the reveal too', () => {
  function Controlled() {
    const [widths, setWidths] = useState<Record<string, number>>({ total: 200 });
    return (
      <Table
        columns={[
          { key: 'code', title: 'Mã đơn' },
          { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
        ]}
        data={rows}
        resizable
        columnWidths={widths}
        onColumnWidth={() => {}}
        onColumnWidthReset={() => setWidths({})}
      />
    );
  }
  const { container } = render(<Controlled />);
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    fireEvent.doubleClick(handle);
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('an unadopted arm neither rides a later commit nor survives it', () => {
  const onColumnWidth = vi.fn();
  const visible = (widths: Record<string, number> | undefined, data: typeof rows) => (
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
      ]}
      data={data}
      resizable
      columnWidths={widths}
      onColumnWidth={onColumnWidth}
    />
  );
  const { container, rerender } = render(visible(undefined, rows));
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onColumnWidth).toHaveBeenCalled();
    // A fresh object carrying equal values is not an adoption: an inline
    // caller's unrelated re-render must stay quiet (M1).
    rerender(visible({}, rows));
    expect(scroller.scrollLeft).toBe(272);
    // And the consume-once arm is gone: even a later commit that changes the
    // widths (with no new interaction) must not ride the stale handle.
    rerender(visible({ code: 200 }, [...rows, { code: 'SO-2', total: '₫ 20M' }]));
    expect(scroller.scrollLeft).toBe(272);
  } finally {
    restore();
  }
});

test('a visible strip no-ops on focus and on reset', () => {
  function Controlled() {
    const [widths, setWidths] = useState<Record<string, number>>({ total: 200 });
    return (
      <Table
        columns={[
          { key: 'code', title: 'Mã đơn' },
          { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
        ]}
        data={rows}
        resizable
        columnWidths={widths}
        onColumnWidth={() => {}}
        onColumnWidthReset={() => setWidths({})}
      />
    );
  }
  const { container } = render(<Controlled />);
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 203,
    maxScroll: 679,
    boxes: [[handle, 442, 451]],
  });
  // The handle's own header cell is not a cover: give it real metrics so a
  // guard-less path would compute a scroll and fail the assertions below.
  const ownHeader = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  mockRect(ownHeader, 324, 451);
  try {
    // The center hit-tests to the strip itself: nothing to clear, and the
    // reset path must not scroll a visible strip either.
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(203);
    fireEvent.doubleClick(handle);
    expect(scroller.scrollLeft).toBe(203);
  } finally {
    restore();
  }
});

test('a mid-cluster hit unions pins on both sides of the band', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'note', title: 'Ghi chú', width: 33 },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 95 },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 99 },
        { key: 'region', title: 'Khu vực', pinned: 'right', width: 130 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const total = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const status = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  const region = screen.getByText('Khu vực').closest('[role="columnheader"]') as HTMLElement;
  // The handle's center lands under the middle pin; the band must union the
  // pins on BOTH sides of it: strip content right = 624 − 324 + 300 = 600,
  // trailing = 33 + 95 + 99 + 130 = 357 → content 957 = port 521 + 436.
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 300,
    maxScroll: 436,
    sticky: [total, status, region],
    boxes: [
      [region, 715, 845],
      [status, 616, 715],
      [total, 521, 616],
      [handle, 615, 624],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Rightward is port-blocked; leftward clears past the band's left edge
    // (521 + 4): 300 + 107 = 407. Missing the left pin would clear only 12
    // and park the strip [612,616] — under the pin it just left out.
    expect(scroller.scrollLeft).toBe(407);
  } finally {
    restore();
  }
});

test('a clear landing inside the opposite band is declined', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn', pinned: 'left', width: 240 },
        { key: 'total', title: 'Giá trị', align: 'right' },
        { key: 'note', title: 'Ghi chú', width: 53 },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 279 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Giá trị/ });
  const leftPin = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  const rightPin = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  // Port [0, 521]: left band [0, 240], right pin 2px later at [242, 521].
  // Strip content right 240 + 100 = 340; trailing = 53 + 279 = 332 → content
  // 672 = port 521 + 151.
  const restore = setupReveal({
    scroller,
    port: [0, 521],
    scrollLeft: 100,
    maxScroll: 151,
    sticky: [leftPin, rightPin],
    boxes: [
      [leftPin, 0, 240],
      [rightPin, 242, 521],
      [handle, 231, 240],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Rightward (+13) lands [244, 253] — inside the right pin; leftward needs
    // 244 with 51 in range and would end 13px past the left port edge. No
    // position can show the strip, so it must stay put.
    expect(scroller.scrollLeft).toBe(100);
    // Refocusing must not bounce it either.
    fireEvent.blur(handle);
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(100);
  } finally {
    restore();
  }
});

test('the smaller clamped move wins when both sides clear', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 40 },
        { key: 'note', title: 'Ghi chú', width: 611 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  // A 40px right pin still at its natural position [200, 240] (sl 26 < its
  // pin point): strip content right 223 + 26 = 249; trailing = 40 + 611 =
  // 651 → content 900 = port 800 + 100.
  const restore = setupReveal({
    scroller,
    port: [0, 800],
    scrollLeft: 26,
    maxScroll: 100,
    sticky: [cover],
    boxes: [
      [cover, 200, 240],
      [handle, 214, 223],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Both sides clear: rightward asks 30 but the range allows only 26
    // (flush), leftward asks 27 — the clamped 26 is smaller, so the pick is
    // rightward and the port lands at the very start. The unclamped tie
    // (30 vs 27) would have scrolled left instead.
    expect(scroller.scrollLeft).toBe(0);
  } finally {
    restore();
  }
});

test('a 1px seam between two sticky cells still merges the band', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'lead', title: 'Đầu', pinned: 'right', width: 140 },
        { key: 'tail', title: 'Đuôi', pinned: 'right', width: 59 },
        { key: 'note', title: 'Ghi chú', width: 496 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const lead = screen.getByText('Đầu').closest('[role="columnheader"]') as HTMLElement;
  const tail = screen.getByText('Đuôi').closest('[role="columnheader"]') as HTMLElement;
  // Two pins measured 1px apart — a fractional seam pixel. Strip content
  // right 205 + 200 = 405; trailing = 140 + 59 + 496 = 695 → content 1100 =
  // port 800 + 300.
  const restore = setupReveal({
    scroller,
    port: [0, 800],
    scrollLeft: 200,
    maxScroll: 300,
    sticky: [lead, tail],
    boxes: [
      [lead, 100, 240],
      [tail, 241, 300],
      [handle, 196, 205],
    ],
  });
  try {
    fireEvent.focus(handle);
    // The seam must bridge: the band is [100, 300], so the rightward clear
    // asks 300 + 4 − 196. Without the ±1 the tail would join `others` and
    // block the landing instead.
    expect(scroller.scrollLeft).toBe(92);
  } finally {
    restore();
  }
});

test('a 2px gap between two sticky cells leaves the band apart', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'lead', title: 'Đầu', pinned: 'right', width: 140 },
        { key: 'tail', title: 'Đuôi', pinned: 'right', width: 58 },
        { key: 'note', title: 'Ghi chú', width: 497 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const lead = screen.getByText('Đầu').closest('[role="columnheader"]') as HTMLElement;
  const tail = screen.getByText('Đuôi').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [0, 800],
    scrollLeft: 200,
    maxScroll: 300,
    sticky: [lead, tail],
    boxes: [
      [lead, 100, 240],
      [tail, 242, 300],
      [handle, 196, 205],
    ],
  });
  try {
    fireEvent.focus(handle);
    // A 2px gap is real: the rightward clear (+48) would park the strip at
    // [244, 253] — inside the tail pin — and `clears` rejects it there; the
    // leftward clear is out of range. No move.
    expect(scroller.scrollLeft).toBe(200);
  } finally {
    restore();
  }
});

test('unknown viewport metrics never veto a band clear', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn', pinned: 'left', width: 120 },
        { key: 'mid', title: 'Giữa', pinned: 'left', width: 120 },
        { key: 'total', title: 'Giá trị', align: 'right', width: 300 },
        { key: 'note', title: 'Ghi chú', width: 600 },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 145 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Giá trị/ });
  const outer = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  const inner = screen.getByText('Giữa').closest('[role="columnheader"]') as HTMLElement;
  const rightPin = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  // jsdom reports a zero port: the port checks are unknowable and must not
  // gate the band + range arithmetic away (same honest metrics as the
  // tiled scene: sum 1285 = 800 + 485, sl 431).
  const restore = setupReveal({
    scroller,
    port: [0, 0],
    scrollLeft: 431,
    maxScroll: 485,
    sticky: [outer, inner, rightPin],
    boxes: [
      [outer, 0, 120],
      [inner, 120, 240],
      [handle, 100, 109],
      [rightPin, 655, 800],
    ],
  });
  try {
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(287);
  } finally {
    restore();
  }
});

test('an unmeasured scroll range still clears against the band', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'lead', title: 'Đầu', pinned: 'left', width: 140 },
        { key: 'code', title: 'Mã đơn' },
        { key: 'note', title: 'Ghi chú', width: 520 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const lead = screen.getByText('Đầu').closest('[role="columnheader"]') as HTMLElement;
  // Degenerate metrics: scrollWidth === clientWidth (no range at all).
  // Strip content right 205 + trailing 520 = 725 ≤ the 800 port.
  const restore = setupReveal({
    scroller,
    port: [0, 800],
    scrollLeft: 0,
    maxScroll: 0,
    sticky: [lead],
    boxes: [
      [lead, 100, 240],
      [handle, 196, 205],
    ],
  });
  try {
    fireEvent.focus(handle);
    // No measured range must mean "no clamp", not "zero room": the leftward
    // clear (209 − 100) still lands with the full margin.
    expect(scroller.scrollLeft).toBe(109);
  } finally {
    restore();
  }
});

test('a destination inside the scrollbar gutter is declined', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 115 },
        { key: 'note', title: 'Ghi chú', width: 134 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  // The right pin measures 15px short of the port edge — real scrollbar
  // gutter. Strip content right 782 − 324 + 300 = 758; trailing = 115 + 134
  // = 249 → content 1007 = port 521 + 486.
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 300,
    maxScroll: 486,
    gutter: 15,
    boxes: [
      [cover, 715, 830],
      [handle, 773, 782],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Rightward (+61) lands the strip's edge at 843 — 13px into the gutter
    // stripe; leftward (71) is clean, so that must be the pick.
    expect(scroller.scrollLeft).toBe(371);
  } finally {
    restore();
  }
});

test('a same-key-set value change still reveals', () => {
  const onColumnWidth = vi.fn();
  const view = (widths: Record<string, number>) => (
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
      ]}
      data={rows}
      resizable
      columnWidths={widths}
      onColumnWidth={onColumnWidth}
    />
  );
  const { container, rerender } = render(view({ code: 100 }));
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    // The adoption keeps the key set and changes the value (live steps 6/8):
    // a key-count-only compare would suppress exactly this reveal.
    rerender(view({ code: 200 }));
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('an in-place-mutating updater still reveals', () => {
  function Controlled() {
    const [widths, setWidths] = useState<Record<string, number>>({});
    return (
      <Table
        columns={[
          { key: 'code', title: 'Mã đơn' },
          { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
        ]}
        data={rows}
        resizable
        columnWidths={widths}
        onColumnWidth={(key, width) =>
          setWidths((prev) => {
            prev[key] = width;
            return { ...prev };
          })
        }
      />
    );
  }
  const { container } = render(<Controlled />);
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    // The updater mutates the state object before copying it. An arm that
    // aliased `columnWidths` would see its own snapshot rewritten in place
    // and go quiet; the snapshot copy keeps the pre-step values.
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('a consumer that resets inside the callback still reveals', () => {
  function Controlled() {
    const [widths, setWidths] = useState<Record<string, number>>({ total: 200 });
    return (
      <Table
        columns={[
          { key: 'code', title: 'Mã đơn' },
          { key: 'total', title: 'Giá trị', pinned: 'right', width: 130 },
        ]}
        data={rows}
        resizable
        columnWidths={widths}
        onColumnWidth={() => {}}
        onColumnWidthReset={() => flushSync(() => setWidths({}))}
      />
    );
  }
  const { container } = render(<Controlled />);
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 339,
    boxes: [
      [cover, 715, 845],
      [handle, 773, 782],
    ],
  });
  try {
    // The reset twin of the flushSync step test: the reset path must arm
    // before calling out, or the synchronous commit consumes nothing.
    fireEvent.doubleClick(handle);
    expect(scroller.scrollLeft).toBe(339);
  } finally {
    restore();
  }
});

test('an exact tie prefers the rightward clear', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'total', title: 'Giá trị', pinned: 'right', width: 44 },
        { key: 'note', title: 'Ghi chú', width: 579.5 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Giá trị').closest('[role="columnheader"]') as HTMLElement;
  // A 44px pin straddled by a 9px strip at [217.5, 226.5]: both clears ask
  // exactly 30.5. Strip content right 276.5 + trailing 623.5 = 900 = 800 + 100.
  const restore = setupReveal({
    scroller,
    port: [0, 800],
    scrollLeft: 50,
    maxScroll: 100,
    sticky: [cover],
    boxes: [
      [cover, 200, 244],
      [handle, 217.5, 226.5],
    ],
  });
  try {
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(19.5);
  } finally {
    restore();
  }
});

test('a leftward clear into the opposite pin is declined', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'region', title: 'Khu vực', pinned: 'right', width: 110 },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 130 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  const other = screen.getByText('Khu vực').closest('[role="columnheader"]') as HTMLElement;
  // The left-side mirror of the F1 scene: strip buried under the right pin
  // [715, 845], the other pin floating at [600, 710] (5px gap). Strip content
  // right 782 − 324 + 272 = 730; trailing = 110 + 130 = 240 → content 970 =
  // port 521 + 449.
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 449,
    sticky: [cover, other],
    boxes: [
      [cover, 715, 845],
      [other, 600, 710],
      [handle, 773, 782],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Rightward is port-blocked; the leftward destination [702, 711] would
    // land inside the other pin, so clears() rejects it — no move, and
    // refocusing must not bounce it either.
    expect(scroller.scrollLeft).toBe(272);
    fireEvent.blur(handle);
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(272);
  } finally {
    restore();
  }
});

test('a flush leftward landing beside the other pin is kept', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn' },
        { key: 'region', title: 'Khu vực', pinned: 'right', width: 110 },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 130 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Mã đơn/ });
  const cover = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  const other = screen.getByText('Khu vực').closest('[role="columnheader"]') as HTMLElement;
  const restore = setupReveal({
    scroller,
    port: [324, 845],
    scrollLeft: 272,
    maxScroll: 449,
    sticky: [cover, other],
    boxes: [
      [cover, 715, 845],
      [other, 592, 702],
      [handle, 773, 782],
    ],
  });
  try {
    fireEvent.focus(handle);
    // The same scene with the other pin ending exactly at the destination's
    // left edge (702 == 702): touching is not overlapping — the leftward
    // clear lands with the full margin.
    expect(scroller.scrollLeft).toBe(343);
  } finally {
    restore();
  }
});

test('a leftward clear past the port edge is declined', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn', pinned: 'left', width: 458 },
        { key: 'total', title: 'Giá trị', align: 'right' },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 130 },
        { key: 'note', title: 'Ghi chú', width: 597 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Giá trị/ });
  const cover = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  const rightPin = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  // The live-F1 shape: a wide index pin [252, 710], the right pin [715, 845]
  // 5px later. Strip content right 707 − 252 + 203 = 658; trailing = 130 +
  // 597 = 727 → content 1385 = port 593 + 792.
  const restore = setupReveal({
    scroller,
    port: [252, 845],
    scrollLeft: 203,
    maxScroll: 792,
    sticky: [cover, rightPin],
    boxes: [
      [cover, 252, 710],
      [rightPin, 715, 845],
      [handle, 698, 707],
    ],
  });
  try {
    fireEvent.focus(handle);
    // Rightward lands [714, 723] inside the right pin (clears); leftward
    // clears the band but its destination [239, 248] sneaks past the port's
    // left edge — no position can show the strip, so it stays put.
    expect(scroller.scrollLeft).toBe(203);
    fireEvent.blur(handle);
    fireEvent.focus(handle);
    expect(scroller.scrollLeft).toBe(203);
  } finally {
    restore();
  }
});

test('a rightward landing flush with the next pin is kept', () => {
  const { container } = render(
    <Table
      columns={[
        { key: 'code', title: 'Mã đơn', pinned: 'left', width: 240 },
        { key: 'total', title: 'Giá trị', align: 'right' },
        { key: 'note', title: 'Ghi chú', width: 171 },
        { key: 'status', title: 'Trạng thái', pinned: 'right', width: 110 },
      ]}
      data={rows}
      resizable
      onColumnWidth={() => {}}
    />,
  );
  const scroller = (container.querySelector('[data-virtual]') as HTMLElement).parentElement!;
  const handle = screen.getByRole('separator', { name: /Đổi rộng cột Giá trị/ });
  const leftPin = screen.getByText('Mã đơn').closest('[role="columnheader"]') as HTMLElement;
  const other = screen.getByText('Trạng thái').closest('[role="columnheader"]') as HTMLElement;
  // The right-side equality boundary: strip under the left pin, the other
  // pin starting exactly at the destination's right edge (253). Strip
  // content right 240 + 100 = 340; trailing = 171 + 110 = 281 → content
  // 621 = port 521 + 100.
  const restore = setupReveal({
    scroller,
    port: [0, 521],
    scrollLeft: 100,
    maxScroll: 100,
    sticky: [leftPin, other],
    boxes: [
      [leftPin, 0, 240],
      [other, 253, 363],
      [handle, 231, 240],
    ],
  });
  try {
    fireEvent.focus(handle);
    // The rightward destination [244, 253] touches the other pin's left edge
    // without overlapping — accepted.
    expect(scroller.scrollLeft).toBe(87);
  } finally {
    restore();
  }
});
