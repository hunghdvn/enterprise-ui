#!/usr/bin/env node
/**
 * Remove build-time CSS side-effect imports from emitted declarations.
 *
 * `src/index.ts` side-effect imports `@enterprise-ui/tokens/all.css` so Vite
 * bundles the token layer into `dist/style.css`, but the published JS does not
 * import CSS. `tsc` preserves CSS imports in the `.d.ts` files; without a
 * `*.css` declaration in the package, consumers on TS < 5.6 (or with
 * `noUncheckedSideEffectImports`) fail with TS2307. The d.ts describes the JS
 * module, so build-time CSS side-effect imports must not be part of its public
 * surface.
 *
 * Strips `import '…css…'` (including `?inline` and leading/trailing comments)
 * from every `.d.ts` under `dist`, then fails if any CSS module specifier
 * remains — including binding/type-only imports, which must not be corrupted
 * silently. Fails if `dist` has no declarations at all.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (!existsSync(dist)) {
  throw new Error(`strip-css-import: missing dist directory: ${dist}`);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.d.ts')) out.push(full);
  }
  return out;
}

const files = walk(dist);
if (files.length === 0) {
  throw new Error('strip-css-import: no .d.ts files under dist');
}

// Side-effect CSS import only — no binding. A binding/type-only CSS import is
// left in place; the verification below fails so it cannot be silently removed.
const sideEffectCss = /import\s+(['"])([^'"]+\.css(?:\?[^'"]*)?)\1[ \t]*;?[^\n]*(?:\r?\n|$)/g;
const anyCssSpecifier =
  /(?:^|\n)\s*(?:import|export)\b[^\n]*\.css(?:\?[^'"]*)?['"]|from\s*['"][^'"]+\.css(?:\?[^'"]*)?['"]/;

let changedFiles = 0;
let removed = 0;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const matches = source.match(sideEffectCss);
  if (!matches) continue;
  writeFileSync(file, source.replace(sideEffectCss, ''));
  changedFiles += 1;
  removed += matches.length;
}

for (const file of files) {
  if (anyCssSpecifier.test(readFileSync(file, 'utf8'))) {
    throw new Error(`strip-css-import: CSS module import/export still present in ${file}`);
  }
}

console.log(
  changedFiles === 0
    ? 'no CSS side-effect imports in dist declarations'
    : `stripped ${removed} CSS side-effect import(s) from ${changedFiles} declaration file(s)`,
);
