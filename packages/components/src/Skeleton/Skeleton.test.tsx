import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

const css = readFileSync(join(import.meta.dirname, 'Skeleton.module.css'), 'utf8');

test('defaults to a decorative text shape', () => {
  const { container } = render(<Skeleton />);
  const skeleton = container.firstElementChild!;
  expect(skeleton).toHaveAttribute('data-variant', 'text');
  expect(skeleton).toHaveAttribute('aria-hidden', 'true');
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

test('module CSS pins shimmer, both variants and reduced motion', () => {
  expect(css).toContain('@keyframes shimmer');
  expect(css).toContain("data-variant='circle'");
  expect(css).toContain("data-variant='rect'");
  expect(css).toContain('prefers-reduced-motion: reduce');
  expect(css).toContain('animation: none');
  expect(css).toContain('var(--surface-muted)');
});
