import { useState } from 'react';
import { NotificationCenter } from '@enterprise-ui/components';
import type { Notification } from '@enterprise-ui/components';
import styles from './demos.module.css';

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Đơn SO-10482 chờ duyệt',
    body: 'Cần phê duyệt trước 17:00 hôm nay',
    time: '2 phút trước',
    unread: true,
    kind: 'warning',
  },
  {
    id: 'n2',
    title: 'Khách hàng An Phát đã thanh toán',
    body: 'Chuyển khoản 12.400.000 ₫',
    time: '1 giờ trước',
    unread: true,
    kind: 'success',
  },
  {
    id: 'n3',
    title: 'Báo cáo tháng 10 sẵn sàng',
    time: 'Hôm qua',
    kind: 'info',
  },
  {
    id: 'n4',
    title: 'Đồng bộ tồn kho thất bại',
    body: '3 SKU cần xử lý thủ công',
    time: 'Hôm qua',
    kind: 'danger',
  },
];

export function NotificationCenterDemo() {
  const [items, setItems] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [opened, setOpened] = useState<string | null>(null);

  const markRead = (id: string) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, unread: false } : item)));
  const markAllRead = () => setItems((list) => list.map((item) => ({ ...item, unread: false })));
  const remove = (id: string) => setItems((list) => list.filter((item) => item.id !== id));
  const select = (id: string) => {
    setOpened(items.find((item) => item.id === id)?.title ?? null);
  };

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chuông thông báo</h4>
        <NotificationCenter
          notifications={items}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onRemove={remove}
          onSelect={select}
        />
        <p className={styles.helper}>
          Bấm chuông để mở panel. Nút ✓ đánh dấu một mục đã đọc, nút → gọi <code>onSelect</code>,
          nút × xoá mục. {opened ? `Đang mở: ${opened}.` : 'Chưa chọn thông báo nào.'}
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kích thước</h4>
        <div className={styles.row}>
          <NotificationCenter notifications={items} onMarkRead={markRead} size="sm" />
          <NotificationCenter notifications={items} onMarkRead={markRead} size="md" />
        </div>
        <p className={styles.helper}>
          <code>sm</code> (mặc định) và <code>md</code> chỉ đổi kích thước nút chuông; panel và
          badge giữ nguyên.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Trống và vô hiệu hoá</h4>
        <div className={styles.row}>
          <NotificationCenter notifications={[]} onMarkRead={() => {}} />
          <NotificationCenter notifications={items} onMarkRead={() => {}} disabled />
        </div>
        <p className={styles.helper}>
          Danh sách rỗng hiện “Không có thông báo”. Khi <code>disabled</code>, chuông không mở panel
          và không nhận focus.
        </p>
      </section>
    </div>
  );
}
