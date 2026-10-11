import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { designTokens } from '../../tokens/src/index';

const css = readFileSync(new URL('../../tokens/src/tokens.css', import.meta.url), 'utf8');

function flattenTokenValues(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(flattenTokenValues);
  }
  return [];
}

describe('design tokens', () => {
  it('maps every typed token to a declared CSS custom property', () => {
    const declaredProperties = new Set(
      Array.from(css.matchAll(/(--eui-[\w-]+)\s*:/g), (match) => match[1]),
    );

    for (const value of flattenTokenValues(designTokens)) {
      const match = value.match(/^var\((--eui-[\w-]+)\)$/);
      expect(match, `Expected a CSS variable reference for ${value}`).not.toBeNull();
      expect(declaredProperties.has(match![1]), `Missing CSS declaration for ${value}`).toBe(true);
    }
  });

  it('defines semantic surface overrides in the dark theme', () => {
    const darkTheme = css.match(/\[data-eui-theme='dark'\]\s*\{([^}]*)\}/)?.[1] ?? '';

    for (const property of [
      '--eui-color-danger-surface',
      '--eui-color-success-surface',
      '--eui-color-warning-surface',
      '--eui-color-info-surface',
    ]) {
      expect(darkTheme, `Expected ${property} in the dark theme`).toMatch(
        new RegExp(`\\\\${property}\\\\s*:`),
      );
    }
  });

  it('disables component motion for reduced-motion preferences', () => {
    const reducedMotionBlocks = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)/g) ?? [];
    expect(reducedMotionBlocks).toHaveLength(0);
  });
});
