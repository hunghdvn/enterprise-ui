import { useState } from 'react';
import { Button, Drawer, Input, Select, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './DrawerPage.module.css';

const props: PropDoc[] = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Trạng thái mở/đóng (controlled) — khi false Drawer không render gì.',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Gọi khi bấm nút ✕, nhấn Escape hoặc bấm vùng nền (overlay).',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Tiêu đề trên thanh header; cũng là aria-label của hộp thoại.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Nội dung thân drawer — nút hành động đặt ở đây vì API không có prop footer/placement/size.',
  },
];

const code = `import { useState } from 'react';
import { Button, Drawer, Input, Select } from '@enterprise-ui/components';

export function FilterDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Bộ lọc
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Bộ lọc đơn hàng">
        <Input placeholder="Tìm theo mã đơn..." aria-label="Tìm theo mã đơn" />
        <Select defaultValue="all" aria-label="Trạng thái">
          <option value="all">Tất cả trạng thái</option>
          <option value="done">Hoàn thành</option>
          <option value="pending">Chờ duyệt</option>
        </Select>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Đặt lại
          </Button>
          <Button onClick={() => setOpen(false)}>Áp dụng</Button>
        </div>
      </Drawer>
    </>
  );
}`;

export default function DrawerPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Drawer</h1>
      <p className={styles.subtitle}>
        Bảng trượt neo cạnh phải cho nội dung phụ: khoá cuộn nền, trap focus, đóng bằng Escape hoặc
        vùng nền.
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
                    <div className={styles.row}>
                      <Button onClick={() => setBasicOpen(true)}>Mở drawer</Button>
                    </div>
                    <Drawer open={basicOpen} onClose={() => setBasicOpen(false)} title="Thông báo">
                      <p className={styles.paragraph}>
                        Drawer dùng chung cơ chế hộp thoại với Modal: controlled qua{' '}
                        <code>open</code> + <code>onClose</code>.
                      </p>
                    </Drawer>
                    <p className={styles.helper}>
                      Panel luôn neo cạnh phải với chiều rộng min(360px, 90vw) — API không có prop{' '}
                      <code>placement</code> hay <code>size</code>.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Chi tiết đơn hàng</h2>
                    <div className={styles.row}>
                      <Button variant="secondary" onClick={() => setDetailOpen(true)}>
                        Xem SO-1024
                      </Button>
                    </div>
                    <Drawer
                      open={detailOpen}
                      onClose={() => setDetailOpen(false)}
                      title="Đơn hàng SO-1024"
                    >
                      <dl className={styles.fields}>
                        <div className={styles.field}>
                          <dt>Khách hàng</dt>
                          <dd>Công ty Minh Phát</dd>
                        </div>
                        <div className={styles.field}>
                          <dt>Trạng thái</dt>
                          <dd>Đang xử lý</dd>
                        </div>
                        <div className={styles.field}>
                          <dt>Tổng tiền</dt>
                          <dd>12.400.000 ₫</dd>
                        </div>
                      </dl>
                      <p className={styles.paragraph}>
                        Drawer phù hợp cho luồng xem nhanh mà không rời khỏi danh sách phía sau.
                      </p>
                      <div className={styles.actions}>
                        <Button variant="secondary" onClick={() => setDetailOpen(false)}>
                          Đóng
                        </Button>
                      </div>
                    </Drawer>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Bộ lọc dạng drawer</h2>
                    <div className={styles.row}>
                      <Button variant="secondary" onClick={() => setFilterOpen(true)}>
                        Mở bộ lọc
                      </Button>
                      <span className={styles.helper}>
                        Đang lọc: {status === 'all' ? 'tất cả trạng thái' : status}
                        {search ? ` · “${search}”` : ''}
                      </span>
                    </div>
                    <Drawer
                      open={filterOpen}
                      onClose={() => setFilterOpen(false)}
                      title="Bộ lọc đơn hàng"
                    >
                      <div className={styles.filters}>
                        <div className={styles.control}>
                          <label className={styles.label} htmlFor="drawer-search">
                            Tìm kiếm
                          </label>
                          <Input
                            id="drawer-search"
                            placeholder="Mã đơn, khách hàng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                        <div className={styles.control}>
                          <label className={styles.label} htmlFor="drawer-status">
                            Trạng thái
                          </label>
                          <Select
                            id="drawer-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="done">Hoàn thành</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="pending">Chờ duyệt</option>
                          </Select>
                        </div>
                      </div>
                      <div className={styles.actions}>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSearch('');
                            setStatus('all');
                          }}
                        >
                          Đặt lại
                        </Button>
                        <Button onClick={() => setFilterOpen(false)}>Áp dụng</Button>
                      </div>
                    </Drawer>
                    <p className={styles.helper}>
                      Trên mobile, FilterBar có thể chuyển vào Drawer để nhường chỗ cho danh sách
                      (pattern theo spec).
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Hành vi</h2>
                    <ul className={styles.behaviors}>
                      <li>Escape và click vùng nền gọi onClose (click trong panel không đóng).</li>
                      <li>Focus được trap trong panel; đóng drawer focus quay về nút đã mở.</li>
                      <li>Cuộn trang nền bị khoá trong lúc drawer mở.</li>
                      <li>Drawer mở chồng trên Modal: lớp trên cùng nhận Escape và Tab.</li>
                    </ul>
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
