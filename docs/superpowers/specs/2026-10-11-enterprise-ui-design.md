# Enterprise UI — React ERP UI Kit Design Spec

Date: 2026-10-11
Status: Approved design (5/5 sections), awaiting spec review
Repo: enterprise-ui (empty at brainstorm start)

## 1. Mục tiêu & Nguyên tắc

Xây bộ UI React phục vụ web ERP: show được nhiều thông tin, ít màu mè nhưng hiện đại, chuyên nghiệp.

- Dense-data first: mật độ cao, đọc nhanh, thao tác nhanh.
- Ít màu: neutral làm nền, blue làm primary, orange làm accent điểm xuyết ~10%.
- Hiện đại: radius 6px, shadow subtle, Inter/system font, micro-interaction nhẹ.
- Chuyên nghiệp: nhất quán, keyboard/A11y đầy đủ, TypeScript strict, zero runtime deps.

### Phạm vi đã chốt (+ mockup v4)

- Tech: React + TypeScript strict + CSS Modules only (không Tailwind, không AntD/MUI).
- Màu: Blue #1E47C4 primary chốt (khởi đầu #2563EB → thử #1D4ED8 → #1E40AF → chốt giữa #1E47C4), Orange #F97316 accent.
- Responsive: desktop + tablet + mobile. Dark mode + density switch runtime.
- Showcase: Vite site preview/docs/playground.
- Full system nhưng chia 3 phase để không quá tải 1 spec.

## 2. Kiến trúc Monorepo (Đã duyệt Phần 1)

```
enterprise-ui/
  package.json (workspaces)
  packages/
    tokens/
      tokens.css
      theme-light.css
      theme-dark.css
      density.css
      breakpoints.css
      index.ts (export token types nếu cần)
      package.json
    components/
      Button/Button.tsx + Button.module.css + types.ts + index.ts
      Input/..., Select/..., Badge/..., Table/..., DataGrid/...
      AppShell/..., FilterBar/..., Form/..., Modal/..., Drawer/..., Toast/...
      ThemeProvider/ThemeContext.tsx
      index.ts (barrel)
      package.json
  apps/
    showcase/ (Vite + React + TS)
      pages cho từng component + tokens + templates
```

Nguyên tắc cô lập:

