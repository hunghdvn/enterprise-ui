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
// README fences are consumer-facing too (npm pages, quick start); check them with
// the same tsconfig so a renamed component cannot leave the README stale. Every
// publishable package must have one — a missing file is an error, not a silent skip.
const rootPkgPath = path.join(repoRoot, 'package.json');
function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`invalid JSON in ${file}: ${error.message}`);
  }
}
const rootPkg = readJson(rootPkgPath);
const readmeFiles = [path.join(repoRoot, 'README.md')];
const seenReadmes = new Set();

function considerReadme(dir) {
  const pkgPath = path.join(dir, 'package.json');
  if (!existsSync(pkgPath)) return;
  const pkg = readJson(pkgPath);
  if (pkg.private) return;
  const readme = path.join(dir, 'README.md');
  if (!existsSync(readme)) {
    throw new Error(`missing README for publishable package ${pkg.name}: ${readme}`);
  }
  if (seenReadmes.has(readme)) return;
  seenReadmes.add(readme);
  readmeFiles.push(readme);
}

for (const pattern of rootPkg.workspaces ?? []) {
  if (pattern.endsWith('/*')) {
    const base = path.join(repoRoot, pattern.slice(0, -2));
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base, { withFileTypes: true })) {
      if (entry.isDirectory()) considerReadme(path.join(base, entry.name));
    }
  } else {
    considerReadme(path.join(repoRoot, pattern));
  }
}
for (const file of readmeFiles) {
  if (!existsSync(file)) throw new Error(`missing README: ${file}`);
}
const extraFiles = readmeFiles;
const outDir = path.join(repoRoot, 'node_modules', '.docs-snippets');
// `tsc` is not on PATH in CI/npm-scripts contexts — use the hoisted workspace
// install directly, falling back to PATH for exotic setups.
const tscBin = path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc');
const tscCmd = existsSync(tscBin) ? tscBin : 'tsc';

const CHECKED_LANGS = new Set(['tsx', 'ts']);
const manifestPath = path.join(repoRoot, 'scripts', 'docs-snippets-manifest.json');

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
 *
 * Opening fences may be indented (list items) and carry an info string such
 * as `tsx title="App.tsx"`; the language is the first word. An opening fence
 * with no language is rejected instead of silently becoming unchecked prose.
 * Body lines are dedented by the fence's indentation so the snippet typechecks
 * as a reader would copy it.
 */
function extractFences(source, file) {
  const lines = source.split('\n');
  const blocks = [];
  let open = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!open) {
      const match = line.match(/^(\s*)(`{3,})(.*)$/);
      if (!match) continue;
      const info = match[3].trim();
      const lang = info.split(/\s+/)[0]?.toLowerCase() ?? '';
      if (!lang) {
        throw new Error(`${file}:${index + 1}: code fence is missing a language`);
      }
      open = { lang, indent: match[1], body: [], line: index + 1 };
      continue;
    }
    if (/^\s*`{3,}\s*$/.test(line)) {
      blocks.push(open);
      open = null;
      continue;
    }
    open.body.push(line.startsWith(open.indent) ? line.slice(open.indent.length) : line);
  }

  if (open) {
    throw new Error(`${file}:${open.line}: unclosed \`\`\`${open.lang} fence`);
  }
  return blocks;
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const files = [...contentFiles(contentDir), ...extraFiles];
let snippets = 0;
const skipped = new Map();
const guardFailures = [];
const actual = {};

for (const file of files) {
  const rel = file.startsWith(contentDir + path.sep)
    ? path.relative(contentDir, file)
    : path.relative(repoRoot, file);
  const source = readFileSync(file, 'utf8');
  const name = rel.replace(/[/.]/g, '-').replace(/\.mdx?$/, '');
  let blocks;
  let fileSnippets = 0;
  try {
    blocks = extractFences(source, rel);
  } catch (error) {
    guardFailures.push(String(error instanceof Error ? error.message : error));
    continue;
  }

  blocks.forEach((block, index) => {
    if (!CHECKED_LANGS.has(block.lang)) {
      skipped.set(block.lang, (skipped.get(block.lang) ?? 0) + 1);
      return;
    }
    const body = block.body.join('\n');
    if (!body.trim()) return;
    snippets += 1;
    fileSnippets += 1;
    const ext = block.lang === 'ts' ? 'ts' : 'tsx';
    writeFileSync(path.join(outDir, `${name}-${index}.${ext}`), `${body}\n`);
  });
  actual[rel] = fileSnippets;
}

if (guardFailures.length > 0) {
  console.error(`\n✖ ${guardFailures.length} docs fence failure(s):`);
  for (const failure of guardFailures) console.error(`  ✖ ${failure}`);
  process.exit(1);
}

if (process.argv.includes('--update')) {
  writeFileSync(manifestPath, `${JSON.stringify(actual, null, 2)}\n`);
  console.log(`updated snippet manifest (${snippets} snippets across ${files.length} files)`);
  process.exit(0);
}

let expected;
try {
  expected = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (error) {
  console.error(
    `\n✖ cannot read snippet manifest ${manifestPath}: ${error.message}\n` +
      '  Run `npm run docs:snippets -- --update` to regenerate it.',
  );
  process.exit(1);
}

const drift = [];
for (const [rel, count] of Object.entries(expected)) {
  if (actual[rel] !== count) {
    drift.push(`${rel}: expected ${count}, found ${actual[rel] ?? 0} checked fence(s)`);
  }
}
for (const [rel, count] of Object.entries(actual)) {
  if (!(rel in expected) && count > 0) {
    drift.push(`${rel}: new file with ${count} checked fence(s) — run --update`);
  }
}
if (drift.length > 0) {
  console.error('\n✖ snippet coverage drift (a fence may have been retagged to skip checks):');
  for (const line of drift) console.error(`  ✖ ${line}`);
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

const skippedSummary = [...skipped.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([lang, count]) => `${lang || '(none)'} ${count}`)
  .join(', ');

console.log(
  `docs snippets ok (${snippets} snippet${snippets === 1 ? '' : 's'} typechecked; ${extraFiles.length} READMEs scanned` +
    (skippedSummary ? `; skipped non-TS fences: ${skippedSummary}` : '') +
    ')',
);
