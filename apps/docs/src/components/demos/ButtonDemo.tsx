import { useState } from 'react';
import { Button, Icon } from '@enterprise-ui/components';
import styles from './demos.module.css';

const variants = ['primary', 'secondary', 'ghost', 'danger', 'accent', 'success'] as const;

export function ButtonDemo() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Sáu biến thể</h4>
        <div className={styles.row}>
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kích thước</h4>
        <div className={styles.row}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="md" variant="secondary">
            Secondary md
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Icon và trạng thái</h4>
        <div className={styles.row}>
          <Button icon={<Icon name="plus" size={14} />}>Tạo đơn</Button>
          <Button variant="secondary" icon={<Icon name="download" size={14} />}>
            Xuất CSV
          </Button>
          <Button loading>Đang lưu…</Button>
          <Button variant="danger" disabled>
            Không thể xoá
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Tương tác</h4>
        <div className={styles.row}>
          <Button variant="accent" onClick={() => setClicks((value) => value + 1)}>
            Bấm thử
          </Button>
          <span className={styles.helper}>
            {clicks === 0 ? 'Chưa có lần bấm nào.' : `Đã bấm ${clicks} lần.`}
          </span>
        </div>
      </section>
    </div>
  );
}
