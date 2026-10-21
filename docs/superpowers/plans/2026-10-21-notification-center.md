# Notification Center — Implementation Plan

Spec: `docs/superpowers/specs/2026-10-21-notification-center-design.md` · Branch: `feat/notification-center` · Base: `main` `f2158d9`

## Task 1 — Component + tests

- [ ] `packages/components/src/NotificationCenter/types.ts` — `Notification`, `NotificationKind`, `NotificationCenterProps`.
- [ ] `NotificationCenter.tsx` — bell trigger + badge + popover panel; machinery:
      click-away (root containment), focusout, Esc, resize re-place, keyboard (Tab trong panel),
      dev-warn duplicate ids.
- [ ] `NotificationCenter.module.css` — tokens only; kebab classes + bracket access.
- [ ] `NotificationCenter.test.tsx` — render trigger/badge/panel, mark-read, mark-all, remove, select,
      empty state, Esc, click-away, disabled, duplicate-warn (~12 tests).
- [ ] `index.ts` + re-export `src/index.ts`.

## Task 2 — Docs

- [ ] `apps/docs/src/pages/feedback/NotificationCenterPage.tsx` + module.css — demo + props + snippet.
- [ ] Route trong `apps/docs/src/App.tsx` (icon 'bell').

## Task 3 — Gate

- [ ] `npm run test --workspace=@enterprise-ui/components -- --run src/NotificationCenter` xanh.
- [ ] Full gate: test → typecheck → docs:snippets → lint → format → 3 builds.
- [ ] Commit additive, push, PR, re-arm listener.
