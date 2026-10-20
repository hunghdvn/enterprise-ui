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
 * Exit codes: 0 = all snippets compile; 1 = at least one snippet failed, an
 * extraction guard tripped, or the harness itself failed.
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
 * The established docs pattern is exactly one such const per page, terminated
 * by `` `; ``. All three bounds are ENFORCED by the caller — a violation means
 * the checked text is not what a reader copies (or is not checked at all), so
 * it must fail loudly instead of silently shrinking coverage (round-1 #1 and
 * round-2 #1).
 */
function extractSnippet(source) {
  const marker = 'const code = `';
  const start = source.indexOf(marker);
  if (start === -1) return null; // legitimately no snippet on this page
  const bodyStart = start + marker.length;
  const end = source.indexOf('`;', bodyStart);
  if (end === -1) {
    return {
      error:
        "marker found but the snippet is not terminated by '`;' — extend the harness before changing the terminator (ASI/split lines count as a violation)",
    };
  }
  return {
    body: source.slice(bodyStart, end),
    // A second marker means a page grew a multi-snippet layout the harness
    // does not cover yet.
    markers: source.split(marker).length - 1,
  };
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const files = pageFiles(pagesDir);
let snippets = 0;
const guardFailures = [];

for (const file of files) {
  const rel = path.relative(pagesDir, file);
  const name = rel.replace(/[/.]/g, '-').replace(/\.tsx$/, '');
  const found = extractSnippet(readFileSync(file, 'utf8'));
  if (found === null) {
    console.log(`SKIP  ${rel} (no const code snippet)`);
    continue;
  }
  if (found.error) {
    guardFailures.push(`${rel}: ${found.error}`);
    continue;
  }
  // Soundness guards: silently checking a fragment (nested backtick) or
  // skipping a second snippet would keep CI green while the real snippet is
  // broken — report and fail instead (round-1 review #1).
  if (found.markers > 1) {
    guardFailures.push(
      `${rel}: ${found.markers} 'const code' snippets found — the harness checks one per page; extend it before adding a second.`,
    );
    continue;
  }
  if (found.body.includes('`')) {
    guardFailures.push(
      `${rel}: snippet contains a nested backtick — the extractor truncates at the first closing backtick; extend it before teaching template literals.`,
    );
    continue;
  }
  snippets += 1;
  // Re-escape nothing: the snippet body is written verbatim — it must
  // typecheck exactly as a reader would copy it.
  writeFileSync(path.join(outDir, `${name}.tsx`), found.body);
}

if (guardFailures.length > 0) {
  console.error(`\n✖ ${guardFailures.length} extraction guard failure(s):`);
  for (const f of guardFailures) console.error(`  ✖ ${f}`);
  process.exit(1);
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
