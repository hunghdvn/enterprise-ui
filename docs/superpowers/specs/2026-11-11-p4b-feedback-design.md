# P4b Feedback Design Spec (Alert, Skeleton, Progress)

Date: 2026-11-11
Status: Draft — scope chosen by the user ("cứ làm đi"); calls below are mine.
Base: `docs/superpowers/specs/2026-11-08-p4-form-controls-design.md` §9 (P4b).
Related: `2026-10-17-docs-site-design.md` feedback group; `2026-10-11-enterprise-ui-design.md`
§4 (P1 primitives) and §5 (A11y).

## 1. Intent & why

ERP screens constantly need three small feedback states that the library still
lacks:

- an inline message that stays in the page — validation summary, permission
  warning, “saved” confirmation;
- a loading placeholder that preserves layout while data arrives;
- a determinate progress bar for imports, exports and long saves.

Today every team builds these by hand, re-deriving tone colours, roles, reduced
motion and progress semantics. This slice ships the three primitives with the
same presentational contract as the rest of the library.

## 2. Goals / Non-goals

Goals:

- G1: `Alert` — inline info/success/warning/danger message, optional title,
  optional dismiss button; the parent owns visibility.
- G2: `Skeleton` — text/circle/rect placeholder with tokenised shimmer and a
  reduced-motion fallback.
- G3: `Progress` — determinate linear bar with label, optional percentage,
  two sizes, clamped values and progressbar semantics.
- G4: One docs page per component, each with a live demo, usage snippet, props
  table and accessibility notes; index cards and sidebar entries.
- G5: Light/dark, compact/comfortable, keyboard/focus-visible and contrast hold.
- G6: Public components and types exported from the package root.

Non-goals: toasts/notifications (already shipped), alert portals or auto-dismiss,
skeleton layout composition/`lines` sugar, circular or indeterminate progress,
progress animation choreography, validation or async state machines.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only, no
hardcoded hex; presentational-only; folder layout `X.tsx + X.module.css +
types.ts + index.ts + X.test.tsx`; re-export the component **and** its public
types from `packages/components/src/index.ts`; Vitest globals on; docs pages are
`.mdx` under `apps/docs/src/content/docs/components/` and must pass
`docs:snippets`.

## 4. API

### 4.1 `Alert`

```ts
export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visual and semantic tone. Default `'info'`. */
  tone?: AlertTone;
  /** Optional bold heading above the message. */
  title?: ReactNode;
  /** Message body. */
  children?: ReactNode;
  /** Shows the close button and fires when it is pressed. */
  onDismiss?: () => void;
  /** Accessible name for the close button. Default `'Đóng thông báo'`. */
  dismissLabel?: string;
}

export function Alert(props: AlertProps): JSX.Element;
```

**Decision (mine): the component never hides itself.** `onDismiss` only reports
the press; the parent removes the alert. A component that disappears on its own
cannot be controlled by a form state machine, and the same pattern already
exists in `Toast`.

**Role mapping (mine):** `danger` and `warning` render `role="alert"`;
`info` and `success` render `role="status"`. A warning is the kind of inline
message a user must hear immediately; a success message is not. Callers can
override `role` through `...rest` when their context differs.

DOM contract:

```html
<div role="alert|status" data-tone class="alert">
  <Icon aria-hidden="true" />
  <div class="body">
    <span class="title">…</span>
    <!-- when title -->
    <div class="message">…</div>
    <!-- when children -->
  </div>
  <button type="button" aria-label="Đóng thông báo">…</button>
  <!-- when onDismiss -->
</div>
```

Tone icon map: `info` → `info`, `success` → `check-circle`, `warning` →
`alert-triangle`, `danger` → `alert-circle`. Icons are decorative; the tone is
also carried by the title/message text.

Colour decisions (tokens only):

- info `var(--color-blue-500)` — ≥3:1 on both page backgrounds and theme-safe;
- success `var(--success)`;
- warning `var(--color-orange-600)`;
- danger `var(--danger-emphasis)` — the token the repo already uses for
  danger icons/borders on muted surfaces.

The surface stays `var(--surface)` with a 1px `var(--border)` and a 3px
tone-coloured left edge, matching `Toast` without turning a dense page into a
wall of tinted blocks. Dismiss button keeps the `--focus-ring` focus contract.

### 4.2 `Skeleton`

```ts
export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Shape. Default `'text'`. */
  variant?: SkeletonVariant;
  /** CSS width; numbers become px. */
  width?: CSSProperties['width'];
  /** CSS height; numbers become px. */
  height?: CSSProperties['height'];
}

export function Skeleton(props: SkeletonProps): JSX.Element;
```

