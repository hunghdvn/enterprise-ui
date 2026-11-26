#!/usr/bin/env node
/**
 * Remove build-time tokens CSS side-effect imports from emitted declarations.
 *
 * `src/index.ts` side-effect imports `@enterprise-ui/tokens/all.css` so Vite
 * bundles the token layer into `dist/style.css`, but the published JS does not
 * import CSS. `tsc` preserves the import in `.d.ts`, which breaks consumers on
 * TS < 5.6 (or with `noUncheckedSideEffectImports`). This script removes those
 * lines and fails if any other CSS module specifier remains in the types.
 *
 * Line-based with block-comment tracking: every line is retained unless it is
 * exactly a tokens CSS side-effect import outside a comment. JSDoc examples are
 * documentation and are never edited. CRLF input is handled without losing the
 * original line ending.
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

const tokensImport =
  /^[ \t]*import\s+(['"])@enterprise-ui\/tokens\/[^'"]+\.css(?:\?[^'"]*)?\1;[ \t]*$/;
const cssSpecifier = /['"][^'"]+\.css([?#][^'"]*)?['"]/;

/** Block-comment state for one line; returns whether the line starts in a block. */
function commentState(line, state) {
  const startsInBlock = state.inBlock;
  const bare = line.replace(/\r$/, '');
  const opens = (bare.match(/\/\*/g) ?? []).length;
  const closes = (bare.match(/\*\//g) ?? []).length;
  state.inBlock = startsInBlock ? closes <= opens : opens > closes;
  return startsInBlock;
}

let changedFiles = 0;
let removed = 0;

for (const file of files) {
  const state = { inBlock: false };
  const kept = [];
  let removedHere = 0;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const startsInBlock = commentState(line, state);
    if (!startsInBlock && tokensImport.test(line.replace(/\r$/, ''))) {
      removedHere += 1;
    } else {
      kept.push(line);
    }
  }
  if (removedHere === 0) continue;
  writeFileSync(file, kept.join('\n'));
  changedFiles += 1;
  removed += removedHere;
}

/** Blank out comments and string literals; code (including marker tokens) stays. */
function maskCommentsAndStrings(text) {
  let out = '';
  let i = 0;
  let inBlock = false;
  let inLine = false;
  let quote = null;
  while (i < text.length) {
    const c = text[i];
    const n = text[i + 1];
    if (inLine) {
      if (c === '\n') {
        inLine = false;
        out += '\n';
      }
      i += 1;
      continue;
    }
    if (inBlock) {
      if (c === '*' && n === '/') {
        inBlock = false;
        i += 2;
      } else {
        if (c === '\n') out += '\n';
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i += 1;
      continue;
    }
    if (c === '/' && n === '*') {
      inBlock = true;
      i += 2;
      continue;
    }
    if (c === '/' && n === '/') {
      inLine = true;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c;
      i += 1;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

for (const file of files) {
  // Mark every CSS specifier, then blank out comments and strings. A marker
  // that survives is a real module specifier in the declaration code; one in a
  // JSDoc example or string literal disappears with its container.
  const marked = readFileSync(file, 'utf8').replace(cssSpecifier, '__CSS_SPEC__');
  if (maskCommentsAndStrings(marked).includes('__CSS_SPEC__')) {
    throw new Error(
      `strip-css-import: CSS module specifier remains in ${file} ` +
        '(consumer types need a *.css declaration; ship one or remove the specifier)',
    );
  }
}

console.log(
  changedFiles === 0
    ? 'no tokens CSS side-effect imports in dist declarations'
    : `stripped ${removed} tokens CSS side-effect import(s) from ${changedFiles} declaration file(s)`,
);
