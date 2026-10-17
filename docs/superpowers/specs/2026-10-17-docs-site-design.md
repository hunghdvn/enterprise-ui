# Docs Site + Missing Components — Design Spec

Date: 2026-10-17
Status: Draft for builder check
Repo: enterprise-ui

## 1. Intent & Why

Build a documentation site for the enterprise-ui component library, using the
library itself to render the docs (dogfooding). The site should feel like
Ant Design or Tabler docs: sidebar navigation, per-component pages with live
demos, props tables, and code snippets.

Before building the docs site, complete the 4 missing P1 primitives that the
docs site itself needs: **Tabs, Tooltip, Empty, Spin**.

**Why now:** The library has ~18 components but no centralized docs. Every
component finished should have docs finished — "xong đến đâu có tài liệu đến
đấy". The docs site is also the best way to dogfood the components at scale.

## 2. Goals

- Complete 4 missing P1 components: Tabs, Tooltip, Empty, Spin
- Add showcase pages for the 4 new components in `apps/showcase`
- Build a docs site (Vite + React, in `apps/docs`) that uses `@enterprise-ui/components` for its own UI
- Every component in the library has a docs page with: description, live demo, props table, code snippet
- Docs site supports light/dark theme + compact/comfortable density (via ThemeProvider)
- Docs site is responsive (desktop sidebar → mobile drawer)
- Search components by name

## 3. Non-Goals

- No MDX/markdown pipeline — docs content is colocated as React components (simpler, type-safe)
- No versioning of docs
- No i18n (English only for now)
- No automated API extraction from TypeScript — props tables are hand-written per component (accurate, curated)
- No Storybook integration
- No P2/P3 components in this project

## 4. Anti-Goals

- Docs site must NOT feel like a generic template — it should demonstrate the library's design language
- Docs site must NOT use any component library other than enterprise-ui itself
- Docs site must NOT require a backend or build-time code generation

## 5. Constraints

- Monorepo: `apps/docs` is a new Vite workspace, consumes `@enterprise-ui/components` from `dist/`
- Components follow existing folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`
- CSS Modules only, design tokens via `var(--…)`, no hardcoded hex
- Zero runtime deps for components (react only)
- TypeScript strict, no `any`
- Vitest + Testing Library for component tests
- The docs site imports `@enterprise-ui/components/style.css` for tokens

## 6. Part A — Missing Components

### 6.1 Tabs

**Purpose:** Switch between panels of content (used in docs for Demo | Props | Code).

**API:**

```ts
interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}
interface TabsProps {
  items: TabItem[];
  activeKey?: string; // controlled
  defaultActiveKey?: string; // uncontrolled
  onChange?: (key: string) => void;
  size?: 'sm' | 'md';
}
```

**Behavior:**

- Horizontal tabs with underline indicator (blue-600)
- Keyboard: ArrowLeft/ArrowRight to move, Enter/Space to select
- `role=tablist`, `role=tab`, `role=tabpanel`, `aria-selected`
- Content area below tabs

### 6.2 Tooltip

**Purpose:** Show extra info on hover/focus (used for icon buttons, truncated text).

**API:**

```ts
interface TooltipProps {
  content: ReactNode;
  children: ReactElement; // single element
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number; // ms, default 200
}
```

**Behavior:**

- Show on hover + focus, hide on blur + mouse leave
- Position: absolute, arrow pointing to child
- `role=tooltip`, `aria-describedby` on child
- Max width 240px, text wraps

### 6.3 Empty

**Purpose:** Empty state placeholder (used in Table, List, DataGrid demos).

**API:**

```ts
interface EmptyProps {
  description?: string; // default "Không có dữ liệu"
  action?: ReactNode; // optional CTA button
  icon?: ReactNode; // optional custom icon
}
```

**Behavior:**

- Centered layout: icon (default: simple SVG box) + description + optional action
- Used inside Table/Grid when data is empty
- Can be used standalone

### 6.4 Spin

**Purpose:** Loading indicator (used in Table, Form, Button demos).

**API:**

```ts
interface SpinProps {
  size?: 'sm' | 'md' | 'lg';
  tip?: string; // optional text below spinner
  fullscreen?: boolean; // overlay entire page
}
```

**Behavior:**

- CSS animation spinner (border-based, blue-600)
- `role=status`, `aria-live=polite`
- Optional tip text below
- Fullscreen mode: fixed overlay with backdrop

## 7. Part B — Docs Site

### 7.1 Structure

```
apps/docs/
  package.json
  vite.config.ts
  index.html
  src/
    main.tsx
    App.tsx
    App.module.css
    components/
      DocsShell.tsx        // layout: sidebar + topbar + content
      DocsSidebar.tsx      // nav tree
      DocsTopbar.tsx       // search + theme toggle + density toggle
      PropsTable.tsx       // renders props from a config object
      CodeBlock.tsx        // syntax-highlighted code (simple, no lib)
      DemoPlayground.tsx   // wraps demo with theme/density controls
    pages/
      index.ts             // route registry
      primitives/
        ButtonPage.tsx
        InputPage.tsx
        SelectPage.tsx
        CheckboxPage.tsx
        BadgePage.tsx
        TabsPage.tsx
        TooltipPage.tsx
        EmptyPage.tsx
        SpinPage.tsx
      layout/
        AppShellPage.tsx
        PageHeaderPage.tsx
        SplitViewPage.tsx
        PaginationPage.tsx
      data/
        TablePage.tsx
        FilterBarPage.tsx
        KpiCardPage.tsx
        KpiGridPage.tsx
      feedback/
        ModalPage.tsx
        DrawerPage.tsx
        ToastPage.tsx
      form/
        FormPage.tsx
      tokens/
        TokensPage.tsx
