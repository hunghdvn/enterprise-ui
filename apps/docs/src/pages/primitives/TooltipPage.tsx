import { Button, Tabs, Tooltip } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './TooltipPage.module.css';

const props: PropDoc[] = [
  {
    name: 'content',
    type: 'ReactNode',
    description: 'Nội dung hiển thị trong bong bóng tooltip.',
  },
  {
    name: 'children',
    type: 'ReactElement',
    description: 'Phần tử được bọc; nhận sự kiện hover/focus để hiện tooltip.',
  },
  {
    name: 'placement',
    type: "'top' | 'bottom' | 'left' | 'right'",
    default: "'top'",
    description: 'Vị trí ưu tiên; tự đảo phía khi sát biên cửa sổ.',
  },
  {
    name: 'delay',
    type: 'number',
    default: '200',
    description: 'Thời gian trễ (ms) trước khi tooltip xuất hiện.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Class gắn lên phần tử bọc (wrapper) quanh trigger — không áp vào bong bóng tooltip.',
  },
];

const code = `import { Button, Tooltip } from '@enterprise-ui/components';

export function SaveButton() {
  return (
    <Tooltip content="Lưu thay đổi (⌘S)" placement="top">
      <Button variant="primary">Lưu</Button>
    </Tooltip>
  );
}`;

export default function TooltipPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tooltip</h1>
      <p className={styles.subtitle}>
        Bong bóng gợi ý hiện khi hover hoặc focus, hỗ trợ bốn vị trí và độ trễ tuỳ chỉnh.
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
                    <h2 className={styles.sectionTitle}>Bốn vị trí</h2>
                    <div className={styles.placementGrid}>
                      <Tooltip content="Tooltip phía trên" placement="top">
                        <Button variant="secondary">Trên</Button>
                      </Tooltip>
                      <Tooltip content="Tooltip phía dưới" placement="bottom">
                        <Button variant="secondary">Dưới</Button>
                      </Tooltip>
                      <Tooltip content="Tooltip bên trái" placement="left">
                        <Button variant="secondary">Trái</Button>
                      </Tooltip>
                      <Tooltip content="Tooltip bên phải" placement="right">
                        <Button variant="secondary">Phải</Button>
                      </Tooltip>
                    </div>
                    <p className={styles.note}>
                      Tooltip tự đảo sang phía đối diện khi không đủ chỗ sát biên cửa sổ; nhấn
                      Escape để ẩn ngay.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Độ trễ tuỳ chỉnh</h2>
                    <div className={styles.row}>
                      <Tooltip content="Tooltip mặc định (200ms)">
                        <Button variant="secondary">Mặc định</Button>
                      </Tooltip>
                      <Tooltip content="Tooltip sau 1 giây" delay={1000}>
                        <Button variant="secondary">delay=1000</Button>
                      </Tooltip>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trên Button</h2>
                    <div className={styles.row}>
                      <Tooltip content="Lưu thay đổi (⌘S)" placement="top">
                        <Button variant="primary">Lưu thay đổi</Button>
                      </Tooltip>
                      <Tooltip content="Hành động không thể hoàn tác" placement="top">
                        <Button variant="danger">Xoá vĩnh viễn</Button>
                      </Tooltip>
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
