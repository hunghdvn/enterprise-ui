import { useState } from 'react';
import { Alert, Button } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function AlertDemo() {
  const [showDanger, setShowDanger] = useState(true);

  return (
    <div className={styles.stack}>
      <Alert tone="info" title="Thông tin">
        Bản nháp được lưu tự động mỗi 30 giây.
      </Alert>
      <Alert tone="success">Đã xuất báo cáo tháng 10.</Alert>
      <Alert tone="warning" title="Sắp hết hạn">
        Gói lưu trữ còn 2 ngày sử dụng.
      </Alert>
      {showDanger ? (
        <Alert tone="danger" title="Không lưu được" onDismiss={() => setShowDanger(false)}>
          Kiểm tra kết nối rồi thử lại.
        </Alert>
      ) : (
        <div className={styles.row}>
          <span className={styles.helper}>Đã đóng cảnh báo.</span>
          <Button size="sm" variant="secondary" onClick={() => setShowDanger(true)}>
            Hiện lại
          </Button>
        </div>
      )}
    </div>
  );
}
