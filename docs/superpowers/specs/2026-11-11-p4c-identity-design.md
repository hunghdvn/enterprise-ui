# P4c Identity & Read-only Detail Design Spec (Avatar, Descriptions)

Date: 2026-11-11
Status: Draft — scope chosen by the user ("cứ làm đi"); calls below are mine.
Base: `docs/superpowers/specs/2026-11-08-p4-form-controls-design.md` §9 (P4c).
Related: `2026-11-11-p4b-feedback-design.md` (folder/test conventions);
`2026-10-11-enterprise-ui-design.md` §4 (P1 primitives) and §5 (A11y);
`2026-10-17-docs-site-design.md`.

## 1. Intent & why

Two everyday ERP needs still have no primitive:

- **who** — a person/team badge beside a row, card or comment, with an image
  and a deterministic initials fallback when the image is missing or breaks;
- **what** — a read-only key/value block for a detail pane ("Mã đơn",
  "Ngày tạo", "Người phụ trách") that stays readable at 1–3 columns.

Teams currently hand-roll both: ad-hoc `<img onError>` state, initials slicing
that mishandles Vietnamese names, and one-off `<dl>` layouts with inconsistent
label colours. P4c ships the two primitives with the same presentational
contract as the rest of the library.

## 2. Goals / Non-goals

Goals:

- G1: `Avatar` — circular identity mark; image when `src` loads, initials
  fallback otherwise; accessible name from `name`; explicit decorative mode;
  three sizes.
- G2: `Descriptions` — semantic `<dl>` key/value pane, 1–3 columns,
  horizontal/vertical label layout, optional cell borders, two text sizes.
- G3: One docs page per component with a live demo, self-contained usage
  snippet, props table and accessibility notes; index cards and sidebar entries.
- G4: Light/dark, compact/comfortable, contrast and semantic structure hold.
- G5: Public components and types exported from the package root.

Non-goals: avatar groups/overflow counters, presence/status dots, upload or
cropping, image caching/proxying, clickable avatars (the caller wraps them in a
button/link), `Descriptions` editing, collapsible sections, tooltips or
responsive column choreography beyond the documented one-column collapse.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only, no
hardcoded hex in components; presentational-only; folder layout `X.tsx +
X.module.css + types.ts + index.ts + X.test.tsx`; re-export the component
**and** its public types from `packages/components/src/index.ts`; Vitest
globals on; docs pages are `.mdx` under
`apps/docs/src/content/docs/components/` and must pass `docs:snippets`.
`data-size` styles are scoped to the component root so an ancestor's
`data-size` cannot leak in (the bug class fixed for Radio and Progress).

## 4. API

### 4.1 `Avatar`

```ts
export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Person's display name; required. Drives the initials fallback. */
  name: string;
  /** Image URL. When absent or the image fails, initials render instead. */
  src?: string;
  /**
   * Accessible name for the image. Defaults to `name`.
   * Pass `''` when the name is already visible next to the avatar: the whole
   * mark becomes decorative (`aria-hidden`, no `role`).
   */
  alt?: string;
  /** Diameter. Default `'md'`. */
  size?: AvatarSize;
}

export function Avatar(props: AvatarProps): JSX.Element;
```

**Decision (mine): `name` is required.** An avatar without a name has no
initials and no accessible name; accepting it would produce an anonymous image
role. Callers already have the person's name at the call site.

**Decision (mine): `alt=""` is the decorative switch.** It reuses the HTML
convention instead of adding a boolean prop: an avatar next to the visible
name should be hidden from the accessibility tree, and that is exactly what an
empty `alt` means for images. Any other `alt` overrides the label.

DOM contract — image:

```html
<span class="avatar" data-size="md" role="img" aria-label="Nguyễn An">
  <img class="image" src="…" alt="" aria-hidden="true" />
</span>
```

DOM contract — initials / failed image:

```html
<span class="avatar" data-size="md" role="img" aria-label="Nguyễn An">
  <span class="initials" aria-hidden="true">NA</span>
</span>
```

Decorative mode drops `role`/`aria-label` and adds `aria-hidden="true"`.
The inner image always carries `alt=""` and `aria-hidden="true"` because the
root `role="img"` owns the name; leaving a second name on the nested image
would duplicate it for screen readers.

