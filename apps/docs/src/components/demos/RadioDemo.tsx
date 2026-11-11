import { useState } from 'react';
import { Radio, RadioGroup } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function RadioDemo() {
  const [channel, setChannel] = useState('email');
  const [layout, setLayout] = useState('list');

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nhóm lựa chọn có kiểm soát</h4>
        <RadioGroup
          legend="Kênh nhận thông báo"
          name="channel"
          value={channel}
          onChange={setChannel}
        >
          <Radio value="email">Email</Radio>
          <Radio value="sms">SMS</Radio>
          <Radio value="push">Thông báo đẩy</Radio>
        </RadioGroup>
        <p className={styles.helper}>
          Đang chọn: <strong>{channel}</strong>
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Ngang và trạng thái</h4>
        <RadioGroup
          legend="Bố cục bảng"
          name="layout"
          orientation="horizontal"
          value={layout}
          onChange={setLayout}
        >
          <Radio value="list">Danh sách</Radio>
          <Radio value="grid">Lưới</Radio>
          <Radio value="locked" disabled>
            Kênh đã khoá
          </Radio>
        </RadioGroup>
        <p className={styles.helper}>
          Bố cục: <strong>{layout}</strong>
        </p>
      </section>
    </div>
  );
}
