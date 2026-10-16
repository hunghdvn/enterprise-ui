# Column Resize Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Opt-in column resizing (drag + keyboard + double-click reset) on `Table`, sharing one effective-width source with pin/virtual/template.

**Architecture:** `Table/` tại chỗ: `columnWidths` override thắng `Column.width` qua một helper `effectiveWidthOf` duy nhất mà `trackOf`/`pinOffsetsOf` cùng dùng; resize handle là phần tử riêng trong header cell với pointer + keyboard handlers.

**Tech Stack:** React 18.3+, TypeScript 5 strict, CSS Modules + `var(--...)`, Vitest globals on.

**Spec:** `docs/superpowers/specs/2026-10-16-column-resize-design.md`

## Global Constraints

- Zero runtime deps ngoài react/react-dom.
- TypeScript strict, cấm `any`.
- Styling `*.module.css` + `var(--...)`, cấm hex cứng, cấm import CSS chéo.
- Controlled hoàn toàn: Table không giữ width state.
- Keyboard + focus-ring; handle có accessible name + `role="separator"`.
- Vitest globals on.

## Review Focus

- Drag ngoài window (pointerup bên ngoài): listener trên window + cleanup, không kẹt trạng thái — test kèm.
- `columnWidths` key lạ (cột không tồn tại) bị bỏ qua, không vỡ template — test kèm.
- Reset khi không có `Column.width` gốc: caller xóa key → track flexible (không rơi về 0) — test kèm.
- Handle không xuất hiện ở control tracks và khi `resizable` false — test kèm.
- Pin + resize cùng lúc: offset bám theo width mới — test kèm.

## File Map

```
packages/components/src/Table/
  types.ts (+ columnWidths/onColumnWidth/onColumnWidthReset/resizable/minColumnWidth)
  Table.tsx (+ effectiveWidthOf, handle, drag/keyboard/dblclick)
  Table.module.css (+ .resizeHandle)
  Table.test.tsx (+ resize suites)
packages/components/src/index.ts (re-export types mới nếu có)
apps/showcase/src/pages/DataGridDemoPage.tsx (+ toggle resize + reset demo)
```

---

### Task 1: Resize trong Table

**Files:** Modify `types.ts`, `Table.tsx`, `Table.module.css`, `Table.test.tsx`, `src/index.ts`.

**Interfaces:** Produces `columnWidths/onColumnWidth/onColumnWidthReset/resizable/minColumnWidth` + `effectiveWidthOf` nội bộ; Task 2 dùng props verbatim.

- [ ] **Step 1: Write failing tests** — handle render khi `resizable` (không ở control tracks, không khi false); pointerdown/move/up → `onColumnWidth` với width = start + dx, clamp min; keyboard ←/→ ±8, Shift ±32; double-click → `onColumnWidthReset`; override thắng `Column.width` trong template + pin offset; key lạ bị bỏ qua.
- [ ] **Step 2: Run** → FAIL (không có handle/props).
- [ ] **Step 3: Implement** — `effectiveWidthOf(columns, columnWidths)`; `trackOf`/`pinOffsetsOf` dùng nó; handle `role="separator"` + pointer handlers (window move/up, cleanup) + keydown + dblclick; CSS handle (mép phải, cursor col-resize, focus-ring, hit-area rộng).
- [ ] **Step 4: Run** → PASS toàn Table suite.
- [ ] **Step 5: Commit** — `feat(table): resizable columns (drag, keyboard, reset)`.

### Task 2: Showcase wiring + full verification

**Files:** Modify `DataGridDemoPage.tsx`.

- [ ] **Step 1: Demo controls** — toggle `resizable` + `columnWidths` state + nút reset-all (xóa state) trên DataGridDemoPage.
- [ ] **Step 2: Full chain** — `npm test`, typecheck, lint, format:check, cả 2 builds → PASS.
- [ ] **Step 3: Commit** — `feat(showcase): resizable datagrid demo`.
