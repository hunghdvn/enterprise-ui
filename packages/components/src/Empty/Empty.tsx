import { isPresent } from '../internal/isPresent';
import { Icon } from '../Icon';
import styles from './Empty.module.css';
import type { EmptyProps } from './types';

export function Empty({ description, action, icon }: EmptyProps) {
  const desc = description ?? 'Không có dữ liệu';
  return (
    <div className={styles.root}>
      <div className={styles.icon}>{isPresent(icon) ? icon : <Icon name="inbox" size={48} />}</div>
      <div className={styles.description}>{desc}</div>
      {isPresent(action) && <div className={styles.action}>{action}</div>}
    </div>
  );
}
