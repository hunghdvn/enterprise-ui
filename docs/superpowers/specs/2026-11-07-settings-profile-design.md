# Settings/Profile Design Spec (P3 — Settings/Profile)

Date: 2026-11-07
Status: Draft — scope chosen by the user ("cứ làm", defaults below stated as my calls)
Base: `docs/superpowers/specs/2026-10-11-enterprise-ui-design.md` (P3 templates)
Siblings: `2026-11-06-auth-design.md` (AuthLayout + LoginForm), `2026-11-06-error-page-design.md`

## 1. Intent & why

The P3 list ends with "Settings/Profile", the screen every ERP app has and no
template covers yet. A settings screen is not one form: it is a page that
switches between several independent forms (personal info, notifications,
security) while keeping one header and one navigation rail. Built by hand, each
team re-invents the rail, the responsive breakpoint, the pane semantics and the
save/cancel footer — and gets the "one `<main>`", "named region", or
"hidden pane keeps its state" details wrong.

The template stays presentational: it renders slots and emits values. It never
validates, never fetches, never persists, and never decides which sections
exist.

## 2. Goals / Non-goals

Goals:

- G1: `SettingsProfile` — page-level layout: title/subtitle, optional header
  actions, a section nav (rail when wide, horizontal scroller when narrow), and
  one named `<section>` pane per section, each titled by its own heading.
- G2: `ProfileForm` — controlled personal-info form composed from `Form`,
  `Field`, `Input`, `Button`; emits the whole next value and the submitted
  values; avatar slot.
- G3: Docs page `SettingsPage.tsx` with the two components composed into a
  realistic three-section screen (personal info, notifications, security).
- G4: Light/dark, compact/comfortable, keyboard, focus-visible and 4.5:1
  contrast hold; panes that are not active stay in the DOM with `hidden`, so
  half-typed values survive a section switch but leave the tab order.
- G5: No third copy of the AuthLayout/ErrorPage `as`/`fill`/`min-height`
  plumbing — see §4.1.

Non-goals: validation, persistence, fetching, routing, avatar upload, password
change flow, 2FA, session management, org-unit pickers, a `Textarea` primitive,
a `Switch` primitive (the notifications demo uses `Checkbox`), `Modal` wiring
(the security demo uses a two-step inline confirm), charts, autosave/dirty
tracking, i18n framework.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only, no
hardcoded hex; presentational-only; folder layout `X.tsx + X.module.css +
types.ts + index.ts + X.test.tsx`; re-export the component **and** its public
types from `packages/components/src/index.ts`; Vitest globals on; docs pages
`export default`, exactly one `const code = \`…\`;`, no nested backticks.

## 4. API

