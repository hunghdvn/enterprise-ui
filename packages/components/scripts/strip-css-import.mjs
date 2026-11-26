#!/usr/bin/env node
/**
 * Remove the build-time tokens CSS side-effect import from emitted declarations.
 *
 * `src/index.ts` side-effect imports `@enterprise-ui/tokens/all.css` so Vite
 * bundles the token layer into `dist/style.css`, but the published JS does not
 * import CSS. `tsc` preserves the import in `.d.ts`, which breaks consumers on
 * TS < 5.6 (or with `noUncheckedSideEffectImports`). This script removes that
 * one import and fails if any other CSS module specifier remains.
 *
 * Uses the TypeScript parser instead of regex/lexer heuristics: comments and
 * string literals never look like imports, and every import form (static,
 * re-export, dynamic `import()`, `typeof import()`) is visible.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

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

const isCss = (text) => /\.css([?#][^'"]*)?$/.test(text);
const isTokensCss = (text) => /^@enterprise-ui\/tokens\/[^'"]+\.css([?#][^'"]*)?$/.test(text);

/** Collect every module specifier in the declaration AST. */
function specifiers(source, fileName) {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const found = [];

  const add = (node, module, kind) => {
    if (module && ts.isStringLiteral(module)) {
      found.push({ node, text: module.text, kind });
    }
  };

  const visit = (node) => {
    if (ts.isImportDeclaration(node)) {
      add(node, node.moduleSpecifier, 'import');
      // A bare side-effect import has no importClause.
      if (
        !node.importClause &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        isTokensCss(node.moduleSpecifier.text)
      ) {
        found[found.length - 1].sideEffectTokens = true;
      }
    } else if (ts.isExportDeclaration(node)) {
      add(node, node.moduleSpecifier, 'export');
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      add(node, node.arguments[0], 'dynamic');
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      add(node, node.argument.literal, 'importType');
    }
    ts.forEachChild(node, visit);
  };

  visit(sf);
  return { sf, found };
}

let changedFiles = 0;
let removed = 0;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const { sf, found } = specifiers(source, file);
  const targets = found.filter((entry) => entry.sideEffectTokens);
  if (targets.length === 0) continue;

  const ranges = targets.map(({ node }) => {
    const start = source.lastIndexOf('\n', node.getStart(sf) - 1) + 1;
    const end = source.indexOf('\n', node.getEnd(sf));
    return [start, end === -1 ? source.length : end + 1];
  });
  const kept = source;
  let next = kept;
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
    next = next.slice(0, start) + next.slice(end);
  }
  writeFileSync(file, next);
  changedFiles += 1;
  removed += targets.length;
}

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const { found } = specifiers(source, file);
  const leaked = found.find((entry) => isCss(entry.text));
  if (leaked) {
    throw new Error(
      `strip-css-import: CSS module specifier "${leaked.text}" remains in ${file} ` +
        '(consumer types need a *.css declaration; ship one or remove the specifier)',
    );
  }
}

console.log(
  changedFiles === 0
    ? 'no tokens CSS side-effect imports in dist declarations'
    : `stripped ${removed} tokens CSS side-effect import(s) from ${changedFiles} declaration file(s)`,
);
