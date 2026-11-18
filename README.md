# enterprise-ui

A React 18 + TypeScript component kit for enterprise admin applications: an explicit
design-token layer, light/dark themes, compact and comfortable densities, and no runtime
JavaScript dependencies. Components are presentational-only — data goes in through props,
events come out through `onChange`/`onSort`/`onPage` — so they slot into any data layer.

This repository is an npm workspaces monorepo.

## Packages

| Package                     | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `@enterprise-ui/tokens`     | Design tokens as plain CSS custom properties (colour, theme, density) |
| `@enterprise-ui/components` | React components styled with CSS Modules on top of the token layer    |

Both are published together under a fixed version group, so their versions always match.

## Install

```bash
npm install @enterprise-ui/components
```

React 18.3 and React DOM 18.3 are peer dependencies. `@enterprise-ui/tokens` is a regular
dependency of `@enterprise-ui/components` and its CSS is bundled into the component
stylesheet — you normally do not import it yourself.

## Quick start

Import the stylesheet once at your entry point, wrap the app in `ThemeProvider`, and use
the components:

```tsx
import { ThemeProvider, Button, Badge, Icon } from '@enterprise-ui/components';
import '@enterprise-ui/components/style.css';

export function App() {
  return (
    <ThemeProvider theme="light" density="compact">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button icon={<Icon name="plus" size={14} />}>Tạo đơn</Button>
        <Badge tone="green">Đã lưu</Badge>
      </div>
    </ThemeProvider>
  );
}
```

`ThemeProvider` sets `data-theme` and `data-density` on a wrapping element and persists
the choice to localStorage. Read and change them with the `useTheme()` hook. Without a
provider the components still render, but theme tokens only apply to elements carrying a
`data-theme` attribute.

## Development

```bash
npm install          # install all workspaces
npm test             # tokens test + every workspace test suite
npm run lint         # eslint flat config at the repo root
npm run format:check # prettier check
npm run docs:snippets # typecheck the TSX snippets in the docs
npm run build --workspace=@enterprise-ui/components
npm run dev --workspace=@enterprise-ui/showcase
```

`apps/showcase` and `apps/docs` resolve `@enterprise-ui/components` through its built
`dist/`, which is gitignored — run the components build before the first `npm run dev`.

## Publishing

Releases are managed with [Changesets](https://github.com/changesets/changesets). Both
packages are public and move together in a fixed group, so a changeset for either one
versions both.

```bash
npm run changeset   # record a changeset describing the next release
npm run version:packages # apply the version bump and refresh the lockfile
npm run release     # publish the bumped packages to npm
```

`@enterprise-ui/components` runs its build in `prepublishOnly`, so publishing always ships
a fresh `dist/`.

## Documentation

Full documentation lives in [`apps/docs`](./apps/docs) and is published at
<https://hunghdvn.github.io/enterprise-ui/>.

## License

MIT — see [LICENSE](./LICENSE). Icon geometry in the components package is derived from
Lucide (ISC) and Feather (MIT); see
[`packages/components/THIRD_PARTY_NOTICES.md`](./packages/components/THIRD_PARTY_NOTICES.md).
