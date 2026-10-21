# Tree — Design Spec (Sub-project: P2, "Tree/Org")

**Date:** 2026-10-21
**Status:** Approved (owner: tiếp tục kế hoạch chính — P2 item kế tiếp sau SavedViews #23).
**Base:** `main` `f2158d9`. Composes với Icon system; pattern keyboard/ARIA từ Combobox/SplitView/SavedViews.

## 1. Intent & why

- Dữ liệu ERP phân cấp: danh mục kho, cơ cấu tổ chức, nhóm ngành hàng. Cần một Tree
  presentational-only: expand/collapse theocontrolled state, chọn node, render nhãn tuỳ ý.

## 2. Goals / Non-goals

Goals:

- **G1** `Tree<T>`: dữ liệu `{ id, label, children?, disabled? }` (đệ quy qua `children`).
- **G2** Controlled: `expandedIds: string[]`, `onToggleExpand(id)`, `selectedId: string | null`,
  `onSelect(id)` — parent sở hữu toàn bộ state.
- **G3** ARIA đúng APG tree: `role="tree"`, `role="treeitem"`, `aria-expanded` (node có con),
  `aria-selected`, `aria-level`, group con là `role="group"`.
- **G4** Keyboard theo APG tree: ↑↓ di chuyển giữa các node hiển thị, → mở/đi vào con, ← đóng/về
  cha, Enter/Space chọn. Focus theo roving tabindex (treeitem focusable — KHÔNG dùng
  activedescendant cho tree vì node con lồng nhau).
- **G5** Icon chevron xoay theo expanded; disabled node không chọn được nhưng vẫn điều hướng.
- **G6** Indent theo level (`paddingInlineStart: calc((level-1)*16px + 8px)`).

Non-goals:

- **N1** Org-chart vẽ đường nối (cây text/indent là đủ cho P2; org-chart canvas để sau).
- **N2** Multi-select tree (chỉ single-select v1).
- **N3** Lazy-load children (parent tự nạp và truyền xuống).
- **N4** Drag-and-drop sắp xếp.

## 3. Components & API

```ts
export interface TreeNode {
  id: string;
  label: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps {
  nodes: TreeNode[];
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
  selectedId: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  'aria-label'?: string;
}
```

- Focus roving: treeitem trong tree có `tabIndex` 0/-1 (node "active" giữ tabIndex 0); ↑↓→←← xử
  lý trên container `onKeyDown`, hành động lên node đang active (ref map theo id).
- Active node mặc định = node hiển thị đầu tiên; sau khi parent xoá node → clamp về node hiển thị
  đầu tiên (bài học clamp Combobox #9c / SavedViews #1).

## 4. Decisions

- **D1** Component mới `Tree/` — không nhét vào Table (datagrid có group riêng).
- **D2** Flat list ẩn: render đệ quy nhưng visible-nodes được derive (mảng phẳng theo thứ tự màn
  hình) để keyboard di chuyển đúng — điểm dễ lỗi nhất của tree.
- **D3** Icon `chevron-down` xoay -90° khi collapsed (CSS transform) — không thêm icon mới.
- **D4** Docs page `pages/data/TreePage.tsx` — demo cơ cấu tổ chức 3 cấp, self-contained snippet
  (không backtick lồng — chuẩn S8).

## 5. Risks

- Keyboard APG tree là pattern dễ sai nhất trong cả bộ (roving tabindex + → ← ngữ nghĩa). Test
  phải pin: thứ tự visible, →/← theo cấp, disabled vẫn đi qua, clamp khi parent xoá node.

## 6. Open questions

- Không — single-select + indent tree khoá scope.
