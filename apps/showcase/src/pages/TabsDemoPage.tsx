import { useState } from 'react';
import { Tabs } from '@enterprise-ui/components';
import type { TabItem } from '@enterprise-ui/components';
import styles from './TabsDemoPage.module.css';

const basicItems: TabItem[] = [
  { key: 'overview', label: 'Tổng quan', content: <p>Nội dung tổng quan của tab.</p> },
  { key: 'details', label: 'Chi tiết', content: <p>Nội dung chi tiết của tab.</p> },
  { key: 'history', label: 'Lịch sử', content: <p>Nội dung lịch sử của tab.</p> },
];

export default function TabsDemoPage() {
  const [active, setActive] = useState('overview');
  const controlledItems: TabItem[] = [
    { key: 'overview', label: 'Tổng quan', content: <p>Tab đang chọn: {active}</p> },
    { key: 'details', label: 'Chi tiết', content: <p>Tab đang chọn: {active}</p> },
  ];

  const smallItems: TabItem[] = [
    { key: 'a', label: 'Nhỏ A', content: <p>Nội dung A (size sm).</p> },
    { key: 'b', label: 'Nhỏ B', content: <p>Nội dung B (size sm).</p> },
  ];

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Tabs</h2>
      <p className={styles.subtitle}>Demo các biến thể Tabs.</p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cơ bản</h3>
        <Tabs items={basicItems} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Controlled (active: {active})</h3>
        <Tabs items={controlledItems} activeKey={active} onChange={setActive} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Kích thước nhỏ (sm)</h3>
        <Tabs items={smallItems} size="sm" />
      </section>
    </div>
  );
}
