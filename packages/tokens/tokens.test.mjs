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
  '--danger-emphasis: #dc2626',
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
 * Comments are stripped first so a commented-out declaration cannot satisfy the guard and a
 * brace inside a comment cannot close the block early.
 */
function themeBlockBody(rawSource, selector) {
  const source = rawSource.replace(/\/\*[\s\S]*?\*\//g, '');
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
    // Values include var(--token); its parentheses are regex syntax and must match literally.
    const literal = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`${name}:\\s*${literal}(?![\\w-])`).test(block)) {
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
// var() values must be matched literally instead of throwing on their parentheses.
try {
  assertThemeTokens('probe', ':root { --probe: var(--token) }', ':root', {
    '--probe': 'var(--token)',
  });
} catch {
  throw new Error('theme guard does not match var() values');
}
// A commented-out declaration must not satisfy the guard (the exact dark-theme regression).
let commentedPassed = false;
try {
  assertThemeTokens('probe', ':root { /* --probe: #111 */ }', ':root', { '--probe': '#111' });
  commentedPassed = true;
} catch {}
if (commentedPassed) throw new Error('theme guard accepts a commented-out declaration');
// A multi-line comment must be stripped exactly like a single-line one; a `.`-based strip would
// pass the probe above but let any commented declaration spanning lines satisfy the guard.
let multilinePassed = false;
try {
  assertThemeTokens('probe', ':root {\n  /* --probe: #111\n     --other: #222 */\n}', ':root', {
    '--probe': '#111',
  });
  multilinePassed = true;
} catch {}
if (multilinePassed) throw new Error('theme guard accepts a multi-line commented declaration');
// Two comments: a strip without the global flag removes only the first and leaves the second
// (which holds the declaration) to satisfy the guard.
let twoCommentsPassed = false;
try {
  assertThemeTokens('probe', ':root {\n  /* first */\n  /* --probe: #111 */\n}', ':root', {
    '--probe': '#111',
  });
  twoCommentsPassed = true;
} catch {}
if (twoCommentsPassed) throw new Error('theme guard strips only the first comment');
// Comments may contain a closing brace; stripping them before slicing keeps the block intact.
try {
  assertThemeTokens('probe', ':root { /* } */ --probe: #111 }', ':root', { '--probe': '#111' });
} catch {
  throw new Error('theme guard lets a brace inside a comment close the block');
}
// A value must end at a boundary: #111 must not match #1111.
let boundaryPassed = false;
try {
  assertThemeTokens('probe', ':root { --probe: #1111 }', ':root', { '--probe': '#111' });
  boundaryPassed = true;
} catch {}
if (boundaryPassed) throw new Error('theme guard ignores the value boundary');

for (const [theme, source, selector, tokens] of themeRings) {
  assertThemeTokens(theme, source, selector, tokens);
}

// The blocked-selection pair has a :root base (custom themes inherit it) and a per-theme
// override. Both are checked inside their own block, so a declaration moved into a comment,
// another selector or an @media block cannot satisfy the guard.
const blockedPair = {
  '--blocked-selection-bg': 'var(--color-blue-300)',
  '--blocked-selection-text': 'var(--color-blue-800)',
};
assertThemeTokens('root', readTokenFile('tokens.css'), ':root', blockedPair);
assertThemeTokens('light', lightCss, '[data-theme="light"]', blockedPair);
// Dark: the muted surface (not the bright blue-300 fill) carries the blocked state, and body
// text keeps the day number and event chips above AA on it.
assertThemeTokens('dark', darkCss, '[data-theme="dark"]', {
  '--blocked-selection-bg': 'var(--surface-muted)',
  '--blocked-selection-text': 'var(--text)',
  '--danger-emphasis': '#f87171',
});
// Like the rings, the danger cue must be reset inside a light subtree of a dark page.
assertThemeTokens('light', lightCss, '[data-theme="light"]', {
  '--danger-emphasis': '#dc2626',
});

// Component-source conventions (no hardcoded hex, both data-size variants styled) live in the
// components package: the tokens suite is pure CSS variables and must not read component sources.

console.log('tokens ok');
