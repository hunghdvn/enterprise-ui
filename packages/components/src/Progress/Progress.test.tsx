import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
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

test('module CSS pins both track sizes and the themeable fill', () => {
  expect(css).toContain("[data-size='sm']");
  expect(css).toContain("[data-size='md']");
  expect(css).toContain('var(--progress-fill)');
  expect(css).toContain('var(--radius)');
});
