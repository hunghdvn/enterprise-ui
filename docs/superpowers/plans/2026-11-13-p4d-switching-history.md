# P4d Switching & History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the P4d switching/history primitives — `SegmentedControl` and `Timeline` — with docs pages, closing the next post-P4a slice.

**Architecture:** Two independent presentational components in their own folders under `packages/components/src/`. `SegmentedControl` is a button-based `role="radiogroup"` with roving tabindex; `Timeline` is a semantic `<ol>` with decorative tone markers and a CSS connector. Both are exported from the package root with public types, documented by two Astro pages and demos, and use only existing tokens.

**Tech Stack:** React 18, TypeScript strict, CSS Modules with `var(--…)` tokens, Vitest + Testing Library (no user-event), Astro/Starlight docs, Vite.

**Spec:** `docs/superpowers/specs/2026-11-13-p4d-switching-history-design.md`

**Branch:** `feat/p4d-switching-history` from `main`.

## Global Constraints

- Zero runtime deps; TS strict, no `any`.
- CSS Modules + `var(--…)` tokens only — no hardcoded hex in components (repo-wide `css-conventions.test.ts`).
- Presentational only: data in via props, events out via callbacks; no fetching, no timers.
- Component folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`, re-exported from `packages/components/src/index.ts` (component **and** public types).
- Vitest globals are on (`test`/`expect`/`vi` need no import); only `@testing-library/react` helpers are imported.
- `data-size={size}` in a component requires both `[data-size='sm']` and `[data-size='md']` blocks in its module CSS.
- `data-size` selectors are scoped to the component root so an ancestor's `data-size` cannot leak in.
- Docs are Astro MDX under `apps/docs/src/content/docs/`; every fenced `tsx` block is typechecked by `npm run docs:snippets` and must be self-contained.
- Full gate before push: `npm test` → `npm --workspaces run typecheck --if-present` → `npm run docs:snippets` → `npm run lint` → `npm run format:check` → components/showcase/docs builds.
- Mutants: back up with `cp <file> <file>.bak`, apply the mutant, run the named test, restore with `cp <file>.bak <file>` — never `git checkout <file>`.

## Review Focus

- A controlled value that matches no option leaves every radio unchecked but keeps the first enabled option tabbable (no keyboard dead end).
- All options disabled, or the root `disabled`, blocks activation and leaves no tabbable option without crashing.
- Arrow keys wrap at both ends and skip disabled options, moving focus **and** selection together.
- `Timeline` with `dateTime` but no `time` renders no raw ISO string; empty `items` renders nothing.
- Long titles/time labels wrap inside the content column without pushing the marker/connector out of alignment.

Each line gets a named test in the task that owns the code.

---

### Task 1: `SegmentedControl`

**Files:**

- Create: `packages/components/src/SegmentedControl/types.ts`
- Create: `packages/components/src/SegmentedControl/SegmentedControl.tsx`
- Create: `packages/components/src/SegmentedControl/SegmentedControl.module.css`
- Create: `packages/components/src/SegmentedControl/index.ts`
- Create: `packages/components/src/SegmentedControl/SegmentedControl.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `Icon` from `../Icon`, `IconName` from `../Icon/types`, `cx` from `../internal/cx`.
- Produces:
  - `export type SegmentedControlSize = 'sm' | 'md'`
  - `export interface SegmentedControlItem { value: string; label: ReactNode; icon?: IconName; disabled?: boolean; 'aria-label'?: string }`
  - `export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'aria-label'> { items: readonly SegmentedControlItem[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; size?: SegmentedControlSize; disabled?: boolean; 'aria-label': string }`
  - `export function SegmentedControl(props: SegmentedControlProps): JSX.Element | null`
  - DOM: `<div role="radiogroup" aria-label data-size class="root"><button type="button" role="radio" aria-checked tabindex class="option">…</button></div>`.

- [ ] **Step 1: Write the failing tests**

Create `SegmentedControl.test.tsx` with these contracts (use `readFileSync` + `cssRule` for the CSS block):

