import { fireEvent, render, screen } from '@testing-library/react';
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
