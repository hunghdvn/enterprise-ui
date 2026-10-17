import { useState } from 'react';
import { Badge, Table, Tabs, applySorts } from '@enterprise-ui/components';
import type { Column, SortEntry } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './TablePage.module.css';

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

const formatVnd = (value: number): string => `₫ ${value.toLocaleString('vi-VN')}`;

const ORDERS: Order[] = [
  { code: 'SO-1024', customer: 'Cty An Phát', status: 'done', total: 12_500_000 },
  { code: 'SO-1025', customer: 'Cty Minh Đức', status: 'shipping', total: 4_200_000 },
  { code: 'SO-1026', customer: 'Cty Hòa Bình', status: 'open', total: 8_750_000 },
  { code: 'SO-1027', customer: 'Cty Sao Mai', status: 'done', total: 2_300_000 },
  { code: 'SO-1028', customer: 'Cty Đông Á', status: 'shipping', total: 15_000_000 },
  { code: 'SO-1029', customer: 'Cty Nam Sơn', status: 'open', total: 6_100_000 },
  { code: 'SO-1030', customer: 'Cty Trường Hải', status: 'done', total: 950_000 },
  { code: 'SO-1031', customer: 'Cty Việt Tiến', status: 'shipping', total: 21_400_000 },
];

const columns: Column<Order>[] = [
  { key: 'code', title: 'Mã đơn', width: 120, sortable: true },
  { key: 'customer', title: 'Khách hàng', width: 180 },
  {
    key: 'status',
    title: 'Trạng thái',
    width: 130,
    render: (row) => <Badge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Badge>,
  },
  {
    key: 'total',
    title: 'Giá trị',
    width: 140,
    align: 'right',
    sortable: true,
    render: (row) => formatVnd(row.total),
  },
];

const columnTitle = (key: string): string =>
  columns.find((column) => column.key === key)?.title ?? key;

const props: PropDoc[] = [
  {
    name: 'columns',
    type: 'Column<T>[]',
    description:
      'Định nghĩa cột: key, title, align, sortable, render, width, pinned… kèm các trường filter tuỳ chọn.',
  },
  {
    name: 'data',
    type: 'T[]',
    description:
      'Các dòng của trang hiện tại. Table thuần trình bày — không tự lọc, sắp xếp hay cắt dữ liệu.',
  },
  {
    name: 'rowKey',
    type: '(row: T) => string',
    description: 'Khoá ổn định cho mỗi dòng; mặc định lấy key/code/id rồi mới tới chỉ số dòng.',
  },
  {
    name: 'sorts',
    type: 'SortEntry[]',
    default: '[]',
    description:
      'Quy tắc sắp xếp hiện tại (ưu tiên theo thứ tự); caller tự áp dụng qua applySorts rồi truyền data.',
  },
  {
    name: 'onSort',
    type: '(next: SortEntry[]) => void',
    description:
      'Nhận toàn bộ mảng sắp xếp mới khi bấm tiêu đề cột; Shift/Ctrl+Click để sắp xếp đa cấp.',
  },
  {
    name: 'selectedKeys',
    type: 'string[]',
    description:
      'Các dòng đang chọn (controlled); truyền cùng onSelect để hiện cột checkbox chọn dòng.',
  },
  {
    name: 'onSelect',
    type: '(keys: string[]) => void',
    description: 'Nhận toàn bộ lựa chọn mới — lựa chọn ở trang khác được giữ nguyên.',
  },
  {
    name: 'status',
    type: "'idle' | 'loading' | 'empty' | 'error'",
    default: "'idle'",
    description: 'Trạng thái hiển thị của bảng (rỗng, đang tải, lỗi kèm nút Thử lại).',
  },
  {
    name: 'pagination',
    type: 'TablePagination',
    description:
      'Bật footer bar: { page, pageSize, total, onPage }. Pagination tự kẹp trang ngoài khoảng và báo lại.',
  },
  {
    name: 'summary',
    type: 'ReactNode',
    description:
      'Dòng tổng kết; khi có pagination/exportable thì nằm ở footer bar thay vì trong lưới.',
  },
  {
    name: 'virtual',
    type: 'boolean',
    default: 'false',
    description: 'Cửa sổ hoá cố định — chỉ render các dòng quanh vùng nhìn cho tập dữ liệu lớn.',
  },
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Gọi khi bấm “Thử lại” ở status="error".',
  },
];

