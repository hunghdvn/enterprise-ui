# P4c Identity & Read-only Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the P4c identity/read-only primitives — `Avatar` and `Descriptions` — with docs pages, closing the next post-P4a slice.

**Architecture:** Two independent presentational components in their own folders under `packages/components/src/`. `Avatar` renders an image with an initials fallback and a decorative mode; `Descriptions` renders a semantic `<dl>` grid at 1–3 columns. Both are exported from the root with public types, documented by two Astro pages and demos, and the avatar colours are tokenised for both themes.

**Tech Stack:** React 18, TypeScript strict, CSS Modules with `var(--…)` tokens, Vitest + Testing Library (no user-event), Astro/Starlight docs, Vite.

**Spec:** `docs/superpowers/specs/2026-11-11-p4c-identity-design.md`

**Branch:** `feat/p4c-identity` from `main`.

## Global Constraints

- Zero runtime deps; TS strict, no `any`.
- CSS Modules + `var(--…)` tokens only — no hardcoded hex in components (repo-wide `css-conventions.test.ts`).
- Presentational only: data in via props, events out via callbacks; no fetching, no timers.
- Component folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`, re-exported from `packages/components/src/index.ts` (component **and** public types).
- Vitest globals are on (`test`/`expect`/`vi` need no import); only `@testing-library/react` helpers are imported.
- `data-size={size}` in a component requires both `[data-size='sm']` and `[data-size='md']` blocks in its module CSS.
- `data-size` selectors are scoped to the component root (`.root[data-size='…']` / `.avatar[data-size='…']`) so an ancestor's `data-size` cannot leak in.
- Docs are Astro MDX under `apps/docs/src/content/docs/`; every fenced `tsx` block is typechecked by `npm run docs:snippets` and must be self-contained.
- Full gate before push: `npm test` → `npm --workspaces run typecheck --if-present` → `npm run docs:snippets` → `npm run lint` → `npm run format:check` → components/showcase/docs builds.
- Mutants: back up with `cp <file> <file>.bak`, apply the mutant, run the named test, restore with `cp <file>.bak <file>` — never `git checkout <file>`.

## Review Focus

- `Avatar` shows initials when the image errors, and a new `src` retries the image instead of staying on the fallback.
- `Avatar` `alt=""` makes the mark decorative (no `role`, `aria-hidden="true"`); any other `alt` overrides the accessible name.
- A whitespace-only `name` still yields a real accessible label (`'?'`) and a `'?'` initial.
- `Descriptions` clamps `span` to `1..columns` through the `--desc-span` custom property, and the mobile rule resets `grid-column` so a wide span cannot create implicit columns.
- `Descriptions` with `items={[]}` renders nothing at all.

**Every one of these gets a named test in the task that owns the code.**

---

### Task 1: `Avatar` (+ avatar tokens)

**Files:**

- Create: `packages/components/src/Avatar/types.ts`
- Create: `packages/components/src/Avatar/Avatar.tsx`
- Create: `packages/components/src/Avatar/Avatar.module.css`
- Create: `packages/components/src/Avatar/index.ts`
- Create: `packages/components/src/Avatar/Avatar.test.tsx`
- Modify: `packages/components/src/index.ts`
- Modify: `packages/tokens/tokens.css`
- Modify: `packages/tokens/theme-light.css`
- Modify: `packages/tokens/theme-dark.css`
- Modify: `packages/tokens/tokens.test.mjs`

**Interfaces:**

- Consumes: `cx` from `../internal/cx`.
- Produces:
  - `export type AvatarSize = 'sm' | 'md' | 'lg'`
  - `export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> { name: string; src?: string; alt?: string; size?: AvatarSize }`
  - `export function Avatar(props: AvatarProps): JSX.Element`
  - DOM: `<span class=avatar data-size role="img" aria-label=…><img class=image alt="" aria-hidden="true"> | <span class=initials aria-hidden="true">…</span></span>`; `alt=""` drops role/aria-label and adds `aria-hidden="true"`.

- [ ] **Step 1: Write the failing tests**

Create `Avatar.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
import { Avatar } from './Avatar';

