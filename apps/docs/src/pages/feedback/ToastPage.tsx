import { Button, Tabs, ToastProvider, useToast } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './ToastPage.module.css';

const providerProps: PropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Cây ứng dụng cần gọi useToast() — provider bọc ngoài cùng.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '3000',
    description: 'Thời gian tự ẩn của mỗi toast (ms), áp dụng cho mọi toast của provider.',
  },
];

const apiProps: PropDoc[] = [
  {
    name: 'toast.success',
    type: '(message: string) => void',
    description: 'Hiện toast tone success (viền trái + chấm xanh lá).',
  },
  {
    name: 'toast.error',
    type: '(message: string) => void',
    description: 'Hiện toast tone error — dùng role="alert" để trình đọc màn hình đọc ngay.',
  },
  {
    name: 'toast.show',
    type: '(message: string, tone?: ToastTone) => void',
    description: "Hiện toast với tone bất kỳ ('success' | 'error' | 'info'); mặc định 'info'.",
  },
  {
    name: 'toasts',
    type: 'ToastItem[]',
    description: 'Danh sách toast đang hiển thị ({ id, message, tone }) — thường chỉ để đọc.',
  },
];

const code = `import { Button, ToastProvider, useToast } from '@enterprise-ui/components';

function SaveButton() {
  const { toast } = useToast();
  return <Button onClick={() => toast.success('Đã lưu đơn hàng')}>Lưu</Button>;
}

export function App() {
  return (
    <ToastProvider duration={3000}>
      <SaveButton />
    </ToastProvider>
  );
}`;

function LongDurationDemo() {
  const { toast } = useToast();
  return (
    <div className={styles.row}>
      <Button
        variant="secondary"
        onClick={() => toast.show('Toast này tự ẩn sau 6 giây thay vì 3 giây', 'info')}
      >
        Hiện toast 6s
      </Button>
    </div>
  );
}

export default function ToastPage() {
  const { toast } = useToast();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Toast</h1>
      <p className={styles.subtitle}>
        Thông báo tạm thời ở góc phải dưới: ba tone success/error/info, tự ẩn theo duration, xếp
        chồng khi có nhiều toast.
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
                    <h2 className={styles.sectionTitle}>Ba tone</h2>
                    <div className={styles.row}>
                      <Button onClick={() => toast.success('Đã lưu đơn hàng SO-1024')}>
                        success
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => toast.error('Kết nối máy chủ thất bại')}
                      >
                        error
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => toast.show('Đang đồng bộ dữ liệu…')}
                      >
                        info (show)
                      </Button>
                    </div>
                    <p className={styles.helper}>
                      <code>toast.success(message)</code> và <code>toast.error(message)</code> là
                      shorthand; <code>toast.show(message, tone?)</code> mặc định tone{' '}
                      <code>info</code>. Không có tone <code>warning</code> — dùng{' '}
                      <code>error</code> hoặc <code>info</code> tuỳ ngữ cảnh.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Nhiều toast xếp chồng</h2>
                    <div className={styles.row}>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          toast.success('Đã xuất file don-hang.csv');
                          toast.error('2 dòng bị bỏ qua vì thiếu mã sản phẩm');
                          toast.show('Đang cập nhật tồn kho…');
                        }}
                      >
                        Bắn 3 toast
                      </Button>
                    </div>
                    <p className={styles.helper}>
                      Toast mới xếp dưới toast cũ trong cùng region cố định góc phải dưới; mỗi toast
                      có timer tự ẩn riêng và nút ✕ để đóng sớm.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Duration tuỳ chỉnh</h2>
                    <ToastProvider duration={6000}>
                      <LongDurationDemo />
                    </ToastProvider>
                    <p className={styles.helper}>
                      <code>duration</code> là prop của <code>ToastProvider</code> (mặc định
                      3000ms), không phải tham số từng lần gọi. Provider lồng nhau có duration riêng
                      — như trên là 6 giây.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Hành vi</h2>
                    <ul className={styles.behaviors}>
                      <li>
                        Region dùng <code>aria-live=&quot;polite&quot;</code>; riêng tone error là{' '}
                        <code>role=&quot;alert&quot;</code> nên được đọc ngay.
                      </li>
                      <li>Mỗi toast tự ẩn sau duration; nút ✕ đóng sớm và huỷ timer.</li>
                      <li>Khi provider unmount, mọi timer đang chờ được dọn sạch.</li>
                    </ul>
                  </section>
                </div>
              </DemoPlayground>
            ),
          },
          {
            key: 'props',
            label: 'Props',
            content: (
              <div className={styles.propsGroups}>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>ToastProvider</h2>
                  <PropsTable props={providerProps} />
                </section>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>useToast()</h2>
                  <PropsTable props={apiProps} />
                </section>
              </div>
            ),
          },
          { key: 'code', label: 'Code', content: <CodeBlock code={code} /> },
        ]}
      />
    </div>
  );
}
