import { useState } from 'react';
import { Button, Calendar } from '@enterprise-ui/components';
import styles from './demos.module.css';
import { formatDate } from './demoUtils';

const NOV_2026 = new Date(2026, 10, 1);

const EVENTS = {
  '2026-11-05': 'Họp giao ban',
  '2026-11-12': ['Demo sản phẩm', 'Sinh nhật'],
  '2026-11-19': 'Chốt số liệu quý',
};

export function CalendarDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 10, 12));
  const [view, setView] = useState(NOV_2026);
  const [reviewDate, setReviewDate] = useState<Date | null>(new Date(2026, 10, 18));
  const [reviewView, setReviewView] = useState(NOV_2026);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chọn ngày có sự kiện</h4>
        <div className={styles.grid}>
          <Calendar
            value={date}
            onChange={setDate}
            view={view}
            onViewChange={setView}
            events={EVENTS}
            aria-label="Lịch hẹn"
          />
          <div className={styles.field}>
            <span className={styles.label}>Ngày đang chọn</span>
            <p className={styles.helper}>
              <strong>{formatDate(date)}</strong> — ngày 12/11 có hai sự kiện; ở kích thước{' '}
              <code>sm</code> ô chỉ hiện một dòng, danh sách đầy đủ vẫn nằm trong mô tả của ngày.
            </p>
            <div className={styles.row}>
              <Button size="sm" variant="secondary" onClick={() => setDate(new Date(2026, 10, 12))}>
                Chọn 12/11
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDate(null)}>
                Bỏ chọn
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kích thước md, khoá cuối tuần</h4>
        <div className={styles.grid}>
          <Calendar
            size="md"
            value={reviewDate}
            onChange={setReviewDate}
            view={reviewView}
            onViewChange={setReviewView}
            isDisabled={(day) => day.getDay() === 0 || day.getDay() === 6}
            events={{ '2026-11-12': 'Review thiết kế' }}
            aria-label="Lịch review, cuối tuần bị khoá"
          />
          <p className={styles.helper}>
            Thứ Bảy và Chủ nhật bị vô hiệu hoá bằng <code>isDisabled</code>. Ngày bị khoá vẫn hiện
            trong lưới nhưng không nhận focus và không phát <code>onChange</code>. Chuyển tháng bằng
            hai nút mũi tên hoặc PageUp/PageDown.
          </p>
        </div>
      </section>
    </div>
  );
}