const code = `import { useState } from 'react';
import { Table, applySorts } from '@enterprise-ui/components';
import type { Column, SortEntry } from '@enterprise-ui/components';

type Order = { code: string; customer: string; total: number };

const columns: Column<Order>[] = [
  { key: 'code', title: 'Mã đơn', sortable: true },
  { key: 'customer', title: 'Khách hàng' },
  { key: 'total', title: 'Giá trị', align: 'right', sortable: true },
];

export function OrdersTable() {
  const [sorts, setSorts] = useState<SortEntry[]>([{ key: 'code', dir: 'asc' }]);
  // ORDERS là dữ liệu mẫu (như demo trực tiếp) — thay bằng dữ liệu của bạn.
  const [orders] = useState(ORDERS);

  return (
    <Table
      columns={columns}
      data={applySorts(orders, sorts)}
      rowKey={(row) => row.code}
      sorts={sorts}
      onSort={setSorts}
    />
  );
}`;

export default function TablePage() {
  const [sorts, setSorts] = useState<SortEntry[]>([{ key: 'code', dir: 'asc' }]);
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['SO-1026']);
  const pageSize = 3;
  const pageRows = ORDERS.slice((page - 1) * pageSize, page * pageSize);
  const sortLabel =
    sorts.length === 0
      ? 'hiện chưa sắp xếp'
      : `đang sắp xếp theo ${sorts
          .map(
            (entry) => `${columnTitle(entry.key)} ${entry.dir === 'asc' ? 'tăng dần' : 'giảm dần'}`,
          )
          .join(', ')}`;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Table</h1>
      <p className={styles.subtitle}>
        Bảng dữ liệu controlled: sắp xếp, phân trang, chọn dòng và các trạng thái rỗng / đang tải.
      </p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Cơ bản</h2>
                    <Table columns={columns} data={ORDERS} />
                    <p className={styles.helper}>
                      8 dòng. Dữ liệu vào qua <code>data</code>, cột định nghĩa qua{' '}
                      <code>columns</code>; mỗi dòng đã có trường <code>code</code> nên Table tự
                      dùng làm khoá dòng.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Sắp xếp</h2>
                    <Table
                      columns={columns}
                      data={applySorts(ORDERS, sorts)}
                      sorts={sorts}
                      onSort={setSorts}
                    />
                    <p className={styles.helper}>
                      Bấm tiêu đề cột để đổi chiều (không sắp xếp → tăng → giảm → bỏ); {sortLabel}.
                      Table không tự sắp xếp — trang này gọi <code>applySorts</code> trên{' '}
                      <code>data</code> rồi truyền kết quả xuống.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Phân trang</h2>
                    <Table
                      columns={columns}
                      data={pageRows}
                      pagination={{ page, pageSize, total: ORDERS.length, onPage: setPage }}
                      summary={`Trang ${page} / ${Math.ceil(ORDERS.length / pageSize)}`}
                    />
                    <p className={styles.helper}>
                      pageSize 3. Caller tự cắt <code>data</code> theo trang hiện tại;{' '}
                      <code>pagination</code> chỉ vẽ footer và báo trang mới qua <code>onPage</code>
                      .
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Chọn dòng</h2>
                    <Table
                      columns={columns}
                      data={ORDERS}
                      rowKey={(row) => row.code}
                      selectedKeys={selectedKeys}
                      onSelect={setSelectedKeys}
                    />
                    <p className={styles.helper}>
                      Đã chọn {selectedKeys.length} / {ORDERS.length}:{' '}
                      {selectedKeys.join(', ') || '—'}. Lựa chọn là state của caller — Table chỉ báo
                      lên qua <code>onSelect</code>.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trạng thái rỗng</h2>
                    <Table columns={columns} data={[]} status="empty" />
                    <p className={styles.helper}>
                      status=&apos;empty&apos; — hiển thị “Không có dữ liệu” thay cho phần thân
                      bảng.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Đang tải</h2>
                    <Table columns={columns} data={[]} status="loading" />
                    <p className={styles.helper}>
                      status=&apos;loading&apos; — hiển thị “Đang tải…” kèm aria-busy.
                    </p>
                  </section>
                </div>
              </DemoPlayground>
            ),
          },
          { key: 'props', label: 'Props', content: <PropsTable props={props} /> },
          { key: 'code', label: 'Code', content: <CodeBlock code={code} /> },
        ]}
      />
    </div>
  );
}
