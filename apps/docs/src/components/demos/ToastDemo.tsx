import { Button, ToastProvider, useToast } from '@enterprise-ui/components';
import styles from './demos.module.css';

function ToastButtons() {
  const { toast } = useToast();

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ba tone</h4>
        <div className={styles.row}>
          <Button onClick={() => toast.success('Đã lưu đơn hàng SO-1024')}>success</Button>
          <Button variant="danger" onClick={() => toast.error('Kết nối máy chủ thất bại')}>
            error
          </Button>
          <Button variant="secondary" onClick={() => toast.show('Đang đồng bộ dữ liệu…')}>
            info
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Xếp chồng</h4>
        <div className={styles.row}>
          <Button
            variant="secondary"
            onClick={() => {
              toast.success('Đã xuất file don-hang.csv');
              toast.error('2 dòng bị bỏ qua vì thiếu mã sản phẩm');
              toast.show('Đang cập nhật tồn kho…');
            }}
          >
            Bắn 3 toast
          </Button>
        </div>
        <p className={styles.helper}>
          Toast mới xếp dưới toast cũ; mỗi toast có timer riêng và nút đóng sớm.
        </p>
      </section>
    </div>
  );
}

export function ToastDemo() {
  return (
    <ToastProvider duration={3000}>
      <ToastButtons />
    </ToastProvider>
  );
}
