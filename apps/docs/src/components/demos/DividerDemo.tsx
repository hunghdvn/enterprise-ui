import { Divider } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function DividerDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ngăn cách hai khối nội dung</h4>
        <p className={styles.helper}>
          Dòng đầu tiên của một nhóm. Khoảng cách mặc định là <code>md</code>.
        </p>
        <Divider />
        <p className={styles.helper}>
          Dòng thứ hai. Divider không tự tạo tiêu đề hay khoảng thở theo chiều ngang.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Có nhãn và căn lề</h4>
        <Divider label="Hoặc" />
        <Divider label="Bắt đầu" align="start" />
        <Divider label="Kết thúc" align="end" />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Dọc trong thanh công cụ</h4>
        <div className={styles.dividerRow}>
          <span>Sửa</span>
          <Divider orientation="vertical" spacing="sm" />
          <span>Nhân bản</span>
          <Divider orientation="vertical" spacing="sm" />
          <span>Lưu trữ</span>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ba mức khoảng cách</h4>
        <p className={styles.helper}>Không khoảng cách</p>
        <Divider spacing="none" />
        <p className={styles.helper}>Nhỏ — 8px</p>
        <Divider spacing="sm" />
        <p className={styles.helper}>Vừa — 16px</p>
        <Divider spacing="md" />
      </section>
    </div>
  );
}