```tsx
const items = [
  { value: 'list', label: 'Danh sách' },
  { value: 'grid', label: 'Lưới' },
  { value: 'table', label: 'Bảng' },
];

test('renders a named radiogroup with the first option checked', () => {
  render(<SegmentedControl aria-label="Chế độ xem" items={items} />);
  const group = screen.getByRole('radiogroup', { name: 'Chế độ xem' });
  expect(group).toHaveAttribute('data-size', 'md');
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('aria-checked', 'true');
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'false');
});

test('defaultValue selects a later option', () => {
  render(<SegmentedControl aria-label="Chế độ" items={items} defaultValue="grid" />);
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'true');
});

test('clicking selects and fires onChange once; clicking checked does not re-fire', () => {
  const onChange = vi.fn();
  render(<SegmentedControl aria-label="Chế độ" items={items} onChange={onChange} />);
  fireEvent.click(screen.getByRole('radio', { name: 'Lưới' }));
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'true');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenLastCalledWith('grid');
  fireEvent.click(screen.getByRole('radio', { name: 'Lưới' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('controlled value wins; a missing value keeps the first enabled option tabbable', () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <SegmentedControl aria-label="Chế độ" items={items} value="grid" onChange={onChange} />,
  );
  fireEvent.click(screen.getByRole('radio', { name: 'Danh sách' }));
  expect(onChange).toHaveBeenCalledWith('list');
  expect(screen.getByRole('radio', { name: 'Lưới' })).toHaveAttribute('aria-checked', 'true');

  rerender(<SegmentedControl aria-label="Chế độ" items={items} value="missing" />);
  for (const radio of screen.getAllByRole('radio')) {
    expect(radio).toHaveAttribute('aria-checked', 'false');
  }
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('tabindex', '0');
});

test('roving tabindex follows the checked option', () => {
  render(<SegmentedControl aria-label="Chế độ" items={items} />);
  fireEvent.click(screen.getByRole('radio', { name: 'Bảng' }));
  expect(screen.getByRole('radio', { name: 'Bảng' })).toHaveAttribute('tabindex', '0');
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toHaveAttribute('tabindex', '-1');
});

test('arrows move focus and selection, wrap, and skip disabled options', () => {
  const onChange = vi.fn();
  const mixed = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
    { value: 'c', label: 'C' },
  ];
  render(<SegmentedControl aria-label="Chế độ" items={mixed} onChange={onChange} />);
  const a = screen.getByRole('radio', { name: 'A' });
  a.focus();
  fireEvent.keyDown(a, { key: 'ArrowRight' });
  const c = screen.getByRole('radio', { name: 'C' });
  expect(c).toHaveAttribute('aria-checked', 'true');
  expect(document.activeElement).toBe(c);
  fireEvent.keyDown(c, { key: 'ArrowRight' });
  expect(a).toHaveAttribute('aria-checked', 'true');
  expect(document.activeElement).toBe(a);
  fireEvent.keyDown(a, { key: 'End' });
  expect(document.activeElement).toBe(c);
  fireEvent.keyDown(c, { key: 'Home' });
  expect(document.activeElement).toBe(a);
  fireEvent.keyDown(a, { key: 'ArrowLeft' });
  expect(document.activeElement).toBe(c);
});

test('disabled option and disabled root block activation', () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <SegmentedControl aria-label="Chế độ" items={items} onChange={onChange} />,
  );
  fireEvent.click(screen.getByRole('radio', { name: 'Lưới' }));
  expect(onChange).toHaveBeenCalledTimes(1);

  rerender(<SegmentedControl aria-label="Chế độ" items={items} onChange={onChange} disabled />);
  for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  fireEvent.click(screen.getByRole('radio', { name: 'Bảng' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('icons render and an item aria-label can name an icon-only option', () => {
  const { container } = render(
    <SegmentedControl
      aria-label="Chế độ"
      items={[
        { value: 'list', label: '', icon: 'layout-list', 'aria-label': 'Danh sách' },
        { value: 'grid', label: <span aria-hidden="true">Lưới</span>, icon: 'layout-grid' },
      ]}
    />,
  );
  expect(screen.getByRole('radio', { name: 'Danh sách' })).toBeInTheDocument();
  expect(container.querySelectorAll('svg')).toHaveLength(2);
});

test('className and rest land on the root; empty items renders nothing', () => {
  const { container } = render(
    <SegmentedControl aria-label="Chế độ" items={items} className="custom" id="view" />,
  );
  expect(container.querySelector('[role="radiogroup"]')).toHaveClass('custom');
  expect(container.querySelector('[role="radiogroup"]')).toHaveAttribute('id', 'view');

  const { container: empty } = render(<SegmentedControl aria-label="Chế độ" items={[]} />);
  expect(empty).toBeEmptyDOMElement();
});

test('module CSS pins the track, selected state, focus ring and sizes', () => {
  expect(cssRule(css, '.root')).toMatch(/display:\s*inline-flex/);
  expect(cssRule(css, '.root')).toMatch(/background:\s*var\(--surface-muted\)/);
  expect(cssRule(css, ".option[aria-checked='true']")).toMatch(/background:\s*var\(--surface\)/);
  expect(cssRule(css, ".option[aria-checked='true']")).toMatch(/box-shadow:\s*var\(--shadow-sm\)/);
  expect(cssRule(css, '.option:focus-visible')).toMatch(/outline:\s*2px solid var\(--focus-ring\)/);
  expect(cssRule(css, ".root[data-size='sm']")).toContain('--sc-height');
  expect(cssRule(css, ".root[data-size='md']")).toContain('--sc-height');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/SegmentedControl`
