import { render, screen } from '@testing-library/react';
import { AuthLayout } from './AuthLayout';

test('renders the card slots and a main landmark', () => {
  render(
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
  expect(screen.getByRole('main').parentElement).toHaveClass('custom');
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
