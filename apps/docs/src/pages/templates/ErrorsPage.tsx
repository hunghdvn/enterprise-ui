import { useState } from 'react';
import { Button, ErrorPage, Tabs, useToast } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './ErrorsPage.module.css';

const errorProps: PropDoc[] = [
  {
    name: 'status',
    type: '403 | 404 | 500',
    description:
      '(bắt buộc) Chọn bộ icon/tiêu đề/mô tả mặc định. Giá trị ngoài ba mã này rơi về nội dung 500 thay vì throw. Mã trạng thái luôn hiển thị dạng text, không chỉ bằng màu.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    default: 'Theo status',
    description: 'Ghi đè tiêu đề; null, chuỗi rỗng hoặc true quay về mặc định của status.',
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
      'Nút hoặc link phục hồi (về trang chủ, thử lại, yêu cầu quyền); caller tự xử lý điều hướng và retry. Mảng rỗng không render khung actions.',
  },
  {
    name: 'level',
    type: '1 | 2 | 3',
    default: '1',
    description:
      'Cấp thẻ tiêu đề; dùng 2 khi template nằm dưới một h1 khác, 3 khi đặt trong modal đã có h2.',
  },
  {
    name: 'as',
    type: "'main' | 'div' | 'section'",
    default: "'main'",
    description:
      'Landmark của trang. Mặc định main đúng cho route độc lập và cho AppShell (vùng nội dung của AppShell là div, nên giữ main mới có landmark). Chỉ dùng div khi trang đã tự render main (các demo docs), section khi cần một region có tên trong trang dài. Chỉ main/section được đặt aria-labelledby trỏ tới tiêu đề — div là generic nên ARIA 1.2 cấm thuộc tính này.',
  },
  {
    name: 'fill',
    type: 'boolean',
    default: 'true',
    description:
      'Chiếm toàn bộ chiều cao viewport (border-box, không tràn scrollbar). Đặt false khi nhúng trong AppShell, modal hoặc khung preview. Là inline-size container: parent shrink-to-fit cần đặt width rõ ràng.',
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

interface StatusDemo {
  status: 403 | 404 | 500;
  primary: string;
  primaryMessage: string;
  secondary: string;
  secondaryMessage: string;
}

const DEMOS: StatusDemo[] = [
  {
    status: 403,
    primary: 'Yêu cầu quyền truy cập',
    primaryMessage: 'Đã gửi yêu cầu cấp quyền (demo).',
    secondary: 'Quay lại',
    secondaryMessage: 'Quay lại (demo) — không đổi route thật.',
  },
  {
    status: 404,
    primary: 'Về trang chủ',
    primaryMessage: 'Về trang chủ (demo) — không đổi route thật.',
    secondary: 'Tìm kiếm',
    secondaryMessage: 'Mở tìm kiếm (demo).',
  },
  {
    status: 500,
    primary: 'Thử lại',
    primaryMessage: 'Thử lại (demo) — chưa gọi API.',
    secondary: 'Liên hệ hỗ trợ',
    secondaryMessage: 'Đã mở kênh hỗ trợ (demo).',
  },
];

export default function ErrorsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<string>('404');

  const items = DEMOS.map((demo) => ({
    key: String(demo.status),
    label: String(demo.status),
    content: (
      <ErrorPage
        status={demo.status}
        level={2}
        as="div"
        fill={false}
        className={styles.preview}
        actions={
          <>
            <Button variant="primary" onClick={() => toast.show(demo.primaryMessage, 'info')}>
              {demo.primary}
            </Button>
            <Button variant="secondary" onClick={() => toast.show(demo.secondaryMessage, 'info')}>
              {demo.secondary}
            </Button>
          </>
        }
      />
    ),
  }));

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>ErrorPage (403 / 404 / 500)</h1>
      <p className={styles.subtitle}>
        Template lỗi route-level với icon, tiêu đề và mô tả mặc định theo status; caller truyền
        actions và tự quyết định điều hướng hay retry.
      </p>
      <DemoPlayground>
        <div className={styles.frame}>
          <Tabs items={items} activeKey={tab} onChange={setTab} variant="pills" />
        </div>
      </DemoPlayground>
      <p className={styles.note}>
        Cả ba demo dùng as=&quot;div&quot; và fill=&#123;false&#125; vì trang docs đã tự render một
        main, và khung preview tự quản chiều cao. Với route độc lập (không header) để mặc định
        as=&quot;main&quot; + fill. Bên trong AppShell thì giữ nguyên as=&quot;main&quot; (vùng nội
        dung của AppShell là div, đổi sang div sẽ mất landmark) và chỉ truyền fill=&#123;false&#125;
        — 100dvh nằm dưới header luôn sinh scrollbar. Modal cũng dùng fill=&#123;false&#125;, và
        level=&#123;3&#125; nếu tiêu đề modal đã là h2.
      </p>
      <h2 className={styles.sectionTitle}>Code</h2>
      <CodeBlock code={code} />
      <h2 className={styles.sectionTitle}>Props</h2>
      <PropsTable props={errorProps} />
    </main>
  );
}