- `tokens`: pure CSS variables, không import React.
- `components`: chỉ dùng `var(--...)`, cấm hex cứng, cấm import `.module.css` chéo.
- Mỗi component 1 folder độc lập: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`.
- `showcase` không ship vào lib.
- Build: npm workspaces + tsc + Vite. Publish sau này: `tokens` + `components`.

## 3. Design Tokens & Theming (Đã duyệt Phần 2)

### 3.1 Palette (Đã chốt mockup v4 #1E47C4)

- Blue primary scale (chốt từ mockup: đậm hơn #1D4ED8, nhạt hơn #1E40AF):
  - blue-50 #EFF6FF, blue-100 #DBEAFE, blue-500 #3B82F6, blue-600 #1E47C4 (base - chốt v4), blue-700 #1E40AF (hover), blue-800 #1E3A8A (active/pressed). Ban đầu đề xuất #2563EB, đã tối dần qua #1D4ED8 → #1E40AF → chốt #1E47C4 theo feedback.
- AppShell Sidebar (chốt mockup v2-v4): sidebar TRẮNG chung nền, KHÔNG nền độc lập. Light: bg #FFFFFF + border-right #E2E8F0, active item bg #EFF6FF + border-left 3px #1E47C4 + text #1E47C4. Dark: bg #0F172A + border-right #334155, active bg rgba(30,71,196,.3) + border-left #60A5FA + text #BFDBFE.
- Orange accent (dẫn xuất từ #F97316):
  - orange-50 #FFF7ED, orange-500 #F97316 (base), orange-600 #EA580C (hover). Chỉ dùng cho: CTA thứ cấp, badge highlight, notification dot 8px, warning status, progress/active indicator.
- Neutral light:
  - bg #F8FAFC, surface #FFFFFF, surface-muted #F1F5F9, border #E2E8F0, border-strong #CBD5E1, text #0F172A, text-muted #64748B.
- Neutral dark:
  - bg #0F172A, surface #1E293B, surface-muted #334155, border #334155, text #F8FAFC, text-muted #94A3B8.
- Semantic:
  - success #16A34A, danger #DC2626, info = blue-600, warning = orange-500. Thể hiện bằng dot + text, không tô cả row.

### 3.2 Type, Shape, Depth

- Font: Inter, system-ui, -apple-system, sans-serif. Sizes dense: 12 (caption/table), 13 (body dense), 14 (default), 16 (title). Line-height 1.4-1.5.
- Radius: 6px (button/input/card), 8px (modal/drawer). Không dùng radius tròn quá playful.
- Shadow: `sm: 0 1px 2px rgba(0,0,0,.06)`, `md: 0 4px 12px rgba(0,0,0,.08)`. Border 1px luôn có để phân tách dense content.
- Focus ring: `0 0 0 2px var(--color-blue-100)` + outline blue-600.

### 3.3 Density & Responsive

- `[data-density=compact]`: row-height 32px, cell padding 4px 8px, input height 32px, font 12/13.
- `[data-density=comfortable]`: row-height 44px, cell padding 12px 16px, input height 40px, font 14.
- Breakpoints: `--bp-tablet: 768px`, `--bp-desktop: 1280px`.
  - Desktop: sidebar full 240px + table full.
  - Tablet: sidebar → icon rail 64px, table scroll ngang + sticky cột đầu + sticky action cuối.
  - Mobile: DataGrid → card-list, FilterBar → nút Filters mở Drawer, AppShell → topbar + bottom nav hoặc hamburger.

## 4. Components & ERP Patterns (Đã duyệt Phần 3)

### P1 Core (MVP — phải có để dựng mọi màn ERP, đã chốt mockup v4)

- Primitives: Button (primary #1E47C4/secondary/ghost/danger/accent-orange, loading, sm/md), Input/Search, Select, Checkbox/Radio/Switch, Badge, Tooltip, Empty, Spin.
- Layout: AppShell Sidebar TRẮNG chung nền + Header/Breadcrumb/UserMenu (không nền sidebar độc lập), Tabs, Pagination (pageSize, jumper, total).
- Data dense: Table (sticky header, zebra subtle, hover blue-50, row selection, column resize, sort, empty/error/loading, sticky action), FilterBar (search + select filters + date + density toggle + export + reset), Form (label-top, grid 12-col, inline error, required mark orange/blue), Modal/Drawer/Toast.

### P2 Data-intensive

- DataGrid-Pro: virtualized 10k rows (windowing tự build hoặc virtual đơn giản, không deps ngoài — nếu cần cho phép `react-window` là dep duy nhất, cần xác nhận), sorting multi, pin column, expandable detail row, summary footer (sum/avg), chuyển card-list khi mobile.
- Saved Views (lưu bộ filter), Tree/Org, Steps/Wizard, FileUpload, NotificationCenter, DateRangePicker.

### P3 Templates (không code business, chỉ layout mẫu)

- List-Detail 2-pane (master 380px + detail), Dashboard KPI (4 cards + slot chart — không tự vẽ chart, để `children` cắm recharts/echarts ngoài), Kanban, Calendar, Login/Auth, 403/404/500, Settings/Profile.

Quy ước ERP pattern: presentational-only, không fetch. Parent truyền `data/columns/value`, nhận `onChange/onSort/onFilter/onPage`.

## 5. Quy ước API, Data-flow, Lỗi, A11y (Đã duyệt Phần 4)

### Props chuẩn

```ts
type Size = 'sm' | 'md'; // default 'sm' cho ERP dense
interface BaseProps {
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
```

- Controlled ưu tiên: `value + onChange`. Uncontrolled chỉ cho showcase.
- `className` merge với module css, không break tokens.
- `...rest` spread xuống DOM native để giữ `aria-*`, `data-*`.

### Theme flow

`<ThemeProvider theme='light|dark' density='compact|comfortable'>` → set `data-theme/data-density` lên `<div data-enterprise-ui>` root → CSS đọc vars. Persist localStorage `eui-theme`, `eui-density`. Default: `theme=light`, `density=compact` (chuẩn ERP desktop dense). Switch không reload, transition 120ms.

### Lỗi

- Form: `errors: Record<string,string>`, hiển thị đỏ dưới field + `aria-invalid`.
- Table/Grid: `status: 'idle|loading|empty|error'`, skeleton rows khi loading, Empty illustration + CTA khi empty, Retry button khi error.
- App: `ErrorBoundary` ở AppShell + từng template route. Action fail → Toast danger + log console.

### A11y

- Focus-visible ring xanh, tab order hợp lý, Modal/Drawer trap focus + Esc đóng + return focus.
- Table: `role=grid`, `aria-sort`, sort bằng Enter/Space.
- Màu không phải kênh duy nhất: status luôn có text/icon kèm dot màu.
- Contrast target ≥4.5:1 cả light + dark.

## 6. Testing, Showcase, Gate (Đã duyệt Phần 5)

### Testing

- Vitest + Testing Library: mỗi P1 component có `X.test.tsx` (render, interaction, keyboard, empty/error states).
- DataGrid: test sort/pagination/selection/virtual với 10k rows mock (perf >50fps scroll là mục tiêu manual).
- `tsc --noEmit` strict, ESLint, cấm `any` (dùng `unknown` + narrow).
- Axe-check cho AppShell, Modal, Form, Table.
- Visual matrix tay trong showcase: light/dark × compact/comfortable × 360px/768px/1440px.

### Showcase (apps/showcase)

- Sidebar nav: Tokens, Primitives, Layout, Data, Patterns, Templates.
- Mỗi page: preview + controls (theme/density/size) + code snippet copy + props table.
- Trang Tokens: swatches blue/orange/neutral + contrast ratios.
- Trang Templates: demo List-Detail thật với mock data 500 rows + Dashboard KPI.

### Definition of Done (P1)

1. Dựng được màn List + Detail + Dashboard chỉ bằng P1.
2. Switch dark/density mượt, không FOUC, persist sau reload.
3. Responsive đúng 3 breakpoints, không vỡ layout table.
4. Zero runtime deps (ngoại trừ react), bundle components <150KB gzip (mục tiêu).
5. Contrast pass, keyboard full-flow tạo đơn → duyệt → toast thành công.

## 7. Không làm (YAGNI)

- Không tự build chart lib, drag-gantt phức tạp, rich-text editor ở P1.
- Không i18n framework ở P1 (chỉ để slot `locale` strings, làm EN/VI ở P2 nếu cần).
- Không auth/state management — lib là presentational.

## 8. Rủi ro & Quyết định mở

- Virtualized DataGrid CSS-only khó đạt 10k rows mượt → cho phép 1 dep `react-window`-like ở P2 nếu perf fail, cần approval riêng.
- DatePicker full custom tốn công → P1 dùng native `<input type=date>` styled, P2 mới custom calendar.
- Tên package npm + versioning (changesets?) để lại cho plan.

## 9. Lịch sử mockup (Visual Companion)

- v1: Sidebar xanh đậm nền riêng + Blue #2563EB → user bác nền riêng, muốn xanh tối hơn + demo dark.
- v2: Sidebar trắng chung nền + Blue #1D4ED8 + Light/Dark split → user chọn B, muốn đậm hơn.
- v3: Primary #1E40AF → user muốn giữa v2 và v3.
- v4 CHỐT: Primary #1E47C4 (mid RGB của #1D4ED8 và #1E40AF), sidebar trắng, Light/Dark đã duyệt "ổn rồi đấy". Mockups lưu ở `.superpowers/brainstorm/*/content/erp-mockup-v*.html`.

---

Spec này tổng hợp 5 phần đã được user duyệt chat: Kiến trúc, Tokens, Components, API/Lỗi/A11y, Testing/Showcase.
