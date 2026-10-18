# SplitView Drag Resize Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Kéo tay cầm thay đổi kích thước master pane trên SplitView, ở cả trục ngang (width) và dọc (height), có tùy chọn khoá (`resizable`), clamp `minSize/maxSize`, keyboard; Copy pattern pointer đã chứng minh của `Table`.

**Architecture:** Tái cấu trúc SplitView để quay render dựa trên `orientation`, thêm một `Splitter` (role=separator) giữa master–detail. Drag state được lưu ở **cha** (controlled) — SplitView không giữ width nội bộ; mỗi drag delta gọi `onMasterWidthChange`/`onMasterHeightChange`. Pointer logic copy từ `Table.tsx:501-603` (single primary pointer, setPointerCapture, `pointercancel`/`buttons===0` end, pointerdown mới take-over).

**Tech Stack:** React 18 + TS (strict) · CSS Modules · CSS vars (tokens) · vitest/jsdom (fireEvent pointer events) + live browser verify.

**Spec:** docs/superpowers/specs/2026-10-18-splitview-resize-design.md

## Global Constraints

- TS strict; components zero runtime deps; CSS Modules + `var(--…)` tokens only (no hardcoded hex).
- Presentational-only: data in (props), events out (`on…Change`). Cha quyết định size.
- `useIsMobile` (matchMedia 768px) — desktop mới có splitter.
- Icons inline SVG, zero runtime deps (không dùng ở đây — splitter icon dùng CSS).
- Vitest globals on; tests trong `{component}.test.tsx`.
- CI gate: `npm test` → typecheck → lint → format:check → build (3 workspace).

## Review Focus

1. Hai trục width/height đúng (orientation) — test cả 2.
2. Clamp min/max, kể cả khi parent width 0 (default `maxSize=0.8*parent` cần stub `getBoundingClientRect`) — test bounds numeric + default với stub.
3. Right-click / non-primary pointer không bắt đầu drag — test `button!==0`.
4. `pointercancel` / `buttons===0` / lost pointerup kết thúc drag — test không gọi callback sau khi end.
5. Controlled loop: callback → cha update prop → re-render phản ánh size mới — test gọi callback + re-render.

## Files

- **Modify:** `packages/components/src/SplitView/types.ts` (props), `SplitView.tsx` (drag logic + orientation), `SplitView.module.css` (`.splitter`/`.grip`), `SplitView.test.tsx` (tests).
- **Modify:** `apps/docs/src/pages/layout/SplitViewPage.tsx` (demo 3 section + props row).
- **Create:** `apps/showcase/src/pages/SplitViewDemoPage.tsx` + route `apps/showcase/src/App.tsx`.

## Tasks

### Task 1 — Props & Splitter scaffolding

**Files:** Modify `SplitView/types.ts`, `SplitView.tsx:props+root orientation class`, `SplitView.module.css:.splitter`+`aria`, `SplitView.test.tsx`.
**Interfaces:** Produces `orientation`/`resizable`/`minSize`/`maxSize`/`onMasterWidthChange`/`onMasterHeightChange` + Splitter element (`role=separator`, `aria-orientation`, `aria-valuemin/max/now`).

- [ ] Write failing tests: `resizable={false}` → no `[role=separator]`; desktop default → 1 splitter; `orientation="vertical"` → splitter `aria-orientation="horizontal"`; aria-valuemin=280.
- [ ] Run → FAIL.
- [ ] Implement splitter render + types (no drag yet).
- [ ] Run → PASS.
- [ ] Commit `feat(splitview): splitter scaffolding + controlled size props`.

### Task 2 — Pointer drag (horizontal/vertical unified by axis)

**Files:** Modify `SplitView.tsx` (drag handler copy from `Table:501-603`), `SplitView.module.css` (`.dragging` cursor).
**Interfaces:** Consumes Task 1 splitter; produces `onMasterWidthChange`/`onMasterHeightChange` events.

- [ ] Write failing tests: drag right +50px → `onMasterWidthChange(430)`; max clamp (maxSize=600) → cap; right-click `button:2` pointerdown → no call; `pointercancel` ends → next move no call; `buttons===0` move ends.
- [ ] Run → FAIL.
- [ ] Implement drag (single pointer, capture, clamp min/max, axis by orientation).
- [ ] Run → PASS.
- [ ] Commit `feat(splitview): pointer drag resize by axis`.

### Task 3 — Keyboard (parity Table)

**Files:** Modify `SplitView.tsx`. Test: `SplitView.test.tsx`.

- [ ] Tests: `ArrowRight` +8 (clamped to maxSize), `Shift+ArrowRight` +32, `Delete` reset to 380, `ArrowDown` on vertical +8.
- [ ] Run → FAIL.
- [ ] Implement `onKeyDown` on splitter.
- [ ] Run → PASS.
- [ ] Commit `feat(splitview): splitter keyboard resize`.

### Task 4 — Mobile (no splitter)

**Files:** Modify `SplitView.tsx`. Test: `SplitView.test.tsx`.

- [ ] Test: `matchMedia=(true)` → splitter absent; desktop(masterWidth prop) unchanged.
- [ ] Run → FAIL.
- [ ] Implement `!isMobile && <Splitter/>`.
- [ ] Run → PASS.
- [ ] Commit `fix(splitview): hide splitter on mobile`.

### Task 5 — Docs (docs site uses the lib + showcase)

**Files:** Modify `apps/docs/.../SplitViewPage.tsx`, `apps/docs/src/components/PropsTable` row; Create `apps/showcase/src/pages/SplitViewDemoPage.tsx` + route.

- [ ] Add demo sections: kéo ngang, kéo dọc (`orientation="vertical"`), khoá (`resizable={false}`); props row.
- [ ] Build docs + showcase verify no TS error.
- [ ] Commit `docs(splitview): resize demos + showcase page`.

### Task 6 — Gate & PR

- [ ] `npm test` (307+ mới) · `npm --workspaces run typecheck` · `npm run lint` · `npm run format:check` — all green.
- [ ] `npm run build --workspace=components` + `docs` + `showcase`.
- [ ] Live browser (4176): light/dark, drag ngang/dọc, hover cursor, mobile no splitter.
- [ ] Push `feat/splitview-resize` → open PR #16 (review findings #1/#2 không lặp lại).

## Notes for implementer

- Drag delta dùng `clientX`/`clientY` (Table dùng `clientX`). startSize = size prop tại pointerdown (controlled → không cần layout).
- Default `maxSize = 0.8 * splitViewRoot.getBoundingClientRect()[axis]`; trong test dùng props `maxSize` số để không phụ thuộc layout; test default riêng có stub rect.
- `pointercancel` listener + `pointerup` listener + `buttons===0` guard (đảm bảo kết thúc nếu thả ngoài viewport / mất pointerup).
