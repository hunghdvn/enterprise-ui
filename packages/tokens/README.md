# @enterprise-ui/tokens

Design tokens for Enterprise UI as plain CSS custom properties. No JavaScript, no build
step: the package is a set of stylesheets you import, and every token is a CSS variable
consumers can read or override.

## Install

```bash
npm install @enterprise-ui/tokens
```

## Files

| File              | Contents                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `tokens.css`      | Base palette and primitives: colours, spacing, radii, shadows, typography, sizes          |
| `theme-light.css` | Light theme values under `[data-theme='light']`                                           |
| `theme-dark.css`  | Dark theme values under `[data-theme='dark']`                                             |
| `density.css`     | Control and row metrics under `[data-density='compact']` / `[data-density='comfortable']` |
| `breakpoints.css` | Breakpoint variables (`--bp-tablet`, `--bp-desktop`)                                      |
| `all.css`         | Imports every file above in dependency order                                              |

## Usage

Import the full set in one line:

```css
@import '@enterprise-ui/tokens/all.css';
```

Or pull in only what you need — `tokens.css` defines the base variables, while themes and
density are opt-in:

```css
@import '@enterprise-ui/tokens/tokens.css';
@import '@enterprise-ui/tokens/theme-dark.css';
```

Consumers of `@enterprise-ui/components` do not need to import this package: the component
stylesheet already includes the token layer. Import `@enterprise-ui/tokens/all.css`
yourself when you build UI outside the component kit, add your own token layer, or want a
separate stylesheet to cache.

## Theme and density

Themes are selected with a `data-theme` attribute on any ancestor element:

```html
<div data-theme="dark">
  <div>Dark theme content</div>
</div>
```

`[data-theme='light']` and `[data-theme='dark']` both redefine the semantic tokens (surfaces,
text, borders, rings) while the base palette in `tokens.css` stays stable. A subtree can
switch themes independently of its parent.

Density is controlled the same way with `data-density="compact"` or
`data-density="comfortable"`, which adjusts control heights, paddings and row heights. Both
attributes compose, so `data-theme="dark" data-density="compact"` works as expected.

## License

MIT.
