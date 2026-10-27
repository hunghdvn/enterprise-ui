# Date Range Picker — Design Spec (Sub-project: P2)

**Date:** 2026-10-21
**Status:** Approved (owner: "tiếp tục thôi" — P2 item thứ năm sau Saved Views #23, Tree #24, Steps #25, FileUpload #26, NotificationCenter #27).
**Base:** `main` `ba242d9` (Tree merged). Composes với Icon system + Button.

## 1. Intent & why

- ERP cần chọn khoảng ngày (báo cáo, filter). P1 dùng native `<input type="date">` styled; P2 cần
  picker có calendar grid + preset nhanh (hôm nay, 7 ngày, 30 ngày) — presentational-only.

## 2. Goals / Non-goals

Goals:

- **G1** Trigger button hiển thị `from → to` (hoặc placeholder) → mở popover calendar.
- **G2** Calendar grid tháng hiện tại: prev/next tháng, chọn ngày bắt đầu → chọn ngày kết thúc,
  highlight range (start, end, in-between).
- **G3** Presets nhanh: Hôm nay, 7 ngày qua, 30 ngày qua, Tháng này → `onApply({from,to})`.
- **G4** A11y: trigger `aria-expanded`/`aria-haspopup="dialog"`; grid `role="grid"` với cells
  `role="gridcell"` + `aria-selected`; Esc đóng; click-away đóng; focus trap nhẹ.
- **G5** Popover positioning: fixed, flip-up nếu tràn (Combobox machinery).
- **G6** Controlled: `{ from, to }` + `onChange({from,to})`; parent owns state.

Non-goals:

- **N1** Multi-month view (1 tháng/lần, prev/next).
- **N2** Time selection (chỉ ngày).
- **N3** Locale formatter (parent format chuỗi hiển thị).
- **N4** Min/max date constraints (parent validate).

## 3. Components & API

```ts
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
```

## 4. Decisions

- **D1** Component mới `DateRangePicker/` — không nhét vào FilterBar (FilterBar giữ search/selects).
- **D2** Calendar grid tự build (zero deps) — P1 spec cho phép custom calendar ở P2.
- **D3** Presets là button trong panel, parent nhận onChange.
- **D4** Ngày trong tháng khác (prev/next month trailing) hiển thị mờ + click được (để chọn cross-month).
- **D5** Docs page `pages/data/DateRangePickerPage.tsx` + route; demo controlled range + presets.
- **D6** Icon: `chevron-left`/`chevron-right` (có), `calendar` (có).

## 5. Risks

- Calendar grid a11y: cells là button (Enter/Space), role=gridcell, aria-selected.
- Range selection UX: click 1 = from, click 2 = to; click thứ 3 bắt đầu range mới.
- IME không liên quan (không input text).

## 6. Open questions

- Không.
