import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../src/Icon/', import.meta.url);
const iconsPath = new URL('icons.tsx', root);
const typesPath = new URL('types.ts', root);

const source = await readFile(iconsPath, 'utf8');
const start = source.indexOf('export const ICONS: Record<IconName, ReactNode> = {');
if (start === -1) throw new Error('ICONS registry not found');
const end = source.indexOf('\n};', start);
if (end === -1) throw new Error('ICONS registry end not found');
const body = source.slice(start, end);
const names = [];
for (const match of body.matchAll(/^ {2}'?([a-z0-9-]+)'?:/gm)) {
  if (!names.includes(match[1])) names.push(match[1]);
}

const current = await readFile(typesPath, 'utf8');
const typeStart = current.indexOf('export type IconName =');
const typeEnd = current.indexOf(';', typeStart);
if (typeStart === -1 || typeEnd === -1) throw new Error('IconName type not found');
const header = current.slice(0, typeStart);
const footer = current.slice(typeEnd + 1).replace(/^\n+/, '');
const next = `${header}export type IconName =\n${names.map((name) => `  | '${name}'`).join('\n')};\n\n${footer}`;

if (process.argv.includes('--check')) {
  if (current !== next) {
    console.error(
      `types.ts is out of date. Run: npm run gen:icon-types --workspace=@enterprise-ui/components`,
    );
    process.exit(1);
  }
  console.log(`IconName is in sync (${names.length} icons).`);
} else {
  await writeFile(typesPath, next);
  console.log(`Wrote ${names.length} icon names to types.ts.`);
}
