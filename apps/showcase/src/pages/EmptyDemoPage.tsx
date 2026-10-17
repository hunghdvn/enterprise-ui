import { Button, Empty, Table } from '@enterprise-ui/components';
import styles from './EmptyDemoPage.module.css';

export default function EmptyDemoPage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Empty</h2>
      <p className={styles.subtitle}>Demo các biến thể Empty.</p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Mặc định</h3>
        <Empty />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Với nút hành động</h3>
        <Empty
          description="Không tìm thấy kết quả"
          action={
            <Button variant="primary" size="sm">
              Tải lại
            </Button>
          }
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Trong Table (status=&apos;empty&apos;)</h3>
        <Table columns={[{ key: 'code', title: 'Mã đơn' }]} data={[]} status="empty" />
      </section>
    </div>
  );
}
