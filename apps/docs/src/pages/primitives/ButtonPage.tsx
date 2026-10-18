import { Button, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './ButtonPage.module.css';

const props: PropDoc[] = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'success'",
    default: "'primary'",
    description: 'Biến thể màu sắc của nút.',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'sm'",
    description: 'Kích thước nút.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Hiển thị trạng thái đang xử lý và tự động vô hiệu hóa nút.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Vô hiệu hóa nút, không nhận tương tác.',
  },
  {
    name: 'onClick',
    type: '(e: MouseEvent<HTMLButtonElement>) => void',
    description: 'Gọi khi người dùng bấm nút.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Nội dung bên trong nút.',
  },
];

const code = `import { Button } from '@enterprise-ui/components';

export function Actions() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="primary" onClick={() => alert('Đã lưu')}>
        Lưu
      </Button>
      <Button variant="secondary">Hủy</Button>
      <Button variant="ghost">Bỏ qua</Button>
      <Button variant="danger" loading>
        Đang xóa...
      </Button>
      <Button variant="success" loading>
        Đang lưu...
      </Button>
      <Button variant="accent" size="md" disabled>
        Nâng cấp
      </Button>
    </div>
  );
}`;

export default function ButtonPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Button</h1>
      <p className={styles.subtitle}>
        Nút hành động với 6 biến thể, 2 kích thước và trạng thái loading/vô hiệu hóa.
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
                    <h2 className={styles.sectionTitle}>Biến thể</h2>
                    <div className={styles.row}>
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="danger">Danger</Button>
                      <Button variant="accent">Accent</Button>
                      <Button variant="success">Success</Button>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Kích thước</h2>
                    <div className={styles.row}>
                      <Button size="sm">Size sm</Button>
                      <Button size="md">Size md</Button>
                      <Button size="md" variant="secondary">
                        Secondary md
                      </Button>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trạng thái</h2>
                    <div className={styles.row}>
                      <Button loading>Đang lưu...</Button>
                      <Button variant="secondary" loading>
                        Tải dữ liệu...
                      </Button>
                      <Button disabled>Vô hiệu hóa</Button>
                      <Button variant="danger" disabled>
                        Không thể xóa
                      </Button>
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
