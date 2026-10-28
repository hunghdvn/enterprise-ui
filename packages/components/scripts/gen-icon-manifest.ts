import { writeFile } from 'node:fs/promises';
import { renderToStaticMarkup } from 'react-dom/server';
import { ICONS } from '../src/Icon/icons';
import type { IconName } from '../src/Icon/types';

// Keep this in sync with the same helper in Icon.test.tsx.
const geometryHash = (markup: string) => {
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < markup.length; index += 1) {
    hash ^= BigInt(markup.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
};

const names = Object.keys(ICONS).sort() as IconName[];
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

const manifestUrl = new URL('../src/Icon/icons.manifest.json', import.meta.url);
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${names.length} icon hashes to ${manifestUrl.pathname}`);
