import { useMemo, useState } from 'react';
import { applySorts, Badge, Table } from '@enterprise-ui/components';
import type { Column, SortEntry } from '@enterprise-ui/components';
import styles from './demos.module.css';

interface Order {
  code: string;
  customer: string;
  status: 'open' | 'shipping' | 'done';
  total: number;
}

const STATUS_LABEL: Record<Order['status'], string> = {
  open: 'Chờ duyệt',
  shipping: 'Đang giao',
  done: 'Hoàn thành',
};

const STATUS_TONE: Record<Order['status'], 'orange' | 'blue' | 'green'> = {
  open: 'orange',
  shipping: 'blue',
  done: 'green',
};

const ORDERS: Order[] = [
  { code: 'SO-1024', customer: 'Cty An Phát', status: 'done', total: 12_500_000 },
  { code: 'SO-1025', customer: 'Cty Minh Đức', status: 'shipping', total: 4_200_000 },
  { code: 'SO-1026', customer: 'Cty Hoà Bình', status: 'open', total: 8_750_000 },
  { code: 'SO-1027', customer: 'Cty Sao Mai', status: 'done', total: 2_300_000 },
  { code: 'SO-1028', customer: 'Cty Đông Á', status: 'shipping', total: 15_000_000 },
];

const columns: Column<Order>[] = [
  { key: 'code', title: 'Mã đơn', width: 100, sortable: true },
  { key: 'customer', title: 'Khách hàng', width: 150, sortable: true },
  {
    key: 'status',
    title: 'Trạng thái',
    width: 120,
    render: (row) => <Badge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
  },
  {
    key: 'total',
    title: 'Giá trị',
    width: 120,
    align: 'right',
    sortable: true,
    render: (row) => `₫ ${row.total.toLocaleString('vi-VN')}`,
  },
];

export function TableDemo() {
  const [sorts, setSorts] = useState<SortEntry[]>([]);
  const [selected, setSelected] = useState<string[]>(['SO-1025']);

  const rows = useMemo(() => applySorts(ORDERS, sorts), [sorts]);

  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <p className={styles.helper}>
          Bấm tiêu đề cột để sắp xếp. Giữ Shift/Ctrl để sắp xếp nhiều cấp.
        </p>
        <span className={styles.helper}>
          Đã chọn: <strong>{selected.length}</strong>
        </span>
      </div>
      <div className={styles.tableWrap}>
        <Table
          columns={columns}
          data={rows}
          rowKey={(row) => row.code}
          sorts={sorts}
          onSort={setSorts}
          selectedKeys={selected}
          onSelect={setSelected}
        />
      </div>
    </div>
  );
}
