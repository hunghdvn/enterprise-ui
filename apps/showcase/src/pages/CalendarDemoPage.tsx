import { useState } from 'react';
import { Button, Icon } from '@enterprise-ui/components';
import styles from './CalendarDemoPage.module.css';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function firstOffset(y: number, m: number) {
  const dow = new Date(y, m, 1).getDay();
  return (dow + 6) % 7;
}

const EVENTS: Record<string, { title: string; tone: string }[]> = {
  '2026-10-10': [{ title: 'Họp sprint', tone: 'blue' }],
  '2026-10-15': [
    { title: 'Release v1.2', tone: 'green' },
    { title: 'Review PR', tone: 'orange' },
  ],
  '2026-10-22': [{ title: 'Demo khách hàng', tone: 'blue' }],
  '2026-10-28': [{ title: 'Retro', tone: 'orange' }],
};

export default function CalendarDemoPage() {
  const [view, setView] = useState(new Date(2026, 9, 1));
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 9, 15));
  const y = view.getFullYear();
  const m = view.getMonth();
  const offset = firstOffset(y, m);
  const total = daysInMonth(y, m);
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = view.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Calendar — demo (spike)</h1>
        <div className={styles.nav}>
          <Button
            size="sm"
            variant="secondary"
            aria-label="Tháng trước"
            onClick={() => setView(new Date(y, m - 1, 1))}
          >
            <Icon name="chevron-left" size={14} />
          </Button>
          <span className={styles.month}>{monthLabel}</span>
          <Button
            size="sm"
            variant="secondary"
            aria-label="Tháng sau"
            onClick={() => setView(new Date(y, m + 1, 1))}
          >
            <Icon name="chevron-right" size={14} />
          </Button>
        </div>
      </header>

      <div className={styles.grid}>
        {WEEKDAYS.map((w) => (
          <div key={w} className={styles.weekday}>
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`b-${i}`} className={styles.blank} />;
          const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const evs = EVENTS[key] || [];
          const isSelected =
            selected &&
            selected.getFullYear() === y &&
            selected.getMonth() === m &&
            selected.getDate() === d;
          const now = new Date();
          const isToday = y === now.getFullYear() && m === now.getMonth() && d === now.getDate();
          return (
            <button
              key={d}
              type="button"
              className={`${styles.day} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
              onClick={() => setSelected(new Date(y, m, d))}
            >
              <span className={styles.daynum}>{d}</span>
              <div className={styles.events}>
                {evs.map((e, idx) => (
                  <span key={idx} className={`${styles.event} ${styles[e.tone]}`}>
                    {e.title}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <aside className={styles.side}>
        <h3>Ngày đã chọn</h3>
        <p>{selected ? selected.toLocaleDateString('vi-VN') : '—'}</p>
        <h3>Sự kiện tháng này</h3>
        <ul>
          {Object.entries(EVENTS)
            .filter(([k]) => k.startsWith(`${y}-${String(m + 1).padStart(2, '0')}`))
            .map(([k, evs]) =>
              evs.map((e, i) => (
                <li key={k + i}>
                  {k}: {e.title}
                </li>
              )),
            )}
        </ul>
      </aside>
    </div>
  );
}
