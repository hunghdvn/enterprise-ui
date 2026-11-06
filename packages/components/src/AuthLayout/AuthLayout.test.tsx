import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { AuthLayout } from './AuthLayout';

const css = readFileSync(join(import.meta.dirname, 'AuthLayout.module.css'), 'utf8');

test('renders the card slots and a main landmark', () => {
  const { container } = render(
    <AuthLayout
      brand={<span>Enterprise</span>}
      title="Đăng nhập"
      subtitle="Chào mừng trở lại"
      footer={<a href="/help">Cần trợ giúp?</a>}
      className="custom"
    >
      <form aria-label="Đăng nhập" />
    </AuthLayout>,
  );

  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Đăng nhập' })).toBeInTheDocument();
  expect(screen.getByText('Chào mừng trở lại')).toBeInTheDocument();
  expect(screen.getByText('Enterprise')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Cần trợ giúp?' })).toBeInTheDocument();
  expect(screen.getByRole('form', { name: 'Đăng nhập' })).toBeInTheDocument();
  expect(container.firstElementChild).toHaveClass('custom');
});

test('renders the title at the requested heading level', () => {
  render(
    <AuthLayout title="Quên mật khẩu" level={2}>
      <p>Nội dung</p>
    </AuthLayout>,
  );
  expect(screen.getByRole('heading', { level: 2, name: 'Quên mật khẩu' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
});

test('as="div" drops the main landmark for embedding and keeps the content', () => {
  render(
    <AuthLayout as="div" title="Đăng nhập">
      <p>Form</p>
    </AuthLayout>,
  );
  expect(screen.queryByRole('main')).toBeNull();
  expect(screen.getByRole('heading', { level: 1, name: 'Đăng nhập' })).toBeInTheDocument();
});

test('fill defaults to true and fill={false} opts out of the viewport height', () => {
  const { container, rerender } = render(
    <AuthLayout title="Đăng nhập">
      <p>Form</p>
    </AuthLayout>,
  );
  expect(container.firstElementChild).toHaveAttribute('data-fill', 'true');

  rerender(
    <AuthLayout title="Đăng nhập" fill={false}>
      <p>Form</p>
    </AuthLayout>,
  );
  expect(container.firstElementChild).toHaveAttribute('data-fill', 'false');
  expect(css).toContain(".root[data-fill='true']");
});

test('renders the aside as a complementary landmark only when provided', () => {
  const { container, rerender } = render(
    <AuthLayout title="Đăng nhập">
      <p>Form</p>
    </AuthLayout>,
  );
  expect(container.firstElementChild).toHaveAttribute('data-layout', 'single');
  expect(screen.queryByRole('complementary')).toBeNull();

  rerender(
    <AuthLayout
      title="Đăng nhập"
      aside={<p>Quản trị đơn hàng trong một màn hình.</p>}
      asideLabel="Vì sao chọn Enterprise"
    >
      <p>Form</p>
    </AuthLayout>,
  );
  expect(container.firstElementChild).toHaveAttribute('data-layout', 'split');
  const aside = screen.getByRole('complementary', { name: 'Vì sao chọn Enterprise' });
  expect(aside).toHaveTextContent('Quản trị đơn hàng trong một màn hình.');
});

test('an aside without a label still renders one complementary landmark', () => {
  render(
    <AuthLayout title="Đăng nhập" aside={<p>Marketing</p>}>
      <p>Form</p>
    </AuthLayout>,
  );
  expect(screen.getAllByRole('complementary')).toHaveLength(1);
});

test('empty slots render nothing, not a stray zero or empty wrapper', () => {
  const { container } = render(
    <AuthLayout title="Đăng nhập" brand={0} subtitle="" footer={false}>
      <p>Form</p>
    </AuthLayout>,
  );
  expect(container.textContent).toBe('Đăng nhậpForm');
  expect(container.querySelector('[class*="brand"]')).toBeNull();
  expect(container.querySelector('[class*="footer"]')).toBeNull();
});

test('the aside re-scopes tokens so links and focus rings stay visible on blue-600', () => {
  const aside = /\.aside\s*\{([^}]*)\}/s.exec(css)?.[1] ?? '';
  expect(aside).toContain('--text: var(--on-primary)');
  expect(aside).toContain('--text-muted: var(--color-blue-100)');
  expect(aside).toContain('--action-text: var(--on-primary)');
  expect(aside).toContain('--focus-ring: var(--on-primary)');
});

test('the split layout follows the container width, not the viewport', () => {
  expect(css).toContain('container-type: inline-size');
  expect(css).toContain('@container (min-width: 769px)');
  expect(css).not.toContain('@media (min-width: 769px)');
});

test('the narrow card padding also follows the container width', () => {
  expect(css).toContain('@container (max-width: 480px)');
  expect(css).not.toContain('@media');
});
