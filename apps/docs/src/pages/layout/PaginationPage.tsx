import { useState } from 'react';
import { Pagination, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './PaginationPage.module.css';

const props: PropDoc[] = [
  {
    name: 'page',
    type: 'number',
    description: 'Trang hiện tại, bắt đầu từ 1 (controlled).',
  },
  {
    name: 'pageSize',
    type: 'number',
    description: 'Số dòng trên mỗi trang.',
  },
  {
    name: 'total',
    type: 'number',
    description: 'Tổng số dòng dùng để tính số trang.',
  },
  {
    name: 'onChange',
    type: '(page: number) => void',
    description: 'Gọi khi người dùng chuyển trang hoặc dùng ô nhập “Đi tới”.',
  },
];

const code = `import { useState } from 'react';
import { Pagination } from '@enterprise-ui/components';

export function OrdersFooter() {
  const [page, setPage] = useState(1);

  return <Pagination page={page} pageSize={10} total={95} onChange={setPage} />;
}`;

export default function PaginationPage() {
  const [basicPage, setBasicPage] = useState(3);
  const [manyPage, setManyPage] = useState(1);
  const [sizePage, setSizePage] = useState(2);
  const basicStart = (basicPage - 1) * 10 + 1;
  const basicEnd = Math.min(basicPage * 10, 95);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Pagination</h1>
      <p className={styles.subtitle}>
        Phân trang controlled kèm khoảng hiển thị, cửa sổ 5 số trang và ô nhập “Đi tới”.
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
                    <h2 className={styles.sectionTitle}>Cơ bản</h2>
                    <Pagination page={basicPage} pageSize={10} total={95} onChange={setBasicPage} />
                    <p className={styles.helper}>
                      Trang hiện tại: {basicPage} — hiển thị dòng {basicStart}–{basicEnd} trên 95
                      dòng.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Nhiều trang</h2>
                    <Pagination page={manyPage} pageSize={10} total={487} onChange={setManyPage} />
                    <p className={styles.helper}>
                      49 trang — cửa sổ chỉ hiển thị 5 số trang quanh trang hiện tại, các trang còn
                      lại truy cập qua ô “Đi tới”.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Kích thước trang tùy chỉnh</h2>
                    <Pagination page={sizePage} pageSize={25} total={95} onChange={setSizePage} />
                    <p className={styles.helper}>pageSize 25 — 95 dòng chia thành 4 trang.</p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Không có dữ liệu</h2>
                    <Pagination page={1} pageSize={10} total={0} />
                    <p className={styles.helper}>
                      total 0 — khoảng hiển thị “0-0 / 0” và chỉ còn một trang.
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
