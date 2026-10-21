import { useState } from 'react';
import { NotificationCenter, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import type { Notification } from '@enterprise-ui/components';
import styles from './NotificationCenterPage.module.css';

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Đơn SO-10482 chờ duyệt',
    body: 'Cần phê duyệt trước 17:00',
    time: '2 phút trước',
    unread: true,
    kind: 'warning',
  },
  {
    id: 'n2',
    title: 'Khách hàng An Phát đã thanh toán',
    time: '1 giờ trước',
    unread: true,
    kind: 'success',
  },
  { id: 'n3', title: 'Báo cáo tháng 10 sẵn sàng', time: 'Hôm qua', unread: false, kind: 'info' },
];

const props: PropDoc[] = [
  {
    name: 'notifications',
    type: 'Notification[]',
    description: 'Danh sách thông báo { id, title, body?, time, unread?, kind? }.',
  },
  {
    name: 'onMarkRead',
    type: '(id: string) => void',
    description: 'Gọi khi đánh dấu một thông báo đã đọc.',
  },
  {
    name: 'onMarkAllRead',
    type: '() => void',
    description: 'Tuỳ chọn — hiện nút “Đánh dấu đã đọc tất cả” khi có unread.',
  },
  {
    name: 'onRemove',
    type: '(id: string) => void',
    description: 'Tuỳ chọn — hiện nút × trên từng thông báo.',
  },
  {
    name: 'onSelect',
    type: '(id: string) => void',
    description: 'Tuỳ chọn — hiện nút mở trên từng thông báo.',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Kích thước bell trigger.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Vô hiệu hoá toàn bộ.' },
  { name: 'aria-label', type: 'string', description: 'Nhãn a11y cho bell (mặc định “Thông báo”).' },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Tuỳ chọn — icon thay cho kind-icon trên từng thông báo.',
  },
];

const code = `import { useState } from 'react';
import { NotificationCenter } from '@enterprise-ui/components';
import type { Notification } from '@enterprise-ui/components';

export function Alerts() {
  const [list, setList] = useState<Notification[]>([
    { id: 'n1', title: 'Đơn mới cần duyệt', time: 'vừa xong', unread: true, kind: 'warning' },
  ]);

  return (
    <NotificationCenter
      notifications={list}
      onMarkRead={(id) =>
        setList(list.map((n) => (n.id === id ? { ...n, unread: false } : n)))
      }
      onMarkAllRead={() => setList(list.map((n) => ({ ...n, unread: false })))}
      onRemove={(id) => setList(list.filter((n) => n.id !== id))}
      onSelect={(id) => console.log('open', id)}
    />
  );
}`;

export default function NotificationCenterPage() {
  const [list, setList] = useState<Notification[]>(initialNotifications);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Notification Center</h1>
      <p className={styles.subtitle}>
        Chuông thông báo + panel dropdown: danh sách, đánh dấu đã đọc, xoá từng mục.
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
                    <h2 className={styles.sectionTitle}>Thông báo</h2>
                    <NotificationCenter
                      notifications={list}
                      onMarkRead={(id) =>
                        setList(list.map((n) => (n.id === id ? { ...n, unread: false } : n)))
                      }
                      onMarkAllRead={() => setList(list.map((n) => ({ ...n, unread: false })))}
                      onRemove={(id) => setList(list.filter((n) => n.id !== id))}
                      onSelect={(id) => console.log('open', id)}
                    />
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hoá</h2>
                    <NotificationCenter notifications={[]} onMarkRead={() => {}} disabled />
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
