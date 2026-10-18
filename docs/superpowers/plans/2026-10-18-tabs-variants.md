# Tabs Variants (segmented / pills / enclosed) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new visual variants to `Tabs` — `segmented`, `pills`, `enclosed` — keeping `line` as the default, and document them in the docs site and showcase.

**Architecture:** One new `variant` prop on `TabsProps`; the root element carries `data-variant` as the single CSS hook. All variant styling lives in `Tabs.module.css` as attribute-scoped rules reusing existing design tokens. No DOM, keyboard, or a11y changes.

**Tech Stack:** React 18 + TypeScript strict, CSS Modules, design tokens, Vitest + Testing Library (jsdom, globals on), Playwright for browser verification.

**Spec:** `docs/superpowers/specs/2026-10-18-tabs-variants-design.md`

## Global Constraints

- Presentational-only; CSS Modules + `var(--…)` tokens only; **no hardcoded hex**; zero runtime deps.
- `TabsVariant` is public API — export from `packages/components/src/index.ts` (consumers must not deep-import).
- `variant` default `'line'`; existing DOM structure, roles, ids, keyboard behavior unchanged.
- All variants stay on the input height scale (`--input-h` / `--input-h-lg` totals).
- Docs copy in Vietnamese; repo runs prettier (single quotes, trailing commas) — format before committing.
- Commands: tests `npm run test --workspace=@enterprise-ui/components -- --run src/Tabs`; full gate `npm test && npm --workspaces run typecheck --if-present && npm run lint && npm run format:check`.

## Review Focus

Inputs/conditions the spec implies that task tests can't exercise in jsdom (each pinned to a browser-verification step in Task 5):

1. The `enclosed` active-tab merge — the bar's grey 1px line must NOT remain visible under the active tab (active `border-bottom-color` must resolve to the surface colour at the exact overlap).
2. Narrow container / many tabs — rows must not wrap or squish; all variants stay single-row (overflow allowed, unchanged from `line`).
3. `size="sm"` on all variants — inner/total heights stay on scale (32px totals; segmented inner 26px) so toolbars align with Input/Button.
4. Dark theme — selected vs inactive states remain readable for all three variants (segmented chip reads deeper; accepted per spec §10).
5. Hover combos — pills active-hover stays filled (`--color-blue-700`), inactive hovers tint; enclosed/segmented hovers change text colour only.

---

### Task 1: `variant` prop + `data-variant` hook

**Files:**

- Modify: `packages/components/src/Tabs/types.ts`
- Modify: `packages/components/src/Tabs/Tabs.tsx`
- Modify: `packages/components/src/Tabs/Tabs.test.tsx`
- Modify: `packages/components/src/Tabs/index.ts`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Produces: `export type TabsVariant = 'line' | 'segmented' | 'pills' | 'enclosed';` and `TabsProps.variant?: TabsVariant` (default `'line'`); root `<div>` renders `data-variant={variant}`.

- [ ] **Step 1: Write the failing tests** (append to `Tabs.test.tsx`)

```tsx
test('root carries data-variant, defaulting to line', () => {
  const { container } = render(
    <Tabs
      items={[
        { key: 'a', label: 'Tab A', content: <div>Content A</div> },
        { key: 'b', label: 'Tab B', content: <div>Content B</div> },
      ]}
    />,
  );
  expect(container.querySelector('[data-variant]')).toHaveAttribute('data-variant', 'line');
});

test.each(['segmented', 'pills', 'enclosed'] as const)(
  'variant %s renders data-variant and still switches content',
  (variant) => {
    const { container } = render(
      <Tabs
        variant={variant}
        items={[
          { key: 'a', label: 'Tab A', content: <div>Content A</div> },
          { key: 'b', label: 'Tab B', content: <div>Content B</div> },
        ]}
      />,
    );
    expect(container.querySelector('[data-variant]')).toHaveAttribute('data-variant', variant);
    fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByText('Content B')).toBeVisible();
    expect(screen.getByText('Content A')).not.toBeVisible();
  },
);
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Tabs`
Expected: FAIL — `[data-variant]` selector finds nothing (attribute not rendered yet).

- [ ] **Step 3: Implement the API**

`types.ts` — add above `TabsProps` and inside it:

```ts
export type TabsVariant = 'line' | 'segmented' | 'pills' | 'enclosed';
// ... inside TabsProps:
//   variant?: TabsVariant;  (doc comment in English: "Tab list presentation style; defaults to 'line'.")
```

`Tabs.tsx` — destructure `variant = 'line'` and set the root attribute:

```tsx
<div className={`${styles.tabs} ${className}`} data-variant={variant}>
```

Export the type: `Tabs/index.ts` → `export type { TabsProps, TabItem, TabsVariant } from './types';`
and `src/index.ts` → `export type { TabsProps, TabItem, TabsVariant } from './Tabs/types';`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Tabs`
Expected: PASS — 10 tests (6 existing + 4 new).

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Tabs/types.ts packages/components/src/Tabs/Tabs.tsx \
  packages/components/src/Tabs/Tabs.test.tsx packages/components/src/Tabs/index.ts \
  packages/components/src/index.ts
git commit -m "feat(tabs): add variant prop and data-variant hook"
```

