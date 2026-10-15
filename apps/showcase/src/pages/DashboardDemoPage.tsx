import { KpiCard, KpiGrid, PageHeader, Table } from '@enterprise-ui/components';
import styles from './DashboardDemoPage.module.css';

const RECENT = [
  { code: 'SO-10482', customer: 'Cty An Phát', total: '₫ 245M' },
  { code: 'SO-10481', customer: 'Cty Minh Đức', total: '₫ 89M' },
  { code: 'SO-10480', customer: 'Cty Hòa Bình', total: '₫ 132M' },
  { code: 'SO-10479', customer: 'Cty Sao Mai', total: '₫ 57M' },
];

export default function DashboardDemoPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Tổng quan kinh doanh" subtitle="Tháng 10 · cập nhật lúc 08:00" />
      <KpiGrid>
        <KpiCard label="Doanh thu" value="₫ 1,2T" delta="+12% so với tháng trước" deltaTone="green">
          <svg viewBox="0 0 100 24" className={styles.spark} aria-hidden="true">
            <polyline
              points="0,20 20,16 40,17 60,10 80,12 100,4"
              fill="none"
              style={{ stroke: 'var(--color-blue-600)' }}
              strokeWidth="2"
            />
          </svg>
        </KpiCard>
        <KpiCard label="Đơn hàng" value="1.024" delta="+8% so với tháng trước" deltaTone="green" />
        <KpiCard label="Tỉ lệ giao đúng hạn" value="96,4%" delta="-0,6 điểm" deltaTone="red" />
        <KpiCard label="Tồn đọng" value="38 đơn" delta="Không đổi" deltaTone="neutral" />
      </KpiGrid>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Đơn hàng gần đây</h3>
        <Table
          columns={[
            { key: 'code', title: 'Mã đơn', sortable: true },
            { key: 'customer', title: 'Khách hàng' },
            { key: 'total', title: 'Giá trị', align: 'right' as const },
          ]}
          data={RECENT}
          summary="4 đơn gần nhất · xem tất cả ở Đơn hàng"
        />
      </div>
    </div>
  );
}
