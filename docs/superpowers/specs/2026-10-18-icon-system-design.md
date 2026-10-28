# Icon System — Design Spec

Date: 2026-10-18
Status: Draft
Repo: enterprise-ui

## 1. Intent & Why

The library has no icon system — `Empty` hand-draws a box SVG, `Toast` uses the text glyph "✕", `Modal` uses "✕". Consumers have no consistent, accessible icon set. This spec adds a zero-dependency `Icon` component backed by a curated inline-SVG registry, and migrates the 3 components that currently improvise icons.

## 2. Goals

- `Icon` component: `<Icon name="check" size={16} />` renders an inline SVG from a curated ERP registry (1,263 icons).
- Zero runtime deps (inline SVG only, no icon library).
- Accessible by default: `aria-hidden="true"`; optional `label` → `role="img"` + `<title>`.
- Color via `currentColor` (inherits from parent).
- Refactor `Empty` (default icon → `Icon name="inbox"`), `Toast` (close → `Icon name="x"`), `Modal` (close → `Icon name="x"`) to use the new system.
- Docs page (`IconPage`) + showcase demo (`IconDemoPage`).

## 3. Non-Goals

- No icon font, no sprite sheet, no external icon library dependency.
- No `icon` prop on `Button` (follow-up; keep scope tight).
- No animated icons.
- No full icon picker. The docs grid has a name filter and incremental rendering so a large catalog stays usable.

## 4. Constraints

- Monorepo conventions: folder layout `Icon/Icon.tsx + Icon.module.css + types.ts + index.ts + Icon.test.tsx`, re-exported from `src/index.ts`.
- CSS Modules only, `var(--…)` tokens, no hardcoded hex.
- TS strict, no `any`, Vitest globals on.
- Icon SVGs: 24×24 viewBox, stroke-based (2px, round caps/joins) for visual consistency with `Empty`'s existing box icon.
- Bundle target: components <150 KiB gzip (JS + CSS). The ERP registry is the dominant cost (~97 KiB gzip including CSS at 1,263 icons); `check-bundle-size.mjs` scans `dist/*.js` and `dist/*.css` and enforces the budget.

## 5. API

```ts
export type IconName = 'check' | 'x' | 'chevron-down' | ...; // generated union (1,263 names)

export interface IconProps {
  name: IconName;
  size?: number;          // default 16
  label?: string;         // when set: role="img" + <title>, not aria-hidden
  className?: string;
}
```

- `size` is pixels; renders `width={size} height={size}`.
- Color always `currentColor`.
- `label` makes it accessible (`role="img"`, `aria-label`, `<title>`); otherwise `aria-hidden="true"`.

## 6. Icon Set (1,263 icons)

Start from the original 30-35 UI/status icons and extend with an ERP-focused
catalog: finance/accounting, orders, inventory and logistics, charts/KPIs,
documents, HR, communication, security, infrastructure/IT, navigation, time and
text formatting. Most off-domain categories are excluded (food, animals, gaming,
music, nature, sports, emoji, weather, medical, science, furniture, brand/logo
icons). A few general-purpose glyphs stay because they serve ERP UI: `heart` and
`star` (favourites/ratings), `sun`/`moon` (theme), `tv` (display/monitoring),
`shirt` (apparel inventory), `brain` (AI).

Naming policy: icon names must not end in a numeric suffix. This intentionally
omits current Lucide variants that use digits (`columns-3/4`, `rows-3/4`,
`clock-3`, `trash-2`, `edit-2/3`, `building-2`, `share-2`, `volume-1/2`,
`undo-2`, `redo-2`, …). Non-numbered current names are registered
(`chart-column`, `chart-no-axes-column-increasing`); add semantic names if a
variant is needed later. Legacy names kept for compatibility (`home`, `filter`,
`line-chart`, …) share the current Lucide geometry with their current-name
alias.

All 1,263 glyphs are verified against `lucide-static@0.545.0`; `refresh` reuses
`refresh-cw` and is the only documented non-Lucide name. `icons.manifest.json`
pins every name → geometry hash, and `icons.removed.json` pins the removed-name
allowlist so those icons cannot be re-added accidentally.

## 7. File Structure

```
packages/components/src/Icon/
  Icon.tsx          // component
  Icon.module.css   // .icon (display: inline-block, vertical-align)
  types.ts          // IconProps, generated IconName union
  icons.tsx         // ICONS registry: Record<IconName, ReactNode>
  icons.manifest.json // checked-in name -> geometry hash allowlist
  icons.removed.json  // names removed from the catalog; tests forbid re-adding
  index.ts          // re-exports
  Icon.test.tsx     // tests

packages/components/scripts/
  gen-icon-types.mjs        // regenerate IconName from icons.tsx
  gen-icon-manifest.mjs     // regenerate/check the geometry manifest
  check-icon-provenance.mjs // verify every glyph against Lucide 0.545.0
  check-bundle-size.mjs     // enforce the 150 KiB gzip budget (JS + CSS)
```

## 8. Refactors

- `Empty.tsx`: default icon → `<Icon name="inbox" size={48} />` (replaces hand-drawn box SVG)
- `Toast.tsx`: close button "✕" → `<Icon name="x" size={14} />`
- `Modal.tsx`: close button "✕" → `<Icon name="x" size={16} />`

## 9. Implementation Order

1. `types.ts` + `icons.tsx` (registry)
2. `Icon.tsx` + `Icon.module.css` + `index.ts`
3. `Icon.test.tsx` (TDD: render by name, size, aria-hidden, label→role=img+title, className, unknown name type error)
4. Export from `src/index.ts`
5. Refactor Empty/Toast/Modal
6. Update their tests if needed (Toast test checks close button? Modal test?)
7. Docs page `IconPage` + showcase `IconDemoPage` (name filter, 240 icons initially, “Hiện thêm” pagination)
8. Build + verify

## 10. Definition of Done

1. `Icon` component passes tests (render by name, size, accessibility, className).
2. Every catalog icon renders without errors and matches the checked-in geometry manifest.
3. Empty/Toast/Modal refactored and their tests still pass.
4. IconPage in docs shows a searchable icon grid with names and incremental rendering.
5. Showcase IconDemoPage.
6. Zero runtime deps maintained; bundle <150 KiB gzip (JS + CSS).
7. Typecheck, lint, format, builds all pass.
   EOF
