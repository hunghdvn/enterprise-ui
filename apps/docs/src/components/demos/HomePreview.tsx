import { Badge, Button, Icon, KpiCard, KpiGrid } from '@enterprise-ui/components';
import styles from './HomePreview.module.css';

const bars = [42, 58, 51, 72, 64, 88, 76, 94, 81, 67, 90, 100];

const orders = [
  { code: 'SO-1024', customer: 'Cty An Phát', status: 'Hoàn thành', tone: 'green' as const },
  { code: 'SO-1025', customer: 'Cty Minh Đức', status: 'Đang giao', tone: 'blue' as const },
  { code: 'SO-1026', customer: 'Cty Hoà Bình', status: 'Chờ duyệt', tone: 'orange' as const },
];

export function HomePreview() {
  return (
    <div className={styles.preview}>
      <div className={styles.topbar}>
        <div className={styles.title}>
          <strong>Bảng điều khiển</strong>
          <span>Tháng 11 · 2026</span>
        </div>
        <Button size="sm" variant="secondary" icon={<Icon name="refresh" size={14} />}>
          Làm mới
        </Button>
      </div>

      <KpiGrid minCardWidth={170}>
        <KpiCard
          label="Doanh thu"
          value="₫ 2,48 tỷ"
          delta="+12,4%"
          deltaTone="green"
          icon={<Icon name="trending-up" size={16} />}
        />
        <KpiCard
          label="Đơn hàng"
          value="1.284"
          delta="+8,1%"
          deltaTone="green"
          icon={<Icon name="package" size={16} />}
        />
        <KpiCard
          label="Tồn đọng"
          value="23"
          delta="-4,2%"
          deltaTone="red"
          icon={<Icon name="clock" size={16} />}
        />
      </KpiGrid>

      <div className={styles.panels}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Doanh thu theo tuần</span>
            <Badge tone="blue">12 tuần</Badge>
          </div>
          <div className={styles.chart} aria-hidden="true">
            {bars.map((height, index) => (
              <div key={index} className={styles.bar} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className={styles.legend}>
            <span>Tuần 1</span>
            <span>Tuần 12</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Đơn hàng gần đây</span>
            <Badge tone="neutral">3</Badge>
          </div>
          <ul className={styles.orders}>
            {orders.map((order) => (
              <li key={order.code}>
                <div className={styles.orderMeta}>
                  <strong>{order.customer}</strong>
                  <span>{order.code}</span>
                </div>
                <Badge tone={order.tone}>{order.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
