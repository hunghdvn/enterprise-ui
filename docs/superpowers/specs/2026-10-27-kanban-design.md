# Kanban Design Spec (P3 — Kanban board)

Date: 2026-10-27
Status: Approved (scope confirmed by user: drag-and-drop between columns)
Base: `docs/superpowers/specs/2026-10-11-enterprise-ui-design.md` (P3 templates)

## 1. Intent & why

P3 adds composed screen templates. Kanban is a column-based board for
tracking work items across stages. It stays a presentational layout shell —
no fetching, no business logic; the parent owns columns/cards and handles
moves.

## 2. Goals / Non-goals

Goals:

- G1: `Kanban` board with columns of cards, native HTML5 drag-and-drop
  (zero runtime deps), controlled via `columns` + `onMove`.
- G2: Card shows title, tags, assignee (avatar + name), due date, priority.
- G3: Column header with title + count + optional add action.
- G4: Keyboard-accessible move (move up/down within column, move between
  columns) — at minimum, drag via mouse; keyboard move via buttons.
- G5: Showcase demo + docs page.

Non-goals: swimlanes, WIP limits enforcement, virtualization, inline editing,
nested sub-tasks, persistence.

## 3. Constraints

Zero runtime deps; TS strict, no `any`; CSS Modules + `var(--…)` only;
presentational-only; folder layout `Kanban.tsx + Kanban.module.css + types.ts +
index.ts + Kanban.test.tsx` + root re-export; Vitest globals on.

## 4. API

```ts
export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  assignee?: { name: string; avatar?: string };
  due?: string; // ISO or display string
  priority?: 'low' | 'medium' | 'high';
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string; // optional accent token name or css color (use var)
}

export interface KanbanProps {
  columns: KanbanColumn[];
  onMove?: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  onAddCard?: (columnId: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}
```

Behavior:

- Desktop: horizontal columns side-by-side, scroll horizontally if overflow.
- Drag a card onto another column (or empty column) → calls `onMove`.
- Visual feedback: dragging card opacity; drop target column highlighted.
- Mobile: columns stack vertically, scroll.
- Keyboard: each card has move-left/move-right buttons (when >1 column) and
  move up/down within column (when >1 card).

## 5. A11y

- Cards are draggable with `aria-grabbed`? Use native draggable. Provide
  `role="button"`? Cards are articles; drag handle. Use `aria-label` on card.
- Drop zones announced via `aria-dropeffect`.
- Focus management: after move, focus the moved card in new position (best effort).

## 6. Tests

- renders columns + cards
- drag move calls onMove with correct args
- onCardClick fires
- onAddCard fires per column
- disabled? (not in API; skip)
- empty column renders drop zone
