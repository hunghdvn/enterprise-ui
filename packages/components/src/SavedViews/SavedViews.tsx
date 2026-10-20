import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { SavedViewsProps } from './types';
import styles from './SavedViews.module.css';

const GAP_PX = 4;
const EST_ROW_HEIGHT = 32;
const EST_CHROME = 48; // list padding + save row + divider

export function SavedViews<T>({
  views,
  activeId,
  onApply,
  onSave,
  onDelete,
  size = 'sm',
  disabled = false,
  savePlaceholder = 'Tên view...',
  label = 'Views',
  className,
  'aria-label': ariaLabel,
}: SavedViewsProps<T>) {
  const uid = useId();
  const listboxId = `saved-views-${uid.replace(/:/g, '')}`;
  // `wrap` is the widget root for click-away / scroll / focus containment —
  // never the trigger alone (the popover is its sibling; Combobox review #1).
  const wrapRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Attached to the save input for future focus management; focus stays on
  // the trigger while the list is open (activedescendant keyboard flow).
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  // Duplicate ids break keying and apply/delete identity — dev-only warn
  // (Combobox review #14).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const seen = new Set<string>();
    for (const view of views) {
      if (seen.has(view.id)) {
        console.warn(`[SavedViews] duplicate view id "${view.id}" — identity is ambiguous.`);
      }
      seen.add(view.id);
    }
  }, [views]);

  const activeView = useMemo(
    () => views.find((view) => view.id === activeId) ?? null,
    [views, activeId],
  );

  const openAt = () => {
    setOpen(true);
    setHighlightedIndex(views.length > 0 ? 0 : -1);
    const cr = triggerRef.current?.getBoundingClientRect();
    if (cr) {
      // One gap in JS; the CSS carries no extra margin (Combobox review #7).
      const height = Math.min(Math.max(views.length, 1) * EST_ROW_HEIGHT, 240) + EST_CHROME;
      const spaceBelow = (window.innerHeight || 0) - cr.bottom - GAP_PX;
      const top = spaceBelow >= height ? cr.bottom + GAP_PX : Math.max(0, cr.top - height - GAP_PX);
      setPosition({ top, left: cr.left, width: Math.max(cr.width, 240) });
    } else {
      setPosition(null);
    }
  };

  const close = () => {
    setOpen(false);
    setDraft('');
    setHighlightedIndex(-1);
    setPosition(null);
  };

  // Click-away, scroll and focus-boundary dismissal, all contained against
  // the widget root (Combobox review #1 / #3 / #6).
  useEffect(() => {
    if (!open) return;
    const root = wrapRef.current;
    const onDocMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.target instanceof Node && root && !root.contains(e.target)) close();
    };
    const onScroll = (e: Event) => {
      const target = e.target;
      if (target instanceof Node && root?.contains(target)) return;
      close();
    };
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

  const apply = (id: string) => {
    onApply(id);
    close();
  };

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSave(trimmed);
    close();
  };

  // Focus stays on the trigger; the highlighted option is exposed via
  // aria-activedescendant (Combobox pattern).
  const triggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    const n = views.length;
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!open) openAt();
        else setHighlightedIndex((i) => (n === 0 ? i : i < 0 ? 0 : (i + 1) % n));
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) openAt();
        else setHighlightedIndex((i) => (n === 0 ? i : i < 0 ? n - 1 : (i - 1 + n) % n));
        break;
      }
      case 'Enter': {
        // Apply the highlighted view; with no highlight this is a no-op —
        // never wrap onto the last option (Combobox review New-A).
        if (open) {
          e.preventDefault();
          if (n > 0 && highlightedIndex >= 0) apply(views[highlightedIndex].id);
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        if (open) close();
        break;
      }
      default:
    }
  };

  const triggerLabel = activeView ? activeView.label : label;

  return (
    <span
      ref={wrapRef}
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      data-disabled={disabled || undefined}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        data-size={size}
        data-open={open || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={
          open && views.length > 0 && highlightedIndex >= 0
            ? `${listboxId}-option-${highlightedIndex}`
            : undefined
        }
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => (open ? close() : openAt())}
        onKeyDown={triggerKeyDown}
      >
        <span className={styles.triggerLabel}>{triggerLabel}</span>
        <span className={styles.chevron} aria-hidden="true">
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {open && position && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? 'Saved views'}
          className={styles.popover}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: 280,
          }}
        >
          {views.length === 0 ? (
            <div className={styles.empty}>Chưa có view nào</div>
          ) : (
            views.map((view, i) => (
              <div
                key={view.id}
                id={`${listboxId}-option-${i}`}
                role="option"
                aria-selected={view.id === activeId}
                className={[
                  styles.option,
                  i === highlightedIndex ? styles['option-highlighted'] : '',
                ].join(' ')}
                tabIndex={-1}
                onPointerEnter={() => setHighlightedIndex(i)}
                onClick={() => apply(view.id)}
              >
                <span className={styles.check} aria-hidden="true">
                  {view.id === activeId && <Icon name="check" size={14} />}
                </span>
                <span className={styles.optionLabel}>{view.label}</span>
                {onDelete && (
                  <button
                    type="button"
                    className={styles['option-remove']}
                    aria-label={`Xóa ${view.label}`}
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(view.id);
                    }}
                  >
                    <Icon name="x" size={12} />
                  </button>
                )}
              </div>
            ))
          )}
          <div className={styles.saveRow}>
            <input
              ref={inputRef}
              className={styles.saveInput}
              value={draft}
              placeholder={savePlaceholder}
              disabled={disabled}
              aria-label={savePlaceholder}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                // IME composition must not save or close (Combobox review
                // #10 / New-E).
                if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                if (e.key === 'Enter') {
                  e.preventDefault();
                  save();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  close();
                }
              }}
            />
            <button
              type="button"
              className={styles.saveBtn}
              aria-label="Lưu view hiện tại"
              disabled={disabled || draft.trim() === ''}
              onClick={save}
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
