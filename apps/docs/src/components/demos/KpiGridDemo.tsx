import { useState } from 'react';
import { KpiCard, KpiGrid, Select } from '@enterprise-ui/components';
import styles from './demos.module.css';

interface Kpi {
  label: string;
  value: string;
  delta: string;
  tone: 'green' | 'red' | 'neutral';
}

const KPIS: Kpi[] = [
  {
    label: 'Đơn hàng',
    value: '1.284',
    delta: '+8,2% so với tuần trước',
    tone: 'green',
  },
  {
    label: 'Doanh thu',
    value: '₫ 2,45 tỷ',
    delta: '+12,5% so với tuần trước',
    tone: 'green',
  },
  {
    label: 'Khách mới',
    value: '312',
    delta: '-3,1% so với tuần trước',
    tone: 'red',
  },
  {
    label: 'Tồn kho',
    value: '86%',
    delta: 'Không đổi so với tuần trước',
    tone: 'neutral',
  },
  {
    label: 'Công nợ quá hạn',
    value: '₫ 184 triệu',
    delta: '-8,4% so với tuần trước',
    tone: 'green',
  },
  {
    label: 'Tỷ lệ huỷ',
    value: '1,9%',
    delta: '+0,3 điểm phần trăm',
    tone: 'red',
  },
];

export function KpiGridDemo() {
  const [minCardWidth, setMinCardWidth] = useState(220);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Mặc định (220px)</h4>
        <KpiGrid>
          {KPIS.slice(0, 4).map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaTone={kpi.tone}
            />
          ))}
        </KpiGrid>
        <p className={styles.helper}>
          Lưới dùng <code>repeat(auto-fill, minmax(220px, 1fr))</code> nên số cột thay đổi theo bề
          rộng khung chứa, còn thứ tự thẻ giữ nguyên.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Điều chỉnh minCardWidth</h4>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="kpi-grid-min-width">
            Chiều rộng tối thiểu mỗi thẻ
          </label>
          <Select
            id="kpi-grid-min-width"
            value={String(minCardWidth)}
            onChange={(event) => setMinCardWidth(Number(event.target.value))}
          >
            <option value="120">120px — sát mức sàn</option>
            <option value="160">160px — nhiều cột hơn</option>
            <option value="220">220px — mặc định</option>
          </Select>
          <span className={styles.helper}>
            Đang dùng <code>minCardWidth={`{${minCardWidth}}`}</code>.
          </span>
        </div>
        <KpiGrid minCardWidth={minCardWidth}>
          {KPIS.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaTone={kpi.tone}
            />
          ))}
        </KpiGrid>
        <p className={styles.helper}>
          Giá trị nhỏ hơn 120 bị nâng lên 120 để thẻ không bị bóp méo; <code>NaN</code> hoặc{' '}
          <code>Infinity</code> rơi về 220.
        </p>
      </section>
    </div>
  );
}
