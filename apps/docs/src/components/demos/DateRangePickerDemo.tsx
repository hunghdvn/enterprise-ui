import { useState } from 'react';
import { Button, DateRangePicker } from '@enterprise-ui/components';
import type { DateRange } from '@enterprise-ui/components';
import styles from './demos.module.css';
import { formatDate } from './demoUtils';

const EMPTY_RANGE: DateRange = { from: null, to: null };

export function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange>({
    from: new Date(2026, 10, 2),
    to: new Date(2026, 10, 8),
  });
  const [reportRange, setReportRange] = useState<DateRange>(EMPTY_RANGE);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Khoảng ngày có kiểm soát</h4>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Khoảng ngày giao hàng</span>
            <DateRangePicker
              value={range}
              onChange={setRange}
              placeholder="Chọn khoảng ngày giao"
              aria-label="Khoảng ngày giao hàng"
            />
            <p className={styles.helper}>
              từ: <strong>{formatDate(range.from)}</strong> · đến:{' '}
              <strong>{formatDate(range.to)}</strong>
            </p>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Kỳ báo cáo, kích thước md</span>
            <DateRangePicker
              value={reportRange}
              onChange={setReportRange}
              placeholder="Chọn kỳ báo cáo"
              size="md"
              aria-label="Kỳ báo cáo"
            />
            <p className={styles.helper}>
              từ: <strong>{formatDate(reportRange.from)}</strong> · đến:{' '}
              <strong>{formatDate(reportRange.to)}</strong>
            </p>
            <div className={styles.row}>
              <Button
                size="sm"
                variant="ghost"
                disabled={!reportRange.from && !reportRange.to}
                onClick={() => setReportRange(EMPTY_RANGE)}
              >
                Xoá khoảng
              </Button>
            </div>
          </div>
        </div>
        <p className={styles.helper}>
          Bấm trigger để mở panel: chọn ngày đầu rồi ngày cuối, hoặc dùng preset ở cuối lịch. Panel
          không tự đóng sau khi chọn đủ hai ngày — bấm Escape hoặc click ra ngoài để đóng.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Vô hiệu hoá</h4>
        <DateRangePicker
          value={{ from: new Date(2026, 10, 1), to: new Date(2026, 10, 30) }}
          onChange={() => {}}
          disabled
          aria-label="Kỳ đã chốt"
        />
        <p className={styles.helper}>
          Trigger bị <code>disabled</code>; panel không mở được kể cả khi dùng bàn phím.
        </p>
      </section>
    </div>
  );
}
