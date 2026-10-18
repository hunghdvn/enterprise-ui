# AppShell Sidebar Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a user-controlled sidebar collapse/expand toggle to AppShell.

**Architecture:** Controlled/uncontrolled `sidebarCollapsed` prop with internal state + localStorage persistence. Toggle button (Icon chevron) in brand area. CSS width transition + collapsed modifier hiding labels.

**Tech Stack:** React 18, TypeScript strict, CSS Modules, Vitest + Testing Library

**Spec:** `docs/superpowers/specs/2026-10-18-appshell-toggle-design.md`

## Global Constraints

- Components: zero runtime deps, CSS Modules only, `var(--…)` tokens, no hardcoded hex
- Folder layout unchanged (modify existing AppShell files)
- TypeScript strict, no `any`
- Vitest globals on
- All UI text in Vietnamese

## Review Focus

- Controlled/uncontrolled state correctness
- localStorage persistence
- Toggle button a11y (aria-label, aria-expanded)
- Reduced-motion guard
- Existing AppShell tests still pass (16 tests)

---

### Task 1: types.ts — add props

**Files:**

- Modify: `packages/components/src/AppShell/types.ts`

**Interfaces:**

- Produces: `AppShellProps` (extended)

- [ ] **Step 1: Add props**

```ts
export interface AppShellProps {
  sidebar: NavItem[];
  activeKey: string;
  onNavigate: (key: string) => void;
  headerRight?: ReactNode;
  breadcrumb?: string;
  sidebarEmptyState?: ReactNode;
  sidebarCollapsed?: boolean; // controlled
  defaultSidebarCollapsed?: boolean; // uncontrolled initial
  onSidebarToggle?: (collapsed: boolean) => void;
  children: ReactNode;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/components/src/AppShell/types.ts
git commit -m "feat(appshell): add sidebarCollapsed/onSidebarToggle props"
```

---

### Task 2: AppShell.tsx — state + toggle button

**Files:**

- Modify: `packages/components/src/AppShell/AppShell.tsx`

**Interfaces:**

- Consumes: `Icon` from `../Icon`
- Produces: updated AppShell with toggle

- [ ] **Step 1: Implement state + toggle**

Add controlled/uncontrolled logic:

```tsx
const isControlled = sidebarCollapsed !== undefined;
const [internalCollapsed, setInternalCollapsed] = useState(
  () =>
    sidebarCollapsed ??
    defaultSidebarCollapsed ??
    localStorage.getItem('eui-sidebar-collapsed') === '1',
);
const collapsed = isControlled ? sidebarCollapsed! : internalCollapsed;

const toggle = () => {
  const next = !collapsed;
  if (!isControlled) {
    setInternalCollapsed(next);
    try {
      localStorage.setItem('eui-sidebar-collapsed', next ? '1' : '0');
    } catch {}
  }
  onSidebarToggle?.(next);
};
```

Add toggle button in brand area:

```tsx
<button
  type="button"
  className={styles.toggle}
  onClick={toggle}
  aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
  aria-expanded={!collapsed}
>
  <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={16} />
</button>
```

Add `data-collapsed={collapsed}` to sidebar and shell.

- [ ] **Step 2: Commit**

```bash
git add packages/components/src/AppShell/AppShell.tsx
git commit -m "feat(appshell): add sidebar collapse toggle"
```

---

### Task 3: AppShell.module.css — collapsed styles + transition

**Files:**

- Modify: `packages/components/src/AppShell/AppShell.module.css`

**Interfaces:**

- Consumes: `.sidebar`, `.brand`, etc.

- [ ] **Step 1: Add transition + collapsed modifier**

```css
.sidebar {
  /* existing */
  transition: width 150ms ease;
}
.shell[data-collapsed='true'] .sidebar {
  width: 64px;
}
.shell[data-collapsed='true'] .brandText,
.shell[data-collapsed='true'] .nav .item > span:last-child,
.shell[data-collapsed='true'] .count {
  display: none;
}
.shell[data-collapsed='true'] .nav {
  justify-content: center;
}
.shell[data-collapsed='true'] .navEmpty {
  font-size: 10px;
  padding: 4px 2px;
}
.toggle {
  background: transparent;
  border: 0;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius);
}
.toggle:focus-visible {
  outline: 2px solid var(--color-blue-600);
  outline-offset: 2px;
}
```

Reduced-motion:

```css
@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/components/src/AppShell/AppShell.module.css
git commit -m "feat(appshell): collapsed sidebar styles + transition"
```

---

### Task 4: Tests

**Files:**

- Modify: `packages/components/src/AppShell/AppShell.test.tsx`

**Interfaces:**

- Consumes: AppShell

- [ ] **Step 1: Add toggle tests**

```tsx
test('toggle button collapses and expands sidebar', () => {
  render(<AppShell sidebar={[...]} activeKey="a" onNavigate={() => {}}><div>Body</div></AppShell>);
  const toggle = screen.getByRole('button', { name: /Thu gọn thanh điều hướng/i });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(toggle);
  expect(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i })).toHaveAttribute('aria-expanded', 'false');
});

test('controlled sidebarCollapsed prop', () => {
  const onToggle = vi.fn();
  render(<AppShell sidebar={[...]} activeKey="a" onNavigate={() => {}} sidebarCollapsed onSidebarToggle={onToggle}><div>Body</div></AppShell>);
  expect(screen.getByRole('button', { name: /Mở rộng/i })).toHaveAttribute('aria-expanded', 'false');
});
```

- [ ] **Step 2: Run tests**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/AppShell`
Expected: all pass (existing 16 + new)

- [ ] **Step 3: Commit**

```bash
git add packages/components/src/AppShell/AppShell.test.tsx
git commit -m "test(appshell): add sidebar toggle tests"
```

---

### Task 5: Docs + showcase

**Files:**

- Modify: `apps/docs/src/pages/layout/AppShellPage.tsx` (add props: sidebarCollapsed, defaultSidebarCollapsed, onSidebarToggle)
- Modify: `apps/showcase/src/App.tsx` (add toggle demo? optional)

**Interfaces:**

- Consumes: AppShell

- [ ] **Step 1: Update AppShellPage props table**

Add 3 new props to the props array.

- [ ] **Step 2: Showcase — add toggle to the existing AppShell demo**

The showcase App.tsx already uses AppShell with sidebar. Add `defaultSidebarCollapsed={false}` to demonstrate. Actually, the showcase is the main consumer — let me add the toggle there so users can see it.

- [ ] **Step 3: Build + verify**

Run: `npm run build --workspace=@enterprise-ui/components && npm run build --workspace=@enterprise-ui/docs && npm run build --workspace=@enterprise-ui/showcase`
Expected: all pass

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/pages/layout/AppShellPage.tsx apps/showcase/src/App.tsx
git commit -m "feat(docs,showcase): document and demo AppShell sidebar toggle"
```

---

### Task 6: Final verification

- [ ] **Step 1: Run full suite**

Run: `npm test && npm --workspaces run typecheck --if-present && npm run lint && npm run format:check`
Expected: all pass

- [ ] **Step 2: Commit cleanup if needed**

```bash
git add -A && git commit -m "chore: appshell toggle cleanup" || echo "nothing to commit"
```