```ts
// SettingsProfile
export interface SettingsSection {
  /** Stable id used by `activeKey` / `onSectionChange`. */
  key: string;
  /** Nav label; also the heading text of the pane. */
  label: string;
  /** Muted line under the pane heading. */
  description?: ReactNode;
  /** Pane body: a form, a group of toggles, a danger zone. */
  content: ReactNode;
}

export interface SettingsProfileProps {
  /**
   * Wrapper element; default `main`. Keep `main` inside AppShell — its content area
   * is a `div`, so the page would otherwise lose its main landmark. Use `div` only
   * when an ancestor already renders `<main>`.
   */
  as?: 'main' | 'div' | 'section';
  /** Page heading; default 'Cài đặt'. */
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Header actions (invite, export, audit log). */
  actions?: ReactNode;
  sections: SettingsSection[];
  /** Controlled active section; omit for uncontrolled. */
  activeKey?: string;
  /** Initial section when uncontrolled; defaults to the first section. */
  defaultActiveKey?: string;
  onSectionChange?: (key: string) => void;
  /** Accessible name for the section nav landmark; default 'Mục cài đặt'. */
  navLabel?: string;
  /** Page heading level; default 1. Panes then use h2 (h3 when this is 2). */
  level?: 1 | 2;
  className?: string;
}

// ProfileForm
export interface ProfileFormValues {
  displayName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
}

export interface ProfileFormProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onSubmit' | 'children' | 'className'
> {
  value: ProfileFormValues;
  /**
   * Called with the whole next value. Apply it immediately (or with a functional
   * state update): two edits that arrive before a render would otherwise spread
   * the same stale value.
   */
  onChange: (value: ProfileFormValues) => void;
  /**
   * Called with the values read from the form on submit, so autofill that never
   * fires `onChange` is still included. The component already prevented the
   * native submit. When the DOM read differs from `value`, `onChange` is called
   * with the same object first, so the next render cannot clear it.
   */
  onSubmit: (value: ProfileFormValues) => void;
  /** Field errors keyed by a `ProfileFormValues` key; the caller owns validation. */
  errors?: Partial<Record<keyof ProfileFormValues, string>>;
  /** Fields marked required; default `['displayName', 'email']`. */
  required?: readonly (keyof ProfileFormValues)[];
  loading?: boolean;
  disabled?: boolean;
  /** Avatar or initials block above the fields; the caller owns upload. */
  avatar?: ReactNode;
  /** Hint under the avatar, e.g. accepted formats and size limit. */
  avatarHint?: ReactNode;
  displayNameLabel?: string; // 'Họ và tên'
  emailLabel?: string; // 'Email'
  phoneLabel?: string; // 'Số điện thoại'
  jobTitleLabel?: string; // 'Chức danh'
  departmentLabel?: string; // 'Phòng ban'
  submitLabel?: string; // 'Lưu thay đổi'
  cancelLabel?: string; // 'Huỷ'
  /** Renders the secondary cancel button when set. */
  onCancel?: () => void;
  /** Extra class for the root wrapper (the element in the caller's layout), not the form. */
  className?: string;
}
```

### 4.1 Why `as` exists (and why `fill` still does not)

An earlier draft of this spec claimed `AppShell` already renders the page's
`<main>`. It does not: `AppShell.tsx:87-93` renders `<div className={styles.main}>`
and `<div className={styles.body}>`. A template dropped into its content area
would therefore leave the page with **no** main landmark — skip-to-main and
landmark navigation find nothing — and its own `<header>` would sit outside any
landmark, mapping to a second `banner` next to AppShell's site header (axe
`landmark-no-duplicate-banner`).

So `SettingsProfile` gains one landmark prop, `as?: 'main' | 'div' | 'section'`
(default `'main'`), matching `ErrorPage`. Defaulting to `main` supplies the
missing landmark _and_ scopes the template's `<header>` inside it, where HTML-AAM
maps it to generic rather than `banner`. `as="div"` is for a host that already
renders `<main>` (the docs page, a modal, a nested route); a bare `div` has no
role, so `aria-labelledby` is dropped there (ARIA 1.2 forbids it on `generic`).
`as="section"` gives a named `region` for embedding beside other content.

There is still **no** `fill`, no `min-height: 100dvh` and no container-type
plumbing copied from `AuthLayout`/`ErrorPage`: a full-viewport behaviour is wrong
for an embedded settings page. Only the one prop the a11y failure actually
requires is added.

### 4.2 Behaviour — `SettingsProfile`

- Renders one `<nav aria-label={navLabel}>` of `<button type="button">` items,
  one per section, in `sections` order. Active item gets `aria-current="true"`
  and the accent border/colour; the rest are muted. Buttons, not links: the
  component does not route. `"true"`, not `"page"`: the page is the route, which
  `AppShell`'s sidebar already marks `aria-current="page"`; this value names the
  current item inside the section set.
- Clicking an item calls `onSectionChange(key)`; uncontrolled, it also switches
  its own state (`defaultActiveKey ?? sections[0].key`).
