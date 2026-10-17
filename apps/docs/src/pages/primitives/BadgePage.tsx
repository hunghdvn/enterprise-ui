import { Badge, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './BadgePage.module.css';

const props: PropDoc[] = [
  {
    name: 'tone',
    type: "'blue' | 'orange' | 'green' | 'red' | 'neutral'",
    default: "'neutral'",
    description: 'Tông màu của badge (áp cho chấm màu bên trái).',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Nội dung nhãn; bỏ trống để chỉ hiển thị chấm màu.',
  },
];

const code = `import { Badge } from '@enterprise-ui/components';

export function OrderStatus() {
  return (
    <div>
      <Badge tone="green">Hoàn thành</Badge>
      <Badge tone="orange">Chờ xử lý</Badge>
      <Badge tone="red">Thất bại</Badge>
      <Badge tone="blue">Mới</Badge>
      <Badge>Nháp</Badge>
    </div>
  );
}`;

export default function BadgePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Badge</h1>
      <p className={styles.subtitle}>
        Nhãn trạng thái nhỏ gọn với 5 tông màu, kèm chấm màu phân loại.
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
                    <h2 className={styles.sectionTitle}>Tất cả tông màu</h2>
                    <div className={styles.row}>
                      <Badge tone="blue">Blue</Badge>
                      <Badge tone="orange">Orange</Badge>
                      <Badge tone="green">Green</Badge>
                      <Badge tone="red">Red</Badge>
                      <Badge tone="neutral">Neutral</Badge>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trong ngữ cảnh</h2>
                    <div className={styles.list}>
                      <div className={styles.item}>
                        <span>Đơn hàng #1024</span>
                        <Badge tone="green">Hoàn thành</Badge>
                      </div>
                      <div className={styles.item}>
                        <span>Đơn hàng #1025</span>
                        <Badge tone="orange">Chờ xử lý</Badge>
                      </div>
                      <div className={styles.item}>
                        <span>Đơn hàng #1026</span>
                        <Badge tone="red">Thất bại</Badge>
                      </div>
                      <div className={styles.item}>
                        <span>Đơn hàng #1027</span>
                        <Badge tone="blue">Mới</Badge>
                      </div>
                      <div className={styles.item}>
                        <span>Đơn hàng #1028</span>
                        <Badge>Nháp</Badge>
                      </div>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Chấm màu (dot)</h2>
                    <p className={styles.note}>
                      Badge luôn có chấm màu bên trái (aria-hidden) và chấm đổi màu theo tone. Bỏ
                      trống nội dung để chỉ hiển thị chấm.
                    </p>
                    <div className={styles.row}>
                      <Badge tone="blue" aria-label="Blue" />
                      <Badge tone="orange" aria-label="Orange" />
                      <Badge tone="green" aria-label="Green" />
                      <Badge tone="red" aria-label="Red" />
                      <Badge tone="neutral" aria-label="Neutral" />
                    </div>
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
