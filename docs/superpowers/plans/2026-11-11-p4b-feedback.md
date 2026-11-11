# P4b Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the P4b feedback primitives — `Alert`, `Skeleton`, `Progress` — with docs pages, closing the first post-P4a slice.

**Architecture:** Three independent presentational components in their own folders under `packages/components/src/`. `Alert` maps tones to roles and an icon; `Skeleton` renders tokenised shimmer shapes with a reduced-motion fallback; `Progress` clamps values and exposes a labelled `role="progressbar"`. All are exported from the root with public types, documented by three Astro pages and demos.

**Tech Stack:** React 18, TypeScript strict, CSS Modules with `var(--…)` tokens, Vitest + Testing Library (no user-event), Astro/Starlight docs, Vite.

**Spec:** `docs/superpowers/specs/2026-11-11-p4b-feedback-design.md`

## Global Constraints

- Zero runtime deps; TS strict, no `any`.
- CSS Modules + `var(--…)` tokens only — no hardcoded hex in components (repo-wide `css-conventions.test.ts`).
- Presentational only: data in via props, events out via callbacks; no fetching, no timers that hide content.
- Component folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`, re-exported from `packages/components/src/index.ts` (component **and** public types).
- Vitest globals are on (`test`/`expect`/`vi` need no import); only `@testing-library/react` helpers are imported.
- `data-size={size}` in a component requires both `[data-size='sm']` and `[data-size='md']` blocks in its module CSS.
- Docs are Astro MDX under `apps/docs/src/content/docs/`; every fenced `tsx` block is typechecked by `npm run docs:snippets` and must be self-contained.
- Full gate before push: `npm test` → `npm --workspaces run typecheck --if-present` → `npm run docs:snippets` → `npm run lint` → `npm run format:check` → components/showcase/docs builds.
- Mutants: back up with `cp <file> <file>.bak`, apply the mutant, run the named test, restore with `cp <file>.bak <file>` — never `git checkout <file>`.

## Review Focus

- `Alert` warning/danger render `role="alert"` while info/success render `role="status"`; a caller `role` must still win.
- The `Alert` dismiss button exists only when `onDismiss` is set, is `type="button"`, and carries a real accessible name (default and custom).
- `Skeleton` is always `aria-hidden`; `prefers-reduced-motion: reduce` removes the shimmer animation.
- `Progress` clamps out-of-range/non-finite values and falls back to `max=100` for a non-positive/non-finite max.
- `Progress` with `max != 100` still reports the raw value/max via ARIA and the correct visual percentage; `label` names the bar, otherwise `aria-label` passes through.

**Every one of these gets a named test in the task that owns the code.**

---

### Task 1: `Alert`

**Files:**

- Create: `packages/components/src/Alert/types.ts`
- Create: `packages/components/src/Alert/Alert.tsx`
- Create: `packages/components/src/Alert/Alert.module.css`
- Create: `packages/components/src/Alert/index.ts`
- Create: `packages/components/src/Alert/Alert.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `Icon` from `../Icon`; `cx` from `../internal/cx`.
- Produces:
  - `export type AlertTone = 'info' | 'success' | 'warning' | 'danger'`
  - `export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> { tone?: AlertTone; title?: ReactNode; children?: ReactNode; onDismiss?: () => void; dismissLabel?: string }`
  - `export function Alert(props: AlertProps): JSX.Element`
  - DOM: `<div role data-tone class=alert><Icon aria-hidden/><div class=body>…</div>{onDismiss && <button type=button aria-label=…>}</div>`

- [ ] **Step 1: Write the failing tests**