- `defaultActiveKey` seeds the **first render only**. If `sections` arrives in
  stages (async or permission-gated list) and the key is not present yet, the
  state reconciles to the first section that does exist and does not switch back
  when the key arrives. Sections known only at runtime, or a key taken from the
  URL, belong in controlled mode (`activeKey` + `onSectionChange`) — a documented
  trade-off of the stale-key reconcile below, not a bug to "fix" by re-seeding.
- An `activeKey` that matches no section falls back to the first section rather
  than rendering no pane — a stale key from a removed section must not blank the
  screen. The fallback is **not** render-only: a `useEffect` reconciles the
  state with what is painted (uncontrolled: reset the internal key; controlled:
  call `onSectionChange(fallback)`), otherwise a removed-then-restored section
  silently takes the view over and a caller keyed on `activeKey` (URL sync,
  save-on-leave) acts on a section that is not on screen. Same fallback when
  `sections` is empty: the nav renders nothing and no pane renders.
- Every pane renders as `<section aria-labelledby>` with its own heading
  (`h2`, or `h3` when `level={2}`), so each is a named `region` a screen-reader
  user can jump to. Pane and description ids are built from the **index**, not
  the raw key: `aria-labelledby`/`aria-describedby` are space-separated id lists,
  so a key like `"account settings"` would split into two non-existent ids and
  cost the pane its name and its `region` role; key-derived ids in one namespace
  also collide (`privacy`'s description vs the pane of `privacy-description`).
  `description` renders as a muted paragraph under the heading and reaches the
  section through `aria-describedby` only if it is present — the heading alone
  names it.
- Inactive panes stay mounted with the `hidden` attribute. `hidden` removes them
  from the accessibility tree and the tab order while keeping React state, so
  values typed in one section survive switching away; they are not submitted
  twice or lost.
- Layout: an inline-size container. At ≥ 768px the nav is a fixed 220px left
  rail and panes sit beside it; below that the nav becomes a horizontally
  scrollable row above the pane (a thin scrollbar, still keyboard-scrollable) and
  the pane takes the full width. The active item is scrolled into view when the
  row overflows, so an off-screen `defaultActiveKey` cannot start invisible. That
  centring is computed from `getBoundingClientRect()` of the nav and the item, not
  `offsetLeft`: `offsetLeft` is relative to the `offsetParent`, which is `<body>`
  unless an ancestor is positioned, so inside a padded frame it includes the
  nav's own distance from the page edge and overshoots (measured on the docs page:
  `scrollLeft` 134 instead of the intended 96, the active button at -1px). Rects
  cancel that out, and `scrollLeft +=` composes with the current offset.
  The active cue follows the orientation: an underline in the row, a left bar in
  the rail — a left border in the row would butt against the previous item. Long
  labels wrap inside the 220px rail instead of spilling over the pane.
  `@container`, never `@media`, so the same component works in the docs frame and
  in a wide shell.
- The root is `box-sizing: border-box` with `min-width: 0`, so it cannot force
  a horizontal scrollbar inside `AppShell`'s padded body.

### 4.3 Behaviour — `ProfileForm`

- Controlled: every edit calls `onChange` with a new
  `{ displayName, email, phone, jobTitle, department }`, spreading the previous
  value and replacing one key. The caller must apply it immediately or with a
  functional state update.
- Submitting prevents the native submit and calls `onSubmit` with values read
  from the DOM (`FormData`-style read of the five named inputs), so autofill that
  bypasses React's `onChange` is still included. When the DOM read differs from
  `value`, it calls `onChange(next)` **before** `onSubmit(next)` — the same
  contract as `LoginForm`: otherwise the next render repaints the stale
  controlled value and silently wipes the autofilled text the caller was just
  handed.
- Five `Field` + `Input` pairs in a two-column grid (one column below a 640px
  container), each with a visible `<label>`, `name`, and `autoComplete`:
  `name`, `email`, `tel`, `organization-title`, `organization`. Email is
  `type="email"` + `inputMode="email"`; phone is `type="tel"` + `inputMode="tel"`.
