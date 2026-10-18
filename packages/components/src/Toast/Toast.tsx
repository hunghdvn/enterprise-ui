import { Icon } from '../Icon';
import styles from './Toast.module.css';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  tone?: ToastTone;
  onClose?: () => void;
}

export function Toast({ message, tone = 'info', onClose }: ToastProps) {
  const role = tone === 'error' ? 'alert' : 'status';
  return (
    <div role={role} data-tone={tone} className={styles.toast}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Đóng thông báo"
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