---

### Task 2: Variant styles (segmented / pills / enclosed)

**Files:**

- Modify: `packages/components/src/Tabs/Tabs.module.css`

**Interfaces:**

- Consumes: `data-variant` attribute from Task 1.
- Produces: attribute-scoped CSS rules (values pinned by spec §6.2–§6.4).

- [ ] **Step 1: Append the variant styles**

```css
/* --- Variants: `line` keeps the base styles above; each rule below is
   scoped to the data-variant hook on the root. --- */

.tabs[data-variant='segmented'] .tabList {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--surface-muted);
  border-radius: 999px;
  border-bottom: none;
}
.tabs[data-variant='segmented'] .tab {
  border-radius: 999px;
  padding: 0 14px;
}
.tabs[data-variant='segmented'] .tab[data-size='sm'] {
  height: calc(var(--input-h) - 6px);
  padding: 0 12px;
}
.tabs[data-variant='segmented'] .tab[data-size='md'] {
  height: calc(var(--input-h-lg) - 6px);
}
.tabs[data-variant='segmented'] .tab[aria-selected='true'] {
  background: var(--surface);
  box-shadow: var(--shadow-sm);
}

.tabs[data-variant='pills'] .tabList {
  display: inline-flex;
  gap: 6px;
  border-bottom: none;
}
.tabs[data-variant='pills'] .tab {
  border-radius: 999px;
  padding: 0 14px;
}
.tabs[data-variant='pills'] .tab[data-size='sm'] {
  padding: 0 12px;
}
.tabs[data-variant='pills'] .tab:hover {
  background: var(--surface-muted);
}
.tabs[data-variant='pills'] .tab[aria-selected='true'] {
  background: var(--color-blue-600);
  color: var(--on-primary);
}
.tabs[data-variant='pills'] .tab[aria-selected='true']:hover {
  background: var(--color-blue-700);
}

.tabs[data-variant='enclosed'] .tabList {
  gap: 4px;
}
.tabs[data-variant='enclosed'] .tab {
  box-sizing: border-box;
  margin-bottom: -1px;
  border: 1px solid var(--border);
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
  background: var(--bg);
  padding: 0 16px;
}
.tabs[data-variant='enclosed'] .tab[data-size='sm'] {
  padding: 0 12px;
}
.tabs[data-variant='enclosed'] .tab[aria-selected='true'] {
  background: var(--surface);
  border-bottom-color: var(--surface);
}

.tabs[data-variant='segmented'] .tab:focus-visible,
.tabs[data-variant='pills'] .tab:focus-visible {
  border-radius: 999px;
}
.tabs[data-variant='enclosed'] .tab:focus-visible {
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
}
```

Rationale locked by spec (do not “simplify”): the −1px bottom margin sits on **every** enclosed tab (active-only does not paint over the bar border); segmented inner heights are `H − 6px` so the padded track totals the input scale; pills hover-on-active stays filled.

- [ ] **Step 2: Build and check the rules ship**

Run: `npm run build --workspace=@enterprise-ui/components && grep -c "data-variant" dist/style.css`
Expected: build succeeds; grep count > 0 (attribute selectors survive CSS Modules hashing).

- [ ] **Step 3: Run the unit suite**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Tabs`
Expected: PASS (CSS is not exercised in jsdom — behaviour unchanged).

- [ ] **Step 4: Commit**

```bash
git add packages/components/src/Tabs/Tabs.module.css
git commit -m "feat(tabs): add segmented, pills and enclosed styles"
```

---

### Task 3: Docs page — prop, demo, snippet

**Files:**

- Modify: `apps/docs/src/pages/primitives/TabsPage.tsx`

**Interfaces:**

- Consumes: `variant` prop (Task 1) and the visuals (Task 2).

- [ ] **Step 1: Add the prop row** (after the `size` row in `props`)

```tsx
{
  name: 'variant',
  type: "'line' | 'segmented' | 'pills' | 'enclosed'",
  default: "'line'",
  description:
    'Kiểu hiển thị thanh tab: gạch chân (line), segmented, viên (pills) hoặc dạng card gắn liền nội dung (enclosed).',
},
```

- [ ] **Step 2: Add shared items + a "Biến thể" section**

Add near the other item constants:

```tsx
const variantItems: TabItem[] = [
  {
    key: 'v-overview',
    label: 'Tổng quan',
    content: <p className={styles.panelText}>Nội dung tab.</p>,
  },
  {
    key: 'v-details',
    label: 'Chi tiết',
    content: <p className={styles.panelText}>Nội dung tab.</p>,
  },
  {
    key: 'v-history',
    label: 'Lịch sử',
    content: <p className={styles.panelText}>Nội dung tab.</p>,
  },
];
```

Insert after the "Cơ bản" section:

```tsx
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Biến thể</h2>
  <div className={styles.block}>
    <Tabs items={variantItems} variant="segmented" />
    <span className={styles.helper}>segmented — chuyển view nhanh</span>
  </div>
  <div className={styles.block}>
    <Tabs items={variantItems} variant="pills" />
    <span className={styles.helper}>pills — điều hướng dạng viên</span>
  </div>
  <div className={styles.block}>
    <Tabs items={variantItems} variant="enclosed" />
    <span className={styles.helper}>enclosed — tab gắn liền nội dung</span>
  </div>
