import { fireEvent, render, screen, within } from '@testing-library/react';
import { Table } from './Table';

const cols = [
  { key: 'code', title: 'Mã đơn', sortable: true },
  { key: 'total', title: 'Giá trị', align: 'right' as const },
];

test('sorts, selects, shows empty and error', () => {
  const onSort = vi.fn();
  const { rerender } = render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
      sortKey="code"
      sortDir="asc"
      onSort={onSort}
    />,
  );
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenCalled();
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
      sortKey="code"
      sortDir="asc"
      onSort={() => {}}
    />,
  );
  expect(screen.getByRole('grid')).toBeInTheDocument();
  const cell = screen.getByText('Mã đơn').closest('[role="columnheader"]');
  expect(cell).toHaveAttribute('aria-sort', 'ascending');
  expect(cell?.querySelector('button')).not.toBeNull();
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
