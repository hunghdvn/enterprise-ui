import { fireEvent, render, screen } from '@testing-library/react';
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