const css = readFileSync(join(import.meta.dirname, 'Avatar.module.css'), 'utf8');

test('renders the image with the name as its accessible label', () => {
  const { container } = render(<Avatar name="Nguyễn An" src="/an.jpg" />);
  expect(screen.getByRole('img', { name: 'Nguyễn An' })).toHaveAttribute('data-size', 'md');
  const img = container.querySelector('img')!;
  expect(img).toHaveAttribute('src', '/an.jpg');
  expect(img).toHaveAttribute('alt', '');
  expect(img).toHaveAttribute('aria-hidden', 'true');
});

test('derives two initials from a multi-word Vietnamese name', () => {
  render(<Avatar name="nguyễn văn an" />);
  expect(screen.getByText('NA')).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByRole('img', { name: 'nguyễn văn an' })).toBeInTheDocument();
});

test('a single-word name yields one initial', () => {
  render(<Avatar name="An" />);
  expect(screen.getByText('A')).toBeInTheDocument();
});

test('a whitespace-only name still has an accessible label and initial', () => {
  render(<Avatar name="   " />);
  expect(screen.getByRole('img', { name: '?' })).toBeInTheDocument();
  expect(screen.getByText('?')).toBeInTheDocument();
});

test('falls back to initials when the image fails, and a new src retries', () => {
  const { container, rerender } = render(<Avatar name="Nguyễn An" src="/broken.jpg" />);
  fireEvent.error(container.querySelector('img')!);
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('NA')).toBeInTheDocument();

  rerender(<Avatar name="Nguyễn An" src="/an.jpg" />);
  expect(container.querySelector('img')).toHaveAttribute('src', '/an.jpg');
});

test('alt overrides the accessible label', () => {
  render(<Avatar name="Nguyễn An" src="/an.jpg" alt="Ảnh hồ sơ của An" />);
  expect(screen.getByRole('img', { name: 'Ảnh hồ sơ của An' })).toBeInTheDocument();
});

