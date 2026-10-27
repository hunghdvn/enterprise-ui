import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Kanban } from './Kanban';
import type { KanbanColumn } from './types';

const columns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To do',
    cards: [
      {
        id: 'c1',
        title: 'Task one',
        tags: ['ui'],
        priority: 'high',
        assignee: { name: 'An' },
        due: '20/10',
      },
      { id: 'c2', title: 'Task two' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 'c3', title: 'Task three' }],
  },
];

test('renders columns and cards', () => {
  render(<Kanban columns={columns} />);
  expect(screen.getByText('To do')).toBeInTheDocument();
  expect(screen.getByText('Done')).toBeInTheDocument();
  expect(screen.getByText('Task one')).toBeInTheDocument();
  expect(screen.getByText('Task three')).toBeInTheDocument();
});

test('column count badge shows number of cards', () => {
  render(<Kanban columns={columns} />);
  expect(screen.getByText('To do').parentElement).toHaveTextContent('2');
  expect(screen.getByText('Done').parentElement).toHaveTextContent('1');
});

test('onCardClick fires with the card', () => {
  const onCardClick = vi.fn();
  render(<Kanban columns={columns} onCardClick={onCardClick} />);
  fireEvent.click(screen.getByText('Task one'));
  expect(onCardClick).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'c1', title: 'Task one' }),
  );
});

test('Enter on a card fires onCardClick', () => {
  const onCardClick = vi.fn();
  render(<Kanban columns={columns} onCardClick={onCardClick} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  fireEvent.keyDown(card, { key: 'Enter' });
  expect(onCardClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));
});

test('onAddCard fires with column id', () => {
  const onAddCard = vi.fn();
  render(<Kanban columns={columns} onAddCard={onAddCard} />);
  const addBtns = screen.getAllByRole('button', { name: /Thêm thẻ/i });
  fireEvent.click(addBtns[0]);
  expect(onAddCard).toHaveBeenCalledWith('todo');
});

test('empty column renders drop zone', () => {
  render(<Kanban columns={[{ id: 'empty', title: 'Empty', cards: [] }]} />);
  expect(screen.getByText(/Kéo thả thẻ/i)).toBeInTheDocument();
});

test('dragging a card onto another card calls onMove once', () => {
  const onMove = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const targetCard = screen.getByText('Task three').closest('article') as HTMLElement;
  fireEvent.dragStart(card);
  fireEvent.dragOver(targetCard);
  fireEvent.drop(targetCard);
  expect(onMove).toHaveBeenCalledTimes(1);
  expect(onMove).toHaveBeenCalledWith('c1', 'todo', 'done', 0);
});

test('dragging a card onto column body appends', () => {
  const onMove = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const targetCol = screen.getByText('Done').closest('section') as HTMLElement;
  const body = targetCol.querySelector('.column-body, [class*="column-body"]') as HTMLElement;
  fireEvent.dragStart(card);
  fireEvent.dragOver(body);
  fireEvent.drop(body);
  expect(onMove).toHaveBeenCalledWith('c1', 'todo', 'done', 1);
});

test('move buttons: right moves to next column', () => {
  const onMove = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const moveRight = card.querySelector('[aria-label="Chuyển sang cột sau"]') as HTMLElement;
  fireEvent.click(moveRight);
  expect(onMove).toHaveBeenCalledWith('c1', 'todo', 'done', 0);
});

test('move-left disabled in first column', () => {
  render(<Kanban columns={columns} onMove={() => {}} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const moveLeft = card.querySelector('[aria-label="Chuyển sang cột trước"]') as HTMLButtonElement;
  expect(moveLeft).toBeDisabled();
});

test('move-right disabled in last column', () => {
  render(<Kanban columns={columns} onMove={() => {}} />);
  const card = screen.getByText('Task three').closest('article') as HTMLElement;
  const moveRight = card.querySelector('[aria-label="Chuyển sang cột sau"]') as HTMLButtonElement;
  expect(moveRight).toBeDisabled();
});

test('move up/down within column', () => {
  const onMove = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} />);
  const card = screen.getByText('Task two').closest('article') as HTMLElement;
  const moveUp = card.querySelector('[aria-label="Di chuyển lên"]') as HTMLElement;
  fireEvent.click(moveUp);
  expect(onMove).toHaveBeenCalledWith('c2', 'todo', 'todo', 0);
});

test('column color applies border', () => {
  render(<Kanban columns={[{ id: 'x', title: 'X', cards: [], color: 'red' }]} />);
  const col = screen.getByText('X').closest('section') as HTMLElement;
  expect(col.style.borderLeft).toContain('red');
});

test('dragstart sets dataTransfer data', () => {
  render(<Kanban columns={columns} onMove={() => {}} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const dt = { setData: vi.fn(), effectAllowed: '' };
  fireEvent.dragStart(card, { dataTransfer: dt });
  expect(dt.setData).toHaveBeenCalledWith('text/plain', 'c1');
  expect(dt.effectAllowed).toBe('move');
});

test('Space on a card fires onCardClick', () => {
  const onCardClick = vi.fn();
  render(<Kanban columns={columns} onCardClick={onCardClick} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  fireEvent.keyDown(card, { key: ' ' });
  expect(onCardClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'c1' }));
});

test('move-down within column', () => {
  const onMove = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const moveDown = card.querySelector('[aria-label="Di chuyển xuống"]') as HTMLElement;
  fireEvent.click(moveDown);
  expect(onMove).toHaveBeenCalledWith('c1', 'todo', 'todo', 1);
});

test('Enter on move button moves and does not trigger card click', () => {
  const onMove = vi.fn();
  const onCardClick = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} onCardClick={onCardClick} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const moveRight = card.querySelector('[aria-label="Chuyển sang cột sau"]') as HTMLElement;
  fireEvent.keyDown(moveRight, { key: 'Enter' });
  fireEvent.click(moveRight);
  expect(onMove).toHaveBeenCalled();
  expect(onCardClick).not.toHaveBeenCalled();
});

test('focus restores to moved card after controlled update', () => {
  function Harness() {
    const [cols, setCols] = useState(columns);
    return (
      <Kanban
        columns={cols}
        onMove={(cardId, from, to, toIndex) => {
          setCols((prev) => {
            const next = prev.map((c) => ({ ...c, cards: [...c.cards] }));
            const fromCol = next.find((c) => c.id === from)!;
            const toCol = next.find((c) => c.id === to)!;
            const idx = fromCol.cards.findIndex((c) => c.id === cardId);
            const [card] = fromCol.cards.splice(idx, 1);
            toCol.cards.splice(toIndex, 0, card);
            return next;
          });
        }}
      />
    );
  }
  render(<Harness />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const moveRight = card.querySelector('[aria-label="Chuyển sang cột sau"]') as HTMLElement;
  fireEvent.click(moveRight);
  const moved = screen.getByText('Task one').closest('article') as HTMLElement;
  expect(document.activeElement).toBe(moved);
});

test('focus not stolen when consumer rejects move', async () => {
  const onMove = vi.fn(); // does not update columns
  const { rerender } = render(<Kanban columns={columns} onMove={onMove} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const moveRight = card.querySelector('[aria-label="Chuyển sang cột sau"]') as HTMLButtonElement;
  moveRight.focus();
  expect(document.activeElement).toBe(moveRight);
  fireEvent.click(moveRight);
  // consumer rejects: columns identity stays the same on a later update
  rerender(<Kanban columns={columns} onMove={onMove} />);
  // focus must remain on the button, not jump to the card
  expect(document.activeElement).toBe(moveRight);
});
