import { useState } from 'react';
import { Input, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './InputPage.module.css';

const props: PropDoc[] = [
  {
    name: 'placeholder',
    type: 'string',
    description: 'Văn bản gợi ý hiển thị khi ô trống.',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Giá trị điều khiển (controlled).',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLInputElement>) => void',
    description: 'Gọi mỗi khi giá trị thay đổi.',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Thông báo lỗi hiển thị bên dưới; tự gắn aria-invalid và aria-describedby.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Vô hiệu hóa ô nhập.',
  },
  {
    name: 'type',
    type: 'HTMLInputTypeAttribute',
    default: "'text'",
    description: 'Loại ô nhập: text, search, password, email, ...',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'sm'",
    description: 'Kích thước ô nhập.',
  },
];

const code = `import { useState } from 'react';
import { Input } from '@enterprise-ui/components';

export function SearchForm() {
  const [email, setEmail] = useState('');

  return (
    <div>
      <label htmlFor="email">Email</label>
      <Input
        id="email"
        type="email"
        placeholder="ten@congty.vn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input error="Email không hợp lệ" defaultValue="sai-dinh-dang" />
    </div>
  );
}`;

export default function InputPage() {
  const [search, setSearch] = useState('');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Input</h1>
      <p className={styles.subtitle}>
        Ô nhập liệu một dòng với hai kích thước, trạng thái lỗi và vô hiệu hóa.
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
                    <div className={styles.field}>
                      <Input
                        placeholder="Nhập nội dung..."
                        aria-label="Mặc định"
                        className={styles.control}
                      />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Có nhãn</h2>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="input-demo-name">
                        Họ và tên
                      </label>
                      <Input
                        id="input-demo-name"
                        placeholder="Nguyễn Văn A"
                        className={styles.control}
                      />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trạng thái lỗi</h2>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="input-demo-email">
                        Email
                      </label>
                      <Input
                        id="input-demo-email"
                        defaultValue="sai-dinh-dang"
                        error="Email không hợp lệ"
                        className={styles.control}
                      />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hóa</h2>
                    <div className={styles.field}>
                      <Input
                        placeholder="Không thể chỉnh sửa"
                        disabled
                        aria-label="Vô hiệu hóa"
                        className={styles.control}
                      />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Kích thước</h2>
                    <div className={styles.field}>
                      <Input
                        size="sm"
                        placeholder="Kích thước sm"
                        aria-label="Kích thước sm"
                        className={styles.control}
                      />
                      <Input
                        size="md"
                        placeholder="Kích thước md"
                        aria-label="Kích thước md"
                        className={styles.control}
                      />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Tìm kiếm (controlled)</h2>
                    <div className={styles.field}>
                      <Input
                        type="search"
                        placeholder="Tìm kiếm..."
                        aria-label="Tìm kiếm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.control}
                      />
                      <span className={styles.helper}>Từ khóa: {search || '—'}</span>
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
