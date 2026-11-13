# P4d Switching & History Design Spec (SegmentedControl, Timeline)

Date: 2026-11-13
Status: Draft — scope chosen by the user (`cứ làm`); calls below are mine.
Base: `docs/superpowers/specs/2026-11-08-p4-form-controls-design.md` §9 (P4d).
Related: `2026-11-11-p4c-identity-design.md` (folder/test/docs conventions);
`2026-11-11-p4b-feedback-design.md` and `2026-11-08-p4-form-controls-design.md`
(radio/tabs semantics); `2026-10-11-enterprise-ui-design.md` §5 (a11y).

## 1. Intent & why

Two everyday ERP interactions still have no primitive:

- **switching** — a compact one-of-N mode switch inside a toolbar or settings
  row ("Danh sách / Lưới / Bảng", "Ngày / Tuần / Tháng"). `Tabs` already has a
  segmented _look_, but it carries `tablist`/`tabpanel` semantics and content
  panels; teams that only want a value have to hand-roll a radio group or
  misuse `Tabs`. The result usually loses roving tabindex and arrow-key
  support.
- **history** — a chronological audit trail ("Tạo đơn", "Đã giao", "Hoàn
  tiền") with a connector line, a time marker and a status tone. Teams
  hand-roll the same `<ol>` plus absolute-positioned line, and the time markup
  is rarely a real `<time datetime>`.

P4d ships both as presentational primitives with the library's established
contract: data in via props, events out via callbacks, no fetching, tokens for
every colour.

## 2. Goals / Non-goals

Goals:

- G1: `SegmentedControl` — one-of-N switch with `role="radiogroup"`, roving
  tabindex, arrow/Home/End navigation, controlled and uncontrolled value,
  per-option and whole-control disabled states, optional icons, two sizes,
  and a required accessible group name.
- G2: `Timeline` — semantic ordered list of events with a vertical connector,
  tone/icon markers, pre-formatted time text plus optional machine-readable
  `dateTime`, title/description slots, two sizes.
- G3: One docs page per component with a live demo, self-contained usage
  snippet, props table and accessibility notes; index cards and sidebar
  entries.
- G4: Light/dark, compact/comfortable, keyboard and screen-reader behaviour
  hold; tones are never the only carrier of meaning.
- G5: Public components and types exported from the package root.

Non-goals: content panels or `tablist` semantics (`Tabs` owns those),
multi-select, native form submission (`name`/hidden inputs), generic value
types (values are strings like `Tabs` keys), icon-only options without an
accessible name, collapsible timeline groups, sticky date headers, horizontal
timelines, auto-scroll/"load more", clickable timeline rows, arbitrary
`ReactNode` markers, avatars inside markers, and relative-time formatting
(the parent owns the display string).

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only, no
hardcoded hex in components; presentational-only; folder layout `X.tsx +
X.module.css + types.ts + index.ts + X.test.tsx`; re-export the component
**and** its public types from `packages/components/src/index.ts`; Vitest
globals on; docs pages are `.mdx` under
`apps/docs/src/content/docs/components/` and must pass `docs:snippets`.
`data-size` selectors are scoped to the component root so an ancestor's
`data-size` cannot leak in. No new design tokens are required; both
components use the existing surface, border, text, action, status and shadow
tokens.

## 4. API

### 4.1 `SegmentedControl`

```ts
import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/types';

export type SegmentedControlSize = 'sm' | 'md';

export interface SegmentedControlItem {
  /** Unique value reported to `onChange`. */
  value: string;
  label: ReactNode;
  icon?: IconName;
  disabled?: boolean;
  /** Accessible name when `label` is not text (e.g. an icon-only option). */
  'aria-label'?: string;
}

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'aria-label'
> {
  items: readonly SegmentedControlItem[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled; defaults to the first option. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Default `'md'`. */
  size?: SegmentedControlSize;
  /** Disables every option. */
  disabled?: boolean;
  /** Required group name. */
  'aria-label': string;
}

export function SegmentedControl(props: SegmentedControlProps): JSX.Element | null;
```

DOM contract:

```html
<div role="radiogroup" aria-label="Chế độ xem" data-size="md" class="root">
  <button type="button" role="radio" aria-checked="true" tabindex="0" class="option">
    <svg aria-hidden="true">…</svg>
    <span class="label">Danh sách</span>
  </button>
  <button type="button" role="radio" aria-checked="false" tabindex="-1" class="option">…</button>
</div>
```

Decisions:

- **`aria-label` is required (mine).** A `radiogroup` without a name is
  unusable for screen-reader users, and a segmented control usually has no
  visible caption to borrow. `aria-labelledby` still passes through `...rest`
  and wins per ARIA, but the type keeps callers from forgetting a name.
- **Buttons with `role="radio"`, not native inputs (mine).** The control only
  reports a value; it is not submitted with a form. Buttons give the roving
  tabindex, `aria-checked` and arrow handling one implementation, matching
  `Tabs`. Native radios would add `name`/form behaviour the component does not
  promise.
- **Uncontrolled selection defaults to the first option (mine).** A mode switch
  needs a current mode; `Tabs` uses the same first-item default. An explicit
  `defaultValue` wins. A controlled `value` that matches no option leaves
  every option unchecked, and the first enabled option becomes the tab stop.
- **Clicking the checked option does not fire `onChange` (mine).** This matches
  a radio group: a selection event only happens when the value changes.
- **`items.length === 0` renders `null`.** An empty radiogroup is not a useful
  control; `Descriptions` uses the same empty contract.
- **`...rest` stays on the root; `role`, `data-size` and `className` are set by
  the component after the spread.** A caller can override `aria-label`/id but
  cannot accidentally drop the group role or size hook.

Keyboard contract (WAI-ARIA radio group):

| Key                        | Behaviour                                                                |
| -------------------------- | ------------------------------------------------------------------------ |
| `ArrowRight` / `ArrowDown` | Move focus to the next enabled option, select it, wrap at the end.       |
| `ArrowLeft` / `ArrowUp`    | Move focus to the previous enabled option, select it, wrap at the start. |
| `Home` / `End`             | Move focus to the first / last enabled option and select it.             |
| `Space` / `Enter`          | Native button activation selects the focused option.                     |

Disabled options are skipped by keyboard navigation and cannot be clicked.
If the whole control is disabled, every button gets `disabled`. All options
disabled means no option is tabbable.

### 4.2 `Timeline`

```ts
import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/types';

export type TimelineTone = 'neutral' | 'blue' | 'green' | 'orange' | 'red';
export type TimelineSize = 'sm' | 'md';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Pre-formatted display string, e.g. "12/11/2026 · 09:15". */
  time?: ReactNode;
  /** Machine-readable ISO value for `<time datetime>`. */
  dateTime?: string;
  /** Decorative marker tone; default `'neutral'`. */
  tone?: TimelineTone;
  /** Replaces the default dot with an icon. */
  icon?: IconName;
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  items: readonly TimelineItem[];
  /** Default `'md'`. */
  size?: TimelineSize;
}

export function Timeline(props: TimelineProps): JSX.Element | null;
```

DOM contract:

```html
<ol aria-label="Dòng thời gian" data-size="md" class="root">
  <li data-tone="green" class="item">
    <span class="marker" aria-hidden="true"><svg>…</svg></span>
    <div class="content">
      <div class="heading">
        <span class="title">Đã giao hàng</span>
        <time datetime="2026-11-12T09:15:00+07:00" class="time">12/11/2026 · 09:15</time>
      </div>
      <p class="description">Người nhận: Nguyễn An.</p>
    </div>
  </li>
</ol>
```

Decisions:

- **`time` is the display node, `dateTime` is the machine value (mine).**
  Parent-formatted text keeps the component free of locale/format decisions.
  A `<time>` renders only when `time` is present; `dateTime` is then attached
  when supplied. `dateTime` alone is ignored rather than dumped as visible
  text.
- **Markers are decorative (`aria-hidden`).** Tone and icon must not be the
  only carrier of status; the title/description carry the meaning. This is
  documented on the page.
- **The connector is a pseudo-element on every item except the last (mine).**
  Keeping it in CSS avoids empty DOM nodes and works with wrapped titles.
- **`items.length === 0` renders `null`,** matching `Descriptions`.
- **The default accessible name is `'Dòng thời gian'`,** matching `Steps`'s
  default `'Các bước'`; callers can override it.
- **`...rest` stays on the `<ol>`;** the default `aria-label` is applied only
  when the caller did not supply one.

## 5. Styling & tokens

`SegmentedControl`:

- root: `inline-flex`, 3px padding, 1px `--border`, pill radius,
  `--surface-muted` track, `box-sizing: border-box`;
- option: transparent, muted label, pill radius; selected option gets
  `--surface` + `--shadow-sm` + `--text` + weight 600; hover raises a muted
  label to `--text`; `:focus-visible` uses a 2px `--focus-ring` outline;
- heights derive from `--input-h` / `--input-h-lg` minus the 4px track inset,
  so a segmented control lines up with inputs at both densities;
- `sm`/`md` set height, horizontal padding and font size through custom
  properties on the root; both `[data-size='sm']` and `[data-size='md']`
  blocks exist (repo convention);
- no new token: the pair reuses the same colours as the `Tabs` segmented
  variant, so light/dark and compact/comfortable stay consistent.

`Timeline`:

- `<ol>` reset (`list-style: none`, no margin/padding); each item is a
  two-column grid (`marker | content`) with `position: relative`;
- the connector is a 2px `--border` line at the marker centre, from the
  marker to the item's bottom padding, hidden on `:last-child`;
- marker: hollow circle, `--surface` fill, 1px `currentColor` border, tone
  colour from the item:
  - `blue` → `--action-text` (blue-600 light / blue-200 dark),
  - `green` → `--success`,
  - `orange` → `--color-orange-600` (readable on both themes),
  - `red` → `--danger-emphasis` (red-600 light / red-400 dark),
  - `neutral` → `--text-muted`;
- default marker is an 8px dot; `icon` replaces it with a 12/14px `Icon`;
- title 600 weight; time muted, tabular numerals, wraps below the title on
  narrow panes; description muted with `overflow-wrap: anywhere`;
- `sm`/`md` control marker size, gaps and the title/body/time font sizes via
  root custom properties; both data-size blocks exist.

No component CSS contains a hex colour; the repo's `css-conventions.test.ts`
enforces it. Contrast targets: tone borders/dots are ≥3:1 against `--surface`
in both themes (blue-600 7.3:1 light / blue-200 9.6:1 dark; green 3.3:1 both;
orange-600 3.7:1 both; red-600 4.8:1 light / red-400 5.6:1 dark; muted
4.8:1 light / 4.6:1 dark). The hollow marker keeps the tone off large filled
areas, so dark-mode brand blue does not become an unreadable fill.

## 6. Accessibility

- `SegmentedControl` root is `role="radiogroup"` with a required name; options
  are `role="radio"` with `aria-checked`. Only the checked option (or the
  first enabled option when none is checked) has `tabindex="0"`.
- Arrow keys move focus **and** selection; Home/End jump to the ends; disabled
  options are skipped; the group wraps in both directions.
- `Timeline` is an `<ol>`/`<li>` list; every event is a list item, so screen
  readers announce position and count. The default name is `'Dòng thời gian'`.
- Timeline markers are `aria-hidden`; tones never carry information alone.
- Both components respect `prefers-reduced-motion` by having no non-essential
  animation (only a short colour/background transition on the segmented
  option, which is not required to understand state).

## 7. Testing

`SegmentedControl.test.tsx`:

- renders a named radiogroup, first option checked by default, `data-size` on
  the root;
- `defaultValue` selects a later option; controlled `value` wins and keeps the
  caller's selection while `onChange` still fires;
- clicking a new option selects it and fires `onChange` once; clicking the
  checked option does not fire again;
- a controlled value that matches nothing leaves all options unchecked and
  gives the first enabled option `tabindex="0"`;
- roving tabindex follows the checked option;
- ArrowRight/ArrowLeft/ArrowDown/ArrowUp wrap, skip disabled options, move
  focus and select; Home/End jump to first/last enabled;
- per-option and whole-control `disabled` block activation;
- icon options render an Icon; item `aria-label` names an icon-only option;
- `className`, `id` and other rest props land on the root;
- empty `items` renders nothing;
- module CSS pins: root track/radius, selected background/shadow, focus ring,
  and both size blocks.

`Timeline.test.tsx`:

- renders a named `<ol>` with one `<li>` per event, titles and descriptions;
- `time` renders a `<time datetime>` only when supplied; `dateTime` alone is
  not dumped as text;
- default tone is `neutral`, `tone` lands on the `<li>`, icons replace the
  dot, and markers are `aria-hidden`;
- `size`, `className`, `id` and rest props land on the root;
- empty `items` renders nothing;
- ReactNode titles/descriptions render;
- module CSS pins: list reset, marker/content grid, connector pseudo-element
  hidden on the last item, hollow marker, tone rules, and both size blocks.

Mutation pass: remove `role="radio"`, break `aria-checked`, force every
`tabindex="0"`, stop skipping disabled options, drop the selected-option CSS,
change the `<ol>` to a `<div>`, drop `dateTime`, remove the connector rule,
remove the tone rule, and remove the empty-list return. Each mutant must fail
its named test; backups use `cp`, never `git checkout`.

## 8. Docs & exports

- `apps/docs/src/content/docs/components/segmented-control.mdx` — live demo
  (controlled view switch, sizes, disabled option), usage snippet, props
  tables for `SegmentedControl` and `SegmentedControlItem`, accessibility and
  "SegmentedControl vs Tabs vs RadioGroup" notes.
- `apps/docs/src/content/docs/components/timeline.mdx` — live demo (order
  history with tones/icons, compact audit list), usage snippet, props tables
  for `Timeline` and `TimelineItem`, accessibility note that tone is
  decorative.
- New demos in `apps/docs/src/components/demos/`.
- Index cards in `apps/docs/src/content/docs/components.mdx`
  (SegmentedControl under Primitives, Timeline under Data).
- Sidebar entries in `apps/docs/astro.config.mjs` (SegmentedControl after
  Tabs, Timeline after Steps).
- Root exports in `packages/components/src/index.ts`, including
  `SegmentedControlItem`, `SegmentedControlSize`, `TimelineItem`,
  `TimelineSize`, `TimelineTone`.

## 9. Backlog after this slice (not in this PR)

- **P4e Layout:** `Divider`, optional `Accordion`.

## 10. Deliverable

One PR: the two components, their tests, two docs pages/demos, index cards,
sidebar entries and root exports. Full gate before push; CI must be green.

## 11. Calls made while writing this (check these first)

1. `SegmentedControl` requires `aria-label`; icon-only options require an
   item-level `aria-label`.
2. It uses buttons with `role="radio"`, not native inputs, and does not submit
   with forms.
3. Uncontrolled selection defaults to the first option; clicking the checked
   option does not re-fire `onChange`.
4. No new tokens: both components reuse surface/border/text/action/status
   tokens, with `--danger-emphasis` and `--color-orange-600` chosen for
   cross-theme contrast.
5. Timeline `time` is display text, `dateTime` is machine metadata; `dateTime`
   alone is ignored.
6. Timeline markers are hollow and decorative; status must be in the text.
7. Empty `items` renders `null` for both components.
8. Timeline is vertical only; horizontal/grouped/history-loading variants are
   out of scope.