**Decision (mine): one shape per instance, no `lines` prop.** A parent can
render several skeletons inside a text stack; baking line composition into the
primitive would duplicate the parent's layout decisions and make the accessible
tree harder to reason about.

DOM contract: `<span aria-hidden="true" data-variant class="skeleton" style=… />`.
`aria-hidden` is intentional and always set: a skeleton is a visual placeholder,
not content. The page must announce loading separately (`Spin`, `role="status"`,
or a live region); the docs state this.

Geometry:

- `text`: block, 100% width, `1em` high, `var(--radius)`;
- `circle`: inline-block, 32×32, 50% radius;
- `rect`: block, 100% wide, 80px high, `var(--radius)`.

Defaults live in CSS so `width`/`height` props are optional. Inline `style`
merges last, so a caller's `style` can override the props.

Shimmer: a two-token gradient between `var(--surface-muted)` and
`var(--border)`, `1.4s ease-in-out infinite`. `prefers-reduced-motion: reduce`
turns the animation off and paints a flat `--surface-muted` block.

### 4.3 `Progress`

```ts
export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value. Clamped to `0..max`. */
  value: number;
  /** Upper bound. Default `100`; non-positive/non-finite falls back to 100. */
  max?: number;
  /** Visible label above the bar; used as the progressbar's accessible name. */
  label?: ReactNode;
  /** Show the rounded percentage opposite the label. Default `false`. */
  showValue?: boolean;
  /** Track height. Default `'sm'`. */
  size?: 'sm' | 'md';
}

export function Progress(props: ProgressProps): JSX.Element;
```

**Decision (mine): determinate only.** Indeterminate work is already covered by
`Spin`; a bar with an unknown value has different semantics (`aria-valuenow`
must be absent) and would widen the API without a current consumer. This is a
non-goal for the slice.

**Decision (mine): `value` is clamped, not rejected.** A caller wiring a busy
import can briefly overshoot; clamping keeps the bar valid instead of throwing
or painting outside the track. Non-finite `value` becomes 0; non-positive
`max` falls back to 100. The percentage is rounded for display but the fill
width uses the exact ratio.

DOM contract:

```html
<div
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="40"
  aria-labelledby="…"
  data-size="sm"
  class="root"
>
  <div class="header">
    <span id="…">…</span>
    <span aria-hidden="true">40%</span>
  </div>
  <div class="track" aria-hidden="true">
    <div class="fill" style="width: 40%"></div>
  </div>
</div>
```

`aria-labelledby` is generated only when `label` is set; otherwise callers pass
`aria-label` through `...rest`. `showValue` text is `aria-hidden` because
`aria-valuenow` already carries the value. `aria-valuetext` remains available
through `...rest` for formatted values ("Bước 2/5").

Track heights: `sm` 4px, `md` 8px. Fill uses `var(--color-blue-600)` with
`var(--radius)`; dark theme keeps the brand fill (the bar is large enough that
the existing blue remains distinguishable).

## 5. Docs

Three new pages:

- `apps/docs/src/content/docs/components/alert.mdx`
- `apps/docs/src/content/docs/components/skeleton.mdx`
- `apps/docs/src/content/docs/components/progress.mdx`

Each page: live demo, a self-contained `tsx` usage snippet, props table, and
accessibility notes. Add cards to `components.mdx` under **Feedback** and
entries to `apps/docs/astro.config.mjs` in the same group. Demos live in
`apps/docs/src/components/demos/` and compile against the built package.

## 6. Testing strategy

Tests pin behaviour, not implementation:

- Alert: every tone renders the expected role and tone data; title/children
  compose; dismiss button only exists with `onDismiss`, is `type="button"`, has
  the default and custom accessible name, and calls back once; decorative icon
  is hidden; caller `role` wins.
- Skeleton: default variant and explicit variants; `aria-hidden`; width/height
  and caller `style`; CSS pins shimmer, both `prefers-reduced-motion` declarations
  and variant geometry.
- Progress: role/aria values, clamping low/high/non-finite, non-positive `max`,
  label linkage, `showValue` percentage, size data attribute, fill width, and
  caller `aria-label` fallback.

CSS conventions test must pass (no hex; `data-size` has both sm/md blocks).
Each new test is verified RED against a mutant before commit.

## 7. Backlog after this slice (not in this PR)

- **P4c Identity & read-only detail:** `Avatar` (image/initials fallback),
  `Descriptions` (key/value detail pane, 1–3 columns).
- **P4d Switching & history:** `SegmentedControl` (roving tabindex, radio-group
  semantics), `Timeline`.
- **P4e Layout:** `Divider`, optional `Accordion`.

## 8. Deliverable

One PR: the three components, their tests, three docs pages/demos, index cards,
sidebar entries and root exports. Full gate before push; CI must be green.
