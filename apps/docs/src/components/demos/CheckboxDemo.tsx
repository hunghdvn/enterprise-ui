import { useState } from 'react';
import { Checkbox } from '@enterprise-ui/components';
import styles from './demos.module.css';

const options = [
  { value: 'orders', label: 'Đơn hàng' },
  { value: 'invoices', label: 'Hoá đơn' },
  { value: 'customers', label: 'Khách hàng' },
];

export function CheckboxDemo() {
  const [selected, setSelected] = useState<string[]>(['orders']);

  const toggle = (value: string) => {
    setSelected((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nhóm lựa chọn</h4>
        <div className={styles.row}>
          {options.map((option) => (
            <Checkbox
              key={option.value}
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value)}
            >
              {option.label}
            </Checkbox>
          ))}
        </div>
        <p className={styles.helper}>
          Đang chọn: <strong>{selected.length ? selected.join(', ') : 'không có'}</strong>
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kích thước và trạng thái</h4>
        <div className={styles.row}>
          <Checkbox size="md" defaultChecked>
            Size md
          </Checkbox>
          <Checkbox defaultChecked disabled>
            Đã khoá
          </Checkbox>
          <Checkbox>Chưa chọn</Checkbox>
        </div>
      </section>
    </div>
  );
}
