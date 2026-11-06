import { useId } from 'react';
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

const HEADING = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;

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
  // An unsupported status (401/502/503 arriving from an API through a cast) must not throw:
  // the fallback page would take the route or the error boundary down with it.
  const defaults = DEFAULTS[status] ?? DEFAULTS[500];
  const Title = HEADING[level];
  const Landmark = as;
  const headingId = useId();
  // Keyed on the resolved copy, not the raw status: a 502 gets the 500 title and must
  // therefore get the 500 danger cue too.
  const danger = status === 500 || DEFAULTS[status] === undefined;
  const resolvedTitle = isPresent(title) ? title : defaults.title;
  // Only `undefined` means "use the default"; null/'' deliberately hides the paragraph.
  const resolvedDescription = description === undefined ? defaults.description : description;
  const resolvedIcon = icon === undefined ? <Icon name={defaults.icon} size={28} /> : icon;

  return (
    <Landmark
      className={cx(styles.root, className)}
      // A bare <section> is not a landmark; naming it turns it into a region. A `div`
      // has no role, and ARIA 1.2 prohibits aria-labelledby on role=generic.
      aria-labelledby={as === 'div' ? undefined : headingId}
      data-status={status}
      data-tone={danger ? 'danger' : 'info'}
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
        <Title className={styles.title} id={headingId}>
          {resolvedTitle}
        </Title>
        {isPresent(resolvedDescription) && (
          <p className={styles.description}>{resolvedDescription}</p>
        )}
        {isPresent(actions) && <div className={styles.actions}>{actions}</div>}
      </div>
    </Landmark>
  );
}
