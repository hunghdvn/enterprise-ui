import { memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './Combobox.module.css';
import type { ComboboxOption, ComboboxProps } from './types';

const DEFAULT_PLACEHOLDER = 'Chọn...';
const DEFAULT_SEARCH_PLACEHOLDER = 'Tìm kiếm...';

function ClearIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function searchValueOf(opt: ComboboxOption): string {
  if (typeof opt.searchText === 'string') return opt.searchText;
  if (typeof opt.label === 'string') return opt.label;
  return typeof opt.value === 'string' ? opt.value : String(opt.value);
}

const OptionItem = memo(function OptionItem({
  option,
  selected,
  highlighted,
  onPointerEnter,
  onClick,
}: {
  option: ComboboxOption;
  selected: boolean;
  highlighted: boolean;
  onPointerEnter: () => void;
  onClick: () => void;
}) {
  return (
    <li
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled || undefined}
      className={[
        styles.option,
        highlighted ? styles.optionHighlighted : '',
        option.disabled ? styles.optionDisabled : '',
      ].join(' ')}
      tabIndex={-1}
      data-value={option.value}
      onPointerEnter={onPointerEnter}
      onClick={onClick}
    >
      {option.label}
    </li>
  );
});

export function Combobox({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  multiple = false,
  searchable = true,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  minSelectWidth = 240,
  maxDropdownHeight = 240,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ComboboxProps) {
  const uid = useId();
  const listboxId = `combobox-list-${uid.replace(/:/g, '')}`;
  const controlRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  const controlled = value !== undefined;
  const [internal, setInternal] = useState<string | string[] | undefined>(defaultValue);
  const resolved = controlled ? value : internal;

  const selected: string[] = useMemo(
    () =>
      multiple
        ? Array.isArray(resolved)
          ? resolved
          : []
        : typeof resolved === 'string' && resolved
          ? [resolved]
          : [],
    [multiple, resolved],
  );

  const byValue = useMemo(() => {
    const map = new Map<string, ComboboxOption>();
    for (const opt of options) map.set(opt.value, opt);
    return map;
  }, [options]);

  const filtered = useMemo(() => {
    const text = filterText.trim().toLowerCase();
    if (!text) return options;
    return options.filter((opt) => searchValueOf(opt).toLowerCase().includes(text));
  }, [options, filterText]);

  const commit = (next: string | string[]) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const removeChip = (v: string) => {
    if (multiple) {
      commit((Array.isArray(resolved) ? resolved : []).filter((x) => x !== v));
    } else {
      commit('');
    }
  };

  const selectOption = (index: number) => {
    const opt = filtered[index];
    if (!opt || opt.disabled) return;
    if (multiple) {
      const arr = Array.isArray(resolved) ? resolved : [];
      const next = arr.includes(opt.value)
        ? arr.filter((x) => x !== opt.value)
        : [...arr, opt.value];
      commit(next);
      setFilterText('');
    } else {
      commit(opt.value);
      setFilterText('');
      setOpen(false);
    }
    setHighlightedIndex(0);
  };

  const openAt = (highlight = 0) => {
    setHighlightedIndex(highlight);
    setOpen(true);
    const cr = controlRef.current?.getBoundingClientRect();
    if (cr) {
      const below = cr.bottom + 4 + Math.min(filtered.length * 36, maxDropdownHeight) + 4;
      const top = below <= (window.innerHeight || 0) ? cr.bottom + 4 : Math.max(0, cr.top - 4);
      setPosition({ top, left: cr.left, width: cr.width });
    } else {
      setPosition(null);
    }
  };

  const close = () => {
    setOpen(false);
    setFilterText('');
    setHighlightedIndex(0);
  };

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (controlRef.current && !controlRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const onScroll = () => close();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDocMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const wrapKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchable && !open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openAt(0);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!open) {
          openAt(0);
        } else {
          setHighlightedIndex((i) => (i + 1) % filtered.length);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) {
          openAt(0);
        } else {
          setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        }
        break;
      }
      case 'Enter': {
        if (open && filterText === '') {
          e.preventDefault();
          selectOption(highlightedIndex);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        close();
        break;
      }
      case 'Backspace': {
        if (filterText === '' && selected.length > 0) {
          e.preventDefault();
          const last = selected[selected.length - 1];
          if (multiple) commit(selected.slice(0, -1));
          else commit('');
          void last;
        }
        break;
      }
      default:
    }
  };

  const handleInputChange = searchable
    ? (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setFilterText(text);
        if (text && !open) openAt(0);
        else if (text) setHighlightedIndex(0);
      }
    : undefined;

  return (
    <span className={styles.wrap} style={{ minWidth: minSelectWidth }}>
      <span
        ref={controlRef}
        className={styles.control}
        data-disabled={disabled || undefined}
        data-open={open || undefined}
      >
        {selected.map((v) => {
          const opt = byValue.get(v);
          const label = opt ? opt.label : v;
          return (
            <span key={v} className={styles.chip}>
              {label}
              <button
                type="button"
                className={styles['chip-remove']}
                aria-label={`Xóa ${String(label)}`}
                disabled={disabled}
                onClick={() => removeChip(v)}
              >
                <ClearIcon />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-label={ariaLabel ?? placeholder}
          aria-labelledby={ariaLabelledBy}
          aria-disabled={disabled || undefined}
          readOnly={!searchable}
          value={searchable ? filterText : ''}
          placeholder={selected.length === 0 ? placeholder : searchPlaceholder}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={() => {
            if (disabled || !searchable) return;
            if (!open) openAt(selected.length > 0 ? -1 : 0);
          }}
          onBlur={() => {
            // keep open briefly for click-away handled by document listener
          }}
          onKeyDown={wrapKeyDown}
        />
        <span className={styles.chevron} aria-hidden="true">
          <ChevronIcon />
        </span>
      </span>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className={styles.popover}
          style={
            position
              ? {
                  position: 'fixed',
                  top: position.top,
                  left: position.left,
                  width: position.width,
                  maxHeight: maxDropdownHeight,
                }
              : {}
          }
        >
          {filtered.length === 0 ? (
            <li className={styles.empty} role="option" aria-selected="false">
              Không có kết quả
            </li>
          ) : (
            filtered.map((opt, i) => (
              <OptionItem
                key={opt.value}
                option={opt}
                selected={selected.includes(opt.value)}
                highlighted={i === highlightedIndex}
                onPointerEnter={() => setHighlightedIndex(i)}
                onClick={() => selectOption(i)}
              />
            ))
          )}
        </ul>
      )}
    </span>
  );
}
