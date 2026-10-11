import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './Drawer.module.css';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function isTabbable(el: HTMLElement): boolean {
  // :disabled matches native disabled + fieldset-disabled descendants.
  if (el.matches(':disabled')) return false;
  if (el.tabIndex < 0) return false;
  // getClientRects() is empty for display:none / hidden / detached controls in
  // real browsers. jsdom has no layout (every rect list is empty), so fall back
  // to computed style there — visible controls stay tabbable while
  // display:none / visibility:hidden / hidden controls are still skipped.
  if (el.getClientRects().length === 0) {
    const cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (el.hasAttribute('hidden')) return false;
  }
  return true;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    const panel = panelRef.current;
    const timer = window.setTimeout(() => {
      const items = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isTabbable)
        : [];
      (items[0] ?? panel)?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && panel) {
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isTabbable);
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active || !panel.contains(active)) {
          // Focus escaped the panel (e.g. Tab from the browser chrome or a
          // control outside the dialog): pull it back inside (containment).
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
          return;
        }
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      const prev = prevFocus.current as HTMLElement | null;
      prev?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className={styles.overlay} data-testid="drawer-overlay" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Đóng">
            ✕
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
