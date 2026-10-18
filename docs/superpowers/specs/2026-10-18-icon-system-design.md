# Icon System — Design Spec

Date: 2026-10-18
Status: Draft
Repo: enterprise-ui

## 1. Intent & Why

The library has no icon system — `Empty` hand-draws a box SVG, `Toast` uses the text glyph "✕", `Modal` uses "✕". Consumers have no consistent, accessible icon set. This spec adds a zero-dependency `Icon` component backed by a curated inline-SVG registry, and migrates the 3 components that currently improvise icons.

## 2. Goals

- `Icon` component: `<Icon name="check" size={16} />` renders an inline SVG from a curated registry (~30-35 icons).
- Zero runtime deps (inline SVG only, no icon library).
- Accessible by default: `aria-hidden="true"`; optional `label` → `role="img"` + `<title>`.
- Color via `currentColor` (inherits from parent).
- Refactor `Empty` (default icon → `Icon name="inbox"`), `Toast` (close → `Icon name="x"`), `Modal` (close → `Icon name="x"`) to use the new system.
- Docs page (`IconPage`) + showcase demo (`IconDemoPage`).

## 3. Non-Goals

- No icon font, no sprite sheet, no external icon library dependency.
- No `icon` prop on `Button` (follow-up; keep scope tight).
- No animated icons.
- No icon picker / search UI in docs (just a grid of all icons).

## 4. Constraints

- Monorepo conventions: folder layout `Icon/Icon.tsx + Icon.module.css + types.ts + index.ts + Icon.test.tsx`, re-exported from `src/index.ts`.
- CSS Modules only, `var(--…)` tokens, no hardcoded hex.
- TS strict, no `any`, Vitest globals on.
- Icon SVGs: 24×24 viewBox, stroke-based (2px, round caps/joins) for visual consistency with `Empty`'s existing box icon.
- Bundle target: components <150KB gzip (icons add ~5-8KB).

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

## 6. Icon Set (~33 icons)

Navigation/UI: chevron-down, chevron-up, chevron-left, chevron-right, arrow-left, arrow-right, x (close), menu, more-horizontal, search, filter, settings, user, bell, mail, home
Actions: plus, minus, edit (pencil), trash, download, upload, copy, check, check-circle, refresh
Status: info, alert-circle, alert-triangle, help-circle
Misc: calendar, clock, eye, eye-off, external-link, inbox, lock

## 7. File Structure

```
packages/components/src/Icon/
  Icon.tsx          // component
  Icon.module.css   // .icon (display: inline-block, vertical-align)
  types.ts          // IconProps, IconName
  icons.ts          // ICONS registry: Record<IconName, ReactNode>
  index.ts          // re-exports
  Icon.test.tsx     // tests
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
2. All ~33 icons render without errors.
3. Empty/Toast/Modal refactored and their tests still pass.
4. IconPage in docs shows grid of all icons with names.
5. Showcase IconDemoPage.
6. Zero runtime deps maintained; bundle <150KB gzip.
7. Typecheck, lint, format, builds all pass.
EOF