- `required` (default `['displayName', 'email']`) marks those `Field`s required,
  giving the visible asterisk and `aria-required`.
- `errors` flow through `Form errors` + `Field name`, giving `aria-invalid` and
  `aria-describedby` for free. Only the five known keys are accepted.
- Footer: primary submit, and a secondary cancel only when `onCancel` is set.
  `loading` sets `aria-busy` on the form, disables the submit and shows its
  spinner; `disabled` disables every control; a submit while either is set is
  ignored (Enter in a field must not bypass the disabled button).
- The `avatar` slot renders **outside** the `<form>`. A caller's upload control is
  typically a plain `<button>`, which defaults to `type="submit"`; inside the form,
  opening the picker would also save the profile. The wrapper is therefore the
  outer element: `className`, `hidden`, `style`, `id` and `data-*` land on it, so
  placement classes reach the caller's flex/grid layout and `hidden` hides the
  avatar too. The `<form>` keeps only its own class; form-only attributes
  (`action`, `method`) are meaningless because the component owns submit and
  always prevents the native one.
- The root has a `min-inline-size: 15rem` floor. `container-type: inline-size`
  makes a form contribute 0 to its parent's intrinsic width, so in a
  shrink-to-fit home (flex item without grow, grid `auto` column, `width:
fit-content`, inline-block, popover) it would collapse to ~0px; the floor keeps
  it usable. Deliberately a plain length, **not** `min(15rem, 100%)`: the
  percentage resolves against an indefinite width in exactly the shrink-to-fit
  case being fixed, so it would not floor anything there.
- No autofocus. The component never validates and never fetches.
- The autofill read lives in `internal/readFormValue.ts` and is shared with
  `LoginForm`: one copy of the "read the DOM, keep missing controls, check
  checkboxes" contract instead of two that must be fixed together.

## 5. A11y

- `SettingsProfile` renders a `<main>` landmark by default via `as`, because
  `AppShell`'s content area is a `div`. Its `<header>` therefore sits inside
  `main`, where HTML-AAM maps it to generic rather than a second `banner`; with
  `as="div"` the host owns the landmark and the header mapping is documented. The
  nav is a named `nav` landmark, not a `tablist`: switching sections is page
  navigation between independent forms, and a `tablist` would demand all panes be
  `role="tabpanel"` with roving tabindex and arrow-key handling — behaviour this
  template does not need and should not pretend to have.
- `aria-current="true"` on the active nav item (not `"page"`, which AppShell's
  sidebar already claims), plus the accent border and a weight/token change, so
  the state is not colour-only.
- Each pane is a `<section>` named by its own `<h2>`/`<h3>`; headings are real
  text, so `hidden` panes leave the outline while their state survives.
- Keyboard: nav buttons are ordinary Tab stops with `--focus-ring`; no arrow-key
  emulation is claimed. A horizontal scroller below 768px stays reachable by
  keyboard, and its scroll position follows focus (native behaviour).
- `ProfileForm` inputs are all labelled by `Field`; errors are `role="alert"`
  from `Field`, so a failed save is announced. Contrast: `--text`,
  `--text-muted`, `--action-text` and `--danger-emphasis` on `--surface` /
  `--bg` meet 4.5:1 (3:1 for the non-text danger cue) in both themes and both
  densities.
- The docs demo reports saves with `useToast` (auto-dismissing, like
  `ErrorsPage`), not a persistent `role="status"` line: `ToastProvider` owns the
  announcement region, so the demo does not need a second one.

## 6. Tests (acceptance)

`SettingsProfile.test.tsx`:

- renders the default title, subtitle and header actions; custom `title`.
- one nav button per section, in order, with the first active by default;
  `defaultActiveKey` selects another; `activeKey` is controlled (click does not
  change the visible pane, `onSectionChange` fires with the key).
- `aria-current="true"` moves with the active section and only one item has it.
- every pane is a named `region` (heading text), panes other than the active one
  carry `hidden`, and switching keeps the previously typed input value in the
  DOM (state survives `hidden`).
