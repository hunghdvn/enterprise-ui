import { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
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

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // `page` can arrive out of range (e.g. `total` shrank after a search). The
  // footer and the active button already show the clamped page, so report it:
  // otherwise the parent keeps rendering a slice the UI does not claim.
  useEffect(() => {
    if (page !== current) onChangeRef.current?.(current);
  }, [page, current]);

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
      <PageJumper current={current} totalPages={totalPages} onGo={go} />
    </nav>
  );
}

function PageJumper({
  current,
  totalPages,
  onGo,
}: {
  current: number;
  totalPages: number;
  onGo: (p: number) => void;
}) {
  const [draft, setDraft] = useState(String(current));
  const shownPage = useRef(current);
  useEffect(() => {
    if (shownPage.current === current) return;
    shownPage.current = current;
    setDraft(String(current));
  }, [current]);

  const commitJumper = () => {
    const wanted = draft.trim();
    // Digits only: Number.parseInt('1e5') silently reads 1 and '12abc' reads 12.
    if (!/^\d+$/.test(wanted)) {
      setDraft(String(current));
      return;
    }
    const clamped = Math.min(Math.max(1, Number(wanted)), totalPages);
    setDraft(String(clamped));
    onGo(clamped);
  };

  return (
    <form
      className={styles.jumper}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        commitJumper();
      }}
    >
      <label className={styles.jumperLabel}>
        Đi tới
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Đi tới trang"
          className={styles.jumperInput}
          size="sm"
        />
      </label>
      <span className={styles.jumperTotal}>/ {totalPages} trang</span>
      <Button type="button" variant="secondary" size="sm" onClick={commitJumper}>
        Đi
      </Button>
    </form>
  );
}
