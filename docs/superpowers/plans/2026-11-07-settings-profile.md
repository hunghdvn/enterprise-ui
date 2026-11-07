# Settings/Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a presentational `SettingsProfile` page template and a `ProfileForm` personal-info form, plus one docs page composing them into a three-section settings screen.

**Architecture:** Two independent components in their own folders under `packages/components/src/`, exported from the root with their public types. `SettingsProfile` owns page chrome (header, section nav, named panes) and renders section bodies as opaque slots; `ProfileForm` owns one controlled form over five fixed fields. The docs page composes both, holding the value and active-section state.

**Tech Stack:** React 18, TypeScript strict, CSS Modules with `var(--…)` tokens, Vitest + Testing Library, Vite (components lib / docs app).

**Spec:** `docs/superpowers/specs/2026-11-07-settings-profile-design.md`

## Global Constraints

- Zero runtime deps; TS strict, no `any`.
- CSS Modules + `var(--…)` tokens only — no hardcoded hex in components.
- Presentational only: data in via props, events out via `onChange`/`onSubmit`/`onSectionChange`; no fetching, no validation, no persistence.
- Component folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`, re-exported from `packages/components/src/index.ts` (component **and** public types).
- Vitest globals are on (`test`/`expect`/`vi` need no import); only `@testing-library/react` helpers are imported.
- Docs pages: `export default`, exactly one top-level `const code = \`…\`;`, no nested backticks, must pass `docs:snippets`.
- No new primitives: no `Switch`, no `Textarea`, no `Modal` wiring.
- `SettingsProfile` has no `as`/`fill`/`min-height: 100dvh` props — it is an embedded page under `AppShell`'s single `<main>`.
- Full gate before push: `npm test` → `npm --workspaces run typecheck --if-present` → `npm run docs:snippets` → `npm run lint` → `npm run format:check` → three workspace builds.

## Review Focus

- A removed/stale `activeKey` (or `sections` that no longer contains it) must show the first section, not a blank page.
- `sections={[]}` must render no nav and no pane rather than crashing on `sections[0]`.
- Switching sections must not destroy a half-typed value in another pane (panes stay mounted under `hidden`).
- An autofilled profile value must reach the caller and survive the next render (submit reads the DOM and calls `onChange` before `onSubmit`).
- Enter in a field while `loading`/`disabled` must not submit.

---

### Task 1: `SettingsProfile` — nav, panes, hidden state

**Files:**

- Create: `packages/components/src/SettingsProfile/types.ts`
- Create: `packages/components/src/SettingsProfile/SettingsProfile.tsx`
- Create: `packages/components/src/SettingsProfile/SettingsProfile.module.css`
- Create: `packages/components/src/SettingsProfile/index.ts`
- Create: `packages/components/src/SettingsProfile/SettingsProfile.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `cx` from `../internal/cx`; `isPresent` from `../internal/isPresent` if a slot check is needed (title/subtitle/actions are `ReactNode`, so use `isPresent` rather than truthiness).
- Produces:
  - `export interface SettingsSection { key: string; label: string; description?: ReactNode; content: ReactNode }`
  - `export interface SettingsProfileProps { as?: 'main' | 'div' | 'section'; title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; sections: SettingsSection[]; activeKey?: string; defaultActiveKey?: string; onSectionChange?: (key: string) => void; navLabel?: string; level?: 1 | 2; className?: string }`
  - `export function SettingsProfile(props: SettingsProfileProps): JSX.Element`
  - DOM contract later tasks and the docs page rely on: root `data-*`-free `<main>` by default (`as` picks `main`/`div`/`section`); nav is `<nav aria-label>` containing `<button type="button">` per section; the active button carries `aria-current="true"`; each pane is `<section aria-labelledby>` with an `<h2>`/`<h3>`; inactive panes carry the `hidden` attribute.

- [ ] **Step 1: Write the failing test**

Create `SettingsProfile.test.tsx` with this first block:

```tsx
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { SettingsProfile } from './SettingsProfile';
import type { SettingsSection } from './types';

const css = readFileSync(join(import.meta.dirname, 'SettingsProfile.module.css'), 'utf8');

const sections: SettingsSection[] = [
  {
    key: 'profile',
    label: 'Thông tin cá nhân',
    description: 'Ảnh và thông tin liên hệ.',
    content: <p>Pane profile</p>,
  },
  { key: 'notifications', label: 'Thông báo', content: <p>Pane notifications</p> },
  { key: 'security', label: 'Bảo mật', content: <p>Pane security</p> },
];

