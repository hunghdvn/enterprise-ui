import { createElement, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import styles from './Accordion.module.css';
import type { AccordionProps } from './types';

export function Accordion(props: AccordionProps) {
  const { items, size = 'md', headingLevel = 3, className = '', ...rest } = props;
  // Mode-specific props stay out of `rootProps`; they are not DOM attributes.
  // Destructuring them off the union directly is not allowed before narrowing.
  const {
    multiple: _multiple,
    value: _value,
    defaultValue: _defaultValue,
    values: _values,
    defaultValues: _defaultValues,
    onChange: _onChange,
    ...rootProps
  } = rest as typeof rest & {
    multiple?: boolean;
    value?: string | null;
    defaultValue?: string | null;
    values?: readonly string[];
    defaultValues?: readonly string[];
    onChange?: unknown;
  };

  const baseId = useId();
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [internalSingle, setInternalSingle] = useState<string | null>(
    props.multiple ? null : (props.defaultValue ?? null),
  );
  const [internalMultiple, setInternalMultiple] = useState<string[]>(
    props.multiple ? [...new Set(props.defaultValues ?? [])] : [],
  );

  if (items.length === 0) return null;

  const openIds = props.multiple
    ? [...(props.values ?? internalMultiple)]
    : (() => {
        const value = props.value !== undefined ? props.value : internalSingle;
        return value === null ? [] : [value];
      })();
  const openSet = new Set(openIds);

  function toggle(id: string) {
    if (props.multiple) {
      const current = props.values ?? internalMultiple;
      const next = current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id];
      const ordered = items.filter((item) => next.includes(item.id)).map((item) => item.id);
      if (props.values === undefined) setInternalMultiple(ordered);
      props.onChange?.(ordered);
      return;
    }

    const current = props.value !== undefined ? props.value : internalSingle;
    const next = current === id ? null : id;
    if (props.value === undefined) setInternalSingle(next);
    props.onChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return;
    }
    event.preventDefault();

    const enabled = items
      .map((item, itemIndex) => ({ item, itemIndex }))
      .filter(({ item }) => !item.disabled);
    if (enabled.length === 0) return;

    const position = enabled.findIndex(({ itemIndex }) => itemIndex === index);
    let target = 0;
    if (event.key === 'End') {
      target = enabled.length - 1;
    } else if (event.key !== 'Home') {
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      target = position === -1 ? 0 : (position + delta + enabled.length) % enabled.length;
    }
    triggerRefs.current[enabled[target].itemIndex]?.focus();
  }

  return (
    <div {...rootProps} data-size={size} className={cx(styles.root, className)}>
      {items.map((item, index) => {
        const open = openSet.has(item.id);
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.id} className={styles.item}>
            {createElement(
              `h${headingLevel}`,
              { className: styles.heading },
              <button
                ref={(element) => {
                  triggerRefs.current[index] = element;
                }}
                type="button"
                id={triggerId}
                aria-expanded={open}
                aria-controls={panelId}
                disabled={item.disabled}
                className={styles.trigger}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className={styles.title}>{item.title}</span>
                <Icon
                  name="chevron-down"
                  size={size === 'sm' ? 14 : 16}
                  className={styles.chevron}
                />
              </button>,
            )}
            <div
              role="region"
              id={panelId}
              aria-labelledby={triggerId}
              hidden={!open}
              className={styles.panel}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
