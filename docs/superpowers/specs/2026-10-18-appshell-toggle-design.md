# AppShell Sidebar Toggle — Design Spec

Date: 2026-10-18
Status: Draft
Repo: enterprise-ui

## 1. Intent & Why

AppShell's sidebar is always expanded on desktop (210px) and collapses to a 64px icon rail only at ≤768px. There is no user control to collapse/expand the sidebar on desktop. Users want a toggle button to reclaim horizontal space.

## 2. Goals

- Add a toggle button (chevron icon) in the sidebar brand area.
- Collapsed state: sidebar width 64px, labels/brand text/counts hidden, icons only.
- Controlled + uncontrolled: `sidebarCollapsed?` + `onSidebarToggle?` + `defaultSidebarCollapsed?`.
- Persist collapsed state to localStorage (`eui-sidebar-collapsed`), default expanded.
- Smooth width transition (150ms).
- Use the new `Icon` component for the toggle.

## 3. Non-Goals

- No resize drag (that's SplitView's job).
- No nested/collapsible nav groups.
- Mobile (≤768px) behavior unchanged (already icon rail).

## 4. Constraints

- Presentational-only: controlled via props, events out via onSidebarToggle.
- CSS Modules + tokens, no hardcoded hex.
- Zero runtime deps.
- A11y: toggle button has aria-label + aria-expanded.
- Reduced-motion: transition disabled under prefers-reduced-motion.

## 5. API

```ts
export interface AppShellProps {
  // ... existing ...
  sidebarCollapsed?: boolean; // controlled
  defaultSidebarCollapsed?: boolean; // uncontrolled initial
  onSidebarToggle?: (collapsed: boolean) => void;
}
```

- If `sidebarCollapsed` is provided, component is controlled.
- Otherwise, internal state initialized from `defaultSidebarCollapsed` (or localStorage `eui-sidebar-collapsed`, default false).
- Toggle button in brand area: chevron-left when expanded (click to collapse), chevron-right when collapsed (click to expand).
- localStorage persisted on every toggle (uncontrolled) or when controlled? Persist only in uncontrolled mode (controlled parent owns state).

## 6. CSS

- `.sidebar` width transition 150ms.
- `.collapsed` modifier: width 64px, hide `.brandText`, `.nav` label spans, `.count`, `.navEmpty` text (show icon).
- Reduced-motion: no transition.

## 7. Implementation Order

1. types.ts — add props
2. AppShell.tsx — state + toggle button + data-collapsed
3. AppShell.module.css — collapsed styles + transition
4. AppShell.test.tsx — toggle tests
5. Docs page AppShellPage — add prop docs + demo
6. Build + verify
   EOF
