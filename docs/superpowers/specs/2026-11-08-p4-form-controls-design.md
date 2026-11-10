# P4 Form Controls Design Spec (P4a — Radio/RadioGroup, Switch, Textarea)

Date: 2026-11-08
Status: Draft — scope chosen by the user ("cứ làm đi"); calls below are mine unless marked.
Base: `docs/superpowers/specs/2026-10-11-enterprise-ui-design.md` §4 (the P1 list names
"Checkbox/Radio/Switch"; only Checkbox shipped).
Related: `2026-11-07-settings-profile-design.md` explicitly deferred `Switch` and `Textarea`.

## 1. Intent & why

The P1 list promised "Checkbox/Radio/Switch", but the library only ever shipped
`Checkbox`. The Settings/Profile task then had to fake toggles with Checkbox and
skip multi-line input altogether. Every ERP form still needs:

- exclusive choice (radio) for mutually-exclusive options,
- an immediate on/off control (switch) for settings,
- multi-line text (textarea) for notes, reasons and descriptions.

Built by hand, each team re-derives label wiring, native radio grouping, focus
rings, disabled colour and dark/density behaviour. This slice closes the gap
with three presentational primitives.

`Radio` + `RadioGroup` are one family. `Switch` and `Textarea` are independent.

## 2. Goals / Non-goals

Goals:

- G1: `Radio` — labelled native `<input type="radio">`, same size and label
  contract as `Checkbox`.
- G2: `RadioGroup` — `<fieldset>`/`<legend>` with one shared `name`, controlled
  `value` **or** browser-uncontrolled grouping, `onChange(value)`, hint, error,
  orientation, size cascade, and `Form` error-map integration by `name`.
- G3: `Switch` — labelled `input[type=checkbox][role=switch]` with a tokenised
  track and thumb; controlled/uncontrolled, disabled, two sizes.
- G4: `Textarea` — multi-line counterpart of `Input` with the same `error`,
  `aria-invalid` and `aria-describedby` contract.
- G5: One docs page per component, each with a live demo, usage snippet, props
  table and accessibility notes; index cards in `components.mdx`.
- G6: Light/dark, compact/comfortable, keyboard, focus-visible and 4.5:1
  contrast hold.

Non-goals: validation, form state machines, auto-growing textarea, rich text,
tri-state switch, a switch "loading" state, per-option descriptions/radio cards,
a `Form`/`Field` rewrite, i18n framework.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only, no
hardcoded hex; presentational-only; folder layout `X.tsx + X.module.css +
types.ts + index.ts + X.test.tsx`; re-export the component **and** its public
types from `packages/components/src/index.ts`; Vitest globals on; docs pages are
`.mdx` under `apps/docs/src/content/docs/components/` and must pass
`docs:snippets`.

## 4. API

### 4.1 `Radio`

```ts
export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value'
> {
  /** Required: the value emitted by the group and submitted by the form. */
  value: string;
  /** Visible label text — the radio's accessible name. Required. */
  children: ReactNode;
  size?: 'sm' | 'md';
}

export function Radio(props: RadioProps): JSX.Element;
```

**Decision (mine): `value` is required.** Native radios default their value to
`"on"`, which would make `onChange` payloads meaningless and make two
value-less radios indistinguishable. Requiring `value` also makes every
`checked`/`defaultChecked` match explicit. Values must be unique inside a group;
the docs state it.

DOM contract: `<label data-size><input type="radio" class={box}>{children}</label>`.
Mirrors `Checkbox`: the label wraps the input, so the text and the control are one
click target, and the label text is the accessible name.

**Callback composition:** a Radio may carry its own native `onChange` while
inside a group. Both fire once per selection, in this order: the Radio's own
`onChange(event)` first, then the group's `onChange(value)`. Caller-first keeps
the native event observable before the group's value update.

### 4.2 `RadioGroup`