Create `Alert.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { Alert } from './Alert';

const css = readFileSync(join(import.meta.dirname, 'Alert.module.css'), 'utf8');

test.each([
  ['info', 'status'],
  ['success', 'status'],
  ['warning', 'alert'],
  ['danger', 'alert'],
] as const)('%s renders with role %s', (tone, role) => {
  render(
    <Alert tone={tone} title={tone}>
      Nội dung
    </Alert>,
  );
  expect(screen.getByRole(role)).toHaveAttribute('data-tone', tone);
});

test('title and children compose, and the icon is decorative', () => {
  const { container } = render(<Alert title="Không lưu được">Kiểm tra kết nối rồi thử lại.</Alert>);
  expect(screen.getByText('Không lưu được')).toBeInTheDocument();
  expect(screen.getByText('Kiểm tra kết nối rồi thử lại.')).toBeInTheDocument();
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

test('the dismiss button is opt-in, labelled and calls back once', () => {
  const onDismiss = vi.fn();
  const { rerender } = render(<Alert>Nội dung</Alert>);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();

  rerender(
    <Alert onDismiss={onDismiss} dismissLabel="Đóng cảnh báo">
      Nội dung
    </Alert>,
  );
  const button = screen.getByRole('button', { name: 'Đóng cảnh báo' });
  expect(button).toHaveAttribute('type', 'button');
  fireEvent.click(button);
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test('the default dismiss label is Vietnamese and a caller role wins', () => {
  render(
    <Alert tone="danger" role="region" aria-label="Vùng cảnh báo" onDismiss={() => {}}>
      Nội dung
    </Alert>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Vùng cảnh báo' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Đóng thông báo' })).toBeInTheDocument();
});

test('module CSS pins the tone tokens, left edge and focus ring', () => {
  expect(css).toContain("data-tone='info'");
  expect(css).toContain('var(--color-blue-500)');
  expect(css).toContain('var(--danger-emphasis)');
  expect(css).toContain('border-left-width: 3px');
  expect(css).toContain('.close:focus-visible');
  expect(css).toContain('var(--focus-ring)');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Alert`
Expected: FAIL — cannot resolve `./Alert`.

- [ ] **Step 3: Implement `Alert`**

`types.ts` defines the public types exactly as in Interfaces. `Alert.tsx`:

```tsx
import { type ReactNode } from 'react';
import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import styles from './Alert.module.css';
import type { AlertProps, AlertTone } from './types';

const ICONS: Record<AlertTone, 'info' | 'check-circle' | 'alert-triangle' | 'alert-circle'> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};
const ROLES: Record<AlertTone, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
};

export function Alert({
  tone = 'info',
  title,
  children,
  onDismiss,
  dismissLabel = 'Đóng thông báo',
  className = '',
  ...rest
}: AlertProps) {
  return (
    <div role={ROLES[tone]} data-tone={tone} className={cx(styles.alert, className)} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        <Icon name={ICONS[tone]} size={16} />
      </span>
      <div className={styles.body}>
        {title && <span className={styles.title}>{title}</span>}
        {children && <div className={styles.message}>{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className={styles.close}
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
```

`Alert.module.css`: `.alert` grid/flex with 1px `--border`, 3px left edge, `--radius`,
`--surface`, padding, `--font-size`; tone selectors set the left border and icon
colour (tokens from §4.1); `.title` 600 weight; `.message` `--text`; `.close`
transparent button with `--focus-ring` focus and `cursor: pointer`.

`index.ts` re-exports `Alert` and `AlertProps`/`AlertTone`; add the same to
`packages/components/src/index.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Alert`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Alert packages/components/src/index.ts
git commit -m "feat(feedback): add Alert"
```

---

### Task 2: `Skeleton`

**Files:**

- Create: `packages/components/src/Skeleton/types.ts`
- Create: `packages/components/src/Skeleton/Skeleton.tsx`
- Create: `packages/components/src/Skeleton/Skeleton.module.css`
- Create: `packages/components/src/Skeleton/index.ts`
- Create: `packages/components/src/Skeleton/Skeleton.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `cx` from `../internal/cx`.
- Produces:
  - `export type SkeletonVariant = 'text' | 'circle' | 'rect'`
  - `export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> { variant?: SkeletonVariant; width?: CSSProperties['width']; height?: CSSProperties['height'] }`
  - `export function Skeleton(props: SkeletonProps): JSX.Element`
  - DOM: `<span aria-hidden="true" data-variant class=skeleton style=… />`