Expected: FAIL — `SegmentedControl`/module not found.

- [ ] **Step 3: Implement the types, component and CSS**

`types.ts` exactly as the Interfaces block. The component uses `useState` for the uncontrolled value (`defaultValue ?? items[0]?.value`), `useRef` for option buttons, `selectedIndex`/`enabledIndexes` derived per render, and the keyboard table in the spec. Clicking an item calls `onChange` only when `item.value !== currentValue`; arrow/Home/End call `focus()` on the target before selecting. Spread `...rest` on the root, then set `role="radiogroup"`, `data-size`, `className`.

CSS: root track from `--surface-muted` + `--border`; selected option `--surface` + `--shadow-sm` + weight 600; `--sc-height`, `--sc-pad`, `--sc-font` set by `.root[data-size='sm']`/`[data-size='md']`; `box-sizing: border-box`; focus ring; `:disabled` cursor/opacity.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/SegmentedControl`
Expected: PASS (all tests), no console errors.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/SegmentedControl packages/components/src/index.ts
git commit -m "feat(segmented-control): add radio-group mode switch"
```

---

### Task 2: `Timeline`

**Files:**

- Create: `packages/components/src/Timeline/types.ts`
- Create: `packages/components/src/Timeline/Timeline.tsx`
- Create: `packages/components/src/Timeline/Timeline.module.css`
- Create: `packages/components/src/Timeline/index.ts`
- Create: `packages/components/src/Timeline/Timeline.test.tsx`
- Modify: `packages/components/src/index.ts`

**Interfaces:**

- Consumes: `Icon` from `../Icon`, `IconName` from `../Icon/types`, `cx` from `../internal/cx`.
- Produces:
  - `export type TimelineTone = 'neutral' | 'blue' | 'green' | 'orange' | 'red'`
  - `export type TimelineSize = 'sm' | 'md'`
  - `export interface TimelineItem { id: string; title: ReactNode; description?: ReactNode; time?: ReactNode; dateTime?: string; tone?: TimelineTone; icon?: IconName }`
  - `export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> { items: readonly TimelineItem[]; size?: TimelineSize }`
  - `export function Timeline(props: TimelineProps): JSX.Element | null`
  - DOM: `<ol aria-label data-size class="root"><li data-tone class="item"><span class="marker" aria-hidden="true">…</span><div class="content">…</div></li></ol>`.

- [ ] **Step 1: Write the failing tests**

Create `Timeline.test.tsx` with these contracts:

