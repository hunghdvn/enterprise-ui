import { Badge } from '@enterprise-ui/components';
import styles from './demos.module.css';

const tones = ['blue', 'orange', 'green', 'red', 'neutral'] as const;

export function BadgeDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Năm tông màu</h4>
        <div className={styles.row}>
          {tones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Trong ngữ cảnh</h4>
        <ul className={styles.plainList}>
          <li>
            <span>SO-1024 · Cty An Phát</span>
            <Badge tone="green">Hoàn thành</Badge>
          </li>
          <li>
            <span>SO-1025 · Cty Minh Đức</span>
            <Badge tone="blue">Đang giao</Badge>
          </li>
          <li>
            <span>SO-1026 · Cty Hoà Bình</span>
            <Badge tone="orange">Chờ duyệt</Badge>
          </li>
          <li>
            <span>SO-1027 · Cty Sao Mai</span>
            <Badge tone="red">Quá hạn</Badge>
          </li>
        </ul>
      </section>
    </div>
  );
}
