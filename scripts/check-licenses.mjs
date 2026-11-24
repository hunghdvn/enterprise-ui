#!/usr/bin/env node
/**
 * Keep the npm LICENSE files in sync — each tarball ships its own.
 *
 * The list is derived from the publishable workspaces, so a fourth package is
 * covered automatically; a missing or divergent LICENSE fails with a clear
 * message instead of an ENOENT stack or a silent pass.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['LICENSE'];
const packagesDir = path.join(root, 'packages');

for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const pkgPath = path.join(packagesDir, entry.name, 'package.json');
  if (!existsSync(pkgPath)) continue;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (pkg.private) continue;
  files.push(`packages/${entry.name}/LICENSE`);
}

const missing = files.filter((file) => !existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error(`missing LICENSE: ${missing.join(', ')}`);
  process.exit(1);
}

const bodies = files.map((file) => readFileSync(path.join(root, file), 'utf8'));
const drifted = files.filter((_, index) => bodies[index] !== bodies[0]);

if (drifted.length > 0) {
  console.error(`LICENSE files differ: ${drifted.join(', ')}`);
  process.exit(1);
}

console.log(`licenses ok (${files.length} identical)`);
