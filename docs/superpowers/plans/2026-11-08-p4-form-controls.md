# P4a Form Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the missing P1 form primitives — `Radio` + `RadioGroup`, `Switch`, `Textarea` — with docs pages, closing the gap the P1 list left open ("Checkbox/Radio/Switch").

**Architecture:** Four components in their own folders under `packages/components/src/`, exported from the root with public types. `Radio`/`RadioGroup` share a React context so a group owns `name`, selection and the `Form` error lookup; `Switch` and `Textarea` are standalone. `Field` learns that `Radio`/`Switch` label themselves so it never adds a second `<label for>`. One new token (`--switch-track-on`) keeps the switch boundary above 3:1 in both themes.

**Tech Stack:** React 18, TypeScript strict, CSS Modules with `var(--…)` tokens, Vitest + Testing Library (no user-event), Astro/Starlight docs, Vite.

**Spec:** `docs/superpowers/specs/2026-11-08-p4-form-controls-design.md`

## Global Constraints

- Zero runtime deps; TS strict, no `any`.
- CSS Modules + `var(--…)` tokens only — no hardcoded hex in components (repo-wide test scans module CSS).
- Presentational only: data in via props, events out via `onChange`; no fetching, no validation, no persistence.
- Component folder layout: `X.tsx + X.module.css + types.ts + index.ts + X.test.tsx`, re-exported from `packages/components/src/index.ts` (component **and** public types).
- Vitest globals are on (`test`/`expect`/`vi` need no import); only `@testing-library/react` helpers are imported. No `@testing-library/user-event` in this repo.
- `data-size={size}` in a component requires both `[data-size='sm']` and `[data-size='md']` blocks in its module CSS (`css-conventions.test.ts`).
- Docs are Astro MDX under `apps/docs/src/content/docs/`; every fenced `tsx` block is typechecked by `npm run docs:snippets` and must be self-contained.
- Full gate before push: `npm test` → `npm --workspaces run typecheck --if-present` → `npm run docs:snippets` → `npm run lint` → `npm run format:check` → components/showcase/docs builds.
- Mutants: back up with `cp <file> <file>.bak`, apply the mutant, run the named test, restore with `cp <file>.bak <file>` — never `git checkout <file>`.

## Review Focus

- Uncontrolled `RadioGroup` with no `onChange`: selecting another option must uncheck the first (one shared, generated `name`). Two radios both looking selected is the failure a user would notice first.
- A `Radio` inside a controlled group that also receives its own `checked`: the group's `value` must win, and React must not warn about switching a controlled input to uncontrolled.
- `<Field label>` wrapping a `Radio`/`Switch`: the control's accessible name must stay its own label text, not `heading + control text` concatenated.
- `Switch` in the dark theme: the checked track must stay ≥3:1 against the page (`--switch-track-on` dark override), and the thumb boundary must read in light mode.
- `Textarea` with both a caller `aria-describedby` and `error`: both ids must survive on the control, caller id first.

**Every one of these gets a named test in the task that owns the code (Task 1, 2, 3 respectively).**

---

### Task 1: `Radio` + `RadioGroup` (+ `Field` self-labelled)

**Files:**

- Create: `packages/components/src/Radio/types.ts`
- Create: `packages/components/src/Radio/Radio.tsx`
- Create: `packages/components/src/Radio/Radio.module.css`
- Create: `packages/components/src/Radio/index.ts`
- Create: `packages/components/src/Radio/Radio.test.tsx`
- Create: `packages/components/src/RadioGroup/types.ts`
- Create: `packages/components/src/RadioGroup/RadioGroup.tsx`
- Create: `packages/components/src/RadioGroup/RadioGroup.module.css`
- Create: `packages/components/src/RadioGroup/index.ts`
- Create: `packages/components/src/RadioGroup/RadioGroup.test.tsx`
- Modify: `packages/components/src/Form/Field.tsx` (self-labelled list)
- Modify: `packages/components/src/Form/Form.test.tsx` (double-label pins)
- Modify: `packages/components/src/index.ts` (exports)

**Interfaces:**