```ts
export interface RadioGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /** Visible group label. Always rendered as `<legend>`; required. */
  legend: ReactNode;
  /** Muted helper under the legend. */
  hint?: ReactNode;
  /** Error text. Explicit prop wins over `Form` `errors[name]`. */
  error?: string;
  /** Key into `Form` `errors`, and the `name` shared by the radios when set. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled; seeds the matching Radio. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Default `'vertical'`; `'horizontal'` wraps. */
  orientation?: 'vertical' | 'horizontal';
  /** Cascades to every descendant Radio; a per-radio `size` overrides it. */
  size?: 'sm' | 'md';
  required?: boolean;
  children: ReactNode;
}

export function RadioGroup(props: RadioGroupProps): JSX.Element;
```

DOM contract:

```html
<fieldset
  role="radiogroup"
  aria-labelledby="…legend…"
  data-size
  data-orientation
  aria-invalid?
  aria-required?
  aria-describedby?
>
  <legend id="…legend…">…<span aria-hidden>*</span></legend>
  <span class="hint" id="…">…</span>
  <div class="options">…radios…</div>
  <span class="error" role="alert" id="…">…</span>
</fieldset>
```

`id`/`className`/`aria-*`/`data-*` from the caller land on the `<fieldset>`.

**Decision (mine): `role="radiogroup"` + `aria-labelledby`.** A bare
`<fieldset>` maps to the ARIA role `group`, where `aria-required` is not
supported; `radiogroup` supports both `aria-required` and `aria-invalid`. The
fieldset keeps its visual `<legend>` and is named through
`aria-labelledby="<legend id>"`, so no second visible label is introduced.

**Decisions (mine):**

- **D1 — self-labelled.** `RadioGroup` renders its own `<legend>` and resolves
  `Form` errors itself. It is used directly inside `<Form>`, **not** wrapped in
  `Field`. `Field` keeps handling single controls. This avoids a duplicated
  visible label (label + legend) and a `<label for>` pointing at a fieldset,
  which is not a labelable element.
- **D2 — uncontrolled is native.** With no `value`, the group keeps no React
  state: same-`name` radios already uncheck each other in the browser.
  `defaultValue` is applied as `defaultChecked` on the matching `Radio`. A group
  with no `onChange` still works.
- **D3 — precedence inside a group.** `name`: Radio prop wins, else group `name`,
  else React-generated. `checked`: group `value` (when defined) wins; otherwise
  the Radio's own `checked`/`defaultChecked`; group `defaultValue` seeds only
  when the Radio sets neither.
- **D4 — `RadioGroup` `required`** adds the same orange `*` marker `Field` uses
  and sets `aria-required="true"` on the fieldset.
- **D5 — `size` cascade.** Group size reaches radios through context; a Radio
  that passes its own `size` keeps it.

### 4.3 `Switch`

```ts
export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Visible label text — the switch's accessible name. Required. */
  children: ReactNode;
  size?: 'sm' | 'md';
}

export function Switch(props: SwitchProps): JSX.Element;
```

DOM contract:

```html
<label data-size>
  <span class="control">
    <input type="checkbox" role="switch" class="input" />
    <span class="thumb" aria-hidden="true"></span>
  </span>
  {children}
</label>
```

**Decision (mine): D6 — native checkbox, not `<button>`.** A checkbox keeps
form submission, the label click target, Space/Enter behaviour and
`checked`/`defaultChecked`/`onChange` for free. `role="switch"` changes the
announced role; the native checked state supplies `aria-checked`.

### 4.4 `Textarea`

```ts
export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  size?: 'sm' | 'md';
  error?: string;
}

export function Textarea(props: TextareaProps): JSX.Element;
```

DOM contract: `<span class="wrap"><textarea data-size rows={3} aria-invalid?
aria-describedby?></textarea><span role="alert">error?</span></span>`.

**Decision (mine): D7 — no auto-grow.** `rows` defaults to 3 and CSS allows
vertical resize only. Auto-grow needs layout reads that jsdom cannot exercise
and that fight `resize`.

### 4.5 Composition with `Field`

`Checkbox`, `Radio` and `Switch` all wrap their input in a `<label>` and own
their label text. `Field` currently special-cases only `Checkbox`; any other
self-labelled child gets a second `<label for>`, which concatenates the two
texts into the accessible name (`form.mdx` warns about this today).

**Decision (mine): extend `Field`'s `selfLabelled` check to `Checkbox`,
`Radio` and `Switch`.** In that mode `Field` renders its label as a plain
`<span>` heading (not `for`), so it never contributes to the accessible name.
`RadioGroup` stays out of `Field`: it carries its own `<legend>` (D1).

