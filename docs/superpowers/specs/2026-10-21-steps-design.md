# Steps / Wizard — Design Spec (Sub-project: P2)

**Date:** 2026-10-21
**Status:** Approved (owner: "quay lại kế hoạch chính" — P2 item thứ tư sau Saved Views #23, Tree #24).
**Base:** `main` `4ae8f9f`.

## 1. Intent & why

- ERP cần thanh tiến trình cho wizard nhiều bước (tạo đơn, onboarding). Presentational-only:
  parent sở hữu `currentStep` và nội dung từng bước.

## 2. Goals / Non-goals

Goals:

- **G1** `Steps`: `steps: Step[]`, `currentStep` (0-based; `= steps.length` = hoàn tất), `onChange(index)`.
- **G2** Marker 1..N: done (check icon), current (primary), upcoming (muted); optional hint;
  completed steps clickable để quay lại.
- **G3** A11y: `aria-current="step"` trên bước hiện tại; marker `aria-label` từ `label` (string)
  hoặc số thứ tự; `disabled` blocks all.
- **G4** Empty steps: không render marker, không crash.

Non-goals:

- **N1** Nội dung từng bước (parent render theo `currentStep`).
- **N2** Validation giữa bước (parent).
- **N3** Rename/reorder steps (parent).

## 3. Components & API

```ts
export interface Step {
  id: string;
  label: ReactNode;
  description?: string;
  optional?: boolean;
  ariaLabel?: string;
}

export interface StepsProps {
  steps: Step[];
  currentStep: number;
  onChange?: (index: number) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}
```

## 4. Decisions

- **D1** Component mới `Steps/` — không nhét vào Table/Form.
- **D2** `description?` render dưới label (muted, 12px).
- **D3** `aria-label` marker = `step.ariaLabel ?? (typeof label === 'string' ? label : `${index+1}`)`.
- **D4** Dev-warn duplicate ids (Combobox #14 pattern).
- **D5** Docs page `pages/data/StepsPage.tsx` + route; snippet self-contained (S8).

## 5. Risks

- Empty steps phải không render "Hoàn tất tất cả..." — guard `isDone && total > 0`.

## 6. Open questions

- Không.
