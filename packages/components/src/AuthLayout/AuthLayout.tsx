import { isPresent } from '../internal/isPresent';
import styles from './AuthLayout.module.css';
import type { AuthLayoutProps } from './types';

export function AuthLayout({
  brand,
  title,
  subtitle,
  children,
  footer,
  aside,
  asideLabel,
  level = 1,
  className = '',
}: AuthLayoutProps) {
  const Title: 'h1' | 'h2' = level === 1 ? 'h1' : 'h2';
  const hasAside = isPresent(aside);

  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      data-layout={hasAside ? 'split' : 'single'}
    >
      {hasAside && (
        <aside className={styles.aside} aria-label={asideLabel}>
          {aside}
        </aside>
      )}
      <main className={styles.main}>
        <div className={styles.card}>
          {isPresent(brand) && <div className={styles.brand}>{brand}</div>}
          <div className={styles.header}>
            <Title className={styles.title}>{title}</Title>
            {isPresent(subtitle) && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <div className={styles.body}>{children}</div>
          {isPresent(footer) && <div className={styles.footer}>{footer}</div>}
        </div>
      </main>
    </div>
  );
}
