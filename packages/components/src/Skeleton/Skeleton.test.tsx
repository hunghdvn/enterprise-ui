import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { cssBlock, cssRule } from '../internal/cssRule';
import { Skeleton } from './Skeleton';
import type { SkeletonProps } from './types';

const css = readFileSync(join(import.meta.dirname, 'Skeleton.module.css'), 'utf8');

test('defaults to a decorative text shape', () => {
  const { container } = render(<Skeleton />);
  const skeleton = container.firstElementChild!;
  expect(skeleton).toHaveAttribute('data-variant', 'text');
  expect(skeleton).toHaveAttribute('aria-hidden', 'true');
});

test('a caller cannot opt a skeleton into the accessibility tree', () => {
  // @ts-expect-error aria-hidden is omitted from SkeletonProps on purpose.
  const injected: SkeletonProps = { 'aria-hidden': false };
  const { container } = render(<Skeleton {...injected} />);
  expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
});

test('circle and rect variants accept numeric and string dimensions', () => {
  const { container, rerender } = render(<Skeleton variant="circle" width={40} height="2rem" />);
  const circle = container.firstElementChild as HTMLElement;
  expect(circle).toHaveAttribute('data-variant', 'circle');
  expect(circle.style.width).toBe('40px');
  expect(circle.style.height).toBe('2rem');

  rerender(<Skeleton variant="rect" width="60%" height={24} />);
  const rect = container.firstElementChild as HTMLElement;
  expect(rect).toHaveAttribute('data-variant', 'rect');
  expect(rect.style.width).toBe('60%');
  expect(rect.style.height).toBe('24px');
});

test('a caller style wins over the width and height props', () => {
  const { container } = render(<Skeleton width={20} height={20} style={{ width: 60 }} />);
  const skeleton = container.firstElementChild as HTMLElement;
  expect(skeleton.style.width).toBe('60px');
  expect(skeleton.style.height).toBe('20px');
});

test('module CSS pins shimmer, variant geometry and reduced motion', () => {
  const reduce = cssBlock(css, '@media (prefers-reduced-motion: reduce)');
  const base = cssRule(css.replace(reduce, ''), '.skeleton');
  expect(css).toContain('@keyframes shimmer');
  expect(base).toMatch(/var\(--skeleton-base\)/);
  expect(base).toMatch(/var\(--skeleton-shine\)/);
  expect(cssRule(css, ".skeleton[data-variant='text']")).toMatch(/height:\s*1em/);
  expect(cssRule(css, ".skeleton[data-variant='circle']")).toMatch(/width:\s*32px/);
  expect(cssRule(css, ".skeleton[data-variant='rect']")).toMatch(/height:\s*80px/);
  expect(cssRule(reduce, '.skeleton')).toMatch(/animation:\s*none/);
  expect(cssRule(reduce, '.skeleton')).toMatch(/background:\s*var\(--skeleton-base\)/);
});
