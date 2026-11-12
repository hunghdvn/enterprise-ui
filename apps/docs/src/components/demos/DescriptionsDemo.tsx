import { Descriptions } from '@enterprise-ui/components';
import styles from './demos.module.css';

const CUSTOMER = [
  { label: 'Mã khách hàng', value: 'KH-1042' },
  { label: 'Email', value: 'an.nguyen@example.com' },
  { label: 'Điện thoại', value: '090 123 4567' },
  { label: 'Phòng ban', value: 'Kinh doanh' },
  { label: 'Trạng thái', value: 'Đang hoạt động' },
  { label: 'Ngày tạo', value: '12/11/2026' },
];

const SHIPPING = [
  { label: 'Người nhận', value: 'Nguyễn Văn An' },
  { label: 'Điện thoại', value: '090 123 4567' },
  { label: 'Địa chỉ', value: '18 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', span: 2 },
];

export function DescriptionsDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Hai cột, nhãn bên trái</h4>
        <Descriptions items={CUSTOMER} />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ba cột, nhãn bên trên, có viền</h4>
        <Descriptions items={CUSTOMER} columns={3} layout="vertical" bordered size="sm" />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Địa chỉ chiếm hai cột</h4>
        <Descriptions items={SHIPPING} columns={2} />
      </section>
    </div>
  );
}
