import { Button } from '../Button/Button';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Current page, 1-indexed. */
  page: number;
  pageSize: number;
  total: number;
  onChange?: (page: number) => void;
}

const WINDOW = 5;

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const safeSize = Math.max(1, Math.floor(pageSize));
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const current = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start = total === 0 ? 0 : (current - 1) * safeSize + 1;
  const end = Math.min(current * safeSize, total);

  const from = Math.max(1, Math.min(current - Math.floor(WINDOW / 2), totalPages - WINDOW + 1));
  const to = Math.min(totalPages, from + WINDOW - 1);
  const pages: number[] = [];
  for (let p = from; p <= to; p++) pages.push(p);

  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== current) onChange?.(p);
  };

  return (
    <nav className={styles.bar} aria-label="Phân trang">
      <span className={styles.range}>
        {start}-{end} / {total}
      </span>
      <span className={styles.pages}>
        <Button
          variant="secondary"
          size="sm"
          aria-label="Trang trước"
          disabled={current <= 1}
          onClick={() => go(current - 1)}
        >
          ‹
        </Button>
        {pages.map((p) => (
          <Button
            key={p}
            variant={p === current ? 'primary' : 'secondary'}
            size="sm"
            aria-label={`Trang ${p}`}
            aria-current={p === current ? 'page' : undefined}
            onClick={() => go(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          variant="secondary"
          size="sm"
          aria-label="Trang sau"
          disabled={current >= totalPages}
          onClick={() => go(current + 1)}
        >
          ›
        </Button>
      </span>
    </nav>
  );
}
