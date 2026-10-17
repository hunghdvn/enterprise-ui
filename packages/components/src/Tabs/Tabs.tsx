import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './Tabs.module.css';
import type { TabsProps } from './types';

export function Tabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  size = 'md',
  className = '',
}: TabsProps) {
  const isControlled = activeKey !== undefined;
  const [internalKey, setInternalKey] = useState(defaultActiveKey ?? items[0]?.key);
  const currentKey = isControlled ? activeKey : internalKey;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectKey(key: string) {
    if (!isControlled) setInternalKey(key);
    onChange?.(key);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + items.length) % items.length;
    selectKey(items[next].key);
    tabRefs.current[next]?.focus();
  }

  const activeItem = items.find((item) => item.key === currentKey);

  return (
    <div className={`${styles.tabs} ${className}`}>
      <div role="tablist" className={styles.tabList}>
        {items.map((item, index) => (
          <button
            key={item.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${item.key}`}
            aria-selected={item.key === currentKey}
            aria-controls={`tabpanel-${item.key}`}
            tabIndex={item.key === currentKey ? 0 : -1}
            data-size={size}
            className={styles.tab}
            onClick={() => selectKey(item.key)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeItem.key}`}
          aria-labelledby={`tab-${activeItem.key}`}
          className={styles.tabPanel}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
