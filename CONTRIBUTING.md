# Contributing

## Development setup

1. Use Node.js 20 or newer and pnpm 9 or newer.
2. Run `pnpm install` at the repository root.
3. Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, and `pnpm build` before opening a pull request.

## Component conventions

- Prefer semantic HTML and native browser behavior.
- Expose typed, documented props and preserve relevant native element attributes.
- Support keyboard use, visible focus, disabled states, and accessible names.
- Keep visual styling in CSS Modules and shared visual values in design tokens.
- Avoid coupling UI packages to backend response shapes or application routing.
- Add tests for user-visible behavior and important edge cases.

Keep pull requests focused. Public API changes should be documented and treated as compatibility-sensitive.
