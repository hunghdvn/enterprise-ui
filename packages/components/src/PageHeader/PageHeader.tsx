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
  level = 2,
}: PageHeaderProps) {
  const Title: 'h1' | 'h2' = level === 1 ? 'h1' : 'h2';
  return (
    <div className={`${styles.header} ${className}`}>
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} aria-label={backLabel || 'Quay lại'}>
          ‹ {backLabel}
        </Button>
      )}
      <div className={styles.titles}>
        <Title className={styles.title}>{title}</Title>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
