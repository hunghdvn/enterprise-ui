import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import styles from './Timeline.module.css';
import type { TimelineProps } from './types';

export function Timeline({
  items,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...rest
}: TimelineProps) {
  if (items.length === 0) return null;

  return (
    <ol
      {...rest}
      aria-label={ariaLabel ?? 'Dòng thời gian'}
      data-size={size}
      className={cx(styles.root, className)}
    >
      {items.map((item) => (
        <li key={item.id} className={styles.item} data-tone={item.tone ?? 'neutral'}>
          <span className={styles.marker} aria-hidden="true">
            {item.icon ? (
              <Icon name={item.icon} size={size === 'sm' ? 12 : 14} />
            ) : (
              <span className={styles.dot} />
            )}
          </span>
          <div className={styles.content}>
            <div className={styles.heading}>
              <span className={styles.title}>{item.title}</span>
              {item.time != null && (
                <time className={styles.time} dateTime={item.dateTime}>
                  {item.time}
                </time>
              )}
            </div>
            {item.description != null && <p className={styles.description}>{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
