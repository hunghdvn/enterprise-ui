import { useRef, useState } from 'react';
import { FilterBar, SavedViews, Select } from '@enterprise-ui/components';
import type { SavedView } from '@enterprise-ui/components';
import styles from './demos.module.css';

interface OrderFilters {
  search: string;
  status: string;
}

const DEFAULT_FILTERS: OrderFilters = { search: '', status: '' };

const STATUS_OPTIONS = [
  { value: '', label: 'Mọi trạng thái' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'done', label: 'Hoàn thành' },
] as const;

const INITIAL_VIEWS: SavedView<OrderFilters>[] = [
  { id: 'pending', label: 'Đơn chờ duyệt', value: { search: '', status: 'pending' } },
  { id: 'an-phat', label: 'Khách An Phát', value: { search: 'an phát', status: '' } },
  { id: 'done', label: 'Đơn hoàn thành', value: { search: '', status: 'done' } },
];

export function SavedViewsDemo() {
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [views, setViews] = useState<SavedView<OrderFilters>[]>(INITIAL_VIEWS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const nextViewId = useRef(1);

  const activeLabel = views.find((view) => view.id === activeId)?.label ?? 'Bộ lọc tự do';
  const statusLabel =
    STATUS_OPTIONS.find((option) => option.value === filters.status)?.label ?? filters.status;

  const updateFilters = (patch: Partial<OrderFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setActiveId(null);
  };

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Views + FilterBar</h4>
        <div className={styles.toolbar}>
          <SavedViews<OrderFilters>
            views={views}
            activeId={activeId}
            onApply={(id) => {
              const view = views.find((item) => item.id === id);
              if (!view) return;
              setFilters(view.value);
              setActiveId(id);
            }}
            onSave={(label) => {
              const id = `view-${nextViewId.current}`;
              nextViewId.current += 1;
              setViews((current) => [...current, { id, label, value: filters }]);
              setActiveId(id);
            }}
            onDelete={(id) => {
              setViews((current) => current.filter((view) => view.id !== id));
              setActiveId((current) => (current === id ? null : current));
            }}
          />
          <span className={styles.helper}>Đang áp: {activeLabel}</span>
        </div>
        <FilterBar
          searchValue={filters.search}
          onSearch={(value) => updateFilters({ search: value })}
          onReset={() => {
            setFilters(DEFAULT_FILTERS);
            setActiveId(null);
          }}
          filters={
            <Select
              aria-label="Trạng thái đơn"
              value={filters.status}
              onChange={(event) => updateFilters({ status: event.target.value })}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          }
        />
        <p className={styles.helper}>
          Bộ lọc hiện tại: tìm “{filters.search || '—'}”, trạng thái “{statusLabel}”. Sửa bộ lọc sẽ
          bỏ view đang áp; mở widget để lưu bộ lọc thành view mới.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Vô hiệu hoá</h4>
        <SavedViews<OrderFilters>
          views={views}
          activeId={views[0]?.id ?? null}
          onApply={() => {}}
          onSave={() => {}}
          disabled
        />
        <p className={styles.helper}>
          Khi disabled, trigger bị khoá và popover đang mở sẽ đóng lại — không thể áp hay lưu view.
        </p>
      </section>
    </div>
  );
}
