import { useState, type ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './AppShell.module.css';
import type { AppShellProps } from './types';

function isPresent(value: ReactNode): boolean {
  return value != null && value !== false && value !== '' && value !== 0;
}

export function AppShell({
  sidebar,
  activeKey,
  onNavigate,
  headerRight,
  breadcrumb,
  sidebarEmptyState,
  sidebarCollapsed,
  defaultSidebarCollapsed,
  onSidebarToggle,
  children,
}: AppShellProps) {
  const isControlled = sidebarCollapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    if (sidebarCollapsed !== undefined) return sidebarCollapsed;
    if (defaultSidebarCollapsed !== undefined) return defaultSidebarCollapsed;
    try {
      return localStorage.getItem('eui-sidebar-collapsed') === '1';
    } catch {
      return false;
    }
  });
  const collapsed = isControlled ? (sidebarCollapsed as boolean) : internalCollapsed;

  const toggle = () => {
    const next = !collapsed;
    if (!isControlled) {
      setInternalCollapsed(next);
      try {
        localStorage.setItem('eui-sidebar-collapsed', next ? '1' : '0');
      } catch {
        // ignore (private mode / quota)
      }
    }
    onSidebarToggle?.(next);
  };

  return (
    <div className={styles.shell} data-collapsed={collapsed ? 'true' : 'false'}>
      <aside className={styles.sidebar} aria-label="Primary">
        <div className={styles.brand}>
          <span className={styles.logo}>E</span>{' '}
          <span className={styles.brandText}>Enterprise</span>
          <button
            type="button"
            className={styles.toggle}
            onClick={toggle}
            aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            aria-expanded={!collapsed}
          >
            <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={16} />
          </button>
        </div>
        <nav>
          {sidebar.length === 0 && sidebarEmptyState ? (
            // A <div>, not a <p>: sidebarEmptyState is a ReactNode and block
            // content (e.g. <Empty/>) would trip validateDOMNesting inside a p.
            <div className={styles.navEmpty}>{sidebarEmptyState}</div>
          ) : (
            sidebar.map((i) => (
              <button
                key={i.key}
                data-active={i.key === activeKey}
                aria-current={i.key === activeKey ? 'page' : undefined}
                title={i.label}
                className={styles.nav}
                onClick={() => onNavigate(i.key)}
              >
                <span className={styles.item}>
                  <span className={styles.icon} aria-hidden="true">
                    {isPresent(i.icon) ? i.icon : <Icon name="inbox" size={16} />}
                  </span>{' '}
                  <span>{i.label}</span>
                </span>
                {typeof i.badge === 'number' && <span className={styles.count}>{i.badge}</span>}
              </button>
            ))
          )}
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          {breadcrumb ? <span>{breadcrumb}</span> : null}
          <span className={styles.spacer} />
          {headerRight}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
