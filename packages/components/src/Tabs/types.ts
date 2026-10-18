import type { ReactNode } from 'react';
export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}
export type TabsVariant = 'line' | 'segmented' | 'pills' | 'enclosed';
export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  size?: 'sm' | 'md';
  /** Tab list presentation style; defaults to 'line'. */
  variant?: TabsVariant;
  className?: string;
}
