# DataGrid Design Spec (P2 — Table nâng cấp)

Date: 2026-10-12
Status: Draft
Base: `docs/superpowers/specs/2026-10-11-enterprise-ui-design.md` (P1, đã merge) + `packages/components/src/Table/` hiện tại trên `main`

## 1. Intent & why

Table P1 render toàn bộ rows, sort đơn cột, không pin cột tuỳ chọn, không
expand, mobile chỉ scroll ngang. Với đơn hàng/kho vận vài nghìn–10k dòng,
trang đơ, không sort đa cấp (mã + ngày + giá trị), cột mã/trạng thái trôi
mất khi scroll, không xem chi tiết ngay trong bảng, mobile khó đọc.

Đợt này nâng `Table` tại chỗ thành grid ERP đọc được 10k rows, giữ nguyên
triết lý P1: presentational-only (parent truyền data, nhận event), CSS
Modules + `var(--...)`, zero runtime deps, TS strict.

## 2. Goals / Non-goals / Anti-goals

Goals:
- G1: 10k rows scroll mượt bằng windowing opt-in, DOM rows < ~60.
- G2: Multi-sort có thứ tự ưu tiên, single-sort là trường hợp riêng.
- G3: Pin cột trái/phải tuỳ chọn, scroll ngang vẫn thấy cột chốt.
- G4: Master-detail: expand 1 row xem chi tiết ngay dưới row đó (controlled).
- G5: Mobile (<=768px) render card-list thay grid khi caller cung cấp
  `renderCard`, có fallback mặc định khi không cung cấp.
- G6: Filter header: dòng filter ngay dưới header (text/select/number/date
  theo cột), controlled qua `columnFilters + onColumnFilter`.
- G7: Group theo 1+ cột: group header row gộp, collapse/expand từng nhóm,
  group summary (count/sum) + summary footer tổng.
- G8: Phân trang: tái dùng `Pagination` dưới grid, DataGrid nhận
  `pagination + onPage` passthrough, giữ selection global.
- G9: Export CSV: nút Export tải CSV theo cột visible + data đã
  filter/sort (BOM UTF-8 cho Excel VN), caller override qua `onExport`.
- G10: Mọi API P1 khác (select, summary, status, render cell) giữ nguyên
  hành vi; demo P1 không vỡ (trừ sort đổi API có migrate).

Non-goals:
- Column resize, drag-reorder, ẩn/hiện cột (để đợt sau).
- Variable row height đo runtime, cell editing, virtual cột ngang.
- Server pagination/sort trong grid, saved views, tree, wizard, upload,
  notification center, date-range picker custom.

Anti-goals (thất bại dù test xanh):
- Tự bật virtual theo ngưỡng row count (gây bất ngờ render).
- Table tự sort data (vi phạm presentational-only).
- Thêm dep ngoài (react-window,…) hay hex cứng trong CSS.

## 3. Constraints (kế thừa P1 + AGENTS.md)

- Zero runtime deps ngoài react/react-dom; cấm tailwind/antd/mui/headless.
- TS strict, cấm `any` (dùng `unknown` + narrow).
- Styling duy nhất `*.module.css` + `var(--...)`; cấm hex cứng trong
  components; cấm import CSS chéo giữa components.
- Tokens: primary `#1E47C4`, hover `#1E40AF`, pale `#EFF6FF`, accent
  `#F97316` ~10%, neutral light bg `#F8FAFC` surface `#FFFFFF` border
  `#E2E8F0` text `#0F172A` muted `#64748B`, dark bg `#0F172A` surface
  `#1E293B` border `#334155` text `#F8FAFC` muted `#94A3B8`.
- Theme qua `<ThemeProvider>` → `data-theme`/`data-density`, default
  light + compact, persist localStorage; row compact 32px / comfortable 44px.
- Presentational-only: data qua props, event qua `onSort`/`onSelect`/
  `onToggleExpand`, không fetch.
- Contrast ≥4.5:1 light+dark; keyboard + focus-ring xanh; grid dùng
  `role=grid`, `aria-sort` trên columnheader.
- Folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`,
  re-export từ `src/index.ts` (components và public types).
- Vitest globals on (`test`/`expect`/`vi` không cần import).

## 4. Decisions

1. **Một grid duy nhất là `Table`, không thêm component grid thứ hai.**
   Mọi tính năng (sort, pin, virtual, filter-row, group, expand, card,
   summary, pagination footer, export) đều mở rộng `Table/` tại chỗ.
   `Pagination`/`FilterBar` vẫn tồn tại như mảnh ghép rời, không phải grid.
2. **Sort mảng có thứ tự.** `sorts: SortEntry[]` + `onSort(next)`.
   Click thường: none→asc→desc→none cho cột đó. Shift/Ctrl/Cmd+Click:
   thêm/đảo cột đó trong mảng, giữ các entry khác. Table không sort data.
   Breaking duy nhất so với P1 (`sortKey`/`sortDir`/`onSort(key)`), chấp
   nhận vì lib 0.1.0 và chỉ showcase nội bộ dùng — plan migrate showcase
   + tests P1 sang API mới.
3. **Virtual opt-in, row cao cố định.** Props `virtual?: boolean`
   (default false), `rowHeight?: number` (default 32), `overscan?: number`
   (default 8). Bật virtual mới windowing; không tự bật. Chiều cao cố
   định theo density do caller truyền (32 compact / 44 comfortable).
   Scroll container là `.scroll` sẵn có; inner spacer cao tổng, rows
   absolute theo offset. `status` empty/error/loading thắng virtual.
4. **Helper windowing pure.** `src/internal/windowing.ts`:
   `computeWindow(scrollTop, viewportHeight, rowHeight, total, overscan)`
   → `{ start, end, offsetY }`; `contentHeight(count, rowHeight)`.
   Công thức: `start = max(0, floor(scrollTop/rowHeight) - overscan)`,
   `end = min(total, ceil((scrollTop+viewportHeight)/rowHeight) + overscan)`,
   `offsetY = start*rowHeight`. Clamp: rowHeight<=0 → 1, total<0 → 0.
5. **Pin cột khai báo tường minh.** `Column` thêm `pinned?: 'left'|'right'`
   và `width?: number` (px). Cột pin dùng `width px`, cột thường
   `minmax(width ?? min, 1fr)` để vẫn scroll ngang. Sticky offsets cộng dồn
   qua CSS var set inline. Giữ sticky first/last mặc định của P1.
6. **Master-detail controlled, cao gấp bội cố định.** `renderExpanded?(row)`,
   `expandedKeys?: string[]`, `onToggleExpand?(key)`. Cột toggle thêm ở
   đầu (sau select nếu có), `aria-expanded`. Detail là 1 `role=row` với
   gridcell `aria-colspan` full. Khi virtual, detail chiếm slots theo
   `expandedHeight?` (default `round(rowHeight*2.5)`), không đo runtime.
7. **Card-list mobile theo breakpoint + hook mới.** `renderCard?(row)`,
   `cardHeight?` (default `round(rowHeight*2.5)`). Hook
   `src/internal/useIsMobile.ts`: `useIsMobile(breakpoint=768)` bọc
   matchMedia, SSR-safe default false. Mobile + có renderCard (hoặc dùng
   fallback) → render list `<article>`; virtual áp dụng cho cả card mode.
   Fallback khi thiếu renderCard: cột đầu làm title, các cột còn lại
   `label: value` (label = column title). Mỗi card có nút Chi tiết gọi
   `onToggleExpand` khi có `renderExpanded`.
8. **Filter header controlled.** `Column` thêm `filterable?: boolean`,
   `filterType?: 'text'|'select'|'number'|'date'`,
   `filterOptions?: { value: string; label: string }[]`.
   `Table` thêm `showFilterRow?: boolean`,
   `columnFilters?: Record<string, string>`, `onColumnFilter?(key, value)`.
   Dòng filter là 1 `role=row` dưới header, mỗi ô là Input/Select native
   styled, Enter/commit gọi callback. Table không tự lọc data.
   Logic lọc/sort/group nằm ở `src/internal/gridLogic.ts` (pure):
   `applyColumnFilters`, `applySorts`, `buildGroups` — có unit test riêng,
   caller/showcase dùng để ra `data` truyền vào Table.
9. **Group + summary.** `groupBy?: string[]`, `collapsedGroups?: string[]`,
   `onToggleGroup?(groupKey)`, `groupSummary?: (key, rows) => ReactNode`.
   Group header là 1 `role=row` với toggle + count, colspan full. Collapse
   ẩn rows nhóm đó. `summary` footer P1 giữ nguyên cho tổng; thêm
   `renderGroupSummary` cho từng nhóm. Virtual + group: group header tính
   như 1 row thường.
10. **Phân trang + export là props của `Table`.** `Table` nhận thêm
    `pagination?: { page, pageSize, total, onPage }` render footer
    `Pagination` có sẵn, cộng `exportable?: boolean`,
    `exportFileName?: string` (default 'datagrid.csv'),
    `onExport?(rows, columns)`. Mặc định `toCSV()` trong
    `internal/exportCsv.ts` (BOM UTF-8, escape quote/comma/newline theo
    RFC4180) rồi tải file qua Blob anchor. Export dùng data đã filter/sort
    hiện visible.

## 5. API

```ts
export interface SortEntry { key: string; dir: 'asc' | 'desc' }

export interface FilterOption { value: string; label: string }

export interface Column<T> {           // mở rộng từ P1
  key: string; title: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  pinned?: 'left' | 'right';
  width?: number;                       // px, bắt buộc khi pinned
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'number' | 'date';
  filterOptions?: FilterOption[];
  aggregate?: 'sum' | 'avg' | 'count';  // gợi ý summary/footer theo cột
}

export interface TablePagination { page: number; pageSize: number; total: number; onPage: (page: number) => void }

