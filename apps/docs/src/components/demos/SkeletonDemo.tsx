import { Skeleton } from '@enterprise-ui/components';
import styles from './demos.module.css';

const lines = ['92%', '80%', '58%'];

export function SkeletonDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Đoạn văn đang tải</h4>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {lines.map((width) => (
            <Skeleton key={width} width={width} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Thẻ hồ sơ</h4>
        <div className={styles.row}>
          <Skeleton variant="circle" width={48} height={48} />
          <div style={{ display: 'grid', flex: 1, gap: '0.5rem' }}>
            <Skeleton width="45%" />
            <Skeleton width="70%" />
          </div>
        </div>
        <Skeleton variant="rect" height={120} />
      </section>
    </div>
  );
}
