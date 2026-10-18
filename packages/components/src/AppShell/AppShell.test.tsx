import { fireEvent, render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';
import { Empty } from '../Empty';
import styles from './AppShell.module.css';

test('white sidebar navigates and shows orange badge', () => {
  const fn = vi.fn();
  render(
    <AppShell
      sidebar={[
        { key: 'orders', label: 'Đơn hàng', badge: 12 },
        { key: 'stock', label: 'Kho vận' },
      ]}
      activeKey="orders"
      onNavigate={fn}
      headerRight={<span>U</span>}
    >
      <div>Body</div>
    </AppShell>,
  );
  expect(screen.getByText('Đơn hàng')).toBeInTheDocument();
  expect(screen.getByText('12')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Kho vận'));
  expect(fn).toHaveBeenCalledWith('stock');
});

test('brand word carries its own class so the narrow query can hide it', () => {
  render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
    >
      <div>Body</div>
    </AppShell>,
  );
  // The logo square stays visible at <= 768px; only the word is hidden, which
  // the media query can only reach through a class of its own.
  expect(screen.getByText('Enterprise')).toHaveClass(styles.brandText);
  expect(screen.getByText('E')).not.toHaveClass(styles.brandText);
});

test('renders sidebarEmptyState in the nav when the sidebar is empty', () => {
  render(
    <AppShell
      sidebar={[]}
      activeKey="overview"
      onNavigate={() => {}}
      sidebarEmptyState="Không tìm thấy"
    >
      <div>Body</div>
    </AppShell>,
  );
  const empty = screen.getByText('Không tìm thấy');
  expect(empty).toBeInTheDocument();
  expect(empty).toHaveClass(styles.navEmpty);
  expect(empty.closest('nav')).not.toBeNull();
});

test('does not render sidebarEmptyState while the sidebar has items', () => {
  render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
      sidebarEmptyState="Không tìm thấy"
    >
      <div>Body</div>
    </AppShell>,
  );
  expect(screen.queryByText('Không tìm thấy')).not.toBeInTheDocument();
  expect(screen.getByText('Đơn hàng')).toBeInTheDocument();
});

test('block-level sidebarEmptyState does not trip validateDOMNesting', () => {
  // sidebarEmptyState renders inside a <div> (not a <p>), so block content
  // like <Empty/> nests legally.
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <AppShell
      sidebar={[]}
      activeKey="overview"
      onNavigate={() => {}}
      sidebarEmptyState={<Empty description="Không có mục nào" />}
    >
      <div>Body</div>
    </AppShell>,
  );
  expect(screen.getByText('Không có mục nào')).toBeInTheDocument();
  const nestingWarning = errorSpy.mock.calls.some((args) =>
    args.some((arg) => String(arg).includes('validateDOMNesting')),
  );
  expect(nestingWarning).toBe(false);
  errorSpy.mockRestore();
});

test('toggle button collapses and expands sidebar (uncontrolled)', () => {
  render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
    >
      <div>Body</div>
    </AppShell>,
  );
  const toggle = screen.getByRole('button', { name: /Thu gọn thanh điều hướng/i });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(toggle);
  expect(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  fireEvent.click(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i }));
  expect(screen.getByRole('button', { name: /Thu gọn thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('controlled sidebarCollapsed prop reflects and calls onSidebarToggle', () => {
  const onToggle = vi.fn();
  const { rerender } = render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
      sidebarCollapsed={false}
      onSidebarToggle={onToggle}
    >
      <div>Body</div>
    </AppShell>,
  );
  const toggle = screen.getByRole('button', { name: /Thu gọn thanh điều hướng/i });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(toggle);
  expect(onToggle).toHaveBeenCalledWith(true);
  // controlled: internal state doesn't change without prop update
  expect(screen.getByRole('button', { name: /Thu gọn thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'true',
  );

  rerender(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
      sidebarCollapsed={true}
      onSidebarToggle={onToggle}
    >
      <div>Body</div>
    </AppShell>,
  );
  expect(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});
