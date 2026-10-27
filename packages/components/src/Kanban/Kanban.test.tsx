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
  expect(screen.getAllByText('2')).toHaveLength(1); // todo count
});

test('column count badge shows number of cards', () => {
  render(<Kanban columns={columns} />);
  const counts = screen.getAllByText(/^\d+$/);
  expect(counts.length).toBeGreaterThanOrEqual(2);
});

test('onCardClick fires with the card', () => {
  const onCardClick = vi.fn();
  render(<Kanban columns={columns} onCardClick={onCardClick} />);
  fireEvent.click(screen.getByText('Task one'));
  expect(onCardClick).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'c1', title: 'Task one' }),
  );
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

test('dragging a card calls onMove', () => {
  const onMove = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} />);
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const targetCol = screen.getByText('Done').closest('section') as HTMLElement;
  const body = targetCol.querySelector('[class*="column-body"], .column-body') as HTMLElement;
  // jsdom: fire dragStart on card, then dragOver + drop on target body
  fireEvent.dragStart(card);
  fireEvent.dragOver(body);
  fireEvent.drop(body);
  expect(onMove).toHaveBeenCalledWith('c1', 'todo', 'done', 1);
});

test('move buttons move card between columns', () => {
  const onMove = vi.fn();
  render(<Kanban columns={columns} onMove={onMove} />);
  // Task one is in todo (first column); move right
  const card = screen.getByText('Task one').closest('article') as HTMLElement;
  const moveRight = card.querySelector('[aria-label="Chuyển sang cột sau"]') as HTMLElement;
  fireEvent.click(moveRight);
  expect(onMove).toHaveBeenCalledWith('c1', 'todo', 'done', 0);
});
