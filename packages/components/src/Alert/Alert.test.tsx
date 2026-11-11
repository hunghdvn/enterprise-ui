import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { Alert } from './Alert';

const css = readFileSync(join(import.meta.dirname, 'Alert.module.css'), 'utf8');

test.each([
  ['info', 'status'],
  ['success', 'status'],
  ['warning', 'alert'],
  ['danger', 'alert'],
] as const)('%s renders with role %s', (tone, role) => {
  render(
    <Alert tone={tone} title={tone}>
      Nội dung
    </Alert>,
  );
  expect(screen.getByRole(role)).toHaveAttribute('data-tone', tone);
});

test('title and children compose, and the icon is decorative', () => {
  const { container } = render(<Alert title="Không lưu được">Kiểm tra kết nối rồi thử lại.</Alert>);
  expect(screen.getByText('Không lưu được')).toBeInTheDocument();
  expect(screen.getByText('Kiểm tra kết nối rồi thử lại.')).toBeInTheDocument();
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

test('the dismiss button is opt-in, labelled and calls back once', () => {
  const onDismiss = vi.fn();
  const { rerender } = render(<Alert>Nội dung</Alert>);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();

  rerender(
    <Alert onDismiss={onDismiss} dismissLabel="Đóng cảnh báo">
      Nội dung
    </Alert>,
  );
  const button = screen.getByRole('button', { name: 'Đóng cảnh báo' });
  expect(button).toHaveAttribute('type', 'button');
  fireEvent.click(button);
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test('the default dismiss label is Vietnamese and a caller role wins', () => {
  render(
    <Alert tone="danger" role="region" aria-label="Vùng cảnh báo" onDismiss={() => {}}>
      Nội dung
    </Alert>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Vùng cảnh báo' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Đóng thông báo' })).toBeInTheDocument();
});

test('module CSS pins the tone tokens, left edge and focus ring', () => {
  expect(css).toContain("data-tone='info'");
  expect(css).toContain('var(--color-blue-500)');
  expect(css).toContain('var(--danger-emphasis)');
  expect(css).toContain('border-left-width: 3px');
  expect(css).toContain('.close:focus-visible');
  expect(css).toContain('var(--focus-ring)');
});