- [ ] **Step 1: Write the failing tests**

Create `Skeleton.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

const css = readFileSync(join(import.meta.dirname, 'Skeleton.module.css'), 'utf8');

test('defaults to a decorative text shape', () => {
  const { container } = render(<Skeleton />);
  const skeleton = container.firstElementChild!;
  expect(skeleton).toHaveAttribute('data-variant', 'text');
  expect(skeleton).toHaveAttribute('aria-hidden', 'true');
});

test('circle and rect variants accept numeric and string dimensions', () => {
  const { container, rerender } = render(<Skeleton variant="circle" width={40} height="2rem" />);
  const circle = container.firstElementChild as HTMLElement;
  expect(circle).toHaveAttribute('data-variant', 'circle');
  expect(circle.style.width).toBe('40px');
  expect(circle.style.height).toBe('2rem');

  rerender(<Skeleton variant="rect" width="60%" height={24} />);
  const rect = container.firstElementChild as HTMLElement;
  expect(rect).toHaveAttribute('data-variant', 'rect');
  expect(rect.style.width).toBe('60%');
  expect(rect.style.height).toBe('24px');
});

test('a caller style wins over the width and height props', () => {
  const { container } = render(<Skeleton width={20} height={20} style={{ width: 60 }} />);
  const skeleton = container.firstElementChild as HTMLElement;
  expect(skeleton.style.width).toBe('60px');
  expect(skeleton.style.height).toBe('20px');
});

test('module CSS pins shimmer, both variants and reduced motion', () => {
  expect(css).toContain('@keyframes shimmer');
  expect(css).toContain("data-variant='circle'");
  expect(css).toContain("data-variant='rect'");
  expect(css).toContain('prefers-reduced-motion: reduce');
  expect(css).toContain('animation: none');
  expect(css).toContain('var(--surface-muted)');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Skeleton`
Expected: FAIL — cannot resolve `./Skeleton`.

- [ ] **Step 3: Implement `Skeleton`**

`types.ts` exactly as in Interfaces. `Skeleton.tsx`:

```tsx
import { cx } from '../internal/cx';
import styles from './Skeleton.module.css';
import type { SkeletonProps } from './types';

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  style,
  ...rest
}: SkeletonProps) {
  return (
    <span
      {...rest}
      aria-hidden="true"
      data-variant={variant}
      className={cx(styles.skeleton, className)}
      style={{ width, height, ...style }}
    />
  );
}
```

`Skeleton.module.css`: `.skeleton` inline-block with the token gradient,
`background-size: 200% 100%`, `1.4s ease-in-out infinite` shimmer;
`[data-variant='text']` block 100%×1em/`--radius`;
`[data-variant='circle']` inline-block 32×32/50%;
`[data-variant='rect']` block 100%×80px/`--radius`;
`@media (prefers-reduced-motion: reduce)` sets `animation: none` and
`background: var(--surface-muted)`.

`index.ts` re-exports `Skeleton` and `SkeletonProps`/`SkeletonVariant`; add the
same to the root barrel.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Skeleton`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Skeleton packages/components/src/index.ts
git commit -m "feat(feedback): add Skeleton"
```

---

### Task 3: `Progress`

**Files:**

- Create: `packages/components/src/Progress/types.ts`
- Create: `packages/components/src/Progress/Progress.tsx`
- Create: `packages/components/src/Progress/Progress.module.css`
- Create: `packages/components/src/Progress/index.ts`
- Create: `packages/components/src/Progress/Progress.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `useId` from React; `cx` from `../internal/cx`.
- Produces:
  - `export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { value: number; max?: number; label?: ReactNode; showValue?: boolean; size?: 'sm' | 'md' }`
  - `export function Progress(props: ProgressProps): JSX.Element`
  - DOM: `<div role="progressbar" aria-valuemin aria-valuemax aria-valuenow aria-labelledby? data-size class=root>…</div>`

- [ ] **Step 1: Write the failing tests**

Create `Progress.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

const css = readFileSync(join(import.meta.dirname, 'Progress.module.css'), 'utf8');

