# Enterprise UI

A React + TypeScript design system for enterprise web applications.

## Goals

- Accessible, reusable UI components with stable TypeScript APIs.
- Design tokens and components independent from any specific backend.
- Small packages that applications can adopt incrementally.
- Validation through type-checking, tests, linting, and production builds.

## Layout

- `packages/tokens`: CSS custom properties and typed design-token values.
- `packages/components`: initial React components (Button and Input).
- `apps/playground`: a small integration app for manual verification.

## Requirements

- Node.js 20+
- pnpm 9+

## Getting started

```bash
pnpm install
pnpm build
pnpm typecheck
pnpm test
pnpm lint
pnpm --filter @enterprise-ui/playground dev
```

Import styles once in the application entry point:

```tsx
import '@enterprise-ui/tokens/styles.css';
import '@enterprise-ui/components/style.css';
import { Button, Input } from '@enterprise-ui/components';
```

This repository is at its initial foundation stage. Public APIs may evolve before the first stable release.
