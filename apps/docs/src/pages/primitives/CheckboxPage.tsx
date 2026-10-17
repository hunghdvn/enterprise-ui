import { useState } from 'react';
import { Checkbox, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './CheckboxPage.module.css';

const props: PropDoc[] = [
  {
    name: 'checked',
    type: 'boolean',
    description: 'Trạng thái chọn (controlled).',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLInputElement>) => void',
    description: 'Gọi khi trạng thái thay đổi; đọc e.target.checked.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Vô hiệu hóa ô chọn.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Nhãn hiển thị bên cạnh ô chọn (label).',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'sm'",
    description: 'Kích thước ô chọn và nhãn.',
  },
];

const code = `import { useState } from 'react';
import { Checkbox } from '@enterprise-ui/components';

export function Notifications() {
  const [checked, setChecked] = useState(true);

  return (
    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
      Nhận thông báo qua email
    </Checkbox>
  );
}`;

export default function CheckboxPage() {
  const [email, setEmail] = useState(true);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Checkbox</h1>
      <p className={styles.subtitle}>
        Ô chọn kèm nhãn với trạng thái chọn/bỏ chọn, vô hiệu hóa và hai kích thước.
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
                    <h2 className={styles.sectionTitle}>Mặc định</h2>
                    <div className={styles.column}>
                      <Checkbox defaultChecked>Nhận thông báo</Checkbox>
                      <Checkbox>Nhận bản tin</Checkbox>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Điều khiển (controlled)</h2>
                    <div className={styles.column}>
                      <Checkbox checked={email} onChange={(e) => setEmail(e.target.checked)}>
                        Nhận thông báo qua email
                      </Checkbox>
                      <span className={styles.helper}>
                        Trạng thái: {email ? 'đang bật' : 'đang tắt'}
                      </span>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hóa</h2>
                    <div className={styles.column}>
                      <Checkbox disabled defaultChecked>
                        Đã khóa (đang chọn)
                      </Checkbox>
                      <Checkbox disabled>Không khả dụng</Checkbox>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Kích thước</h2>
                    <div className={styles.column}>
                      <Checkbox size="sm" defaultChecked>
                        Kích thước sm
                      </Checkbox>
                      <Checkbox size="md" defaultChecked>
                        Kích thước md
                      </Checkbox>
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
