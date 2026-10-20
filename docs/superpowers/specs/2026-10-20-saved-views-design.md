# Saved Views — Design Spec (Sub-project: P2, mục đầu còn lại của kế hoạch chính)

**Date:** 2026-10-20
**Status:** Approved (owner: "quay lại kế hoạch chính" — P2 list, item đầu sau DataGrid-Pro).
**Base:** `main` `4ae8f9f` (sau chuỗi docs-site 8 phần). Composes với `FilterBar` + `Table` hiện có.

## 1. Intent & why

- Người dùng ERP lặp lại cùng tổ hợp filter mỗi ngày (khoảng ngày + trạng thái + khách hàng).
  Saved Views = snapshot filter state đặt tên, recall một cú click.
- Presentational-only: parent sở hữu `views`, `activeId` và toàn bộ filter state — component chỉ
  vẽ UI và báo sự kiện (đúng quy ước ERP của spec chính §4).

## 2. Goals / Non-goals

Goals:

- **G1** Dropdown "Views ▾" mở popover liệt kê các view đã lưu; chọn → `onApply(id)`.
- **G2** Lưu view hiện tại: input inline trong popover + Enter/nút Lưu → `onSave(label)`.
- **G3** Xoá view: nút × trên từng dòng → `onDelete(id)`.
- **G4** Keyboard đầy đủ: ↓↑ di chuyển highlight, Enter apply, Esc đóng, click-away đóng
  (containment theo widget root — bài học Combobox #1), focus-out đóng.
- **G5** A11y: listbox/option + `aria-selected` cho view active, `aria-activedescendant`, label
  rõ cho nút × (không "[object Object]" — dùng label string).
- **G6** Generic `<T>` — value của view là snapshot opaque do parent định nghĩa.
- **G7** IME-safe: gõ tên view khi composing không bị Enter chặn/closes (guard như Combobox).

Non-goals:

- **N1** Persist (localStorage/server) — parent tự lưu; component không storage.
- **N2** Rename — để P2 sau (ghi nhận; không chặn).
- **N3** Business logic phân tích view value (chỉ opaque pass-through).
- **N4** Share view giữa user (cần backend).

## 3. Components & API

```ts
export interface SavedView<T> {
  id: string;
  label: string;
  value: T; // opaque snapshot — parent định nghĩa shape
}

export interface SavedViewsProps<T> {
  views: SavedView<T>[];
  activeId: string | null; // null = chưa áp view nào (filter tự do)
  onApply: (id: string) => void;
  onSave: (label: string) => void;
  onDelete?: (id: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  savePlaceholder?: string; // default 'Tên view...'
  className?: string;
  'aria-label'?: string;
}
```

- Trigger: Button secondary (size theo prop) + chevron; `aria-haspopup="listbox"`,
  `aria-expanded`.
- Popover: role="listbox", option role, `aria-selected` theo `activeId`; save-row là input
  riêng (không phải option); nút × là button trong row (stopPropagation).
- Popover positioning: `position: fixed` tính 1 lần khi mở, flip lên nếu tràn — dựng lại cơ chế
  `openAt` của Combobox (GAP 4px, chrome tính riêng — bài học Combobox #7).

## 4. Decisions

- **D1** Component mới `SavedViews/` — không nhét vào FilterBar (FilterBar giữ vai trò nhập liệu;
  SavedViews là lớp quản lý view đặt trên nó).
- **D2** Icon system cho check/×/chevron — không SVG tay (chuẩn Icon từ S7).
- **D3** ID view do parent sinh (component không tự uuid) — giữ presentational-only.
- **D4** Duplicate label / view rỗng: parent tự xử lý; component dev-warn nếu `views` có id trùng
  (giống Combobox #14).
- **D5** Docs page riêng (`pages/data/SavedViewsPage.tsx`) + route; demo compose FilterBar —
  snippet self-contained (bài học S8).

## 5. Risks

- Popover machinery lại 1 lần nữa — tái sử dụng pattern đã review 6 vòng của Combobox/SplitView
  (containment root, focusout, IME guard, flip math) để không mở lớp bug cũ.
- Generic `<T>` + `views: SavedView<T>[]` — không cần runtime type của value.

## 6. Open questions

- Không — scope khoá theo G1-G7.
