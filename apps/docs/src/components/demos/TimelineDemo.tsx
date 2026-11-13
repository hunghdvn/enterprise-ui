import { Timeline } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function TimelineDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Lịch sử đơn hàng</h4>
        <Timeline
          items={[
            {
              id: 'created',
              title: 'Tạo đơn hàng',
              description: 'Nguyễn An tạo đơn #SO-1042 từ màn hình bán hàng.',
              time: '12/11/2026 · 09:15',
              dateTime: '2026-11-12T09:15:00+07:00',
              tone: 'blue',
              icon: 'file-plus',
            },
            {
              id: 'confirmed',
              title: 'Xác nhận thanh toán',
              description: 'Nhận chuyển khoản 24.500.000 ₫.',
              time: '12/11/2026 · 10:02',
              dateTime: '2026-11-12T10:02:00+07:00',
              tone: 'blue',
              icon: 'check-circle',
            },
            {
              id: 'shipping',
              title: 'Đang giao',
              description: 'Đơn vị vận chuyển đã lấy hàng tại kho Hà Nội.',
              time: '13/11/2026 · 08:40',
              dateTime: '2026-11-13T08:40:00+07:00',
              tone: 'orange',
              icon: 'truck',
            },
            {
              id: 'delivered',
              title: 'Giao thành công',
              description: 'Người nhận: Trần Bình. Đã ký xác nhận.',
              time: '13/11/2026 · 14:30',
              dateTime: '2026-11-13T14:30:00+07:00',
              tone: 'green',
              icon: 'check-circle',
            },
          ]}
        />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nhật ký hệ thống, kích thước nhỏ</h4>
        <Timeline
          size="sm"
          aria-label="Nhật ký hệ thống"
          items={[
            {
              id: 'login',
              title: 'Đăng nhập thành công',
              time: '13/11/2026 · 08:01',
              dateTime: '2026-11-13T08:01:00+07:00',
            },
            {
              id: 'role',
              title: 'Thay đổi quyền',
              description: 'Cấp quyền “Quản lý đơn hàng” cho nhóm Kinh doanh.',
              time: '13/11/2026 · 08:24',
              dateTime: '2026-11-13T08:24:00+07:00',
              tone: 'orange',
              icon: 'shield-alert',
            },
            {
              id: 'export',
              title: 'Xuất dữ liệu thất bại',
              description: 'Tệp quá lớn; người dùng cần chia nhỏ khoảng ngày.',
              time: '13/11/2026 · 09:10',
              dateTime: '2026-11-13T09:10:00+07:00',
              tone: 'red',
              icon: 'alert-circle',
            },
          ]}
        />
      </section>
    </div>
  );
}
