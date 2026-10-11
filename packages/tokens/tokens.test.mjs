import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')
  + readFileSync(new URL('./theme-light.css', import.meta.url), 'utf8')
  + readFileSync(new URL('./theme-dark.css', import.meta.url), 'utf8')
  + readFileSync(new URL('./density.css', import.meta.url), 'utf8');
const must = ['--color-blue-600: #1E47C4', '--color-orange-500: #F97316', '--bg: ', '--row-height', '[data-theme="dark"]', '[data-density="compact"]'];
for (const m of must) { if (!css.includes(m)) throw new Error('missing token ' + m); }
console.log('tokens ok');
