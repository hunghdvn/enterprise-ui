import { KpiCard, KpiGrid, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './KpiGridPage.module.css';

const props: PropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Các thẻ KpiCard (hoặc phần tử bất kỳ) được xếp vào lưới.',
  },
  {
    name: 'minCardWidth',
    type: 'number',
    default: '220',
    description:
      'Chiều rộng tối thiểu mỗi thẻ trước khi xuống dòng; giá trị không hợp lệ rơi về 220, nhỏ hơn 120 bị nâng lên 120.',
  },
];

const code = `import { KpiCard, KpiGrid } from '@enterprise-ui/components';

export function RevenueKpis() {
  return (
    <KpiGrid minCardWidth={200}>
      <KpiCard label="Đơn hàng" value="1.284" delta="+8,2%" deltaTone="green" />
      <KpiCard label="Doanh thu" value="₫ 2,45 tỷ" delta="+12,5%" deltaTone="green" />
      <KpiCard label="Khách mới" value="312" delta="-3,1%" deltaTone="red" />
      <KpiCard label="Tồn kho" value="86%" delta="Không đổi" deltaTone="neutral" />
    </KpiGrid>
  );
}`;

const kpis = [
  { label: 'Đơn hàng', value: '1.284', delta: '+8,2% so với tuần trước', tone: 'green' },
  { label: 'Doanh thu', value: '₫ 2,45 tỷ', delta: '+12,5% so với tuần trước', tone: 'green' },
  { label: 'Khách mới', value: '312', delta: '-3,1% so với tuần trước', tone: 'red' },
  { label: 'Tồn kho', value: '86%', delta: 'Không đổi so với tuần trước', tone: 'neutral' },
] as const;

export default function KpiGridPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>KpiGrid</h1>
      <p className={styles.subtitle}>
        Lưới thẻ KPI tự động xuống dòng theo chiều rộng tối thiểu của mỗi thẻ.
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
                    <h2 className={styles.sectionTitle}>4 thẻ KPI (mặc định)</h2>
                    <KpiGrid>
                      {kpis.map((kpi) => (
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
                      minCardWidth mặc định 220px — lưới dùng{' '}
                      <code>repeat(auto-fill, minmax(220px, 1fr))</code> nên số cột thay đổi theo bề
                      rộng khung chứa.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>minCardWidth nhỏ hơn</h2>
                    <KpiGrid minCardWidth={150}>
                      {kpis.map((kpi) => (
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
                      minCardWidth 150 — nhồi được nhiều cột hơn trên cùng bề rộng; nội dung dài tự
                      cắt bằng dấu ba chấm.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Nhiều thẻ (tự xuống dòng)</h2>
                    <KpiGrid minCardWidth={180}>
                      {[...kpis, ...kpis].map((kpi, index) => (
                        <KpiCard
                          key={`${kpi.label}-${index}`}
                          label={`${kpi.label} (${index + 1})`}
                          value={kpi.value}
                          delta={kpi.delta}
                          deltaTone={kpi.tone}
                        />
                      ))}
                    </KpiGrid>
                    <p className={styles.helper}>
                      8 thẻ — auto-fill giữ mỗi thẻ tối thiểu 180px rồi wrap thành nhiều hàng khi
                      thiếu chỗ.
                    </p>
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
