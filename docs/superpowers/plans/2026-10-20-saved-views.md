# Saved Views — Implementation Plan

Spec: `docs/superpowers/specs/2026-10-20-saved-views-design.md` · Branch: `feat/saved-views` · Base: `main` `4ae8f9f`

## Task 1 — Component + tests

- [ ] `packages/components/src/SavedViews/types.ts` — `SavedView<T>`, `SavedViewsProps<T>`.
- [ ] `SavedViews.tsx` — trigger + popover listbox + save row + delete ×; machinery:
      click-away (root containment), focusout (relatedTarget), Esc, IME guard, flip positioning,
      keyboard ↓↑/Enter, dev-warn duplicate ids.
- [ ] `SavedViews.module.css` — tokens only (`--input-h`, `--font-size`, `--surface`...), kebab
      class names; truy cập qua bracket nếu có dấu gạch.
- [ ] `SavedViews.test.tsx` — render/apply/save/delete/empty/keyboard/click-away/a11y/IME/disabled/
      duplicate-warn (~15 test).
- [ ] `index.ts` + re-export từ `src/index.ts`.

## Task 2 — Docs

- [ ] `apps/docs/src/pages/data/SavedViewsPage.tsx` — demo compose FilterBar (apply → filter
      state, save → snapshot), props table, self-contained snippet.
- [ ] Route trong `apps/docs/src/App.tsx` (icon từ IconName).

## Task 3 — Gate

- [ ] `npm run test --workspace=@enterprise-ui/components -- --run src/SavedViews` xanh.
- [ ] Full gate: `npm test` → typecheck → `docs:snippets` → lint → `format:check` → 3 builds.
- [ ] Commit additive, push, PR, re-arm listener.
