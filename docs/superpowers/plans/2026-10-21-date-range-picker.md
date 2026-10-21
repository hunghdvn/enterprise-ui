# Date Range Picker — Implementation Plan

Spec: `docs/superpowers/specs/2026-10-21-date-range-picker-design.md` · Branch: `feat/date-range-picker` · Base: `main` `ba242d9`

## Task 1 — Component + tests

- [ ] `packages/components/src/DateRangePicker/types.ts` — `DateRange`, `DateRangePickerProps`.
- [ ] `DateRangePicker.tsx` — trigger + popover calendar (month grid, prev/next, range highlight, presets); machinery: click-away (root containment), focusout, Esc, resize re-place, IME n/a.
- [ ] `DateRangePicker.module.css` — tokens only; kebab classes + bracket access.
- [ ] `DateRangePicker.test.tsx` — render/trigger, open/close, select from/to, reset range on 3rd click, presets, Esc, click-away, disabled, keyboard (Enter on cell), 12 tests.
- [ ] `index.ts` + re-export `src/index.ts`.

## Task 2 — Docs

- [ ] `apps/docs/src/pages/data/DateRangePickerPage.tsx` + module.css — demo + props + snippet.
- [ ] Route `App.tsx` (icon 'calendar').

## Task 3 — Gate

- [ ] `npm run test --workspace=@enterprise-ui/components -- --run src/DateRangePicker` xanh.
- [ ] Full gate: test → typecheck → docs:snippets → lint → format → 3 builds.
- [ ] Commit additive, push, PR, re-arm listener.
