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
  aside?: ReactNode; // marketing panel; when set, desktop is two columns
  asideLabel?: string; // accessible name for the complementary landmark
  level?: 1 | 2; // title heading level, default 1
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
  errors?: Record<string, string>; // field errors keyed 'email' | 'password'
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

- `AuthLayout` always renders a `<main>` landmark and renders `<aside>` only
  when `aside` is set. With no aside the card is centred; with an aside the
  desktop grid shows the panel + card, and below 768px the panel is hidden and
  the card takes the full width. The component fills the viewport
  (`min-height: 100dvh`).
- `LoginForm` is controlled: every edit calls `onChange` with a new
  `{ email, password, remember }`. Submitting prevents the native submit and
  calls `onSubmit(value)`; it never validates and never fetches.
- `loading` marks the form `aria-busy`, disables the submit button and shows
  its spinner; `disabled` disables every control. A submit is ignored while
  either is set (Enter in a field must not bypass the disabled button).
- `error` renders above the fields with `role="alert"` and an icon, so colour
  is not the only channel. Field errors flow through `Form errors` + `Field
name`, giving `aria-invalid` and `aria-describedby` for free.
- `showRemember={false}` hides the remember checkbox; `forgotPassword` still
  renders in the row, right-aligned, so a forced re-auth screen can offer the
  reset link without the checkbox. The row is omitted only when both are
  absent.
- The submit button is full width; `children` renders under it.

## 5. A11y

- `AuthLayout` title is the page heading (`h1` by default; `level={2}` for
  nested demos). The card is a `<main>`; the marketing panel is an `<aside>`
  with an optional `asideLabel`.
- Inputs: visible `<label>` via `Field`, `name="email"`, `autoComplete="username"`;
  `name="password"`, `autoComplete="current-password"`; email uses
  `type="email"` and `inputMode="email"`.
- Form-level error: `role="alert"`; field errors: `role="alert"` from `Field`.
- Loading: submit button gets `aria-busy`; the form also sets `aria-busy`.
- No autofocus: the template must not steal focus on mount. All controls are
  reachable by Tab; focus rings use `--focus-ring`.
- Contrast: muted text on surface and white on blue-600 meet 4.5:1 in both
  themes.

## 6. Tests (acceptance)

- `AuthLayout.test.tsx`: title/subtitle/brand/children/footer render; title
  level; no aside → no complementary landmark; aside → landmark + optional
  label; className merge; main landmark exists.
- `LoginForm.test.tsx`: labels + autocomplete + input types; edits emit the
  full next value; remember toggles; submit prevents default and emits current
  values; Enter while loading/disabled does not emit; form error alert; field
  errors wire `aria-invalid`/`aria-describedby`; loading `aria-busy`; disabled
  controls; custom labels; forgot slot; `showRemember={false}`; children slot.
- Docs page: three tabs render login / forgot / register compositions; one
  code snippet typechecks.

## 7. Done khi

1. Components exported from the root with their public types.
2. Docs page reachable from the sidebar; all three demos work with
   light/dark and compact/comfortable.
3. Zero deps, tsc strict, lint/format/snippets clean, three builds pass, full
   suite green.
