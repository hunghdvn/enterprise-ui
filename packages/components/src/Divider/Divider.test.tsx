import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
import { Divider } from './Divider';

const css = readFileSync(join(import.meta.dirname, 'Divider.module.css'), 'utf8');

test('default horizontal renders a native hr separator', () => {
  render(<Divider />);
  const separator = screen.getByRole('separator');
  expect(separator.tagName).toBe('HR');
  expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  expect(separator).toHaveAttribute('data-spacing', 'md');
  expect(separator).not.toHaveAttribute('aria-orientation');
});

test('vertical renders a div separator with aria-orientation', () => {
  render(<Divider orientation="vertical" spacing="sm" />);
  const separator = screen.getByRole('separator');
  expect(separator.tagName).toBe('DIV');
  expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  expect(separator).toHaveAttribute('data-spacing', 'sm');
});

test('a label names the separator and the visible copy is hidden from AT', () => {
  render(<Divider label="Hoặc" align="start" />);
  const separator = screen.getByRole('separator', { name: 'Hoặc' });
  expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  expect(separator).toHaveAttribute('data-align', 'start');
  expect(separator).toHaveAttribute('data-labelled');
  const label = screen.getByText('Hoặc');
  expect(label.tagName).toBe('SPAN');
  expect(label).toHaveAttribute('aria-hidden', 'true');
});

test('an empty label renders a plain hr and a vertical label is ignored', () => {
  const { container, rerender } = render(<Divider label="" />);
  expect(container.querySelector('hr')).not.toBeNull();
  expect(screen.getByRole('separator')).not.toHaveAttribute('aria-label');

  rerender(<Divider orientation="vertical" label="Hoặc" />);
  expect(container.querySelector('hr')).toBeNull();
  expect(screen.queryByText('Hoặc')).toBeNull();
  expect(screen.getByRole('separator')).not.toHaveAttribute('aria-label');
});

test('align only lands on a labelled horizontal divider', () => {
  const { container } = render(<Divider align="end" />);
  expect(container.querySelector('hr')).not.toHaveAttribute('data-align');
});

test('className, id and rest props land on the root', () => {
  render(<Divider id="rule" className="extra" data-testid="rule" />);
  const separator = screen.getByTestId('rule');
  expect(separator).toHaveAttribute('id', 'rule');
  expect(separator).toHaveClass('extra');
});

test('children are rejected at the type level and never rendered', () => {
  render(
    // @ts-expect-error children are deliberately omitted from DividerProps.
    <Divider data-testid="rule">Thừa</Divider>,
  );
  expect(screen.queryByText('Thừa')).toBeNull();
});

test('module CSS pins separator, label, alignment and spacing rules', () => {
  expect(cssRule(css, ".root[data-orientation='horizontal']")).toMatch(
    /border-top:\s*1px solid var\(--border\)/,
  );
  expect(cssRule(css, ".root[data-orientation='vertical']")).toMatch(/width:\s*1px/);
  expect(cssRule(css, ".root[data-orientation='vertical']")).toMatch(/align-self:\s*stretch/);
  expect(cssRule(css, ".root[data-orientation='vertical']")).toMatch(
    /background:\s*var\(--border\)/,
  );
  expect(cssRule(css, '.root[data-labelled]')).toMatch(/display:\s*flex/);
  expect(cssRule(css, '.root[data-labelled]::before')).toContain('background');
  expect(cssRule(css, ".root[data-labelled][data-align='start']::before")).toMatch(
    /flex:\s*0 0 24px/,
  );
  expect(cssRule(css, '.label')).toMatch(/color:\s*var\(--text-muted\)/);
  expect(cssRule(css, ".root[data-orientation='horizontal'][data-spacing='sm']")).toMatch(
    /margin-block:\s*8px/,
  );
  expect(cssRule(css, ".root[data-orientation='horizontal'][data-spacing='md']")).toMatch(
    /margin-block:\s*16px/,
  );
  expect(cssRule(css, ".root[data-orientation='vertical'][data-spacing='sm']")).toMatch(
    /margin-inline:\s*8px/,
  );
  expect(cssRule(css, ".root[data-orientation='vertical'][data-spacing='md']")).toMatch(
    /margin-inline:\s*16px/,
  );
});
