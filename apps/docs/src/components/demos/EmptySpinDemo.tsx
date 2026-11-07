import { useEffect, useState } from 'react';
import { Button, Empty, Icon, Spin } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function EmptySpinDemo() {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 1800);
    return () => window.clearTimeout(timer);
  }, [busy]);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Empty</h4>
        <div className={styles.emptyStage}>
          <Empty />
          <Empty
            description="Chưa có đơn hàng nào trong tuần này."
            action={<Button size="sm">Tạo đơn đầu tiên</Button>}
          />
          <Empty
            icon={<Icon name="search" size={40} />}
            description="Không tìm thấy kết quả phù hợp."
          />
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Spin</h4>
        <div className={styles.spinStage}>
          <Spin size="sm" />
          <Spin />
          <Spin size="lg" />
          <Spin tip="Đang đồng bộ dữ liệu…" />
          <Button variant="secondary" onClick={() => setBusy(true)}>
            Hiện fullscreen
          </Button>
        </div>
        <p className={styles.helper}>
          Fullscreen phủ toàn trang kèm backdrop; tự đóng sau 1,8 giây trong demo này.
        </p>
      </section>

      <Spin fullscreen={busy} tip="Đang xử lý…" />
    </div>
  );
}
