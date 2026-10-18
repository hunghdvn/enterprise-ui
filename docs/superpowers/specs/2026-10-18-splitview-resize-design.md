# SplitView Drag Resize — Design Spec (Sub-project 6)

**Date:** 2026-10-18
**Base:** hiện tại `SplitView` (`packages/components/src/SplitView/SplitView.tsx`) — master-detail 2 pane, `masterWidth` cố định 380px, mobile→1 pane. Chưa có splitter.
**Precedent nội bộ:** `Table` đã cài pattern drag-resize pointer chứng minh (`Table.tsx` handle `role="separator" @625` + logic `501-603`): single primary pointer, `setPointerCapture`, listener `window` move/up, kết thúc bằng `pointercancel` hoặc `buttons===0`, pointerdown mới "take-over" drag cũ.

## 1. Intent & why

`masterWidth` cố định khiến chỗ trống trên master (tên khách hàng/gi chú dài) hoặc chi tiết bên phải không thỏa đáp ứng dụng. Người dùng cần **kéo tự do tay cầm để to/nhỏ master**, ở **cả hai trục** (dọc = height khi master nằm trên; ngang = width khi master nằm trái), đồng thời dev có thể **khoá kích thước** (`resizable=false`).

## 2. Goals / Non-goals

Goals:

- **G1** Splitter visible (role=separator, aria-orientation, aria-valuemin/max/now) trên desktop, giữa master–detail.
- **G2** Pointer drag (mouse/touch/stylus) resize master theo trục; **event-out** (SplitView không giữ state width — gụi con số cha quyết định), đồng bộ pattern Table.
- **G3** `orientation: 'horizontal'` (mặc định) resize width; `'vertical'` resize height.
- **G4** Khoá: `resizable` (default `true`); `false` → không render splitter, giữ size cố định.
- **G5** Bounds clamp `minSize` (default 280) / `maxSize` (default 0.8 track). Overridable.
- **G6** Keyboard (parity Table): focus splitter, ←/→ (vertical: ↑/↓) ±8px, Shift ±32px, Delete reset về default size.
- **G7** Robust pointer (copy Table `501-603`): guard `button!==0`; `setPointerCapture`; window move/up/cancel; `buttons===0`/`pointercancel` kết thúc; pointerdown mới hủy drag cũ, nhận quyền.
- **G8** Mobile: 1 pane, không splitter, nút back như cũ (`useIsMobile`).

Non-goals (defer minor):

- Persist size qua localStorage (khác với persist theme).
- Double-click tự động resize/expand; splitter collapse kép.

## 3. Decisions (D)

- **D1 API:** giữ `masterWidth?: number` (default 380, trục ngang); thêm `masterHeight?: number` (default 280, trục dọc), `orientation?: 'horizontal'|'vertical'` (default 'horizontal'), `resizable?: boolean` (default true), `onMasterWidthChange?`/`onMasterHeightChange?: (size:number)=>void`, `minSize?: number` (default 280), `maxSize?: number` (default 0.8).
- **D2 Controlled:** prop size + callback → cha update → re-render. Không state width nội bộ (presentational, AGENTS).
- **D3 Splitter trục:** layout ngang → splitter đường thẳng dọc (`aria-orientation=vertical`, cursor `col-resize`); layout dọc → splitter đường thẳng ngang (`aria-orientation=horizontal`, cursor `row-resize`). `aria-valuenow` = size hiện tại.
- **D4 Pointer:** sao chép Table `501-603` (single pointer, capture, buttons===0/cancel kết thúc, take-over mới).
- **D5 Mobile:** splitter ẩn (`!isMobile`); single pane không thay đổi.
- **D6 Styling:** `.splitter` nền `var(--border)`, `.grip` chấm `var(--surface)`; focus ring `var(--focus-ring)` nếu có, ngược lại `outline: 2px solid var(--action)`. CSS module, không inline style.

## 4. Trade-offs

- Controlled-only (không localStorage width) — explicit, mất state ở cha; nhưng nhất quán Table + presentational rule. Chấp nhận.
- Hai prop trục (`masterWidth`/`masterHeight`) thay vì `masterSize` thống nhất — BC (`masterWidth` đã public) + dễ đọc; đổi: hai callback. Chấp nhận.
- Keyboard included (small) — cần a11y cho `role=separator`; thêm test nhưng tính năng nhỏ. Chấp nhận.

## 5. Who / outcome

- **Người dùng:** kéo splitter đọc master rộng hơn hoặc thu hẹp; to/free trong [minSize, maxSize].
- **Dev:** `resizable={false}` khoá; `minSize`/`maxSize` giới hạn; `onMasterWidthChange` persist nếu cần.

## 6. Test plan (vitest/jsdom)

- drag resizes: pointerdown(move) → `onMasterWidthChange` gọi với size clamp; vượt max → clamp.
- right-click (`button===2`) pointerdown → không bắt đầu drag.
- `pointercancel` / `buttons===0` → kết thúc drag.
- keyboard: `ArrowRight` +8, `Shift+ArrowRight` +32, clamp; `Delete` reset 380; vertical dùng ArrowDown.
- `resizable={false}` → không render splitter, callback không bao giờ gọi.
- `orientation='vertical'` → splitter `aria-orientation=horizontal` + path masterHeight.
- mobile (stub `matchMedia` true) → không render splitter.
- CSS (màu/cursor/focus) verify trên browser; jsdom không áp CSS Modules.

## 7. Files (preview)

- `packages/components/src/SplitView/{SplitView.tsx, SplitView.module.css, types.ts, index.ts, SplitView.test.tsx}`
- `apps/docs/src/pages/layout/SplitViewPage.tsx` — thêm section: horizontal drag, vertical drag, locked (`resizable=false`), keyboard. + props row.
- `apps/docs/src/components/` nếu cần; `apps/showcase/src/pages/SplitViewDemoPage.tsx` (tùy chọn).
- kế hoạch: `docs/superpowers/plans/2026-10-18-splitview-resize.md`.

## 8. Acceptance / verification

- vitest green (hiện 307; thêm ~8-10 trường hợp).
- typecheck / lint / format / build 3 workspace xanh.
- live browser (4176, light+dark, desktop): drag thay đổi master width, cursor col-resize, focus ring, mobile ko splitter.
