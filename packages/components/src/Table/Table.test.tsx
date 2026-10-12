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
  expect(onToggleGroup).toHaveBeenCalledWith('open');
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
      collapsedGroups={['open']}
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

test('export downloads default csv when no onExport', () => {
  const { restore } = stubObjectURL();
  try {
    render(<Table columns={cols} data={[{ code: 'SO-1' }]} exportable exportFileName="d.csv" />);
    fireEvent.click(screen.getByRole('button', { name: /Xuất CSV/ }));
    expect(URL.createObjectURL).toHaveBeenCalled();
  } finally {
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
