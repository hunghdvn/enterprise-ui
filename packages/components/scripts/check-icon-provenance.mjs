import { readFile } from 'node:fs/promises';

const root = new URL('../src/Icon/', import.meta.url);
const lucideDir = new URL('../../../node_modules/lucide-static/icons/', import.meta.url);

const customIcons = new Set([
  // Original Feather-derived glyphs kept for backward compatibility.
  'check',
  'x',
  'chevron-down',
  'chevron-up',
  'chevron-left',
  'chevron-right',
  'arrow-left',
  'arrow-right',
  'plus',
  'search',
  'filter',
  'settings',
  'user',
  'bell',
  'mail',
  'home',
  'edit',
  'trash',
  'download',
  'upload',
  'copy',
  'check-circle',
  'refresh',
  'info',
  'alert-triangle',
  'help-circle',
  'calendar',
  'clock',
  'eye',
  'eye-off',
  'external-link',
  'inbox',
  'menu',
  // Current-name aliases that deliberately point at the canonical glyphs above.
  'house',
  'triangle-alert',
  'circle-question-mark',
  'funnel',
  'circle-help',
]);

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
  if (customIcons.has(name)) continue;
  let svg;
  try {
    svg = await readFile(new URL(`${name}.svg`, lucideDir), 'utf8');
  } catch {
    mismatches.push(`${name}: missing from lucide-static 0.545.0`);
    continue;
  }
  if (svgGeometry(svg) !== geometry)
    mismatches.push(`${name}: geometry differs from lucide-static 0.545.0`);
}

const staleCustom = [...customIcons].filter((name) => !icons.has(name));
if (mismatches.length > 0 || staleCustom.length > 0) {
  if (mismatches.length > 0)
    console.error(`Icon provenance check failed:\n- ${mismatches.join('\n- ')}`);
  if (staleCustom.length > 0)
    console.error(`Custom icon list references missing icons: ${staleCustom.join(', ')}`);
  process.exit(1);
}

console.log(
  `Icon provenance ok: ${icons.size} icons (${customIcons.size} curated originals, ${icons.size - customIcons.size} Lucide 0.545.0 glyphs).`,
);
