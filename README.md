# Enterprise UI

A React + TypeScript design system for enterprise web applications.

## Goals

- Accessible, reusable UI components with stable TypeScript APIs.
- Design tokens and components independent from any specific backend.
- Small packages that applications can adopt incrementally.
- Validation through type-checking, tests, linting, formatting, and production builds.

## Layout

- `packages/tokens`: semantic CSS custom properties and typed design-token values.
- `packages/components`: React components, currently Button and Input.
- `apps/playground`: a small integration app for manual verification.

## Requirements

- Node.js 20+
- pnpm 9+

## Getting started

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm format:check
pnpm --filter @enterprise-ui/playground dev
```

Import styles once in the application entry point:

```tsx
import '@enterprise-ui/tokens/styles.css';
import '@enterprise-ui/components/style.css';
import { Button, Input } from '@enterprise-ui/components';
```

## Theming

The token package defines semantic colors, spacing, typography, shape, motion, and z-index scales. The default theme is light. Apply `data-eui-theme="dark"` to a root element or a scoped region to activate dark semantic colors.

See [the token package guide](packages/tokens/README.md) for token groups, theme usage, and typed references.

## Accessibility baseline

- Buttons use native button semantics and support keyboard activation.
- Loading buttons expose `aria-busy` and disable repeated activation.
- Inputs preserve native labeling and description attributes and expose `aria-invalid` when invalid.
- Interactive controls have visible focus styling.
- Animations and transitions are disabled when the user requests reduced motion.

The API is still pre-stable and may evolve before the first stable release.
