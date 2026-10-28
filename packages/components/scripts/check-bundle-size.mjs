import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const distUrl = new URL('../dist/', import.meta.url);
const limit = 150 * 1024;

const entries = await readdir(distUrl, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && /\.(js|css)$/.test(entry.name))
  .map((entry) => entry.name)
  .sort();

if (files.length === 0) {
  console.error('No dist/*.js or dist/*.css files found. Run the build first.');
  process.exit(1);
}

const sizes = [];
for (const file of files) {
  const contents = await readFile(new URL(file, distUrl));
  sizes.push({ file, raw: contents.length, gzip: gzipSync(contents).length });
}

const totals = sizes.reduce(
  (total, size) => ({ raw: total.raw + size.raw, gzip: total.gzip + size.gzip }),
  { raw: 0, gzip: 0 },
);

for (const size of sizes) {
  console.log(
    `  ${size.file}: ${(size.raw / 1024).toFixed(2)} KiB raw / ${(size.gzip / 1024).toFixed(2)} KiB gzip`,
  );
}
console.log(
  `components bundle: ${(totals.raw / 1024).toFixed(2)} KiB raw / ${(totals.gzip / 1024).toFixed(2)} KiB gzip (limit ${limit / 1024} KiB, JS + CSS)`,
);

if (totals.gzip > limit) {
  console.error('Components bundle exceeds the 150 KiB gzip budget (JS + CSS).');
  process.exit(1);
}
