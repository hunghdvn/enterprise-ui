import { readFile, writeFile } from 'node:fs/promises';
import { renderToStaticMarkup } from 'react-dom/server';
import { ICONS } from '../src/Icon/icons';
import { GEOMETRY_HASH_ALGORITHM, iconGeometryHash } from './geometry-hash.ts';

const names = Object.keys(ICONS).sort();
const icons = Object.fromEntries(
  names.map((name) => [name, iconGeometryHash(renderToStaticMarkup(ICONS[name]))]),
);

const manifest = {
  count: names.length,
  algorithm: GEOMETRY_HASH_ALGORITHM,
  icons,
};
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
const manifestUrl = new URL('../src/Icon/icons.manifest.json', import.meta.url);

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = await readFile(manifestUrl, 'utf8');
  } catch {
    // A missing manifest is reported as out of date below.
  }
  if (current !== serialized) {
    console.error(
      'icons.manifest.json is out of date. Run: npm run gen:icon-manifest --workspace=@enterprise-ui/components',
    );
    process.exit(1);
  }
  console.log(`Icon manifest is in sync (${names.length} icons).`);
} else {
  await writeFile(manifestUrl, serialized);
  console.log(`Wrote ${names.length} icon hashes to ${manifestUrl.pathname}`);
}
