import { useState } from 'react';
import {
  AppShell,
  Button,
  ThemeProvider,
  ToastProvider,
  useTheme,
} from '@enterprise-ui/components';
import ListDemoPage from './pages/ListDemoPage';
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
        {density === 'compact' ? 'Thoáng' : 'Gọn'}
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
        { key: 'stock', label: 'Kho vận' },
        { key: 'tokens', label: 'Tokens' },
      ]}
      activeKey={key}
      onNavigate={setKey}
      breadcrumb={key === 'tokens' ? 'Tokens' : 'Đơn hàng bán'}
      headerRight={<HeaderRight />}
    >
      {key === 'tokens' ? <TokensPage /> : <ListDemoPage />}
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
