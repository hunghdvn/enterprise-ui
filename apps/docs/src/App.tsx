import { useState, useEffect, useMemo, type ReactNode } from 'react';
import {
  AppShell,
  Button,
  ThemeProvider,
  ToastProvider,
  useTheme,
  Input,
} from '@enterprise-ui/components';
import type { NavItem } from '@enterprise-ui/components';
import ButtonPage from './pages/primitives/ButtonPage';
import InputPage from './pages/primitives/InputPage';
import SelectPage from './pages/primitives/SelectPage';
import CheckboxPage from './pages/primitives/CheckboxPage';
import BadgePage from './pages/primitives/BadgePage';
import TabsPage from './pages/primitives/TabsPage';
import TooltipPage from './pages/primitives/TooltipPage';
import EmptyPage from './pages/primitives/EmptyPage';
import SpinPage from './pages/primitives/SpinPage';
import AppShellPage from './pages/layout/AppShellPage';
import PageHeaderPage from './pages/layout/PageHeaderPage';
import SplitViewPage from './pages/layout/SplitViewPage';
import PaginationPage from './pages/layout/PaginationPage';
import TablePage from './pages/data/TablePage';
import FilterBarPage from './pages/data/FilterBarPage';
import KpiCardPage from './pages/data/KpiCardPage';
import KpiGridPage from './pages/data/KpiGridPage';
import ModalPage from './pages/feedback/ModalPage';
import DrawerPage from './pages/feedback/DrawerPage';
import ToastPage from './pages/feedback/ToastPage';
import FormPage from './pages/form/FormPage';
import TokensPage from './pages/tokens/TokensPage';
import styles from './App.module.css';

function HeaderRight({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const { theme, density, setTheme, setDensity } = useTheme();
  return (
    <div className={styles.headerRight}>
      <Input
        size="sm"
        placeholder="Tìm kiếm..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Tìm kiếm"
      />
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
    </div>
  );
}

const ROUTES: Record<string, { label: string; el: ReactNode }> = {
  overview: { label: 'Tổng quan', el: <div>Overview</div> },
  primitives: { label: 'Primitives', el: <div>Primitives</div> },
  button: { label: 'Button', el: <ButtonPage /> },
  input: { label: 'Input', el: <InputPage /> },
  select: { label: 'Select', el: <SelectPage /> },
  checkbox: { label: 'Checkbox', el: <CheckboxPage /> },
  badge: { label: 'Badge', el: <BadgePage /> },
  tabs: { label: 'Tabs', el: <TabsPage /> },
  tooltip: { label: 'Tooltip', el: <TooltipPage /> },
  empty: { label: 'Empty', el: <EmptyPage /> },
  spin: { label: 'Spin', el: <SpinPage /> },
  layout: { label: 'Layout', el: <div>Layout</div> },
  appshell: { label: 'AppShell', el: <AppShellPage /> },
  pageheader: { label: 'PageHeader', el: <PageHeaderPage /> },
  splitview: { label: 'SplitView', el: <SplitViewPage /> },
  pagination: { label: 'Pagination', el: <PaginationPage /> },
  data: { label: 'Data', el: <div>Data</div> },
  table: { label: 'Table', el: <TablePage /> },
  filterbar: { label: 'FilterBar', el: <FilterBarPage /> },
  kpicard: { label: 'KpiCard', el: <KpiCardPage /> },
  kpigrid: { label: 'KpiGrid', el: <KpiGridPage /> },
  feedback: { label: 'Feedback', el: <div>Feedback</div> },
  modal: { label: 'Modal', el: <ModalPage /> },
  drawer: { label: 'Drawer', el: <DrawerPage /> },
  toast: { label: 'Toast', el: <ToastPage /> },
  form: { label: 'Form', el: <FormPage /> },
  tokens: { label: 'Tokens', el: <TokensPage /> },
};

function Shell() {
  const [key, setKey] = useState('overview');
  const [query, setQuery] = useState('');
  const current = ROUTES[key] ?? ROUTES.overview;
  const q = query.trim().toLowerCase();
  const sidebar: NavItem[] = useMemo(
    () =>
      Object.entries(ROUTES)
        .filter(([, r]) => r.label.toLowerCase().includes(q))
        .map(([routeKey, r]) => ({ key: routeKey, label: r.label })),
    [q],
  );

  // Long pages must not stay mid-scroll when navigating to another route.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);

  return (
    <AppShell
      sidebar={sidebar}
      activeKey={key}
      onNavigate={setKey}
      breadcrumb={current.label}
      headerRight={<HeaderRight query={query} onQueryChange={setQuery} />}
      sidebarEmptyState={q ? 'Không tìm thấy' : undefined}
    >
      <div className={styles.page} key={key}>
        {current.el}
      </div>
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
