import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
import { Progress } from './Progress';

const css = readFileSync(join(import.meta.dirname, 'Progress.module.css'), 'utf8');

test('renders a labelled progressbar with a visible percentage', () => {
  render(<Progress value={40} label="Đang tải" showValue />);
  const bar = screen.getByRole('progressbar', { name: 'Đang tải' });
  expect(bar).toHaveAttribute('aria-valuemin', '0');
  expect(bar).toHaveAttribute('aria-valuemax', '100');
  expect(bar).toHaveAttribute('aria-valuenow', '40');
  expect(screen.getByText('40%')).toHaveAttribute('aria-hidden', 'true');
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '40%' });
});

test('clamps values below zero and above max', () => {
  const { rerender } = render(<Progress value={-20} />);
  let bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuenow', '0');
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '0%' });

  rerender(<Progress value={150} />);
  bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuenow', '100');
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '100%' });
});

test('a non-finite value becomes zero and a non-positive max falls back to 100', () => {
  const { rerender } = render(<Progress value={Number.NaN} />);
  let bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuenow', '0');

  rerender(<Progress value={50} max={0} />);
  bar = screen.getByRole('progressbar');
  expect(bar).toHaveAttribute('aria-valuemax', '100');
  expect(bar).toHaveAttribute('aria-valuenow', '50');
});

test.each([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NaN])(
  'a non-finite max %s falls back to 100',
  (max) => {
    render(<Progress value={50} max={max} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '50%' });
  },
);

test('max other than 100 keeps the raw value and the correct visual ratio', () => {
  render(<Progress value={50} max={200} label="Bước" showValue />);
  const bar = screen.getByRole('progressbar', { name: 'Bước' });
  expect(bar).toHaveAttribute('aria-valuemax', '200');
  expect(bar).toHaveAttribute('aria-valuenow', '50');
  expect(screen.getByText('25%')).toBeInTheDocument();
  expect(bar.querySelector('[class*="fill"]')).toHaveStyle({ width: '25%' });
});

test('an empty label renders no header or aria-labelledby', () => {
  const { container } = render(<Progress value={10} label={[]} />);
  const bar = screen.getByRole('progressbar');
  expect(bar).not.toHaveAttribute('aria-labelledby');
  expect(container.querySelector('[class*="header"]')).toBeNull();
});

test('aria-label passes through when there is no label, and size lands on the root', () => {
  const { rerender } = render(<Progress value={10} aria-label="Đồng bộ" />);
  expect(screen.getByRole('progressbar', { name: 'Đồng bộ' })).toHaveAttribute('data-size', 'sm');

  rerender(<Progress value={10} aria-label="Đồng bộ" size="md" />);
  expect(screen.getByRole('progressbar', { name: 'Đồng bộ' })).toHaveAttribute('data-size', 'md');
});

test('module CSS scopes track sizes to the progress root', () => {
  expect(css).toMatch(/\.root\[data-size='sm'\] \.track/);
  expect(css).toMatch(/\.root\[data-size='md'\] \.track/);
  expect(css).not.toMatch(/^\[data-size='(sm|md)'\] \.track \{/m);
});

test('the percentage stays trailing when there is no label', () => {
  expect(cssRule(css, '.value')).toMatch(/margin-left:\s*auto/);
});

test('module CSS pins both track heights and the themeable fill', () => {
  expect(cssRule(css, ".root[data-size='sm'] .track")).toMatch(/height:\s*4px/);
  expect(cssRule(css, ".root[data-size='md'] .track")).toMatch(/height:\s*8px/);
  expect(cssRule(css, '.fill')).toMatch(/background:\s*var\(--progress-fill\)/);
  expect(cssRule(css, '.fill')).toMatch(/border-radius:\s*var\(--radius\)/);
});
