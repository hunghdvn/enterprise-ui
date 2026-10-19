import { useState } from 'react';
import { Button, PageHeader, SplitView, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './SplitViewPage.module.css';

const props: PropDoc[] = [
  {
    name: 'master',
    type: 'ReactNode',
    description: 'Pane danh sách bên trái (thường là FilterBar + Table).',
  },
  {
    name: 'detail',
    type: 'ReactNode',
    description: 'Pane chi tiết bên phải (thường là PageHeader + các khối nội dung).',
  },
  {
    name: 'selectedKey',
    type: 'string | null',
    description: 'null = chưa chọn gì; trên mobile pane master được hiển thị một mình.',
  },
  {
    name: 'onBack',
    type: '() => void',
    description: 'Điều hướng quay lại trên mobile — component gọi khi bấm nút ở mobile bar.',
  },
  {
    name: 'masterWidth',
    type: 'number',
    default: '380',
    description: 'Chiều rộng pane master (px) trên desktop (trục ngang).',
  },
  {
    name: 'masterHeight',
    type: 'number',
    default: '280',
    description: 'Chiều cao pane master (px) khi orientation="vertical".',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Trục bố cục; "vertical" xếp master trên, kéo thay đổi chiều cao.',
  },
  {
    name: 'resizable',
    type: 'boolean',
    default: 'true',
    description:
      'Hiện/ẩn tay cầm kéo. false = khoá: pane render đúng size truyền vào (min/max không áp).',
  },
  {
    name: 'minSize',
    type: 'number',
    default: '280',
    description:
      'Giới hạn nhỏ nhất (px) của master khi pane resizable (kéo/phím). resizable={false} render đúng size truyền vào.',
  },
  {
    name: 'maxSize',
    type: 'number',
    default: '0.8 × track',
    description:
      'Giới hạn lớn nhất (px) của master khi pane resizable. Mặc định tính từ 80% chiều rộng/cao khung.',
  },
  {
    name: 'onMasterWidthChange',
    type: '(size: number) => void',
    description:
      'Báo size mới khi kéo/phím trục ngang; cũng báo đúng một lần khi clamp (min/max/track) phải sửa giá trị đang truyền vào (controlled).',
  },
  {
    name: 'onMasterHeightChange',
    type: '(size: number) => void',
    description:
      'Báo size mới khi kéo/phím trục dọc; cũng báo đúng một lần khi clamp phải sửa giá trị đang truyền vào (controlled).',
  },
  {
    name: 'backLabel',
    type: 'string',
    default: "'Quay lại'",
    description: 'Nhãn của nút quay lại trên mobile.',
  },
];

interface Order {
  id: string;
  name: string;
  customer: string;
  status: string;
  amount: string;
}

const orders: Order[] = [
  {
    id: 'ord-1042',
    name: 'Đơn hàng #1042',
    customer: 'Công ty Minh Phát',
    status: 'Đang xử lý',
    amount: '12.400.000 ₫',
  },
  {
    id: 'ord-1041',
    name: 'Đơn hàng #1041',
    customer: 'Nhà máy Đông Á',
    status: 'Hoàn thành',
    amount: '8.150.000 ₫',
  },
  {
    id: 'ord-1040',
    name: 'Đơn hàng #1040',
    customer: 'Siêu thị An Khang',
    status: 'Chờ duyệt',
    amount: '3.780.000 ₫',
  },
  {
    id: 'ord-1039',
    name: 'Đơn hàng #1039',
    customer: 'Công ty Hòa Bình',
    status: 'Hoàn thành',
    amount: '21.050.000 ₫',
  },
  {
    id: 'ord-1038',
    name: 'Đơn hàng #1038',
    customer: 'Cửa hàng Phúc Lộc',
    status: 'Đã hủy',
    amount: '950.000 ₫',
  },
  {
    id: 'ord-1037',
    name: 'Đơn hàng #1037',
    customer: 'Công ty Trường Thịnh',
    status: 'Đang xử lý',
    amount: '15.600.000 ₫',
  },
  {
    id: 'ord-1036',
    name: 'Đơn hàng #1036',
    customer: 'Đại lý Sài Gòn',
    status: 'Chờ duyệt',
    amount: '4.320.000 ₫',
  },
  {
    id: 'ord-1035',
    name: 'Đơn hàng #1035',
    customer: 'Nhà máy Bình Minh',
    status: 'Hoàn thành',
    amount: '9.870.000 ₫',
  },
];

const code = `import { useState } from 'react';
import { SplitView } from '@enterprise-ui/components';

export function Orders() {
  const [selected, setSelected] = useState<string | null>(null);
  const [width, setWidth] = useState(320);

  return (
    <SplitView
      masterWidth={width}
      minSize={280}
      maxSize={720}
      onMasterWidthChange={setWidth}
      selectedKey={selected}
      onBack={() => setSelected(null)}
      backLabel="Về danh sách"
      master={<OrderList onSelect={setSelected} />}
      detail={<OrderDetail id={selected} />}
    />
  );
}`;

function OrderDetail({ order }: { order: Order | null }) {
  if (!order) {
    return <p className={styles.placeholder}>Chọn một đơn hàng ở cột bên trái để xem chi tiết.</p>;
  }
  return (
    <div className={styles.detailBody}>
      <PageHeader
        title={order.name}
        subtitle={order.customer}
        actions={
          <Button variant="secondary" size="sm">
            Xuất PDF
          </Button>
        }
      />
      <dl className={styles.fields}>
        <div className={styles.field}>
          <dt>Mã đơn</dt>
          <dd>{order.id}</dd>
        </div>
        <div className={styles.field}>
          <dt>Trạng thái</dt>
          <dd>{order.status}</dd>
        </div>
        <div className={styles.field}>
          <dt>Số tiền</dt>
          <dd>{order.amount}</dd>
        </div>
      </dl>
    </div>
  );
}

function OrderList({
  items = orders,
  selected,
  onSelect,
}: {
  items?: Order[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className={styles.list}>
      {items.map((order) => (
        <button
          key={order.id}
          type="button"
          className={styles.listItem}
          data-active={order.id === selected}
          aria-current={order.id === selected ? 'true' : undefined}
          onClick={() => onSelect(order.id)}
        >
          <span className={styles.listName}>{order.name}</span>
          <span className={styles.listMeta}>{order.customer}</span>
        </button>
      ))}
    </div>
  );
}

export default function SplitViewPage() {
  const [selected, setSelected] = useState<string | null>(orders[0].id);
  const [staticSelected, setStaticSelected] = useState<string | null>('all');
  const [masterWidth, setMasterWidth] = useState(320);
  const [masterHeight, setMasterHeight] = useState(160);
  const selectedOrder = orders.find((order) => order.id === selected) ?? null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>SplitView</h1>
      <p className={styles.subtitle}>
        Bố cục master–detail hai pane trên desktop, tự chuyển thành một pane kèm nút quay lại trên
        mobile.
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
                    <h2 className={styles.sectionTitle}>Danh sách + chi tiết</h2>
                    <div className={styles.frame}>
                      <SplitView
                        masterWidth={masterWidth}
                        onMasterWidthChange={setMasterWidth}
                        selectedKey={selected}
                        onBack={() => setSelected(null)}
                        master={<OrderList selected={selected} onSelect={setSelected} />}
                        detail={<OrderDetail order={selectedOrder} />}
                      />
                    </div>
                    <p className={styles.note}>
                      Kéo tay cầm để thay đổi chiều rộng master (hiện tại {masterWidth}px). Hai pane
                      cuộn độc lập trong khung; thu hẹp xuống dưới 768px để thấy chế độ một pane.
                    </p>
                    <p className={styles.note}>
                      Bàn phím (focus tay cầm): ← → tăng/giảm 8px, Shift + ← → ±32px, Delete đặt lại
                      về mặc định; trên trục dọc dùng ↑ ↓.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trục dọc (orientation=vertical)</h2>
                    <div className={styles.frame}>
                      <SplitView
                        orientation="vertical"
                        masterHeight={masterHeight}
                        minSize={120}
                        onMasterHeightChange={setMasterHeight}
                        selectedKey={selected}
                        onBack={() => setSelected(null)}
                        master={
                          <OrderList
                            items={orders.slice(0, 3)}
                            selected={selected}
                            onSelect={setSelected}
                          />
                        }
                        detail={<OrderDetail order={selectedOrder} />}
                      />
                    </div>
                    <p className={styles.note}>
                      orientation=vertical — master trên; kéo lên/xuống để thay đổi chiều cao master
                      (hiện tại {masterHeight}px).
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Khoá kích thước (resizable={false})</h2>
                    <div className={styles.frame}>
                      <SplitView
                        masterWidth={320}
                        resizable={false}
                        selectedKey={selected}
                        onBack={() => setSelected(null)}
                        master={<OrderList selected={selected} onSelect={setSelected} />}
                        detail={<OrderDetail order={selectedOrder} />}
                      />
                    </div>
                    <p className={styles.note}>
                      resizable={false} — không tay cầm, master giữ 320px.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Chiều rộng master tùy chỉnh</h2>
                    <div className={styles.frame}>
                      <SplitView
                        masterWidth={200}
                        minSize={120}
                        selectedKey={staticSelected}
                        onBack={() => setStaticSelected(null)}
                        master={
                          <div className={styles.staticList}>
                            <span>Tất cả đơn hàng</span>
                            <span>Đang xử lý</span>
                            <span>Chờ duyệt</span>
                            <span>Hoàn thành</span>
                          </div>
                        }
                        detail={
                          <p className={styles.placeholder}>
                            Pane chi tiết chiếm phần chiều rộng còn lại.
                          </p>
                        }
                      />
                    </div>
                    <p className={styles.note}>
                      masterWidth=200 (minSize=120) — pane master hẹp hơn mặc định, phù hợp danh mục
                      ngắn.
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
