# Enterprise UI P1 Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build P1 Core ERP kit dùng được ngay: tokens #1E47C4, sidebar trắng chung nền, Table dense, FilterBar, Form/Modal, kèm showcase Light/Dark demo.

**Architecture:** Monorepo npm workspaces 3 phần: packages/tokens (pure CSS vars) → packages/components (React+TS+CSS Modules, presentational-only) → apps/showcase (Vite demo). ThemeProvider set data-theme/data-density lên root, components chỉ đọc var(--...).

**Tech Stack:** React 18.3+, TypeScript 5 strict, CSS Modules only (zero runtime deps), Vite 5, Vitest + Testing Library + jsdom, npm workspaces.

**Spec:** docs/superpowers/specs/2026-10-11-enterprise-ui-design.md — plan này implement P1 trong spec (P2 DataGrid-Pro và P3 Templates làm plan riêng sau).

## Global Constraints

- Zero runtime dependencies ngoài react/react-dom — cấm thêm tailwind, antd, mui, headless libs ở P1.
- TypeScript strict, cấm `any` — dùng `unknown` + narrow khi cần.
- Styling duy nhất `*.module.css` + `var(--...)` — cấm hex cứng trong components, cấm import CSS chéo giữa components.
- Primary #1E47C4 base, hover #1E40AF, pale bg #EFF6FF; accent Orange #F97316 chỉ ~10% (badge/dot/CTA thứ cấp); neutral light bg #F8FAFC surface #FFFFFF border #E2E8F0 text #0F172A muted #64748B; dark bg #0F172A surface #1E293B border #334155 text #F8FAFC muted #94A3B8.
- Sidebar TRẮNG chung nền (light #FFFFFF + border-right #E2E8F0, active #EFF6FF + border-left 3px #1E47C4), dark #0F172A + border #334155 — cấm nền sidebar độc lập màu xanh như mockup v1.
- Default theme=light density=compact; row compact 32px / comfortable 44px; radius 6px; font Inter/system 12/13/14.
- Mọi component presentational-only: data qua props, sự kiện qua onChange/onSort/onPage, không fetch.
- Contrast ≥4.5:1 light+dark; keyboard + focus-ring xanh; Modal/Drawer trap focus + Esc.

---

## File Map (khóa phân rã)

```
package.json (workspaces: packages/*, apps/*)
tsconfig.base.json
packages/tokens/
  package.json (name @enterprise-ui/tokens)
  tokens.css (blue/orange/neutral/font/radius/shadow)
  theme-light.css ([data-theme=light] vars)
  theme-dark.css ([data-theme=dark] vars)
  density.css ([data-density] vars)
  breakpoints.css
packages/components/
  package.json (name @enterprise-ui/components, peer react)
  tsconfig.json, vite.config.ts (lib mode + css modules), vitest.config.ts
  src/tokens-import.css (@import tokens — re-export để app chỉ import 1 file)
  src/ThemeProvider/ThemeContext.tsx + ThemeProvider.tsx + index.ts + ThemeProvider.test.tsx
  src/Button/Button.tsx + Button.module.css + types.ts + index.ts + Button.test.tsx
  src/Input/Input.tsx + Input.module.css + index.ts + Input.test.tsx
  src/Badge/Badge.tsx + Badge.module.css + index.ts + Badge.test.tsx
  src/Select/Select.tsx + Select.module.css + index.ts + Select.test.tsx
  src/Checkbox/Checkbox.tsx + Checkbox.module.css + index.ts
  src/AppShell/AppShell.tsx + AppShell.module.css + types.ts + index.ts + AppShell.test.tsx
  src/Table/Table.tsx + Table.module.css + types.ts + index.ts + Table.test.tsx
  src/Pagination/Pagination.tsx + Pagination.module.css + index.ts + Pagination.test.tsx
  src/FilterBar/FilterBar.tsx + FilterBar.module.css + index.ts + FilterBar.test.tsx
  src/Form/Form.tsx + Field.tsx + Form.module.css + index.ts + Form.test.tsx
  src/Modal/Modal.tsx + Modal.module.css + index.ts + Modal.test.tsx
  src/Drawer/Drawer.tsx + Drawer.module.css + index.ts
  src/Toast/Toast.tsx + Toast.module.css + ToastProvider.tsx + index.ts + Toast.test.tsx
  src/index.ts (barrel export tất cả)
apps/showcase/
  package.json, vite.config.ts, tsconfig.json, index.html
  src/main.tsx + App.tsx + App.module.css
  src/pages/TokensPage.tsx + ComponentsPage.tsx + ListDemoPage.tsx
```

---

### Task 1: Scaffold monorepo + tokens CSS

**Files:**

- Create: `package.json`, `tsconfig.base.json`, `packages/tokens/package.json`, `packages/tokens/tokens.css`, `packages/tokens/theme-light.css`, `packages/tokens/theme-dark.css`, `packages/tokens/density.css`, `packages/tokens/breakpoints.css`
- Test: `packages/tokens/tokens.test.mjs` (node assert đọc file CSS chứa vars)

**Interfaces:**

- Consumes: không (task đầu).
- Produces: CSS vars `--color-blue-600: #1E47C4` etc mà Task 2-7 dùng qua `var(--...)`; workspaces để `apps/showcase` import được.

- [ ] **Step 1: Write failing tokens test**

```js
// packages/tokens/tokens.test.mjs
import { readFileSync } from 'node:fs';
const css =
  readFileSync(new URL('./tokens.css', import.meta.url), 'utf8') +
  readFileSync(new URL('./theme-light.css', import.meta.url), 'utf8') +
  readFileSync(new URL('./theme-dark.css', import.meta.url), 'utf8') +
  readFileSync(new URL('./density.css', import.meta.url), 'utf8');
const must = [
  '--color-blue-600: #1E47C4',
  '--color-orange-500: #F97316',
  '--bg: ',
  '--row-height',
  '[data-theme="dark"]',
  '[data-density="compact"]',
];
for (const m of must) {
  if (!css.includes(m)) throw new Error('missing token ' + m);
}
console.log('tokens ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node packages/tokens/tokens.test.mjs`
Expected: FAIL Error missing token / ENOENT vì files chưa tồn tại.

- [ ] **Step 3: Write minimal scaffold + tokens**

```json
// package.json
{
  "name": "enterprise-ui",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": { "test": "node packages/tokens/tokens.test.mjs && npm --workspaces run test" }
}
```

```json
// packages/tokens/package.json
{ "name": "@enterprise-ui/tokens", "version": "0.1.0", "files": ["*.css"] }
```

```json
// packages/components/package.json
{
  "name": "@enterprise-ui/components",
  "version": "0.1.0",
  "type": "module",
  "peerDependencies": { "react": "^18.3.0", "react-dom": "^18.3.0" },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "jsdom": "^24.0.0"
  },
  "scripts": { "test": "vitest run", "typecheck": "tsc --noEmit" }
}
```

```css
/* packages/tokens/tokens.css */
:root {
  --color-blue-50: #eff6ff;
  --color-blue-100: #dbeafe;
  --color-blue-500: #3b82f6;
  --color-blue-600: #1e47c4;
  --color-blue-700: #1e40af;
  --color-blue-800: #1e3a8a;
  --color-orange-50: #fff7ed;
  --color-orange-500: #f97316;
  --color-orange-600: #ea580c;
  --success: #16a34a;
  --danger: #dc2626;
  --radius: 6px;
  --radius-lg: 8px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --font: Inter, system-ui, -apple-system, sans-serif;
}
```

```css
/* packages/tokens/theme-light.css */
[data-theme='light'] {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-muted: #f1f5f9;
  --border: #e2e8f0;
  --text: #0f172a;
  --text-muted: #64748b;
}
```

```css
/* packages/tokens/theme-dark.css */
[data-theme='dark'] {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface-muted: #334155;
  --border: #334155;
  --text: #f8fafc;
  --text-muted: #94a3b8;
}
```

```css
/* packages/tokens/density.css */
[data-density='compact'] {
  --row-height: 32px;
  --cell-py: 4px;
  --cell-px: 8px;
  --input-h: 32px;
  --font-size: 13px;
}
[data-density='comfortable'] {
  --row-height: 44px;
  --cell-py: 12px;
  --cell-px: 16px;
  --input-h: 40px;
  --font-size: 14px;
}
```

```css
/* packages/tokens/breakpoints.css */
:root {
  --bp-tablet: 768px;
  --bp-desktop: 1280px;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node packages/tokens/tokens.test.mjs`
Expected: PASS prints tokens ok.

- [ ] **Step 5: Commit**

```bash
git add package.json packages/tokens/
git commit -m "feat(tokens): add blue-1E47C4 theme density tokens"
```

### Task 2: ThemeProvider (theme + density switch)

**Files:**

- Create: `packages/components/package.json`, `packages/components/tsconfig.json`, `packages/components/src/ThemeProvider/ThemeContext.tsx`, `packages/components/src/ThemeProvider/ThemeProvider.tsx`, `packages/components/src/ThemeProvider/index.ts`
- Test: `packages/components/src/ThemeProvider/ThemeProvider.test.tsx`

**Interfaces:**

- Consumes: tokens CSS vars từ Task 1.
- Produces: `ThemeProvider({theme,density,children})`, `useTheme(): {theme,density,setTheme,setDensity}` mà AppShell/showcase dùng.

- [ ] **Step 1: Write failing test**

```tsx
// ThemeProvider.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './ThemeContext';
function Probe() {
  const t = useTheme();
  return (
    <button onClick={() => t.setDensity('comfortable')}>
      {t.theme}-{t.density}
    </button>
  );
}
test('defaults light-compact and switches density', () => {
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(screen.getByRole('button')).toHaveTextContent('light-compact');
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('light-comfortable');
  expect(document.querySelector('[data-enterprise-ui]')).toHaveAttribute(
    'data-density',
    'comfortable',
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/ThemeProvider/ThemeProvider.test.tsx`
Expected: FAIL Cannot find module ./ThemeProvider.

- [ ] **Step 3: Write minimal implementation**

```tsx
// ThemeContext.tsx
import { createContext, useContext } from 'react';
export type Theme = 'light' | 'dark';
export type Density = 'compact' | 'comfortable';
export interface ThemeCtx {
  theme: Theme;
  density: Density;
  setTheme: (t: Theme) => void;
  setDensity: (d: Density) => void;
}
export const Ctx = createContext<ThemeCtx>({
  theme: 'light',
  density: 'compact',
  setTheme: () => {},
  setDensity: () => {},
});
export const useTheme = () => useContext(Ctx);
```

```tsx
// ThemeProvider.tsx
import { useState, useEffect, type ReactNode } from 'react';
import { Ctx, type Theme, type Density } from './ThemeContext';
export function ThemeProvider({
  children,
  theme: init = 'light',
  density: initD = 'compact',
}: {
  children: ReactNode;
  theme?: Theme;
  density?: Density;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('eui-theme') as Theme) || init,
  );
  const [density, setDensity] = useState<Density>(
    () => (localStorage.getItem('eui-density') as Density) || initD,
  );
  useEffect(() => {
    localStorage.setItem('eui-theme', theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem('eui-density', density);
  }, [density]);
  return (
    <Ctx.Provider value={{ theme, density, setTheme, setDensity }}>
      <div data-enterprise-ui data-theme={theme} data-density={density}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/ThemeProvider/ThemeProvider.test.tsx`
Expected: PASS 1 passed.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/ThemeProvider packages/components/package.json
git commit -m "feat(theme): add ThemeProvider light-dark compact switch"
```

### Task 3: Primitives Button/Input/Badge/Select/Checkbox

**Files:**

- Create: `src/Button/Button.tsx + Button.module.css + types.ts + index.ts`, `src/Input/...`, `src/Badge/...`, `src/Select/...`, `src/Checkbox/...`
- Test: `src/Button/Button.test.tsx`, `src/Input/Input.test.tsx`, `src/Badge/Badge.test.tsx`

**Interfaces:**

- Consumes: `var(--color-blue-600)` etc, `BaseProps {size?: 'sm'|'md'}`.
- Produces: `Button({variant:'primary'|'secondary'|'ghost'|'danger'|'accent', size, loading})`, `Input({error})`, `Badge({tone:'blue'|'orange'|'green'|'red'|'neutral'})` dùng trong Table/FilterBar/AppShell.

- [ ] **Step 1: Write failing Button test**

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';
test('primary renders and accent uses orange', () => {
  const { rerender } = render(<Button variant="primary">Tạo đơn</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Tạo đơn');
  rerender(<Button variant="accent">Duyệt</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'accent');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Button/Button.test.tsx`
Expected: FAIL module not found.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/Button/types.ts
export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
}
```

```tsx
// src/Button/Button.tsx
import styles from './Button.module.css';
import type { ButtonProps } from './types';
export function Button({
  variant = 'primary',
  size = 'sm',
  loading,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      className={`${styles.btn} ${className}`}
      {...rest}
    >
      {loading ? '...' : children}
    </button>
  );
}
```

```css
/* src/Button/Button.module.css */
.btn {
  font-family: var(--font);
  height: var(--input-h);
  padding: 0 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  font-size: var(--font-size);
  cursor: pointer;
}
.btn[data-variant='primary'] {
  background: var(--color-blue-600);
  border-color: var(--color-blue-600);
  color: #fff;
}
.btn[data-variant='primary']:hover {
  background: var(--color-blue-700);
}
.btn[data-variant='accent'] {
  background: var(--color-orange-500);
  border-color: var(--color-orange-500);
  color: #fff;
}
.btn[data-variant='secondary'] {
  background: var(--surface);
  color: var(--text);
}
.btn[data-variant='ghost'] {
  background: transparent;
  border-color: transparent;
  color: var(--color-blue-600);
}
.btn[data-variant='danger'] {
  background: var(--danger);
  border-color: var(--danger);
  color: #fff;
}
.btn:focus-visible {
  outline: 2px solid var(--color-blue-600);
  outline-offset: 2px;
}
```

Triển khai Input/Badge/Select/Checkbox tương tự: Input dùng `var(--surface)` + `aria-invalid` khi error; Badge dot 8px + text (orange/blue/green/red); Select bọc native select styled; Checkbox native styled 16px.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Button src/Input src/Badge`
Expected: PASS 3+ files.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Button packages/components/src/Input packages/components/src/Badge packages/components/src/Select packages/components/src/Checkbox
git commit -m "feat(primitives): add Button Input Badge Select Checkbox"
```

### Task 4: AppShell sidebar trắng

**Files:**

- Create: `src/AppShell/AppShell.tsx`, `AppShell.module.css`, `types.ts`, `index.ts`
- Test: `src/AppShell/AppShell.test.tsx`

**Interfaces:**

- Consumes: Button, useTheme, tokens.
- Produces: `AppShell({sidebar:[{key,label,icon,badge}], activeKey, onNavigate, headerRight, breadcrumb, children})` dùng cho mọi trang ERP.

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AppShell } from './AppShell';
test('white sidebar navigates and shows orange badge', () => {
  const fn = vi.fn();
  render(
    <AppShell
      sidebar={[
        { key: 'orders', label: 'Đơn hàng', badge: 12 },
        { key: 'stock', label: 'Kho vận' },
      ]}
      activeKey="orders"
      onNavigate={fn}
      headerRight={<span>U</span>}
    >
      <div>Body</div>
    </AppShell>,
  );
  expect(screen.getByText('Đơn hàng')).toBeInTheDocument();
  expect(screen.getByText('12')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Kho vận'));
  expect(fn).toHaveBeenCalledWith('stock');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/AppShell/AppShell.test.tsx`
