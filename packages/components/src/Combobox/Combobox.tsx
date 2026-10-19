import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { ComboboxOption, ComboboxProps } from './types';
import styles from './Combobox.module.css';

const DEFAULT_PLACEHOLDER = 'Chọn...';
const DEFAULT_SEARCH_PLACEHOLDER = 'Tìm kiếm...';
const GAP_PX = 4;
const EST_ROW_HEIGHT = 32; // .option padding (6 + 10 + 10) + line height
const EST_POPOVER_CHROME = 10; // .popover vertical padding (4 + 4) + 1px borders

function searchValueOf(opt: ComboboxOption): string {
  if (typeof opt.searchText === 'string') return opt.searchText;
  if (typeof opt.label === 'string') return opt.label;
  return typeof opt.value === 'string' ? opt.value : String(opt.value);
}

// Position the popover: one GAP_PX below the control, flipped ABOVE with the
// FULL estimated height (rows + popover chrome) when it would overflow the
// viewport bottom. The chrome term is part of the review-#7 fix — the old
// math dropped the popover's own padding/border and double-counted the gap.
function computePosition(
  cr: { bottom: number; top: number; left: number; width: number },
  rowCount: number,
  maxHeight: number,
): { top: number; left: number; width: number } {
  const ddHeight = Math.min(Math.max(rowCount, 1) * EST_ROW_HEIGHT, maxHeight) + EST_POPOVER_CHROME;
  const spaceBelow = (window.innerHeight || 0) - cr.bottom - GAP_PX;
  const top = spaceBelow >= ddHeight ? cr.bottom + GAP_PX : Math.max(0, cr.top - ddHeight - GAP_PX);
  return { top, left: cr.left, width: cr.width };
}

