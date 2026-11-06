# ErrorPage (403/404/500) — Implementation Plan

Spec: `docs/superpowers/specs/2026-11-06-error-page-design.md` · Branch: `feat/error-pages` · Base: `main` `7e6696a`

## Task 1 — Component + tests

- [x] `packages/components/src/ErrorPage/types.ts` — `ErrorStatus`, `ErrorPageLandmark`, `ErrorPageProps`.
- [x] `ErrorPage.tsx` — status defaults (icon/title/description) with a 500 fallback for unknown
      statuses, `useId` heading label applied only on `main`/`section`, `data-tone` danger cue,
      title fallback, description/icon hide rules, actions slot, `level` 1–3, `as`, `fill`,
      `data-status`/`data-fill`, `cx`.
- [x] `ErrorPage.module.css` — tokens only; `border-box` root, centred layout, inline-size container,
      `@container (max-width: 480px)`, `[data-tone='danger']` cue, no `@media`.
- [x] `ErrorPage.test.tsx` — defaults per status, unknown-status fallback, decorative icon,
      labelled wrapper + unlabelled `div`, `data-tone` for 500/fallback vs 403/404, no alert,
      overrides, wrapper-dropping hide rules, title fallback (null/``/true), heading levels 1–3,
      `as`/`fill` data hooks plus the `min-height` declaration, actions guard (including `[]`),
      `border-box` root, container query, danger tokens on both selectors.
- [x] `internal/isPresent.ts` + test — `true` and `[]` are absent; behaviour change verified against
      AuthLayout, LoginForm, Empty, KpiCard and AppShell suites.
- [x] `index.ts` + re-export from `packages/components/src/index.ts`.

## Task 2 — Docs

- [x] `apps/docs/src/pages/templates/ErrorsPage.tsx` — three tabs 403/404/500 rendered from one
      `DEMOS` array, each with `as="div"` + `fill={false}` + actions; one self-contained snippet
      (S8: 1 marker, 0 nested backticks); props table marks `status` as required and documents the
      `fill={false}` requirement inside AppShell.
- [x] `apps/docs/src/pages/templates/ErrorsPage.module.css` — docs layout + 480px preview.
- [x] Route in `apps/docs/src/App.tsx` (label `ErrorPage`, icon `alert-triangle`).

## Task 3 — Gate

- [x] Focused test: `npm run test --workspace=@enterprise-ui/components -- --run src/ErrorPage`.
- [x] Mutants: 42 cases (defaults per status, fallback/hide semantics, unknown status, wrapper
      labelling incl. the `div` exemption, `level`, actions guard, `border-box`, `min-height`,
      `data-tone` danger cue on `.code`, container query). Each reverted and restored from a `cp`
      backup; all caught.
- [x] Full gate: `npm test` → typecheck → `docs:snippets` → lint → format → three builds.
- [x] Commit, push, watch both CI runs, open PR #33, post the Vietnamese findings/test/mutant
      tables.

## Review focus

- One `<main>` only: docs page owns it; every demo uses `as="div"`. Inside AppShell keep the
  default `as="main"` (its content area is a `div`) and pass only `fill={false}`.
- `aria-labelledby` only on `main`/`section`; a `div` wrapper is generic and must not be named.
- No `role="alert"`/live region on mount; route error is navigation, not async notification.
- Colour never the only channel: numeric code + title are real text; icon is decorative.
- Light/dark contrast for `--action-text` and `--danger-emphasis` on `--bg`.
- The container query must follow the width ErrorPage receives, not the viewport.
- Actions are caller-owned; the template never invents navigation or retry.
- An unsupported status must degrade to 500 copy (and 500 danger tone), never throw.
