# Column Resize Design Spec (P2b — Table column resizing)

Date: 2026-10-16
Status: Draft
Base: `docs/superpowers/specs/2026-10-12-datagrid-design.md` (spec Table hiện tại, đã merge PR #6)

## 1. Intent & why

Table hỗ trợ pin + width khai báo nhưng cột không đổi được độ rộng lúc chạy:
cột nội dung dài (tên khách hàng, ghi chú) hoặc cửa sổ hẹp buộc user chịu
layout của dev. Resize kéo thả ở header cho phép chỉnh từng cột, giữ nguyên
mọi tính năng (sort, pin, filter, group, virtual, expand).

## 2. Goals / Non-goals

Goals:

- G1: Tay cầm resize ở mép phải mỗi header cell (trừ cột control select/expand
  và cột pin-right? — vẫn resize được, offset tính lại).
- G2: Kéo thả chuột đổi width cột đó (controlled qua `columnWidths +
onColumnWidth`), Table không giữ state.
- G3: Keyboard: focus tay cầm, ←/→ đổi 8px (Shift: 32px).
- G4: Min width 40px, không max (grid scroll ngang lo phần còn lại).
- G5: Chiều rộng mới tương tác đúng với pin offsets + virtual template
  (dùng chung `gridTemplateOf`).
- G6: Double-click tay cầm reset về mặc định qua `onColumnWidthReset`.

Non-goals: auto-fit đo nội dung, drag-reorder cột, ẩn/hiện cột, lưu layout
xuống localStorage (caller tự làm với `columnWidths` controlled).

## 3. Constraints (kế thừa)

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)`; controlled
(`columnWidths?: Record<string, number>`, `onColumnWidth?(key, width)`);
hiện tại `Column.width` là width khai báo — khi `columnWidths[key]` tồn tại
nó thắng `Column.width`. Presentational-only; keyboard + focus-ring; Vitest
globals on.

## 4. API

```ts
export interface Column<T> {
  /* giữ nguyên: width là giá trị khởi đầu */
}

export interface TableProps<T> {
  columnWidths?: Record<string, number>; // default {}
  onColumnWidth?: (key: string, width: number) => void;
  onColumnWidthReset?: (key: string) => void; // double-click: caller xóa key
  resizable?: boolean; // default false — opt-in như virtual
  minColumnWidth?: number; // default 40
}
```

Hành vi:

- Header cell (data columns, không áp cho control tracks) render tay cầm
  `<button class="resizeHandle" aria-label="Đổi rộng cột {title}"
aria-valuemin/max/now?>` — dùng `role="separator" aria-orientation=
"vertical"` + keyboard arrows; đơn giản nhất: button + keydown.
- Drag: pointerdown trên handle → theo dõi pointermove trên window → width =
  startWidth + dx, clamp min; pointerup commit mỗi move qua `onColumnWidth`
  (live) — Table không tự lưu.
- Double-click tay cầm = reset về width khai báo: gọi `onColumnWidthReset?(key)`,
  caller xóa key khỏi `columnWidths` để về mặc định. Tách callback riêng vì
  `onColumnWidth(key, width)` không phân biệt được reset vs set số.
- Pin offsets + template dùng effective width (`columnWidths[key] ??
column.width`) — một chỗ tính duy nhất.
- Touch: pointer events cover touch (không logic riêng).

## 5. Tests (acceptance)

- `Table.test.tsx`: drag handle (pointerdown/move/up) gọi `onColumnWidth`
  với width tăng đúng dx, clamp min 40; keyboard ←/→ ±8, Shift ±32;
  double-click gọi `onColumnWidthReset`; width mới vào template + pin offset;
  `resizable=false` (default) không render handle.
- Showcase: DataGridDemoPage thêm toggle resize + reset (chứng minh controlled).

## 6. Done khi

1. Kéo + phím + double-click đều có test xanh.
2. Pin/virtual/filter/group dùng chung effective width (không drift).
3. Zero deps, tsc strict, lint/format sạch, 2 builds pass, full suite xanh.