test('renders a labelled progressbar with a visible percentage', () => {
  render(<Progress value={40} label="Đang tải" showValue />);
  const bar = screen.getByRole('progressbar', { name: 'Đang tải' });
  expect(bar).toHaveAttribute('aria-valuemin', '0');
  expect(bar).toHaveAttribute('aria-valuemax', '100');
  expect(bar).toHaveAttribute('aria-valuenow', '40');
  expect(screen.getByText('40%')).toHaveAttribute('aria-hidden', 'true');
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '40%' });
});

test('clamps values below zero and above max', () => {
  const { rerender } = render(<Progress value={-20} />);
  let bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuenow', '0');
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '0%' });

  rerender(<Progress value={150} />);
  bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuenow', '100');
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '100%' });
});

test('a non-finite value becomes zero and a non-positive max falls back to 100', () => {
  const { rerender } = render(<Progress value={Number.NaN} />);
  let bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuenow', '0');

  rerender(<Progress value={50} max={0} />);
  bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuemax', '100');
  expect(bar).toHaveAttribute('aria-valuenow', '50');
});

test('max other than 100 keeps the raw value and the correct visual ratio', () => {
  render(<Progress value={50} max={200} label="Bước" showValue />);
  const bar = screen.getByRole('progressbar', { name: 'Bước' });
  expect(bar).toHaveAttribute('aria-valuemax', '200');
  expect(bar).toHaveAttribute('aria-valuenow', '50');
  expect(screen.getByText('25%')).toBeInTheDocument();
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '25%' });
});

test('aria-label passes through when there is no label, and size lands on the root', () => {
  const { rerender } = render(<Progress value={10} aria-label="Đồng bộ" />);
  expect(screen.getByRole('progressbar', { name: 'Đồng bộ' })).toHaveAttribute('data-size', 'sm');

  rerender(<Progress value={10} aria-label="Đồng bộ" size="md" />);
  expect(screen.getByRole('progressbar', { name: 'Đồng bộ' })).toHaveAttribute('data-size', 'md');
});

