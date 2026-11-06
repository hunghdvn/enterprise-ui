# Auth Design Spec (P3 — Login/Auth)

Date: 2026-11-06
Status: Approved (scope confirmed by user: AuthLayout + LoginForm, docs tabs Login / Forgot password / Register)
Base: `docs/superpowers/specs/2026-10-11-enterprise-ui-design.md` (P3 templates)

## 1. Intent & why

P3 adds composed screen templates. Login/Auth is the entry screen every ERP app
needs; it has no reusable shell yet. The template stays presentational — it
renders slots and emits values, never validates credentials or calls an API.

## 2. Goals / Non-goals

Goals:

- G1: `AuthLayout` — full-page shell with a centred card and an optional
  split marketing panel; brand/title/subtitle/form/footer slots.
- G2: `LoginForm` — controlled email/password/remember form composed from
  `Form`, `Field`, `Input`, `Checkbox`, `Button`; submits values to the caller.
- G3: Docs page with three demos reusing the same shell: login, forgot
  password, register.
- G4: Light/dark + density, keyboard, focus-visible and 4.5:1 contrast hold.
- G5: Password-manager friendly (`name`, `autoComplete`).

Non-goals: credential validation, auth state, fetching, SSO implementations,
social-provider buttons, password-visibility toggle, multi-factor flows,
routing.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only;
presentational-only; folder layout `X.tsx + X.module.css + types.ts +
index.ts + X.test.tsx` + root re-export; Vitest globals on.

## 4. API

```ts
// AuthLayout
export interface AuthLayoutProps {
  brand?: ReactNode; // logo / product mark above the title
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode; // form or message
  footer?: ReactNode; // secondary links / legal copy
  aside?: ReactNode; // marketing panel; two columns when the layout is wide enough
  asideLabel?: string; // accessible name for the complementary landmark
  level?: 1 | 2; // title heading level, default 1
  as?: 'main' | 'div' | 'section'; // content landmark, default 'main'
  fill?: boolean; // fill the viewport height, default true
  className?: string;
}

// LoginForm
export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginFormProps {
  value: LoginFormValues;
  onChange: (value: LoginFormValues) => void;
  onSubmit: (value: LoginFormValues) => void;
  error?: ReactNode; // form-level error (wrong credentials, locked account)
  errors?: Partial<Record<'email' | 'password', string>>; // field errors
  loading?: boolean;
  disabled?: boolean;
  emailLabel?: string; // default 'Email'
  passwordLabel?: string; // default 'Mật khẩu'
  rememberLabel?: string; // default 'Ghi nhớ đăng nhập'
  submitLabel?: string; // default 'Đăng nhập'
  showRemember?: boolean; // default true
  forgotPassword?: ReactNode; // link/button shown opposite the checkbox
  children?: ReactNode; // slot after the submit button (SSO, legal copy)
  className?: string;
}
```

Behavior:

- `AuthLayout` renders `<main>` by default and renders `<aside>` only when
  `aside` is set. `as="div" | "section"` replaces the main landmark when the
  template is embedded in a page that already owns one. With no aside the card
  is centred; with an aside the grid shows the panel + card whenever the
  component itself is at least 769px wide (`@container`, not the viewport), so
  docs frames and modals do not squeeze the card. Narrower than that, the panel
  is hidden and the card takes the full width; the card's narrow padding uses
  the same container query. `fill` defaults to true (`min-height: 100dvh`);
  `fill={false}` lets the caller size the frame. Because the root is an
  inline-size container, a shrink-to-fit parent (inline-block, a flex item
  without a width, an absolutely positioned box without a width) must give it
  an explicit width; normal block and grid/flex-stretch parents need nothing.
- The blue-600 aside re-scopes `--text`, `--text-muted`, `--action-text` and
  `--focus-ring` to light-on-blue values, so consumer links and focus rings
  stay visible (WCAG 1.4.11 / 2.4.7) instead of matching the panel.
- `LoginForm` is controlled: every edit calls `onChange` with a new
  `{ email, password, remember }`; callers must apply it immediately or with a
  functional state update so two edits before a render cannot drop the first.
  Submitting prevents the native submit and calls `onSubmit` with values read
  from the form, so autofill that bypasses `onChange` is included. It never
  validates and never fetches.
- `loading` marks the form `aria-busy`, disables the submit button and shows
  its spinner; `disabled` disables every control. A submit is ignored while
  either is set (Enter in a field must not bypass the disabled button).
- `error` renders above the fields with `role="alert"` and an icon, so colour
  is not the only channel. Callers clear `error` when a new submit starts so a
  repeat failure is announced again. Field errors flow through `Form errors` +
  `Field name`, giving `aria-invalid` and `aria-describedby` for free, and only
  accept the keys `email` and `password`.
- The error border/icon use `--danger-emphasis` (light `#dc2626`, dark
  `#f87171`) so the non-colour cue stays ≥3:1 on `--surface-muted` in both
  themes.
- `showRemember={false}` hides the remember checkbox; `forgotPassword` still
  renders in the row, right-aligned, so a forced re-auth screen can offer the
  reset link without the checkbox. The row is omitted only when both are
  absent. The slot styles both `<a>` and `<button>`.
- The submit button is full width; `children` renders under it, outside the
  `<form>`, so a plain SSO button cannot submit the form.

## 5. A11y

- `AuthLayout` title is the page heading (`h1` by default; `level={2}` for
  nested demos). The card column is a `<main>` unless `as` changes it; the
  marketing panel is an `<aside>` with an optional `asideLabel`. The docs page
  owns the single `<main>` and mounts each demo with `as="div"`.
- Inputs: visible `<label>` via `Field`, `name="email"`, `autoComplete="username"`;
  `name="password"`, `autoComplete="current-password"`; email uses
  `type="email"` and `inputMode="email"`.
- Form-level error: `role="alert"`; field errors: `role="alert"` from `Field`.
  Success messages in the docs keep `role="status"` mounted and only change its
  text, so each message is announced.
- Loading: submit button gets `aria-busy`; the form also sets `aria-busy`.
- No autofocus: the template must not steal focus on mount. All controls are
  reachable by Tab; focus rings use `--focus-ring`, including on the aside.
- Contrast: muted text on surface, white on blue-600 and `--danger-emphasis` on
  `--surface-muted` meet 4.5:1 / 3:1 as applicable in both themes.

## 6. Tests (acceptance)

- `AuthLayout.test.tsx`: title/subtitle/brand/children/footer render; title
  level; no aside → no complementary landmark; aside → landmark + optional
  label; className merge; main landmark exists; `as="div"` drops it; `fill`
  data hook; container query instead of viewport media; aside token re-scope.
- `LoginForm.test.tsx`: labels + autocomplete + input types; edits emit the
  full next value; remember toggles; submit prevents default and emits current
  values; submit reads autofilled DOM values and syncs `onChange`; hidden
  remember keeps the controlled value; Enter while loading/disabled does not
  emit; form error alert; field errors wire
  `aria-invalid`/`aria-describedby`; loading `aria-busy`; disabled controls;
  custom labels; forgot slot (`a` and `button` styling); `showRemember={false}`;
  children render outside the form and a plain SSO button does not submit.
- Docs page: three tabs render login / forgot / register compositions; one
  code snippet typechecks; success status regions stay mounted; tab focus index
  is derived from the rendered items.

## 7. Done khi

1. Components exported from the root with their public types.
2. Docs page reachable from the sidebar; all three demos work with
   light/dark and compact/comfortable.
3. Zero deps, tsc strict, lint/format/snippets clean, three builds pass, full
   suite green.
