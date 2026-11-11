import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import { isPresent } from '../internal/isPresent';
import styles from './Alert.module.css';
import type { AlertProps, AlertTone } from './types';

const ICONS: Record<AlertTone, 'info' | 'check-circle' | 'alert-triangle' | 'alert-circle'> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};
const ROLES: Record<AlertTone, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
};

export function Alert({
  tone = 'info',
  title,
  children,
  onDismiss,
  dismissLabel = 'Đóng thông báo',
  className = '',
  ...rest
}: AlertProps) {
  return (
    <div role={ROLES[tone]} data-tone={tone} className={cx(styles.alert, className)} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        <Icon name={ICONS[tone]} size={16} />
      </span>
      <div className={styles.body}>
        {isPresent(title) && <span className={styles.title}>{title}</span>}
        {isPresent(children) && <div className={styles.message}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className={styles.close}
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
