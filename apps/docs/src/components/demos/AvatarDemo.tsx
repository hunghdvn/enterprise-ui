import { Avatar } from '@enterprise-ui/components';
import styles from './demos.module.css';

const PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64'%3E%3Crect width='64' height='64' fill='%231e47c4'/%3E%3Ccircle cx='32' cy='24' r='12' fill='%23dbeafe'/%3E%3Cpath d='M12 60c0-12 9-20 20-20s20 8 20 20' fill='%23dbeafe'/%3E%3C/svg%3E";
const BROKEN = 'data:image/png;base64,AAAA';

export function AvatarDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ba kích thước</h4>
        <div className={styles.row}>
          <Avatar name="Nguyễn Văn An" src={PHOTO} size="sm" />
          <Avatar name="Nguyễn Văn An" src={PHOTO} />
          <Avatar name="Nguyễn Văn An" src={PHOTO} size="lg" />
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chữ cái thay thế</h4>
        <div className={styles.row}>
          <Avatar name="Nguyễn Văn An" />
          <Avatar name="Trần Bảo" />
          <Avatar name="An" />
        </div>
        <p className={styles.helper}>
          Tên nhiều từ lấy chữ cái đầu và cuối; tên một từ lấy một chữ.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ảnh tải lỗi</h4>
        <div className={styles.row}>
          <Avatar name="Nguyễn Văn An" src={BROKEN} />
          <Avatar name="Trần Bảo" src={BROKEN} />
          <span className={styles.helper}>Ảnh hỏng tự chuyển sang chữ cái.</span>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Trang trí cạnh tên</h4>
        <div className={styles.row}>
          <Avatar name="Nguyễn Văn An" src={PHOTO} alt="" />
          <span>Nguyễn Văn An</span>
        </div>
        <p className={styles.helper}>
          <code>{'alt=""'}</code> ẩn avatar khỏi cây truy cập khi tên đã hiển thị bên cạnh.
        </p>
      </section>
    </div>
  );
}
