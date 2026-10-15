import { useState } from 'react';
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
  return (
    <AppShell
      sidebar={[
        { key: 'orders', label: 'Đơn hàng', badge: 12 },
        { key: 'detail', label: 'Chi tiết đơn' },
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'stock', label: 'Kho vận' },
        { key: 'datagrid', label: 'DataGrid 10k' },
        { key: 'tokens', label: 'Tokens' },
      ]}
      activeKey={key}
      onNavigate={setKey}
      breadcrumb={
        key === 'tokens'
          ? 'Tokens'
          : key === 'datagrid'
            ? 'DataGrid demo'
            : key === 'detail'
              ? 'Chi tiết đơn hàng'
              : key === 'dashboard'
                ? 'Dashboard'
                : 'Đơn hàng bán'
      }
      headerRight={<HeaderRight />}
    >
      {key === 'tokens' ? (
        <TokensPage />
      ) : key === 'datagrid' ? (
        <DataGridDemoPage />
      ) : key === 'detail' ? (
        <OrderDetailDemoPage />
      ) : key === 'dashboard' ? (
        <DashboardDemoPage />
      ) : (
        <ListDemoPage />
      )}
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
