import { useState } from 'react';
import {
  Badge,
  Button,
  Field,
  FilterBar,
  Input,
  PageHeader,
  SplitView,
  Table,
  useToast,
  type SortEntry,
} from '@enterprise-ui/components';
import styles from './OrderDetailDemoPage.module.css';

type Order = {
  code: string;
  customer: string;
  total: string;
  status: 'Chờ duyệt' | 'Đang giao' | 'Hoàn thành';
};

const ORDERS: Order[] = [
  { code: 'SO-10482', customer: 'Cty An Phát', total: '₫ 245M', status: 'Chờ duyệt' },
  { code: 'SO-10481', customer: 'Cty Minh Đức', total: '₫ 89M', status: 'Đang giao' },
  { code: 'SO-10480', customer: 'Cty Hòa Bình', total: '₫ 132M', status: 'Hoàn thành' },
  { code: 'SO-10479', customer: 'Cty Sao Mai', total: '₫ 57M', status: 'Chờ duyệt' },
];

function toneFor(status: Order['status']): 'orange' | 'blue' | 'green' {
  if (status === 'Chờ duyệt') return 'orange';
  if (status === 'Đang giao') return 'blue';
  return 'green';
}

export default function OrderDetailDemoPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [sorts, setSorts] = useState<SortEntry[]>([{ key: 'code', dir: 'desc' }]);
  const [selectedKey, setSelectedKey] = useState<string | null>('SO-10482');

  const filtered = ORDERS.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return r.code.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q);
  });

  const selected = ORDERS.find((r) => r.code === selectedKey) ?? null;

  return (
    <div className={styles.page}>
      <SplitView
        selectedKey={selectedKey}
        onBack={() => setSelectedKey(null)}
        master={
          <div className={styles.masterCol}>
            <FilterBar searchValue={search} onSearch={setSearch} onReset={() => setSearch('')} />
            <Table<Order>
              columns={[
                { key: 'code', title: 'Mã đơn', sortable: true },
                { key: 'customer', title: 'Khách hàng' },
                { key: 'total', title: 'Giá trị', align: 'right' as const },
              ]}
              data={filtered}
              sorts={sorts}
              onSort={setSorts}
              rowKey={(r) => r.code}
              selectedKeys={selectedKey ? [selectedKey] : []}
              onSelect={(keys) => setSelectedKey(keys[keys.length - 1] ?? null)}
              status={filtered.length === 0 ? 'empty' : 'idle'}
            />
          </div>
        }
        detail={
          selected ? (
            <div className={styles.detailCol}>
              <PageHeader
                title={selected.code}
                subtitle={selected.customer}
                actions={
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => toast.success(`Đã duyệt ${selected.code} (demo)`)}
                  >
                    Duyệt đơn
                  </Button>
                }
              />
              <div className={styles.statusRow}>
                <Badge tone={toneFor(selected.status)}>{selected.status}</Badge>
                <span className={styles.total}>{selected.total}</span>
              </div>
              <div className={styles.formGrid}>
                <Field label="Mã đơn">
                  <Input value={selected.code} onChange={() => {}} readOnly />
                </Field>
                <Field label="Khách hàng">
                  <Input value={selected.customer} onChange={() => {}} readOnly />
                </Field>
                <Field label="Giá trị">
                  <Input value={selected.total} onChange={() => {}} readOnly />
                </Field>
                <Field label="Trạng thái">
                  <Input value={selected.status} onChange={() => {}} readOnly />
                </Field>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>Chọn một đơn hàng để xem chi tiết</div>
          )
        }
      />
    </div>
  );
}
