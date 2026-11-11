import { useState } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { Switch } from './Switch';

const css = readFileSync(join(import.meta.dirname, 'Switch.module.css'), 'utf8');

test('exposes a switch role named by its label, backed by a checkbox', () => {
  render(<Switch defaultChecked>Thông báo email</Switch>);
  const input = screen.getByRole('switch', { name: 'Thông báo email' });
  expect(input).toHaveAttribute('type', 'checkbox');
  expect(input).toBeChecked();
});

test('controlled checked + onChange reflect the caller state', () => {
  function Wrapper() {
    const [on, setOn] = useState(false);
    return (
      <Switch checked={on} onChange={(event) => setOn(event.currentTarget.checked)}>
        Bật thông báo
      </Switch>
    );
  }
  render(<Wrapper />);
  const input = screen.getByRole('switch', { name: 'Bật thông báo' });
  fireEvent.click(input);
  expect(input).toBeChecked();
});

test('label click toggles the switch', () => {
  render(<Switch>Nhận tin</Switch>);
  fireEvent.click(screen.getByText('Nhận tin'));
  expect(screen.getByRole('switch', { name: 'Nhận tin' })).toBeChecked();
});

test('disabled is a native attribute and the CSS blocks the pointer', () => {
  const onChange = vi.fn();
  render(
    <Switch disabled onChange={onChange}>
      Tắt
    </Switch>,
  );
  // jsdom fires activation on disabled controls; the native attribute plus its
  // CSS is the contract testable here.
  expect(screen.getByRole('switch', { name: 'Tắt' })).toBeDisabled();
  expect(css).toContain('.input:disabled');
  expect(css).toContain('cursor: not-allowed');
  expect(css).toContain('.label:has(.input:disabled)');
});

test('size variants set data-size on the label', () => {
  const { container } = render(
    <>
      <Switch>Email</Switch>
      <Switch size="md">SMS</Switch>
    </>,
  );
  const labels = container.querySelectorAll('label');
  expect(labels[0]).toHaveAttribute('data-size', 'sm');
  expect(labels[1]).toHaveAttribute('data-size', 'md');
});

test('module CSS uses tokens and pins the checked/thumb geometry', () => {
  expect(css).toContain('var(--switch-track-on)');
  expect(css).toContain('var(--on-primary)');
  expect(css).toContain('.input:checked {');
  expect(css).toContain('.input:checked + .thumb');
  // The thumb keeps its own 1px muted boundary so the knob reads on the light
  // off-track; this reads the thumb block, not any border in the file.
  expect(css).toMatch(/\.thumb\s*\{[^}]*border:\s*1px solid var\(--text-muted\)/);
  expect(css).not.toMatch(/#[0-9a-f]{3,8}/i);
});
