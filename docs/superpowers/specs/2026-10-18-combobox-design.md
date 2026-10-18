# Combobox: searchable multi-select chips — Design Spec (Sub-project 7)

**Date:** 2026-10-18
**Status:** Approved (user: "làm 7 tiếp luồng").
**Base:** `Select` hiện tại (`packages/components/src/Select/Select.tsx`) = native `<select>` wrapper; multi chỉ qua Ctrl (không chips, không search). Native `<select>` **không làm được** chips/search → phải là component mới `Combobox` (input + popover + filter + chips + keyboard), kiểu Ant `Select[showSearch]/mode="multiple"`.

## 1. Intent & why

- Người dùng cần gõ lọc nhanh trong danh sách dài (searchable) và chọn nhiều mục hiển thị dạng chip/tag (multi-select chips).
- `Select` native không hỗ trợ UI này → tạo `Combobox` mới, `Select` giữ nguyên.

## 2. Goals / Non-goals

Goals:

- **G1** Search filter: gõ vào input thu hẹp `options` (case-insensitive substring trên `searchText` ?? `label` string ?? `value`).
- **G2** Single select: chọn 1 option → `onChange(value: string)`, đóng.
- **G3** Multi (chips): `multiple` → chọn nhiều; mỗi lựa chọn hiện chip removable (×); `onChange(value: string[])`.
- **G4** Keyboard: `ArrowDown/Up` mở/moving highlight, `Enter` chọn, `Escape` đóng, `Backspace` (input rỗng) xóa chip cuối.
- **G5** Controlled (presentational, AGENTS): `value`/`defaultValue` + `onChange`. Không giữ state ngoại trừ filter text nội bộ (uncontrolled filter — không báo ra, chỉ dùng UI).
- **G6** Positioning: popover dưới control; đóng khi click-away / scroll / Escape.
- **G7** A11y: `combobox`/`listbox`/`option`, `aria-expanded/controls/haspopup`, `aria-selected`, highlight qua `aria-orientation`+tabIndex.
- **G8** Icons inline SVG (chips ×, dropdown chevron) — zero runtime deps.

Non-goals: virtual hóa danh sách (scope nhỏ; dùng cuộn tự nhiên), async/remote options (sau), grouping, create-new option.

## 3. API

```ts
export interface ComboboxOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Dùng cho filter nếu label không phải string. */
  searchText?: string;
}
export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[]; // controlled
  defaultValue?: string | string[]; // uncontrolled
  onChange?: (value: string | string[]) => void;
  placeholder?: string; // default 'Chọn...'
  multiple?: boolean;
  searchable?: boolean; // default true
  searchPlaceholder?: string; // default 'Tìm kiếm...'
  minSelectWidth?: number; // px, default 240
  maxDropdownHeight?: number; // px, default 240
  disabled?: boolean;
}
```

- `value` kiểu: `multiple ? string[] : string`. Component overload bằng kiểm tra `multiple` lúc runtime (TS: `string | string[]`).

## 4. Decisions

- **D1** Component mới `Combobox` (không sửa `Select`). Export cùng `Select`.
- **D2** Filter text nội bộ uncontrolled (không gây re-render cha); chỉ filter hiển thị.
- **D3** Chips luôn hiển thị cho selected (multi: nhiều; single: 1 chip) — thống nhất logic.
- **D4** Popover đóng khi: click-away, Escape, scroll (window), Tab mất focus.
- **D5** Positioning: `position: fixed` tính từ `control.getBoundingClientRect()`; cập nhật lại 1 lần khi mở; width = control width; nếu gần mép dưới → mở lên trên (flip) nhanh.
- **D6** Icons: `×` (chip clear) + `▾` chevron — inline SVG (theo Icon system đã có, zero deps).

## 5. Who / outcome

- User: search nhanh, chọn/chọn nhiều, xóa chip, keyboard.
- Dev: controlled value/onChange.

## 6. Test plan (vitest/jsdom — behavioral, khác CSS-only)

- filter: gõ input → danh sách còn lại match.
- single select: click option → onChange(string), popover đóng.
- multi select: chọn 2 → 2 chip, onChange(string[]).
- remove chip (×) → onChange giảm.
- keyboard: ArrowDown mở + highlight; Enter chọn; Escape đóng; Backspace xóa chip cuối khi input rỗng.
- click-away / scroll đóng popover.
- option disabled → không chọn.
- controlled re-render (value prop thay đổi → chip cập nhật).
- a11y: combobox aria-expanded toggle; aria-selected option.

## 7. Files

- Create `packages/components/src/Combobox/{Combobox.tsx, Combobox.module.css, types.ts, index.ts, Combobox.test.tsx}`.
- Re-export `Combobox` (+ `ComboboxOption`) from `src/index.ts`.
- `apps/docs/src/components/PropsTable` already có; tạo `apps/docs/src/pages/form/ComboboxPage.tsx` + route.
- `apps/showcase` (tuỳ chọn).

## 8. Acceptance

- vitest: 318 + ~12 Combobox xanh.
- typecheck / lint / format / builds xanh.
- live: search filter, chip, keyboard, click-away — light/dark, desktop.
