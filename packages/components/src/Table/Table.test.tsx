import { act, fireEvent, render, screen, within } from '@testing-library/react';
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
