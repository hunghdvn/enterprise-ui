#!/usr/bin/env node
/**
 * Remove build-time CSS imports from the emitted declarations.
 *
 * `src/index.ts` side-effect imports `@enterprise-ui/tokens/all.css` so Vite
 * bundles the token layer into `dist/style.css`, but the published JS does not
 * import CSS. `tsc` preserves CSS imports in the `.d.ts` files; without a
 * `*.css` declaration in the package, consumers on TS < 5.6 (or with
 * `noUncheckedSideEffectImports`) fail with TS2307. The d.ts describes the JS
 * module, so no CSS import belongs in its public surface.
 *
 * Walks every `.d.ts` file under `dist` (recursively) and strips any import
 * whose specifier ends in `.css` (side-effect or otherwise). Fails if one
 * survives, so a renamed or newly added CSS import cannot silently ship.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.d.ts')) out.push(full);
  }
  return out;
}

// Matches `import './x.css';`, `import '@scope/pkg/x.css';`, and
// `import styles from './x.css';` — any declaration that needs a CSS module type.
const cssImport = /^\s*import\s+.*['"][^'"]+\.css['"];?\s*$/;

const files = walk(dist);
let changedFiles = 0;
let removed = 0;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');
  const kept = lines.filter((line) => !cssImport.test(line));
  if (kept.length === lines.length) continue;
  writeFileSync(file, kept.join('\n'));
  changedFiles += 1;
  removed += lines.length - kept.length;
}

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  if (source.split('\n').some((line) => /^\s*import\s+.*\.css['"]/.test(line))) {
    throw new Error(`strip-css-import: CSS import still present in ${file}`);
  }
}

console.log(
  changedFiles === 0
    ? 'no CSS imports in dist declarations'
    : `stripped ${removed} CSS import(s) from ${changedFiles} declaration file(s)`,
);