- a key containing whitespace still yields one valid `aria-labelledby` id and a
  named region; `privacy` + `privacy-description` produce distinct ids.
- unknown `activeKey` falls back to the first section, and the state is
  reconciled: an uncontrolled template whose active section is removed does not
  jump back when it returns; a controlled one calls `onSectionChange` with the
  fallback.
- empty `sections` renders no nav and no pane.
- `level={2}` makes the page heading `h2` and pane headings `h3`.
- `navLabel` names the nav landmark; default name is used when omitted.
- default `as` renders a named `main` whose `<header>` is inside it; `as="div"`
  adds no landmark and no `aria-labelledby`; `as="section"` is a named `region`.
- className merge.
- CSS pins: `@container` present, `@media` absent, root `box-sizing: border-box`,
  768px rail breakpoint, `[hidden]` display none rule, thin (not hidden)
  scrollbar, wrapping labels in the rail, orientation-specific active cue.
- the active item's centring is computed from rects, not `offsetLeft`: with the
  nav offset from the page edge and already scrolled, the resulting `scrollLeft`
  is the centred value (an `offsetLeft` read overshoots; the mocked-`offsetLeft`
  version of this test could not catch it).

`ProfileForm.test.tsx`:

- renders five labelled inputs with the expected `name`, `type`, `inputMode`
  and `autoComplete` values.
- edits emit the whole next value per field (5 cases), and two rapid edits do not
  drop the first (functional-update call site).
- submit prevents default and emits the current values; submit reads autofilled
  DOM values that `onChange` never saw, reports them, and calls `onChange` with
  the same object before `onSubmit`.
- `required` default marks displayName + email (`aria-required` + asterisk) and
  not the other three; a custom `required` list moves the marks.
- `errors` wire `aria-invalid` + `aria-describedby` for the matching field only,
  and render `role="alert"`.
- `loading` sets `aria-busy`, disables submit, shows the spinner; Enter while
  `loading`/`disabled` emits nothing.
- `disabled` disables all inputs and both buttons.
- custom labels; `onCancel` renders the cancel button and fires it;
  no `onCancel` renders no cancel button.
- avatar and `avatarHint` render; omitted avatar renders no wrapper; a plain
  `<button>` in the avatar slot is not inside the form and does not submit.
- className merge on the **root wrapper**, which also takes `hidden`, `style`,
  `id` and `data-*`: a placement class reaches the caller's layout and `hidden`
  hides the avatar slot too. The root's `min-inline-size` floor is pinned in CSS
  so `container-type: inline-size` cannot collapse it.

Docs page: three sections render through `SettingsProfile`; the snippet
typechecks; switching sections keeps the typed value; saves are reported with
`useToast`; the change-password form carries a hidden `username` field so
password managers have an account to attach the new password to (and browsers
stop logging the "password forms should have username fields" warning).

## 8. My calls (recorded so they can be checked)

The three questions the builder check raised were answered by me, not by the
user:

1. **No new primitives.** Notifications uses `Checkbox` (no `Switch`); the
   security pane uses `Input type="password"` + `Button` and an inline two-step
   confirm (no `Modal`). Adding either primitive is its own PR and its own docs
   page.
2. **`onChange` before `onSubmit`** on an autofilled read, mirroring
   `LoginForm`.
3. **`useToast`** for the demo, since `ToastProvider` auto-dismisses and already
   owns the announcement region.

## 7. Done khi

1. Both components and their public types (`SettingsProfileProps`,
   `SettingsSection`, `ProfileFormProps`, `ProfileFormValues`) exported from the
   root; no deep imports needed.
2. Docs page reachable from the sidebar at `settings`, light/dark and both
   densities verified.
3. Full gate: `npm test` → typecheck → `docs:snippets` → lint → `format:check` →
   components/showcase/docs builds; every new behaviour has a pinning test and a
   mutant run that kills the mutant.
