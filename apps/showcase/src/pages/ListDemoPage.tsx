import { useState } from 'react';
import { Badge, Button, FilterBar, Pagination, Table, useToast } from '@enterprise-ui/components';
import type { SortEntry } from '@enterprise-ui/components';
import styles from './ListDemoPage.module.css';

type Order = {
  code: string;
  customer: string;
  total: string;
  status: 'Chờ duyệt' | 'Đang giao' | 'Hoàn thành';
};

const ALL: Order[] = [
  { code: 'SO-10482', customer: 'Cty An Phát', total: '₫ 245M', status: 'Chờ duyệt' },
  { code: 'SO-10481', customer: 'Cty Minh Đức', total: '₫ 89M', status: 'Đang giao' },
  { code: 'SO-10480', customer: 'Cty Hòa Bình', total: '₫ 132M', status: 'Hoàn thành' },
  { code: 'SO-10479', customer: 'Cty Sao Mai', total: '₫ 57M', status: 'Chờ duyệt' },
  { code: 'SO-10478', customer: 'Cty Trường Hải', total: '₫ 310M', status: 'Đang giao' },
  { code: 'SO-10477', customer: 'Cty Việt Tiến', total: '₫ 76M', status: 'Hoàn thành' },
  { code: 'SO-10476', customer: 'Cty Nam Sơn', total: '₫ 198M', status: 'Chờ duyệt' },
  { code: 'SO-10475', customer: 'Cty Đại Nam', total: '₫ 64M', status: 'Đang giao' },
];

function toneFor(status: Order['status']): 'orange' | 'blue' | 'green' {
  if (status === 'Chờ duyệt') return 'orange';
  if (status === 'Đang giao') return 'blue';
  return 'green';
}

const PAGE_SIZE = 5;

export default function ListDemoPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sorts, setSorts] = useState<SortEntry[]>([{ key: 'code', dir: 'desc' }]);

  const filtered = ALL.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return r.code.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    for (const { key, dir } of sorts) {
      const cmp = String(a[key as keyof Order]).localeCompare(String(b[key as keyof Order]));
      if (cmp !== 0) return dir === 'asc' ? cmp : -cmp;
    }
    return 0;
  });

  const total = sorted.length;
  const start = (page - 1) * PAGE_SIZE;
  const data = sorted.slice(start, start + PAGE_SIZE);

  const columns = [
    { key: 'code', title: 'Mã đơn', sortable: true },
    { key: 'customer', title: 'Khách hàng' },
    { key: 'total', title: 'Giá trị', align: 'right' as const },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (row: Order) => <Badge tone={toneFor(row.status)}>{row.status}</Badge>,
    },
  ];

  const handleSort = (next: SortEntry[]) => {
    setSorts(next);
  };

  const handleReset = () => {
    setSearch('');
    setPage(1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>Đơn hàng bán</h2>
          <p className={styles.subtitle}>
            P1 List demo — chỉ dùng ThemeProvider, AppShell, Table, FilterBar, Pagination, Button,
            Badge, Toast.
          </p>
        </div>
        <Button variant="primary" onClick={() => toast.success('Tạo đơn thành công (demo)')}>
          Tạo đơn
        </Button>
      </div>
      <FilterBar
        searchValue={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onReset={handleReset}
      />
      <Table<Order>
        columns={columns}
        data={data}
        sorts={sorts}
        onSort={handleSort}
        status={data.length === 0 ? 'empty' : 'idle'}
        summary={`${total} đơn · trang ${page}`}
      />
      <div className={styles.pager}>
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} />
      </div>
    </div>
  );
}
