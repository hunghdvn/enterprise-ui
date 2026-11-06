import { isPresent } from '../internal/isPresent';
import { cx } from '../internal/cx';
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
  as = 'main',
  fill = true,
  className = '',
}: AuthLayoutProps) {
  const Title: 'h1' | 'h2' = level === 1 ? 'h1' : 'h2';
  const Landmark = as;
  const hasAside = isPresent(aside);

  return (
    <div
      className={cx(styles.root, className)}
      data-layout={hasAside ? 'split' : 'single'}
      data-fill={fill ? 'true' : 'false'}
    >
      <div className={styles.layout}>
        {hasAside && (
          <aside className={styles.aside} aria-label={asideLabel}>
            {aside}
          </aside>
        )}
        <Landmark className={styles.main}>
          <div className={styles.card}>
            {isPresent(brand) && <div className={styles.brand}>{brand}</div>}
            <div className={styles.header}>
              <Title className={styles.title}>{title}</Title>
              {isPresent(subtitle) && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            <div className={styles.body}>{children}</div>
            {isPresent(footer) && <div className={styles.footer}>{footer}</div>}
          </div>
        </Landmark>
      </div>
    </div>
  );
}