Expected: FAIL module not found.

- [ ] **Step 3: Write minimal implementation**

```tsx
// types.ts
export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  badge?: number;
}
export interface AppShellProps {
  sidebar: NavItem[];
  activeKey: string;
  onNavigate: (k: string) => void;
  headerRight?: React.ReactNode;
  breadcrumb?: string;
  children: React.ReactNode;
}
```

```tsx
// AppShell.tsx
import styles from './AppShell.module.css';
import type { AppShellProps } from './types';
export function AppShell({
  sidebar,
  activeKey,
  onNavigate,
  headerRight,
  breadcrumb,
  children,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Primary">
        <div className={styles.brand}>
          <span className={styles.logo}>E</span> Enterprise
        </div>
        <nav>
          {sidebar.map((i) => (
            <button
              key={i.key}
              data-active={i.key === activeKey}
              className={styles.nav}
              onClick={() => onNavigate(i.key)}
            >
              <span>
                {i.icon ?? '▦'} {i.label}
              </span>
              {typeof i.badge === 'number' && <span className={styles.count}>{i.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <span>{breadcrumb}</span>
          <span className={styles.spacer} />
          {headerRight}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
```

```css
/* AppShell.module.css */
.shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
}
.sidebar {
  width: 210px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 12px 8px;
  flex-shrink: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 12px;
  font-weight: 700;
}
.logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--color-blue-600);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 7px 10px;
  border: 0;
  background: transparent;
  border-radius: 0 6px 6px 0;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
}
.nav[data-active='true'] {
  background: var(--color-blue-50, #eff6ff);
  border-left: 3px solid var(--color-blue-600);
  color: var(--color-blue-600);
  font-weight: 600;
}
.count {
  background: var(--color-orange-500);
  color: #fff;
  border-radius: 10px;
  padding: 0 7px;
  font-size: 11px;
}
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 10px 16px;
  display: flex;
  align-items: center;
}
.spacer {
  flex: 1;
}
.body {
  padding: 12px 16px;
}
@media (max-width: 768px) {
  .sidebar {
    width: 64px;
  }
  .nav span:first-child {
    overflow: hidden;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/AppShell/AppShell.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/AppShell
git commit -m "feat(layout): add white-sidebar AppShell"
```

