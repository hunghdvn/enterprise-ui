# P4e Layout Design Spec (P4e — Divider, Accordion)

Date: 2026-11-15
Status: Draft — scope chosen by the user ("cứ làm"); calls below are mine unless marked.
Base: `docs/superpowers/specs/2026-11-08-p4-form-controls-design.md` §9 (P4e names
`Divider`, optional `Accordion`).

## 1. Intent & why

P4 closes with the two layout primitives every ERP screen keeps rebuilding by hand:

- **`Divider`** — a horizontal rule, a vertical rule inside toolbars and split
  panes, and the labelled “Hoặc” rule between two auth actions. Today pages fake
  these with one-off `border-top` divs that drift in spacing and lose separator
  semantics.
- **`Accordion`** — collapsible sections for long settings forms, filters and
  FAQ/detail panes. Rebuilt with `useState` + ad-hoc headers each time, usually
  without `aria-expanded`/`aria-controls`, with duplicate DOM ids across
  instances, and with panels unmounted so form state disappears on collapse.

Both are presentational: data in through props, events out through `onChange`.
No fetching, no routing, no persistence.

## 2. Goals / Non-goals

Goals:

- G1: `Divider` — horizontal/vertical, optional horizontal label, three spacing
  steps, label alignment, native separator semantics.
- G2: `Accordion` — one or many open panels, controlled or uncontrolled,
  disabled items, two sizes, configurable heading level.
- G3: WAI-ARIA accordion semantics: button inside a heading, `aria-expanded`,
  `aria-controls`, persistent `role="region"` panels labelled by their trigger.
- G4: Keyboard support beyond Tab: Up/Down/Home/End move focus between enabled
  headers, skipping disabled ones and wrapping.
- G5: One docs page per component with live demos, snippets, props tables and
  accessibility notes; index cards in `components.mdx`; sidebar entries in the
  Layout group; root exports including public types.
- G6: Light/dark, compact/comfortable, focus-visible and AA contrast hold.

Non-goals: animated panel height, nested accordions, drag reorder, async/lazy
panel content, search inside an accordion, persistence of open state, native
`<details>`/`<summary>`, vertical divider labels, dividers with icons, extra
tones for dividers.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only, no
hardcoded hex; presentational-only; folder layout `X.tsx + X.module.css +
types.ts + index.ts + X.test.tsx`; re-export the component **and** its public
types from `packages/components/src/index.ts`; Vitest globals on; docs pages are
`.mdx` under `apps/docs/src/content/docs/components/` and must pass
`docs:snippets`. No new design tokens are required; both components use the
existing surface, border, text, action, focus and radius tokens.

## 4. API

### 4.1 `Divider`

```ts
import type { HTMLAttributes } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing = 'none' | 'sm' | 'md';
export type DividerAlign = 'start' | 'center' | 'end';

export interface DividerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Default `'horizontal'`. */
  orientation?: DividerOrientation;
  /** Optional centred label; horizontal only. An empty or whitespace-only string means no label. */
  label?: string;
  /** Spacing along the cross axis; default `'md'`. */
  spacing?: DividerSpacing;
  /** Label alignment for a labelled horizontal divider; default `'center'`. */
  align?: DividerAlign;
}

export function Divider(props: DividerProps): JSX.Element;
```

Decisions:

- **Two elements, one contract (mine).** An unlabelled horizontal divider is a
  native `<hr>`: it already carries the implicit `separator` role and needs no
  ARIA. A vertical divider cannot be an `<hr>` (that element is horizontal by
  definition), and a labelled horizontal divider needs children, which `<hr>`
  cannot have; both render a `<div role="separator" aria-orientation="…">`.
  The public props are identical.
- **`label` is a string, not `ReactNode` (mine).** The label becomes the
  separator's accessible name (`aria-label`), so it must be text. The visible
  span is `aria-hidden="true"` to avoid a double announcement. `label=""` and a
  whitespace-only label are treated as absent: neither can name the separator,
  and rendering a nameless `role="separator"` with an empty span would leave a
  24px gap in the line.