Consequences:

- `<Field label="Kênh nhận"><Switch>Email</Switch></Field>` is valid: the
  heading names the group visually and the switch keeps its own name.
- `Radio`/`Switch` require `children`, so a bare `<Switch />` cannot ship an
  unnamed control through `Field`.
- `form.mdx` gains one paragraph about self-labelled controls.

## 5. Accessibility contract

- `RadioGroup` renders `<fieldset role="radiogroup" aria-labelledby="<legend id>">`;
  `legend` is required so no unnamed group can ship.
- Radios are labelled by adjacent text inside their `<label>`; no aria-label-only
  usage.
- The group's `error`/`hint` reach the fieldset through `aria-describedby`; an
  error also sets `aria-invalid="true"` on the fieldset. `required` sets
  `aria-required="true"` on the `radiogroup` (supported on that role, unlike
  `group`).
- `Switch` announces as a switch with a checked state; its visible label supplies
  the name; Space toggles it; focus ring follows the track.
- `Textarea` follows `Input`: `error` sets `aria-invalid`, appends its own id to
  `aria-describedby`, and renders `role="alert"`.
- Disabled states use the native `disabled` attribute and muted token colours.
- Focus: 2px `var(--focus-ring)` outline, offset preserved, visible on the
  control itself (not only the wrapper).

## 6. Visual & theme contract

- Colours come only from tokens: `--text`, `--text-muted`, `--border`,
  `--surface`, `--surface-muted`, `--on-primary`, `--danger`, `--focus-ring`.
- Radio and switch sizes reuse `--control-size-sm` / `--control-size` and
  `--font-size` / `--font-size-md`, matching Checkbox.

### 6.1 Switch contrast

The obvious pairing (white thumb on a `--color-blue-600` track) passes on a
light page but the checked track is only ~2.4:1 against the dark page, and a
`--surface` thumb on `--surface-muted` is ~1.1:1 in light mode. Two calls:

- **New token `--switch-track-on`.** `tokens.css` defaults it to
  `var(--color-blue-600)`; `theme-dark.css` overrides it to
  `var(--color-blue-500)` (~4.9:1 against the dark page, and the light track
  stays ≥3:1 against white).
- **Thumb is `var(--on-primary)` (white) with a 1px `var(--text-muted)` border**
  and `var(--shadow-sm)`. The border carries the knob boundary on the light
  off-track (~4.6:1); the white thumb stays ≥3:1 on the checked track in both
  themes.
- Off track: `--surface-muted` fill + 1px `--text-muted` border, so the control
  boundary is visible against both page backgrounds.
- Disabled: `--surface-muted` / `--border` / `--text-muted` (contrast exempt for
  disabled controls, but the state must still read as muted).

Switch geometry: 32×18 sm / 40×22 md, 999px radius, thumb 14/18px, 120ms
transform/background transition disabled under `prefers-reduced-motion: reduce`.
Horizontal radio groups wrap; textarea fills its container width.

## 7. Docs pages

Three new pages plus one demo each:

- `apps/docs/src/content/docs/components/radio.mdx` — documents `Radio` and
  `RadioGroup` together.
- `apps/docs/src/content/docs/components/switch.mdx`
- `apps/docs/src/content/docs/components/textarea.mdx`

Each page: frontmatter, a `<Demo>` island, one self-contained `tsx` snippet, a
props table, and accessibility notes. Add three cards to the Primitives grid in
`apps/docs/src/content/docs/components.mdx`.

Everything imported from `@enterprise-ui/components`, never deep imports.

## 8. Testing

Unit tests, per component:

`Radio`
- label text toggles the input (click the label, not only the input);
- `checked` + `onChange` controlled usage;
- `defaultChecked`;
- `disabled` blocks change;
- `size` variants set `data-size`;
- a Radio inside a group fires its own `onChange` first, then the group's, once
  each.

`RadioGroup`
- renders `fieldset` with `role="radiogroup"` named by its `<legend>`;
- shared generated `name` groups radios (selecting the second unchecks the first);
- two groups get different generated names;
- controlled `value` marks the matching radio and `onChange(value)` fires with the
  selected value;
