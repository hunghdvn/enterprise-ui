import styles from './AppShell.module.css';
import type { AppShellProps } from './types';

export function AppShell({
  sidebar,
  activeKey,
  onNavigate,
  headerRight,
  breadcrumb,
  children,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Primary">
        <div className={styles.brand}>
          <span className={styles.logo}>E</span> Enterprise
        </div>
        <nav>
          {sidebar.map((i) => (
            <button
              key={i.key}
              data-active={i.key === activeKey}
              className={styles.nav}
              onClick={() => onNavigate(i.key)}
            >
              <span className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  {i.icon ?? '▦'}
                </span>{' '}
                <span>{i.label}</span>
              </span>
              {typeof i.badge === 'number' && <span className={styles.count}>{i.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <span>{breadcrumb}</span>
          <span className={styles.spacer} />
          {headerRight}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
