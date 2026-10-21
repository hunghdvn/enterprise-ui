# File Upload — Design Spec (Sub-project: P2)

**Date:** 2026-10-21
**Status:** Approved (owner: "quay lại kế hoạch chính" — P2 item thứ ba sau Saved Views #23, Tree #24).
**Base:** `main` `4ae8f9f` (sau chuỗi 8 phần docs-site; Saved Views/Tree merged).

## 1. Intent & why

- ERP cần upload chứng từ (PO, invoice, attachment). Native `<input type="file">` styled kém; drag-drop
  là kỳ vọng hiện đại. Presentational-only: parent sở hữu file list + upload progress.

## 2. Goals / Non-goals

Goals:

- **G1** Vùng drop (button a11y) + click-to-select qua input file ẩn; drag-over highlight.
- **G2** Hiển thị danh sách file đã chọn: tên, kích thước (định dạng KB/MB), loại, nút xoá.
- **G3** `accept` (mime filter) truyền xuống input; `multiple`; `disabled`.
- **G4** A11y: drop zone `role="button"` + `aria-label`, Enter/Space mở picker, danh sách file là
  `<ul>`/`<li>`, nút × per row.
- **G5** IME-safe không liên quan (không input text) — N/A.
- **G6** Controlled: `files` + `onSelect(File[])` + `onRemove(index)` — parent xử lý accept/maxSize/
  progress/upload.

Non-goals:

- **N1** Progress bar per file (parent render slot) — sau.
- **N2** Upload thật (parent).
- **N3** Preview thumbnail (parent).
- **N4** `maxSize` enforcement — parent validate và báo lỗi; component chỉ dev-warn nếu `accept` mismatch.

## 3. Components & API

```ts
export interface UploadedFile {
  name: string;
  size: number; // bytes
  type: string; // mime
}

export interface FileUploadProps {
  files: UploadedFile[];
  onSelect: (files: File[]) => void;
  onRemove: (index: number) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  dragLabel?: string;
  className?: string;
  'aria-label'?: string;
}
```

- Drop zone: button (role implicit button) với `onClick` → `input.click()`; `onKeyDown` Enter/Space;
  `onDragOver`/`onDrop` preventDefault + highlight state.
- File list: `<ul>`/`<li>` với name + formatted size + type badge + × button.
- Icon: `upload` (IconName có 'upload' ✓), `x`, `file` (IconName? có 'file'? No — IconName has no 'file'/'paperclip'. Use 'copy' or 'inbox'... Actually list uses 'file' — check IconName: no 'file'. Use 'upload' for the zone and no icon per row (text only) OR 'copy' (copy icon). Let me use no per-row icon to avoid invalid names. Actually 'inbox' exists — use it for empty state. Use 'upload' for the zone.)

## 4. Decisions

- **D1** Component mới `FileUpload/` — không nhét vào Form/Field (Field wraps inputs; FileUpload là composite).
- **D2** `files` là metadata array (name/size/type) — parent giữ File[] thật và pass metadata; component
  không bao giờ đụng File API.
- **D3** `accept` truyền xuống input; không validate mime ở component (parent owns policy).
- **D4** Dev-warn khi `files` có entry mà `accept` mismatch? Skip — parent owns policy. Dev-warn chỉ cho
  duplicate name (giống Combobox #14) — nhẹ.
- **D5** Docs page `pages/data/FileUploadPage.tsx` + route; demo với fake files (không cần upload thật).

## 5. Risks

- Drag-drop keyboard a11y: drop zone phải là button (Enter/Space) — test.
- Drag-over state phải reset khi dragleave/drop.

## 6. Open questions

- Không.
