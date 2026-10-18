import { useId, useRef, useState } from 'react';
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
  // Instance-scoped prefix: raw item.key ids would collide across two Tabs
  // with overlapping keys, sending aria-controls/aria-labelledby to the wrong
  // instance's nodes.
  const baseId = useId();

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
            id={`${baseId}-tab-${item.key}`}
            aria-selected={item.key === currentKey}
            aria-controls={`${baseId}-tabpanel-${item.key}`}
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
      {/*
        All tabpanels render persistently and inactive ones carry [hidden]:
        every tab's aria-controls points at an existing id, and panel-internal
        state (form input, scroll) survives tab switches. .tabPanel sets no
        display, so the [hidden] UA style applies.
      */}
      {items.map((item) => (
        <div
          key={item.key}
          role="tabpanel"
          id={`${baseId}-tabpanel-${item.key}`}
          aria-labelledby={`${baseId}-tab-${item.key}`}
          hidden={item.key !== currentKey}
          className={styles.tabPanel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
