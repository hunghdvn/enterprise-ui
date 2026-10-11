# Design tokens

The token package provides CSS custom properties and typed TypeScript references for consistent visual decisions across Enterprise UI components.

## Token groups

- **Color:** brand, text, border, surface, focus, and semantic status colors (danger, success, warning, info).
- **Spacing:** a 4px-based spacing scale from 0 to 64px.
- **Typography:** font family, size, weight, and line-height scales.
- **Shape:** border radius and border width.
- **Motion:** duration and easing tokens.
- **Layering:** z-index levels for dropdowns, sticky content, overlays, modals, and toasts.

## Import the CSS

Import the stylesheet once in the application entry point:

```tsx
import '@enterprise-ui/tokens/styles.css';
```

Components consume these variables directly, so themes can change without changing component APIs.

## Dark theme

Apply `data-eui-theme="dark"` to the root element or to a scoped application region:

```tsx
<div data-eui-theme="dark">
  <YourApplication />
</div>
```

The default `:root` values are the light theme. The dark theme overrides semantic color variables while keeping spacing, typography, shape, motion, and layering consistent.

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
```

Prefer semantic tokens such as `color.text` or `color.dangerSurface` over hard-coded color values. Add new tokens to both `src/tokens.css` and `src/index.ts` so CSS consumers and typed consumers stay aligned.
