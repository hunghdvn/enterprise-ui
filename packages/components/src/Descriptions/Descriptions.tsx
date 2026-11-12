import type { CSSProperties } from 'react';
import { cx } from '../internal/cx';
import styles from './Descriptions.module.css';
import type { DescriptionsProps } from './types';

export function Descriptions({
  items,
  columns = 2,
  layout = 'horizontal',
  bordered = false,
  size = 'md',
  className = '',
  ...rest
}: DescriptionsProps) {
  if (items.length === 0) return null;

  return (
    <div className={cx(styles.root, className)} data-size={size} {...rest}>
      <dl
        className={styles.list}
        data-columns={columns}
        data-layout={layout}
        {...(bordered ? { 'data-bordered': 'true' } : {})}
      >
        {items.map((item, index) => {
          const raw =
            typeof item.span === 'number' && Number.isFinite(item.span) ? Math.trunc(item.span) : 1;
          const span = Math.min(Math.max(raw, 1), columns);
          return (
            <div
              key={index}
              className={styles.item}
              style={{ '--desc-span': span } as CSSProperties}
            >
              <dt className={styles.label}>{item.label}</dt>
              <dd className={styles.value}>{item.value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
