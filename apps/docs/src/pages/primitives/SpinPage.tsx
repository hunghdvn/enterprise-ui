import { useEffect, useState } from 'react';
import { Button, Spin, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './SpinPage.module.css';

const props: PropDoc[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Kích thước vòng xoay.',
  },
  {
    name: 'tip',
    type: 'string',
    description: 'Dòng chú thích hiển thị bên dưới vòng xoay.',
  },
  {
    name: 'fullscreen',
    type: 'boolean',
    default: 'false',
    description: 'Phủ lớp mờ toàn màn hình và khoá cuộn trang khi đang xử lý.',
  },
];

const code = `import { Spin } from '@enterprise-ui/components';

export function LoadingPanel() {
  return <Spin size="lg" tip="Đang tải dữ liệu..." />;
}`;

export default function SpinPage() {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const timer = window.setTimeout(() => setFullscreen(false), 2000);
    return () => window.clearTimeout(timer);
  }, [fullscreen]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Spin</h1>
      <p className={styles.subtitle}>
        Vòng xoay báo hiệu đang tải với ba kích thước, chú thích và chế độ toàn màn hình.
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
                    <h2 className={styles.sectionTitle}>Kích thước</h2>
                    <div className={styles.row}>
                      <div className={styles.sizeCell}>
                        <Spin size="sm" />
                        <span className={styles.sizeLabel}>sm</span>
                      </div>
                      <div className={styles.sizeCell}>
                        <Spin size="md" />
                        <span className={styles.sizeLabel}>md</span>
                      </div>
                      <div className={styles.sizeCell}>
                        <Spin size="lg" />
                        <span className={styles.sizeLabel}>lg</span>
                      </div>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Có chú thích (tip)</h2>
                    <div className={styles.row}>
                      <Spin tip="Đang tải dữ liệu..." />
                      <Spin size="lg" tip="Đang xử lý giao dịch..." />
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Toàn màn hình</h2>
                    <div className={styles.row}>
                      <Button variant="primary" onClick={() => setFullscreen(true)}>
                        Bật fullscreen
                      </Button>
                    </div>
                    <p className={styles.note}>
                      Lớp phủ fullscreen khoá cuộn trang và tự đóng sau 2 giây trong demo.
                    </p>
                    {fullscreen && <Spin fullscreen tip="Đang xử lý..." />}
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
