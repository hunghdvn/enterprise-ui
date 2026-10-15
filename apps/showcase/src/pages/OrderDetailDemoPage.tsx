import { useState } from 'react';
import {
  applySorts,
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
import { ORDERS, RECENT_ORDERS, toneFor } from '../demo-data/orders';
import styles from './OrderDetailDemoPage.module.css';

export default function OrderDetailDemoPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [sorts, setSorts] = useState<SortEntry[]>([{ key: 'code', dir: 'desc' }]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filtered = RECENT_ORDERS.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return r.code.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q);
  });
  const sorted = applySorts(filtered, sorts);

  const selected = ORDERS.find((r) => r.code === selectedKey) ?? null;

  return (
    <div className={styles.page}>
      <SplitView
        selectedKey={selectedKey}
        onBack={() => setSelectedKey(null)}
        master={
          <div className={styles.masterCol}>
            <FilterBar searchValue={search} onSearch={setSearch} onReset={() => setSearch('')} />
            <Table
              columns={[
                { key: 'code', title: 'Mã đơn', sortable: true },
                { key: 'customer', title: 'Khách hàng' },
                { key: 'total', title: 'Giá trị', align: 'right' as const },
              ]}
              data={sorted}
              sorts={sorts}
              onSort={setSorts}
              rowKey={(r) => r.code}
              selectedKeys={selectedKey ? [selectedKey] : []}
              onSelect={(keys) => setSelectedKey(keys[keys.length - 1] ?? null)}
              renderCard={(row) => (
                <div className={styles.miniCard}>
                  <strong>{String(row['code'])}</strong>
                  <span>{String(row['customer'])}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedKey(String(row['code']))}
                  >
                    Xem
                  </Button>
                </div>
              )}
              status={sorted.length === 0 ? 'empty' : 'idle'}
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
