import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './Modal.module.css';
import {
  FOCUSABLE,
  isTabbable,
  lockBodyScroll,
  registerDialog,
  restoreFocus,
} from '../internal/dialogTab';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  // Whether the pointer press that ends under the overlay started on it. A
  // press begun on a control inside the panel and released on the overlay
  // still fires a click on the overlay (its nearest common ancestor with the
  // panel), so remembering the press target is the only way to tell that drag
  // from a genuine click on the backdrop.
  const pressOnOverlay = useRef(true);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    const panel = panelRef.current;
    const dialog = registerDialog(() => panelRef.current);
    const releaseScroll = lockBodyScroll();
    const timer = window.setTimeout(() => {
      // The topmost dialog claims initial focus; one stacked under must not
      // steal it once its own (later-running) timer fires.
      if (!dialog.isTop()) return;
      // A control React already focused keeps it (autoFocus on a child): the
      // caller chose where focus belongs, so the timer must not override it.
      if (panel?.contains(document.activeElement)) return;
      const items = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isTabbable)
        : [];
      (items[0] ?? panel)?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // A dialog stacked on top owns Escape until it closes.
        if (!dialog.isTop()) return;
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab' && panel) {
        // The topmost dialog owns Tab containment; a dialog stacked under it
        // keeps its listener silent so both cannot fight over focus.
        if (!dialog.isTop()) return;
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isTabbable);
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active || active === panel || !panel.contains(active)) {
          // Focus escaped the panel — the panel itself has it (clicking the
          // padding gives a tabIndex=-1 panel focus), focus sits outside the
          // dialog, or nothing has focus yet: pull it back inside so Tab never
          // walks onto the page behind the dialog.
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
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      releaseScroll();
      // Dispose first so the remaining stack is what restoreFocus falls back
      // to: closing a drawer on top of a modal must move focus back into the
      // modal, not to the `body` it captured when it opened.
      dialog.dispose();
      restoreFocus(prevFocus.current);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className={styles.overlay}
      data-testid="modal-overlay"
      onMouseDown={(e) => {
        pressOnOverlay.current = e.target === e.currentTarget;
      }}
      onClick={() => {
        // The panel stops propagation on its own clicks; the overlay closes
        // only for a press that started on the backdrop itself.
        if (pressOnOverlay.current) onClose();
      }}
    >
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
