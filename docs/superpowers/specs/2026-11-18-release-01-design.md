# Release 0.1.0 + Changesets Design

Date: 2026-11-18
Status: Draft — publish target chosen by the user (npm public, `@enterprise-ui`,
OIDC trusted publishing).
Base: `package.json`, `packages/tokens`, `packages/components`,
`.github/workflows/ci.yml`.

## 1. Intent & why

The library is feature-complete through P4e, but it is not installable:
`@enterprise-ui/components` and `@enterprise-ui/tokens` are `0.1.0` in the
monorepo, neither exists on npm, and there is no versioning or publish path.
This slice makes the two packages publishable to npm public, with changesets
for versioning and GitHub Actions OIDC trusted publishing for releases.

Success looks like: a consumer can `npm install @enterprise-ui/components`,
import `Button` and `@enterprise-ui/components/style.css`, and get a working
typed package; a maintainer can cut the next version by merging a changeset PR.

## 2. Goals / Non-goals

Goals:

- G1: Publish `@enterprise-ui/tokens` and `@enterprise-ui/components` to npm
  public under the existing `@enterprise-ui` scope, starting at `0.1.0`.
- G2: Changesets drives versioning: PRs add changesets, CI opens/updates a
  "Version Packages" PR, merging it publishes.
- G3: Trusted publishing (OIDC) in GitHub Actions; no long-lived `NPM_TOKEN`.
- G4: Complete package metadata: `publishConfig.access=public`, `exports`,
  `repository`, `files`, `sideEffects`, `engines`, README and LICENSE.
- G5: Tarball contents verified (`npm pack --dry-run`, local install smoke test).
- G6: One-time bootstrap documented: the first publish is manual because npm
  needs the package to exist before a trusted publisher can be attached.

Non-goals: no `1.0.0`, no API/component changes, no docs-site deployment, no
npm scope rename, no per-component deep-import entry points.

## 3. Constraints

- npm workspaces; root is private, packages are publishable.
- Components bundles `@enterprise-ui/tokens/all.css` into `dist/style.css`, but
  the emitted `dist/index.d.ts` keeps `import '@enterprise-ui/tokens/all.css'`.
  Tokens must therefore be published as a real package; bundling it away is out
  of scope.
- React 18 peer dependency stays `^18.3.0`.
- Local/CI Node 20 must keep working; changesets CLI v3 requires Node 22+, so
  use `@changesets/cli` v2 + `changesets/action` v1.7.0 (v1 line, trusted
  publishing supported).
- Trusted publishing requires npm CLI ≥ 11.5.1 and Node ≥ 22.14 in the publish
  job; the release workflow uses Node 24, while the existing CI stays on 20.
- Trusted publishing needs the workflow file to exist in `.github/workflows/`
  and the package to exist on npm before the trust relationship is configured.

## 4. Package design

### 4.1 `@enterprise-ui/tokens`

```json
{
  "name": "@enterprise-ui/tokens",
  "version": "0.1.0",
  "license": "MIT",
  "description": "Design tokens (CSS variables) for the Enterprise UI component library.",
  "keywords": ["design-tokens", "css", "theming", "enterprise-ui"],
  "type": "module",
  "files": ["*.css"],
  "exports": {
    ".": "./tokens.css",
    "./*.css": "./*.css"
  },
  "publishConfig": { "access": "public" },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/hunghdvn/enterprise-ui.git",
    "directory": "packages/tokens"
  },
  "homepage": "https://github.com/hunghdvn/enterprise-ui/tree/main/packages/tokens"
}
```

- `exports` keeps `@enterprise-ui/tokens/all.css` working (used by the
  components build and documented for consumers).
- No build step; `files` ships the CSS sources.
- README added for the npm page.

### 4.2 `@enterprise-ui/components`

Add:

```json
{
  "publishConfig": { "access": "public" },
  "sideEffects": ["**/*.css"],
  "engines": { "node": ">=18" },
  "prepublishOnly": "npm run build"
}
```

- `exports` stays as-is (`.` + `./style.css`); no deep imports.
- `prepublishOnly` guarantees `dist/` exists for local and CI publishes.
- README added; `files` already includes `dist` + `THIRD_PARTY_NOTICES.md`.

### 4.3 Root

- Add `@changesets/cli@2.31.1` and `@changesets/changelog-git@^0.2.1` devDeps.
- Scripts:

```json
"changeset": "changeset",
"version:packages": "changeset version && npm install --package-lock-only",
"release": "changeset publish"
```

- `linked` is not enough here: changesets only aligns versions when both packages
  have changesets in the same release, and it does not force both to publish.
  Components bundles the token CSS, so a tokens change is only useful once
  components is republished anyway. Use `fixed`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.4/schema.json",
  "changelog": "@changesets/changelog-git",
  "commit": false,
  "fixed": [["@enterprise-ui/tokens", "@enterprise-ui/components"]],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- Components declares `@enterprise-ui/tokens` as `^0.1.0` (not `*`), so the
  published pairing is reproducible and changesets can bump it. With `fixed`,
  both versions move together on every release.

- Root `README.md` and `LICENSE` (MIT, `Copyright (c) 2026 hunghdvn`).
- Docs: `apps/docs/src/content/docs/getting-started.mdx` drops the "internal
  registry or package path" wording (the package is on npm public), keeps
  `"@enterprise-ui/components": "*"` in the monorepo workspace example, and
  uses `npm install @enterprise-ui/components` for consumers.