function OptionItem({
  id,
  option,
  selected,
  highlighted,
  onPointerEnter,
  onClick,
}: {
  id: string;
  option: ComboboxOption;
  selected: boolean;
  highlighted: boolean;
  onPointerEnter: () => void;
  onClick: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Keep the keyboard-highlighted option visible (review #8).
  useEffect(() => {
    if (highlighted && ref.current) {
      // jsdom has no `scrollIntoView`; the optional call is a no-op there and
      // runs in real browsers. Instant on purpose: smooth scrolling disrespects
      // prefers-reduced-motion and lags behind rapid key-holds (round-3 note).
      ref.current.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  }, [highlighted]);
  return (
    <li
      id={id}
      ref={ref}
      role="option"
      aria-selected={selected}
      aria-disabled={option.disabled || undefined}
      className={
        // Class names are kebab with no `localsConvention`; the camelCase
        // form would resolve to `undefined` and the highlight would never
        // show (review #4).
        [styles.option, highlighted ? styles['option-highlighted'] : ''].join(' ')
      }
      tabIndex={-1}
      data-value={option.value}
      onPointerEnter={onPointerEnter}
      onClick={onClick}
    >
      {option.label}
    </li>
  );
}

/**
 * Searchable, chip-backed select with a live-filtered popover. The master pane
 * size is **controlled**: the parent passes `value`/`defaultValue` and owns the
 * state, reporting changes back via `onChange`. Filter text is the only
 * internal state (unreported — spec G5). The popover is positioned once on
 * open, re-placed on window resize while open, and flipped above when it would
 * overflow the viewport bottom (spec D5).
 */
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
  // Consumer handlers are destructured (not left in `rest`) so they can be
  // COMPOSED with the widget's own handlers below instead of being silently
  // clobbered by the explicit props that follow `{...rest}` (review New-B).
  onFocus: consumerOnFocus,
  onKeyDown: consumerOnKeyDown,
  className,
  ...rest
}: ComboboxProps) {
  const uid = useId();
  const listboxId = `combobox-list-${uid.replace(/:/g, '')}`;
  // `wrap` is the widget root for click-away / scroll / focus containment
  // (review #1: `.control` is a sibling of the popover, so it cannot be the
  // containment root — clicks on options would close the list first).
  const wrapRef = useRef<HTMLSpanElement>(null);
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
  // Resolved value: `value` when controlled, else internal state (spec G5).
  const resolved = controlled ? value : internal;

  const selected: string[] = useMemo(
    () =>
      multiple
        ? Array.isArray(resolved)
          ? resolved
          : []
        : // Empty string can never render a chip, so it is treated as "no
          // selection" in single mode (spec G3 / review #14).
          typeof resolved === 'string' && resolved !== ''
          ? [resolved]
          : [],
    [multiple, resolved],
  );

  // Surface duplicate / empty option values — they break keying and
  // single-mode identity (review #14). Dev-only diagnostics (review New-D):
  // `import.meta.env.DEV` is true in dev/test and compiled away by the
  // production lib build, so prod users never see these warns. Labels go
  // through `searchValueOf` so a ReactNode label never prints as
  // "[object Object]" — the exact bug the chip fix (#13) removed.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const seen = new Set<string>();
    for (const opt of options) {
      if (opt.value === '') {
        console.warn(
          `[Combobox] option with an empty value cannot be toggled in single mode:`,
          searchValueOf(opt),
        );
      } else if (seen.has(opt.value)) {
        console.warn(
          `[Combobox] duplicate option value "${opt.value}" — identity is ambiguous:`,
          searchValueOf(opt),
        );
      }
      seen.add(opt.value);
    }
  }, [options]);

  const byValue = useMemo(() => {
    const map = new Map<string, ComboboxOption>();
    for (const opt of options) map.set(opt.value, opt);
    return map;
  }, [options]);

  const filtered = useMemo(
    () =>
      filterText.trim().toLowerCase()
        ? options.filter((opt) =>
            searchValueOf(opt).toLowerCase().includes(filterText.trim().toLowerCase()),
          )
        : options,
    [options, filterText],
  );

  // Highlight clamped to the live list so a parent update that shrinks
  // `filtered` while open can never point off the end (#9c). Derived
  // (not an effect) so we don't call setState inside an effect.
  const clampedHighlight = useMemo(
    () =>
      filtered.length === 0 ? 0 : Math.max(-1, Math.min(highlightedIndex, filtered.length - 1)),
    [highlightedIndex, filtered.length],
  );

  const commit = (next: string | string[]) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const removeChip = (v: string) => {
    if (multiple) {
      commit((Array.isArray(resolved) ? resolved : []).filter((x) => x !== v));
    } else {
      commit(''); // clear the single selection
    }
  };

  // Wrap an index into [0, n-1]; negatives wrap so keyboard highlight can
  // never run off the ends of the list (review #9).
  const safeIndex = (i: number) => {
    const n = filtered.length;
    if (n === 0) return 0;
    return ((i % n) + n) % n;
  };

  const selectOption = (index: number) => {
    const opt = filtered[safeIndex(index)];
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
      setPosition(null);
    }
    setHighlightedIndex(0);
  };

  const openAt = (highlight = 0) => {
    const n = filtered.length;
    let h = highlight;
    if (n === 0) h = 0;
    else if (h < -1) h = -1;
    else if (h > n - 1) h = n - 1;
    setHighlightedIndex(h);
    setOpen(true);
    const cr = controlRef.current?.getBoundingClientRect();
    setPosition(cr ? computePosition(cr, n, maxDropdownHeight) : null);
  };

  const close = () => {
    setOpen(false);
    setFilterText('');
    setHighlightedIndex(0);
    setPosition(null);
  };

  // Click-away, scroll, and focus-boundary dismissal. Every branch contains
  // against the widget root (`wrapRef`) — never `.control`, which does not
  // contain the popover (review #1 / #3 / #6).
  useEffect(() => {
    if (!open) return;
    const root = wrapRef.current;
    const onDocMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // only a primary press dismisses
      if (e.target instanceof Node && root && !root.contains(e.target)) close();
    };
    // Ignore scrolls whose origin is the popover list itself (review #3).
    const onScroll = (e: Event) => {
      const target = e.target;
      if (target instanceof Node && root?.contains(target)) return;
      close();
    };
    // `focusout` (native, bubbles) closes when focus leaves the widget, but a
    // move to a chip button / option inside the root keeps it open (#6 D4).
    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null;
      if (related && root?.contains(related)) return;
      close();
    };
    document.addEventListener('mousedown', onDocMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('focusout', onFocusOut, true);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('focusout', onFocusOut, true);
    };
  }, [open]);

  // Re-place the popover when the window resizes while open (review #7) —
  // otherwise a rotation or window drag leaves it anchored to a stale rect.
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const cr = controlRef.current?.getBoundingClientRect();
      if (cr) setPosition(computePosition(cr, filtered.length, maxDropdownHeight));
    };
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [open, filtered.length, maxDropdownHeight]);

  const wrapKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME composition: never steal Arrow/Enter/Escape/Delete from the
    // candidate window (review #10).
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const n = filtered.length;
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!open) {
          openAt(0);
        } else {
          // From the no-highlight state (-1) the first down lands on index 0;
          // otherwise wrap within [0, n-1] (review #9).
          setHighlightedIndex((i) => (n === 0 ? i : i < 0 ? 0 : (i + 1) % n));
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) {
          openAt(0);
        } else {
          // ArrowUp wraps to the last item — and from -1 it too lands on last,
          // so the previous "skips last" off-by-one is gone (review #9).
          setHighlightedIndex((i) => (n === 0 ? i : i < 0 ? n - 1 : (i - 1 + n) % n));
        }
        break;
      }
      case 'Enter': {
        // Always preventDefault so a <form> never submits on Enter, and select
        // the highlighted match when one is available (review #2). With NO
        // highlight (-1) Enter must stay a no-op: handing -1 to safeIndex
        // wrapped onto the LAST option and silently committed it (review
        // New-A — opening a populated single select and pressing Enter used
        // to change the selection).
        if (open) {
          e.preventDefault();
          if (n > 0 && clampedHighlight >= 0) selectOption(clampedHighlight);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        if (open) close();
        break;
      }
      case 'Backspace': {
        if (filterText === '' && selected.length > 0) {
          e.preventDefault();
          if (multiple) commit(selected.slice(0, -1));
          else commit(''); // clear single selection
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

  // Clicking the control (chevron / blank area) toggles the popover — before
  // this there was no mouse-open path (review #5). Clicks that land on the
  // input are passed through so a text caret never toggles the list closed.
  const onControlMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (disabled || e.button !== 0) return;
    // A press on a chip's remove button is a chip action, not a popover
    // toggle: without this guard the press opened the list AND the click then
    // removed the chip (review New-C). The remove button is the only
    // <button> inside the control.
    if (e.target instanceof Element && e.target.closest('button')) return;
    if (inputRef.current?.contains(e.target as Node)) {
      if (!searchable && !open) openAt(selected.length > 0 ? -1 : 0);
      return;
    }
    e.preventDefault(); // move focus to the input without jumping the caret
    inputRef.current?.focus();
    if (open) close();
    else openAt(selected.length > 0 ? -1 : 0);
  };

  // Escape from anywhere inside the control (e.g. a chip-remove button
  // reached via Shift+Tab) closes the popover (spec D4 / review New-E) —
  // the input's own handler only covers the input itself. Same IME guard as
  // the input: a composing Escape must not close the list.
  const onControlKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close();
    }
  };

  return (
    <span
      ref={wrapRef}
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      style={{ minWidth: minSelectWidth }}
      data-disabled={disabled || undefined}
      data-open={open || undefined}
    >
      <span
        ref={controlRef}
        className={styles.control}
        data-disabled={disabled || undefined}
        data-open={open || undefined}
        onMouseDown={onControlMouseDown}
        onKeyDown={onControlKeyDown}
      >
        {selected.map((v) => {
          const opt = byValue.get(v);
          // Use the filterable text for the accessible label so a ReactNode
          // label never stringifies to "[object Object]" (review #13).
          const chipLabel = opt ? searchValueOf(opt) : String(v);
          return (
            <span key={v} className={styles.chip}>
              {opt ? opt.label : v}
              <button
                type="button"
                className={styles['chip-remove']}
                aria-label={`Xóa ${chipLabel}`}
                disabled={disabled}
                onClick={() => removeChip(v)}
              >
                <Icon name="x" size={12} />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          className={styles.input}
          {...rest}
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            open && filtered.length > 0 && clampedHighlight >= 0
              ? `${listboxId}-option-${clampedHighlight}`
              : undefined
          }
          aria-label={ariaLabel ?? placeholder}
          aria-labelledby={ariaLabelledBy}
          aria-disabled={disabled || undefined}
          readOnly={!searchable}
          value={searchable ? filterText : ''}
          placeholder={selected.length === 0 ? placeholder : searchPlaceholder}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={(e) => {
            // Compose with the consumer's handler instead of clobbering it
            // (review New-B).
            consumerOnFocus?.(e);
            if (disabled || !searchable) return;
            if (!open) openAt(selected.length > 0 ? -1 : 0);
          }}
          onKeyDown={(e) => {
            // Widget keys run first (they preventDefault), then the consumer
            // — it can inspect `e.defaultPrevented` to skip handled keys
            // (review New-B).
            wrapKeyDown(e);
            consumerOnKeyDown?.(e);
          }}
        />
        <span className={styles.chevron} aria-hidden="true">
          <Icon name="chevron-down" size={14} />
        </span>
      </span>

      {open && position && (
        <ul
          id={listboxId}
          role="listbox"
          className={styles.popover}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: maxDropdownHeight,
          }}
        >
          {filtered.length === 0 ? (
            <li className={styles.empty}>Không có kết quả</li>
          ) : (
            filtered.map((opt, i) => (
              <OptionItem
                key={opt.value}
                id={`${listboxId}-option-${i}`}
                option={opt}
                selected={selected.includes(opt.value)}
                highlighted={i === clampedHighlight}
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
