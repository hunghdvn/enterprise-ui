import { readFileSync } from 'node:fs';

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
  '--color-blue-700: #1e40af',
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

/**
 * Body of the first `{…}` after `selector`. Slicing from the selector to EOF would also match a
 * token declared outside the block, which is exactly the nesting regression this guards against.
 */
function themeBlockBody(source, selector) {
  const selectorAt = source.indexOf(selector);
  if (selectorAt === -1) return null;
  const open = source.indexOf('{', selectorAt);
  const close = open === -1 ? -1 : source.indexOf('}', open);
  return open === -1 || close === -1 ? null : source.slice(open + 1, close);
}

function assertThemeTokens(theme, source, selector, tokens) {
  const block = themeBlockBody(source, selector);
  if (block === null) throw new Error(`${theme} theme block not found`);
  for (const [name, value] of Object.entries(tokens)) {
    if (!new RegExp(`${name}:\\s*${value}\\b`).test(block)) {
      throw new Error(`${theme} theme must reset ${name} to ${value}`);
    }
  }
}

// Self-check the guard itself: a token declared after the block must not satisfy it, and a
// renamed selector must report "not found" instead of silently passing.
const nestedLeak = '[data-theme="x"] { --focus-ring: #111 }\n:root { --today-ring: #222 }';
let leaked = false;
try {
  assertThemeTokens('probe', nestedLeak, '[data-theme="x"]', { '--today-ring': '#222' });
} catch {
  leaked = true;
}
if (!leaked) throw new Error('theme guard accepts a token declared outside the block');
let missingReported = false;
try {
  assertThemeTokens('probe', nestedLeak, '[data-theme="y"]', { '--focus-ring': '#111' });
} catch (error) {
  missingReported = /block not found/.test(error.message);
}
if (!missingReported) throw new Error('theme guard does not report a missing theme block');

for (const [theme, source, selector, tokens] of themeRings) {
  assertThemeTokens(theme, source, selector, tokens);
}

// Component-source conventions (no hardcoded hex, both data-size variants styled) live in the
// components package: the tokens suite is pure CSS variables and must not read component sources.

console.log('tokens ok');
