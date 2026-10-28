# Icon System — Design Spec

Date: 2026-10-18
Status: Draft
Repo: enterprise-ui

## 1. Intent & Why

The library has no icon system — `Empty` hand-draws a box SVG, `Toast` uses the text glyph "✕", `Modal` uses "✕". Consumers have no consistent, accessible icon set. This spec adds a zero-dependency `Icon` component backed by a curated inline-SVG registry, and migrates the 3 components that currently improvise icons.

## 2. Goals

- `Icon` component: `<Icon name="check" size={16} />` renders an inline SVG from a curated ERP registry (1,200+ icons).
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
- Bundle target: components <150KB gzip. The ERP registry is the dominant cost (~90KB gzip at 1,200+ icons); a build-time size check enforces the budget.

## 5. API

```ts
export type IconName = 'check' | 'x' | 'chevron-down' | ...; // ~30-35

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

## 6. Icon Set (1,200+ icons)

Start from the original 30-35 UI/status icons and extend with an ERP-focused
catalog: finance/accounting, orders, inventory and logistics, charts/KPIs,
documents, HR, communication, security, infrastructure/IT, navigation, time and
text formatting. Off-domain icons (food, animals, gaming, music, nature, sports,
emoji, weather, medical, science, home/lifestyle, brands) are excluded.

The complete list and glyphs are pinned by `src/Icon/icons.manifest.json` and
verified against `lucide-static@0.545.0` by `scripts/check-icon-provenance.mjs`.
Deprecated numbered names are not registered; current-name aliases share the
canonical glyph of their concept.

## 7. File Structure

```
packages/components/src/Icon/
  Icon.tsx          // component
  Icon.module.css   // .icon (display: inline-block, vertical-align)
  types.ts          // IconProps, generated IconName union
  icons.tsx         // ICONS registry: Record<IconName, ReactNode>
  icons.manifest.json // checked-in name -> geometry hash allowlist
  index.ts          // re-exports
  Icon.test.tsx     // tests

packages/components/scripts/
  gen-icon-types.mjs        // regenerate IconName from icons.tsx
  gen-icon-manifest.ts      // regenerate the geometry manifest
  check-icon-provenance.mjs // verify Lucide-derived glyphs against 0.545.0
  check-bundle-size.mjs     // enforce the 150KB gzip budget
```

## 8. Refactors

- `Empty.tsx`: default icon → `<Icon name="inbox" size={48} />` (replaces hand-drawn box SVG)
- `Toast.tsx`: close button "✕" → `<Icon name="x" size={14} />`
- `Modal.tsx`: close button "✕" → `<Icon name="x" size={16} />`

## 9. Implementation Order

1. `types.ts` + `icons.ts` (registry)
2. `Icon.tsx` + `Icon.module.css` + `index.ts`
3. `Icon.test.tsx` (TDD: render by name, size, aria-hidden, label→role=img+title, className, unknown name type error)
4. Export from `src/index.ts`
5. Refactor Empty/Toast/Modal
6. Update their tests if needed (Toast test checks close button? Modal test?)
7. Docs page `IconPage` + showcase `IconDemoPage` (grid of all icons)
8. Build + verify

## 10. Definition of Done

1. `Icon` component passes tests (render by name, size, accessibility, className).
2. Every catalog icon renders without errors and matches the checked-in geometry manifest.
3. Empty/Toast/Modal refactored and their tests still pass.
4. IconPage in docs shows grid of all icons with names.
5. Showcase IconDemoPage.
6. Zero runtime deps maintained; bundle <150KB gzip.
7. Typecheck, lint, format, builds all pass.
   EOF