**Spread order (mine): `...rest` goes last, matching `Alert`/`Progress`.** A
caller can override `role`/`aria-label` on the root; `alt` remains the
dedicated shorthand. The internal `onError` sits on the inner `<img>`, while a
caller `onError` through `...rest` lands on the root `<span>` — the two do not
collide and the fallback cannot be disabled by accident.

Initials algorithm:

- split on whitespace; drop empty tokens;
- one token → its first code point; two or more → first code point of the
  first and last token;
- `Array.from` (code points, not UTF-16 units) then `toUpperCase()`;
- empty/whitespace-only name → `'?'`, and the same `'?'` becomes the
  accessible name when `alt` is omitted (a `role="img"` must never end up
  with an empty label).

Image failure: keep the failed `src` in state (`failedSrc`), and show the
image only when `src` is set and `failedSrc !== src`. That makes a new `src`
render immediately without an effect, and a later failure of the same URL
stays on initials. `onError` is internal; no event is exposed.

SSR reconciliation (review fix): under island hydration the `<img>` is in the
server HTML, so the browser can fail it before React hydrates — and React does
not replay load/error events on hydration. On mount and on every `src` change,
an effect checks the live node (`image.complete && image.naturalWidth === 0`)
and records the failed `src`, so a pre-failed URL still shows initials. The
check reads the DOM, not synthetic events, so it works for cached failures and
never fires a false positive for a still-loading image (`complete` is false).

Sizes: `sm` 24×24, `md` 32×32, `lg` 48×48. Default `md`. Text scales with
the diameter (10/12/16px). The mark is `border-radius: 50%`,
`overflow: hidden`, and uses only tokens:

- initials: `background: var(--avatar-bg)`, `color: var(--avatar-text)`;
- a 1px inset `var(--border)` ring defines the edge on both themes;
- image: `object-fit: cover`, full size.

New tokens (with `theme-light` resets so a light subtree inside a dark page
keeps the light pair and `theme-dark` overrides):

| Token           | Root / light            | Dark                    |
| --------------- | ----------------------- | ----------------------- |
| `--avatar-bg`   | `var(--color-blue-100)` | `var(--color-blue-800)` |
| `--avatar-text` | `var(--color-blue-800)` | `var(--color-blue-100)` |

Both pairs are ≈8:1; the dark pair flips the same two blues, so no new colour
values enter the system.

### 4.2 `Descriptions`

```ts
export type DescriptionsColumns = 1 | 2 | 3;
export type DescriptionsLayout = 'horizontal' | 'vertical';
export type DescriptionsSize = 'sm' | 'md';

export interface DescriptionItem {
  /** Term rendered in `<dt>`. */
  label: ReactNode;
  /** Value rendered in `<dd>`. */
  value: ReactNode;
  /** Grid columns to span, clamped to `1..columns`. Default `1`. */
  span?: number;
}

export interface DescriptionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items: DescriptionItem[];
  /** Grid columns. Default `2`. */
  columns?: DescriptionsColumns;
  /** Label beside (`horizontal`) or above (`vertical`) the value. Default `'horizontal'`. */
  layout?: DescriptionsLayout;
  /** Cell dividers around the grid. Default `false`. */
  bordered?: boolean;
  /** Text scale. Default `'md'`. */
  size?: DescriptionsSize;
}

export function Descriptions(props: DescriptionsProps): JSX.Element;
```

**Decision (mine): an `items` array, not compound children.** The pane is
data, like `Table`/`Tabs`; an array keeps label/value pairing impossible to
get wrong and lets `span` live beside its row. React keys come from the index
(the list is presentational and order-stable).

**Decision (mine): no built-in `title`.** Detail panes are already under a
`PageHeader`/section heading; baking another heading in would create heading
order bugs and duplicate the caller's title. The demo shows a heading above
the component.

**Decision (mine): empty `items` renders nothing.** An empty `<dl>` is a
zero-height box that looks like a rendering bug. Hiding it matches `Table`'s
empty handling being the caller's responsibility, and the docs say so.

**Decision (mine): `span` is clamped, not rejected.** A generated layout may
compute a span larger than the current column count; clamping keeps the grid
valid. Non-finite or `< 1` becomes 1, fractions are truncated.

DOM contract:

```html
<div class="root" data-size="md">
  <dl class="list" data-columns="2" data-layout="horizontal" data-bordered="true">
    <div class="item" style="--desc-span: 2">
      <dt class="label">Email</dt>
      <dd class="value">an@example.com</dd>
    </div>
  </dl>
</div>
```

