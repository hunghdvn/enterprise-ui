import { useCallback, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { KanbanCard, KanbanProps } from './types';
import styles from './Kanban.module.css';

const PRIORITY_LABEL: Record<NonNullable<KanbanCard['priority']>, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

export function Kanban({
  columns,
  onMove,
  onCardClick,
  onAddCard,
  size = 'sm',
  className,
}: KanbanProps) {
  const [dragging, setDragging] = useState<{ cardId: string; fromColumnId: string } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ columnId: string; index: number } | null>(null);
  const dragCardRef = useRef<KanbanCard | null>(null);

  const handleDragStart = useCallback((card: KanbanCard, columnId: string) => {
    setDragging({ cardId: card.id, fromColumnId: columnId });
    dragCardRef.current = card;
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
    setDropTarget(null);
    dragCardRef.current = null;
  }, []);

  const handleDragOverColumn = useCallback(
    (e: React.DragEvent, columnId: string, index: number) => {
      e.preventDefault();
      if (!dragging) return;
      setDropTarget({ columnId, index });
    },
    [dragging],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, columnId: string, index: number) => {
      e.preventDefault();
      if (!dragging) return;
      const { cardId, fromColumnId } = dragging;
      if (fromColumnId === columnId) {
        // reorder within same column only if index changed
        const col = columns.find((c) => c.id === columnId);
        const oldIndex = col?.cards.findIndex((c) => c.id === cardId) ?? -1;
        if (oldIndex !== -1 && oldIndex !== index) {
          onMove?.(cardId, fromColumnId, columnId, index);
        }
      } else {
        onMove?.(cardId, fromColumnId, columnId, index);
      }
      handleDragEnd();
    },
    [dragging, columns, onMove, handleDragEnd],
  );

  const moveCard = useCallback(
    (card: KanbanCard, fromColumnId: string, toColumnId: string, toIndex: number) => {
      onMove?.(card.id, fromColumnId, toColumnId, toIndex);
    },
    [onMove],
  );

  return (
    <div className={className ? `${styles.board} ${className}` : styles.board} data-size={size}>
      {columns.map((column) => (
        <section key={column.id} className={styles.column} aria-label={column.title}>
          <header className={styles['column-header']}>
            <span className={styles['column-title']}>{column.title}</span>
            <span className={styles['column-count']}>{column.cards.length}</span>
            {onAddCard && (
              <button
                type="button"
                className={styles['column-add']}
                aria-label={`Thêm thẻ vào ${column.title}`}
                onClick={() => onAddCard(column.id)}
              >
                <Icon name="plus" size={14} />
              </button>
            )}
          </header>
          <div
            className={
              dropTarget?.columnId === column.id
                ? `${styles['column-body']} ${styles['drop-active']}`
                : styles['column-body']
            }
            onDragOver={(e) => {
              e.preventDefault();
              if (dragging) setDropTarget({ columnId: column.id, index: column.cards.length });
            }}
            onDrop={(e) => handleDrop(e, column.id, column.cards.length)}
          >
            {column.cards.map((card, index) => (
              <article
                key={card.id}
                className={
                  dragging?.cardId === card.id
                    ? `${styles.card} ${styles['card-dragging']}`
                    : styles.card
                }
                draggable
                onDragStart={() => handleDragStart(card, column.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOverColumn(e, column.id, index)}
                onDrop={(e) => handleDrop(e, column.id, index)}
                onClick={() => onCardClick?.(card)}
                tabIndex={0}
                aria-label={card.title}
              >
                {card.tags && card.tags.length > 0 && (
                  <div className={styles['card-tags']}>
                    {card.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <h4 className={styles['card-title']}>{card.title}</h4>
                {card.description && <p className={styles['card-desc']}>{card.description}</p>}
                <footer className={styles['card-footer']}>
                  {card.priority && (
                    <span className={styles[`priority-${card.priority}`]}>
                      {PRIORITY_LABEL[card.priority]}
                    </span>
                  )}
                  {card.due && <span className={styles.due}>{card.due}</span>}
                  {card.assignee && (
                    <span className={styles.assignee}>
                      {card.assignee.avatar ? (
                        <img src={card.assignee.avatar} alt="" className={styles.avatar} />
                      ) : (
                        <span className={styles['avatar-fallback']}>
                          {card.assignee.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className={styles['assignee-name']}>{card.assignee.name}</span>
                    </span>
                  )}
                </footer>
                <div className={styles['card-actions']}>
                  {columns.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={styles['move-btn']}
                        aria-label="Chuyển sang cột trước"
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = columns.findIndex((c) => c.id === column.id);
                          if (idx > 0) moveCard(card, column.id, columns[idx - 1].id, 0);
                        }}
                      >
                        <Icon name="chevron-left" size={12} />
                      </button>
                      <button
                        type="button"
                        className={styles['move-btn']}
                        aria-label="Chuyển sang cột sau"
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = columns.findIndex((c) => c.id === column.id);
                          if (idx < columns.length - 1)
                            moveCard(card, column.id, columns[idx + 1].id, 0);
                        }}
                      >
                        <Icon name="chevron-right" size={12} />
                      </button>
                    </>
                  )}
                  {column.cards.length > 1 && (
                    <>
                      <button
                        type="button"
                        className={styles['move-btn']}
                        aria-label="Di chuyển lên"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveCard(card, column.id, column.id, Math.max(0, index - 1));
                        }}
                      >
                        <Icon name="chevron-up" size={12} />
                      </button>
                      <button
                        type="button"
                        className={styles['move-btn']}
                        aria-label="Di chuyển xuống"
                        disabled={index === column.cards.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveCard(card, column.id, column.id, index + 1);
                        }}
                      >
                        <Icon name="chevron-down" size={12} />
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
            {column.cards.length === 0 && (
              <div className={styles['empty-column']}>Kéo thả thẻ vào đây</div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
