#!/usr/bin/env node
/**
 * Remove the build-time tokens CSS import from the emitted declarations.
 *
 * `src/index.ts` side-effect imports `@enterprise-ui/tokens/all.css` so Vite
 * bundles the token layer into `dist/style.css`, but the published JS does not
 * import CSS. `tsc` preserves the import in `dist/index.d.ts`; without a
 * `*.css` declaration in the package, consumers on TS < 5.6 (or with
 * `noUncheckedSideEffectImports`) fail with TS2307. The d.ts describes the JS
 * module, so the build-time CSS import must not be part of its public surface.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dts = path.join(root, 'dist', 'index.d.ts');
const source = readFileSync(dts, 'utf8');
const cssImport = /^import '@enterprise-ui\/tokens\/all\.css';?\r?\n/;
const next = source.replace(cssImport, '');

if (next !== source) {
  writeFileSync(dts, next);
}

if (readFileSync(dts, 'utf8').includes('@enterprise-ui/tokens/all.css')) {
  throw new Error('strip-css-import: tokens CSS import still present in dist/index.d.ts');
}

console.log('stripped tokens CSS import from dist/index.d.ts');
