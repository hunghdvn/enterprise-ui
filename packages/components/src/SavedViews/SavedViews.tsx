import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { SavedViewsProps } from './types';
import styles from './SavedViews.module.css';

const GAP_PX = 4;
const EST_ROW_HEIGHT = 32;
const EST_CHROME = 48; // list padding + save row + divider
const POPOVER_MAX_HEIGHT = 280;

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

  // Highlight clamped to the live list (Combobox review #9c): deleting the
  // last row while the popover is open must never leave Enter dereferencing
  // `views[highlightedIndex]` undefined, nor point activedescendant at a
  // dangling IDREF (review #23 #1).
  const clampedHighlight = useMemo(
    () => (views.length === 0 ? -1 : Math.max(-1, Math.min(highlightedIndex, views.length - 1))),
    [highlightedIndex, views.length],
  );

  // Shared by openAt and the resize listener so a resize re-places the
  // popover from the fresh trigger rect (Combobox review #7 — a rotation or
  // window drag must not leave it anchored to a stale rect).
  const placePopover = useCallback(() => {
    const cr = triggerRef.current?.getBoundingClientRect();
    if (!cr) {
      setPosition(null);
      return;
    }
    const height = Math.min(Math.max(views.length, 1) * EST_ROW_HEIGHT, 240) + EST_CHROME;
    const spaceBelow = (window.innerHeight || 0) - cr.bottom - GAP_PX;
    const top = spaceBelow >= height ? cr.bottom + GAP_PX : Math.max(0, cr.top - height - GAP_PX);
    setPosition({ top, left: cr.left, width: Math.max(cr.width, 240) });
  }, [views.length]);

  const openAt = () => {
    setOpen(true);
    setHighlightedIndex(views.length > 0 ? 0 : -1);
    placePopover();
  };

  const close = () => {
    setOpen(false);
    setDraft('');
    setHighlightedIndex(-1);
    setPosition(null);
  };

  // Click-away, scroll, focus-boundary dismissal and resize re-placement,
  // all contained against the widget root (Combobox review #1 / #3 / #6 / #7).
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
    // Focus falling to `body` (null relatedTarget) right after a mousedown
    // INSIDE the widget is a click on non-focusable chrome, not a dismiss —
    // closing there would wipe the save draft (review #23 #6).
    let mouseInsideRoot = false;
    const onMouseDown = (e: MouseEvent) => {
      mouseInsideRoot = !!(e.target instanceof Node && root?.contains(e.target));
    };
    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null;
      if (related && root?.contains(related)) return;
      if (!related && mouseInsideRoot) return;
      close();
    };
    const onResize = () => placePopover();
    document.addEventListener('mousedown', onDocMouseDown, true);
    document.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('focusout', onFocusOut, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown, true);
      document.removeEventListener('mousedown', onMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('focusout', onFocusOut, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, placePopover]);

  const apply = (id: string) => {
    // `disabled` may flip while the popover is open — applied views must not
    // fire afterwards (review #23 #9).
    if (disabled) return;
    onApply(id);
    close();
  };

  const save = () => {
    if (disabled) return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSave(trimmed);
    close();
  };

  // Focus stays on the trigger (role="combobox" — APG select-only pattern);
  // the highlighted option is exposed via aria-activedescendant (Combobox
  // pattern). Enter never wraps from the no-highlight state (New-A).
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
        if (open) {
          e.preventDefault();
          if (n > 0 && clampedHighlight >= 0) apply(views[clampedHighlight].id);
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

  // Escape from anywhere inside the popover (the × buttons, the save input)
  // closes it — the trigger's handler only covers the trigger itself
  // (Combobox review New-E).
  const popoverKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close();
    }
  };

  // Keep the keyboard-highlighted option visible (Combobox review #8).
  useEffect(() => {
    if (!open || clampedHighlight < 0) return;
    const el = document.getElementById(`${listboxId}-option-${clampedHighlight}`);
    el?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [open, clampedHighlight, listboxId]);

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
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={
          open && clampedHighlight >= 0 ? `${listboxId}-option-${clampedHighlight}` : undefined
        }
        aria-label={ariaLabel ?? 'Saved views'}
        className={styles.trigger}
        data-size={size}
        data-open={open || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openAt())}
        onKeyDown={triggerKeyDown}
      >
        <span className={styles['trigger-label']}>{triggerLabel}</span>
        <span className={styles.chevron} aria-hidden="true">
          <Icon name="chevron-down" size={14} />
        </span>
      </button>

      {open && position && (
        <div
          className={styles.popover}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: POPOVER_MAX_HEIGHT,
          }}
          onKeyDown={popoverKeyDown}
        >
          <div role="listbox" id={listboxId} aria-label={ariaLabel ?? 'Saved views'}>
            {views.length === 0 ? (
              <div className={styles.empty}>Chưa có view nào</div>
            ) : (
              views.map((view, i) => (
                // Plain wrapper so the delete button is a SIBLING of the
                // option, not a descendant — an interactive control inside
                // role="option" is an ARIA anti-pattern (review #23 #8).
                <div key={view.id} className={styles.row}>
                  <div
                    id={`${listboxId}-option-${i}`}
                    role="option"
                    aria-selected={view.id === activeId}
                    className={[
                      styles.option,
                      i === clampedHighlight ? styles['option-highlighted'] : '',
                    ].join(' ')}
                    tabIndex={-1}
                    onPointerEnter={() => setHighlightedIndex(i)}
                    onClick={() => apply(view.id)}
                  >
                    <span className={styles.check} aria-hidden="true">
                      {view.id === activeId && <Icon name="check" size={14} />}
                    </span>
                    <span className={styles['option-label']}>{view.label}</span>
                  </div>
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
          </div>
          {/* Save row lives OUTSIDE the listbox — mixed content inside
              role="listbox" is an ARIA anti-pattern (review #23 #8). */}
          <div className={styles['save-row']}>
            <input
              className={styles['save-input']}
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
                }
              }}
            />
            <button
              type="button"
              className={styles['save-btn']}
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
