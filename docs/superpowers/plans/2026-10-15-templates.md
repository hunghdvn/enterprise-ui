# Templates P3a Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add List-Detail + Dashboard layout templates composing existing components, with two showcase demos proving real ERP screens.

**Architecture:** Four new presentational folders under `packages/components/src/` (`PageHeader`, `SplitView`, `KpiCard`, `KpiGrid`), each folder-independent, re-exported from root. Showcase adds two demo pages + nav entries. No changes to existing components.

**Tech Stack:** React 18.3+, TypeScript 5 strict, CSS Modules + `var(--...)`, Vitest + Testing Library + jsdom (globals on).

**Spec:** `docs/superpowers/specs/2026-10-15-templates-design.md`

## Global Constraints

- Zero runtime deps ngoài react/react-dom.
- TypeScript strict, cấm `any`.
- Styling `*.module.css` + `var(--...)`, cấm hex cứng, cấm import CSS chéo.
- Presentational-only: props in, callbacks out, không fetch.
- Contrast ≥4.5:1, keyboard + focus-ring, dot + text cho trạng thái màu.
- Folder layout + root re-export (không deep-import).
- Reuse `useIsMobile` (breakpoint 768) — không viết hook mới.

## Review Focus

- Mobile pane switch moves focus to the detail heading (screen-reader users otherwise stay silent) — test in Task 2.
- `selectedKey` mismatch (key not in master list) still renders detail (caller-owned data) — test in Task 2.
- Delta red/green never the only channel (dot + text present) — test in Task 3.
- Demos import only from `@enterprise-ui/components` root (built lib) — check in Task 4.
- Long titles/actions overflow gracefully (ellipsis, no layout break) — test in Task 1.

## File Map

```
packages/components/src/
  PageHeader/PageHeader.tsx + .module.css + types.ts + index.ts + PageHeader.test.tsx
  SplitView/SplitView.tsx + .module.css + types.ts + index.ts + SplitView.test.tsx
  KpiCard/KpiCard.tsx + .module.css + types.ts + index.ts + KpiCard.test.tsx
  KpiGrid/KpiGrid.tsx + .module.css + types.ts + index.ts + KpiGrid.test.tsx
  index.ts (root re-exports)
apps/showcase/src/pages/OrderDetailDemoPage.tsx + DashboardDemoPage.tsx (+ .module.css)
apps/showcase/src/App.tsx (nav entries)
```

---

### Task 1: PageHeader

**Files:** Create `src/PageHeader/*` (5 files) · Modify `src/index.ts` · Test `PageHeader.test.tsx`

**Interfaces:** Produces `PageHeader({title, subtitle, actions, onBack, backLabel})` used by Task 4 demos (and SplitView mobile bar pattern).

- [ ] **Step 1: Write failing test** — back button absent without `onBack`, present + calls `onBack` with it; actions slot renders; long title gets ellipsis class.
- [ ] **Step 2: Run it** — `npm run test --workspace=@enterprise-ui/components -- --run src/PageHeader` → FAIL module not found.
- [ ] **Step 3: Implement** `types.ts` + `PageHeader.tsx` (Button ghost back + title block + actions) + `PageHeader.module.css` (tokens only) + `index.ts`.
- [ ] **Step 4: Run** → PASS; root export added.
- [ ] **Step 5: Commit** — `feat(templates): add PageHeader`.

### Task 2: SplitView

**Files:** Create `src/SplitView/*` · Modify `src/index.ts` · Test `SplitView.test.tsx`

**Interfaces:** Consumes `useIsMobile`, `PageHeader`-style back pattern (not the component — SplitView owns its mobile bar with `backLabel`). Produces `SplitView({master, detail, selectedKey, onBack, masterWidth=380, backLabel})`.

- [ ] **Step 1: Write failing test** — desktop (matchMedia false): both panes visible; mobile + null: master only, no back; mobile + key: detail + back button → `onBack`; `masterWidth` in style; focus moves to detail heading on switch (stub matchMedia like `useIsMobile.test.ts`).
- [ ] **Step 2: Run it** → FAIL module not found.
- [ ] **Step 3: Implement** — grid `minmax(masterWidth, pane)` desktop; mobile conditional branch + back bar; `useEffect` focusing detail heading (tabIndex -1) when mobile detail appears.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `feat(templates): add SplitView master-detail`.

### Task 3: KpiCard + KpiGrid

**Files:** Create `src/KpiCard/*`, `src/KpiGrid/*` · Modify `src/index.ts` · Tests for both.

**Interfaces:** Produces `KpiCard({label, value, delta, deltaTone, icon, children})`, `KpiGrid({children, minCardWidth=220})` for Task 4 dashboard.

- [ ] **Step 1: Write failing tests** — delta dot + text for each tone; icon/children slots render; grid style contains `minCardWidth`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** — card (surface, radius, label muted, value large, delta row) + grid (`repeat(auto-fill, minmax(...))`).
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `feat(templates): add KpiCard and KpiGrid`.

### Task 4: Showcase demos + full verification

**Files:** Create `OrderDetailDemoPage.tsx`, `DashboardDemoPage.tsx` (+ css) · Modify `App.tsx` nav · Tests: none new (demo wiring covered by component tests; smoke via build).

**Interfaces:** Consumes Tasks 1–3 + Table/FilterBar/Badge/Form/Select.

- [ ] **Step 1: Write `OrderDetailDemoPage`** — SplitView: master = FilterBar + Table (orders, selectable, sorts) driving `selectedKey`; detail = PageHeader (back → clear key) + Badge status + Field grid + totals + actions (Toast on save).
- [ ] **Step 2: Write `DashboardDemoPage`** — KpiGrid (4 KpiCards: revenue, orders, fill rate, backlog) + chart-slot box (children) + recent-orders Table + summary.
- [ ] **Step 3: Wire nav** (`Chi tiết đơn`, `Dashboard`) + breadcrumbs in `App.tsx`.
- [ ] **Step 4: Run full chain** — `npm test`, typecheck, lint, format:check, both builds → PASS all.
- [ ] **Step 5: Commit** — `feat(showcase): add order-detail and dashboard demos`.
