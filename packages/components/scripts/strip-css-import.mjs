#!/usr/bin/env node
/**
 * Remove the build-time tokens CSS side-effect import from emitted declarations.
 *
 * `src/index.ts` side-effect imports `@enterprise-ui/tokens/all.css` so Vite
 * bundles the token layer into `dist/style.css`, but the published JS does not
 * import CSS. `tsc` preserves the import in the `.d.ts` files, which makes
 * consumers on TS < 5.6 (or with `noUncheckedSideEffectImports`) fail with
 * TS2307. The d.ts describes the JS module, so that build-time import must not
 * be part of its public surface.
 *
 * Only a whole line that is exactly a side-effect import of a tokens CSS file
 * is removed. Patterns are anchored at line boundaries and never touch
 * comments, string literals, type imports, re-exports, or other statements on
 * the same line. Fails if dist has no declarations or any pure side-effect CSS
 * import survives.
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

// An entire line consisting solely of `import '@enterprise-ui/tokens/....css';`
// (a ?query suffix is allowed). Anchored with `^` and line-end so nothing else
// on the line — comments, exports, strings — can be swallowed.
const tokensCssImport =
  /^[ \t]*import\s+(['"])@enterprise-ui\/tokens\/[^'"]+\.css(?:\?[^'"]*)?\1;[ \t]*\r?\n?/gm;
// Any other pure side-effect CSS import would reintroduce TS2307; fail loudly.
const danglingCssImport = /^[ \t]*import\s+(['"])[^'"]+\.css(?:\?[^'"]*)?\1/m;

let changedFiles = 0;
let removed = 0;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const matches = source.match(tokensCssImport);
  if (!matches) continue;
  writeFileSync(file, source.replace(tokensCssImport, ''));
  changedFiles += 1;
  removed += matches.length;
}

for (const file of files) {
  if (danglingCssImport.test(readFileSync(file, 'utf8'))) {
    throw new Error(`strip-css-import: side-effect CSS import still present in ${file}`);
  }
}

console.log(
  changedFiles === 0
    ? 'no tokens CSS side-effect imports in dist declarations'
    : `stripped ${removed} tokens CSS side-effect import(s) from ${changedFiles} declaration file(s)`,
);