test('renders the default title, the nav and the first pane', () => {
  render(<SettingsProfile sections={sections} />);

  expect(screen.getByRole('heading', { level: 1, name: 'Cài đặt' })).toBeInTheDocument();
  const nav = screen.getByRole('navigation', { name: 'Mục cài đặt' });
  expect(
    within(nav)
      .getAllByRole('button')
      .map((b) => b.textContent),
  ).toEqual(['Thông tin cá nhân', 'Thông báo', 'Bảo mật']);
  expect(within(nav).getByRole('button', { name: 'Thông tin cá nhân' })).toHaveAttribute(
    'aria-current',
    'true',
  );
  expect(screen.getByRole('region', { name: 'Thông tin cá nhân' })).toBeInTheDocument();
  expect(screen.getByText('Pane profile')).toBeVisible();
});

test('inactive panes stay mounted but hidden', () => {
  const { container } = render(<SettingsProfile sections={sections} />);

  const panes = container.querySelectorAll('section');
  expect(panes).toHaveLength(3);
  expect(panes[0]).not.toHaveAttribute('hidden');
  expect(panes[1]).toHaveAttribute('hidden');
  expect(panes[2]).toHaveAttribute('hidden');
  // Out of the accessibility tree and the tab order…
  expect(screen.queryByText('Pane notifications')).not.toBeInTheDocument();
});