test('module CSS pins both track sizes and the brand fill', () => {
  expect(css).toContain("[data-size='sm']");
  expect(css).toContain("[data-size='md']");
  expect(css).toContain('var(--color-blue-600)');
  expect(css).toContain('var(--radius)');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Progress`
Expected: FAIL — cannot resolve `./Progress`.

- [ ] **Step 3: Implement `Progress`**

`types.ts` exactly as in Interfaces. `Progress.tsx`:

```tsx
import { useId } from 'react';
import { cx } from '../internal/cx';
import styles from './Progress.module.css';
import type { ProgressProps } from './types';

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'sm',
  className = '',
  ...rest
}: ProgressProps) {
  const labelId = useId();
  const resolvedMax = Number.isFinite(max) && max > 0 ? max : 100;
  const resolvedValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), resolvedMax) : 0;
  const percent = (resolvedValue / resolvedMax) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={resolvedMax}
      aria-valuenow={resolvedValue}
      aria-labelledby={label ? labelId : undefined}
      data-size={size}
      className={cx(styles.root, className)}
      {...rest}
    >
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span id={labelId}>{label}</span>}
          {showValue && (
            <span aria-hidden="true" className={styles.value}>
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
```

`Progress.module.css`: `.root` grid/gap, `--font`/`--font-size`; `.header`
flex space-between; `.track` 100% width with `--surface-muted`, rounded;
`[data-size='sm'] .track` height 4px, `[data-size='md'] .track` height 8px;
`.fill` height 100% with `--color-blue-600`, `--radius`.

`index.ts` re-exports `Progress` and `ProgressProps`; add the same to the root
barrel.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Progress`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Progress packages/components/src/index.ts
git commit -m "feat(feedback): add Progress"
```

---

### Task 4: Docs pages, demos and navigation

**Files:**

- Create: `apps/docs/src/components/demos/AlertDemo.tsx`
- Create: `apps/docs/src/components/demos/SkeletonDemo.tsx`
- Create: `apps/docs/src/components/demos/ProgressDemo.tsx`
- Create: `apps/docs/src/content/docs/components/alert.mdx`
- Create: `apps/docs/src/content/docs/components/skeleton.mdx`
- Create: `apps/docs/src/content/docs/components/progress.mdx`
- Modify: `apps/docs/src/content/docs/components.mdx`
- Modify: `apps/docs/astro.config.mjs`

**Interfaces:**

- Consumes: `Alert`, `Skeleton`, `Progress` from `@enterprise-ui/components`;
  the existing `Demo.astro` wrapper and `demos.module.css` helpers.
- Produces: three reachable pages with demos, snippets, props tables and
  accessibility notes; `components.mdx` cards under **Feedback**; sidebar
  entries in the same group.

- [ ] **Step 1: Write the demos**

`AlertDemo.tsx`: four tones in a stack, one with a title and one dismissible.
`SkeletonDemo.tsx`: text/rect/circle shapes with explicit sizes, plus a paragraph
of skeleton lines built from several `Skeleton` instances.
`ProgressDemo.tsx`: controlled slider or button that increments a value, one
`max={5}` example and one `showValue` example; keep it presentational (state
lives in the demo).

- [ ] **Step 2: Write the three pages**

Each page starts with the same frontmatter shape as `radio.mdx`, imports its
demo, renders `<Demo title=…><XDemo client:visible /></Demo>`, a self-contained
`tsx` snippet, a props table matching the interfaces above, and an
**Accessibility** section:

- Alert: tone-to-role mapping, dismiss label, icon is decorative, parent owns
  visibility.
- Skeleton: `aria-hidden`, announce loading with `Spin`/live region, reduced
  motion.
- Progress: `aria-valuenow`/`min`/`max`, label vs `aria-label`, `aria-valuetext`
  for formatted values.

- [ ] **Step 3: Wire navigation**

Add three `.component-card` anchors to the Feedback group in `components.mdx` and
three sidebar items (`Alert`, `Skeleton`, `Progress`) to the Feedback group in
`apps/docs/astro.config.mjs`.

- [ ] **Step 4: Verify docs**

Run: `npm run docs:snippets`
Expected: `docs snippets ok`.

Run: `npm run build --workspace=@enterprise-ui/docs`
Expected: docs build succeeds with the new pages.

- [ ] **Step 5: Commit**

```bash
git add apps/docs
git commit -m "docs(feedback): document alert, skeleton and progress"
```

---

### Task 5: Full gate and PR

**Files:** none.

- [ ] **Step 1: Run the full suite**

Run: `npm test`
Expected: tokens ok; components and demo-shared pass; docs `astro check` clean.

- [ ] **Step 2: Run the rest of the CI gate**

Run: `npm --workspaces run typecheck --if-present`
Run: `npm run docs:snippets`
Run: `npm run lint`
Run: `npm run format:check`
Run: `npm run build --workspace=@enterprise-ui/components`
Run: `npm run build --workspace=@enterprise-ui/showcase`
Run: `npm run build --workspace=@enterprise-ui/docs`

Expected: every command exits 0.

- [ ] **Step 3: Run the mutant pass**

For each component, apply the named mutant, run the owning test, confirm it
fails, restore the backup. Minimum mutants:

- Alert role map: warning → `status` fails the role test.
- Alert dismiss guard: always render the button fails the opt-in test.
- Alert dismiss label: ignore `dismissLabel` fails the label test.
- Skeleton `aria-hidden` removed fails the default test.
- Skeleton reduced-motion block removed fails the CSS pin.
- Progress clamp removed fails the clamp test.
- Progress non-positive max guard removed fails the fallback test.
- Progress ratio hard-coded to `value` fails the max=200 test.
- Progress label id not wired fails the accessible-name test.

- [ ] **Step 4: Commit any gate fixes and open the PR**

```bash
git status --short
git push -u origin feat/p4b-feedback
```

Open the PR with the spec/plan links, the API summary, the gate table, and the
review-focus list. Do not merge; the user reviews and merges.
