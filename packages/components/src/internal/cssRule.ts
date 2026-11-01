/**
 * Body of the last rule whose selector list contains `selector` as a whole selector, read from a
 * `.module.css` source. jsdom cannot compute module-CSS styles, so a few visual contracts are
 * pinned at source level; this helper keeps that parsing in one place.
 *
 * Comments are stripped first (a selector named in a comment must not match), the selector must
 * open its own rule at a line start / comma / brace so `.b.a {` is not read as `.a {`, braces are
 * balanced so a rule nested in `@media`/`@supports` is not truncated, and the last match wins so a
 * later override is the one inspected.
 */
export function cssRule(css: string, selector: string): string {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rule = new RegExp(`(?:^|[,\\n{}])\\s*${escaped}\\s*(?=[,{])`, 'g');
  let body: string | null = null;
  for (let match = rule.exec(stripped); match; match = rule.exec(stripped)) {
    const open = stripped.indexOf('{', match.index);
    if (open === -1) break;
    let depth = 0;
    for (let i = open; i < stripped.length; i++) {
      if (stripped[i] === '{') depth += 1;
      else if (stripped[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          body = stripped.slice(open + 1, i);
          break;
        }
      }
    }
  }
  if (body === null) throw new Error(`missing rule ${selector}`);
  return body;
}