- **A label on a vertical divider is ignored (mine).** Vertical labels have no
  room in a 1px rule and would need a different layout contract; the docs say
  so. `align` is likewise ignored when there is no label.
- **Spacing is cross-axis only (mine).** Horizontal dividers get
  `margin-block`, vertical ones `margin-inline`; the inline size of a
  horizontal divider stays 100% and has no built-in max width.
- **A vertical divider needs a stretched parent.** `.root` sets
  `align-self: stretch` and `min-height: 1em`; inside a flex/grid row it takes
  the row height. Outside one it collapses to 1em, which the docs call out.
- **`...rest` and `className` land on the root element,** whichever of `<hr>`
  or `<div>` that is.

### 4.2 `Accordion`

```ts
import type { HTMLAttributes, ReactNode } from 'react';

export type AccordionSize = 'sm' | 'md';
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionItem {
  /** Stable identity for `key` and the controlled value. */
  id: string;
  /** Header content; rendered inside the trigger button, so no controls. */
  title: ReactNode;
  /** Panel content; may contain controls. */
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'children' | 'defaultValue' | 'value'
> {
  items: readonly AccordionItem[];
  /** Default `'md'`. */
  size?: AccordionSize;
  /** Heading wrapper level; default `3`. */
  headingLevel?: AccordionHeadingLevel;
}

export interface AccordionSingleProps extends AccordionBaseProps {
  multiple?: false;
  /** Controlled open item; `null` closes everything. */
  value?: string | null;
  /** Initial open item; default `null` (all closed). */
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  multiple: true;
  /** Controlled open items. */
  values?: readonly string[];
  /** Initial open items; default `[]`. */
  defaultValues?: readonly string[];
  onChange?: (values: string[]) => void;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export function Accordion(props: AccordionProps): JSX.Element | null;
```

> **Why the extra omits.** `HTMLAttributes` (React 18 types) declares
> `defaultValue?: string | number | readonly string[]`; extending it with our
> `defaultValue?: string | null` would not compile (TS2430). `'value'` is not
> declared there, but it is omitted for symmetry and to keep the union in
> control.

Decisions:

- **Single vs multiple is a discriminated union (mine).** `multiple` selects
  the controlled prop pair (`value`/`onChange(string | null)` vs
  `values`/`onChange(string[])`), so callers cannot pass `values` without
  `multiple` or get an array from single mode. Default is single.
- **All panels start closed in single mode (mine).** `defaultValue` is opt-in;
  an accordion is a disclosure list, not a tab set with a required selection.
- **`onChange` reports item-order ids (mine).** Multiple mode normalises the
  open set through `items`, so opening `b` then `a` still emits `['a', 'b']`.
  Unknown ids in `values`/`defaultValues` render nothing and are dropped from
  the next emission.
- **Controlled values win, even on disabled or missing items (mine).** A
  controlled `value` pointing at a disabled item still renders that panel open
  while its trigger stays disabled; the caller owns the value. A value with no
  matching item opens nothing. `null`/`[]` are valid controlled “all closed”
  values.
- **Dropping a controlled prop falls back to the last internal state (mine).**
  While controlled, internal state is deliberately not written, so removing
  `value`/`values` returns to the last internal state — equal to the mount seed
  when the component was controlled from mount, but the last uncontrolled state
  if it was uncontrolled first. This follows `Tabs`/`SegmentedControl` (not
  `Calendar`, which mirrors); the docs and the `types.ts` doc-comments state it.
- **Uncontrolled seeds skip disabled and unknown items (mine).** A
  `defaultValue`/`defaultValues` pointing at a disabled item is dropped at
  initialization; otherwise a disabled panel would be open with no click or
  keyboard path to close it (the `SegmentedControl` precedent). Unknown ids are
  dropped for the same reason. This filtering is initialization-only: a
  controlled value can still open a disabled panel, and an item that becomes
  disabled after mount keeps its current state. Separately, an uncontrolled id
  that disappears from `items` is pruned on the next render (before the empty
  list returns), so re-adding the item does not spring its panel open.
