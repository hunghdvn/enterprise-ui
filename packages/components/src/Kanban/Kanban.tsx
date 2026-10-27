import { useCallback, useEffect, useRef, useState } from 'react';
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
  const pendingFocusRef = useRef<{ cardId: string; toColumnId: string; toIndex: number } | null>(
    null,
  );
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (pending) {
      const targetCol = columns.find((c) => c.id === pending.toColumnId);
      const atTarget = targetCol?.cards[pending.toIndex]?.id === pending.cardId;
      if (atTarget) {
        const el = cardRefs.current.get(pending.cardId);
        if (el) el.focus();
        pendingFocusRef.current = null;
      }
    }
  }, [columns]);

  const handleDragStart = useCallback((e: React.DragEvent, card: KanbanCard, columnId: string) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', card.id);
      e.dataTransfer.effectAllowed = 'move';
    }
    setDragging({ cardId: card.id, fromColumnId: columnId });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragging(null);
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, columnId: string, index: number) => {
      e.preventDefault();
      if (!dragging) return;
      const { cardId, fromColumnId } = dragging;
      if (fromColumnId === columnId) {
        const col = columns.find((c) => c.id === columnId);
        const oldIndex = col?.cards.findIndex((c) => c.id === cardId) ?? -1;
        if (oldIndex !== -1 && oldIndex !== index) {
          onMove?.(cardId, fromColumnId, columnId, index);
          if (onMove) {
            pendingFocusRef.current = { cardId, toColumnId: columnId, toIndex: index };
          }
        }
      } else {
        onMove?.(cardId, fromColumnId, columnId, index);
        if (onMove) {
          pendingFocusRef.current = { cardId, toColumnId: columnId, toIndex: index };
        }
      }
      handleDragEnd();
    },
    [dragging, columns, onMove, handleDragEnd],
  );

  const moveCard = useCallback(
    (card: KanbanCard, fromColumnId: string, toColumnId: string, toIndex: number) => {
      onMove?.(card.id, fromColumnId, toColumnId, toIndex);
      if (onMove) {
        pendingFocusRef.current = { cardId: card.id, toColumnId, toIndex };
      }
    },
    [onMove],
  );

  return (
    <div className={className ? `${styles.board} ${className}` : styles.board} data-size={size}>
      {columns.map((column, colIndex) => (
        <section
          key={column.id}
          className={styles.column}
          aria-label={column.title}
          style={column.color ? { borderLeft: `3px solid ${column.color}` } : undefined}
        >
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
                ref={(el) => {
                  if (el) cardRefs.current.set(card.id, el);
                  else cardRefs.current.delete(card.id);
                }}
                className={
                  dragging?.cardId === card.id
                    ? `${styles.card} ${styles['card-dragging']}`
                    : styles.card
                }
                draggable
                role="group"
                tabIndex={0}
                aria-label={card.title}
                onDragStart={(e) => handleDragStart(e, card, column.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragging) {
                    e.stopPropagation();
                    setDropTarget({ columnId: column.id, index });
                  }
                }}
                onDrop={(e) => {
                  if (dragging) e.stopPropagation();
                  handleDrop(e, column.id, index);
                }}
                onClick={() => onCardClick?.(card)}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCardClick?.(card);
                  }
                }}
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
                        disabled={colIndex === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (colIndex > 0) moveCard(card, column.id, columns[colIndex - 1].id, 0);
                        }}
                      >
                        <Icon name="chevron-left" size={12} />
                      </button>
                      <button
                        type="button"
                        className={styles['move-btn']}
                        aria-label="Chuyển sang cột sau"
                        disabled={colIndex === columns.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (colIndex < columns.length - 1)
                            moveCard(card, column.id, columns[colIndex + 1].id, 0);
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
