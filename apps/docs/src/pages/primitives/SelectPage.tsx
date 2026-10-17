import { useState } from 'react';
import { Select, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './SelectPage.module.css';

const props: PropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Các phần tử <option> hiển thị trong danh sách.',
  },
  {
    name: 'value',
    type: 'string | number | readonly string[]',
    description: 'Giá trị điều khiển (controlled); dùng mảng khi multiple.',
  },
  {
    name: 'onChange',
    type: '(e: ChangeEvent<HTMLSelectElement>) => void',
    description: 'Gọi mỗi khi lựa chọn thay đổi.',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    description: 'Cho phép chọn nhiều mục cùng lúc.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Vô hiệu hóa hộp chọn.',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Thông báo lỗi hiển thị bên dưới; tự gắn aria-invalid và aria-describedby.',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'sm'",
    description: 'Kích thước hộp chọn.',
  },
];

const code = `import { useState } from 'react';
import { Select } from '@enterprise-ui/components';

export function TeamPicker() {
  const [team, setTeam] = useState('eng');

  return (
    <Select value={team} onChange={(e) => setTeam(e.target.value)}>
      <option value="eng">Kỹ thuật</option>
      <option value="sales">Kinh doanh</option>
      <option value="support">Hỗ trợ</option>
    </Select>
  );
}`;

export default function SelectPage() {
  const [team, setTeam] = useState('eng');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Select</h1>
      <p className={styles.subtitle}>
        Hộp chọn thả xuống dựa trên thẻ select gốc, hỗ trợ chọn nhiều, trạng thái lỗi và vô hiệu
        hóa.
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
                    <h2 className={styles.sectionTitle}>Cơ bản (controlled)</h2>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="select-demo-team">
                        Nhóm
                      </label>
                      <Select
                        id="select-demo-team"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className={styles.control}
                      >
                        <option value="eng">Kỹ thuật</option>
                        <option value="sales">Kinh doanh</option>
                        <option value="support">Hỗ trợ</option>
                      </Select>
                      <span className={styles.helper}>Đang chọn: {team}</span>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Chọn nhiều</h2>
                    <div className={styles.field}>
                      <Select
                        multiple
                        size="md"
                        defaultValue={['ui', 'api']}
                        aria-label="Chọn nhiều mục"
                        className={styles.control}
                      >
                        <option value="ui">UI</option>
                        <option value="api">API</option>
                        <option value="db">Database</option>
                        <option value="infra">Hạ tầng</option>
                      </Select>
                      <span className={styles.helper}>
                        Giữ Ctrl (Windows) hoặc Cmd (macOS) để chọn nhiều mục.
                      </span>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hóa</h2>
                    <div className={styles.field}>
                      <Select
                        disabled
                        defaultValue="eng"
                        aria-label="Vô hiệu hóa"
                        className={styles.control}
                      >
                        <option value="eng">Kỹ thuật</option>
                        <option value="sales">Kinh doanh</option>
                      </Select>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trạng thái lỗi</h2>
                    <div className={styles.field}>
                      <Select
                        defaultValue=""
                        error="Vui lòng chọn phòng ban"
                        aria-label="Có lỗi"
                        className={styles.control}
                      >
                        <option value="">— Chọn phòng ban —</option>
                        <option value="hr">Nhân sự</option>
                        <option value="finance">Tài chính</option>
                      </Select>
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
