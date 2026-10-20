# AGENTS.md — enterprise-ui

Monorepo npm workspaces: `packages/tokens` (pure CSS variables, tested with plain
node) → `packages/components` (React 18 + TS strict component library, zero runtime
deps) → `apps/showcase` (Vite demo). Specs live in `docs/superpowers/specs/`,
implementation plans in `docs/superpowers/plans/`. `.superpowers/` is gitignored
scratch (mockups, agent ledgers) — never commit it.

## Commands

```bash
npm test                                   # full suite: tokens node test + all workspaces
npm run test --workspace=@enterprise-ui/components -- --run src/Table
                                           # focused vitest run (path = component folder)
npm --workspaces run typecheck --if-present
npm run lint                               # eslint flat config at repo root
npm run format:check                       # prettier check (CI fails on drift)
npm run build --workspace=@enterprise-ui/components   # vite lib + .d.ts → dist/
npm run build --workspace=@enterprise-ui/showcase
```

CI (`.github/workflows/ci.yml`, Node 20) runs in this order: `npm ci` → test →
typecheck → docs:snippets → lint → format check → three builds. Mirror it
before pushing.

## Gotchas

- **Showcase consumes the built lib, not source.** `apps/showcase` resolves
  `@enterprise-ui/components` via `dist/` (`main`/`exports` point there) and must
  `import '@enterprise-ui/components/style.css'` (it bundles the tokens) —
  without it every screen renders unstyled. `dist/` is gitignored.
- **Tokens test is deliberately loose.** Prettier lowercases hex and normalizes
  quotes in `*.css`, so `packages/tokens/tokens.test.mjs` compares
  case-insensitively with quotes normalized. Do not "tighten" it to exact match.
- **Vitest globals are on** (`vitest.config.ts`): `test`/`expect`/`vi` need no
  imports. Only `@testing-library/react` helpers are imported.
- **Styling is CSS Modules only.** Every component uses `*.module.css` plus
  `var(--…)` tokens — never hardcode hex in components. `css-modules.d.ts`
  declares the modules and plain `*.css` side-effect imports for TS.
- **Components bundle tokens into `style.css`.** `packages/components/src/index.ts`
  side-effect imports `@enterprise-ui/tokens/all.css`, so consumers need only
  `import '@enterprise-ui/components/style.css'` — a separate token import is
  optional. Keep `@enterprise-ui/tokens/all.css` out of the component source
  except for that one line. The showcase still imports `all.css` for its own
  theme vars; do not remove it.
- **Components are presentational-only**: data in via props, events out via
  `onChange`/`onSort`/`onPage`, no fetching inside. Theming flows through
  `<ThemeProvider>` → `data-theme`/`data-density` attributes (default
  light + compact, persisted to localStorage). Design tokens: primary blue
  `#1E47C4`, accent orange `#F97316` used sparingly (~10%), white sidebar that
  shares the page background.
- **Component folder layout** (follow it for new components):
  `X.tsx` + `X.module.css` + `types.ts` + `index.ts` + `X.test.tsx`, re-exported
  from `src/index.ts` (components **and** public types — consumers must not
  deep-import).
- Feature work happens on branches, optionally in linked worktrees under
  `.worktrees/` (gitignored). Keep the worktree while its PR is open.
