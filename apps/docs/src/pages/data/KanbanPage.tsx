import { Kanban } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
const columns = [
  {
    id: 'todo',
    title: 'To do',
    cards: [
      {
        id: 'c1',
        title: 'Thiết kế Kanban',
        tags: ['ui'],
        priority: 'high' as const,
        assignee: { name: 'An' },
      },
      { id: 'c2', title: 'Viết test', tags: ['qa'] },
    ],
  },
  {
    id: 'doing',
    title: 'In progress',
    cards: [{ id: 'c3', title: 'Implement drag' }],
  },
  { id: 'done', title: 'Done', cards: [{ id: 'c4', title: 'Setup repo' }] },
];

const props: PropDoc[] = [
  {
    name: 'columns',
    type: 'KanbanColumn[]',
    description: 'Danh sách cột { id, title, cards, color? }.',
  },
  {
    name: 'onMove',
    type: '(cardId, fromColumnId, toColumnId, toIndex) => void',
    description: 'Báo khi thẻ được kéo sang cột/khác vị trí.',
  },
  { name: 'onCardClick', type: '(card) => void', description: 'Báo khi bấm vào thẻ.' },
  {
    name: 'onAddCard',
    type: '(columnId) => void',
    description: 'Hiện nút "+" trên header cột và báo khi bấm.',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Kích thước thẻ.' },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ.' },
];

const code = `import { useState } from 'react';
import { Kanban } from '@enterprise-ui/components';
import type { KanbanColumn } from '@enterprise-ui/components';

const initial: KanbanColumn[] = [
  { id: 'todo', title: 'To do', cards: [{ id: 'c1', title: 'Thiết kế' }] },
  { id: 'done', title: 'Done', cards: [] },
];

export function Board() {
  const [cols, setCols] = useState(initial);
  return (
    <Kanban
      columns={cols}
      onMove={(cardId, from, to, toIndex) => {
        setCols((prev) => {
          const next = prev.map((c) => ({ ...c, cards: [...c.cards] }));
          const fromCol = next.find((c) => c.id === from)!;
          const toCol = next.find((c) => c.id === to)!;
          const card = fromCol.cards.splice(fromCol.cards.findIndex((c) => c.id === cardId), 1)[0];
          toCol.cards.splice(toIndex, 0, card);
          return next;
        });
      }}
    />
  );
}`;

export default function KanbanPage() {
  return (
    <div>
      <h1>Kanban</h1>
      <p>Bảng Kanban với kéo-thả native, presentational-only.</p>
      <DemoPlayground>
        <Kanban columns={columns} />
      </DemoPlayground>
      <h2>Code</h2>
      <CodeBlock code={code} />
      <h2>Props</h2>
      <PropsTable props={props} />
    </div>
  );
}
