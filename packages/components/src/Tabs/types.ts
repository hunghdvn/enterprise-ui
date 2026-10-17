import type { ReactNode } from 'react';
export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}
export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}