`data-bordered` is only present when `bordered` is true. `--desc-span` is set
on each item and consumed by CSS (`grid-column: span var(--desc-span, 1)`);
the mobile rule switches `grid-column` back to `auto`, which an inline
`grid-column` could not override. `style` from `...rest` stays on the root.

Semantics: `<dl>` + `<dt>`/`<dd>` with the HTML5 `div` wrapper per pair. The
`<dl>` carries no ARIA role — native description-list semantics are the point.
The root `<div>` gets `role="group"` **only** when the caller passes
`aria-label` or `aria-labelledby` (review fix: a bare `div` exposes no name, so
an `aria-label` there would be inert). `...rest` spreads last, so a caller's
explicit `role` still wins.

CSS:

- grid `gap: 12px 24px`; `data-columns='1' | '2' | '3'` set
  `minmax(0, 1fr)` / `repeat(2, …)` / `repeat(3, …)`;
- `horizontal`: each item is a two-column grid
  (`minmax(96px, 140px) minmax(0, 1fr)`), so labels align down the pane;
- `vertical`: label above value;
- `bordered`: `gap: 0`, outer top/left border plus right/bottom per cell;
- `@media (max-width: 640px)`: the list collapses to one column and
  horizontal items stack their label; selectors repeat the `[data-columns]` /
  `[data-layout='horizontal'] .item` specificity so the later rule wins;
- labels use `var(--text-muted)` (≥4.5:1 both themes), values `var(--text)`;
- `size` selectors are scoped `.root[data-size='sm'|'md']`; `sm` is
  11px label / 12px value, `md` is 12px label / `var(--font-size)` value.

## 5. Docs

Two new pages:

- `apps/docs/src/content/docs/components/avatar.mdx`
- `apps/docs/src/content/docs/components/descriptions.mdx`

Each page: live demo, a self-contained `tsx` usage snippet, props table and
accessibility notes. Add cards to `components.mdx` (**Avatar** under
Primitives, **Descriptions** under Data) and entries to
`apps/docs/astro.config.mjs` in the same groups. Demos live in
`apps/docs/src/components/demos/` and compile against the built package.

Avatar docs must cover: initials derivation, the `name` requirement, the
`alt=""` decorative rule, the image-failure fallback, and that the caller
supplies interaction (link/button) and any presence indicator. The demo uses
self-contained data URIs — a small inline SVG for the loaded image and an
invalid image payload for the failure state — so it needs no network and no
new public assets.
Descriptions docs must cover: `dl` semantics, the 1–3 column grid, the
one-column mobile collapse, empty `items`, and that values are caller-owned
(links/buttons inside `value` are fine).

## 6. Testing strategy

Tests pin behaviour, not implementation:

- Avatar: image + accessible name; `img` is `alt=""`/`aria-hidden`;
  multi-word and single-word initials (Vietnamese); whitespace name → `?`;
  image error → initials; new `src` restores the image; `alt` override;
  `alt=""` decorative mode (no role, `aria-hidden`); default and explicit
  sizes; rest/className land on root; CSS pins sizes, cover, ring, scoped
  selectors.
- Descriptions: one `dt`/`dd` per item; default and explicit `columns`;
  default and explicit `layout`; `--desc-span` and clamping (5 → columns,
  0/NaN → 1); `data-bordered` only when true; default and explicit `size`;
  empty `items` renders nothing; rest/className land on root; CSS pins the
  three column templates, scoped size selectors, the mobile collapse and the
  bordered rules.
- Tokens: root/light/dark guards for `--avatar-bg` and `--avatar-text`.
- `css-conventions.test.ts` must pass (no hex; every `data-size` component
  styles both `sm` and `md`).

Each new guard is verified RED against a mutant before commit. Mutants use a
`cp` backup/restore, never `git checkout`.

## 7. Backlog after this slice (not in this PR)

- **P4d Switching & history:** `SegmentedControl` (roving tabindex,
  radio-group semantics), `Timeline`.
- **P4e Layout:** `Divider`, optional `Accordion`.

## 8. Deliverable

One PR: the two components, their tests, two docs pages/demos, index cards,
sidebar entries, token additions and root exports. Full gate before push; CI
must be green.
