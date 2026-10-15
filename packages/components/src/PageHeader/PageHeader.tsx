import { Button } from '../Button/Button';
import styles from './PageHeader.module.css';
import type { PageHeaderProps } from './types';

export function PageHeader({
  title,
  subtitle,
  actions,
  onBack,
  backLabel = 'Quay lại',
  className = '',
}: PageHeaderProps & { className?: string }) {
  return (
    <div className={`${styles.header} ${className}`}>
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} aria-label={backLabel}>
          ‹ {backLabel}
        </Button>
      )}
      <div className={styles.titles}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
