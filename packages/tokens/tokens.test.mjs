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

// jsdom cannot compute `color-mix`, so the "blocked selection" contract is pinned at source level:
// a selected-but-disabled day must not keep the full primary fill (it reads as a live selection and
// its 45%-opacity white text sits at ~2.8:1), and it needs a fallback for engines without
// `color-mix` because dropping the declaration alone would restore exactly that fill.
{
  const calendarCss = readFileSync(`${componentsSrc}/Calendar/Calendar.module.css`, 'utf8');
  const rule = calendarCss.match(/\.day-disabled\.day-selected\s*\{([^}]*)\}/);
  if (!rule) throw new Error('Calendar css: .day-disabled.day-selected rule is missing');
  const [, body] = rule;
  if (!/background:\s*color-mix\([^)]*var\(--color-blue-600\)/.test(body)) {
    throw new Error('Calendar css: blocked selection must mute the primary fill with color-mix');
  }
  if (!/color:\s*var\(--text\)/.test(body)) {
    throw new Error('Calendar css: blocked selection must use the body text colour');
  }
  if (!/@supports not \(background: color-mix\(/.test(calendarCss)) {
    throw new Error('Calendar css: blocked selection needs a no-color-mix fallback');
  }
  const today = calendarCss.match(/\.day-disabled\.day-today\.day-selected::after\s*\{([^}]*)\}/);
  if (!today || !/var\(--today-ring\)/.test(today[1])) {
    throw new Error('Calendar css: today dot on a blocked selection must use --today-ring');
  }
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