## 5. Release workflow (OIDC)

`.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    timeout-minutes: 40
    steps:
      - name: Checkout
        uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
        with:
          fetch-depth: 0
      - name: Set up Node
        uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
        with:
          node-version: 24
          registry-url: 'https://registry.npmjs.org'
      - name: Install npm
        run: npm install -g npm@11
      # Keep these gate steps in sync with .github/workflows/ci.yml (verify job).
      - name: Install dependencies
        run: npm ci
      - name: Unit tests
        run: npm test
      - name: Typecheck (all workspaces)
        run: npm --workspaces run typecheck --if-present
      - name: Docs snippets typecheck
        run: npm run docs:snippets
      - name: Lint
        run: npm run lint
      - name: Prettier check
        run: npm run format:check
      - name: Build components lib
        run: npm run build --workspace=@enterprise-ui/components
      - name: Build showcase
        run: npm run build --workspace=@enterprise-ui/showcase
      - name: Build docs site
        run: npm run build --workspace=@enterprise-ui/docs
      - name: Publish
        uses: changesets/action@6a0a831ff30acef54f2c6aa1cbbc1096b066edaf # v1.7.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          publish: npm run release
          version: npm run version:packages
          commit: 'chore: version packages'
          title: 'chore: version packages'
```

Behaviour:

- If changesets exist: run `changeset version`, commit the version bump +
  changelogs, open/update the "Version Packages" PR.
- If no changesets (the version PR was merged): run `changeset publish`, which
  publishes packages whose current version is not on npm.
- `id-token: write` + npm ≥ 11.5.1 + `registry-url` is what enables OIDC; no
  `NPM_TOKEN` is used.
- The existing `ci.yml` stays on Node 20; only the release job needs Node 24.

### 5.1 One-time bootstrap

1. Merge the release tooling to `main` (workflow must exist before npm trust
   can reference it).
2. Build and publish the first version manually (npm login + 2FA):

```bash
npm ci
npm run build --workspace=@enterprise-ui/components
npm publish --workspace=@enterprise-ui/tokens --access public
npm publish --workspace=@enterprise-ui/components --access public
```

3. Configure a trusted publisher for each package. The npmjs.com UI works with
   any npm version; the CLI needs npm ≥ 11.15.0 (`npm install -g npm@latest`
   first — the npm bundled with Node 20 is older):

```bash
npm trust github @enterprise-ui/tokens \
  --repo hunghdvn/enterprise-ui --file release.yml --allow-publish
npm trust github @enterprise-ui/components \
  --repo hunghdvn/enterprise-ui --file release.yml --allow-publish
```

4. There is no seed changeset: the first real changeset merged to `main` makes
   the release workflow open the "Version Packages" PR. Configure the trusted
   publishers just before merging that PR, and merge it within the 2-day
   validation window (npm expires an unvalidated trust config after 2 days).
5. Optional hardening: package settings → Publishing access → "Require two-factor
   authentication and disallow tokens".

The first Release run after this PR merges will attempt to publish 0.1.0 and fail
because no trusted publisher exists yet — this is expected. Publish manually
(step 2); the next run prints `No unpublished projects to publish` and goes green.

## 6. Verification

- `npm pack --workspace=@enterprise-ui/tokens --dry-run` and the same for
  components: package.json, README, LICENSE, CSS/dist present; no source maps
  or tests in the tarball.
- `npx changeset status`: config resolves, linked packages recognised.
- Local install smoke test: pack both tarballs, install into a temp React 18
  project, import `Button` and `@enterprise-ui/components/style.css`, render.
- `npm publish --dry-run` for both packages (no registry write).
- Existing gate: `npm test`, typecheck, `docs:snippets`, lint, format, three
  builds.

## 7. Risks & decisions

- **Tokens must ship.** `@enterprise-ui/tokens` remains a runtime dependency (the
  built stylesheet bundles its CSS, and consumers may import `all.css`
  directly); the declaration build strips the build-time CSS import so
  `dist/index.d.ts` no longer forces consumers to resolve it. Publishing both is
  the smallest safe step.
- **Published types portability.** The declarations use extensionless relative
  imports, so the components README documents `moduleResolution: "bundler"`
  (or `skipLibCheck: true`); NodeNext emission is a follow-up. The build also
  strips the tokens CSS import to keep TS < 5.6 / `noUncheckedSideEffectImports`
  consumers building.
- **Trusted publishing bootstrap.** The first publish cannot use OIDC because
  the package does not exist yet; step 5.1 publishes once locally with 2FA.
- **Trust config expiry.** A new trusted publisher must be used within 2 days;
  configure it immediately before the first CI release, not months earlier.
- **Changesets version line.** v2.31.1 + action v1.7.0 keeps Node 20 local
  compatibility; v3 requires Node 22+ and is deferred.
- **Provenance.** npm may generate provenance via OIDC once the package is public;
  the first 0.1.0 publish may not have an attestation because the package does not
  exist yet. Verify on the first CI release; if it rejects provenance, set
  `NPM_CONFIG_PROVENANCE=false` and revisit.
- **React 19.** Out of scope; widening `peerDependencies` is a separate change.
- **Changeset enforcement.** A CI check that PRs touching packages include a
  changeset is out of scope for this slice; maintainers add changesets by
  convention. Revisit if releases start shipping without one.

## 8. Out of scope

- Component/API changes, new packages, docs-site hosting, npm scope transfer,
  automated visual regression, axe CI, changeset enforcement (separate
  follow-ups).
