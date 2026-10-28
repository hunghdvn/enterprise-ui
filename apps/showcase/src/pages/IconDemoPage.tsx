import { useMemo, useState } from 'react';
import { Icon, ICONS } from '@enterprise-ui/components';
import styles from './IconDemoPage.module.css';

const names = Object.keys(ICONS) as (keyof typeof ICONS)[];
const PAGE_SIZE = 240;

export default function IconDemoPage() {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? names.filter((name) => name.includes(needle)) : names;
  }, [query]);
  const shown = filtered.slice(0, visible);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Icon</h2>
      <p className={styles.subtitle}>
        Bộ icon inline SVG (~{names.length} icon), stroke-based 24×24, màu theo currentColor.
      </p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Tất cả icon</h3>
        <div className={styles.toolbar}>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Tìm icon…"
            aria-label="Tìm icon"
            className={styles.search}
          />
          <span className={styles.count}>
            {filtered.length} / {names.length} icon
          </span>
        </div>
        <div className={styles.grid}>
          {shown.map((name) => (
            <div key={name} className={styles.cell}>
              <Icon name={name} size={20} />
              <span className={styles.name}>{name}</span>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className={styles.empty}>Không tìm thấy icon phù hợp.</p>}
        {shown.length < filtered.length && (
          <button
            type="button"
            className={styles.more}
            onClick={() => setVisible((value) => value + PAGE_SIZE)}
          >
            Hiện thêm {Math.min(PAGE_SIZE, filtered.length - shown.length)} icon
          </button>
        )}
      </section>

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
