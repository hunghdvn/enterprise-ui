import { useState } from 'react';
import { AppShell, Button, Icon, Input } from '@enterprise-ui/components';
import type { NavItem } from '@enterprise-ui/components';
import styles from './demos.module.css';
import shellStyles from './AppShellDemo.module.css';

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Tổng quan', icon: <Icon name="home" size={16} /> },
  { key: 'orders', label: 'Đơn hàng', icon: <Icon name="inbox" size={16} />, badge: 12 },
  { key: 'customers', label: 'Khách hàng', icon: <Icon name="users" size={16} /> },
  { key: 'reports', label: 'Báo cáo', icon: <Icon name="chart-column" size={16} /> },
  { key: 'settings', label: 'Cài đặt', icon: <Icon name="settings" size={16} /> },
];

export function AppShellDemo() {
  const [activeKey, setActiveKey] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarEmpty, setSidebarEmpty] = useState(false);

  const current = NAV_ITEMS.find((item) => item.key === activeKey) ?? NAV_ITEMS[0];
  const sidebar = sidebarEmpty ? [] : NAV_ITEMS;

  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <Button variant="secondary" size="sm" onClick={() => setSidebarEmpty((value) => !value)}>
          {sidebarEmpty ? 'Hiện lại menu' : 'Mô phỏng sidebar rỗng'}
        </Button>
        <span className={styles.helper}>
          Trang hiện tại: <strong>{current.label}</strong> · sidebar{' '}
          {collapsed ? 'thu gọn' : 'mở rộng'}
        </span>
      </div>

      <div className={shellStyles.frame}>
        <AppShell
          sidebar={sidebar}
          activeKey={activeKey}
          onNavigate={setActiveKey}
          sidebarCollapsed={collapsed}
          onSidebarToggle={setCollapsed}
          breadcrumb={`Trang chủ / ${current.label}`}
          headerRight={
            <div className={shellStyles.headerRight}>
              <Input
                className={shellStyles.search}
                size="sm"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
              />
              <Button
                variant="secondary"
                size="sm"
                aria-label="Thông báo"
                icon={<Icon name="bell" size={16} />}
              />
            </div>
          }
          sidebarEmptyState="Không có mục"
        >
          <div className={shellStyles.pageBody}>
            <h3 className={shellStyles.pageTitle}>{current.label}</h3>
            <p className={shellStyles.pageText}>
              Bấm các mục ở sidebar để chuyển trang. Nút ở góc trên sidebar thu gọn hoặc mở rộng
              thanh điều hướng.
            </p>
          </div>
        </AppShell>
      </div>

      <p className={styles.note}>
        <span>
          Demo dùng <code>sidebarCollapsed</code> controlled để thao tác không ghi vào{' '}
          <code>localStorage</code> của trang tài liệu. Shell cao tối thiểu <code>100vh</code> nên
          được đặt trong khung 380px và cắt phần tràn.
        </span>
      </p>
    </div>
  );
}
