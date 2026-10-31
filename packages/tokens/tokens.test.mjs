import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const readTokenFile = (name) =>
  readFileSync(new URL(`./${name}`, import.meta.url), 'utf8')
    .toLowerCase()
    .replaceAll("'", '"');
const lightCss = readTokenFile('theme-light.css');
const darkCss = readTokenFile('theme-dark.css');
const css = readTokenFile('tokens.css') + lightCss + darkCss + readTokenFile('density.css');
const must = [
  '--color-blue-600: #1e47c4',
  '--color-orange-500: #f97316',
  '--color-blue-200:',
  '--color-blue-300:',
  '--on-primary:',
  '--on-accent:',
  '--input-h-lg:',
  '--control-size-sm:',
  '--control-size:',
  '--font-size-md:',
  '--bg: ',
  '--row-height',
  '--row-hover-bg',
  '--row-selected-bg',
  '--row-selected-marker: #1e47c4',
  '--row-selected-marker: #60a5fa',
  '--action-text',
  '--nav-active-bg',
  '--scrim',
  '--focus-ring: var(--color-blue-600)',
  '--today-ring: var(--color-blue-700)',
  '[data-theme="dark"]',
  '[data-density="compact"]',
];
for (const m of must) {
  if (!css.includes(m)) throw new Error('missing token ' + m);
}

// A theme block must redeclare the ring tokens: a light subtree nested inside a dark page
// inherits the dark values otherwise, and the dark blue-300 ring falls to ~1.8:1 on white.
const themeRings = [
  [
    'light',
    lightCss,
    '[data-theme="light"]',
    { '--focus-ring': '#1e47c4', '--today-ring': '#1e40af' },
  ],
  [
    'dark',
    darkCss,
    '[data-theme="dark"]',
    { '--focus-ring': '#93c5fd', '--today-ring': '#93c5fd' },
  ],
];
for (const [theme, source, selector, tokens] of themeRings) {
  const block = source.slice(source.indexOf(selector));
  for (const [name, value] of Object.entries(tokens)) {
    if (!new RegExp(`${name}:\\s*${value}\\b`).test(block)) {
      throw new Error(`${theme} theme must reset ${name} to ${value}`);
    }
  }
}

// AGENTS.md: "*.module.css plus var(--…) tokens — never hardcode hex in components".
const componentsSrc = fileURLToPath(new URL('../components/src', import.meta.url));
function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.module.css') || entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const offenders = [];
for (const file of walk(componentsSrc)) {
  if (!file.endsWith('.module.css')) continue;
  const hexes = readFileSync(file, 'utf8').match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
  for (const hex of hexes) offenders.push(`${file}: ${hex}`);
}
if (offenders.length > 0) {
  throw new Error('hardcoded colors in component css:\n' + offenders.join('\n'));
}

// Every component rendering data-size must style both variants.
const sized = [];
for (const file of walk(componentsSrc)) {
  if (!file.endsWith('.tsx')) continue;
  if (readFileSync(file, 'utf8').includes('data-size={size}'))
    sized.push(file.replace(/\.tsx$/, '.module.css'));
}
if (sized.length === 0) throw new Error('no size-aware components found');
for (const file of sized) {
  const cssText = readFileSync(file, 'utf8');
  for (const size of ['sm', 'md']) {
    if (!cssText.includes(`[data-size='${size}']`)) {
      throw new Error(`${file} does not style size="${size}"`);
    }
  }
}

console.log('tokens ok');
