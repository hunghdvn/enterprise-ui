export interface KanbanAssignee {
  name: string;
  avatar?: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  assignee?: KanbanAssignee;
  due?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  onMove?: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  onAddCard?: (columnId: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}
