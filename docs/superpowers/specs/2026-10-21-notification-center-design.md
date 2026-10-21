# Notification Center — Design Spec (Sub-project: P2)

**Date:** 2026-10-21
**Status:** Approved (owner: "tiếp tục thôi" — P2 item thứ tư sau SavedViews #23, Tree #24, Steps #25, FileUpload #26).
**Base:** `main` `f2158d9` (sau SavedViews merge). Composes với Icon system + Button.

## 1. Intent & why

- ERP cần thông báo sự kiện (đơn mới, phê duyệt, cảnh báo) có thể xem lại. Một bell icon kèm badge
  số chưa đọc + panel dropdown liệt kê thông báo, đánh dấu đã đọc, xoá.

## 2. Goals / Non-goals

Goals:

- **G1** Bell trigger (Button ghost) kèm badge cam số chưa đọc; click mở panel dropdown.
- **G2** Panel: danh sách thông báo (title, body, time, kind icon), empty state, "Đánh dấu đã đọc
  tất cả" khi có unread.
- **G3** Per-item: click → `onSelect(id)`; nút × → `onRemove(id)`; nút "đã đọc" → `onMarkRead(id)`.
- **G4** A11y: trigger `aria-haspopup="dialog"`, `aria-expanded`, `aria-label`; panel `role="dialog"`
  (mixed content); danh sách `<ul>`/`<li>`; badge `aria-label="N thông báo chưa đọc"`; Esc đóng;
  click-away đóng; focusout đóng; focus trap nhẹ (Tab trong panel).
- **G5** Popover positioning: fixed, flip-up nếu tràn (re-use Combobox machinery: GAP 4, chrome, resize
  re-place).
- **G6** Presentational-only: `notifications`, `onSelect/onMarkRead/onMarkAllRead/onRemove` qua props.

Non-goals:

- **N1** Real-time push (WebSocket) — parent owns data.
- **N2** Grouping theo ngày/kind.
- **N3** Persistent read state — parent owns.
- **N4** Sound/vibration.

## 3. Components & API

```ts
export type NotificationKind = 'info' | 'success' | 'warning' | 'danger';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  time: string; // pre-formatted by parent
  unread?: boolean;
  kind?: NotificationKind;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead?: () => void;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
```

## 4. Decisions

- **D1** Component mới `NotificationCenter/` — không nhét vào AppShell (AppShell sidebar khác).
- **D2** Badge chỉ hiển thị khi có unread > 0; cap "9+" khi > 9.
- **D3** Icon theo kind: info→bell? Actually kind icon: info→info, success→check, warning→alert-triangle,
  danger→alert-circle (tất cả có trong IconName).
- **D4** Empty state: "Không có thông báo" + icon inbox.
- **D5** Docs page `pages/feedback/NotificationCenterPage.tsx` + route; demo với fake notifications.
- **D6** IME-safe không liên quan (không input text) — N/A.

## 5. Risks

- Popover machinery lại 1 lần nữa — tái sử dụng pattern Combobox/SavedViews (containment, focusout,
  resize, IME n/a) để không mở lớp bug cũ.
- Badge màu cam (#F97316) ~10% — chỉ dùng cho count badge, đúng quy ước accent.

## 6. Open questions

- Không.
