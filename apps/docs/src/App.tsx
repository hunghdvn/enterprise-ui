import { useState, useEffect, useMemo, type ReactNode } from 'react';
import {
  AppShell,
  Button,
  ThemeProvider,
  ToastProvider,
  useTheme,
  Input,
  Icon,
} from '@enterprise-ui/components';
import type { IconName, NavItem } from '@enterprise-ui/components';
import ButtonPage from './pages/primitives/ButtonPage';
import InputPage from './pages/primitives/InputPage';
import SelectPage from './pages/primitives/SelectPage';
import ComboboxPage from './pages/primitives/ComboboxPage';
import CheckboxPage from './pages/primitives/CheckboxPage';
import BadgePage from './pages/primitives/BadgePage';
import TabsPage from './pages/primitives/TabsPage';
import TooltipPage from './pages/primitives/TooltipPage';
import EmptyPage from './pages/primitives/EmptyPage';
import IconPage from './pages/primitives/IconPage';
import SpinPage from './pages/primitives/SpinPage';
import AppShellPage from './pages/layout/AppShellPage';
import PageHeaderPage from './pages/layout/PageHeaderPage';
import SplitViewPage from './pages/layout/SplitViewPage';
import PaginationPage from './pages/layout/PaginationPage';
import TablePage from './pages/data/TablePage';
import FilterBarPage from './pages/data/FilterBarPage';
import KpiCardPage from './pages/data/KpiCardPage';
import KpiGridPage from './pages/data/KpiGridPage';
import StepsPage from './pages/data/StepsPage';
import SavedViewsPage from './pages/data/SavedViewsPage';
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

const ROUTES: Record<string, { label: string; el: ReactNode; icon: IconName }> = {
  overview: { label: 'Tổng quan', icon: 'home', el: <div>Overview</div> },
  primitives: { label: 'Primitives', icon: 'copy', el: <div>Primitives</div> },
  button: { label: 'Button', icon: 'plus', el: <ButtonPage /> },
  input: { label: 'Input', icon: 'edit', el: <InputPage /> },
  select: { label: 'Select', icon: 'chevron-down', el: <SelectPage /> },
  combobox: { label: 'Combobox', icon: 'search', el: <ComboboxPage /> },
  checkbox: { label: 'Checkbox', icon: 'check-circle', el: <CheckboxPage /> },
  badge: { label: 'Badge', icon: 'alert-circle', el: <BadgePage /> },
  tabs: { label: 'Tabs', icon: 'menu', el: <TabsPage /> },
  tooltip: { label: 'Tooltip', icon: 'help-circle', el: <TooltipPage /> },
  empty: { label: 'Empty', icon: 'inbox', el: <EmptyPage /> },
  icon: { label: 'Icon', icon: 'eye', el: <IconPage /> },
  spin: { label: 'Spin', icon: 'refresh', el: <SpinPage /> },
  layout: { label: 'Layout', icon: 'more-horizontal', el: <div>Layout</div> },
  appshell: { label: 'AppShell', icon: 'settings', el: <AppShellPage /> },
  pageheader: { label: 'PageHeader', icon: 'arrow-left', el: <PageHeaderPage /> },
  splitview: { label: 'SplitView', icon: 'arrow-right', el: <SplitViewPage /> },
  pagination: { label: 'Pagination', icon: 'chevron-right', el: <PaginationPage /> },
  data: { label: 'Data', icon: 'filter', el: <div>Data</div> },
  table: { label: 'Table', icon: 'download', el: <TablePage /> },
  filterbar: { label: 'FilterBar', icon: 'search', el: <FilterBarPage /> },
  kpicard: { label: 'KpiCard', icon: 'check', el: <KpiCardPage /> },
  kpigrid: { label: 'KpiGrid', icon: 'calendar', el: <KpiGridPage /> },
  steps: { label: 'Steps', icon: 'arrow-right', el: <StepsPage /> },
  savedviews: { label: 'SavedViews', icon: 'check', el: <SavedViewsPage /> },
  feedback: { label: 'Feedback', icon: 'bell', el: <div>Feedback</div> },
  modal: { label: 'Modal', icon: 'external-link', el: <ModalPage /> },
  drawer: { label: 'Drawer', icon: 'minus', el: <DrawerPage /> },
  toast: { label: 'Toast', icon: 'mail', el: <ToastPage /> },
  form: { label: 'Form', icon: 'trash', el: <FormPage /> },
  tokens: { label: 'Tokens', icon: 'lock', el: <TokensPage /> },
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
        .map(([routeKey, r]) => ({
          key: routeKey,
          label: r.label,
          icon: <Icon name={r.icon} size={16} />,
        })),
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
