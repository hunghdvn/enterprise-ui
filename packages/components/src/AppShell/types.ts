import type { ReactNode } from 'react';

export interface NavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: number;
}

export interface AppShellProps {
  sidebar: NavItem[];
  activeKey: string;
  onNavigate: (key: string) => void;
  headerRight?: ReactNode;
  breadcrumb?: string;
  /** Rendered inside the sidebar when `sidebar` is empty (e.g. search with no matches). */
  sidebarEmptyState?: ReactNode;
  /** Controlled collapsed state. When provided, the component is controlled. */
  sidebarCollapsed?: boolean;
  /** Initial collapsed state for uncontrolled mode (also reads localStorage `eui-sidebar-collapsed`). */
  defaultSidebarCollapsed?: boolean;
  /** Called when the user toggles the sidebar. */
  onSidebarToggle?: (collapsed: boolean) => void;
  children: ReactNode;
}
