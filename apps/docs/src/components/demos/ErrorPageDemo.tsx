import { useState } from 'react';
import { Button, ErrorPage } from '@enterprise-ui/components';
import type { ErrorStatus } from '@enterprise-ui/components';
import styles from './demos.module.css';

const STATUSES: ErrorStatus[] = [403, 404, 500];

interface StatusCopy {
  primary: string;
  secondary: string;
  primaryMessage: string;
  secondaryMessage: string;
}

const COPY: Record<ErrorStatus, StatusCopy> = {
  403: {
    primary: 'Yêu cầu quyền truy cập',
    secondary: 'Quay lại',
    primaryMessage: 'Đã gửi yêu cầu cấp quyền (demo).',
    secondaryMessage: 'Quay lại trang trước (demo) — không đổi route thật.',
  },
  404: {
    primary: 'Về trang chủ',
    secondary: 'Tìm kiếm',
    primaryMessage: 'Về trang chủ (demo) — không đổi route thật.',
    secondaryMessage: 'Mở tìm kiếm (demo).',
  },
  500: {
    primary: 'Thử lại',
    secondary: 'Liên hệ hỗ trợ',
    primaryMessage: 'Thử lại (demo) — chưa gọi API.',
    secondaryMessage: 'Đã mở kênh hỗ trợ (demo).',
  },
};

export function ErrorPageDemo() {
  const [status, setStatus] = useState<ErrorStatus>(404);
  const [message, setMessage] = useState(
    'Chọn một mã lỗi để xem nội dung mặc định và hành động tương ứng.',
  );

  const copy = COPY[status];

  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <div className={styles.row} role="group" aria-label="Chọn mã lỗi">
          {STATUSES.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={item === status ? 'primary' : 'secondary'}
              aria-pressed={item === status}
              onClick={() => {
                setStatus(item);
                setMessage(`Đang xem trang lỗi ${item}.`);
              }}
            >
              {item}
            </Button>
          ))}
        </div>
        <span className={styles.helper}>
          Nhúng trong trang đã có <code>main</code>: dùng <code>as=&quot;div&quot;</code> và{' '}
          <code>fill=&#123;false&#125;</code>.
        </span>
      </div>

      <ErrorPage
        status={status}
        as="div"
        fill={false}
        level={2}
        actions={
          <>
            <Button onClick={() => setMessage(copy.primaryMessage)}>{copy.primary}</Button>
            <Button variant="secondary" onClick={() => setMessage(copy.secondaryMessage)}>
              {copy.secondary}
            </Button>
          </>
        }
      />

      <p className={styles.helper} role="status">
        {message}
      </p>
    </div>
  );
}
