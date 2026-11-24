#!/usr/bin/env node
/**
 * Keep the npm LICENSE files in sync — each tarball ships its own.
 *
 * The package list is derived from the root `workspaces` entries, supporting
 * both `dir/*` globs and literal paths. A missing, unreadable, or divergent
 * LICENSE fails with a clear message; a repo with no publishable packages is
 * an error, not a vacuous pass.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`invalid JSON in ${file}: ${error.message}`);
    process.exit(1);
  }
}

const rootPkg = readJson(path.join(root, 'package.json'));
const patterns = rootPkg.workspaces ?? [];
const files = ['LICENSE'];
const seen = new Set();

function consider(dir) {
  const pkgPath = path.join(dir, 'package.json');
  if (!existsSync(pkgPath)) return;
  const pkg = readJson(pkgPath);
  if (pkg.private) return;
  const rel = path.relative(root, path.join(dir, 'LICENSE')).split(path.sep).join('/');
  if (seen.has(rel)) return;
  seen.add(rel);
  files.push(rel);
}

for (const pattern of patterns) {
  if (pattern.endsWith('/*')) {
    const base = path.join(root, pattern.slice(0, -2));
    if (!existsSync(base)) continue;
    for (const entry of readdirSync(base, { withFileTypes: true })) {
      if (entry.isDirectory()) consider(path.join(base, entry.name));
    }
  } else {
    consider(path.join(root, pattern));
  }
}

if (files.length === 1) {
  console.error('no publishable packages found (all workspaces are private?)');
  process.exit(1);
}

const missing = files.filter((file) => !existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error(`missing LICENSE: ${missing.join(', ')}`);
  process.exit(1);
}

const bodies = [];
for (const file of files) {
  try {
    bodies.push(readFileSync(path.join(root, file), 'utf8'));
  } catch (error) {
    console.error(`cannot read LICENSE ${file}: ${error.message}`);
    process.exit(1);
  }
}
const drifted = files.filter((_, index) => bodies[index] !== bodies[0]);

if (drifted.length > 0) {
  console.error(`LICENSE files differ: ${drifted.join(', ')}`);
  process.exit(1);
}

console.log(`licenses ok (${files.length} identical)`);