```tsx
const items = [
  {
    id: 'created',
    title: 'Tạo đơn',
    description: 'Nguyễn An tạo đơn hàng.',
    time: '12/11/2026 · 09:15',
    dateTime: '2026-11-12T09:15:00+07:00',
    tone: 'blue' as const,
    icon: 'file-plus' as const,
  },
  {
    id: 'shipped',
    title: 'Đã giao',
    time: '13/11/2026 · 14:30',
    tone: 'green' as const,
  },
];

test('renders a named ordered list with one item per event', () => {
  render(<Timeline items={items} />);
  expect(screen.getByRole('list', { name: 'Dòng thời gian' })).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByText('Tạo đơn')).toBeInTheDocument();
  expect(screen.getByText('Nguyễn An tạo đơn hàng.')).toBeInTheDocument();
});

test('time renders a real <time> with dateTime; ISO alone is not dumped', () => {
  const { container } = render(
    <>
      <Timeline items={[items[0]]} />
      <Timeline items={[{ id: 'x', title: 'Không giờ', dateTime: '2026-11-12T09:15:00+07:00' }]} />
    </>,
  );
  const time = screen.getByText('12/11/2026 · 09:15').closest('time')!;
  expect(time).toHaveAttribute('datetime', '2026-11-12T09:15:00+07:00');
  expect(container.textContent).not.toContain('2026-11-12T09:15:00+07:00');
});

test('tone and icon land on the item; markers are decorative', () => {
  const { container } = render(<Timeline items={items} />);
  const [first, second] = screen.getAllByRole('listitem');
  expect(first).toHaveAttribute('data-tone', 'blue');
  expect(second).toHaveAttribute('data-tone', 'green');
  expect(first.querySelector('svg')).not.toBeNull();
  expect(second.querySelector('svg')).toBeNull();
  for (const marker of container.querySelectorAll('[aria-hidden="true"]')) {
    expect(marker.closest('li')).not.toBeNull();
  }
});

test('defaults to neutral and md, and rest/className land on the root', () => {
  const { container } = render(
    <Timeline items={[{ id: 'a', title: 'A' }]} className="custom" id="history" />,
  );
  const list = container.querySelector('ol')!;
  expect(list).toHaveAttribute('data-size', 'md');
  expect(list).toHaveAttribute('data-tone', undefined);
  expect(list).toHaveClass('custom');
  expect(list).toHaveAttribute('id', 'history');
  expect(screen.getByRole('listitem')).toHaveAttribute('data-tone', 'neutral');
});

test('size and custom aria-label apply to the list', () => {
  render(<Timeline items={items} size="sm" aria-label="Nhật ký" />);
  expect(screen.getByRole('list', { name: 'Nhật ký' })).toHaveAttribute('data-size', 'sm');
});

test('ReactNode title and description render; empty items renders nothing', () => {
  render(
    <Timeline
      items={[
        {
          id: 'a',
          title: <strong>Tiêu đề</strong>,
          description: <em>Mô tả</em>,
        },
      ]}
    />,
  );
  expect(screen.getByText('Tiêu đề').tagName).toBe('STRONG');
  expect(screen.getByText('Mô tả').tagName).toBe('EM');

  const { container } = render(<Timeline items={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('module CSS pins the list, connector, marker and tone/size rules', () => {
  expect(cssRule(css, '.root')).toMatch(/list-style:\s*none/);
  expect(cssRule(css, '.item')).toMatch(/grid-template-columns/);
  expect(cssRule(css, '.item:not(:last-child)::before')).toMatch(/background:\s*var\(--border\)/);
  expect(cssRule(css, '.marker')).toMatch(/border-radius:\s*999(px|9px)/);
  expect(cssRule(css, '.marker')).toMatch(/border:\s*1px solid currentColor/);
  for (const tone of ['blue', 'green', 'orange', 'red']) {
    expect(cssRule(css, `.item[data-tone='${tone}'] .marker`)).toMatch(/color:/);
  }
  expect(cssRule(css, ".root[data-size='sm']")).toContain('--tl-marker');
  expect(cssRule(css, ".root[data-size='md']")).toContain('--tl-marker');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Timeline`
Expected: FAIL — `Timeline`/module not found.

- [ ] **Step 3: Implement the types, component and CSS**

`types.ts` exactly as the Interfaces block. The component returns `null` for an empty list; otherwise renders `<ol {...rest} aria-label={ariaLabel ?? 'Dòng thời gian'} data-size={size}>`. Each `<li>` gets `data-tone={item.tone ?? 'neutral'}`. The marker is `<span aria-hidden="true">` containing `<Icon>` when `icon` is set, otherwise `<span className={styles.dot} />`. Render `<time dateTime={item.dateTime}>{item.time}</time>` only when `item.time != null`; render the description only when `item.description != null`.