export interface TableProps<T> {        // chỉ liệt kê phần mới/đổi
  sorts?: SortEntry[];                  // default []
  onSort?: (next: SortEntry[]) => void; // thay (key: string) => void
  virtual?: boolean;                    // default false
  rowHeight?: number;                   // default 32
  overscan?: number;                    // default 8
  renderExpanded?: (row: T) => ReactNode;
  expandedKeys?: string[];
  onToggleExpand?: (key: string) => void;
  expandedHeight?: number;              // default round(rowHeight*2.5)
  renderCard?: (row: T) => ReactNode;
  cardHeight?: number;                  // default round(rowHeight*2.5)
  showFilterRow?: boolean;              // default false
  columnFilters?: Record<string, string>;
  onColumnFilter?: (key: string, value: string) => void;
  groupBy?: string[];                   // key cột, tối đa 2 ở đợt này
  collapsedGroups?: string[];
  onToggleGroup?: (groupKey: string) => void;
  renderGroupSummary?: (groupKey: string, rows: T[]) => ReactNode;
  pagination?: TablePagination;
  exportable?: boolean;                 // default false
  exportFileName?: string;              // default 'datagrid.csv'
  onExport?: (rows: T[], columns: Column<T>[]) => void;
}

// P1 giữ nguyên: columns, data, selectedKeys/onSelect, rowKey,
// status/onRetry, summary.
```

```ts
// internal/gridLogic.ts (pure, có test riêng)
export function applyColumnFilters<T extends object>(
  rows: T[], filters: Record<string, string>, columns: Column<T>[],
): T[];
export function applySorts<T>(rows: T[], sorts: SortEntry[]): T[];
export interface Group<T> { key: string; label: string; rows: T[] }
export function buildGroups<T extends object>(
  rows: T[], groupBy: string[], rowKey: (r: T, i: number) => string,
): Group<T>[];

// internal/exportCsv.ts (pure)
export function toCSV<T extends object>(
  rows: T[], columns: Column<T>[],
): string;  // BOM + RFC4180 escape
```

Hành vi sort chi tiết: click header sortable khi chưa có entry → push
`{key, asc}`; asc→desc (sửa entry); desc→xoá entry. Shift/Ctrl/Meta+Click
làm điều trên cho đúng cột, giữ nguyên thứ tự các entry khác; click
thường (không modifier) reset mảng chỉ còn entry của cột đó (hoặc rỗng
nếu vừa xoá). `aria-sort`: entry → ascending/descending, thiếu → none.

## 6. Styles

- Thêm class trong `Table.module.css`: `.spacer` (inner cao tổng),
  `.vrow` (absolute rows khi virtual), `.pinL`/`.pinR` (sticky + z-index),
  `.detail` (row mở rộng), `.cards`/`.card` (mobile list).
- Mọi màu qua `var(--...)`; pin giữ nền inherit như P1 để zebra/hover/
  selected không rách; header sticky top, footer sticky bottom giữ nguyên.

## 7. Tests ( acceptance )

- `internal/windowing.test.ts`: biên đầu/cuối, overscan, clamp
  (rowHeight 0/âm, total âm), contentHeight.
- `internal/useIsMobile.test.ts`: stub matchMedia, đổi breakpoint,
  cleanup unsubscribe, SSR-safe (không window → false).
- `Table.test.tsx` mở rộng:
  - sorts: click→asc→desc→none; Shift+Click giữ entry cũ (2 entries);
    `onSort` nhận đúng mảng; aria-sort đúng.
  - virtual 10k: DOM `role=row` (trừ header/filter/footer) < 60;
    scroll `.scroll` đổi cửa sổ.
  - pin trái/phải: cột pin có class sticky + inline offset + width.
  - filter row: nhập ô filter gọi `onColumnFilter(key, value)`; select
    render đủ options; `applyColumnFilters` lọc text/select/number/date.
  - group: `buildGroups` gom đúng; group header toggle gọi
    `onToggleGroup`; collapse ẩn rows; group summary + footer tổng đúng.
  - master-detail: toggle gọi `onToggleExpand(key)`; detail colspan full;
    `aria-expanded` đúng.
  - card: stub mobile + renderCard → cards, không grid; desktop → grid.
  - pagination + export trong Table: đổi trang gọi `onPage`; export gọi
    `onExport` hoặc tải CSV (`toCSV` escape quote/comma/newline + BOM).
  - Tương thích P1: selection merge, summary rowcount/colspan, status
    empty/error/loading vẫn pass sau migrate sang `sorts`.
- Showcase: trang DataGrid demo 10k rows mock + controls sort/pin/filter/
  group/expand/virtual/density + pagination + export; scroll tay mượt.

## 8. Done khi

1. API P1 còn dùng được trừ sort đã migrate; demo P1 không vỡ.
2. 10k rows: DOM rows < 60 mọi thời điểm scroll; scroll tay mượt.
3. Multi-sort, pin, expand, card-list đều có test xanh.
4. Zero deps, tsc strict, lint/format sạch, 2 builds pass (CI giữ nguyên).
5. Showcase có trang DataGrid demo như mục 7.

## 9. Builder được tự quyết

- Tên class CSS cụ thể, miễn giữ sticky/z-index/inherit đúng.
- Cách đo viewportHeight (clientHeight vs prop) và cách gắn scroll listener,
  miễn test scroll fireEvent pass và không leak listener.
- Nội dung trang demo (số cột, mock names) miễn đủ 10k + controls.
