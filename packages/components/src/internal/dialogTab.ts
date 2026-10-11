export const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * True when `el` or any ancestor is not rendered. The element's own computed
 * style is not enough: a focusable descendant of a `display:none` ancestor
 * still reports its own normal `display` (`display` is not inherited, unlike
 * `visibility`), so the whole parent chain up to the document has to be walked.
 */
function isHiddenInChain(el: HTMLElement): boolean {
  let node: HTMLElement | null = el;
  while (node !== null) {
    if (node.hasAttribute('hidden')) return true;
    const cs = window.getComputedStyle(node);
    if (cs.display === 'none' || cs.visibility === 'hidden') return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * Whether `el` is a control the user can reach with Tab inside a dialog.
 *
 * Checked unconditionally against the ancestor chain rather than through a
 * `getClientRects().length === 0` early-out: jsdom performs no layout, so
 * client rects are empty for every element there and cannot tell hidden from
 * visible. Walking `el` and every `parentElement` covers the element's own
 * `display:none` / `visibility:hidden` / `hidden` state too, and keeps real
 * browsers from treating an unreachable descendant as a trap boundary.
 */
export function isTabbable(el: HTMLElement): boolean {
  // :disabled matches native disabled + fieldset-disabled descendants.
  if (el.matches(':disabled')) return false;
  if (el.tabIndex < 0) return false;
  return !isHiddenInChain(el);
}

/**
 * Registration of an open dialog. Dialogs are stacked: only the topmost one
 * handles Escape, so a modal with a drawer on top does not close both at once.
 */
export interface DialogHandle {
  isTop: () => boolean;
  dispose: () => void;
}

const openDialogs: { token: symbol; panel: () => HTMLElement | null }[] = [];

/**
 * The panel painted on top: the one no other open panel follows in document
 * order. Same z-index everywhere, so document order decides stacking — and
 * which dialog owns Escape — while registration order cannot (React mounts
 * children before parents). Panels that unmounted without disposing report
 * `null` and are ignored.
 */
function topmostPanel(): HTMLElement | null {
  let top: HTMLElement | null = null;
  for (const entry of openDialogs) {
    const el = entry.panel();
    if (!el) continue;
    if (top === null || top.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
      top = el;
    }
  }
  return top;
}

export function registerDialog(panel: () => HTMLElement | null): DialogHandle {
  const token = Symbol('dialog');
  openDialogs.push({ token, panel });
  return {
    isTop: () => {
      const mine = panel();
      // A dialog is top iff its panel is the topmost one (see topmostPanel).
      if (!mine) return false;
      return topmostPanel() === mine;
    },
    dispose: () => {
      const at = openDialogs.findIndex((d) => d.token === token);
      if (at !== -1) openDialogs.splice(at, 1);
    },
  };
}

/**
 * Hands focus back when a dialog closes.
 *
 * The dialog that opened remembers what was focused before it (`prev`); focus
 * returns there when that element is still usable. When it is not — `body`
 * still holds focus because the element would be an element behind the dialog,
 * it unmounted meanwhile, or it refuses focus — focus goes to the topmost
 * dialog still open, so it never lands on the page behind a modal. Call this
 * *after* disposing the closing dialog, so the stack holds the dialogs that
 * remain.
 */
export function restoreFocus(prev: Element | null): void {
  if (
    prev instanceof HTMLElement &&
    prev !== document.body &&
    document.contains(prev) &&
    typeof prev.focus === 'function'
  ) {
    prev.focus();
    // Being in the document is not the same as being focusable: a control
    // disabled or hidden while the stack was open silently refuses focus, and
    // returning here would strand focus on `body`. Confirm the move actually
    // happened, and otherwise fall through to the dialog below.
    if (document.activeElement === prev) return;
  }
  const panel = topmostPanel();
  if (!panel) return;
  const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isTabbable);
  (items[0] ?? panel).focus();
}

let bodyLocks = 0;
let prevBodyOverflow = '';

/**
 * Locks `body` scroll and returns the release. Locked once per stack: the page
 * stays unscrollable while any dialog is open and the value captured before the
 * first lock is restored only when the last one releases.
 */
export function lockBodyScroll(): () => void {
  if (bodyLocks === 0) {
    prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyLocks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    bodyLocks -= 1;
    if (bodyLocks === 0) document.body.style.overflow = prevBodyOverflow;
  };
}
