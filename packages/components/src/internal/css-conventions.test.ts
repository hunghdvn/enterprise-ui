/// <reference types="node" />
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const src = join(import.meta.dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.module.css') || entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/**
 * AGENTS.md: "*.module.css plus var(--…) tokens — never hardcode hex in components". This lives in
 * the components package (not the tokens suite) because it is a convention of this package's own
 * source; the tokens suite must not fail when component sources are absent.
 */
test('component CSS never hardcodes a hex colour', () => {
  const offenders: string[] = [];
  for (const file of walk(src)) {
    if (!file.endsWith('.module.css')) continue;
    for (const hex of readFileSync(file, 'utf8').match(/#[0-9a-fA-F]{3,8}\b/g) ?? []) {
      offenders.push(`${file}: ${hex}`);
    }
  }
  expect(offenders).toEqual([]);
});

test('every component that renders data-size styles both variants', () => {
  const sized: string[] = [];
  for (const file of walk(src)) {
    if (!file.endsWith('.tsx')) continue;
    if (readFileSync(file, 'utf8').includes('data-size={size}')) {
      sized.push(file.replace(/\.tsx$/, '.module.css'));
    }
  }
  expect(sized.length).toBeGreaterThan(0);
  for (const file of sized) {
    const cssText = readFileSync(file, 'utf8');
    for (const size of ['sm', 'md']) {
      expect(cssText).toContain(`[data-size='${size}']`);
    }
  }
});
