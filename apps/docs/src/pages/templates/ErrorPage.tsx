import { useState } from 'react';
import { Button, ErrorPage as ErrorPageTemplate, Tabs, useToast } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './ErrorPage.module.css';

const errorProps: PropDoc[] = [
  {
    name: 'status',
    type: '403 | 404 | 500',
    description:
      'Chọn bộ icon/tiêu đề/mô tả mặc định. Mã trạng thái luôn hiển thị dạng text, không chỉ bằng màu.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    default: 'Theo status',
    description: 'Ghi đè tiêu đề; null hoặc chuỗi rỗng quay về mặc định của status.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    default: 'Theo status',
    description: 'Ghi đè mô tả; truyền null hoặc "" để ẩn hẳn đoạn mô tả.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    default: 'Theo status',
    description: 'Ghi đè icon; null để ẩn. Icon mặc định là decorative và bị aria-hidden.',
  },
  {
    name: 'actions',
    type: 'ReactNode',
    description:
      'Nút hoặc link phục hồi (về trang chủ, thử lại, yêu cầu quyền); caller tự xử lý điều hướng và retry.',
  },
  {
    name: 'level',
    type: '1 | 2',
    default: '1',
    description: 'Cấp thẻ tiêu đề; dùng 2 khi template nằm dưới một h1 khác.',
  },
  {
    name: 'as',
    type: "'main' | 'div' | 'section'",
    default: "'main'",
    description:
      'Landmark của trang. Dùng div khi trang đã có main (docs, app shell) để tránh nhiều main.',
  },
  {
    name: 'fill',
    type: 'boolean',
    default: 'true',
    description:
      'Chiếm toàn bộ chiều cao viewport. Đặt false khi nhúng trong khung preview hoặc modal. Là inline-size container: parent shrink-to-fit cần đặt width rõ ràng.',
  },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ.' },
];

const code = `import { Button, ErrorPage } from '@enterprise-ui/components';

export function NotFoundPage() {
  return (
    <ErrorPage
      status={404}
      actions={
        <>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
          <Button variant="secondary" onClick={() => window.location.assign('/')}>
            Về trang chủ
          </Button>
        </>
      }
    />
  );
}`;

type TabKey = '403' | '404' | '500';

export default function ErrorPageDoc() {
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>('404');

  const items = [
    {
      key: '403',
      label: '403',
      content: (
        <ErrorPageTemplate
          status={403}
          level={2}
          as="div"
          fill={false}
          className={styles.preview}
          actions={
            <>
              <Button
                variant="primary"
                onClick={() => toast.show('Đã gửi yêu cầu cấp quyền (demo).', 'info')}
              >
                Yêu cầu quyền truy cập
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.show('Quay lại (demo) — không đổi route thật.', 'info')}
              >
                Quay lại
              </Button>
            </>
          }
        />
      ),
    },
    {
      key: '404',
      label: '404',
      content: (
        <ErrorPageTemplate
          status={404}
          level={2}
          as="div"
          fill={false}
          className={styles.preview}
          actions={
            <>
              <Button
                variant="primary"
                onClick={() => toast.show('Về trang chủ (demo) — không đổi route thật.', 'info')}
              >
                Về trang chủ
              </Button>
              <Button variant="secondary" onClick={() => toast.show('Mở tìm kiếm (demo).', 'info')}>
                Tìm kiếm
              </Button>
            </>
          }
        />
      ),
    },
    {
      key: '500',
      label: '500',
      content: (
        <ErrorPageTemplate
          status={500}
          level={2}
          as="div"
          fill={false}
          className={styles.preview}
          actions={
            <>
              <Button
                variant="primary"
                onClick={() => toast.show('Thử lại (demo) — chưa gọi API.', 'info')}
              >
                Thử lại
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.show('Đã mở kênh hỗ trợ (demo).', 'info')}
              >
                Liên hệ hỗ trợ
              </Button>
            </>
          }
        />
      ),
    },
  ];

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>ErrorPage (403 / 404 / 500)</h1>
      <p className={styles.subtitle}>
        Template lỗi route-level với icon, tiêu đề và mô tả mặc định theo status; caller truyền
        actions và tự quyết định điều hướng hay retry.
      </p>
      <DemoPlayground>
        <div className={styles.frame}>
          <Tabs
            items={items}
            activeKey={tab}
            onChange={(key) => setTab(key as TabKey)}
            variant="pills"
          />
        </div>
      </DemoPlayground>
      <p className={styles.note}>
        Cả ba demo dùng as=&quot;div&quot; và fill=&#123;false&#125; vì trang docs đã có một main và
        khung preview tự quản chiều cao. Trong app thật, để mặc định để template render landmark
        main và chiếm toàn bộ viewport.
      </p>
      <h2 className={styles.sectionTitle}>Code</h2>
      <CodeBlock code={code} />
      <h2 className={styles.sectionTitle}>Props</h2>
      <PropsTable props={errorProps} />
    </main>
  );
}
