# Icon System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a zero-dependency `Icon` component backed by a curated inline-SVG registry (~33 icons), and migrate `Empty`/`Toast`/`Modal` to use it.

**Architecture:** Single `Icon` component in `packages/components/src/Icon/` with a registry (`icons.ts`) mapping `IconName` → inner SVG content. Icons are 24×24, stroke-based, `currentColor`. Optional refactor of 3 existing components to consume icons.

**Tech Stack:** React 18, TypeScript strict, CSS Modules, Vitest + Testing Library

**Spec:** `docs/superpowers/specs/2026-10-18-icon-system-design.md`

## Global Constraints

- Components: zero runtime deps (react only), CSS Modules only, `var(--…)` tokens, no hardcoded hex
- Folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`
- TypeScript strict, no `any`
- Vitest globals on (`test`/`expect`/`vi` need no imports)
- All UI text in Vietnamese
- Icon SVGs: 24×24 viewBox, stroke 2px, round caps/joins, `currentColor`

## Review Focus

- Icon registry completeness (all ~33 names resolve to valid SVG)
- Accessibility: aria-hidden default, role="img" + title when labeled
- Empty/Toast/Modal refactors don't break existing tests
- Bundle size stays <150KB gzip

---

### Task 1: types.ts + icons.ts registry

**Files:**
- Create: `packages/components/src/Icon/types.ts`
- Create: `packages/components/src/Icon/icons.ts`

**Interfaces:**
- Produces: `IconName`, `IconProps`

- [ ] **Step 1: Create types.ts**

```ts
import type { ReactNode } from 'react';

export type IconName =
  | 'check' | 'x' | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
  | 'arrow-left' | 'arrow-right' | 'plus' | 'minus' | 'search' | 'filter'
  | 'settings' | 'user' | 'bell' | 'mail' | 'home' | 'edit' | 'trash'
  | 'download' | 'upload' | 'copy' | 'check-circle' | 'refresh' | 'info'
  | 'alert-circle' | 'alert-triangle' | 'help-circle' | 'calendar' | 'clock'
  | 'eye' | 'eye-off' | 'external-link' | 'inbox' | 'lock' | 'menu'
  | 'more-horizontal';

export interface IconProps {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
}
```

- [ ] **Step 2: Create icons.ts**

Registry mapping each `IconName` to its inner SVG content (paths). All 24×24, stroke-based. Example:

```ts
import type { ReactNode } from 'react';

export const ICONS: Record<IconName, ReactNode> = {
  check: <path d="M20 6L9 17l-5-5" />,
  x: <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>,
  // ... all 33+
};
```

Each icon's paths use `stroke="currentColor"` inherited from parent SVG (paths don't set stroke themselves). Use round caps/joins via the parent SVG.

- [ ] **Step 3: Commit**

```bash
git add packages/components/src/Icon/types.ts packages/components/src/Icon/icons.ts
git commit -m "feat(icon): add Icon types and icon registry (~33 icons)"
```

---

### Task 2: Icon component

**Files:**
- Create: `packages/components/src/Icon/Icon.tsx`
- Create: `packages/components/src/Icon/Icon.module.css`
- Create: `packages/components/src/Icon/index.ts`

**Interfaces:**
- Consumes: `IconProps`, `IconName`, `ICONS`
- Produces: `Icon`

- [ ] **Step 1: Create Icon.module.css**

```css
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
```

- [ ] **Step 2: Create Icon.tsx**

```tsx
import styles from './Icon.module.css';
import { ICONS } from './icons';
import type { IconProps } from './types';

export function Icon({ name, size = 16, label, className = '' }: IconProps) {
  const accessible = !!label;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={accessible ? undefined : true}
      role={accessible ? 'img' : undefined}
      aria-label={label}
      className={`${styles.icon} ${className}`.trim()}
    >
      {accessible && <title>{label}</title>}
      {ICONS[name]}
    </svg>
  );
}
```

- [ ] **Step 3: Create index.ts**

```ts
export { Icon } from './Icon';
export type { IconProps, IconName } from './types';
```

- [ ] **Step 4: Export from src/index.ts**

Add to `packages/components/src/index.ts`:
```ts
export { Icon } from './Icon/Icon';
export type { IconProps, IconName } from './Icon/types';
```

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Icon packages/components/src/index.ts
git commit -m "feat(icon): add Icon component"
```

---

### Task 3: Icon tests (TDD)

**Files:**
- Create: `packages/components/src/Icon/Icon.test.tsx`

**Interfaces:**
- Consumes: `Icon`, `IconName`

- [ ] **Step 1: Write tests**

