import { useState } from 'react';
import { Button, PageHeader, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './PageHeaderPage.module.css';

const props: PropDoc[] = [
  {
    name: 'title',
    type: 'ReactNode',
    description: 'Tiêu đề trang (bắt buộc).',
  },
  {
    name: 'subtitle',
    type: 'ReactNode',
    description: 'Dòng mô tả ngắn hiển thị dưới tiêu đề.',
  },
  {
    name: 'actions',
    type: 'ReactNode',
    description: 'Khu vực hành động bên phải — thường là các nút.',
  },
  {
    name: 'onBack',
    type: '() => void',
    description: 'Hiển thị nút quay lại khi được truyền.',
  },
  {
    name: 'backLabel',
    type: 'string',
    default: "'Quay lại'",
    description: 'Nhãn của nút quay lại.',
  },
  {
    name: 'level',
    type: '1 | 2',
    default: '2',
    description: 'Cấp thẻ heading của tiêu đề; trang nên dùng level 1.',
  },
  {
    name: 'className',
    type: 'string',
    default: "''",
    description: 'Class CSS bổ sung cho vùng header.',
  },
];

const code = `import { Button, PageHeader } from '@enterprise-ui/components';

export function OrderDetail() {
  return (
    <PageHeader
      title="Đơn hàng #1042"
      subtitle="Công ty Minh Phát — tạo lúc 09:30, 17/10/2026"
      level={1}
      onBack={() => history.back()}
      backLabel="Về danh sách"
      actions={
        <>
          <Button variant="secondary" size="sm">In hóa đơn</Button>
          <Button variant="primary" size="sm">Chỉnh sửa</Button>
        </>
      }
    />
  );
}`;

export default function PageHeaderPage() {
  const [backCount, setBackCount] = useState(0);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>PageHeader</h1>
      <p className={styles.subtitle}>
        Tiêu đề trang kèm mô tả và khu vực hành động, hỗ trợ nút quay lại cho luồng master–detail.
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
                    <h2 className={styles.sectionTitle}>Chỉ tiêu đề</h2>
                    <div className={styles.panel}>
                      <PageHeader title="Danh sách đơn hàng" />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Mô tả và hành động</h2>
                    <div className={styles.panel}>
                      <PageHeader
                        title="Đơn hàng #1042"
                        subtitle="Công ty Minh Phát — tạo lúc 09:30, 17/10/2026"
                        actions={
                          <>
                            <Button variant="secondary" size="sm">
                              In hóa đơn
                            </Button>
                            <Button variant="primary" size="sm">
                              Chỉnh sửa
                            </Button>
                          </>
                        }
                      />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Nút quay lại và cấp heading</h2>
                    <div className={styles.panel}>
                      <PageHeader
                        title="Chi tiết khách hàng"
                        level={1}
                        onBack={() => setBackCount((count) => count + 1)}
                        backLabel="Về danh sách"
                      />
                    </div>
                    <p className={styles.helper}>Đã bấm quay lại: {backCount} lần</p>
                    <p className={styles.note}>
                      level chỉ đổi thẻ ngữ nghĩa của tiêu đề (h1/h2), không đổi kích thước hiển
                      thị; trang nên dùng level 1.
                    </p>
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
