# @enterprise-ui/components

React 18 + TypeScript ERP component kit (zero runtime dependencies). Components are
presentational-only: data in via props, events out via `onChange`/`onSort`/`onPage`.
Styling is CSS Modules driven by CSS custom properties from `@enterprise-ui/tokens`.

## Install

```bash
npm install @enterprise-ui/components @enterprise-ui/tokens
```

Both packages are required. `@enterprise-ui/tokens` ships the CSS variables
(`@enterprise-ui/tokens/*.css`) that `@enterprise-ui/components/style.css` reads at
runtime; React stays a peer dependency.

## Styles

Import the component stylesheet and the token bundle together — one import each:

```ts
import '@enterprise-ui/components/style.css';
import '@enterprise-ui/tokens/all.css';
```

`@enterprise-ui/tokens/all.css` re-exports `tokens.css`, `theme-light.css`,
`theme-dark.css`, `density.css` and `breakpoints.css`, so a single import gives you
the full token set.

## Theming

Wrap the app in `ThemeProvider` — it sets `data-theme`/`data-density` on the root
element (light + compact by default, persisted to localStorage). Toggle with
`useTheme()`:

```tsx
import { ThemeProvider, useTheme } from '@enterprise-ui/components';

function Toggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Theme: {theme}</button>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Toggle />
    </ThemeProvider>
  );
}
```

## Showcase

See the runnable demo — Light/Dark switching, dense table, FilterBar, Form/Modal —
in [`apps/showcase`](../apps/showcase):

```bash
npm run dev --workspace=@enterprise-ui/showcase
```
