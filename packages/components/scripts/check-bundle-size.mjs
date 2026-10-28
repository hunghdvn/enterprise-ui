import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const bundleUrl = new URL('../dist/index.js', import.meta.url);
const bundle = await readFile(bundleUrl);
const gzipped = gzipSync(bundle, { level: 9 });
const limit = 150 * 1024;

console.log(
  `components bundle: ${(bundle.length / 1024).toFixed(2)} kB (gzip ${(gzipped.length / 1024).toFixed(2)} kB, limit ${limit / 1024} kB)`,
);

if (gzipped.length > limit) {
  console.error(`Bundle exceeds the 150 kB gzip budget.`);
  process.exit(1);
}