- Consumes: `cx` from `../internal/cx`; `FormErrorsContext` from `../Form/Form`; `RadioGroupContext` exported from `RadioGroup.tsx`.
- Produces:
  - `export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value'> { value: string; children: ReactNode; size?: 'sm' | 'md' }`
  - `export function Radio(props: RadioProps): JSX.Element`
  - `export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> { legend: ReactNode; hint?: ReactNode; error?: string; name?: string; value?: string; defaultValue?: string; onChange?: (value: string) => void; orientation?: 'vertical' | 'horizontal'; size?: 'sm' | 'md'; required?: boolean; children: ReactNode }`
  - `export interface RadioGroupCtx { name: string; value?: string; defaultValue?: string; size: 'sm' | 'md'; onChange?: (value: string) => void }`
  - `export const RadioGroupContext: React.Context<RadioGroupCtx | null>`
  - `export function RadioGroup(props: RadioGroupProps): JSX.Element`
  - DOM contract: group is `<fieldset role="radiogroup" data-size data-orientation>` (plus `aria-required`/`aria-invalid`/`aria-describedby` when set) with `<legend>` first; radios are `<label data-size><input type="radio" value name checked/defaultChecked>{children}</label>`.
  - Precedence inside a group (D3): `name` = radio prop → group name → generated; `checked` = group `value` when defined, else the radio's own props; group `defaultValue` seeds only when the radio passes neither.
  - Callback order: radio's own `onChange(event)` first, then group `onChange(value)`.

- [ ] **Step 1: Write the failing tests**

Create `Radio.test.tsx`:

```tsx
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Radio } from './Radio';

test('label click selects the radio (uncontrolled)', () => {
  render(<Radio value="email">Email</Radio>);
  const input = screen.getByRole('radio', { name: 'Email' });
  expect(input).not.toBeChecked();
  fireEvent.click(screen.getByText('Email'));
  expect(input).toBeChecked();
});

test('controlled checked + onChange reflect the caller state', () => {
  function Wrapper() {
    const [value, setValue] = useState('email');
    return (
      <>
        <Radio value="email" checked={value === 'email'} onChange={() => setValue('email')}>
          Email
        </Radio>
        <Radio value="sms" checked={value === 'sms'} onChange={() => setValue('sms')}>
          SMS
        </Radio>
      </>
    );
  }
  render(<Wrapper />);
  const sms = screen.getByRole('radio', { name: 'SMS' });
  fireEvent.click(sms);
  expect(sms).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
});
```

Create `RadioGroup.test.tsx`:

```tsx
import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Form } from '../Form/Form';
import { Radio } from '../Radio/Radio';
import { RadioGroup } from './RadioGroup';

test('renders a named radiogroup sharing one generated name', () => {
  render(
    <RadioGroup legend="Kênh nhận thông báo">
      <Radio value="email">Email</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );

  const group = screen.getByRole('radiogroup', { name: 'Kênh nhận thông báo' });
  const radios = within(group).getAllByRole('radio');
  expect(radios).toHaveLength(2);
  const name = radios[0].getAttribute('name');
  expect(name).toBeTruthy();
  expect(radios[1].getAttribute('name')).toBe(name);
});

test('controlled value marks the matching radio and reports the pick', () => {
  const onChange = vi.fn();
  function Wrapper() {
    const [value, setValue] = useState('email');
    return (
      <RadioGroup
        legend="Kênh"
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
      >
        <Radio value="email">Email</Radio>
        <Radio value="sms">SMS</Radio>
      </RadioGroup>
    );
  }
  render(<Wrapper />);

  fireEvent.click(screen.getByRole('radio', { name: 'SMS' }));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('sms');
  expect(screen.getByRole('radio', { name: 'SMS' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Radio src/RadioGroup`
Expected: FAIL — cannot resolve `./Radio` / `./RadioGroup`.

- [ ] **Step 3: Implement `Radio`**

`types.ts` exactly as in Interfaces. `Radio.tsx`: in order — read `RadioGroupContext`; resolve `resolvedSize = size ?? group?.size ?? 'sm'`; `controlled = group?.value !== undefined`; `checked = controlled ? group.value === value : checked`; `defaultChecked = controlled ? undefined : defaultChecked ?? (group?.defaultValue !== undefined ? group.defaultValue === value : undefined)`; `handleChange` calls `onChange?.(event)` then `group?.onChange?.(event.currentTarget.value)`.

