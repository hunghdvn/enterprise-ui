import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import { isPresent } from '../internal/isPresent';
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
      // WebKit drops list semantics for unmarked lists; keep the role explicit so
      // screen readers still announce position and count.
      role="list"
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
              {/* A <time> without datetime must contain a valid date string, so the
                  parent-formatted display text only becomes a <time> when dateTime
                  supplies the machine-readable value. */}
              {isPresent(item.time) &&
                (item.dateTime ? (
                  <time className={styles.time} dateTime={item.dateTime}>
                    {item.time}
                  </time>
                ) : (
                  <span className={styles.time}>{item.time}</span>
                ))}
            </div>
            {isPresent(item.description) && (
              <p className={styles.description}>{item.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
