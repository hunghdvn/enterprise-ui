import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  FilterBar,
  Table,
  applyColumnFilters,
  applySorts,
  toCSV,
  useTheme,
} from '@enterprise-ui/components';
import type { Column, SortEntry } from '@enterprise-ui/components';
import styles from './DataGridDemoPage.module.css';

/** Row shape for the 10k mock — `code` is the stable rowKey. */
type Order = {
  code: string;
  customer: string;
  status: 'open' | 'shipping' | 'done';
  region: string;
  date: string; // ISO yyyy-mm-dd → lexicographic sort = chronological
  total: number;
};

const ROW_COUNT = 10000;
const PAGE_SIZE = 50;

const CUSTOMERS = [
  'Cty An Phát',
  'Cty Minh Đức',
  'Cty Hòa Bình',
  'Cty Sao Mai',
  'Cty Trường Hải',
  'Cty Việt Tiến',
  'Cty Nam Sơn',
  'Cty Đại Nam',
  'Cty Tân Bình',
  'Cty Đông Á',
];

const REGIONS = ['Miền Bắc', 'Miền Trung', 'Miền Nam'];

const STATUS_OPTIONS = [
  { value: 'open', label: 'Chờ duyệt' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'done', label: 'Hoàn thành' },
];

const statusLabel = (value: Order['status']): string =>
  STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value;

const formatVnd = (value: number): string => `₫ ${value.toLocaleString('vi-VN')}`;

function buildRows(): Order[] {
  return Array.from({ length: ROW_COUNT }, (_, i) => ({
    code: `SO-${20000 - i}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    status: i % 10 < 4 ? 'open' : i % 10 < 7 ? 'shipping' : 'done',
    region: REGIONS[i % REGIONS.length],
    date: `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    total: ((i % 48) + 1) * 50_000,
  }));
}

/**
 * DataGrid demo (plan DoD): 10k mock rows driven end-to-end from the
 * showcase — search + column filter row + multi-sort + group + expand + pin
 * + virtual + density + pagination + export. Every transformation happens
 * in this page (`applyColumnFilters`/`applySorts`); `Table` stays
 * presentational and only receives `data` plus events back.
 */
