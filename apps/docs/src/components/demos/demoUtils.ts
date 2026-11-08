/** Format a date as dd/mm/yyyy for demo output. */
export function formatDate(date: Date | null): string {
  if (!date) return '—';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Drop an error key without allocating when the key is absent. */
export function withoutKey<T extends string>(
  errors: Partial<Record<T, string>>,
  key: T,
): Partial<Record<T, string>> {
  if (!(key in errors)) return errors;
  const next = { ...errors };
  delete next[key];
  return next;
}
