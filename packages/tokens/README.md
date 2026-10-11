# Design tokens

The token package provides CSS custom properties and typed TypeScript references for consistent visual decisions across Enterprise UI components.

## Design direction: Balanced Sky

Balanced Sky uses a clear, accessible sky-blue interaction color with cool slate neutrals. The palette is intentionally restrained: blue identifies primary actions, focus, and selection; semantic colors communicate status; surfaces and typography carry the rest of the hierarchy.

## Token groups

- **Palette:** primitive Sky and Slate scales (50–900) for brand and neutral color decisions.
- **Semantic color:** primary, text, border, surface, focus, and status colors (danger, success, warning, info).
- **Spacing:** a 4px-based spacing scale from 0 to 64px.
- **Typography:** font family, size, weight, line-height, and letter-spacing scales.
- **Shape:** border radius, control radius, and border width.
- **Control sizing:** small, medium, and large control heights.
- **Motion:** duration and easing tokens.
- **Elevation:** small, medium, large, and focus shadows.
- **Layering:** z-index levels for dropdowns, sticky content, overlays, modals, and toasts.

## Import the CSS

Import the stylesheet once in the application entry point:

```tsx
import '@enterprise-ui/tokens/styles.css';
```

Components consume these variables directly, so themes can change without changing component APIs.

## Using semantic tokens

Prefer semantic tokens in components so the theme can evolve without rewriting component styles:

```css
.action {
  color: var(--eui-color-primary-foreground);
  background: var(--eui-color-primary);
}

.action:hover {
  background: var(--eui-color-primary-hover);
}

.selected-row {
  color: var(--eui-color-primary-subtle-foreground);
  background: var(--eui-color-primary-subtle);
}
```

Use the primitive `--eui-palette-sky-*` and `--eui-palette-slate-*` scales when building visual documentation or defining new semantic tokens. Application components should generally consume semantic tokens instead.

## Dark theme

Apply `data-eui-theme="dark"` to the root element or to a scoped application region:

```tsx
<div data-eui-theme="dark">
  <YourApplication />
</div>
```

The dark theme overrides semantic colors and elevation while preserving the shared spacing, typography, shape, motion, and layering scales.

## Typed references

Use `designTokens` when a TypeScript style value should reference the shared system:

```tsx
import { designTokens } from '@enterprise-ui/tokens';

const panelStyle = {
  color: designTokens.color.text,
  background: designTokens.color.surface,
  borderRadius: designTokens.radius.md,
  padding: designTokens.spacing[4],
};

const brandColor = designTokens.palette.sky[700];
```

Prefer semantic tokens such as `color.text` or `color.dangerSurface` over hard-coded colors. Add new tokens to both `src/tokens.css` and `src/index.ts` so CSS consumers and typed consumers stay aligned.