</section>
```

- [ ] **Step 3: Update subtitle + snippet**

Subtitle → `Thanh tab điều hướng nội dung với bốn kiểu hiển thị, hai kích thước, hỗ trợ chế độ điều khiển và thao tác bàn phím.`
Snippet: the example `return` line becomes
`return <Tabs items={items} variant="pills" activeKey={active} onChange={setActive} />;`

- [ ] **Step 4: Build the docs app**

Run: `npm run build --workspace=@enterprise-ui/docs`
Expected: build succeeds (typecheck included via vite build).

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/pages/primitives/TabsPage.tsx
git commit -m "docs(tabs): document and demo the new variants"
```

---

### Task 4: Showcase demo sections

**Files:**

- Modify: `apps/showcase/src/pages/TabsDemoPage.tsx`

**Interfaces:**

- Consumes: `variant` prop (Task 1).

- [ ] **Step 1: Add three sections** (after the "Kích thước nhỏ (sm)" section, reusing `basicItems`)

```tsx
<section className={styles.section}>
  <h3 className={styles.sectionTitle}>Segmented</h3>
  <Tabs items={basicItems} variant="segmented" />
</section>

<section className={styles.section}>
  <h3 className={styles.sectionTitle}>Pills</h3>
  <Tabs items={basicItems} variant="pills" />
</section>

<section className={styles.section}>
  <h3 className={styles.sectionTitle}>Enclosed</h3>
  <Tabs items={basicItems} variant="enclosed" />
</section>
```

- [ ] **Step 2: Build the showcase**

Run: `npm run build --workspace=@enterprise-ui/showcase`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add apps/showcase/src/pages/TabsDemoPage.tsx
git commit -m "docs(showcase): demo Tabs variants"
```

---

### Task 5: Browser verification (light + dark, sm + md) + full gate

**Files:**

- No new files; fixes only if verification finds defects.

**Interfaces:**

- Consumes: everything above, served through the docs build.

- [ ] **Step 1: Build + serve the docs app**

Run: `npm run build --workspace=@enterprise-ui/components && npm run build --workspace=@enterprise-ui/docs` then `npx vite preview --port 4176 --strictPort` in `apps/docs` (background).

- [ ] **Step 2: Verify light theme (`data-theme` light), Tabs page**

Playwright, at 1440px on `http://localhost:4176/enterprise-ui/` → Tabs page. For each variant measure computed styles and fill in:

| Check                           | Expected                                                                                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| md total heights (all variants) | 40px (line/segmented track/pills/enclosed row)                                                                                                        |
| segmented track                 | `background` = `--surface-muted` (#f1f5f9), radius 999px, padding 3px; active segment `background` = #ffffff, `box-shadow` set                        |
| pills active                    | `background` = rgb(30,71,196) (`--color-blue-600`), colour = #ffffff                                                                                  |
| enclosed active                 | `border-bottom-color` equals its `background` (#ffffff) so the bar line is covered (zoom/screenshot the boundary — no grey line under the active tab) |
| sm pass                         | repeat quickly: totals 32px; segmented inner 26px                                                                                                     |

- [ ] **Step 3: Verify hover + dark theme**

Hover: pills inactive → `background` = #f1f5f9; pills active → #1e40af (`--color-blue-700`); segmented/enclosed hover change colour only.
Dark: set the provider's dark mode (docs header toggle or its localStorage key — read `ThemeProvider` to find it), then re-check segmented selected chip vs track, pills contrast, enclosed bar/merge at the same points.

- [ ] **Step 4: Narrow-width sanity (Review Focus #2)**

At 375px: the Biến thể demo rows do not wrap or squish (single row, overflow unchanged from `line`).

- [ ] **Step 5: Fix anything found** (only then commit: `fix(tabs): <what>`), then run the full gate

Run: `npm test && npm --workspaces run typecheck --if-present && npm run lint && npm run format:check && npm run build --workspace=@enterprise-ui/components && npm run build --workspace=@enterprise-ui/docs && npm run build --workspace=@enterprise-ui/showcase`
Expected: all pass (test count: 303 + 4 new = 307).

- [ ] **Step 6: Push + PR**

```bash
git push -u origin feat/tabs-variants
gh pr create --title "feat(tabs): segmented / pills / enclosed variants" --body-file <PR body: summary, spec link, screenshots/measurements from Steps 2–4>
```

Do **not** merge; the user reviews the PR.