CSS: reset the list; two-column item grid; connector `::before` on `:not(:last-child)`; hollow marker with `currentColor` border; tone rules; `sm`/`md` custom properties for marker size, gaps and font sizes; muted time with tabular numerals.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Timeline`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/Timeline packages/components/src/index.ts
git commit -m "feat(timeline): add ordered event history"
```

---

### Task 3: Docs, demos, index cards and sidebar

**Files:**

- Create: `apps/docs/src/components/demos/SegmentedControlDemo.tsx`
- Create: `apps/docs/src/components/demos/TimelineDemo.tsx`
- Create: `apps/docs/src/content/docs/components/segmented-control.mdx`
- Create: `apps/docs/src/content/docs/components/timeline.mdx`
- Modify: `apps/docs/src/content/docs/components.mdx`
- Modify: `apps/docs/astro.config.mjs`

**Interfaces:**

- Consumes: `SegmentedControl`/`Timeline` and their public types from `@enterprise-ui/components`; `styles` from `./demos.module.css`; `Icon` names already in the package.
- Produces: two live demos, two docs pages, two index cards and two sidebar entries.

- [ ] **Step 1: Write the demos**

`SegmentedControlDemo`: a controlled `view` switch with icons; a `size="sm"` uncontrolled range switch; a `size="md"` uncontrolled switch with one disabled option. `TimelineDemo`: a default-size order history with `blue`/`green`/`orange` tones and icons, plus a `size="sm"` system audit log with `neutral`/`red`.

- [ ] **Step 2: Write the MDX pages**

Both pages follow the existing component-page shape: frontmatter (`title`, `description`), `Demo` import, a short Vietnamese intro, a fenced `tsx` usage snippet, `## Props` tables, and `## Accessibility`. SegmentedControl also gets a "SegmentedControl vs Tabs vs RadioGroup" section. Timeline documents that `time`/`dateTime` are parent-formatted, markers are decorative, and tones must not be the only status cue.

- [ ] **Step 3: Add index cards and sidebar entries**

`components.mdx`: SegmentedControl under **Primitives** (after Tabs), Timeline under **Data** (after Steps). `astro.config.mjs`: the matching sidebar items.

- [ ] **Step 4: Verify docs snippets and pages render**

Run: `npm run docs:snippets`
Expected: `docs snippets ok`, no TS errors.

Run: `npm run build --workspace=@enterprise-ui/docs`
Expected: build completes with 50 pages.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/demos/SegmentedControlDemo.tsx apps/docs/src/components/demos/TimelineDemo.tsx apps/docs/src/content/docs/components/segmented-control.mdx apps/docs/src/content/docs/components/timeline.mdx apps/docs/src/content/docs/components.mdx apps/docs/astro.config.mjs
git commit -m "docs(p4d): add segmented control and timeline pages"
```

---

### Task 4: Full gate, mutation pass and PR

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all workspaces pass, including the new component tests and `css-conventions.test.ts`.

- [ ] **Step 2: Run typecheck, docs snippets, lint and format**

```bash
npm --workspaces run typecheck --if-present
npm run docs:snippets
npm run lint
npm run format:check
```

Expected: no TS errors, snippets ok, lint exit 0, Prettier clean.

- [ ] **Step 3: Build all three workspaces**

```bash
npm run build --workspace=@enterprise-ui/components
npm run build --workspace=@enterprise-ui/showcase
npm run build --workspace=@enterprise-ui/docs
```

Expected: components bundle under the 150 KiB limit, showcase built, docs built with 50 pages.

- [ ] **Step 4: Run the mutation pass**

Back up each file with `cp`, apply the mutants from the spec's testing section, run the named test, restore with `cp`. Every mutant must fail its test; record the results in the PR summary.

- [ ] **Step 5: Push and open the PR**

```bash
git push -u origin feat/p4d-switching-history
gh pr create --base main --head feat/p4d-switching-history --title "feat: add SegmentedControl and Timeline (P4d)" --body-file .superpowers/pr-p4d.md
```

Wait for CI (`gh pr checks --watch`), leave the PR open for the user to review/merge.
