/**
 * Joins class parts, skipping falsy ones — the inline
 * `filter(Boolean).join(' ')` merge shared by components that compose
 * conditional class names (Tooltip, Table, ...).
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
