import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const root = new URL('../src/Icon/', import.meta.url);
const require = createRequire(import.meta.url);
const lucideDir = join(dirname(require.resolve('lucide-static/package.json')), 'icons');

/**
 * Names that are not Lucide icon names but deliberately reuse the geometry of
 * another Lucide icon. Keep this list small and explicit.
 */
const LUCIDE_ALIASES = {
  refresh: 'refresh-cw',
};

const camel = (attr) => attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const normalize = (value) => value.replace(/\s+/g, ' ').trim();

function canonical(markup) {
  return [...markup.matchAll(/<([a-z0-9]+)([^>]*?)\/>/g)]
    .map(([, tag, rawAttrs]) => {
      const attrs = [...rawAttrs.matchAll(/([a-z][a-z0-9-]*)="([^"]*)"/g)]
        .map(([, attr, value]) => `${camel(attr)}=${normalize(value)}`)
        .sort()
        .join(' ');
      return `<${tag}${attrs ? ` ${attrs}` : ''}>`;
    })
    .join('');
}

function svgGeometry(svg) {
  const start = svg.indexOf('<svg');
  return canonical(svg.slice(svg.indexOf('>', start) + 1, svg.lastIndexOf('</svg>')));
}

const source = await readFile(new URL('icons.tsx', root), 'utf8');
const start = source.indexOf('export const ICONS: Record<IconName, ReactNode> = {');
const end = source.indexOf('\n};', start);
if (start === -1 || end === -1) throw new Error('ICONS registry not found');

const icons = new Map();
const entries = `${source.slice(start, end)}\n};`;
for (const match of entries.matchAll(
  /^ {2}'?([a-z0-9-]+)'?: ([\s\S]*?)(?=^ {2}'?[a-z0-9-]+'?:|^\};)/gm,
)) {
  icons.set(match[1], canonical(match[2]));
}

const mismatches = [];
for (const [name, geometry] of icons) {
  const sourceName = LUCIDE_ALIASES[name] ?? name;
  let svg;
  try {
    svg = await readFile(join(lucideDir, `${sourceName}.svg`), 'utf8');
  } catch {
    mismatches.push(`${name}: missing from lucide-static 0.545.0`);
    continue;
  }
  if (svgGeometry(svg) !== geometry) {
    const note = sourceName === name ? '' : ` (expected from ${sourceName}.svg, Lucide 0.545.0)`;
    mismatches.push(`${name}: geometry differs from lucide-static 0.545.0${note}`);
  }
}

const staleAliases = Object.keys(LUCIDE_ALIASES).filter((name) => !icons.has(name));
const aliasCount = Object.keys(LUCIDE_ALIASES).length;

if (mismatches.length > 0 || staleAliases.length > 0) {
  if (mismatches.length > 0)
    console.error(`Icon provenance check failed:\n- ${mismatches.join('\n- ')}`);
  if (staleAliases.length > 0)
    console.error(`Alias list references missing icons: ${staleAliases.join(', ')}`);
  process.exit(1);
}

console.log(
  `Icon provenance ok: ${icons.size} icons verified against lucide-static 0.545.0 (${icons.size - aliasCount} direct, ${aliasCount} aliased).`,
);
