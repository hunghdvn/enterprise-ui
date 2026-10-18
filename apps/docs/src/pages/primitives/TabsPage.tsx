import { useState } from 'react';
import { Tabs } from '@enterprise-ui/components';
import type { TabItem } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './TabsPage.module.css';

const props: PropDoc[] = [
  {
    name: 'items',
    type: 'TabItem[]',
    description: 'Danh sách tab; mỗi mục gồm key, label và content.',
  },
  {
    name: 'activeKey',
    type: 'string',
    description: 'Key của tab đang chọn (controlled). Bỏ trống để Tabs tự quản lý trạng thái.',
  },
  {
    name: 'defaultActiveKey',
    type: 'string',
    description: 'Key của tab chọn sẵn ban đầu khi không điều khiển; mặc định là tab đầu tiên.',
  },
  {
    name: 'onChange',
    type: '(key: string) => void',
    description: 'Gọi khi người dùng chọn tab khác.',
  },
  {
    name: 'size',
    type: "'sm' | 'md'",
    default: "'md'",
    description: 'Kích thước thanh tab.',
  },
  {
    name: 'variant',
    type: "'line' | 'segmented' | 'pills' | 'enclosed'",
    default: "'line'",
    description:
      'Kiểu hiển thị thanh tab: gạch chân (line), segmented, viên (pills) hoặc dạng card gắn liền nội dung (enclosed).',
  },
];

const basicItems: TabItem[] = [
  {
    key: 'overview',
    label: 'Tổng quan',
    content: <p className={styles.panelText}>Nội dung tổng quan của báo cáo.</p>,
  },
  {
    key: 'details',
    label: 'Chi tiết',
    content: <p className={styles.panelText}>Nội dung chi tiết của báo cáo.</p>,
  },
  {
    key: 'history',
    label: 'Lịch sử',
    content: <p className={styles.panelText}>Nội dung lịch sử thay đổi.</p>,
  },
];

const controlledItems: TabItem[] = [
  {
    key: 'revenue',
    label: 'Doanh thu',
    content: <p className={styles.panelText}>Báo cáo doanh thu theo tháng.</p>,
  },
  {
    key: 'costs',
    label: 'Chi phí',
    content: <p className={styles.panelText}>Báo cáo chi phí theo tháng.</p>,
  },
];

const sizeSmItems: TabItem[] = [
  {
    key: 'sm-reports',
    label: 'Báo cáo',
    content: <p className={styles.panelText}>Tab kích thước sm.</p>,
  },
  {
    key: 'sm-exports',
    label: 'Tải về',
    content: <p className={styles.panelText}>Tab kích thước sm.</p>,
  },
];

const sizeMdItems: TabItem[] = [
  {
    key: 'md-members',
    label: 'Thành viên',
    content: <p className={styles.panelText}>Tab kích thước md.</p>,
  },
  {
    key: 'md-invites',
    label: 'Lời mời',
    content: <p className={styles.panelText}>Tab kích thước md.</p>,
  },
];

const variantItems: TabItem[] = [
  {
    key: 'v-overview',
    label: 'Tổng quan',
    content: <p className={styles.panelText}>Nội dung tab.</p>,
  },
  {
    key: 'v-details',
    label: 'Chi tiết',
    content: <p className={styles.panelText}>Nội dung tab.</p>,
  },
  {
    key: 'v-history',
    label: 'Lịch sử',
    content: <p className={styles.panelText}>Nội dung tab.</p>,
  },
];

const code = `import { useState } from 'react';
import { Tabs } from '@enterprise-ui/components';
import type { TabItem } from '@enterprise-ui/components';

const items: TabItem[] = [
  { key: 'overview', label: 'Tổng quan', content: <p>Nội dung tổng quan</p> },
  { key: 'details', label: 'Chi tiết', content: <p>Nội dung chi tiết</p> },
  { key: 'history', label: 'Lịch sử', content: <p>Nội dung lịch sử</p> },
];

export function ReportTabs() {
  const [active, setActive] = useState('overview');

  return <Tabs items={items} variant="pills" activeKey={active} onChange={setActive} />;
}`;

export default function TabsPage() {
  const [active, setActive] = useState('revenue');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tabs</h1>
      <p className={styles.subtitle}>
        Thanh tab điều hướng nội dung với bốn kiểu hiển thị, hai kích thước, hỗ trợ chế độ điều
        khiển và thao tác bàn phím.
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
                    <h2 className={styles.sectionTitle}>Cơ bản (không điều khiển)</h2>
                    <Tabs items={basicItems} />
                    <p className={styles.note}>
                      Dùng phím ← và → để chuyển tab khi thanh tab đang được focus.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Biến thể</h2>
                    <div className={styles.block}>
                      <Tabs items={variantItems} variant="segmented" />
                      <span className={styles.helper}>segmented — chuyển view nhanh</span>
                    </div>
                    <div className={styles.block}>
                      <Tabs items={variantItems} variant="pills" />
                      <span className={styles.helper}>pills — điều hướng dạng viên</span>
                    </div>
                    <div className={styles.block}>
                      <Tabs items={variantItems} variant="enclosed" />
                      <span className={styles.helper}>enclosed — tab gắn liền nội dung</span>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Điều khiển (controlled)</h2>
                    <Tabs items={controlledItems} activeKey={active} onChange={setActive} />
                    <span className={styles.helper}>Tab đang chọn: {active}</span>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Kích thước</h2>
                    <div className={styles.block}>
                      <Tabs items={sizeSmItems} size="sm" />
                      <span className={styles.helper}>Kích thước sm</span>
                    </div>
                    <div className={styles.block}>
                      <Tabs items={sizeMdItems} size="md" />
                      <span className={styles.helper}>Kích thước md</span>
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