```

### 7.2 Page Structure (per component)

Each component page follows this layout:

```
[Component Name]                    [Badge: P1]
[Short description paragraph]

[Demo]  ← Tabs: "Demo" | "Props" | "Code"
  ┌─────────────────────────────────────┐
  │  Live demo with controls            │
  │  (theme/density inherited from top) │
  └─────────────────────────────────────┘

[Props Table]
  | Prop | Type | Default | Description |
  |------|------|---------|-------------|

[Code Snippet]
  ┌─────────────────────────────────────┐
  │  import { Button } from '...'       │
  │  ...                                │
  └─────────────────────────────────────┘
```

### 7.3 Sidebar Navigation

Groups (collapsible):

- **Primitives**: Button, Input, Select, Checkbox, Badge, Tabs, Tooltip, Empty, Spin
- **Layout**: AppShell, PageHeader, SplitView, Pagination
- **Data**: Table, FilterBar, KpiCard, KpiGrid
- **Feedback**: Modal, Drawer, Toast
- **Form**: Form
- **Tokens**: Colors, Typography, Spacing

### 7.4 Topbar

- Left: hamburger (mobile) + logo "Enterprise UI"
- Center: search input (filters sidebar items)
- Right: theme toggle, density toggle, GitHub link (placeholder)

### 7.5 Routing

Simple state-based routing (no react-router):

- `App.tsx` holds `routeKey` state
- Sidebar `onNavigate` sets routeKey
- Content area renders matching page
- URL hash sync optional (nice-to-have, not required)

### 7.6 CodeBlock

Simple syntax highlighting without external lib:

- Pre-tokenize with regex for: keywords, strings, comments, numbers, JSX tags
- Render as `<span>` with CSS classes
- Copy button (Clipboard API)
- Language label (tsx/css)

### 7.7 PropsTable

Config-driven:

```ts
interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}
// Rendered as a Table component with columns: Prop | Type | Default | Description
```

### 7.8 DemoPlayground

Wraps each demo with:

- Optional controls (size, variant, etc.) — passed as props to demo
- Theme/density inherited from top-level ThemeProvider
- Consistent padding + border

## 8. Design Language for Docs Site

- Use the library's own design tokens (blue #1E47C4, orange #F97316)
- Sidebar: white bg, same as AppShell pattern
- Code blocks: dark bg (#0F172A) even in light mode (standard docs pattern)
- Typography: Inter, 14px body, 12px code
- Spacing: 16px base unit
- Radius: 6px for cards, 8px for code blocks

## 9. Implementation Order

1. **Tabs** (needed for docs page structure)
2. **Tooltip** (needed for icon buttons in docs)
3. **Empty** (needed for Table/Grid demos in docs)
4. **Spin** (needed for loading demos in docs)
5. **Showcase pages** for the 4 new components (Tabs, Tooltip, Empty, Spin)
6. **DocsShell + Sidebar + Topbar** (site skeleton)
7. **PropsTable + CodeBlock + DemoPlayground** (shared docs components)
8. **Component pages** (one by one, in order: Button → Input → Select → Checkbox → Badge → Tabs → Tooltip → Empty → Spin → AppShell → PageHeader → SplitView → Pagination → Table → FilterBar → KpiCard → KpiGrid → Modal → Drawer → Toast → Form → Tokens)
9. **Search** (filter sidebar)
10. **Polish** (responsive, mobile drawer, transitions)

## 10. Definition of Done

1. All 4 new components pass tests (render, interaction, keyboard, a11y)
2. Showcase has 4 new pages (Tabs, Tooltip, Empty, Spin) with live demos
3. Docs site builds and runs locally
4. Every component has a docs page with demo + props + code
5. Theme toggle works across all docs pages
6. Density toggle works across all docs pages
7. Responsive: sidebar collapses to drawer on mobile
8. Search filters sidebar navigation
9. No console errors or warnings