`Radio.module.css` mirrors `Checkbox.module.css`: `.label` inline-flex with `var(--font)`/`var(--text)`; both `[data-size='sm']` (gap 6px, `var(--font-size)`) and `[data-size='md']` (gap 8px, `var(--font-size-md)`) blocks; `.box` sized `var(--control-size-sm)`, `accent-color: var(--color-blue-600)`, `margin: 0`; `[data-size='md'] .box` uses `var(--control-size)`; `:focus-visible` outline `2px solid var(--focus-ring)` offset 2px; disabled stays muted (`accent-color: var(--text-muted)`, `cursor: not-allowed`).

`index.ts` re-exports the component and types.

- [ ] **Step 4: Implement `RadioGroup`**

`RadioGroup.tsx` exports `RadioGroupContext` and the `RadioGroupCtx` type from the same file (`Form.tsx` does the same with `FormErrorsContext`). Ids via `useId()` for hint/error plus one for a generated name. `resolvedError = error ?? (name ? contextErrors[name] : undefined)`. `describedBy` joins `rest['aria-describedby']`, the hint id and the error id. Render `<fieldset {...rest} role="radiogroup" aria-required={required ? 'true' : undefined} aria-invalid={resolvedError ? 'true' : undefined} aria-describedby={describedBy} data-size={size} data-orientation={orientation}>`; legend first (with the `*` marker `aria-hidden`), then hint, then `<div className={styles.options}><RadioGroupContext.Provider value={{ name: name ?? generatedName, value, defaultValue, size: size ?? 'sm', onChange }}>{children}</…></div>`, then the error `role="alert"`.

`RadioGroup.module.css`: fieldset reset (`border: 0; padding: 0; margin: 0`), grid gap 6px, both size variants (font-size), `.legend` weight 600, `.required` `var(--danger)`, `.hint`/`.error` 12px muted/danger, `.options` column gap 6px, `[data-orientation='horizontal'] .options` row + wrap.

- [ ] **Step 5: Run the two tests**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Radio src/RadioGroup`
Expected: PASS.

- [ ] **Step 6: Add the remaining behaviour tests**

`Radio.test.tsx`:

- `defaultChecked` renders checked;
- `disabled` blocks a label click (`onChange` not called, stays unchecked);
- `data-size` sm/md on the label;
- inside a group: fires its own `onChange` before the group's (use a shared `order: string[]` and assert order + one call each).

`RadioGroup.test.tsx`:

- two groups get different generated names (render two, compare `name`s);
- uncontrolled `defaultValue` checks the matching radio;
- hint and error ids land in the fieldset `aria-describedby`; error sets `aria-invalid="true"` and renders `role="alert"`;
- `<Form errors={{ channel: 'Chọn một kênh' }}>` + `name="channel"` renders that error; an explicit `error` prop wins;
- `required` renders the marker `*` and `aria-required="true"`;
- `orientation="horizontal"` and `size="md"` land as `data-*`; a radio with `size="sm"` inside keeps `sm` (read the label's `data-size`);
- clicking a radio calls the group `onChange` exactly once.

Add to `Form.test.tsx`:

- `Field` + `Radio`: exactly one `<label>` is rendered (the radio's own) and `getByRole('radio', { name: 'Email' })` matches — the heading text is a `<span>`, not a second label;
- `Field` + `Checkbox` still behaves as before.

Update `Field.tsx`: import `Radio` and add `children.type === Radio` to the `selfLabelled` expression. Update `packages/components/src/index.ts` with the four exports (`Radio`, `RadioProps`, `RadioGroup`, `RadioGroupProps`; `RadioGroupCtx` stays unexported from the package root — internal plumbing).

- [ ] **Step 7: Mutant check**

Back up and revert, one at a time; confirm the named test fails; restore with `cp`:

1. group passes `name: undefined` to context → "sharing one generated name" fails.
2. `checked` precedence inverted (`group.value !== value`) → "controlled value marks the matching radio" fails.
3. group `onChange` not forwarded from `Radio` → "reports the pick" fails.
4. callback order flipped (group first) → the order test fails.
5. `contextErrors[name]` lookup removed → the `Form errors` test fails.
6. hint/error omitted from the fieldset's `aria-describedby` → the wiring test fails.
7. `role="radiogroup"` replaced with `role="group"` → the named-radiogroup test fails.
8. `aria-required` dropped → the required test fails.
9. size cascade dropped (`size: undefined` in context) → the per-radio override test fails.
10. `selfLabelled` loses `Radio` → "exactly one label" fails.

Expected: 10/10 caught.

- [ ] **Step 8: Commit**

```bash
git add packages/components/src/Radio packages/components/src/RadioGroup packages/components/src/Form packages/components/src/index.ts
git commit -m "feat(forms): add Radio and RadioGroup"
```

---

### Task 2: `Switch` (+ `--switch-track-on` token)

**Files:**

- Create: `packages/components/src/Switch/types.ts`
- Create: `packages/components/src/Switch/Switch.tsx`
- Create: `packages/components/src/Switch/Switch.module.css`
- Create: `packages/components/src/Switch/index.ts`
- Create: `packages/components/src/Switch/Switch.test.tsx`
- Modify: `packages/tokens/tokens.css` (root default)
- Modify: `packages/tokens/theme-dark.css` (dark override)
- Modify: `packages/tokens/tokens.test.mjs` (guards)
- Modify: `packages/components/src/Form/Field.tsx` (self-labelled list)
- Modify: `packages/components/src/Form/Form.test.tsx` (double-label pin)
- Modify: `packages/components/src/index.ts` (exports)

**Interfaces:**

- Consumes: `cx` from `../internal/cx`.
- Produces:
  - `export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> { children: ReactNode; size?: 'sm' | 'md' }`
  - `export function Switch(props: SwitchProps): JSX.Element`
  - DOM contract: `<label data-size><span class="control"><input type="checkbox" role="switch" class="input"><span class="thumb" aria-hidden="true"></span></span>{children}</label>`; every native input prop (`checked`/`defaultChecked`/`disabled`/`onChange`/`name`…) passes through.
  - New token `--switch-track-on`: `var(--color-blue-600)` in `tokens.css`, `var(--color-blue-500)` inside `[data-theme='dark']`.

- [ ] **Step 1: Write the failing tests**

Create `Switch.test.tsx`:

```tsx
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Switch } from './Switch';