test('the hidden rule is real CSS, not just an attribute', () => {
  expect(css).toMatch(/\[hidden\]\s*\{\s*display:\s*none;?\s*\}/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/SettingsProfile`
Expected: FAIL — cannot resolve `./SettingsProfile`.

- [ ] **Step 3: Implement `SettingsProfile`**

`types.ts` — the two interfaces from the Interfaces block, with these JSDoc lines kept: `as` "Wrapper element; default `main`. Keep `main` inside AppShell — its content area is a `div`, so the page would otherwise lose its main landmark. Use `div` only when an ancestor already renders `<main>`", `activeKey` "Controlled active section; omit for uncontrolled", `defaultActiveKey` "Initial section when uncontrolled; defaults to the first section", `navLabel` "Accessible name for the section nav landmark; default 'Mục cài đặt'", `level` "Page heading level; default 1. Panes then use h2 (h3 when this is 2)".

`SettingsProfile.tsx` — signature `export function SettingsProfile({ as = 'main', title = 'Cài đặt', subtitle, actions, sections, activeKey, defaultActiveKey, onSectionChange, navLabel = 'Mục cài đặt', level = 1, className = '' }: SettingsProfileProps)`, then `const Root = as;`. Behaviour:

- Active key: `const [uncontrolled, setUncontrolled] = useState(() => defaultActiveKey ?? sections[0]?.key)`; `const isControlled = activeKey !== undefined`; the candidate is `isControlled ? activeKey : uncontrolled`; resolve with `sections.some((s) => s.key === candidate) ? candidate : sections[0]?.key`. Compute the state initialiser and the fallback defensively (`sections[0]?.key`) because `sections` may be empty.
- Reconcile that fallback in a `useEffect` on `[current, candidate, activeKey, onSectionChange]`: when `current` differs from `candidate`, `setUncontrolled(current)` when uncontrolled, else `onSectionChange?.(current)`. A render-only fallback lets a removed-then-restored section steal the view and leaves a controlled caller pointing at a section that is not on screen.
- Clicking a nav button: `onSectionChange?.(key)`; when uncontrolled also `setUncontrolled(key)`.
- `Title: 'h1' | 'h2' = level === 1 ? 'h1' : 'h2'`; `PaneTitle = level === 1 ? 'h2' : 'h3'`.
- Nav: `<nav aria-label={navLabel} className={styles.nav} ref={navRef}>` with `sections.map` → `<button type="button" key={key} ref={isActive ? activeRef : undefined} className={styles.navItem} aria-current={isActive ? 'true' : undefined} data-active={isActive ? 'true' : 'false'} onClick={...}>{label}</button>`. `"true"`, not `"page"`: `AppShell`'s sidebar already marks the route with `aria-current="page"`.
- A `useEffect` on `[current]` centres the active item (`nav.scrollLeft += itemRect.left - navRect.left - (nav.clientWidth - itemRect.width) / 2`, from `getBoundingClientRect()` of nav and item) only when `nav.scrollWidth > nav.clientWidth`, so an off-screen `defaultActiveKey` cannot start invisible. Move the nav's own offset, never the page's. Rects, not `offsetLeft`: that value is relative to the offsetParent (`<body>` unless an ancestor is positioned), so inside a padded frame it includes the nav's distance from the page edge and overshoots — measured on the docs page as `scrollLeft` 134 instead of 96.
- Panes: `sections.map((section, index) => …)` → `<section key={key} className={styles.pane} aria-labelledby={\`${baseId}-pane-${index}\`} aria-describedby={isPresent(description) ? \`${baseId}-desc-${index}\` : undefined} hidden={!isActive}>`. Use one `useId()`at the top and build both ids from the **index**:`aria-labelledby`is a space-separated id list, so a key like`"account settings"` would split into two ids that do not exist, and key-derived ids in one namespace collide (`privacy`'s description vs the pane of `privacy-description`).
- Inside a pane: `<PaneTitle className={styles.paneTitle} id={paneId}>{label}</PaneTitle>`, `isPresent(description) && <p className={styles.paneDescription} id={descriptionId}>{description}</p>`, then `<div className={styles.paneBody}>{content}</div>`.
- Header: `<header className={styles.header}>` with `<Title className={styles.title} id={titleId}>{title}</Title>`, `isPresent(subtitle) && <p className={styles.subtitle}>`, `isPresent(actions) && <div className={styles.actions}>`.
- Root: `<Root className={cx(styles.root, className)} aria-labelledby={as === 'div' ? undefined : titleId}>` — a named `main`/`section` is a landmark, but ARIA 1.2 forbids `aria-labelledby` on role=generic, so the `div` variant drops it. No `data-fill`.

`SettingsProfile.module.css` — `.root { container-type: inline-size; box-sizing: border-box; display: grid; gap: 16px; grid-template-columns: minmax(0, 1fr); min-width: 0; font-family: var(--font); color: var(--text); }`. `.nav` is a horizontally scrollable row below 768px (`display: flex; gap: 4px; overflow-x: auto; scrollbar-width: thin; scrollbar-color: var(--border) transparent;`) — a _thin_ bar, not a hidden one: hiding it leaves clipped sections unreachable for a vertical-only wheel. Each `.navItem` a button with `border: 0; border-bottom: 3px solid transparent; background: transparent; padding: 8px 10px; font: inherit; font-size: var(--font-size); color: var(--text-muted); cursor: pointer; text-align: left; white-space: nowrap;` plus `:hover { color: var(--text); background: var(--surface-muted) }`, `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: -2px }` (an outward ring is clipped by the scroller), and `[data-active='true'] { border-bottom-color: var(--action-text); color: var(--action-text); font-weight: 600; background: var(--nav-active-bg) }`. The row's cue is an underline; a left border there would butt against the previous item. `.pane[hidden] { display: none }`. Pane card: `background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px;`. Inside `@container (min-width: 768px)` switch the root to `grid-template-columns: 220px minmax(0, 1fr); align-items: start;`, give `.nav` `flex-direction: column; overflow-x: visible;`, and switch `.navItem` to `border-bottom: 0; border-left: 3px solid transparent; white-space: normal; overflow-wrap: anywhere;` (long labels wrap inside the 220px rail instead of spilling over the pane) with `[data-active='true'] { border-left-color: var(--action-text) }`. Dark theme: rely on tokens only (no `[data-theme='dark']` block); `--color-blue-600` is **not** re-mapped in dark, so use `--action-text` for the active colour.

`index.ts` — `export { SettingsProfile } from './SettingsProfile'; export type { SettingsProfileLandmark, SettingsProfileProps, SettingsSection } from './types';`

`packages/components/src/index.ts` — add the component and both types in the existing alphabetical block.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/SettingsProfile`
Expected: PASS (2 tests).

- [ ] **Step 5: Add the remaining behaviour tests**

Append, each as its own `test(...)`:

```tsx
test('clicking a section switches the pane and moves aria-current', () => {
  /* uncontrolled: click "Bảo mật" → region "Bảo mật" visible, previous pane hidden, exactly one aria-current */
});

test('defaultActiveKey selects the opening section', () => {
  /* defaultActiveKey="security" → region "Bảo mật" visible, aria-current on it */
});

test('activeKey is controlled: clicking reports but does not switch', () => {
  /* activeKey="profile" + onSectionChange spy; click "Thông báo"; spy called with 'notifications'; region "Thông tin cá nhân" still visible; no second render switch */
});

test('a value typed in one pane survives a section switch', () => {
  /* render with a content slot containing <input aria-label="Tên hiển thị" />; type; switch away and back; value still there */
});

test('an unknown activeKey falls back to the first section', () => {
  /* activeKey="missing" → region "Thông tin cá nhân" visible; no region "missing" */
});

test('empty sections renders no nav and no pane', () => {
  /* sections={[]} → queryByRole('navigation') null; queryAllByRole('region') empty; title still renders; no throw */
});

test('level={2} shifts the page and pane headings down one level', () => {
  /* h2 "Cài đặt", h3 pane headings, no h1 */
});

test('navLabel renames the nav landmark and className merges', () => {
  /* navLabel="Khu vực"; container.firstElementChild has custom class */
});

test('the root is a main landmark by default, as="div" is not', () => {
  /* as default → getByRole('main') named 'Cài đặt'; as="div" inside a caller <main> → exactly one main and no aria-labelledby; as="section" → named region */
});

test('a key with whitespace and a colliding key pair still name their regions', () => {
  /* key 'account settings' → aria-labelledby has no space and resolves; privacy + privacy-description → ids are unique */
});

test('a removed active section reconciles state and notifies a controlled caller', () => {
  /* uncontrolled defaultActiveKey="security", drop security → first pane; restore → still first. controlled: rerender with activeKey="security" and only 'profile' → onSectionChange('profile') */
});

test('the layout is a container query, never a media query', () => {
  /* read the .module.css source like ErrorPage.test.tsx does: contains 'container-type: inline-size', contains '@container (min-width: 768px)', does not contain '@media' */
});
```

For the CSS test, copy the `readFileSync(join(import.meta.dirname, 'SettingsProfile.module.css'), 'utf8')` pattern from `packages/components/src/ErrorPage/ErrorPage.test.tsx` and assert on the raw source.

- [ ] **Step 6: Run the tests**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/SettingsProfile`
Expected: PASS (16 tests).

- [ ] **Step 7: Typecheck and lint the new folder**

Run: `npm run typecheck --workspace=@enterprise-ui/components && npx eslint packages/components/src/SettingsProfile`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add packages/components/src/SettingsProfile packages/components/src/index.ts
git commit -m "feat(settings): add SettingsProfile page template"
```

---

### Task 2: `ProfileForm` — controlled personal-info form

**Files:**

- Create: `packages/components/src/ProfileForm/types.ts`
- Create: `packages/components/src/ProfileForm/ProfileForm.tsx`
- Create: `packages/components/src/ProfileForm/ProfileForm.module.css`
- Create: `packages/components/src/ProfileForm/index.ts`
- Create: `packages/components/src/ProfileForm/ProfileForm.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `Form` + `Field` from `../Form`; `Input` from `../Input`; `Button` from `../Button`; `Spin` if `Button`'s own `loading` is insufficient (check `packages/components/src/Button/Button.tsx` — it accepts `loading` and renders the spinner itself, so no `Spin` import is needed); `isPresent` from `../internal/isPresent`; `cx` from `../internal/cx`.
- Produces:
  - `export interface ProfileFormValues { displayName: string; email: string; phone: string; jobTitle: string; department: string }`
  - `export interface ProfileFormProps` as written in the spec §4, including `avatar?`, `avatarHint?`, `required?`, `onCancel?` and the five `*Label` props.
  - `export function ProfileForm(props: ProfileFormProps): JSX.Element`
  - DOM contract: a `<form>` whose five inputs carry `name` exactly `displayName`/`email`/`phone`/`jobTitle`/`department`; a submit `<button type="submit">`; an optional `<button type="button">` for cancel.

- [ ] **Step 1: Write the failing test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { ProfileForm } from './ProfileForm';
import type { ProfileFormValues } from './types';

const value: ProfileFormValues = {
  displayName: 'Nguyễn Văn A',
  email: 'a@example.com',
  phone: '0901234567',
  jobTitle: 'Kế toán trưởng',
  department: 'Tài chính',
};

test('renders five labelled inputs with the right name, type and autocomplete', () => {
  render(<ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} />);

  const name = screen.getByLabelText('Họ và tên');
  expect(name).toHaveAttribute('name', 'displayName');
  expect(name).toHaveAttribute('autocomplete', 'name');
  expect(name).toHaveValue('Nguyễn Văn A');

  const email = screen.getByLabelText('Email');
  expect(email).toHaveAttribute('type', 'email');
  expect(email).toHaveAttribute('inputmode', 'email');
  expect(email).toHaveAttribute('autocomplete', 'email');

  const phone = screen.getByLabelText('Số điện thoại');
  expect(phone).toHaveAttribute('type', 'tel');
  expect(phone).toHaveAttribute('autocomplete', 'tel');

  expect(screen.getByLabelText('Chức danh')).toHaveAttribute('autocomplete', 'organization-title');
  expect(screen.getByLabelText('Phòng ban')).toHaveAttribute('autocomplete', 'organization');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/ProfileForm`
Expected: FAIL — cannot resolve `./ProfileForm`.

- [ ] **Step 3: Implement `ProfileForm`**

Signature as in the spec §4. Behaviour:

- `const [autoId] = useState(() => ...)` is unnecessary; use `useId()` for nothing — each `Field` and `Input` already generates ids. Do not add ids manually.
- One `setField = (key: keyof ProfileFormValues) => (event: ChangeEvent<HTMLInputElement>) => onChange({ ...value, [key]: event.target.value })`.
- Submit handler: `event.preventDefault()`; if `loading || disabled` return; read the form via `event.currentTarget` and `new FormData(event.currentTarget)`; build `next` from the five `name`s (fall back to `value[key]` if a field is missing); `if (Object.keys(next).some((k) => next[k] !== value[k])) onChange(next)`; then `onSubmit(next)`.
- `required` default `['displayName', 'email']`; membership check `required.includes(key)`.
- Layout: a wrapper `<div {...rest} className={cx(styles.root, className)}>` holding the avatar block (`isPresent(avatar)`), then `<Form errors={errors} aria-busy={loading || undefined} onSubmit={submit} className={styles.form}>` with `<div className={styles.grid}>` of five `<Field label={…} name={key} required={…}>` wrapping `<Input … value={value[key]} onChange={setField(key)} disabled={disabled} />`, then `<div className={styles.footer}>` with `<Button type="submit" variant="primary" loading={loading} disabled={disabled}>{submitLabel}</Button>` and `onCancel && <Button type="button" variant="secondary" onClick={onCancel} disabled={disabled}>{cancelLabel}</Button>`. The avatar sits **outside** the form: a caller's upload control is typically a plain `<button>`, which defaults to `type="submit"` — inside the form, opening the picker would also save. The wrapper is the element in the caller's layout, so `className`, `hidden`, `style`, `id` and `data-*` go there (`ProfileFormProps` extends `HTMLAttributes<HTMLDivElement>`): a placement class on the inner form would not reach the parent's flex/grid, and `hidden` on the form alone leaves the avatar on screen.
- `readFormValues(form, current, keys)` from `../internal/readFormValue` (shared with `LoginForm`): reads `value` for text inputs and `checked` for checkboxes/radios, and keeps the controlled value for a missing control. Share it instead of a second copy of the autofill contract.
- `errors` type is `Partial<Record<keyof ProfileFormValues, string>>`; `Form errors` accepts `Record<string, string>`. Narrow locally before passing: `const formErrors = errors ? Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as Record<string, string> : undefined;` — this keeps the cast on a freshly built object and never casts the caller's prop.

CSS: `.root { display: grid; gap: 16px; min-inline-size: 15rem; font-family: var(--font); color: var(--text) }` — the floor is required because `container-type: inline-size` on the form makes it contribute 0 to a shrink-to-fit parent's intrinsic width (a plain length, not `min(…, 100%)`: a percentage resolves against an indefinite width in exactly that case); `.form { display: grid; gap: 16px; min-width: 0 }`; `.avatar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px }` + `.avatarHint { margin: 0; color: var(--text-muted); font-size: 12px }`; `.grid { display: grid; gap: 12px; grid-template-columns: minmax(0, 1fr) }`; `.footer { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; margin-top: 4px }`. For the two-column grid use a container query on the form itself (`.form { container-type: inline-size }` + `@container (min-width: 640px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)) } }`). If a nested container turns out not to work in the docs frame, fall back to the single-column grid at every width and note it — never a `@media` query.

`index.ts` and `packages/components/src/index.ts` re-exports like Task 1.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/ProfileForm`
Expected: PASS (1 test).

- [ ] **Step 5: Add the remaining behaviour tests**

```tsx
test.each([
  ['Họ và tên', 'displayName', 'Trần Thị B'],
  ['Email', 'email', 'b@example.com'],
  ['Số điện thoại', 'phone', '0912345678'],
  ['Chức danh', 'jobTitle', 'Trưởng phòng'],
  ['Phòng ban', 'department', 'Kinh doanh'],
] as const)('editing %s emits the whole next value', (label, key, typed) => {
  /* onChange spy: expect called with { ...value, [key]: typed } and the other four keys unchanged */
});

test('two edits before a render both land', () => {
  /* render a wrapper component holding state with a functional update; fireEvent.change twice in a row; both inputs show the second value of each field */
});

test('submit prevents default and emits the current values', () => {
  /* onSubmit spy; fireEvent.submit or click submit button; expect event.defaultPrevented and call arg deep-equals value */
});

test('submit reads autofilled DOM values and syncs them back', () => {
  /* set input.value directly (bypassing React) on email; submit; onChange called before onSubmit with the DOM value, both with the same object */
});

test('required defaults mark displayName and email only', () => {
  /* both have aria-required="true"; phone/jobTitle/department do not; asterisks count 2 */
});

test('a custom required list moves the marks', () => {
  /* required={['phone']} → only phone aria-required */
});

test('errors wire aria-invalid and aria-describedby for the matching field only', () => {
  /* errors={{ email: 'Email không hợp lệ' }} → email aria-invalid true + describedby contains the alert id; jobTitle has no aria-invalid; alert has role alert */
});

test('loading sets aria-busy, disables submit and blocks Enter', () => {
  /* loading → form aria-busy true, submit disabled; fireEvent.submit(form) → onSubmit not called */
});

test('disabled disables every control', () => {
  /* inputs, submit and cancel all disabled */
});

test('custom labels and onCancel', () => {
  /* all five labels overridden; submitLabel; cancelLabel; clicking cancel fires onCancel and does not submit */
});

test('no onCancel renders no cancel button', () => {
  /* queryByRole('button', { name: 'Huỷ' }) null */
});

test('avatar and avatarHint render, omitted avatar renders no wrapper', () => {
  /* avatar={<span data-testid="avatar" />} visible + hint text; rerender without avatar → queryByTestId null */
});

test('className merges on the root wrapper', () => {
  /* wrapper has the custom class, the form does not; hidden/class equal */
});
```

- [ ] **Step 6: Run the tests**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/ProfileForm`
Expected: PASS.

- [ ] **Step 7: Mutant check**

Revert each behaviour in turn (keep a `cp` backup of the file, restore with `cp`, never `git checkout <file>`), confirm a named test fails, then restore:

1. drop `onChange(next)` before `onSubmit(next)` → "submit reads autofilled DOM values" fails.
2. `if (loading || disabled) return` removed → "blocks Enter" fails.
3. `required ?? []` default removed → "required defaults" fails.
4. `hidden={!isActive}` (Task 1) → `hidden={false}` → "inactive panes stay mounted but hidden" fails.
5. `sections.some(...)` fallback replaced with the raw candidate → "unknown activeKey falls back" fails.
6. `sections[0]?.key` → `sections[0].key` (Task 1) → "empty sections" throws.
7. `aria-current="true"` → always `'page'` → "moves aria-current" fails.
8. `onChange?.({ ...value, [key]: … })` → `onChange({ [key]: … } as ProfileFormValues)` → the field-edit tests fail.
9. `type="button"` dropped from the cancel button → clicking cancel submits → "custom labels and onCancel" fails.
10. `disabled` dropped from the inputs → "disabled disables every control" fails.
11. `as = 'main'` → hardcoded `div` → "the root is a main landmark by default" fails.
12. pane/description ids from the raw key → `${baseId}-${key}` → the whitespace-key test fails.
13. `-desc-` suffix → `-description` on a key-based pane id → the `privacy`/`privacy-description` test fails.
14. reconcile effect removed → "reconciles state and notifies a controlled caller" fails.
15. `scrollbar-width: thin` → `none` → the overflow-affordance pin fails.
16. avatar moved back inside `<Form>` → the avatar `<button>` submits → "renders outside the form" fails.

Record the count (expected 10/10 caught) for the gate table.

- [ ] **Step 8: Commit**

```bash
git add packages/components/src/ProfileForm packages/components/src/index.ts
git commit -m "feat(settings): add ProfileForm personal-info form"
```

---

### Task 3: Docs page `SettingsPage.tsx`

**Files:**

- Create: `apps/docs/src/pages/templates/SettingsPage.tsx`
- Create: `apps/docs/src/pages/templates/SettingsPage.module.css`
- Modify: `apps/docs/src/App.tsx` (import + route entry `settings`)

**Interfaces:**

- Consumes: `SettingsProfile`, `ProfileForm`, `Checkbox`, `Input`, `Button`, `useToast` from `@enterprise-ui/components`; `CodeBlock`, `DemoPlayground`, `PropsTable` (+ `PropDoc`) from `../../components/*`.
- Produces: `export default function SettingsPage()`; route `settings: { label: 'Settings', icon: 'settings', el: <SettingsPage /> }` placed next to `errorpage` in the `ROUTES` object.

- [ ] **Step 1: Write the page**

Hold `const [profile, setProfile] = useState<ProfileFormValues>({...})`, a second `const [savedProfile, setSavedProfile] = useState(INITIAL_PROFILE)` baseline, `const [active, setActive] = useState('profile')`, and three `Checkbox` booleans in one object. Build the three `sections` with `useMemo`-free plain construction:

- `profile`: `<ProfileForm value={profile} onChange={setProfile} onSubmit={(v) => { setSavedProfile(v); toast.show(…, 'success'); }} onCancel={() => { setProfile(savedProfile); toast.show('Đã huỷ thay đổi (demo).', 'info'); }} avatar={<span className={styles.avatar}>NA</span>} avatarHint="PNG hoặc JPG, tối đa 2 MB." />`. Cancel resets to the **last saved** value, not to the seed data: resetting to `INITIAL_PROFILE` would also undo a save.
- `notifications`: three `Checkbox` rows (`aria`-free, label text in the `Checkbox` children), each wired to its own state key.
- `security`: a password `Input` (`type="password"`, `autoComplete="new-password"`, `minLength={8}` + `required`, labelled through `Field` with `hint`), a `Button type="submit" variant="secondary"` "Đổi mật khẩu", and a `Button variant="danger"` "Vô hiệu hoá tài khoản" that flips an inline two-step confirm (`Xác nhận vô hiệu hoá` + `Huỷ`) — no `Modal`. `Form` renders `noValidate`, so the demo must also guard in `onSubmit`: under 8 characters sets a `Field error` instead of toasting success. A security demo that reports success for an empty password models the wrong thing.

Page shell: `<main className={styles.page}>` with the page's own `<h1>` and a subtitle paragraph. Mount `SettingsProfile` with `title`, `level={2}` **and** `as="div"` — the docs page already renders the `<main>`, so the default `main` would nest one:

```tsx
<SettingsProfile
  as="div"
  title="Cài đặt tài khoản"
  subtitle="Thông tin cá nhân, thông báo và bảo mật."
  level={2}
  sections={sections}
  activeKey={active}
  onSectionChange={setActive}
/>
```

(No `className` here: the implementation adds no `.settings` rule, and passing an
undefined CSS-module key would emit `class="undefined"` through `cx`.)

`code` snippet: one self-contained example importing `SettingsProfile` and `ProfileForm`, with no nested backticks and no `${}` inside the template literal (use `'…'` strings, not template literals, inside the snippet — the extractor truncates at the first `` `; ``).

Docs CSS: `.page` stacking with `gap: 16px`, `.frame` a bordered frame with `min-height: 420px` **and `padding: 16px`** (the template root pads nothing of its own, so without it the heading sits flush against the border and the pane's border doubles up with the frame's), `.avatar` a circular initials chip using tokens.

Props table rows must document for `SettingsProfile`: `as` (default `'main'`, `div` when the page already has a `main`), `title`, `subtitle`, `actions`, `sections` (bắt buộc), `activeKey`, `defaultActiveKey` (seeds the first render only — staged/async sections and URL-driven keys need controlled mode), `onSectionChange`, `navLabel` (active item is `aria-current="true"`, not `"page"`), `level`, `className`; and for `ProfileForm`: all of §4 plus a note that `onSubmit` reads the DOM and calls `onChange` first, and that `className`/`hidden`/`style`/`data-*` go to the root wrapper, not the `<form>`.

- [ ] **Step 2: Run the snippet check and typecheck**

Run: `npm run docs:snippets && npm run typecheck --workspace=@enterprise-ui/docs`
Expected: snippet typechecks (count rises by 1); no TS errors.

- [ ] **Step 3: Run the docs build**

Run: `npm run build --workspace=@enterprise-ui/docs`
Expected: build succeeds.

- [ ] **Step 4: Verify in the browser**

Start the preview (`npm run preview --workspace=@enterprise-ui/docs` or the dev server), open the `Settings` route, and check: rail at desktop width, horizontal nav when the frame is narrow, switching sections keeps the typed name, the password pane's danger confirm needs two clicks, and light/dark both read correctly.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/pages/templates/SettingsPage.tsx apps/docs/src/pages/templates/SettingsPage.module.css apps/docs/src/App.tsx
git commit -m "docs(settings): add Settings/Profile template page"
```

---

### Task 4: Full gate, mutants, PR

- [ ] **Step 1: Full suite**

Run: `npm test`
Expected: tokens ok; all workspace suites pass; new counts are SettingsProfile 11, ProfileForm 15+.

- [ ] **Step 2: Typecheck, snippets, lint, format**

Run: `npm --workspaces run typecheck --if-present && npm run docs:snippets && npm run lint && npm run format:check`
Expected: all clean.

- [ ] **Step 3: Three builds**

Run: `npm run build --workspace=@enterprise-ui/components && npm run build --workspace=@enterprise-ui/showcase && npm run build --workspace=@enterprise-ui/docs`
Expected: all succeed; the components bundle stays under the 150 KiB gzip limit.

- [ ] **Step 4: Mutants**

Run the 10 cases from Task 2 Step 7 plus these Task 1 CSS cases:

11. `.pane[hidden] { display: none }` removed → add the pin first: a CSS test asserting the rule exists, then confirm the mutant is caught.
12. `container-type: inline-size` removed → the container-query test fails.
13. `@container (min-width: 768px)` → `@media (min-width: 768px)` → the CSS source test fails.

Expected: 13/13 caught.

- [ ] **Step 5: Commit, push, PR**

```bash
git push -u origin feat/settings-profile
gh pr create --title "feat(templates): add Settings/Profile" --body "..."
```

PR body: spec + plan links, the two components' API, the docs route, the gate table (test counts, typecheck, snippets, lint, format, builds, mutants), and the review focus list from this plan.

## Self-Review

**Spec coverage:** §4.2 nav/panes/hidden/fallbacks → Task 1 Steps 3, 5; §4.3 form behaviour incl. `onChange`-before-`onSubmit` → Task 2 Steps 3, 5; §5 a11y (nav landmark, `aria-current`, named regions, labels) → Tasks 1–2 tests; §6 test lists → both test blocks; §7 done criteria → Task 4.

**Gaps found and closed:** the spec's `[hidden]` display rule had no pin — added as CSS mutant 11. The docs `level={2}` decision (page `h1` stays unique) was ambiguous — fixed in Task 3 Step 1.

**Reviewed and corrected (PR #34):** §4.1's premise was wrong — `AppShell` renders `<div>`s, not `<main>` — so `SettingsProfile` gained `as` (default `main`) and `aria-current` moved from `"page"` (the sidebar's) to `"true"`. Pane/description ids are index-based (whitespace keys and the `privacy`/`privacy-description` collision). The stale-key fallback now reconciles state and notifies a controlled caller. The narrow nav keeps a thin scrollbar and centres the active item; the active cue is an underline in the row and a left bar in the rail; long labels wrap. `ProfileForm`'s avatar slot moved outside the `<form>` and the root gained a `min-inline-size` floor; the DOM read is shared with `LoginForm` in `internal/readFormValue.ts`.

**Second review round (PR #34):** the nav centring now reads `getBoundingClientRect()` instead of `offsetLeft` — the latter is relative to the `<body>`, so in a padded frame the active tab was over-scrolled (measured `scrollLeft` 134 vs 96, button at -1px), and the old test's mocked `offsetLeft` hid it. `ProfileFormProps` now passes caller attributes to the **root wrapper** (`HTMLAttributes<HTMLDivElement>`), so placement classes reach the caller's layout and `hidden` hides the avatar slot too. `defaultActiveKey`'s docs/types/spec state that it seeds the first render only, and staged/URL-driven sections belong in controlled mode. The docs change-password form carries a hidden `username` field for password managers.

**Type consistency:** `SettingsSection`/`SettingsProfileProps`/`ProfileFormValues`/`ProfileFormProps` names and the five value keys are identical across Task 1, Task 2 and the docs page.
