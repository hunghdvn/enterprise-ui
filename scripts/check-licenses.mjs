#!/usr/bin/env node
/** Keep the three npm LICENSE files in sync — each tarball ships its own. */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['LICENSE', 'packages/tokens/LICENSE', 'packages/components/LICENSE'];
const bodies = files.map((file) => readFileSync(path.join(root, file), 'utf8'));
const drifted = files.filter((_, index) => bodies[index] !== bodies[0]);

if (drifted.length > 0) {
  console.error(`LICENSE files differ: ${drifted.join(', ')}`);
  process.exit(1);
}

console.log(`licenses ok (${files.length} identical)`);