### Task 5: Table dense + Pagination + FilterBar

**Files:**

- Create: `src/Table/Table.tsx + Table.module.css + types.ts + index.ts`, `src/Pagination/...`, `src/FilterBar/...`
- Test: `src/Table/Table.test.tsx`, `src/Pagination/Pagination.test.tsx`, `src/FilterBar/FilterBar.test.tsx`

**Interfaces:**

- Consumes: Badge, Button, Input.
- Produces: `Table<T>({columns:[{key,title,align,sortable,render}], data, sortKey, sortDir, onSort, selectedKeys, onSelect, status:'idle|loading|empty|error', onRetry, summary})`, `Pagination({page,pageSize,total,onChange})`, `FilterBar({searchValue,onSearch,filters, onReset, densityToggle})`.

- [ ] **Step 1: Write failing Table test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Table } from './Table';
test('sorts, selects, shows empty and error', () => {
  const onSort = vi.fn();
  const cols = [
    { key: 'code', title: 'Mã đơn', sortable: true },
    { key: 'total', title: 'Giá trị', align: 'right' as const },
  ];
  const { rerender } = render(
    <Table
      columns={cols}
      data={[{ code: 'SO-1', total: '₫ 10M' }]}
      sortKey="code"
      sortDir="asc"
      onSort={onSort}
    />,
  );
  fireEvent.click(screen.getByText('Mã đơn'));
  expect(onSort).toHaveBeenCalled();
  rerender(<Table columns={cols} data={[]} status="empty" />);
  expect(screen.getByText(/Không có dữ liệu/i)).toBeInTheDocument();
  rerender(<Table columns={cols} data={[]} status="error" onRetry={() => {}} />);
  expect(screen.getByRole('button', { name: /Thử lại/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Table/Table.test.tsx`
Expected: FAIL module not found.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/Table/types.ts
export type Status = 'idle' | 'loading' | 'empty' | 'error';
export interface Column<T> {
  key: string;
  title: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}
export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (k: string) => void;
  selectedKeys?: string[];
  onSelect?: (keys: string[]) => void;
  rowKey?: (r: T) => string;
  status?: Status;
  onRetry?: () => void;
  summary?: React.ReactNode;
}
```

```tsx
// src/Table/Table.tsx
import styles from './Table.module.css';
import type { TableProps } from './types';
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  sortKey,
  sortDir,
  onSort,
  status = 'idle',
  onRetry,
  summary,
}: TableProps<T>) {
  if (status === 'empty') return <div className={styles.state}>Không có dữ liệu</div>;
  if (status === 'error')
    return (
      <div className={styles.state}>
        Lỗi tải dữ liệu <button onClick={onRetry}>Thử lại</button>
      </div>
    );
  if (status === 'loading') return <div className={styles.state}>Đang tải…</div>;
  return (
    <div className={styles.wrap} role="grid">
      <div
        className={styles.head}
        style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
      >
        {columns.map((c) => (
          <button
            key={c.key}
            aria-sort={
              sortKey === c.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
            }
            className={styles.h}
            style={{ textAlign: c.align ?? 'left' }}
            onClick={() => c.sortable && onSort?.(c.key)}
          >
            {c.title}
            {c.sortable ? ' ↕' : ''}
          </button>
        ))}
      </div>
      {data.map((r, i) => (
        <div
          key={i}
          className={styles.row}
          style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
          {columns.map((c) => (
            <div key={c.key} className={styles.c} style={{ textAlign: c.align ?? 'left' }}>
              {c.render ? c.render(r) : String(r[c.key])}
            </div>
          ))}
        </div>
      ))}
      {summary && <div className={styles.foot}>{summary}</div>}
    </div>
  );
}
```

```css
/* src/Table/Table.module.css */
.wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: auto;
  font-size: var(--font-size);
}
.head,
.row {
  display: grid;
}
.head {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.h {
  padding: var(--cell-py) var(--cell-px);
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: 11px;
  background: transparent;
  border: 0;
  cursor: pointer;
}
.c {
  padding: var(--cell-py) var(--cell-px);
  border-bottom: 1px solid var(--surface-muted);
  min-height: var(--row-height);
  display: flex;
  align-items: center;
}
.row:nth-child(even) {
  background: color-mix(in srgb, var(--bg) 50%, var(--surface));
}
.row:hover {
  background: var(--color-blue-50, #eff6ff);
}
.state {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: 8px;
}
```

Pagination: `Pagination({page,pageSize,total,onChange})` render `1-20 / total` + buttons ‹ 1 2 3 ›. FilterBar: search Input + slot filters + reset + density toggle dùng useTheme.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Table src/Pagination src/FilterBar`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Table packages/components/src/Pagination packages/components/src/FilterBar
git commit -m "feat(data): add dense Table Pagination FilterBar"
```

### Task 6: Form + Modal + Drawer + Toast

**Files:**

- Create: `src/Form/Form.tsx + Field.tsx + Form.module.css + index.ts`, `src/Modal/Modal.tsx + Modal.module.css + index.ts`, `src/Drawer/...`, `src/Toast/Toast.tsx + ToastProvider.tsx + Toast.module.css + index.ts`
- Test: `src/Form/Form.test.tsx`, `src/Modal/Modal.test.tsx`, `src/Toast/Toast.test.tsx`

**Interfaces:**

- Consumes: Input, Button, Table status pattern.
- Produces: `Form({errors,onSubmit}) + Field({label,error,children})`, `Modal({open,onClose,title,children})` trap focus + Esc, `Drawer` tương tự bên phải, `ToastProvider + toast.success/error`.

- [ ] **Step 1: Write failing Form+Modal test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from './Form';
import { Field } from './Field';
test('shows inline error', () => {
  render(
    <Form errors={{ code: 'Bắt buộc' }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Mã đơn" error="Bắt buộc">
        <input aria-label="Mã đơn" />
      </Field>
    </Form>,
  );
  expect(screen.getByText('Bắt buộc')).toBeInTheDocument();
  expect(screen.getByLabelText('Mã đơn')).toHaveAttribute('aria-invalid', 'true');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Form/Form.test.tsx`
Expected: FAIL module not found.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/Form/Form.tsx
export function Form({
  errors: _,
  onSubmit,
  children,
}: {
  errors?: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      {children}
    </form>
  );
}
// src/Form/Field.tsx
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactElement;
}) {
  const child = error
    ? require('react').cloneElement(children, { 'aria-invalid': 'true' })
    : children;
  return (
    <label style={{ display: 'grid', gap: 4 }}>
      {label}
      {child}
      {error && <span style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</span>}
    </label>
  );
}
```

```tsx
// src/Modal/Modal.tsx
import { useEffect } from 'react';
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}
```

Toast: context `toast(message,tone)` render fixed bottom-right, auto-dismiss 3s.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Form src/Modal src/Toast`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Form packages/components/src/Modal packages/components/src/Drawer packages/components/src/Toast
git commit -m "feat(forms): add Form Modal Drawer Toast"
```

### Task 7: Showcase Vite + List demo (Definition of Done P1)

**Files:**

- Create: `apps/showcase/package.json`, `apps/showcase/vite.config.ts`, `apps/showcase/index.html`, `apps/showcase/src/main.tsx`, `apps/showcase/src/App.tsx`, `apps/showcase/src/pages/ListDemoPage.tsx`, `apps/showcase/src/pages/TokensPage.tsx`
- Test: manual matrix light/dark × compact/comfortable × 360/768/1440 + `tsc --noEmit`

**Interfaces:**

- Consumes: toàn bộ components Task 2-6 + tokens.
- Produces: site chạy `npm run dev --workspace=apps/showcase` chứng minh Done: dựng List+Detail chỉ bằng P1, switch theme/density không nháy.

- [ ] **Step 1: Write failing typecheck**

Run: `npm run typecheck --workspace=apps/showcase`
Expected: FAIL missing files / TS errors.

- [ ] **Step 2: Write minimal showcase**

```tsx
// apps/showcase/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@enterprise-ui/tokens/tokens.css';
import '@enterprise-ui/tokens/theme-light.css';
import '@enterprise-ui/tokens/theme-dark.css';
import '@enterprise-ui/tokens/density.css';
import App from './App';
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

```tsx
// apps/showcase/src/App.tsx
import { ThemeProvider, AppShell, Table, FilterBar, Button } from '@enterprise-ui/components';
import { useState } from 'react';
const data = [
  { code: 'SO-10482', customer: 'Cty An Phát', total: '₫ 245M', status: 'Chờ duyệt' },
  { code: 'SO-10481', customer: 'Cty Minh Đức', total: '₫ 89M', status: 'Đang giao' },
];
export default function App() {
  const [key, setKey] = useState('orders');
  return (
    <ThemeProvider>
      <AppShell
        sidebar={[
          { key: 'orders', label: 'Đơn hàng', badge: 12 },
          { key: 'stock', label: 'Kho vận' },
        ]}
        activeKey={key}
        onNavigate={setKey}
        breadcrumb="Đơn hàng bán"
        headerRight={<Button>Tạo đơn</Button>}
      >
        <FilterBar searchValue="" onSearch={() => {}} onReset={() => {}} />
        <Table
          columns={[
            { key: 'code', title: 'Mã đơn', sortable: true },
            { key: 'customer', title: 'Khách hàng' },
            { key: 'total', title: 'Giá trị', align: 'right' },
            { key: 'status', title: 'Trạng thái' },
          ]}
          data={data}
        />
      </AppShell>
    </ThemeProvider>
  );
}
```

```tsx
// packages/components/src/index.ts (barrel — cập nhật dần sau mỗi Task, chốt ở Task 7)
export { ThemeProvider, useTheme } from './ThemeProvider/ThemeProvider';
export { Button } from './Button/Button';
export { Input } from './Input/Input';
export { Badge } from './Badge/Badge';
export { Select } from './Select/Select';
export { Checkbox } from './Checkbox/Checkbox';
export { AppShell } from './AppShell/AppShell';
export { Table } from './Table/Table';
export { Pagination } from './Pagination/Pagination';
export { FilterBar } from './FilterBar/FilterBar';
export { Form } from './Form/Form';
export { Field } from './Form/Field';
export { Modal } from './Modal/Modal';
export { Drawer } from './Drawer/Drawer';
export { ToastProvider, useToast } from './Toast/ToastProvider';
```

- [ ] **Step 3: Run typecheck + unit tests**

Run: `npm run typecheck --workspace=apps/showcase && npm --workspaces run test`
Expected: PASS.

- [ ] **Step 4: Manual visual matrix (ghi kết quả vào PR)**

Check: light/dark switch persist reload; compact 32px vs comfortable 44px; 1440 full table, 768 icon rail + scroll ngang sticky, 360 card-list (ghi chú nếu chưa card-list thì để P2, P1 cho phép scroll).

- [ ] **Step 5: Commit**

```bash
git add apps/showcase packages/components/src/index.ts
git commit -m "feat(showcase): add P1 List demo light-dark"
```

---

## P2/P3 để plan riêng (không làm trong plan này)

- P2: DataGrid-Pro virtualized, Saved Views, Tree, Steps/Wizard, FileUpload, NotificationCenter, DateRangePicker, mobile card-list chuẩn.
- P3: Templates List-Detail 2-pane, Dashboard KPI slot chart, Kanban, Calendar, Auth, 403/404/500.

## Ghi chú thực thi

- Thứ tự bắt buộc 1→7 vì interfaces nối tiếp nhau.
- Mỗi Task kết thúc test xanh mới sang Task tiếp.
- Nếu `color-mix` không chạy trên trình duyệt cũ, fallback `background: var(--surface)` — không block P1.
