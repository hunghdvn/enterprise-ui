#!/usr/bin/env node
/**
 * check-docs-snippets — typecheck every TSX/TS code block in the Astro docs.
 *
 * The docs content lives under `apps/docs/src/content/docs`. Each
 * fenced `tsx` / `ts` block is one file in a temp tsconfig, so one broken
 * snippet cannot mask the others. Temp output lives under
 * `node_modules/.docs-snippets` (gitignored, wiped on install) — never inside
 * `apps/docs/src`.
 *
 * Snippets must be self-contained: they are typechecked exactly as a reader
 * would copy them, with the docs tsconfig (which maps
 * `@enterprise-ui/components` to the package source).
 *
 * Exit codes: 0 = all snippets compile; 1 = at least one snippet failed, a
 * fence was unclosed, or the harness itself failed.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(repoRoot, 'apps', 'docs', 'src', 'content', 'docs');
const outDir = path.join(repoRoot, 'node_modules', '.docs-snippets');
// `tsc` is not on PATH in CI/npm-scripts contexts — use the hoisted workspace
// install directly, falling back to PATH for exotic setups.
const tscBin = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
const tscCmd = existsSync(tscBin) ? tscBin : 'tsc';

const CHECKED_LANGS = new Set(['tsx', 'ts']);

/** Recursively collect *.md and *.mdx content files. */
function contentFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...contentFiles(full));
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/**
 * Extract fenced code blocks with their language. A fence that opens but
 * never closes is an error — silently truncating the last snippet would keep
 * CI green while the page renders differently from what was checked.
 */
function extractFences(source, file) {
  const lines = source.split('\n');
  const blocks = [];
  let open = null;

  for (const line of lines) {
    if (!open) {
      const match = line.match(/^```([\w-]*)\s*$/);
      if (match) open = { lang: match[1].toLowerCase(), body: [], line: 0 };
      continue;
    }
    if (/^```\s*$/.test(line)) {
      blocks.push(open);
      open = null;
      continue;
    }
    open.body.push(line);
  }

  if (open) {
    throw new Error(`${file}: unclosed \`\`\`${open.lang} fence`);
  }
  return blocks;
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const files = contentFiles(contentDir);
let snippets = 0;
const guardFailures = [];

for (const file of files) {
  const rel = path.relative(contentDir, file);
  const source = readFileSync(file, 'utf8');
  const name = rel.replace(/[/.]/g, '-').replace(/\.mdx?$/, '');
  let blocks;
  try {
    blocks = extractFences(source, rel);
  } catch (error) {
    guardFailures.push(String(error instanceof Error ? error.message : error));
    continue;
  }

  blocks.forEach((block, index) => {
    if (!CHECKED_LANGS.has(block.lang)) return;
    const body = block.body.join('\n');
    if (!body.trim()) return;
    snippets += 1;
    const ext = block.lang === 'ts' ? 'ts' : 'tsx';
    writeFileSync(path.join(outDir, `${name}-${index}.${ext}`), `${body}\n`);
  });
}

if (guardFailures.length > 0) {
  console.error(`\n✖ ${guardFailures.length} docs fence failure(s):`);
  for (const failure of guardFailures) console.error(`  ✖ ${failure}`);
  process.exit(1);
}

const tsconfig = {
  extends: path.relative(outDir, path.join(repoRoot, 'apps', 'docs', 'tsconfig.json')),
  compilerOptions: { noEmit: true },
  include: ['*.ts', '*.tsx'],
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
      .map((line) => line.match(/\.docs-snippets[/\\](.+?\.(?:tsx|ts))\(/)?.[1])
      .filter(Boolean),
  );
  if (broken.size > 0) {
    console.error(`\n✖ ${broken.size} snippet(s) failed typecheck:`);
    for (const file of broken) console.error(`  ✖ ${file}`);
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
