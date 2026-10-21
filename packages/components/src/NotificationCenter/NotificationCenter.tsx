import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/types';
import type { NotificationCenterProps, Notification } from './types';
import styles from './NotificationCenter.module.css';

const GAP_PX = 4;
const EST_ROW_HEIGHT = 44;
const EST_CHROME = 56; // header + padding

function kindIcon(kind: Notification['kind']): IconName {
  switch (kind) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'alert-triangle';
    case 'danger':
      return 'alert-circle';
    default:
      return 'info';
  }
}

export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onRemove,
  onSelect,
  size = 'sm',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: NotificationCenterProps) {
  const uid = useId();
  const panelId = `notification-center-${uid.replace(/:/g, '')}`;
  const wrapRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );

  // Dev-only diagnostic for duplicate ids (Combobox/SavedViews precedent).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const seen = new Set<string>();
    for (const n of notifications) {
      if (seen.has(n.id)) console.warn(`[NotificationCenter] duplicate notification id "${n.id}".`);
      seen.add(n.id);
    }
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.reduce((n, item) => n + (item.unread ? 1 : 0), 0),
    [notifications],
  );
  const badgeLabel = unreadCount > 9 ? '9+' : String(unreadCount);

  const placePopover = useCallback(
    (cr?: DOMRect | null) => {
      const rect = cr ?? triggerRef.current?.getBoundingClientRect();
      if (!rect) {
        setPosition(null);
        return;
      }
      const height = Math.min(Math.max(notifications.length, 1) * EST_ROW_HEIGHT, 320) + EST_CHROME;
      const spaceBelow = (window.innerHeight || 0) - rect.bottom - GAP_PX;
      const top =
        spaceBelow >= height ? rect.bottom + GAP_PX : Math.max(0, rect.top - height - GAP_PX);
      setPosition({ top, left: rect.left, width: Math.max(rect.width, 300) });
    },
    [notifications.length],
  );

  const openAt = () => {
    setOpen(true);
    placePopover();
  };

  const close = () => {
    setOpen(false);
    setPosition(null);
    // Return focus to the bell so Esc/click-away never strand it on <body>
    // (review #27 #1).
    triggerRef.current?.focus();
  };

  const panelRef = useRef<HTMLDivElement>(null);

  // Re-place the panel when the notification list changes while open (review
  // #27 #3) — a growing/shrinking list otherwise mis-sizes the panel.
  useEffect(() => {
    if (open) placePopover();
  }, [open, notifications.length, placePopover]);

  // Move focus into the panel on open (review #27 #4 — light focus trap).
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  // Click-away, scroll and focus-boundary dismissal — all contained against
  // the widget root (Combobox/SavedViews precedent).
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
    const onResize = () => placePopover();
    document.addEventListener('mousedown', onDocMouseDown, true);
    window.addEventListener('scroll', onScroll, true);
    document.addEventListener('focusout', onFocusOut, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown, true);
      window.removeEventListener('scroll', onScroll, true);
      document.removeEventListener('focusout', onFocusOut, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, placePopover]);

  const triggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) close();
      else openAt();
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      close();
    }
  };

  const panelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close();
    }
  };

  const triggerLabel = ariaLabel ?? 'Thông báo';

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
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openAt())}
        onKeyDown={triggerKeyDown}
      >
        <span className={styles.bell} aria-hidden="true">
          <Icon name="bell" size={18} />
        </span>
        {unreadCount > 0 && (
          <span className={styles.badge} aria-label={`${unreadCount} thông báo chưa đọc`}>
            {badgeLabel}
          </span>
        )}
      </button>

      {open && position && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={triggerLabel}
          className={styles.panel}
          tabIndex={-1}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: 360,
          }}
          onKeyDown={panelKeyDown}
        >
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Thông báo</span>
            {unreadCount > 0 && onMarkAllRead && (
              <button
                type="button"
                className={styles['mark-all']}
                onClick={() => {
                  onMarkAllRead();
                }}
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                <Icon name="inbox" size={24} />
              </span>
              <span>Không có thông báo</span>
            </div>
          ) : (
            <ul className={styles.list}>
              {notifications.map((n) => (
                <li key={n.id} className={styles.item} data-unread={n.unread || undefined}>
                  <span className={styles['item-icon']} aria-hidden="true">
                    {n.icon ?? <Icon name={kindIcon(n.kind)} size={16} />}
                  </span>
                  <div className={styles['item-body']}>
                    <span className={styles['item-title']}>{n.title}</span>
                    {n.body && <span className={styles['item-text']}>{n.body}</span>}
                    <span className={styles['item-time']}>{n.time}</span>
                  </div>
                  <div className={styles['item-actions']}>
                    {n.unread && onMarkRead && (
                      <button
                        type="button"
                        className={styles['item-action']}
                        aria-label={`Đánh dấu đã đọc: ${n.title}`}
                        onClick={() => onMarkRead(n.id)}
                      >
                        <Icon name="check" size={12} />
                      </button>
                    )}
                    {onSelect && (
                      <button
                        type="button"
                        className={styles['item-action']}
                        aria-label={`Mở: ${n.title}`}
                        onClick={() => onSelect(n.id)}
                      >
                        <Icon name="arrow-right" size={12} />
                      </button>
                    )}
                    {onRemove && (
                      <button
                        type="button"
                        className={styles['item-action']}
                        aria-label={`Xóa: ${n.title}`}
                        onClick={() => onRemove(n.id)}
                      >
                        <Icon name="x" size={12} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </span>
  );
}
