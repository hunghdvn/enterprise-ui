import { Tabs } from '@enterprise-ui/components';
import styles from './demos.module.css';

const variants = ['line', 'segmented', 'pills', 'enclosed'] as const;

export function TabsDemo() {
  return (
    <div className={styles.stack}>
      {variants.map((variant) => (
        <section key={variant} className={styles.section}>
          <h4 className={styles.sectionTitle}>{variant}</h4>
          <Tabs
            variant={variant}
            items={[
              {
                key: 'overview',
                label: 'Tổng quan',
                content: (
                  <p className={styles.helper}>
                    Doanh thu tháng này tăng 12,4% so với cùng kỳ. Biến thể <code>{variant}</code>{' '}
                    chỉ đổi phần tab list, nội dung giữ nguyên.
                  </p>
                ),
              },
              {
                key: 'activity',
                label: 'Hoạt động',
                content: (
                  <p className={styles.helper}>
                    Có 8 đơn hàng mới và 3 yêu cầu hỗ trợ đang chờ xử lý.
                  </p>
                ),
              },
              {
                key: 'settings',
                label: 'Cài đặt',
                content: (
                  <p className={styles.helper}>
                    Cấu hình thông báo, quyền truy cập và tích hợp hệ thống.
                  </p>
                ),
              },
            ]}
          />
        </section>
      ))}
    </div>
  );
}
