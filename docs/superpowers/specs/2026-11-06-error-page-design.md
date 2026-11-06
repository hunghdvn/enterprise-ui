# Error Page Design Spec (P3 — 403/404/500)

Date: 2026-11-06
Status: Approved (scope confirmed by user: one `ErrorPage` with `status`, docs tabs 403 / 404 / 500)
Base: `docs/superpowers/specs/2026-10-11-enterprise-ui-design.md` (P3 templates)

## 1. Intent & why

P3 adds composed screen templates. Every ERP app needs route-level fallbacks for
"forbidden", "not found" and "server error"; today each app would hand-build the
same centred heading, explanation and recovery actions. `ErrorPage` packages
that shell once and keeps the copy/actions caller-owned where it matters.

The template stays presentational: it renders a status, default copy and
caller-supplied actions. It never redirects, retries, checks permissions, logs
telemetry or fetches.

## 2. Goals / Non-goals

Goals:

- G1: `ErrorPage` — one component with `status: 403 | 404 | 500`; the status
  selects the default icon, title and description.
- G2: Caller can override `title`, `description`, `icon`, and pass `actions`.
- G3: Docs page with three tabs (403 / 404 / 500), one shared code snippet and
  the props table.
- G4: Light/dark + density, keyboard focus and 4.5:1 / 3:1 contrast hold.
- G5: Safe embedding via `as`/`fill` and container queries, mirroring
  `AuthLayout`; the docs page owns the single `<main>`.

Non-goals: routing/history, retry logic, auth checks, an `ErrorBoundary`,
telemetry, illustrations, an inline `ErrorState` for cards/tables, arbitrary
status codes, i18n framework.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only;
presentational-only; folder layout `ErrorPage.tsx + ErrorPage.module.css +
types.ts + index.ts + ErrorPage.test.tsx` + root re-export; Vitest globals on.

## 4. API

```ts
export type ErrorStatus = 403 | 404 | 500;
export type ErrorPageLandmark = 'main' | 'div' | 'section';

export interface ErrorPageProps {
  /** HTTP status (required); drives the default icon, title and description. */
  status: ErrorStatus;
  /** Override the default title; null/empty/true falls back to the default. */
  title?: ReactNode;
  /** Override the default description; null or '' hides it. */
  description?: ReactNode;
  /** Override the default icon; null hides it. */
  icon?: ReactNode;
  /** Recovery actions (buttons/links); the caller owns navigation and retry. */
  actions?: ReactNode;
  /** Heading level, default 1; 3 for a modal whose title is already an h2. */
  level?: 1 | 2 | 3;
  /** Landmark wrapper, default 'main'; use 'div' when the page already owns a main. */
  as?: ErrorPageLandmark;
  /** Fill the viewport height, default true; set false when embedding. */
  fill?: boolean;
  className?: string;
}
```

Defaults:

| Status | Icon             | Title                   | Description                                                                                    |
| ------ | ---------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| 403    | `lock`           | Không có quyền truy cập | Bạn không có quyền truy cập trang này. Liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn. |
| 404    | `search`         | Không tìm thấy trang    | Trang bạn đang tìm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.                     |
| 500    | `alert-triangle` | Đã xảy ra lỗi           | Hệ thống gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại sau ít phút.                            |

Behavior:

- An unsupported `status` (e.g. `502` arriving from an API through a cast) falls
  back to the 500 defaults instead of throwing: a fallback page that crashes
  takes the route or the error boundary with it.
- The root exposes `data-status`, `data-tone` and `data-fill`; the numeric code is
  real text (not CSS content), so it can be read, selected and copied.
- The heading carries a `useId()` id and the root points `aria-labelledby` at it
  **only when the wrapper is a landmark that can carry a name** (`main`/`section`),
  so `as="section"` becomes a named `region` landmark instead of an unnamed
  `<section>` that screen readers skip. On `as="div"` the attribute is omitted: a
  `<div>` with no role is `generic`, and ARIA 1.2 prohibits `aria-labelledby`
  there (axe `aria-prohibited-attr`).
- `title` falls back to the status default when it is null/empty/`true`.
  `description` uses the default only when the prop is `undefined`; `null`/`''`
  hides the paragraph. `icon` uses the default only when `undefined`; `null`
  hides it. Hiding also drops the wrapper, so no empty 52px circle or empty
  paragraph remains.
