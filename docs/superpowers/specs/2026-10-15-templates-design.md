# Templates Design Spec (P3a — List-Detail + Dashboard)

Date: 2026-10-15
Status: Draft
Base: `docs/superpowers/specs/2026-10-11-enterprise-ui-design.md` (P1) + `docs/superpowers/specs/2026-10-12-datagrid-design.md` (P2, merged PR #6)

## 1. Intent & why

P1 + P2 give ERP building blocks (Table, FilterBar, Form, AppShell…), but no
composed screen proves they build a real page. P3a adds two layout templates
that compose existing components into the two most common ERP screens:
master list + detail, and KPI dashboard. Templates stay presentational layout
shells — no business logic, no fetching, chart areas are caller-owned slots.

## 2. Goals / Non-goals

Goals:
- G1: `SplitView` 2-pane (master 380px + detail), desktop side-by-side,
  mobile single-pane with back navigation.
- G2: `PageHeader` (back button slot, title, subtitle, actions) shared by
  detail panes and pages.
- G3: `KpiCard` (label, value, delta + tone, icon/sparkline slot) +
  `KpiGrid` responsive auto-fill grid.
- G4: Showcase demos proving composition: order master-detail (Table +
  Form + Badge + PageHeader inside SplitView) and dashboard (4 KPIs +
  Table summary + chart slot).
- G5: Dark theme + density + keyboard + 4.5:1 contrast hold in all new UI.

Non-goals: Kanban, Calendar, Auth pages, error pages, chart library, drill
navigation beyond one back level, resizable split ratio.

## 3. Constraints (kế thừa P1/P2 + AGENTS.md)

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only;
presentational-only (data in via props, events out); folder layout
`X.tsx + X.module.css + types.ts + index.ts + X.test.tsx` + root re-export;
Vitest globals on; `Table<T extends object>` interplay untouched.

## 4. API

```ts
// SplitView
export interface SplitViewProps {
  master: ReactNode;                  // list pane (usually Table + FilterBar)
  detail: ReactNode;                  // detail pane (PageHeader + Form/sections)
  selectedKey: string | null;         // null = nothing selected (mobile shows master)
  onBack: () => void;                 // mobile back → caller clears selectedKey
  masterWidth?: number;               // default 380
  backLabel?: string;                 // default 'Quay lại'
}

// PageHeader
export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  onBack?: () => void;                // renders back button when set
  backLabel?: string;
}

// KpiCard / KpiGrid
export interface KpiCardProps {
  label: string;
  value: ReactNode;
  delta?: ReactNode;                  // e.g. "+12% so với tháng trước"
  deltaTone?: 'green' | 'red' | 'neutral';  // default 'neutral'
  icon?: ReactNode;
  children?: ReactNode;               // sparkline/chart slot
}
export interface KpiGridProps { children: ReactNode; minCardWidth?: number } // default 220
```

Behavior: desktop (`>768px`, `useIsMobile` shared hook) shows both panes;
mobile shows `detail` iff `selectedKey != null`, else `master`; the mobile
detail top bar has a back button calling `onBack`. `SplitView` never owns
selection — caller maps row keys to `selectedKey`. KPI delta is dot + text
(color never the only channel). `KpiGrid` is CSS auto-fill
(`minmax(minCardWidth, 1fr)`), no JS measuring.

## 5. Styles

New `*.module.css` per component, tokens only; master pane has right border
(light `--border`), active master row affordance stays caller-owned (Table
selection); detail pane scrolls independently (`overflow:auto`,
`max-height:100%` chain from AppShell body); mobile transition none
(instant swap, no animation lib). Focus moves to the detail heading on
mobile pane switch (accessible navigation).

## 6. Tests (acceptance)

- `SplitView.test.tsx`: desktop shows both panes; mobile + null shows master
  only; mobile + key shows detail + back button calling `onBack`; custom
  `masterWidth` reflected in style.
- `PageHeader.test.tsx`: back omitted without `onBack`; actions slot renders.
- `KpiCard/KpiGrid.test.tsx`: delta tone classes; children slot renders;
  grid style uses `minCardWidth`.
- Showcase: `OrderDetailDemoPage` (master Table of orders → detail with
  PageHeader + Badge status + Field grid + total) and `DashboardDemoPage`
  (4 KpiCards + chart-slot box + recent-orders Table); both reachable from
  the AppShell nav; theme/density switch clean.

## 7. Done khi

1. Hai demo dựng hoàn toàn bằng lib components (không markup lẻ ngoài slot).
2. Mobile 360px: split chuyển pane + back về đúng; dashboard 1 cột.
3. Zero deps, tsc strict, lint/format sạch, 2 builds pass, full suite xanh.
