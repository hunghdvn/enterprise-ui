import { KpiCard } from '@enterprise-ui/components';
import styles from './demos.module.css';
import demoStyles from './KpiCardDemo.module.css';

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M2 2h2l1.6 9.2a1 1 0 0 0 1 .8h6.9a1 1 0 0 0 1-.8L16 5H4.2" />
      <circle cx="7" cy="15.5" r="1.2" />
      <circle cx="13" cy="15.5" r="1.2" />
    </svg>
  );
}

function Sparkline() {
  return (
    <svg
      className={demoStyles.sparkline}
      viewBox="0 0 120 32"
      preserveAspectRatio="none"
      role="img"
      aria-label="Xu hướng người dùng hoạt động trong 7 ngày"
    >
      <polyline
        points="0,24 20,18 40,21 60,10 80,14 100,6 120,9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function KpiCardDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Tối giản</h4>
        <div className={styles.grid}>
          <KpiCard label="Đơn hàng hôm nay" value="1.284" />
          <KpiCard
            label="Doanh thu tháng"
            value="₫ 8,9 tỷ"
            delta="+9,8% so với tháng trước"
            deltaTone="green"
          />
        </div>
        <p className={styles.helper}>
          Chỉ cần <code>label</code> và <code>value</code>; giá trị được truyền dưới dạng chuỗi đã
          định dạng sẵn.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Delta theo tone</h4>
        <div className={styles.grid}>
          <KpiCard
            label="Doanh thu tuần"
            value="₫ 2,45 tỷ"
            delta="+12,5% so với tuần trước"
            deltaTone="green"
          />
          <KpiCard label="Đơn huỷ" value="24" delta="-3,1% so với tuần trước" deltaTone="red" />
          <KpiCard
            label="Tồn kho"
            value="86%"
            delta="Không đổi so với tuần trước"
            deltaTone="neutral"
          />
        </div>
        <p className={styles.helper}>
          <code>deltaTone</code> chỉ đổi màu chấm tròn; nội dung và dấu của delta do caller quyết
          định.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Icon và slot biểu đồ</h4>
        <div className={styles.grid}>
          <KpiCard
            label="Doanh thu tháng"
            value="₫ 8,9 tỷ"
            delta="+9,8% so với tháng trước"
            deltaTone="green"
            icon={<CartIcon />}
          />
          <KpiCard
            label="Người dùng hoạt động"
            value="18.420"
            delta="+6,4% so với tuần trước"
            deltaTone="green"
          >
            <Sparkline />
          </KpiCard>
        </div>
        <p className={styles.helper}>
          <code>icon</code> được đánh dấu <code>aria-hidden</code> vì chỉ mang tính trang trí;{' '}
          <code>children</code> là slot tự do cho sparkline hoặc chart do caller vẽ.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Delta rỗng</h4>
        <div className={styles.grid}>
          <KpiCard label="Đơn nháp" value="0" delta={0} />
          <KpiCard label="Đơn chờ duyệt" value="12" delta="" />
        </div>
        <p className={styles.helper}>
          <code>delta</code> bằng <code>0</code>, chuỗi rỗng hoặc <code>false</code> không render
          chấm màu hay khoảng trống.
        </p>
      </section>
    </div>
  );
}
