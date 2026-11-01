import { useMemo, useState } from 'react';
import { Icon, ICONS } from '@enterprise-ui/components';
import styles from './IconGallery.module.css';

const names = Object.keys(ICONS) as (keyof typeof ICONS)[];
const PAGE_SIZE = 240;

type IconGalleryProps = {
  /** Heading level for the gallery title, so docs and showcase keep their own outline. */
  headingLevel?: 2 | 3;
};

export function IconGallery({ headingLevel = 2 }: IconGalleryProps) {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? names.filter((name) => name.includes(needle)) : names;
  }, [query]);
  const shown = filtered.slice(0, visible);
  const allShown = shown.length >= filtered.length;
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <section className={styles.gallery}>
      <Heading className={styles.title}>Tất cả icon</Heading>
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
        <span className={styles.count} role="status" aria-live="polite" aria-atomic="true">
          {filtered.length} / {names.length} icon
        </span>
      </div>
      <div className={styles.grid} id="icon-gallery">
        {shown.map((name) => (
          <div key={name} className={styles.cell}>
            <Icon name={name} size={20} />
            <span className={styles.name}>{name}</span>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className={styles.empty} role="status" aria-live="polite">
          Không tìm thấy icon phù hợp.
        </p>
      )}
      {filtered.length > PAGE_SIZE && (
        <button
          type="button"
          className={styles.more}
          onClick={() => {
            if (allShown) return;
            setVisible((value) => value + PAGE_SIZE);
          }}
          aria-disabled={allShown}
          aria-controls="icon-gallery"
        >
          {allShown
            ? `Đã hiển thị tất cả ${filtered.length} icon`
            : `Hiện thêm ${Math.min(PAGE_SIZE, filtered.length - shown.length)} icon`}
        </button>
      )}
    </section>
  );
}