- uncontrolled `defaultValue` checks the matching radio;
- `hint`/`error` wire `aria-describedby` on the fieldset; `error` sets
  `aria-invalid` and renders `role="alert"`;
- `Form` error map is read by `name`, and an explicit `error` wins;
- `required` renders the marker and `aria-required="true"` on the radiogroup;
- `orientation` and `size` land as `data-*`; a radio's own size overrides;
- clicking a radio inside a group calls the group `onChange` once.

`Switch`
- `getByRole('switch')` with `checked` state;
- controlled `checked` + `onChange`;
- `defaultChecked`;
- the input keeps `type="checkbox"`, so Space keeps working in the browser
  (jsdom has no keyboard default actions; the test pins the native input instead);
- label click toggles;
- `disabled` does not toggle;
- both sizes style the track (`data-size` + both CSS variants);
- the module reads `--switch-track-on` and the thumb reads `--on-primary` (no
  hardcoded hex).

`Textarea`
- renders a `<textarea>` with `rows=3` by default and a caller `rows`;
- controlled `value` + `onChange`;
- `error` sets `aria-invalid`, appends its id to `aria-describedby`, renders
  `role="alert"`;
- disabled;
- merges a caller `className` and keeps caller `aria-*`.

`Field` composition
- `Field` + `Switch` renders the heading as a `<span>` and does not point a
  second `<label for>` at the switch;
- `Field` + `Radio` does the same;
- `Field` + `Checkbox` behaviour is unchanged.

Tokens
- `--switch-track-on` exists in `tokens.css` and is overridden in
  `theme-dark.css`; `all.css` still bundles every theme file.

Mutant checks (each new guard gets a mutant):

1. RadioGroup drops the shared generated name → grouping test fails.
2. Controlled `value` comparison inverted → controlled test fails.
3. Group `onChange` not forwarded from Radio → callback test fails.
4. `Form` error lookup removed → error-map test fails.
5. Hint/error omitted from `aria-describedby` → wiring test fails.
6. Switch loses `role="switch"` → role test fails.
7. Thumb/track doesn't follow `checked` in CSS → CSS assertion fails.
8. Textarea `error` stops setting `aria-invalid` → test fails.
9. Textarea default `rows` removed → default test fails.
10. `size` cascade removed → override test fails.
11. `role="radiogroup"` / `aria-labelledby` removed → name/role test fails.
12. `aria-required` dropped from the radiogroup → required test fails.
13. Radio's own `onChange` dropped or reordered → composition test fails.
14. `Field` self-labelled list no longer includes Switch/Radio → double-label
    test fails.
15. `theme-dark.css` loses `--switch-track-on` → token test fails.

## 9. Backlog after this slice (not in this PR)

Written down so the phase has a shape; each future slice gets its own spec.

- **P4b Feedback:** `Alert` (inline info/success/warning/danger, optional
  dismiss), `Skeleton` (text/circle/rect, reduced motion), `Progress`.
- **P4c Identity & read-only detail:** `Avatar` (image/initials fallback),
  `Descriptions` (key/value detail pane, 1–3 columns).
- **P4d Switching & history:** `SegmentedControl` (roving tabindex,
  radio-group semantics), `Timeline`.
- **P4e Layout:** `Divider`, optional `Accordion`.

## 10. Deliverable

One PR: the three components, their tests, the three docs pages/demos, index
cards, and exports. Full gate before push; CI must be green.

## 11. Calls made while writing this (check these first)

An independent builder read the draft and raised five gaps; all were settled in
the document above rather than deferred:

1. `Radio.value` and `children`/`Switch.children` are required (no `"on"`
   fallback, no unnamed control).
2. `RadioGroup` uses `role="radiogroup"` + `aria-labelledby` so
   `aria-required`/`aria-invalid` are actually supported.
3. `Field` learns `Radio`/`Switch` as self-labelled, so no second `<label for>`
   concatenates into their names; `RadioGroup` stays out of `Field`.
4. Radio-in-group callbacks compose caller-first, group-second, once each.
5. Switch contrast needs the new `--switch-track-on` token (dark override) plus a
   bordered white thumb; details in §6.1.
