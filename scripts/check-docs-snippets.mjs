#!/usr/bin/env node
/**
 * check-docs-snippets — typecheck every docs page's `const code = \`...\`` snippet
 * against the built @enterprise-ui/components (S8, spec: docs/superpowers/specs/
 * 2026-10-20-docs-demo-sync-design.md).
 *
 * One snippet = one .tsx file = one error isolate: a broken snippet cannot mask
 * the others. Temp output lives under node_modules/.docs-snippets (gitignored,
 * wiped on install) — never inside apps/docs/src.
 *
 * Exit codes: 0 = all snippets compile; 1 = at least one snippet (or the
 * harness itself) failed.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = path.join(repoRoot, 'apps', 'docs', 'src', 'pages');
const outDir = path.join(repoRoot, 'node_modules', '.docs-snippets');
// `tsc` is not on PATH in CI/npm-scripts contexts — use the hoisted workspace
// install directly, falling back to PATH for exotic setups.
const tscBin = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
const tscCmd = existsSync(tscBin) ? tscBin : 'tsc';

/** Recursively collect *.tsx page files. */
function pageFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pageFiles(full));
    else if (entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/**
 * Extract the body of a top-level `const code = \`...\`` template literal.
 * The established docs pattern is exactly one such const per page; nested
 * backticks do not occur (snippets are plain source samples).
 */
function extractSnippet(source) {
  const marker = 'const code = `';
  const start = source.indexOf(marker);
  if (start === -1) return null;
  const bodyStart = start + marker.length;
  const end = source.indexOf('`;', bodyStart);
  if (end === -1) return null;
  return source.slice(bodyStart, end);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const files = pageFiles(pagesDir);
let snippets = 0;

for (const file of files) {
  const rel = path.relative(pagesDir, file);
  const name = rel.replace(/[/.]/g, '-').replace(/\.tsx$/, '');
  const snippet = extractSnippet(readFileSync(file, 'utf8'));
  if (snippet === null) {
    console.log(`SKIP  ${rel} (no const code snippet)`);
    continue;
  }
  snippets += 1;
  // Re-escape nothing: the snippet body is written verbatim — it must
  // typecheck exactly as a reader would copy it.
  writeFileSync(path.join(outDir, `${name}.tsx`), snippet);
}

const tsconfig = {
  extends: path.relative(outDir, path.join(repoRoot, 'apps', 'docs', 'tsconfig.json')),
  compilerOptions: { noEmit: true },
  include: ['*.tsx'],
};
writeFileSync(path.join(outDir, 'tsconfig.json'), `${JSON.stringify(tsconfig, null, 2)}\n`);

let tsc;
try {
  tsc = execFileSync(tscCmd, ['--pretty', 'false', '-p', outDir], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
} catch (err) {
  tsc = err.stdout ?? String(err);
  const broken = new Set(
    tsc
      .split('\n')
      .map((line) => line.match(/\.docs-snippets[/\\](.+?\.tsx)\(/)?.[1])
      .filter(Boolean),
  );
  if (broken.size > 0) {
    console.error(`\n✖ ${broken.size} snippet(s) failed typecheck:`);
    for (const f of broken) console.error(`  ✖ ${f}`);
    console.error('\nFull compiler output:\n');
    console.error(tsc);
    process.exit(1);
  }
  // Compiler failed without per-file diagnostics (config-level error).
  console.error('\n✖ snippet typecheck failed (no per-file diagnostics):\n');
  console.error(tsc);
  process.exit(1);
}

console.log(`docs snippets ok (${snippets} snippet${snippets === 1 ? '' : 's'} typechecked)`);
