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
