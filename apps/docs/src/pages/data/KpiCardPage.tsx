import { KpiCard, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './KpiCardPage.module.css';

const props: PropDoc[] = [
  {
    name: 'label',
    type: 'string',
    description: 'Nhãn nhỏ phía trên giá trị.',
  },
  {
    name: 'value',
    type: 'ReactNode',
    description: 'Giá trị chính — nhận cả chuỗi đã định dạng (số, tiền, phần trăm).',
  },
  {
    name: 'delta',
    type: 'ReactNode',
    description: 'Chuỗi chênh lệch kèm chấm màu; giá trị rỗng/0 không hiển thị.',
  },
  {
    name: 'deltaTone',
    type: "'green' | 'red' | 'neutral'",
    default: "'neutral'",
    description: 'Màu của chấm delta (tăng / giảm / trung tính).',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Biểu tượng ở góc phải; được bọc aria-hidden vì chỉ mang tính trang trí.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Slot biểu đồ bên dưới delta — caller tự vẽ (ví dụ sparkline SVG).',
  },
];

const code = `import { KpiCard } from '@enterprise-ui/components';

export function RevenueCard() {
  return (
    <KpiCard
      label="Doanh thu tuần"
      value="₫ 2,45 tỷ"
      delta="+12,5% so với tuần trước"
      deltaTone="green"
    />
  );
}`;

const cartIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M2 2h2l1.6 9.2a1 1 0 0 0 1 .8h6.9a1 1 0 0 0 1-.8L16 5H4.2" />
    <circle cx="7" cy="15.5" r="1.2" />
    <circle cx="13" cy="15.5" r="1.2" />
  </svg>
);

const sparkline = (
  <svg className={styles.sparkline} viewBox="0 0 120 32" role="img" aria-label="Xu hướng 7 ngày">
    <polyline
      points="0,24 20,18 40,21 60,10 80,14 100,6 120,9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export default function KpiCardPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>KpiCard</h1>
      <p className={styles.subtitle}>
        Thẻ số liệu KPI với nhãn, giá trị, delta theo tone, biểu tượng và slot biểu đồ.
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
                    <h2 className={styles.sectionTitle}>Nhãn và giá trị</h2>
                    <div className={styles.cards}>
                      <KpiCard label="Đơn hàng hôm nay" value="1.284" />
                    </div>
                    <p className={styles.helper}>
                      Dạng tối giản: chỉ <code>label</code> và <code>value</code>; giá trị truyền
                      dưới dạng chuỗi đã định dạng.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Delta theo tone</h2>
                    <div className={styles.cards}>
                      <KpiCard
                        label="Doanh thu tuần"
                        value="₫ 2,45 tỷ"
                        delta="+12,5% so với tuần trước"
                        deltaTone="green"
                      />
                      <KpiCard
                        label="Đơn huỷ"
                        value="24"
                        delta="-3,1% so với tuần trước"
                        deltaTone="red"
                      />
                      <KpiCard
                        label="Tồn kho"
                        value="86%"
                        delta="Không đổi so với tuần trước"
                        deltaTone="neutral"
                      />
                    </div>
                    <p className={styles.helper}>
                      <code>deltaTone</code> chỉ đổi màu chấm tròn (xanh / đỏ / trung tính) — dấu và
                      nội dung delta do caller quyết định.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Biểu tượng</h2>
                    <div className={styles.cards}>
                      <KpiCard
                        label="Doanh thu tháng"
                        value="₫ 8,9 tỷ"
                        delta="+9,8% so với tháng trước"
                        deltaTone="green"
                        icon={cartIcon}
                      />
                    </div>
                    <p className={styles.helper}>
                      <code>icon</code> nằm ở góc phải nhãn, kế thừa màu chữ mờ qua{' '}
                      <code>currentColor</code>.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Xu hướng (slot children)</h2>
                    <div className={styles.cards}>
                      <KpiCard
                        label="Người dùng hoạt động"
                        value="18.420"
                        delta="+6,4% so với tuần trước"
                        deltaTone="green"
                      >
                        {sparkline}
                      </KpiCard>
                    </div>
                    <p className={styles.helper}>
                      KpiCard không vẽ biểu đồ — <code>children</code> là slot tự do cho sparkline
                      hoặc chart do caller cung cấp.
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
