# @enterprise-ui/components

React 18 + TypeScript ERP component kit (zero runtime dependencies). Components are
presentational-only: data in via props, events out via `onChange`/`onSort`/`onPage`.
Styling is CSS Modules driven by CSS custom properties whose token layer
(`@enterprise-ui/tokens`) is bundled straight into the built stylesheet.

## Install

```bash
npm install @enterprise-ui/components
```

`@enterprise-ui/tokens` is installed as a dependency of `@enterprise-ui/components` — you
do not have to import it yourself: the component stylesheet already carries the CSS
variables it reads at runtime. React 18.3 and React DOM 18.3 are peer dependencies.

## Styles

One import is enough:

```ts
import '@enterprise-ui/components/style.css';
```

`@enterprise-ui/components/style.css` includes the full token set, so a consumer
importing only the component stylesheet resolves every `var(--…)`.

If you prefer to own the token layer (custom additions, separate cache lifetime,
or your own build pipeline), importing `@enterprise-ui/tokens/all.css` yourself
stays supported — it re-exports `tokens.css`, `theme-light.css`,
`theme-dark.css`, `density.css` and `breakpoints.css`. It is optional and no
longer required.

## Usage

```tsx
import { Badge, Button, Icon } from '@enterprise-ui/components';

export function Actions() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button icon={<Icon name="plus" size={14} />}>Tạo đơn</Button>
      <Button variant="secondary">Huỷ</Button>
      <Badge tone="green">Đã lưu</Badge>
    </div>
  );
}
```

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

## Documentation

Full documentation — every component with props and examples, plus theming and tokens —
is published at <https://hunghdvn.github.io/enterprise-ui/>. Source lives in
[`apps/docs`](https://github.com/hunghdvn/enterprise-ui/tree/main/apps/docs).

## Showcase

See the runnable demo — Light/Dark switching, dense table, FilterBar, Form/Modal —
in [`apps/showcase`](https://github.com/hunghdvn/enterprise-ui/tree/main/apps/showcase):

```bash
npm run dev --workspace=@enterprise-ui/showcase
```

## License

MIT. Icon geometry is derived from Lucide (ISC) and Feather (MIT); see
[`THIRD_PARTY_NOTICES.md`](https://github.com/hunghdvn/enterprise-ui/blob/main/packages/components/THIRD_PARTY_NOTICES.md).
