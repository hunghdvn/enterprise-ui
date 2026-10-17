import { useState } from 'react';
import { FilterBar, Input, Select, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './FilterBarPage.module.css';

const props: PropDoc[] = [
  {
    name: 'searchValue',
    type: 'string',
    description: 'Giá trị ô tìm kiếm (controlled).',
  },
  {
    name: 'onSearch',
    type: '(value: string) => void',
    description: 'Gọi mỗi khi ô tìm kiếm thay đổi; caller tự áp dụng vào dữ liệu.',
  },
  {
    name: 'filters',
    type: 'ReactNode',
    description: 'Các control lọc thêm (Select, Input ngày…) render cạnh ô tìm kiếm.',
  },
  {
    name: 'onReset',
    type: '() => void',
    description: 'Hiện nút “Đặt lại”; caller tự xoá toàn bộ state lọc khi được gọi.',
  },
  {
    name: 'densityToggle',
    type: 'boolean',
    default: 'trong ThemeProvider: true',
    description: 'Hiện nút chuyển mật độ; mặc định bật khi có ThemeProvider, tắt khi không có.',
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    default: "'Tìm kiếm…'",
    description: 'Chữ gợi ý trong ô tìm kiếm.',
  },
];

const code = `import { useState } from 'react';
import { FilterBar, Input, Select } from '@enterprise-ui/components';

export function OrdersFilterBar() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');

  return (
    <FilterBar
      searchValue={search}
      onSearch={setSearch}
      searchPlaceholder="Tìm mã đơn, khách hàng…"
      filters={
        <>
          <Select aria-label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="open">Chờ duyệt</option>
            <option value="done">Hoàn thành</option>
          </Select>
          <Input
            type="date"
            aria-label="Từ ngày"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </>
      }
      onReset={() => {
        setSearch('');
        setStatus('');
        setFrom('');
      }}
    />
  );
}`;

export default function FilterBarPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [quickSearch, setQuickSearch] = useState('');
  const [compactSearch, setCompactSearch] = useState('');
  const [compactStatus, setCompactStatus] = useState('');

  const resetAll = () => {
    setSearch('');
    setStatus('');
    setFrom('');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>FilterBar</h1>
      <p className={styles.subtitle}>
        Thanh lọc dữ liệu: ô tìm kiếm, các control lọc thêm, nút đặt lại và nút chuyển mật độ.
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
                    <h2 className={styles.sectionTitle}>Tìm kiếm + bộ lọc + Đặt lại</h2>
                    <FilterBar
                      searchValue={search}
                      onSearch={setSearch}
                      searchPlaceholder="Tìm mã đơn, khách hàng…"
                      filters={
                        <>
                          <Select
                            aria-label="Trạng thái"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                          >
                            <option value="">Tất cả trạng thái</option>
                            <option value="open">Chờ duyệt</option>
                            <option value="shipping">Đang giao</option>
                            <option value="done">Hoàn thành</option>
                          </Select>
                          <Input
                            type="date"
                            aria-label="Từ ngày"
                            value={from}
                            onChange={(event) => setFrom(event.target.value)}
                          />
                        </>
                      }
                      onReset={resetAll}
                    />
                    <p className={styles.helper}>
                      Từ khoá: {search || '—'} · Trạng thái: {status || 'tất cả'} · Từ ngày:{' '}
                      {from || '—'}. FilterBar thuần trình bày — mọi giá trị nằm ở state của trang
                      này, <code>onReset</code> tự xoá cả ba.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Chỉ tìm kiếm</h2>
                    <FilterBar
                      searchValue={quickSearch}
                      onSearch={setQuickSearch}
                      searchPlaceholder="Tìm nhanh…"
                    />
                    <p className={styles.helper}>
                      Không truyền <code>filters</code> hay <code>onReset</code> — thanh chỉ còn ô
                      tìm kiếm và nút mật độ (mặc định bật vì trang nằm trong ThemeProvider).
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Tắt nút mật độ</h2>
                    <FilterBar
                      searchValue={compactSearch}
                      onSearch={setCompactSearch}
                      densityToggle={false}
                      filters={
                        <Select
                          aria-label="Trạng thái"
                          value={compactStatus}
                          onChange={(event) => setCompactStatus(event.target.value)}
                        >
                          <option value="">Tất cả trạng thái</option>
                          <option value="open">Chờ duyệt</option>
                          <option value="done">Hoàn thành</option>
                        </Select>
                      }
                    />
                    <p className={styles.helper}>
                      <code>densityToggle={'{false}'}</code> — dùng khi mật độ đã có chỗ chuyển khác
                      trong trang.
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
