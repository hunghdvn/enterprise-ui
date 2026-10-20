# Docs code↔demo sync — Design Spec (Sub-project 8)

**Date:** 2026-10-20
**Status:** Approved (owner: "khi merge hết cả 2 thì tự động làm S8").
**Base:** `main` `8c5da42` (sau khi #19/#20/#21 merge). Final sub-project of the 8-part docs-site preview series.

## 1. Intent & why

- Docs pages expose each component as: live demo + props table + code snippet. The snippet is the
  copy-paste contract — if it does not compile against the current component APIs, or diverges from
  the demo, every reader who copies it hits a broken example.
- Six review rounds across #19/#20/#21 repeatedly flagged exactly this class of drift:
  Combobox's `onChange={setValue}` (custom `(value: string|string[])` signature vs
  `Dispatch<SetStateAction<string>>`), Select's `multiple` (removed in #21), SplitView's "khi kéo"
  wording, missing props rows. All were found manually, one page at a time.
- Nothing guards the whole surface: a future component change can silently strand every snippet
  that references the old API.

## 2. Goals / Non-goals

Goals:

- **G1** Every `const code = \`...\``snippet in`apps/docs/src/pages/**`typechecks against the
built`@enterprise-ui/components`(strict mode), with`react-jsx` — enforced by a script, not by
  hope.
- **G2** The check is wired into the repo's gate (npm script + CI step) so drift fails CI like any
  other break.
- **G3** Drift found by the first run is fixed in the same PR.
- **G4** Props tables: pages whose components changed during #19–#21 (Select, SplitView, Combobox)
  carry the current prop set (already done in those PRs — verify, no re-audit of unchanged pages
  beyond spot checks).

Non-goals:

- **N1** Runtime execution of snippets (typecheck only — the demos themselves are the runtime).
- **N2** Re-auditing showcase (`apps/showcase`) snippets — they are full demo apps, compiled by the
  showcase build already.
- **N3** Prettier-formatting snippets inside docs (CodeBlock renders pre-formatted text).
- **N4** N4-class items declined in earlier rounds (SplitView content-sized vertical cap, Table
  machinery copy) stay declined.

## 3. Design

### 3.1 Harness — `scripts/check-docs-snippets.mjs`

- Globs `apps/docs/src/pages/**/*.tsx`, extracts each top-level `` const code = `...` ``
  (single template literal per page — the established pattern), writes each to
  `node_modules/.docs-snippets/<page>.tsx` untouched (they carry their own imports).
- Generates `node_modules/.docs-snippets/tsconfig.json` extending `apps/docs/tsconfig.json`
  (inherits strict, jsx, moduleResolution, workspace types), `include` only the temp dir, and
  `noEmit`.
- Runs `tsc -p <generated>`; prints one line per file; exits 1 if any snippet fails.
- One snippet = one file = one error isolate (a broken snippet doesn't mask the others).

### 3.2 Gate wiring

- `package.json`: `"docs:snippets": "node scripts/check-docs-snippets.mjs"`.
- `.github/workflows/ci.yml`: a step after typecheck — `npm run docs:snippets`.

### 3.3 Fixed contract per page (what the audit asserts)

- The snippet's imports resolve (`@enterprise-ui/components` real exports).
- Handler shapes typecheck (`(e: ChangeEvent<...>)` natives; custom signatures cast explicitly).
- Props referenced exist on the component's current type (Omit'd/renamed props fail here — the
  `Select multiple` class of drift).

## 4. Decisions

- **D1** Script in repo-root `scripts/` (plain ESM node, no build step), not a vitest test — the
  check spawns `tsc`, and vitest-in-tsc is a nested-tooling smell.
- **D2** Temp output under `node_modules/.docs-snippets/` (gitignored by default, wiped on install)
  — never inside `apps/docs/src` (would ship or leak into its typecheck).
- **D3** First run findings are fixed as doc changes (snippet edits), not harness exceptions — no
  per-file suppressions.
- **D4** CI step runs after typecheck (it extends typecheck's coverage to docs prose code).

## 5. Risks

- Snippets using values outside the snippet body (page-level constants) would fail the isolated
  compile — accepted: a self-contained snippet is the point (D3 fixes by inlining).
- Multi-snippet pages (none today — one `code` per page) — the glob handles N files per page if
  the pattern ever grows.

## 6. Open questions

- None — scope confirmed against the review history of #19/#20/#21.
