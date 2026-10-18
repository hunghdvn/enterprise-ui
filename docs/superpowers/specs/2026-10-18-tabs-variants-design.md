# Tabs Variants (segmented / pills / enclosed) — Design Spec

Date: 2026-10-18
Status: Draft
Repo: enterprise-ui

## 1. Intent & Why

Tabs shipped with a single visual style — the underline "line" variant. Preview feedback
asked for pills/enclosed styles so the component can cover more admin-UI contexts
(Ant Design/Tabler look): segmented-style controls for quick view switching, pill
buttons for filter-ish navigation, and enclosed card tabs for grouped content.

A mockup review on 2026-10-18 selected three new looks (the fourth option, a bordered
"box" variant, was not selected):

- A **"Segmented track"** — gray track, active segment is a white pill with a subtle
  shadow (iOS-style segmented control).
- B **"Solid pills"** — no track; the active tab is a solid blue-600 pill with white
  text, other tabs plain.
- C **"Enclosed (Ant card)"** — bordered "folder" tabs; the active tab merges with the
  content area below.

`line` remains the default so existing consumers are unaffected.

## 2. Goals

- Add `variant?: 'line' | 'segmented' | 'pills' | 'enclosed'` (default `'line'`).
- Implement the three new looks as mocked, via per-variant CSS keyed off a
  `data-variant` attribute on the root.
- All variants keep: sizes `sm`/`md` on the existing `--input-h` scale,
  controlled/uncontrolled behavior, arrow-key navigation, roving tabindex, namespaced
  a11y ids, persistent panels, and the same outer control height.
- Docs page: `variant` prop row + a "Biến thể" demo section showing all four variants +
  updated code snippet. Showcase: variant sections added.
- Dark theme works via tokens; `:focus-visible` ring preserved per variant.

## 3. Non-Goals

- No vertical tabs, closable/editable tabs, overflow scroll arrows, or icons in labels.
- No change to `items` / `activeKey` / `defaultActiveKey` / `onChange` / `size` APIs.
- No enter/exit animations; only color/background transitions on hover.
- No separate `Segmented` component (a distinct control with its own keyboard model can
  come later; this is a Tabs presentation variant).
- No new theming tokens (reuse existing ones).

## 4. Constraints

- Presentational-only; CSS Modules + `var(--…)` tokens only; zero runtime deps.
- CSS hook assertable in jsdom: root `div` gets `data-variant="<variant>"`.
- No hardcoded hex. Available tokens: `--surface-muted`, `--surface`, `--bg`,
  `--border`, `--text`, `--text-muted`, `--action-text`, `--color-blue-600`,
  `--color-blue-700`, `--on-primary`, `--radius`, `--radius-lg`, `--shadow-sm`.
- Inactive labels keep `--text-muted` (as `line` does today) so contrast behaves the
  same across themes; the only change is the segmented track behind them.
- Bordered variants must stay on the input height scale: `enclosed` tabs set
  `box-sizing: border-box` (the pattern `Input.module.css` uses) so the 1px borders do
  not grow the control beyond `var(--input-h)` / `var(--input-h-lg)`.

## 5. API

```ts
export type TabsVariant = 'line' | 'segmented' | 'pills' | 'enclosed';

export interface TabsProps {
  // ...existing...
  variant?: TabsVariant; // default 'line'
}
```

- Root element: `<div className={styles.tabs} data-variant={variant}>` — one attribute,
  no DOM restructuring.
- `TabsVariant` is a public type: export it from `packages/components/src/index.ts`
  (consumers must not deep-import).

## 6. Visual specification

Shared: the selected label keeps `font-weight: 600`; tabs keep their `data-size`
heights (`sm` → `var(--input-h)`, `md` → `var(--input-h-lg)`) and font sizes; the 2px
selection underline stays exclusive to `line`.

### 6.1 `line` (unchanged, default)

Existing styles untouched: flex row, `gap: 16px`,
`border-bottom: 1px solid var(--border)`, 2px blue underline on the active tab.

### 6.2 `segmented`

- `.tabList`: `display: inline-flex` (the track hugs its content), `gap: 2px`,
  `padding: 3px`, `background: var(--surface-muted)`, `border-radius: 999px`, and no
  bottom border.
- `.tab`: `border-radius: 999px`, padding `0 14px` (sm: `0 12px`), heights
  `calc(var(--input-h) - 6px)` / `calc(var(--input-h-lg) - 6px)` — the 3px track
  padding ×2 plus the inner height totals exactly the input scale, so the control
  lines up with Input/Button/Select (the mockup drew the track taller than a flat row;
  the component standardises on the input scale). In dark theme the active segment
  reads deeper instead of raised — accepted, see §10.
- Active: `background: var(--surface)`, `color: var(--text)`,
  `box-shadow: var(--shadow-sm)` — the white pill "pops" out of the track.
- Inactive hover: text color → `var(--action-text)`; no background change.
- `:focus-visible`: keep the 2px blue outline; override radius to `999px` so the ring
  follows the pill shape.

