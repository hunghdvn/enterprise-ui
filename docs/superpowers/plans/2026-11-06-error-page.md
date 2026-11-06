# ErrorPage (403/404/500) — Implementation Plan

Spec: `docs/superpowers/specs/2026-11-06-error-page-design.md` · Branch: `feat/error-pages` · Base: `main` `7e6696a`

## Task 1 — Component + tests

- [x] `packages/components/src/ErrorPage/types.ts` — `ErrorStatus`, `ErrorPageLandmark`, `ErrorPageProps`.
- [x] `ErrorPage.tsx` — status defaults (icon/title/description), title fallback, description/icon
      hide rules, actions slot, `level`, `as`, `fill`, `data-status`/`data-fill`, `cx`.
- [x] `ErrorPage.module.css` — tokens only; centred layout, inline-size container,
      `@container (max-width: 480px)`, 500 danger cue, no `@media`.
- [x] `ErrorPage.test.tsx` — defaults per status, decorative icon, no alert, overrides,
      hide rules, title fallback, heading level, `as`/`fill`, actions, container query,
      accent tokens.
- [x] `index.ts` + re-export from `packages/components/src/index.ts`.

## Task 2 — Docs

- [x] `apps/docs/src/pages/templates/ErrorPage.tsx` — three tabs 403/404/500, each with
      `as="div"` + `fill={false}` + actions; one self-contained snippet (S8: 1 marker,
      0 nested backticks); props table.
- [x] `apps/docs/src/pages/templates/ErrorPage.module.css` — docs layout + 480px preview.
- [x] Route in `apps/docs/src/App.tsx` (label `ErrorPage`, icon `alert-triangle`).

## Task 3 — Gate

- [ ] Focused test: `npm run test --workspace=@enterprise-ui/components -- --run src/ErrorPage`.
- [ ] Mutants: defaults per status, title fallback, description hide, icon hide, actions
      wrapper, `as`/`fill`, 500 danger cue, non-500 accent, container query, decorative icon.
      Revert each fix, confirm a pinning test fails, restore from a `cp` backup.
- [ ] Full gate: `npm test` → typecheck → `docs:snippets` → lint → format → three builds.
- [ ] Commit, push, watch both CI runs, open PR, post the Vietnamese findings/test/mutant
      tables.

## Review focus

- One `<main>` only: docs page owns it; every demo uses `as="div"`.
- No `role="alert"`/live region on mount; route error is navigation, not async notification.
- Colour never the only channel: numeric code + title are real text; icon is decorative.
- Light/dark contrast for `--action-text` and `--danger-emphasis` on `--bg`.
- The container query must follow the width ErrorPage receives, not the viewport.
- Actions are caller-owned; the template never invents navigation or retry.
