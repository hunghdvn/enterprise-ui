import { useRef, useState } from 'react';
import { Kanban } from '@enterprise-ui/components';
import type { KanbanColumn } from '@enterprise-ui/components';
import styles from './demos.module.css';

const INITIAL_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'Cần làm',
    cards: [
      {
        id: 'c1',
        title: 'Chốt phạm vi quý IV',
        description: 'Chờ xác nhận từ khối kinh doanh.',
        tags: ['kế hoạch'],
        priority: 'high',
        due: '12/11',
        assignee: { name: 'An' },
      },
      {
        id: 'c2',
        title: 'Rà soát luồng đăng nhập',
        tags: ['bảo mật', 'auth'],
        priority: 'medium',
        assignee: { name: 'Bình' },
      },
    ],
  },
  {
    id: 'doing',
    title: 'Đang làm',
    color: 'var(--color-blue-600)',
    cards: [
      {
        id: 'c3',
        title: 'Thiết kế bảng Kanban',
        description: 'Kéo thả, bàn phím và trạng thái rỗng.',
        tags: ['ui'],
        priority: 'medium',
        due: '08/11',
        assignee: { name: 'Chi' },
      },
    ],
  },
  {
    id: 'done',
    title: 'Hoàn thành',
    cards: [],
  },
];

export function KanbanDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>(INITIAL_COLUMNS);
  const [selected, setSelected] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState(
    'Kéo thả thẻ hoặc dùng các nút mũi tên trên thẻ để di chuyển.',
  );
  const nextCardId = useRef(1);

  const totalCards = columns.reduce((sum, column) => sum + column.cards.length, 0);

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => {
    const card = columns.flatMap((column) => column.cards).find((item) => item.id === cardId);
    const target = columns.find((column) => column.id === toColumnId);
    if (!card || !target) return;

    setColumns((prev) => {
      const next = prev.map((column) => ({ ...column, cards: [...column.cards] }));
      const from = next.find((column) => column.id === fromColumnId);
      const to = next.find((column) => column.id === toColumnId);
      if (!from || !to) return prev;

      const fromIndex = from.cards.findIndex((item) => item.id === cardId);
      if (fromIndex === -1) return prev;

      const [moved] = from.cards.splice(fromIndex, 1);
      if (!moved) return prev;
      to.cards.splice(toIndex, 0, moved);
      return next;
    });

    setLastAction(`Đã chuyển “${card.title}” tới cột “${target.title}”.`);
  };

  const addCard = (columnId: string) => {
    const column = columns.find((item) => item.id === columnId);
    if (!column) return;

    const cardId = `new-${nextCardId.current}`;
    nextCardId.current += 1;
    setColumns((prev) =>
      prev.map((item) =>
        item.id === columnId
          ? {
              ...item,
              cards: [
                ...item.cards,
                { id: cardId, title: 'Thẻ mới', tags: ['mới'], priority: 'low' },
              ],
            }
          : item,
      ),
    );
    setLastAction(`Đã thêm một thẻ vào cột “${column.title}”.`);
  };

  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <p className={styles.helper}>
          Kéo thẻ sang cột khác, hoặc focus thẻ rồi dùng các nút mũi tên.
        </p>
        <span className={styles.helper}>
          {totalCards} thẻ · {selected ? `đang chọn “${selected}”` : 'chưa chọn thẻ'}
        </span>
      </div>
      <Kanban
        columns={columns}
        onMove={moveCard}
        onCardClick={(card) => setSelected(card.title)}
        onAddCard={addCard}
      />
      <p className={styles.helper}>{lastAction}</p>
    </div>
  );
}
