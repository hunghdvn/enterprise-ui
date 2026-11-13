import { useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '../Icon';
import { cx } from '../internal/cx';
import styles from './SegmentedControl.module.css';
import type { SegmentedControlProps } from './types';

export function SegmentedControl({
  items,
  value,
  defaultValue,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
  ...rest
}: SegmentedControlProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value);
  const currentValue = isControlled ? value : internalValue;
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (items.length === 0) return null;

  const enabledIndexes = items.reduce<number[]>((indexes, item, index) => {
    if (!item.disabled) indexes.push(index);
    return indexes;
  }, []);
  const selectedIndex = items.findIndex((item) => item.value === currentValue);
  const fallbackIndex = enabledIndexes[0] ?? -1;
  const selectionIsTabbable = selectedIndex !== -1 && !items[selectedIndex].disabled;

  function select(index: number) {
    const item = items[index];
    if (!item || disabled || item.disabled) return;
    if (item.value === currentValue) return;
    if (!isControlled) setInternalValue(item.value);
    onChange?.(item.value);
  }

  function moveTo(index: number) {
    const item = items[index];
    if (!item || item.disabled) return;
    optionRefs.current[index]?.focus();
    select(index);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const target =
        event.key === 'Home' ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
      if (target !== undefined) moveTo(target);
      return;
    }

    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!forward && !backward) return;
    event.preventDefault();
    if (enabledIndexes.length === 0) return;

    const position = enabledIndexes.indexOf(index);
    const target =
      position === -1
        ? enabledIndexes[forward ? 0 : enabledIndexes.length - 1]
        : enabledIndexes[
            (position + (forward ? 1 : -1) + enabledIndexes.length) % enabledIndexes.length
          ];
    moveTo(target);
  }

  return (
    <div
      {...rest}
      role="radiogroup"
      data-size={size}
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
    >
      {items.map((item, index) => {
        const checked = item.value === currentValue;
        const tabbable = selectionIsTabbable ? index === selectedIndex : index === fallbackIndex;
        return (
          <button
            key={item.value}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={item['aria-label']}
            tabIndex={tabbable ? 0 : -1}
            disabled={disabled || item.disabled}
            className={styles.option}
            onClick={() => select(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.icon && <Icon name={item.icon} size={size === 'sm' ? 14 : 16} />}
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