- **Duplicate item ids warn in development only (mine).** `item.id` is both the
  React key and the controlled value; duplicates make one value match two
  panels. Following `FileUpload`/`SavedViews`/`Combobox`/`NotificationCenter`,
  a dev-only `console.warn` names the duplicate (compiled away in production),
  and the docs still say the ids must be unique. A signature ref keeps it to
  one warning per id list, even when a caller inlines `items` and re-renders.
- **Panels persist and use `[hidden]` (mine).** Every panel is always mounted;
  collapsing only hides it, so form inputs and scroll state survive a toggle,
  and every `aria-controls` points at an existing node (same approach as
  `Tabs`). `role="region"` + `aria-labelledby` names each panel.
- **DOM ids are instance-scoped and index-based.** `useId()` plus the item
  index builds trigger/panel ids, so two accordions with the same item ids
  cannot collide and item ids with spaces still produce valid references.
  `item.id` stays the React key and the controlled value.
- **The trigger is a real `<button>` inside a real heading.** `headingLevel`
  defaults to `3` (the natural level under a page's `h2` section headings) and
  renders `h2`–`h6`. The trigger is the only thing in the heading; putting a
  link or button inside `title` would create nested interactive content, which
  the docs warn against.
- **Every trigger is tabbable.** Unlike `Tabs`, an accordion is not a single
  composite widget; Tab moves through headers naturally. Up/Down/Home/End are
  an optional enhancement that only moves focus, never toggles or selects.
  Disabled headers are skipped and the list wraps. The IME guard is
  `isComposing || keyCode === 229`, matching the rest of the library.
- **Item-level `disabled` disables only the trigger.** The panel can still be
  open through a controlled value; no click/keyboard path can toggle it.
- **`items=[]` renders `null`** after the hooks, matching `Timeline` and
  `SegmentedControl`.
- **No height animation (mine).** A `[hidden]` panel cannot animate; the only
  motion is the chevron rotation, disabled under `prefers-reduced-motion`.
- **The root does not clip overflow (mine).** `Tooltip` is the one popover in
  the library that positions itself absolutely (`Tooltip.module.css`); the
  others (`Combobox`, `SavedViews`, `NotificationCenter`, `DateRangePicker`)
  use inline `position: 'fixed'` and `Calendar` has no popover, so they are not
  affected either way. `overflow: hidden` on the accordion root would cut a
  `Tooltip` off at the card border. Rounded corners are instead applied to the
  first trigger's top corners, the last trigger's bottom corners when closed,
  and the last panel's bottom corners when open.

## 5. Styling & tokens

`Divider.module.css`:

- root: no border/margin, `flex: 0 0 auto`;
- horizontal: `width: 100%`, 1px `--border` top border;
- vertical: `width: 1px`, `align-self: stretch`, `min-height: 1em`,
  `--border` background;
- labelled horizontal: flex row, 12px gap, two 1px `--border` pseudo-element
  lines; `align="start"`/`"end"` shortens the line on that side to 24px;
- label: `--text`, 12px, `flex: 0 1 auto; min-width: 0` so a long label shrinks
  and wraps inside `container − 24px` (the two gaps; `− 48px` for
  `align="start"`/`"end"`, which also spend a fixed 24px stub) instead of
  overflowing;
- spacing: `none` 0, `sm` 8px, `md` 16px (`margin-block` horizontal /
  `margin-inline` vertical). `.root` carries `margin: 0`, so `none` really is
  zero.

`Accordion.module.css`:

- root: 1px `--border`, `--radius-lg`, `--surface` background; no `overflow:
hidden`, so a `Tooltip` inside a panel is not clipped — the first trigger gets
  the top corner radii, the last trigger gets the bottom radii while closed,
  and the last panel gets the bottom radii while open;
- items separated by a 1px `--border` top border;
- trigger: full-width flex, `--text` title, 600 weight, transparent background,
  inline padding only; height is `--input-h-lg` (`md`) or `--input-h` (`sm`), and
  the title is `--font-size-md` (`md`) or `--font-size` (`sm`) — the same fixed
  title ramp as `Tabs`/`SegmentedControl`, so only the height follows density;
  hover uses `--surface-muted`; `:focus-visible` uses an inset 2px `--focus-ring`
  outline (`outline-offset: -2px`) that stays on the rounded trigger surface;
- disabled trigger: `--text-muted`, `not-allowed` cursor, no hover fill
  (disabled controls are exempt from contrast minimums);
- chevron: `--text-muted`, rotates 180° when `aria-expanded="true"`, 150ms
  transition removed under reduced motion;
- panel: size-scaled inline/bottom padding, `--text` body copy, `line-height:
1.55`, `overflow-wrap: anywhere`; `[hidden]` explicitly `display: none`.

No component CSS contains a hex colour; the repo's `css-conventions.test.ts`
enforces it. Contrast targets: divider lines are decorative (`--border`, not a
meaningful UI boundary); the label is `--text` (17.85:1 light / 13.98:1 dark on
`--surface`, and 16.30:1 / 9.90:1 on `--surface-muted`, both AA; `--text-muted`
would be only 4.34:1 / 4.04:1 there); accordion titles are `--text`; disabled
titles are exempt.

## 6. Accessibility

- Unlabelled horizontal `Divider` is a native `<hr>` (implicit separator).
  Vertical and labelled horizontal dividers are
  `<div role="separator" aria-orientation="…">`; a labelled divider carries its
  text as the accessible name and hides the visible copy from AT.
- Dividers are never focusable and have no keyboard behaviour.
- `Accordion` follows the WAI-ARIA accordion pattern: each header is a
  `<button type="button">` inside an `h2`–`h6`, with `aria-expanded` and
  `aria-controls`; every panel is a `role="region"` labelled by its trigger and
  hidden with `[hidden]`.
- The heading level is explicit (`headingLevel`, default 3) because the right
  level depends on the page outline, not on the component.
- Tab reaches every enabled trigger and the contents of open panels. Up/Down
  move focus between enabled headers, Home/End jump to the first/last enabled
  header, and both wrap; disabled headers are skipped. Arrow keys never change
  the open state.
- `title` is inside the button, so it must not contain links/buttons/inputs;
  interactive content belongs in `content`. The docs page states this.
- Collapsing a panel that contains focus is out of scope (the trigger owns the
  toggle; focus stays on it).

## 7. Docs & integration

- `apps/docs/src/content/docs/components/divider.mdx` — horizontal, labelled,
  vertical-in-toolbar and spacing demos; usage snippet; props table; layout and
  a11y notes.
- `apps/docs/src/content/docs/components/accordion.mdx` — single, multiple,
  disabled, controlled and heading-level demos; usage snippets; props/item
  tables; state and a11y notes.
- Demos in `apps/docs/src/components/demos/DividerDemo.tsx` and
  `AccordionDemo.tsx`, using the shared `demos.module.css`.
- Index cards in `apps/docs/src/content/docs/components.mdx` (Layout group,
  after Pagination).
- Sidebar entries in `apps/docs/astro.config.mjs` (Layout group, after
  Pagination: Divider, then Accordion).
- Root exports from `packages/components/src/index.ts`, including
  `DividerAlign`, `DividerOrientation`, `DividerProps`, `DividerSpacing`,
  `AccordionHeadingLevel`, `AccordionItem`, `AccordionMultipleProps`,
  `AccordionProps`, `AccordionSingleProps`, `AccordionSize`.

## 8. Tests

`Divider.test.tsx`:

- default horizontal renders an `<hr>` with the `separator` role and no
  `aria-orientation` override;
- vertical renders a `<div role="separator" aria-orientation="vertical">`;
- `label` renders visible text, gives the separator that accessible name and
  hides the visible copy from AT; `label=""`, a whitespace-only label, and a
  non-string label from a JS caller all render a plain `<hr>` instead of
  throwing;
- a label on a vertical divider is ignored;
- `align` only lands on a labelled horizontal divider (including `end`);
  `spacing` lands on `data-spacing`, and no rule attaches a margin to
  `spacing="none"`;
- `className`, `id` and rest props land on the root;
- children are rejected at the type level (`@ts-expect-error`);
- module CSS pins: horizontal border, vertical width/background/stretch,
  labelled flex lines and both align overrides, the label's shrink
  (`flex: 0 1 auto; min-width: 0`) and `--text` colour, the root `margin: 0`,
  and the three spacing blocks.

`Accordion.test.tsx`:

- one `button` per item with `aria-expanded="false"`, `aria-controls` matching
  a present `role="region"` panel that is `hidden` and labelled by the button;
- clicking opens and closes a single panel; `onChange` gets the id then `null`;
- single mode closes the previously open item; multiple mode keeps both open,
  emits item-order ids, and closes an open panel when clicked again;
- controlled single/multiple values open exactly those panels and clicks only
  fire `onChange`; controlled multiple clicks still report the next values;
  `defaultValue`/`defaultValues` seed uncontrolled state, and dropping a
  controlled prop returns to the last internal state — the mount seed when
  controlled from mount (Tabs convention);
- unknown seeded ids open nothing; disabled seeded ids are skipped; a
  controlled value pointing at a disabled item opens it while its trigger stays
  disabled; an item that becomes disabled after mount keeps its open state;
- an uncontrolled id that leaves `items` (including via `items=[]`) is pruned,
  so a re-added item does not spring open;
- a disabled trigger cannot toggle;
- duplicate item ids log one dev-only warning per id-list signature, and stay
  silent when `DEV` is false;
- Up/Down/Home/End focus enabled triggers only, wrap in both directions, and
  ignore an IME keystroke;
- `headingLevel` defaults to `h3` and renders the requested `h2`–`h6`;
- collapsing keeps panel content mounted (input value survives);
- `items=[]` renders nothing;
- `data-size` lands on the root and switches the size block;
- `className`, `id` and rest props land on the root;
- children are rejected at the type level (`@ts-expect-error`);
- module CSS pins: border/radius/background (and no `overflow` clipping), item
  separators, first/last corner radii, trigger hover, focus ring, chevron
  rotation, reduced motion, panel padding, density-driven header height, both
  title sizes (`md` `--font-size-md`, `sm` `--font-size`), and both size blocks.

Mutation pass (backups via `cp`, never `git checkout`): drop the vertical
`aria-orientation`, use `<hr>` for vertical, drop the labelled divider's
`aria-label`, stop hiding the visible label, treat a whitespace-only label as
present, crash on a non-string label, attach a margin to `spacing="none"`, drop
each spacing rule, remove the root `margin: 0`, make the label unable to shrink,
revert the label to `--text-muted`, drop the `end` align rule, make the accordion
emit raw click order instead of item order, never close a multiple panel, skip
`onChange` for controlled multiple, write internal state while controlled
multiple, share one panel id across items, drop `aria-expanded`, drop
`aria-controls`, unmount panels instead of hiding, stop skipping disabled
headers, make ArrowUp move down, drop the IME guard, keep disabled seeded ids,
skip the uncontrolled prune, prune items that become disabled, re-warn on every
render, drop the `DEV` guard, drop the density header height, drop the `sm` or
`md` title ramp, add `overflow: hidden` back to the root, remove the
`aria-expanded` chevron rule, remove the focus ring, remove the reduced-motion
block, and remove the empty-list return. Each mutant must fail its named test.

## 9. Backlog after this slice (not in this PR)

P4e completes the P4 roadmap. No further slice is committed; candidates that
would need their own spec include a rich text editor, a data-grid upgrade and a
date/time picker. None are implied by this PR.

## 10. Deliverable

One PR: the two components, their tests, two docs pages/demos, index cards,
sidebar entries and root exports. Full gate before push; CI must be green.

## 11. Calls made while writing this (check these first)

1. `Divider` uses `<hr>` only for the unlabelled horizontal case; vertical and
   labelled variants use `<div role="separator">`.
2. `Divider.label` is a string because it becomes the accessible name; a
   vertical label is ignored.
3. `Accordion` defaults to single, all closed; `multiple` is a discriminated
   union with `values`/`onChange(ids)`. Uncontrolled seeds skip disabled and
   unknown ids; controlled values win.
4. Panels stay mounted behind `[hidden]`; ids are instance-scoped by
   `useId` + index. The root does not clip, so popovers inside panels work.
5. `headingLevel` defaults to 3; arrow keys move focus only. Duplicate item ids
   warn in development only.
