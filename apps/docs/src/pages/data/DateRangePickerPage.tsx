import { useState } from 'react';
import { DateRangePicker, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import type { DateRange } from '@enterprise-ui/components';
import styles from './DateRangePickerPage.module.css';

const props: PropDoc[] = [
  {
    name: 'value',
    type: '{ from: Date | null; to: Date | null }',
    description: 'Khoảng ngày điều khiển (controlled).',
  },
  {
    name: 'onChange',
    type: '(range: DateRange) => void',
    description: 'Gọi khi khoảng ngày thay đổi (preset/chọn ngày).',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Chọn khoảng ngày'",
    description: 'Placeholder khi chưa chọn.',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Kích thước trigger.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Vô hiệu hoá toàn bộ.' },
  { name: 'aria-label', type: 'string', description: 'Nhãn a11y cho trigger.' },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ.' },
];

const code = `import { useState } from 'react';
import { DateRangePicker } from '@enterprise-ui/components';
import type { DateRange } from '@enterprise-ui/components';

export function ReportRange() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      placeholder="Chọn khoảng ngày báo cáo"
    />
  );
}`;

export default function DateRangePickerPage() {
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Date Range Picker</h1>
      <p className={styles.subtitle}>
        Chọn khoảng ngày qua calendar grid + preset nhanh (hôm nay, 7/30 ngày, tháng này).
      </p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Chọn khoảng ngày</h2>
                    <DateRangePicker
                      value={range}
                      onChange={setRange}
                      placeholder="Chọn khoảng ngày báo cáo"
                    />
                    <p className={styles.helper}>
                      from: {range.from ? range.from.toLocaleDateString('vi-VN') : '—'} · to:{' '}
                      {range.to ? range.to.toLocaleDateString('vi-VN') : '—'}
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hoá</h2>
                    <DateRangePicker
                      value={{ from: null, to: null }}
                      onChange={() => {}}
                      disabled
                    />
                  </section>
                </div>
              </DemoPlayground>
            ),
          },
          { key: 'props', label: 'Props', content: <PropsTable props={props} /> },
          { key: 'code', label: 'Code', content: <CodeBlock code={code} /> },
        ]}
      />
    </div>
  );
}
