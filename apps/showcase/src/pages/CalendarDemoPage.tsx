import { useState } from 'react';
import { Calendar } from '@enterprise-ui/components';
import styles from './CalendarDemoPage.module.css';

const EVENTS: Record<string, string[]> = {
  '2026-10-10': ['Họp sprint'],
  '2026-10-15': ['Release v1.2', 'Review PR'],
  '2026-10-22': ['Demo khách hàng'],
  '2026-10-28': ['Retro'],
};

const MONTHS = [new Date(2026, 8, 1), new Date(2026, 9, 1), new Date(2026, 10, 1)];

export default function CalendarDemoPage() {
  const [view, setView] = useState(new Date(2026, 9, 1));
  const [selected, setSelected] = useState<Date | null>(new Date(2026, 9, 15));
  const [size, setSize] = useState<'sm' | 'md'>('md');
  const [blockWeekends, setBlockWeekends] = useState(true);

  const monthEvents = Object.entries(EVENTS).filter(([key]) => {
    const [year, month] = key.split('-').map(Number);
    return year === view.getFullYear() && month === view.getMonth() + 1;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Calendar</h1>
        <div className={styles.controls}>
          <label className={styles.field}>
            Kích thước
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as 'sm' | 'md')}
              aria-label="Kích thước calendar"
            >
              <option value="sm">sm</option>
              <option value="md">md</option>
            </select>
          </label>
          <label className={styles.field}>
            <input
              type="checkbox"
              checked={blockWeekends}
              onChange={(e) => setBlockWeekends(e.target.checked)}
            />
            Chặn cuối tuần
          </label>
        </div>
      </header>

      <section className={styles.calendar}>
        <Calendar
          value={selected}
          onChange={setSelected}
          view={view}
          onViewChange={setView}
          size={size}
          events={EVENTS}
          isDisabled={(d) => blockWeekends && (d.getDay() === 0 || d.getDay() === 6)}
          aria-label="Lịch làm việc"
        />
      </section>

      <aside className={styles.side}>
        <h3>Ngày đã chọn</h3>
        <p>{selected ? selected.toLocaleDateString('vi-VN') : '—'}</p>

        <h3>Chuyển nhanh</h3>
        <ul className={styles.shortcuts}>
          {MONTHS.map((m) => (
            <li key={m.toISOString()}>
              <button type="button" onClick={() => setView(m)}>
                {m.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
              </button>
            </li>
          ))}
        </ul>

        <h3>Sự kiện tháng này</h3>
        {monthEvents.length === 0 ? (
          <p className={styles.empty}>Không có sự kiện</p>
        ) : (
          <ul>
            {monthEvents.map(([key, titles]) => (
              <li key={key}>
                {key}: {titles.join(' · ')}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
