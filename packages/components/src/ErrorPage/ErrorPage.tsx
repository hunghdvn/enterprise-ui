import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { cx } from '../internal/cx';
import { isPresent } from '../internal/isPresent';
import styles from './ErrorPage.module.css';
import type { ErrorPageProps, ErrorStatus } from './types';

interface ErrorDefaults {
  icon: IconName;
  title: string;
  description: string;
}

const DEFAULTS: Record<ErrorStatus, ErrorDefaults> = {
  403: {
    icon: 'lock',
    title: 'Không có quyền truy cập',
    description:
      'Bạn không có quyền truy cập trang này. Liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.',
  },
  404: {
    icon: 'search',
    title: 'Không tìm thấy trang',
    description: 'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.',
  },
  500: {
    icon: 'alert-triangle',
    title: 'Đã xảy ra lỗi',
    description: 'Hệ thống gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại sau ít phút.',
  },
};

export function ErrorPage({
  status,
  title,
  description,
  icon,
  actions,
  level = 1,
  as = 'main',
  fill = true,
  className = '',
}: ErrorPageProps) {
  const defaults = DEFAULTS[status];
  const Title: 'h1' | 'h2' = level === 1 ? 'h1' : 'h2';
  const Landmark = as;
  const resolvedTitle = isPresent(title) ? title : defaults.title;
  // Only `undefined` means "use the default"; null/'' deliberately hides the paragraph.
  const resolvedDescription = description === undefined ? defaults.description : description;
  const resolvedIcon = icon === undefined ? <Icon name={defaults.icon} size={28} /> : icon;

  return (
    <Landmark
      className={cx(styles.root, className)}
      data-status={status}
      data-fill={fill ? 'true' : 'false'}
    >
      <div className={styles.inner}>
        <div className={styles.statusRow}>
          {isPresent(resolvedIcon) && (
            <span className={styles.icon} data-icon={icon === undefined ? defaults.icon : 'custom'}>
              {resolvedIcon}
            </span>
          )}
          <p className={styles.code}>{status}</p>
        </div>
        <Title className={styles.title}>{resolvedTitle}</Title>
        {isPresent(resolvedDescription) && (
          <p className={styles.description}>{resolvedDescription}</p>
        )}
        {isPresent(actions) && <div className={styles.actions}>{actions}</div>}
      </div>
    </Landmark>
  );
}
