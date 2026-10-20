import { useState } from 'react';
import { FilterBar, SavedViews, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './SavedViewsPage.module.css';

interface OrderFilters {
  search: string;
  status: string;
}

const DEFAULT_FILTERS: OrderFilters = { search: '', status: '' };

interface SavedFilterView {
  id: string;
  label: string;
  value: OrderFilters;
}

const initialViews: SavedFilterView[] = [
  { id: 'v1', label: 'Đơn chờ duyệt', value: { search: '', status: 'pending' } },
  { id: 'v2', label: 'Khách An Phát', value: { search: 'an phát', status: '' } },
];

const props: PropDoc[] = [
  {
    name: 'views',
    type: 'SavedView<T>[]',
    description:
      'Danh sách view đã lưu { id, label, value } — value là snapshot do parent định nghĩa.',
  },
  {
    name: 'activeId',
    type: 'string | null',
    description: 'ID view đang áp dụng; null = filter tự do.',
  },
  { name: 'onApply', type: '(id: string) => void', description: 'Gọi khi chọn một view.' },
  {
    name: 'onSave',
    type: '(label: string) => void',
    description: 'Gọi khi lưu view hiện tại (label đã trim, rỗng thì nút Lưu bị khoá).',
  },
  {
    name: 'onDelete',
    type: '(id: string) => void',
    description: 'Tuỳ chọn — hiện nút × trên từng view khi truyền.',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Kích thước trigger.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Vô hiệu hoá toàn bộ.' },
  {
    name: 'savePlaceholder',
    type: 'string',
    default: "'Tên view...'",
    description: 'Placeholder của ô nhập lưu view.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Views'",
    description: 'Nhãn trigger khi chưa có view nào được áp.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Đặt tên cố định cho trigger (mặc định đặt tên theo nhãn hiển thị).',
  },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ widget.' },
];

const code = `import { useState } from 'react';
import { FilterBar, SavedViews } from '@enterprise-ui/components';

interface Filters {
  search: string;
  status: string;
}

interface SavedFilterView {
  id: string;
  label: string;
  value: Filters;
}

const DEFAULT_FILTERS: Filters = { search: '', status: '' };

export function OrderViews() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [views, setViews] = useState<SavedFilterView[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      <SavedViews
        views={views}
        activeId={activeId}
        onApply={(id) => {
          const view = views.find((v) => v.id === id);
          if (!view) return;
          setFilters(view.value);
          setActiveId(id);
        }}
        onSave={(label) => {
          const id = 'view-' + Date.now();
          setViews([...views, { id, label, value: filters }]);
          setActiveId(id);
        }}
        onDelete={(id) => {
          setViews(views.filter((v) => v.id !== id));
          if (activeId === id) setActiveId(null);
        }}
      />
      <FilterBar
        searchValue={filters.search}
        onSearch={(v) => {
          setFilters({ ...filters, search: v });
          setActiveId(null);
        }}
        onReset={() => {
          setFilters(DEFAULT_FILTERS);
          setActiveId(null);
        }}
      />
    </>
  );
}`;

export default function SavedViewsPage() {
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [views, setViews] = useState<SavedFilterView[]>(initialViews);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Saved Views</h1>
      <p className={styles.subtitle}>
        Lưu và recall bộ filter đặt tên — chọn một view để áp lại bộ lọc, xoá view không còn dùng.
      </p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <section className={styles.demo}>
                    <h2 className={styles.sectionTitle}>Views + FilterBar</h2>
                    <div className={styles.row}>
                      <SavedViews<OrderFilters>
                        views={views}
                        activeId={activeId}
                        onApply={(id) => {
                          const view = views.find((v) => v.id === id);
                          if (!view) return;
                          setFilters(view.value);
                          setActiveId(id);
                        }}
                        onSave={(label) => {
                          const id = `view-${Date.now()}`;
                          setViews([...views, { id, label, value: filters }]);
                          setActiveId(id);
                        }}
                        onDelete={(id) => {
                          setViews(views.filter((v) => v.id !== id));
                          if (activeId === id) setActiveId(null);
                        }}
                      />
                      <FilterBar
                        searchValue={filters.search}
                        onSearch={(v) => {
                          setFilters({ ...filters, search: v });
                          setActiveId(null);
                        }}
                        onReset={() => {
                          setFilters(DEFAULT_FILTERS);
                          setActiveId(null);
                        }}
                      />
                    </div>
                    <p className={styles.helper}>
                      Bộ filter hiện tại: search “{filters.search || '—'}”, status “
                      {filters.status || '—'}”. Sửa filter sẽ bỏ áp view (activeId về null); lưu
                      view chụp lại bộ filter hiện tại.
                    </p>
                  </section>
                  <section className={styles.demo}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hoá</h2>
                    <SavedViews<OrderFilters>
                      views={views}
                      activeId="v1"
                      onApply={() => {}}
                      onSave={() => {}}
                      onDelete={() => {}}
                      disabled
                    />
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
