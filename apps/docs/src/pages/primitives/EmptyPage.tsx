import { Button, Empty, Table, Tabs, useToast } from '@enterprise-ui/components';
import type { Column } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './EmptyPage.module.css';

const props: PropDoc[] = [
  {
    name: 'description',
    type: 'string',
    default: "'Không có dữ liệu'",
    description: 'Mô tả hiển thị bên dưới biểu tượng.',
  },
  {
    name: 'action',
    type: 'ReactNode',
    description: 'Hành động (thường là Button) hiển thị bên dưới mô tả.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Biểu tượng tuỳ chỉnh phía trên; mặc định là khung vuông SVG.',
  },
];

interface OrderRow {
  code: string;
  customer: string;
  total: string;
}

const orderColumns: Column<OrderRow>[] = [
  { key: 'code', title: 'Mã đơn' },
  { key: 'customer', title: 'Khách hàng' },
  { key: 'total', title: 'Giá trị' },
];

const emptyOrders: OrderRow[] = [];

const searchIcon = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="21" cy="21" r="13" />
    <path d="M31 31l9 9" />
  </svg>
);

const code = `import { Button, Empty } from '@enterprise-ui/components';

export function OrdersEmpty() {
  return (
    <Empty
      description="Chưa có đơn hàng nào"
      action={
        <Button variant="primary" size="sm">
          Tạo đơn hàng
        </Button>
      }
    />
  );
}`;

export default function EmptyPage() {
  const { toast } = useToast();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Empty</h1>
      <p className={styles.subtitle}>
        Khối trạng thái rỗng với biểu tượng, mô tả và hành động tuỳ chỉnh.
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
                    <h2 className={styles.sectionTitle}>Mặc định</h2>
                    <Empty />
                    <p className={styles.note}>
                      Mặc định hiển thị khung vuông SVG và mô tả Không có dữ liệu.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Với hành động</h2>
                    <Empty
                      description="Không tìm thấy kết quả phù hợp"
                      action={
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toast.success('Đã xoá bộ lọc')}
                        >
                          Xoá bộ lọc
                        </Button>
                      }
                    />
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Biểu tượng tuỳ chỉnh</h2>
                    <Empty icon={searchIcon} description="Không tìm thấy kết quả nào" />
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Trong Table</h2>
                    <Table columns={orderColumns} data={emptyOrders} status="empty" />
                    <p className={styles.note}>
                      Table có sẵn trạng thái rỗng qua status=&apos;empty&apos;; dùng Empty cho các
                      khối nội dung tự dựng cần mô tả hoặc hành động riêng.
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