export default function DataGridDemoPage() {
  const { density } = useTheme();
  // Row height follows the density the ThemeProvider sets (compact 32 /
  // comfortable 44): virtual windowing reads the inline height, so the two
  // must stay in lockstep or rows and scroll offsets drift apart.
  const rowHeight = density === 'comfortable' ? 44 : 32;

  const rows = useMemo(() => buildRows(), []);
  const columns = useMemo<Column<Order>[]>(
    () => [
      {
        key: 'code',
        title: 'Mã đơn',
        pinned: 'left',
        width: 130,
        sortable: true,
        filterable: true,
      },
      { key: 'customer', title: 'Khách hàng', width: 200, filterable: true },
      {
        key: 'status',
        title: 'Trạng thái',
        width: 140,
        filterable: true,
        filterType: 'select',
        filterOptions: STATUS_OPTIONS,
        render: (r) => (
          <Badge tone={r.status === 'done' ? 'green' : r.status === 'shipping' ? 'blue' : 'orange'}>
            {statusLabel(r.status)}
          </Badge>
        ),
      },
      { key: 'date', title: 'Ngày', width: 120, sortable: true },
      { key: 'region', title: 'Khu vực', width: 120 },
      {
        key: 'total',
        title: 'Giá trị',
        pinned: 'right',
        width: 130,
        align: 'right',
        sortable: true,
        render: (r) => formatVnd(r.total),
      },
    ],
    [],
  );

  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sorts, setSorts] = useState<SortEntry[]>([{ key: 'code', dir: 'desc' }]);
  const [page, setPage] = useState(1);
  const [paged, setPaged] = useState(true);
  const [grouped, setGrouped] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [virtual, setVirtual] = useState(true);

  // Pipeline: column filters → global search → multi-sort. All pure helpers
  // from the package root — the same ones the component's tests pin.
  const filtered = useMemo(
    () => applyColumnFilters(rows, columnFilters, columns),
    [rows, columnFilters, columns],
  );
  const searched = useMemo(() => {
    const query = search.trim();
    if (!query) return filtered;
    // Global search is an OR over two columns; `applyColumnFilters` is AND
    // per key, so run it once per column and union the hits — same
    // diacritic-insensitive text semantics either way ("an phat" finds
    // "Cty An Phát").
    const hits = new Set([
      ...applyColumnFilters(filtered, { code: query }, columns),
      ...applyColumnFilters(filtered, { customer: query }, columns),
    ]);
    return filtered.filter((row) => hits.has(row));
  }, [filtered, search, columns]);
  const sorted = useMemo(() => applySorts(searched, sorts), [searched, sorts]);

  const total = sorted.length;
  const pageRows = paged ? sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : sorted;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleColumnFilter = (key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const handleReset = () => {
    setSearch('');
    setColumnFilters({});
    setPage(1);
  };
  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) =>
      prev.includes(groupKey) ? prev.filter((k) => k !== groupKey) : [...prev, groupKey],
    );
  };
  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Export via the `onExport` override: the whole filtered+sorted set, not
  // just the rows of the current page (the default path would CSV the
  // `data` the table was handed). Same BOM CSV through a Blob anchor —
  // attached to the document before the click (detached clicks race some
  // browsers) and revoked 100ms later so the download is not cut off early.
  const handleExport = (_rows: Order[], exportColumns: Column<Order>[]) => {
    const blob = new Blob([toCSV(sorted, exportColumns)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'don-hang-10k.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>DataGrid 10.000 dòng</h2>
          <p className={styles.subtitle}>
            Tắt <strong>Phân trang</strong> để scroll toàn bộ 10k dòng (virtual, DOM &lt; 60 row) ·
            Shift+Click sort đa cấp · cột Mã/Giá trị pin cứng · tổng kết nhóm theo Trạng thái.
          </p>
        </div>
        <div className={styles.controls}>
          <Button
            variant="secondary"
            size="sm"
            aria-pressed={paged}
            onClick={() => setPaged((v) => !v)}
          >
            Phân trang: {paged ? 'bật' : 'tắt'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            aria-pressed={grouped}
            onClick={() => setGrouped((v) => !v)}
          >
            Nhóm theo TT
          </Button>
          <Button
            variant="secondary"
            size="sm"
            aria-pressed={virtual}
            onClick={() => setVirtual((v) => !v)}
          >
            Virtual: {virtual ? 'bật' : 'tắt'}
          </Button>
        </div>
      </div>

      <FilterBar
        searchValue={search}
        onSearch={handleSearch}
        onReset={handleReset}
        searchPlaceholder="Tìm mã đơn, khách hàng…"
      />

      <Table<Order>
        columns={columns}
        data={pageRows}
        rowKey={(r) => r.code}
        sorts={sorts}
        onSort={setSorts}
        selectedKeys={selectedKeys}
        onSelect={setSelectedKeys}
        showFilterRow
        columnFilters={columnFilters}
        onColumnFilter={handleColumnFilter}
        groupBy={grouped ? ['status'] : []}
        collapsedGroups={collapsedGroups}
        onToggleGroup={toggleGroup}
        renderGroupSummary={(_key, groupRows) => (
          <span>
            {groupRows.length} đơn · {formatVnd(groupRows.reduce((sum, r) => sum + r.total, 0))}
          </span>
        )}
        renderExpanded={(r) => (
          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <strong>{r.code}</strong> · {r.customer} · {r.region}
            </div>
            <div className={styles.detailGrid}>
              <span>Ngày đặt: {r.date}</span>
              <span>Giá trị: {formatVnd(r.total)}</span>
              <span>Trạng thái: {statusLabel(r.status)}</span>
              <span>3 dòng hàng (mock)</span>
            </div>
          </div>
        )}
        expandedKeys={expandedKeys}
        onToggleExpand={toggleExpand}
        virtual={virtual}
        rowHeight={rowHeight}
        status={pageRows.length === 0 ? 'empty' : 'idle'}
        summary={`Đã lọc ${total.toLocaleString('vi-VN')} / ${ROW_COUNT.toLocaleString('vi-VN')} đơn · đã chọn ${selectedKeys.length.toLocaleString('vi-VN')}`}
        pagination={paged ? { page, pageSize: PAGE_SIZE, total, onPage: setPage } : undefined}
        exportable
        exportFileName="don-hang-10k.csv"
        onExport={handleExport}
      />

      <p className={styles.note}>
        <strong>Mobile (≤768px) — card read-only-flat:</strong> card list render đúng{' '}
        <code>data</code> truyền vào — không checkbox chọn, không dòng filter, không header nhóm,
        không dòng summary trong grid (lọc/sort vẫn áp qua <code>data</code>); nút <em>Chi tiết</em>{' '}
        mở <code>renderExpanded</code> ngay trong card; footer (tóm tắt + phân trang + export) vẫn
        hiển thị dưới cards. Export: trang này truyền <code>onExport</code> nên tải toàn bộ tập đã
        lọc + sắp xếp, trong khi export mặc định của Table (không <code>onExport</code>) chỉ tải CSV
        của trang hiện tại (<code>data</code> truyền vào). Desktop giữ nguyên grid đầy đủ controls.
      </p>
    </div>
  );
}
