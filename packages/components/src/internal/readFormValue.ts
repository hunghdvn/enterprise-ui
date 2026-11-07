/**
 * Reads what is actually in the form for `keys`. A browser or password-manager autofill can
 * write into the controls without firing a React change event; submitting the `value` prop
 * would then send stale data. A missing control keeps the controlled value instead of blanking
 * the field, so a conditionally rendered input cannot erase it.
 *
 * Checkboxes and radios report `checked`; every other input reports `value`. The cast is needed
 * because the key set is generic — callers declare each key with the type of its control.
 */
export function readFormValues<T extends object>(
  form: HTMLFormElement,
  current: T,
  keys: readonly (keyof T & string)[],
): T {
  const next: T = { ...current };
  for (const key of keys) {
    const element = form.elements.namedItem(key);
    if (!(element instanceof HTMLInputElement)) continue;
    next[key] = (
      element.type === 'checkbox' || element.type === 'radio' ? element.checked : element.value
    ) as T[typeof key];
  }
  return next;
}
