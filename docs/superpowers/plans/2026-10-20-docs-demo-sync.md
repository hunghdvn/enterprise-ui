# Docs code↔demo sync — Implementation Plan (Sub-project 8)

Spec: `docs/superpowers/specs/2026-10-20-docs-demo-sync-design.md` · Branch: `feat/docs-demo-sync` · Base: `main` `8c5da42`

## Task 1 — Harness

- [ ] `scripts/check-docs-snippets.mjs`: glob pages, extract `const code = \`...\``, write
`node_modules/.docs-snippets/<name>.tsx`, generate tsconfig (extends `apps/docs/tsconfig.json`,
noEmit), spawn `tsc -p`, report per-file, exit 1 on failure.
- [ ] `package.json`: `docs:snippets` script.
- [ ] Run it; record findings.

## Task 2 — Fix drift found by the first run

- [ ] Fix each failing snippet as a docs-page edit (D3: no harness suppressions).
- [ ] Re-run until 0 findings.

## Task 3 — Gate wiring

- [ ] `.github/workflows/ci.yml`: add `npm run docs:snippets` after typecheck.

## Task 4 — Verify

- [ ] `npm run docs:snippets` green.
- [ ] Full gate: `npm test` → typecheck → lint → `format:check` → 3 builds.
- [ ] Commit (additive), push, open PR, re-arm the review listener.
