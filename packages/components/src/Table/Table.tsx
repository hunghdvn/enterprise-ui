import { Button } from '../Button/Button';
import styles from './Table.module.css';
import type { TableProps } from './types';

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  sortKey,
  sortDir,
  onSort,
  selectedKeys,
  onSelect,
  rowKey,
  status = 'idle',
  onRetry,
  summary,
}: TableProps<T>) {
  if (status === 'empty') {
    return (
      <div className={styles.state} role="status">
        Không có dữ liệu
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className={styles.state} role="alert">
        <span>Lỗi tải dữ liệu</span>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      </div>
    );
  }
  if (status === 'loading') {
    return (
      <div className={styles.state} role="status" aria-busy="true">
        Đang tải…
      </div>
    );
  }

  const selectable = selectedKeys !== undefined && onSelect !== undefined;
  const selected: string[] = selectedKeys ?? [];
  const keyOf = (row: T, index: number): string => {
    if (rowKey) return rowKey(row);
    const raw: unknown = row['key'] ?? row['code'] ?? row['id'];
    if (typeof raw === 'string' || typeof raw === 'number') return String(raw);
    return String(index);
  };
  const allKeys = data.map((r, i) => keyOf(r, i));
  const selectedCount = allKeys.filter((k) => selected.includes(k)).length;
  const allSelected = selectable && data.length > 0 && selectedCount === data.length;
  const someSelected = selectedCount > 0 && selectedCount < allKeys.length;

  const toggleAll = () => {
    if (!onSelect) return;
    onSelect(allSelected ? [] : allKeys);
  };
  const toggleOne = (k: string) => {
    if (!onSelect) return;
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelect(Array.from(next));
  };

  const gridTemplateColumns = selectable
    ? `36px repeat(${columns.length}, 1fr)`
    : `repeat(${columns.length}, 1fr)`;

  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <div
          className={styles.grid}
          role="grid"
          aria-rowcount={data.length + 1}
          aria-colcount={columns.length + (selectable ? 1 : 0)}
        >
          <div className={styles.head} role="row" style={{ gridTemplateColumns }}>
            {selectable && (
              <div className={styles.h} role="columnheader" data-align="center">
                <input
                  type="checkbox"
                  aria-label="Chọn tất cả"
                  className={styles.check}
                  checked={allSelected === true}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                />
              </div>
            )}
            {columns.map((c) => {
              const active = sortKey === c.key;
              const ariaSort = active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
              if (!c.sortable) {
                return (
                  <div
                    key={c.key}
                    className={styles.h}
                    role="columnheader"
                    data-align={c.align ?? 'left'}
                  >
                    <span>{c.title}</span>
                  </div>
                );
              }
              return (
                <div
                  key={c.key}
                  role="columnheader"
                  aria-sort={ariaSort as 'ascending' | 'descending' | 'none'}
                  className={styles.h}
                  data-align={c.align ?? 'left'}
                >
                  <button type="button" onClick={() => onSort?.(c.key)} className={styles.sortBtn}>
                    <span>{c.title}</span>
                    <span aria-hidden="true" className={styles.arrow}>
                      {active ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          {data.map((row, i) => {
            const k = allKeys[i];
            const isSelected = selected.includes(k);
            return (
              <div
                key={k}
                className={styles.row}
                role="row"
                data-selected={isSelected}
                style={{ gridTemplateColumns }}
              >
                {selectable && (
                  <div className={styles.c} role="gridcell" data-align="center">
                    <input
                      type="checkbox"
                      aria-label={`Chọn dòng ${k}`}
                      className={styles.check}
                      checked={isSelected}
                      onChange={() => toggleOne(k)}
                    />
                  </div>
                )}
                {columns.map((c) => {
                  const value: unknown = row[c.key];
                  return (
                    <div
                      key={c.key}
                      className={styles.c}
                      role="gridcell"
                      data-align={c.align ?? 'left'}
                    >
                      {c.render ? c.render(row) : value == null ? '' : String(value)}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {summary && <div className={styles.foot}>{summary}</div>}
        </div>
      </div>
    </div>
  );
}