```tsx
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

test('renders an svg for a valid name', () => {
  render(<Icon name="check" />);
  const svg = document.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveAttribute('aria-hidden', 'true');
});

test('size prop sets width and height', () => {
  render(<Icon name="x" size={24} />);
  const svg = document.querySelector('svg')!;
  expect(svg).toHaveAttribute('width', '24');
  expect(svg).toHaveAttribute('height', '24');
});

test('label makes it accessible (role=img + title)', () => {
  render(<Icon name="check" label="Đã chọn" />);
  const svg = screen.getByRole('img', { name: 'Đã chọn' });
  expect(svg).toBeInTheDocument();
  expect(svg.querySelector('title')).toHaveTextContent('Đã chọn');
});

test('className is applied', () => {
  render(<Icon name="check" className="my-icon" />);
  expect(document.querySelector('svg')).toHaveClass('my-icon');
});

test('all registered icons render without error', () => {
  const { ICONS } = await import('./icons');
  for (const name of Object.keys(ICONS)) {
    const { unmount } = render(<Icon name={name as any} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
    unmount();
  }
});
```

Note: the last test imports ICONS dynamically. If vitest handles the import fine, great. Alternatively, import ICONS at top.

- [ ] **Step 2: Run tests**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Icon`
Expected: PASS (5 tests)

- [ ] **Step 3: Commit**

```bash
git add packages/components/src/Icon/Icon.test.tsx
git commit -m "test(icon): add Icon component tests"
```

---

### Task 4: Refactor Empty/Toast/Modal to use Icon

**Files:**
- Modify: `packages/components/src/Empty/Empty.tsx`
- Modify: `packages/components/src/Toast/Toast.tsx`
- Modify: `packages/components/src/Modal/Modal.tsx`

**Interfaces:**
- Consumes: `Icon` from `../Icon`

- [ ] **Step 1: Empty — default icon → Icon name="inbox" size={48}**

Replace the hand-drawn box SVG with `<Icon name="inbox" size={48} />`. Remove the DEFAULT_ICON const. Keep the `icon` prop override.

- [ ] **Step 2: Toast — close button "✕" → Icon name="x" size={14}**

Replace text "✕" with `<Icon name="x" size={14} />`.

- [ ] **Step 3: Modal — close button "✕" → Icon name="x" size={16}**

Replace text "✕" with `<Icon name="x" size={16} />`.

- [ ] **Step 4: Run affected tests**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Empty src/Toast src/Modal src/Icon`
Expected: all pass (adjust tests if they assert on "✕" text — update to check icon presence)

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Empty packages/components/src/Toast packages/components/src/Modal
git commit -m "refactor: use Icon in Empty, Toast, Modal"
```

---

### Task 5: Docs page + Showcase demo

**Files:**
- Create: `apps/docs/src/pages/primitives/IconPage.tsx`
- Create: `apps/docs/src/pages/primitives/IconPage.module.css`
- Modify: `apps/docs/src/App.tsx` (add route)
- Create: `apps/showcase/src/pages/IconDemoPage.tsx`
- Modify: `apps/showcase/src/App.tsx` (add route)

**Interfaces:**
- Consumes: `Icon`, `IconName` from library

- [ ] **Step 1: Create IconPage (docs)**

Follow the existing page pattern (h1 + subtitle + Tabs Demo|Props|Code). Demo: grid of all icons with their names. Props table: name, size, label, className. Code snippet: basic usage.

- [ ] **Step 2: Create IconDemoPage (showcase)**

Grid of all icons with names, in a section. Follow existing showcase page pattern.

- [ ] **Step 3: Add routes to both App.tsx files**

- [ ] **Step 4: Build + verify**

Run: `npm run build --workspace=@enterprise-ui/components && npm run build --workspace=@enterprise-ui/docs && npm run build --workspace=@enterprise-ui/showcase`
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/pages/primitives/IconPage.tsx apps/docs/src/pages/primitives/IconPage.module.css apps/docs/src/App.tsx apps/showcase/src/pages/IconDemoPage.tsx apps/showcase/src/App.tsx
git commit -m "feat(docs,showcase): add Icon pages"
```

---

### Task 6: Final verification

- [ ] **Step 1: Run full suite**

Run: `npm test && npm --workspaces run typecheck --if-present && npm run lint && npm run format:check`
Expected: all pass

- [ ] **Step 2: Verify bundle size**

Run: `npm run build --workspace=@enterprise-ui/components` and check dist size <150KB gzip.

- [ ] **Step 3: Commit any cleanup**

```bash
git add -A && git commit -m "chore: icon system cleanup" || echo "nothing to commit"
```