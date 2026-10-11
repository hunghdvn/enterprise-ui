import type { ReactNode } from 'react';

export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  badge?: number;
}

export interface AppShellProps {
  sidebar: NavItem[];
  activeKey: string;
  onNavigate: (key: string) => void;
  headerRight?: ReactNode;
  breadcrumb?: string;
  children: ReactNode;
}
