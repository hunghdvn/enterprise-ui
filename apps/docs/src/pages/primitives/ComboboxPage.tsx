import { useState } from 'react';
import { Combobox, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './ComboboxPage.module.css';

const options = [
  { value: 'vn', label: 'Việt Nam' },
  { value: 'us', label: 'Hoa Kỳ' },
  { value: 'jp', label: 'Nhật Bản' },
  { value: 'kr', label: 'Hàn Quốc' },
  { value: 'de', label: 'Đức' },
  { value: 'fr', label: 'Pháp' },
  { value: 'sg', label: 'Singapore' },
  { value: 'au', label: 'Úc' },
];

const props: PropDoc[] = [
  {
    name: 'options',
    type: 'ComboboxOption[]',
    description: 'Danh sách lựa chọn { value, label, disabled?, searchText? }.',
  },
  {
    name: 'value',
    type: 'string | string[]',
    description: 'Giá trị điều khiển. Dùng mảng khi multiple.',
  },
  {
    name: 'onChange',
    type: '(value: string | string[]) => void',
    description: 'Gọi khi lựa chọn thay đổi.',
  },
  {
    name: 'multiple',
    type: 'boolean',
    default: 'false',
    description: 'Bật chọn nhiều (hiển thị chip).',
  },
  {
    name: 'searchable',
    type: 'boolean',
    default: 'true',
    description: 'Cho phép gõ để lọc danh sách.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Chọn...'",
    description: 'Placeholder khi chưa chọn.',
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    default: "'Tìm kiếm...'",
    description: 'Placeholder khi đã có lựa chọn.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Vô hiệu hóa toàn bộ.' },
  {
    name: 'id',
    type: 'string',
    description: 'Được forward tới <input> để gắn nhãn với <label htmlFor>.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Được forward tới <input> để gửi trong form.',
  },
  {
    name: 'aria-describedby',
    type: 'string',
    description: 'ID của thông báo lỗi/mô tả được forward tới <input>.',
  },
  { name: 'aria-invalid', type: 'boolean', description: 'Đánh dấu lỗi kiểu cho <input>.' },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ widget (.wrap).' },
  {
    name: 'defaultValue',
    type: 'string | string[]',
    description: 'Giá trị ban đầu cho chế độ uncontrolled (khi không truyền value).',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Nhãn a11y cho input (mặc định dùng placeholder).',
  },
  {
    name: 'aria-labelledby',
    type: 'string',
    description: 'ID của phần tử làm nhãn cho input.',
  },
  {
    name: 'minSelectWidth',
    type: 'number',
    default: '240',
    description: 'Chiều rộng tối thiểu của bảng chọn (px).',
  },
  {
    name: 'maxDropdownHeight',
    type: 'number',
    default: '240',
    description: 'Chiều cao tối đa cuộn của danh sách mở xuống (px).',
  },
];

const code = `import { useState } from 'react';
import { Combobox } from '@enterprise-ui/components';

const options = [
  { value: 'vn', label: 'Việt Nam' },
  { value: 'us', label: 'Hoa Kỳ' },
  { value: 'jp', label: 'Nhật Bản' },
];

export function CountrySelect() {
  const [value, setValue] = useState('vn');
  return (
    <Combobox
      options={options}
      value={value}
      onChange={(v) => setValue(v as string)}
      placeholder="Chọn quốc gia..."
    />
  );
}`;

export default function ComboboxPage() {
  const [single, setSingle] = useState('vn');
  const [multi, setMulti] = useState<string[]>(['us', 'jp']);
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Combobox</h1>
      <p className={styles.subtitle}>
        Select tìm kiếm được với hỗ trợ chọn nhiều (chip) cho danh sách dài.
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
                    <h2 className={styles.sectionTitle}>Single (searchable)</h2>
                    <Combobox
                      options={options}
                      value={single}
                      onChange={(v) => setSingle(v as string)}
                      placeholder="Chọn quốc gia..."
                    />
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Multiple (chips)</h2>
                    <Combobox
                      multiple
                      options={options}
                      value={multi}
                      onChange={(v) => setMulti(v as string[])}
                      placeholder="Chọn nhiều..."
                    />
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hóa</h2>
                    <Combobox options={options} disabled />
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
