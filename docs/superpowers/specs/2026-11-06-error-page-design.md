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
  /** HTTP status; drives the default icon, title and description. */
  status: ErrorStatus;
  /** Override the default title; empty/null falls back to the default. */
  title?: ReactNode;
  /** Override the default description; null or '' hides it. */
  description?: ReactNode;
  /** Override the default icon; null hides it. */
  icon?: ReactNode;
  /** Recovery actions (buttons/links); the caller owns navigation and retry. */
  actions?: ReactNode;
  /** Heading level, default 1; use 2 when nested under a page heading. */
  level?: 1 | 2;
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

- The root exposes `data-status` and `data-fill`; the numeric code is real text
  (not CSS content), so it can be read, selected and copied.
- `title` falls back to the status default when it is null/empty. `description`
  uses the default only when the prop is `undefined`; `null`/`''` hides the
  paragraph. `icon` uses the default only when `undefined`; `null` hides it.
- `actions` renders only when present. The component never invents a "retry" or
  "go home" action; the caller decides which recovery actions exist.
- `as` defaults to `'main'` and `level` to `1`. `as="div" | "section"` drops the
  main landmark when embedded. `fill` defaults to true (`min-height: 100dvh`);
  `fill={false}` lets the caller size the frame.
- The root is an inline-size container and the only width query is
  `@container (max-width: 480px)` (code/title scale down). Because of that, a
  shrink-to-fit parent (inline-block, a flex item without a width, an absolutely
  positioned box without a width) must give it an explicit width; normal block
  and grid/flex-stretch parents need nothing.
- The status code and icon use `--action-text`; `status={500}` switches them to
  `--danger-emphasis` (light `#dc2626`, dark `#f87171`). Meaning is always
  carried by the code and title text too, never by colour alone.

## 5. A11y

- One `h1` by default (`level={2}` for docs/nested screens); the docs page owns
  the single `<main>` and mounts each demo with `as="div"`.
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
  and `data-icon`; icon is `aria-hidden`; no alert role; title/description/icon
  overrides; `description=""` and `icon={null}` hide those slots; `title={null}`
  falls back; actions render only when provided and clicks reach the caller;
  `level`; `as="div"` drops main; `fill` data hook and CSS rule; className merge;
  container query instead of media query; 500 uses `--danger-emphasis`, other
  statuses use `--action-text`.
- Docs page: three tabs render 403 / 404 / 500 compositions; one code snippet
  typechecks; all demos use `as="div"` and `fill={false}` inside a sized frame.

## 7. Done khi

1. Component exported from the root with its public types.
2. Docs page reachable from the sidebar; all three demos work with light/dark
   and compact/comfortable.
3. Zero deps, tsc strict, lint/format/snippets clean, three builds pass, full
   suite green.