test('alt="" makes the avatar decorative', () => {
  const { container } = render(<Avatar name="Nguyễn An" src="/an.jpg" alt="" />);
  const root = container.firstElementChild!;
  expect(root).toHaveAttribute('aria-hidden', 'true');
  expect(root).not.toHaveAttribute('role');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test('size variants set data-size and rest lands on the root', () => {
  const { container } = render(
    <>
      <Avatar name="An" />
      <Avatar name="Bình" size="sm" className="custom" data-testid="sm-avatar" />
      <Avatar name="Chi" size="lg" />
    </>,
  );
  const sizes = [...container.querySelectorAll('[data-size]')].map((el) =>
    el.getAttribute('data-size'),
  );
  expect(sizes).toEqual(['md', 'sm', 'lg']);
  expect(screen.getByTestId('sm-avatar')).toHaveClass('custom');
});

test('module CSS pins three scoped sizes, the ring and image cover', () => {
  expect(cssRule(css, ".avatar[data-size='sm']")).toMatch(/width:\s*24px/);
  expect(cssRule(css, ".avatar[data-size='md']")).toMatch(/width:\s*32px/);
  expect(cssRule(css, ".avatar[data-size='lg']")).toMatch(/width:\s*48px/);
  expect(cssRule(css, '.avatar')).toMatch(/border-radius:\s*50%/);
  expect(cssRule(css, '.avatar')).toMatch(/box-shadow:\s*inset 0 0 0 1px var\(--border\)/);
  expect(cssRule(css, '.image')).toMatch(/object-fit:\s*cover/);
  expect(css).not.toMatch(/^\[data-size='(sm|md|lg)'\]/m);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Avatar`
Expected: FAIL — cannot resolve `./Avatar`.

- [ ] **Step 3: Implement `Avatar`**

`types.ts` defines the public types exactly as in Interfaces.

`Avatar.tsx`:

- `initials(name: string): string` — split `name.trim()` on `/\s+/`, drop empty tokens; none → `'?'`; one token → its first code point; otherwise first code point of the first and last token; join and `toUpperCase()`. Use `Array.from` so a surrogate pair is not split.
- State: `failedSrc: string | null`, set by the inner image's `onError`.
- `decorative = alt === ''`; `label = alt ?? (name.trim() ? name : '?')`.
- `showImage = Boolean(src) && failedSrc !== src` (a new `src` renders without an effect).
- Root `<span>`: `cx(styles.avatar, className)`, `data-size={size}`, `role={decorative ? undefined : 'img'}`, `aria-label={decorative ? undefined : label}`, `aria-hidden={decorative || undefined}`, then `{...rest}` last.
- Image: `className={styles.image}`, `src`, `alt=""`, `aria-hidden="true"`, internal `onError`.
- Fallback: `<span className={styles.initials} aria-hidden="true">{initials(name)}</span>`.

`Avatar.module.css`:

- `.avatar`: inline-flex centred, `flex-shrink: 0`, `overflow: hidden`, `border-radius: 50%`, `background: var(--avatar-bg)`, `color: var(--avatar-text)`, `font-family: var(--font)`, `font-weight: 600`, `line-height: 1`, `user-select: none`, `box-shadow: inset 0 0 0 1px var(--border)`.
- `.avatar[data-size='sm']` 24×24 / 10px; `md` 32×32 / 12px; `lg` 48×48 / 16px.
- `.image`: `width: 100%`, `height: 100%`, `object-fit: cover`, `display: block`.
- `.initials`: `letter-spacing: 0.02em`.

Tokens — add to each block:

- `tokens.css` `:root` and `theme-light.css` `[data-theme='light']`: `--avatar-bg: var(--color-blue-100); --avatar-text: var(--color-blue-800);` with a comment that the dark pair flips the same two blues.
- `theme-dark.css` `[data-theme='dark']`: `--avatar-bg: var(--color-blue-800); --avatar-text: var(--color-blue-100);`.

`index.ts` re-exports `Avatar` and `{ AvatarProps, AvatarSize }`; add the same two lines to the root barrel next to `Badge`.

Token tests — add below the existing skeleton guards in `tokens.test.mjs`:

```js
assertThemeTokens('root', readTokenFile('tokens.css'), ':root', {
  '--avatar-bg': 'var(--color-blue-100)',
  '--avatar-text': 'var(--color-blue-800)',
});
assertThemeTokens('light', lightCss, '[data-theme="light"]', {
  '--avatar-bg': 'var(--color-blue-100)',
  '--avatar-text': 'var(--color-blue-800)',
});
assertThemeTokens('dark', darkCss, '[data-theme="dark"]', {
  '--avatar-bg': 'var(--color-blue-800)',
  '--avatar-text': 'var(--color-blue-100)',
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Avatar`
Expected: PASS.

Run: `node packages/tokens/tokens.test.mjs`
Expected: `tokens ok`.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Avatar packages/components/src/index.ts packages/tokens
git commit -m "feat(identity): add Avatar"
```

---

### Task 2: `Descriptions`

**Files:**

- Create: `packages/components/src/Descriptions/types.ts`
- Create: `packages/components/src/Descriptions/Descriptions.tsx`
- Create: `packages/components/src/Descriptions/Descriptions.module.css`
- Create: `packages/components/src/Descriptions/index.ts`
- Create: `packages/components/src/Descriptions/Descriptions.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `cx` from `../internal/cx`.
- Produces:
  - `export type DescriptionsColumns = 1 | 2 | 3`
  - `export type DescriptionsLayout = 'horizontal' | 'vertical'`
  - `export type DescriptionsSize = 'sm' | 'md'`
  - `export interface DescriptionItem { label: ReactNode; value: ReactNode; span?: number }`
  - `export interface DescriptionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { items: DescriptionItem[]; columns?: DescriptionsColumns; layout?: DescriptionsLayout; bordered?: boolean; size?: DescriptionsSize }`
  - `export function Descriptions(props: DescriptionsProps): JSX.Element`
  - DOM: `<div class=root data-size><dl class=list data-columns data-layout [data-bordered]><div class=item style="--desc-span: N"><dt class=label>…</dt><dd class=value>…</dd></div></dl></div>`; `items=[]` → `null`.

- [ ] **Step 1: Write the failing tests**

Create `Descriptions.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { cssBlock, cssRule } from '../internal/cssRule';
import { Descriptions } from './Descriptions';

const css = readFileSync(join(import.meta.dirname, 'Descriptions.module.css'), 'utf8');

test('renders one term/definition pair per item', () => {
  render(
    <Descriptions
      items={[
        { label: 'Email', value: 'an@example.com' },
        { label: 'Vai trò', value: 'Quản trị' },
      ]}
    />,
  );
  const list = document.querySelector('dl')!;
  expect(list.querySelectorAll('dt')).toHaveLength(2);
  expect(list.querySelectorAll('dd')).toHaveLength(2);
  expect(screen.getByText('Email').tagName).toBe('DT');
  expect(screen.getByText('an@example.com').tagName).toBe('DD');
});

test('defaults to two columns, horizontal layout and md size', () => {
  const { container } = render(<Descriptions items={[{ label: 'A', value: 'B' }]} />);
  const root = container.firstElementChild!;
  const list = container.querySelector('dl')!;
  expect(root).toHaveAttribute('data-size', 'md');
  expect(list).toHaveAttribute('data-columns', '2');
  expect(list).toHaveAttribute('data-layout', 'horizontal');
  expect(list).not.toHaveAttribute('data-bordered');
});

test('renders explicit columns, layout, borders and size', () => {
  const { container } = render(
    <Descriptions
      items={[{ label: 'A', value: 'B' }]}
      columns={3}
      layout="vertical"
      bordered
      size="sm"
    />,
  );
  expect(container.firstElementChild).toHaveAttribute('data-size', 'sm');
  const list = container.querySelector('dl')!;
  expect(list).toHaveAttribute('data-columns', '3');
  expect(list).toHaveAttribute('data-layout', 'vertical');
  expect(list).toHaveAttribute('data-bordered', 'true');
});

test('span sets a custom property and clamps to the column count', () => {
  const { container } = render(
    <Descriptions
      columns={2}
      items={[
        { label: 'A', value: '1', span: 2 },
        { label: 'B', value: '2', span: 9 },
        { label: 'C', value: '3', span: 0 },
        { label: 'D', value: '4', span: Number.NaN },
      ]}
    />,
  );
  const items = [...container.querySelectorAll('dl > div')] as HTMLElement[];
  expect(items.map((el) => el.style.getPropertyValue('--desc-span'))).toEqual(['2', '2', '1', '1']);
});

test('renders nothing when items is empty', () => {
  const { container } = render(<Descriptions items={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('className and rest land on the root', () => {
  const { container } = render(
    <Descriptions items={[{ label: 'A', value: 'B' }]} className="pane" id="detail" />,
  );
  const root = container.firstElementChild!;
  expect(root).toHaveClass('pane');
  expect(root).toHaveAttribute('id', 'detail');
});

test('module CSS pins columns, scoped sizes, borders and the mobile collapse', () => {
  expect(cssRule(css, ".list[data-columns='1']")).toMatch(
    /grid-template-columns:\s*minmax\(0, 1fr\)/,
  );
  expect(cssRule(css, ".list[data-columns='2']")).toMatch(/repeat\(2, minmax\(0, 1fr\)\)/);
  expect(cssRule(css, ".list[data-columns='3']")).toMatch(/repeat\(3, minmax\(0, 1fr\)\)/);
  expect(cssRule(css, ".root[data-size='sm'] .value")).toMatch(/font-size:\s*12px/);
  expect(cssRule(css, ".root[data-size='md'] .value")).toMatch(/font-size:\s*var\(--font-size\)/);
  expect(cssRule(css, ".list[data-bordered='true'] .item")).toMatch(/border-right:/);
  const mobile = cssBlock(css, '@media (max-width: 640px)');
  expect(cssRule(mobile, '.list[data-columns]')).toMatch(
    /grid-template-columns:\s*minmax\(0, 1fr\)/,
  );
  expect(cssRule(mobile, ".list[data-layout='horizontal'] .item")).toMatch(
    /grid-template-columns:\s*minmax\(0, 1fr\)/,
  );
  expect(cssRule(mobile, '.item')).toMatch(/grid-column:\s*auto/);
  expect(css).not.toMatch(/^\[data-size='(sm|md)'\]/m);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Descriptions`
Expected: FAIL — cannot resolve `./Descriptions`.

- [ ] **Step 3: Implement `Descriptions`**

`types.ts` defines the public types exactly as in Interfaces.

`Descriptions.tsx`:

- Return `null` when `items.length === 0`.
- Root `<div>`: `cx(styles.root, className)`, `data-size={size}`, then `{...rest}`.
- `<dl className={styles.list} data-columns={columns} data-layout={layout}>` plus
  `{...(bordered ? { 'data-bordered': 'true' } : {})}`.
- Per item: `const raw = typeof item.span === 'number' && Number.isFinite(item.span) ? Math.trunc(item.span) : 1;`
  then `const span = Math.min(Math.max(raw, 1), columns);`.
- Item wrapper: `key={index}`, `className={styles.item}`,
  `style={{ '--desc-span': span } as CSSProperties}` (cast because custom
  properties are not in `CSSProperties`).
- `<dt className={styles.label}>{item.label}</dt>` and
  `<dd className={styles.value}>{item.value}</dd>`.

`Descriptions.module.css`:

- `.root`: `font-family: var(--font)`, `color: var(--text)`.
- `.list`: `display: grid`, `gap: 12px 24px`, `margin: 0`.
- `data-columns` 1/2/3: `minmax(0, 1fr)` / `repeat(2, minmax(0, 1fr))` /
  `repeat(3, minmax(0, 1fr))`.
- `.item`: `display: grid`, `gap: 2px`, `min-width: 0`,
  `grid-column: span var(--desc-span, 1)`.
- `.list[data-layout='horizontal'] .item`:
  `grid-template-columns: minmax(96px, 140px) minmax(0, 1fr)`,
  `gap: 8px`, `align-items: baseline`.
- `.label`: `margin: 0`, `color: var(--text-muted)`, `line-height: 1.4`.
- `.value`: `margin: 0`, `color: var(--text)`, `line-height: 1.5`,
  `overflow-wrap: anywhere`.
- Scoped sizes: `.root[data-size='sm'] .label` 11px / `.value` 12px;
  `.root[data-size='md'] .label` 12px / `.value` `var(--font-size)`.
- `data-bordered='true'`: list `gap: 0`, top/left `1px solid var(--border)`;
  item `padding: 8px 12px`, right/bottom `1px solid var(--border)`.
- `@media (max-width: 640px)` placed last: `.list[data-columns]` and
  `.list[data-layout='horizontal'] .item` collapse to `minmax(0, 1fr)`;
  `.item { grid-column: auto; }` so a wide span cannot create implicit columns.

`index.ts` re-exports `Descriptions` and
`{ DescriptionItem, DescriptionsColumns, DescriptionsLayout, DescriptionsProps, DescriptionsSize }`;
add the same lines to the root barrel next to `Badge`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Descriptions`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Descriptions packages/components/src/index.ts
git commit -m "feat(identity): add Descriptions"
```

---

### Task 3: Docs pages, demos and navigation

**Files:**

- Create: `apps/docs/src/components/demos/AvatarDemo.tsx`
- Create: `apps/docs/src/components/demos/DescriptionsDemo.tsx`
- Create: `apps/docs/src/content/docs/components/avatar.mdx`
- Create: `apps/docs/src/content/docs/components/descriptions.mdx`
- Modify: `apps/docs/src/content/docs/components.mdx`
- Modify: `apps/docs/astro.config.mjs`

**Interfaces:**

- Consumes: `Avatar`, `Descriptions` from `@enterprise-ui/components`; the
  existing `Demo.astro` wrapper and `demos.module.css` helpers.
- Produces: two reachable pages with demos, snippets, props tables and
  accessibility notes; `components.mdx` cards (**Avatar** under Primitives,
  **Descriptions** under Data); sidebar entries in the same groups.

- [ ] **Step 1: Write the demos**

`AvatarDemo.tsx`:

- `PHOTO` — a self-contained inline SVG data URI (blue-600 background, light
  head/shoulders) so the loaded-image state needs no network.
- `BROKEN = 'data:image/png;base64,AAAA'` for the failure → initials state.
- Render: three sizes with `PHOTO`, an initials-only `Avatar` for a
  Vietnamese name, a failed-image `Avatar`, and a `alt=""` Avatar next to the
  visible name to show the decorative pattern.

`DescriptionsDemo.tsx`:

- One `columns={2}` horizontal pane with 4 items, one `columns={3}` vertical
  `size="sm"` bordered pane, and one item with `span={2}` (e.g. an address).
- Use `demos.module.css` `stack`/`section`/`sectionTitle` helpers; keep all
  state out of the demo (static data).

- [ ] **Step 2: Write the two pages**

Each page starts with the same frontmatter shape as `alert.mdx`, imports its
demo, renders `<Demo title=…><XDemo client:visible /></Demo>`, a
self-contained `tsx` snippet, a props table matching the interfaces above,
and an **Accessibility** section:

- Avatar: `name` is required; initials derivation; `alt` override and the
  `alt=""` decorative rule; image failure falls back; the caller supplies
  the link/button and any presence indicator; image is decorative inside the
  root `role="img"`.
- Descriptions: native `<dl>`/`<dt>`/`<dd>` semantics; 1–3 columns; the
  one-column collapse at 640px; `span` is clamped; empty `items` renders
  nothing; values may contain links/buttons.

- [ ] **Step 3: Wire navigation**

Add the **Avatar** card to the Primitives group and the **Descriptions** card
to the Data group in `components.mdx`. Add `{ label: 'Avatar', slug:
'components/avatar' }` to Primitives and `{ label: 'Descriptions', slug:
'components/descriptions' }` to Data in `apps/docs/astro.config.mjs`.

- [ ] **Step 4: Verify docs**

Run: `npm run docs:snippets`
Expected: `docs snippets ok (… snippets typechecked)`.

Run: `npm run build --workspace=@enterprise-ui/components`
Expected: build succeeds (the docs demos consume `dist/`).

Run: `npm run build --workspace=@enterprise-ui/docs`
Expected: docs build succeeds with 48 pages.

- [ ] **Step 5: Commit**

```bash
git add apps/docs
git commit -m "docs(identity): document avatar and descriptions"
```

---

### Task 4: Full gate and PR

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

- Avatar label: default `alt` no longer falls back to `name` → image label
  test fails.
- Avatar retry: drop the `failedSrc !== src` comparison → new-`src` test fails.
- Avatar decorative: remove the `alt === ''` branch → decorative test fails.
- Avatar empty name: return `''` instead of `'?'` → whitespace-name test fails.
- Avatar initials: use the first two letters of the first word → Vietnamese
  initials test fails.
- Avatar CSS: change the `md` width → size pin fails.
- Descriptions semantics: render `<div>` instead of `<dl>` → pair test fails.
- Descriptions clamp: drop `Math.min(…, columns)` → span test fails.
- Descriptions empty: remove the `items.length === 0` guard → empty test fails.
- Descriptions bordered: always emit `data-bordered` → default test fails.
- Descriptions CSS: remove the mobile `.item { grid-column: auto; }` →
  mobile pin fails.

- [ ] **Step 4: Commit any gate fixes and open the PR**

```bash
git push -u origin feat/p4c-identity
```

Open the PR with the spec/plan links, the API summary, the gate table, and the
review-focus list. Do not merge; the user reviews and merges.
