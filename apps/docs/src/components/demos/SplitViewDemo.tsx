import { useState, useSyncExternalStore } from 'react';
import { Button, PageHeader, SplitView } from '@enterprise-ui/components';
import styles from './demos.module.css';
import splitStyles from './SplitViewDemo.module.css';

interface Order {
  id: string;
  name: string;
  customer: string;
  status: string;
  amount: string;
}

const subscribeNoop = () => () => {};

const ORDERS: Order[] = [
  {
    id: 'SO-1042',
    name: 'Đơn hàng SO-1042',
    customer: 'Công ty Minh Phát',
    status: 'Đang xử lý',
    amount: '12.400.000 ₫',
  },
  {
    id: 'SO-1041',
    name: 'Đơn hàng SO-1041',
    customer: 'Nhà máy Đông Á',
    status: 'Hoàn thành',
    amount: '8.150.000 ₫',
  },
  {
    id: 'SO-1040',
    name: 'Đơn hàng SO-1040',
    customer: 'Siêu thị An Khang',
    status: 'Chờ duyệt',
    amount: '3.780.000 ₫',
  },
  {
    id: 'SO-1039',
    name: 'Đơn hàng SO-1039',
    customer: 'Công ty Hoà Bình',
    status: 'Hoàn thành',
    amount: '21.050.000 ₫',
  },
  {
    id: 'SO-1038',
    name: 'Đơn hàng SO-1038',
    customer: 'Cửa hàng Phúc Lộc',
    status: 'Đã huỷ',
    amount: '950.000 ₫',
  },
];

function OrderList({
  items,
  selected,
  onSelect,
}: {
  items: Order[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className={splitStyles.list}>
      {items.map((order) => (
        <button
          key={order.id}
          type="button"
          className={splitStyles.listItem}
          data-active={order.id === selected}
          aria-current={order.id === selected ? 'true' : undefined}
          onClick={() => onSelect(order.id)}
        >
          <span className={splitStyles.listName}>{order.name}</span>
          <span className={splitStyles.listMeta}>
            {order.customer} · {order.amount}
          </span>
        </button>
      ))}
    </div>
  );
}

function OrderDetail({ order }: { order: Order | null }) {
  if (!order) {
    return (
      <p className={splitStyles.placeholder}>Chọn một đơn hàng ở cột bên trái để xem chi tiết.</p>
    );
  }

  return (
    <div className={splitStyles.detailBody}>
      <PageHeader
        title={order.name}
        subtitle={`${order.customer} · ${order.id}`}
        actions={
          <Button variant="secondary" size="sm">
            Xuất PDF
          </Button>
        }
      />
      <dl className={splitStyles.fields}>
        <div>
          <dt>Trạng thái</dt>
          <dd>{order.status}</dd>
        </div>
        <div>
          <dt>Khách hàng</dt>
          <dd>{order.customer}</dd>
        </div>
        <div>
          <dt>Số tiền</dt>
          <dd>{order.amount}</dd>
        </div>
      </dl>
    </div>
  );
}

export function SplitViewDemo() {
  // SplitView đọc matchMedia đồng bộ khi render (mobile layout), nên render nó
  // ở client sau khi hydrate để HTML server và lần hydrate đầu khớp nhau.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [selected, setSelected] = useState<string | null>(ORDERS[0].id);
  const [width, setWidth] = useState(260);
  const [height, setHeight] = useState(150);
  const [locked, setLocked] = useState(false);

  const selectedOrder = ORDERS.find((order) => order.id === selected) ?? null;

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <div className={styles.toolbar}>
          <h4 className={styles.sectionTitle}>Danh sách + chi tiết</h4>
          <Button
            className={splitStyles.lockButton}
            variant="secondary"
            size="sm"
            onClick={() => setLocked((value) => !value)}
          >
            {locked ? 'Cho phép kéo' : 'Khoá kích thước'}
          </Button>
        </div>
        <div className={splitStyles.frame}>
          {mounted ? (
            <SplitView
              masterWidth={width}
              minSize={200}
              maxSize={420}
              onMasterWidthChange={setWidth}
              resizable={!locked}
              selectedKey={selected}
              onBack={() => setSelected(null)}
              backLabel="Về danh sách"
              master={<OrderList items={ORDERS} selected={selected} onSelect={setSelected} />}
              detail={<OrderDetail order={selectedOrder} />}
            />
          ) : (
            <p className={splitStyles.loading}>Đang tải demo…</p>
          )}
        </div>
        <p className={styles.helper}>
          Ở desktop, chiều rộng pane master là <strong>{width}px</strong>.{' '}
          {locked
            ? 'Pane đang khoá: không có tay cầm, kích thước giữ nguyên.'
            : 'Kéo tay cầm hoặc focus tay cầm rồi dùng phím mũi tên; Delete đặt lại kích thước mặc định.'}
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Trục dọc (orientation=&quot;vertical&quot;)</h4>
        <div className={`${splitStyles.frame} ${splitStyles.frameVertical}`}>
          {mounted ? (
            <SplitView
              orientation="vertical"
              masterHeight={height}
              minSize={100}
              maxSize={220}
              onMasterHeightChange={setHeight}
              selectedKey={selected}
              onBack={() => setSelected(null)}
              backLabel="Về danh sách"
              master={
                <OrderList items={ORDERS.slice(0, 3)} selected={selected} onSelect={setSelected} />
              }
              detail={<OrderDetail order={selectedOrder} />}
            />
          ) : (
            <p className={splitStyles.loading}>Đang tải demo…</p>
          )}
        </div>
        <p className={styles.helper}>
          Ở desktop, master nằm trên với chiều cao <strong>{height}px</strong>. Trên mobile cả hai
          trục đều chuyển thành một pane kèm nút quay lại.
        </p>
      </section>
    </div>
  );
}
