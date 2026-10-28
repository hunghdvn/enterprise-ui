import { Icon, ICONS } from '@enterprise-ui/components';
import { IconGallery } from '../../../shared/IconGallery';
import styles from './IconDemoPage.module.css';

const names = Object.keys(ICONS) as (keyof typeof ICONS)[];

export default function IconDemoPage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Icon</h2>
      <p className={styles.subtitle}>
        Bộ icon inline SVG (~{names.length} icon), stroke-based 24×24, màu theo currentColor.
      </p>

      <IconGallery headingLevel={3} />

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Kích thước & màu</h3>
        <div className={styles.row}>
          <Icon name="check" size={16} />
          <Icon name="check" size={20} />
          <Icon name="check" size={24} />
          <Icon name="check" size={32} />
          <span style={{ color: 'var(--color-blue-600)' }}>
            <Icon name="bell" size={20} />
          </span>
          <span style={{ color: 'var(--color-orange-500)' }}>
            <Icon name="alert-triangle" size={20} />
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Có label (accessible)</h3>
        <Icon name="search" size={20} label="Tìm kiếm" />
      </section>
    </div>
  );
}