- `actions` renders only when present; an empty array (the `items.map(...)` case)
  renders no wrapper with its top margin. The component never invents a "retry"
  or "go home" action; the caller decides which recovery actions exist.
- `as` defaults to `'main'` and `level` to `1`. `as="div" | "section"` drops the
  main landmark when embedded. `main` is correct both for a standalone route and
  for AppShell — AppShell's content area is a plain `div`, so switching to `div`
  there would leave the page with no main landmark at all; the docs pass `div`
  only because the docs page renders its own `<main>`. `fill` defaults to true
  (`min-height: 100dvh`); `fill={false}` lets the caller size the frame. Inside
  AppShell or any layout that already renders a header, pass `fill={false}`: a
  `100dvh` root under a header always scrolls.
- `.root` is `box-sizing: border-box` and carries the padding. Without it the
  default full-page error is `100dvh + 64px` tall and always shows a
  scrollbar; the inline axis overflows by 40px once a caller sets a width.
- The root is an inline-size container and the only width query is
  `@container (max-width: 480px)` (code/title scale down). Because of that, a
  shrink-to-fit parent (inline-block, a flex item without a width, an absolutely
  positioned box without a width) must give it an explicit width; normal block
  and grid/flex-stretch parents need nothing.
- The status code and icon use `--action-text`; the danger cue is driven by
  `data-tone="danger"`, set for `status={500}` **and** for the unsupported-status
  fallback path, so a 502 shows the 500 copy with the 500 colour instead of
  informational blue. Danger uses `--danger-emphasis` (light `#dc2626`, dark
  `#f87171`). Meaning is always carried by the code and title text too, never by
  colour alone.

## 5. A11y

- One `h1` by default (`level={2}` under a page heading, `level={3}` inside a
  modal whose title is already an `h2`); the docs page owns the single `<main>`
  and mounts each demo with `as="div"`.
- The root is labelled by the heading (`aria-labelledby` + `useId`) on `main`
  and `section`, so `as="section"` is a named `region` rather than an unnamed
  section; the attribute is omitted on `as="div"` because ARIA 1.2 prohibits it
  on a `generic` element.
- The icon is decorative (`aria-hidden` via `Icon`); the status code is exposed
  as text before the heading, so assistive tech hears "404" then the title.
- No `role="alert"`/live region: a route-level error is navigation, not an
  asynchronous notification, and must not be announced again on mount.
- No autofocus: the template does not steal focus. Actions are ordinary
  buttons/links and are reachable by Tab; `Button` and consumer links keep their
  own focus-visible styling.
- Contrast: `--action-text` on `--bg`, `--danger-emphasis` on `--bg`,
  `--text-muted` on `--bg` and `--text` on `--bg` meet 4.5:1 (large code text
  3:1 minimum) in both themes.

## 6. Tests (acceptance)

- `ErrorPage.test.tsx`: each status renders its default code/title/description
  and `data-icon`; unsupported status falls back to 500; icon is `aria-hidden`;
  no alert role; wrapper is labelled by the heading on `main`/`section` and has
  no `aria-labelledby`/`aria-label` on `as="div"`; title/description/icon
  overrides; `description=""`/`null` and `icon={null}` remove the wrappers
  (`querySelectorAll('p')` is just the code, no `[data-icon]`); `title` null,
  `''` and `true` all fall back; actions render only when present and an empty
  array renders no wrapper; `level` 2 and 3; `as="div"` drops main; `fill` data
  hook plus the `min-height` declaration; `.root` is `border-box`; container
  query instead of media query; `data-tone` is `danger` for 500 and for the
  unsupported-status fallback, `info` for 403/404; the danger rule uses
  `--danger-emphasis` on both `.icon` and `.code`, other statuses use
  `--action-text`.
- `internal/isPresent.test.ts`: `true` and `[]` are absent, a non-empty array is
  present.
- Docs page: three tabs render 403 / 404 / 500 compositions; one code snippet
  typechecks; all demos use `as="div"` and `fill={false}` inside a sized frame.

## 7. Done khi

1. Component exported from the root with its public types.
2. Docs page reachable from the sidebar; all three demos work with light/dark
   and compact/comfortable.
3. Zero deps, tsc strict, lint/format/snippets clean, three builds pass, full
   suite green.