### 6.3 `pills`

- `.tabList`: `display: inline-flex`, `gap: 6px`, no track, no bottom border.
- `.tab`: `border-radius: 999px`, padding `0 14px` (sm: `0 12px`).
- Active: `background: var(--color-blue-600)`, `color: var(--on-primary)`.
- Inactive hover: `color: var(--action-text)` + `background: var(--surface-muted)`
  (theme-safe tint; `--color-blue-50` would flash light in dark theme).
- Active hover stays filled: `background: var(--color-blue-700)` (pressed feel).
- `:focus-visible`: radius `999px`.

### 6.4 `enclosed`

- `.tabList`: `display: flex`, `gap: 4px` (the line variant's 16px gap reads wrong for
  boxes), `border-bottom: 1px solid var(--border)`.
- `.tab`: `border: 1px solid var(--border)`, `box-sizing: border-box`, top radius
  `var(--radius-lg)` on both corners, `background: var(--bg)`, padding `0 16px`
  (sm: `0 12px`), full height `var(--input-h)` / `var(--input-h-lg)`, and
  `margin-bottom: -1px`.
- Every tab (active or not) carries the −1px bottom margin: the flex row then totals
  exactly the input scale (`H − 1` content + the 1px `tabList` border) and each tab's
  own bottom border paints over the bar's border. Active adds
  `border-bottom-color: var(--surface)` so its overlap section shows the surface colour
  and merges with the content below (folder silhouette). Applying the −1px margin only
  to the active tab does **not** work: with definite heights the border box stays flush
  with the content edge and the bar's grey line remains visible underneath (verified in
  a browser).
- Inactive hover: `color: var(--action-text)`; background stays `var(--bg)`.
- `:focus-visible`: radius `var(--radius-lg) var(--radius-lg) 0 0` so the ring follows
  the tab's top corners.
- Content below keeps the existing `.tabPanel` (16px top padding); no side borders
  (matches the mockup and Ant's card tabs). The merge assumes the component sits on a
  `--surface` area — same assumption Ant's card tabs make; docs demos place it
  accordingly.

## 7. Tests

- Default render has `data-variant="line"` on the root (backward-compat contract).
- Each of `segmented` / `pills` / `enclosed` renders `data-variant="<name>"` and still
  switches content on click (one table-driven test across the variants).
- Existing 6 tests stay untouched and keep passing (DOM structure/roles unchanged).
- CSS visuals are verified in a real browser against the docs build (light + dark,
  sm + md) during implementation — jsdom does not apply CSS Modules.

## 8. Docs & Showcase

- `apps/docs/src/pages/primitives/TabsPage.tsx`:
  - Add a `variant` row to the props table.
  - Add a "Biến thể" demo section showing all four variants at `md` with short
    Vietnamese captions (segmented "chuyển view nhanh", pills "điều hướng dạng viên",
    enclosed "tab gắn liền nội dung").
  - Update the page subtitle to mention the four display styles.
  - Update the code snippet to include `variant="pills"` on the example.
- `apps/showcase/src/pages/TabsDemoPage.tsx`: add sections for `segmented`, `pills`,
  `enclosed`.
- Keep demos ↔ snippet in sync per the docs convention (sub-project 8 concern).

## 9. Implementation order

1. `types.ts` — `TabsVariant` + `variant` prop.
2. `Tabs.tsx` — `data-variant` on the root.
3. `Tabs.module.css` — variant styles + focus-visible overrides.
4. `Tabs.test.tsx` — data-variant contract + per-variant smoke.
5. Docs page + index.ts export + showcase updates.
6. `npm test`, typecheck, lint, format, builds; browser check of all four variants in
   light + dark, sm + md (Playwright on the docs build).

## 10. Calls made by the designer (builder may tune)

- Variant names: `segmented` (mockup A), `pills` (mockup B), `enclosed` (mockup C).
- `line` remains the default.
- Track/segment radius is fully rounded (999px) because the selected mockups showed
  that shape; if Ant-style 8/6px radii are preferred later, it is a two-line CSS change.
- Pill hover tints use `--surface-muted` instead of `--color-blue-50` so dark theme
  stays coherent.
- `enclosed` tab gap is 4px instead of `line`'s 16px.
- `enclosed` tabs all carry the −1px overlap, not just the active one (verified in a
  browser that the literal active-only CSS did not produce the merge).
- `segmented` keeps the whole control on the input scale: inner tabs are `H − 6px`
  inside a 3px-padded track, so toolbar rows stay aligned with Input/Button/Select.
- In dark theme the `segmented` active segment renders as a deeper chip
  (`--surface` is darker than `--surface-muted` there), i.e. elevation inverts — same
  behaviour as shadcn/Ant dark segmented; accepted, selection stays unambiguous via
  contrast + weight.
- Mobile/overflow behavior is unchanged — tabs remain a single, non-scrolling row.
