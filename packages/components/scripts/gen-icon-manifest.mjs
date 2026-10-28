import { readFile, writeFile } from 'node:fs/promises';
import { renderToStaticMarkup } from 'react-dom/server';
import { ICONS } from '../src/Icon/icons';

// Keep this in sync with the same helper in Icon.test.tsx.
const geometryHash = (markup) => {
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < markup.length; index += 1) {
    hash ^= BigInt(markup.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
};

const names = Object.keys(ICONS).sort();
const icons = Object.fromEntries(
  names.map((name) => {
    const markup = renderToStaticMarkup(ICONS[name]).replace(/\s+/g, ' ').trim();
    return [name, geometryHash(markup)];
  }),
);

const manifest = {
  count: names.length,
  algorithm: 'fnv1a-64',
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