test('exposes a switch role named by its label, backed by a checkbox', () => {
  render(<Switch defaultChecked>Thông báo email</Switch>);
  const input = screen.getByRole('switch', { name: 'Thông báo email' });
  expect(input).toHaveAttribute('type', 'checkbox');
  expect(input).toBeChecked();
});

test('controlled checked + onChange reflect the caller state', () => {
  function Wrapper() {
    const [on, setOn] = useState(false);
    return (
      <Switch checked={on} onChange={(event) => setOn(event.currentTarget.checked)}>
        Bật thông báo
      </Switch>
    );
  }
  render(<Wrapper />);
  const input = screen.getByRole('switch', { name: 'Bật thông báo' });
  fireEvent.click(input);
  expect(input).toBeChecked();
});

test('label click toggles the switch', () => {
  render(<Switch>Nhận tin</Switch>);
  fireEvent.click(screen.getByText('Nhận tin'));
  expect(screen.getByRole('switch', { name: 'Nhận tin' })).toBeChecked();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Switch`
Expected: FAIL — cannot resolve `./Switch`.

- [ ] **Step 3: Implement `Switch` and the token**

`types.ts` per Interfaces. `Switch.tsx`: destructure `size = 'sm'`, `className`, `children`, `...rest`; render the DOM contract above, `className` on the `<label>` (`cx` merge), `{...rest}` on the input.

`Switch.module.css` — colours from tokens only:

- `.control` `position: relative`, inline-flex, 32×18 (sm) / 40×22 (md), `flex-shrink: 0`;
- `.input` `appearance: none`, full size, `border-radius: 999px`, off fill `var(--surface-muted)` + `1px solid var(--text-muted)`, `cursor: pointer`, `transition: background 120ms`;
- `.input:checked` fill+border `var(--switch-track-on)`;
- `.thumb` 2px inset, `var(--control-size-sm)`-ish maths: sm 14px / md 18px circle, `background: var(--on-primary)`, `border: 1px solid var(--text-muted)`, `box-shadow: var(--shadow-sm)`, `pointer-events: none`, `transition: transform 120ms`; `.input:checked + .thumb` translates 14px (sm) / 16px (md);
- `.input:focus-visible` outline `2px solid var(--focus-ring)`, offset 2px;
- disabled: track `var(--surface-muted)`/`var(--border)`, thumb `var(--text-muted)`, label text `var(--text-muted)`, `cursor: not-allowed`;
- `@media (prefers-reduced-motion: reduce) { .input, .thumb { transition: none } }`;
- both `[data-size='sm']` and `[data-size='md']` blocks present.

Tokens:

- `tokens.css` `:root`: `--switch-track-on: var(--color-blue-600);` with a one-line comment;
- `theme-dark.css` `[data-theme='dark']`: `--switch-track-on: var(--color-blue-500);` with a one-line comment (blue-600 is only ~2.4:1 on the dark page; blue-500 ~4.9:1; a light subtree inside a dark page can inherit blue-500, still ≥3:1 on white).

Add guards to `tokens.test.mjs` after the blocked-pair block:

```js
// Switch track: root keeps the brand blue; dark lightens it so the checked track
// stays ≥3:1 against the dark page.
assertThemeTokens('root', readTokenFile('tokens.css'), ':root', {
  '--switch-track-on': 'var(--color-blue-600)',
});
assertThemeTokens('dark', darkCss, '[data-theme="dark"]', {
  '--switch-track-on': 'var(--color-blue-500)',
});
```

- [ ] **Step 4: Run the tests**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Switch` and `node packages/tokens/tokens.test.mjs`
Expected: PASS.

- [ ] **Step 5: Add the remaining tests and field plumbing**

`Switch.test.tsx`:

- `disabled` does not toggle and does not call `onChange`;
- `size="md"` and the default `sm` land on the label `data-size`;
- module CSS pins: reads `--switch-track-on` and `--on-primary`, contains a `.input:checked` rule and an `.input:checked + .thumb` transform, keeps the thumb `border`, and has no hex (`readFileSync` + regex `/#[0-9a-f]{3,8}/i` is `null`).

`Form.test.tsx`: `Field` + `Switch` renders exactly one `<label>` and the switch's name is its own text.

`Field.tsx`: add `children.type === Switch` to `selfLabelled`. `index.ts`: export `Switch` + `SwitchProps`.

- [ ] **Step 6: Mutant check**

1. `role="switch"` removed → role test fails.
2. dark `--switch-track-on` override removed → token guard fails.
3. `[data-size='md']` block removed → `css-conventions.test.ts` fails.
4. `selfLabelled` loses `Switch` → "exactly one label" fails.
5. thumb `border` removed → the CSS pin fails.
6. `.input:checked + .thumb` rule removed → the checked-state CSS pin fails.

Expected: 6/6 caught.

- [ ] **Step 7: Commit**

```bash
git add packages/components/src/Switch packages/components/src/Form packages/components/src/index.ts packages/tokens
git commit -m "feat(forms): add Switch with a theme-safe track token"
```

---

### Task 3: `Textarea`

**Files:**

- Create: `packages/components/src/Textarea/types.ts`
- Create: `packages/components/src/Textarea/Textarea.tsx`
- Create: `packages/components/src/Textarea/Textarea.module.css`
- Create: `packages/components/src/Textarea/index.ts`
- Create: `packages/components/src/Textarea/Textarea.test.tsx`
- Modify: `packages/components/src/index.ts` (exports)

**Interfaces:**

- Produces:
  - `export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> { size?: 'sm' | 'md'; error?: string }`
  - `export function Textarea(props: TextareaProps): JSX.Element`
  - DOM contract: `<span class="wrap"><textarea data-size rows aria-invalid? aria-describedby?></textarea><span role="alert">error?</span></span>`; `className` lands on the `<textarea>`; `error` appends its generated id to the caller's `aria-describedby` (caller ids first) and sets `aria-invalid="true"`.
  - `rows` defaults to 3 when not passed.

- [ ] **Step 1: Write the failing test**

Create `Textarea.test.tsx`:

```tsx
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

test('renders a textarea with three rows by default', () => {
  render(<Textarea aria-label="Ghi chú" />);
  const field = screen.getByRole('textbox', { name: 'Ghi chú' });
  expect(field.tagName).toBe('TEXTAREA');
  expect(field).toHaveAttribute('rows', '3');
});

test('error sets aria-invalid, links its id and announces', () => {
  render(<Textarea aria-label="Ghi chú" aria-describedby="hint-1" error="Bắt buộc" />);
  const field = screen.getByRole('textbox', { name: 'Ghi chú' });
  const describedBy = field.getAttribute('aria-describedby') ?? '';
  expect(field).toHaveAttribute('aria-invalid', 'true');

  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Bắt buộc');
  // caller id first, generated error id appended
  expect(describedBy.split(' ')[0]).toBe('hint-1');
  expect(describedBy.split(' ')).toContain(alert.id);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Textarea`
Expected: FAIL — cannot resolve `./Textarea`.

- [ ] **Step 3: Implement `Textarea`**

Mirror `Input.tsx`: `useId` for the auto id and error id, join `aria-describedby` caller-first, `aria-invalid={error ? 'true' : ariaInvalid}`, wrapper `<span className={styles.wrap}>`, `rows = 3` default. `Textarea.module.css` matches `Input.module.css` plus: `.wrap { display: grid; gap: 4px }` (block-level, fills the container), `.textarea { inline-size: 100% }`, `box-sizing: border-box`, `resize: vertical`, `font-family: var(--font)`, both `[data-size='sm']`/`[data-size='md']` padding blocks, focus-visible outline `2px solid var(--focus-ring)`, `[aria-invalid='true']` border `var(--danger)`, disabled muted. `index.ts` + root exports.

- [ ] **Step 4: Run the test**

Run: `npm run test --workspace=@enterprise-ui/components -- --run src/Textarea`
Expected: PASS.

- [ ] **Step 5: Add the remaining tests**

- controlled `value` + `onChange` round-trip;
- a caller `rows={6}` wins over the default;
- `disabled` passes through;
- a caller `className` merges with the module class on the `<textarea>`.

- [ ] **Step 6: Mutant check**

1. `error` stops setting `aria-invalid` → error test fails.
2. error id dropped from `aria-describedby` → error test fails.
3. default `rows` removed → default test fails.
4. caller id moved after the error id → order assertion fails.

Expected: 4/4 caught.

- [ ] **Step 7: Commit**

```bash
git add packages/components/src/Textarea packages/components/src/index.ts
git commit -m "feat(forms): add Textarea"
```

---

### Task 4: Docs pages and demos

**Files:**

- Create: `apps/docs/src/components/demos/RadioDemo.tsx`
- Create: `apps/docs/src/components/demos/SwitchDemo.tsx`
- Create: `apps/docs/src/components/demos/TextareaDemo.tsx`
- Create: `apps/docs/src/content/docs/components/radio.mdx`
- Create: `apps/docs/src/content/docs/components/switch.mdx`
- Create: `apps/docs/src/content/docs/components/textarea.mdx`
- Modify: `apps/docs/src/content/docs/components.mdx` (three Primitives cards)
- Modify: `apps/docs/src/content/docs/components/form.mdx` (self-labelled paragraph)

**Interfaces:**

- Consumes: `Radio`, `RadioGroup`, `Switch`, `Textarea`, `Input` from `@enterprise-ui/components`; shared classes from `./demos.module.css`; `Demo` from `../../../components/Demo.astro`.
- Produces: three `client:visible` demo islands and three MDX pages following `checkbox.mdx`'s shape (frontmatter → live `<Demo>` → `## Cách dùng` snippet → `## Props` table → `## Accessibility`).

- [ ] **Step 1: Write the demos**

`RadioDemo.tsx`: a controlled `RadioGroup` (kanal options) showing the selected value, plus a horizontal group and a disabled option. `SwitchDemo.tsx`: two controlled switches (email, digest) with a live "đang bật" summary and one disabled. `TextareaDemo.tsx`: controlled note field with `rows={4}` and an error example. All Vietnamese copy, reuse `.stack`/`.section`/`.sectionTitle`/`.row`/`.helper` from `demos.module.css`.

- [ ] **Step 2: Write the MDX pages**

Each page documents the exact props the interfaces above define, including: manual `name` vs generated name, `value` being required on `Radio` and unique per group, `defaultValue` only seeding the first render, uncontrolled groups relying on native radio grouping, `role="radiogroup"` naming, `Field` + `Radio`/`Switch` being valid while `RadioGroup` is not wrapped in `Field`, the switch being a native checkbox announced as a switch, and textarea `rows` default. Snippets are self-contained (`import` lines included) and there is exactly one fenced `tsx` usage block per page beyond the props table (the checker typechecks every fence; keep them all valid).

- [ ] **Step 3: Update the index and form page**

`components.mdx`: add `RadioGroup`/`Radio`, `Switch`, `Textarea` cards to the Primitives grid (one line each: what they are). `form.mdx`: one paragraph — `Checkbox`, `Radio` and `Switch` label themselves, so `Field` renders its label as a heading; use `RadioGroup` directly, it carries its own legend/error.

- [ ] **Step 4: Run the docs checks**

Run: `npm run docs:snippets` → `npm run typecheck --workspace=@enterprise-ui/docs` → `npm run build --workspace=@enterprise-ui/docs`
Expected: all succeed, 3 new pages build.

- [ ] **Step 5: Commit**

```bash
git add apps/docs
git commit -m "docs(forms): document radio, switch and textarea"
```

---

### Task 5: Full gate, mutants, PR

**Files:** none new; this is the verification and handoff task.

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: tokens ok; components suite passes with the new tests (record the count); demo-shared passes.

- [ ] **Step 2: Typecheck, snippets, lint, format**

Run: `npm --workspaces run typecheck --if-present` → `npm run docs:snippets` → `npm run lint` → `npm run format:check`
Expected: all clean (fix drift with `npm run format`, then re-check).

- [ ] **Step 3: Three builds**

Run: `npm run build --workspace=@enterprise-ui/components` → `--workspace=@enterprise-ui/showcase` → `--workspace=@enterprise-ui/docs`
Expected: success; components bundle stays under the 150 KiB gzip limit.

- [ ] **Step 4: Mutants (aggregate)**

Run the 10 + 6 + 4 cases from Tasks 1, 2, 3 in one pass (any script/harness is fine as long as each mutant is applied to a `cp` backup and restored with `cp`). Expected: 20/20 caught.

- [ ] **Step 5: Browser sanity check on the built docs**

Build docs, serve `apps/docs/dist` (`npx astro preview` or any static server), and check: radio group keyboard selection and `aria-checked`, switch renders in light + dark with a visible track boundary, textarea error state. Toggle theme via the site's theme switcher.

- [ ] **Step 6: Commit (if anything moved), push, PR**

```bash
git push -u origin feat/p4-form-controls
gh pr create --title "feat(forms): add Radio, RadioGroup, Switch and Textarea" --body "..."
```

PR body: spec + plan links; the four components' API summaries; docs routes; the gate table (test counts, typecheck, snippets, lint, format, builds, mutants 20/20); the Review Focus list from this plan.

## Self-Review

**Spec coverage:** §4.1 Radio → Task 1 Steps 3, 6; §4.2 RadioGroup incl. D1–D5, `role="radiogroup"` → Task 1 Steps 4, 6; §4.3 Switch + D6 → Task 2; §4.4 Textarea + D7 → Task 3; §4.5 Field composition → Tasks 1/2 Step 6; §5 a11y → per-task tests; §6.1 token + thumb contrast → Task 2 Steps 3, 6; §7 docs → Task 4; §8 tests/mutants → Tasks 1–3 + Task 5; §10 one PR → Task 5.

**Reviewed and corrected after the builder read the draft:** `Radio.value`/`children` and `Switch.children` are required; the group is a `radiogroup` (so `aria-required`/`aria-invalid` are supported) named by its `<legend>` — the explicit `aria-labelledby` was dropped after a mutant showed the legend already names the fieldset; `Field`'s `selfLabelled` list grows to `Radio`/`Switch`; radio callbacks compose caller-first; the switch needs `--switch-track-on` for dark contrast. The spec's "Space toggles" test became "input keeps `type="checkbox"`" because jsdom implements no keyboard default actions — the plan pins the native mechanism instead.

**Type consistency:** `RadioProps`/`RadioGroupProps`/`RadioGroupCtx`/`SwitchProps`/`TextareaProps` names and prop names (`value`, `defaultValue`, `onChange(value)`, `legend`, `orientation`) are identical across Tasks 1–4 and match the docs prop tables.
