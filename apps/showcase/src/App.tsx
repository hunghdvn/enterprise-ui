import { useState, type ReactNode } from 'react';
import {
  AppShell,
  Button,
  ThemeProvider,
  ToastProvider,
  useTheme,
} from '@enterprise-ui/components';
import ListDemoPage from './pages/ListDemoPage';
import OrderDetailDemoPage from './pages/OrderDetailDemoPage';
import DashboardDemoPage from './pages/DashboardDemoPage';
import DataGridDemoPage from './pages/DataGridDemoPage';
import TokensPage from './pages/TokensPage';
import TabsDemoPage from './pages/TabsDemoPage';
import TooltipDemoPage from './pages/TooltipDemoPage';
import EmptyDemoPage from './pages/EmptyDemoPage';
import IconDemoPage from './pages/IconDemoPage';
import SpinDemoPage from './pages/SpinDemoPage';
import styles from './App.module.css';

function HeaderRight() {
  const { theme, density, setTheme, setDensity } = useTheme();
  return (
    <div className={styles.headerRight}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label={`Chuyển theme (hiện tại: ${theme})`}
      >
        {theme === 'light' ? 'Dark' : 'Light'}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setDensity(density === 'compact' ? 'comfortable' : 'compact')}
        aria-label={`Chuyển mật độ (hiện tại: ${density})`}
      >
        Mật độ: {density === 'compact' ? 'Gọn' : 'Thoáng'}
      </Button>
      <Button variant="primary" size="sm">
        Tạo đơn
      </Button>
    </div>
  );
}

function Shell() {
  const [key, setKey] = useState('orders');
  // One route map drives sidebar + breadcrumb + content together — adding a
  // page touches this map only, not three parallel switches.
  const routes: Record<
    string,
    { label: string; breadcrumb: string; badge?: number; el: ReactNode }
  > = {
    orders: { label: 'Đơn hàng', breadcrumb: 'Đơn hàng bán', badge: 12, el: <ListDemoPage /> },
    detail: { label: 'Chi tiết đơn', breadcrumb: 'Chi tiết đơn hàng', el: <OrderDetailDemoPage /> },
    dashboard: { label: 'Dashboard', breadcrumb: 'Dashboard', el: <DashboardDemoPage /> },
    stock: { label: 'Kho vận', breadcrumb: 'Đơn hàng bán', el: <ListDemoPage /> },
    datagrid: { label: 'DataGrid 10k', breadcrumb: 'DataGrid demo', el: <DataGridDemoPage /> },
    tokens: { label: 'Tokens', breadcrumb: 'Tokens', el: <TokensPage /> },
    tabs: { label: 'Tabs', breadcrumb: 'Primitives', el: <TabsDemoPage /> },
    tooltip: { label: 'Tooltip', breadcrumb: 'Primitives', el: <TooltipDemoPage /> },
    empty: { label: 'Empty', breadcrumb: 'Primitives', el: <EmptyDemoPage /> },
    icon: { label: 'Icon', breadcrumb: 'Primitives', el: <IconDemoPage /> },
    spin: { label: 'Spin', breadcrumb: 'Primitives', el: <SpinDemoPage /> },
  };
  const current = routes[key] ?? routes.orders;
  return (
    <AppShell
      sidebar={Object.entries(routes).map(([routeKey, r]) => ({
        key: routeKey,
        label: r.label,
        badge: r.badge,
      }))}
      activeKey={key}
      onNavigate={setKey}
      breadcrumb={current.breadcrumb}
      headerRight={<HeaderRight />}
    >
      {current.el}
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Shell />
      </ToastProvider>
    </ThemeProvider>
  );
}
