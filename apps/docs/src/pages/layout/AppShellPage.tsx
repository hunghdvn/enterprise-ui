import { useState } from 'react';
import { AppShell, Button, Input, Tabs } from '@enterprise-ui/components';
import type { NavItem } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './AppShellPage.module.css';

const props: PropDoc[] = [
  {
    name: 'sidebar',
    type: 'NavItem[]',
    description:
      'Danh sách mục điều hướng; mỗi mục gồm key, label, icon (tùy chọn) và badge (tùy chọn).',
  },
  {
    name: 'sidebarEmptyState',
    type: 'ReactNode',
    description:
      'Nội dung hiển thị trong vùng điều hướng khi sidebar rỗng (vd: trạng thái không tìm thấy).',
  },
  {
    name: 'activeKey',
    type: 'string',
    description: 'Key của mục đang được chọn trong sidebar.',
  },
  {
    name: 'onNavigate',
    type: '(key: string) => void',
    description: 'Gọi khi người dùng bấm một mục trong sidebar.',
  },
  {
    name: 'breadcrumb',
    type: 'string',
    description: 'Chuỗi breadcrumb hiển thị ở bên trái header.',
  },
  {
    name: 'headerRight',
    type: 'ReactNode',
    description: 'Nội dung bên phải header — ô tìm kiếm, nút hành động, ...',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Nội dung vùng body bên dưới header.',
  },
];

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Tổng quan', icon: '▦' },
  { key: 'orders', label: 'Đơn hàng', icon: '▤', badge: 12 },
  { key: 'customers', label: 'Khách hàng', icon: '☺' },
  { key: 'reports', label: 'Báo cáo', icon: '▥' },
  { key: 'settings', label: 'Cài đặt', icon: '⚙' },
];

const code = `import { useState } from 'react';
import { AppShell } from '@enterprise-ui/components';
import type { NavItem } from '@enterprise-ui/components';

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Tổng quan', icon: '▦' },
  { key: 'orders', label: 'Đơn hàng', icon: '▤', badge: 12 },
  { key: 'customers', label: 'Khách hàng', icon: '☺' },
];

export function Admin() {
  const [active, setActive] = useState('dashboard');
  const current = navItems.find((item) => item.key === active) ?? navItems[0];

  return (
    <AppShell
      sidebar={navItems}
      activeKey={active}
      onNavigate={setActive}
      breadcrumb={'Trang chủ / ' + current.label}
      headerRight={<input placeholder="Tìm kiếm..." aria-label="Tìm kiếm" />}
    >
      <h2>{current.label}</h2>
    </AppShell>
  );
}`;

export default function AppShellPage() {
  const [active, setActive] = useState('dashboard');
  const [minimalActive, setMinimalActive] = useState('orders');
  const current = navItems.find((item) => item.key === active) ?? navItems[0];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>AppShell</h1>
      <p className={styles.subtitle}>
        Khung ứng dụng quản trị gồm sidebar điều hướng, breadcrumb, header và vùng nội dung.
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
                    <h2 className={styles.sectionTitle}>Shell đầy đủ</h2>
                    <div className={styles.frame}>
                      <AppShell
                        sidebar={navItems}
                        activeKey={active}
                        onNavigate={setActive}
                        breadcrumb={`Trang chủ / ${current.label}`}
                        headerRight={
                          <div className={styles.headerRight}>
                            <Input size="sm" placeholder="Tìm kiếm..." aria-label="Tìm kiếm" />
                            <Button variant="secondary" size="sm">
                              Thông báo
                            </Button>
                          </div>
                        }
                      >
                        <div className={styles.pageBody}>
                          <h3 className={styles.pageTitle}>{current.label}</h3>
                          <p className={styles.pageText}>
                            Nội dung của trang “{current.label}”. Bấm các mục ở sidebar để chuyển
                            trang.
                          </p>
                        </div>
                      </AppShell>
                    </div>
                    <p className={styles.note}>
                      Shell cao tối thiểu 100vh nên demo được đặt trong khung cao 340px và cắt phần
                      tràn để không phá bố cục trang tài liệu.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                      Tối giản (không breadcrumb, không headerRight)
                    </h2>
                    <div className={styles.frame}>
                      <AppShell
                        sidebar={navItems}
                        activeKey={minimalActive}
                        onNavigate={setMinimalActive}
                      >
                        <div className={styles.pageBody}>
                          <h3 className={styles.pageTitle}>Tổng quan</h3>
                          <p className={styles.pageText}>
                            Header vẫn được render khi thiếu breadcrumb và headerRight.
                          </p>
                        </div>
                      </AppShell>
                    </div>
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
