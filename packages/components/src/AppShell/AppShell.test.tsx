import { fireEvent, render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';
import { Empty } from '../Empty';
import styles from './AppShell.module.css';

// The uncontrolled shell reads/writes the shared `eui-sidebar-collapsed` key;
// isolate every test from state left by its neighbors.
beforeEach(() => {
  localStorage.clear();
});

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

test('toggle button collapses and expands sidebar and writes localStorage (uncontrolled)', () => {
  localStorage.clear();
  const { container } = render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
    >
      <div>Body</div>
    </AppShell>,
  );
  const shell = () => container.querySelector('[data-collapsed]');
  expect(shell()).toHaveAttribute('data-collapsed', 'false');
  const toggle = screen.getByRole('button', { name: /Thu gọn thanh điều hướng/i });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(toggle);
  expect(shell()).toHaveAttribute('data-collapsed', 'true');
  expect(localStorage.getItem('eui-sidebar-collapsed')).toBe('1');
  expect(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  fireEvent.click(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i }));
  expect(shell()).toHaveAttribute('data-collapsed', 'false');
  expect(localStorage.getItem('eui-sidebar-collapsed')).toBe('0');
  expect(screen.getByRole('button', { name: /Thu gọn thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('uncontrolled sidebar reads persisted localStorage value on mount', () => {
  localStorage.setItem('eui-sidebar-collapsed', '1');
  const { container } = render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
    >
      <div>Body</div>
    </AppShell>,
  );
  expect(container.querySelector('[data-collapsed]')).toHaveAttribute('data-collapsed', 'true');
  expect(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  localStorage.clear();
});

test('defaultSidebarCollapsed wins over localStorage for the initial state', () => {
  localStorage.setItem('eui-sidebar-collapsed', '1');
  const { container } = render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
      defaultSidebarCollapsed={false}
    >
      <div>Body</div>
    </AppShell>,
  );
  expect(container.querySelector('[data-collapsed]')).toHaveAttribute('data-collapsed', 'false');
  localStorage.clear();
});

test('controlled sidebarCollapsed prop reflects and calls onSidebarToggle without persisting', () => {
  localStorage.clear();
  const onToggle = vi.fn();
  const { container, rerender } = render(
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
  // controlled: internal state doesn't change without prop update, and the
  // shared localStorage key is left untouched.
  const shell = container.querySelector('[data-collapsed]');
  expect(shell).toHaveAttribute('data-collapsed', 'false');
  expect(localStorage.getItem('eui-sidebar-collapsed')).toBeNull();
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
  expect(shell).toHaveAttribute('data-collapsed', 'true');
  expect(screen.getByRole('button', { name: /Mở rộng thanh điều hướng/i })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('renders ReactNode icons for nav items', () => {
  render(
    <AppShell
      sidebar={[
        {
          key: 'orders',
          label: 'Đơn hàng',
          icon: <span data-testid="nav-icon">Orders icon</span>,
        },
      ]}
      activeKey="orders"
      onNavigate={() => {}}
    >
      <div>Body</div>
    </AppShell>,
  );

  expect(screen.getByTestId('nav-icon')).toBeInTheDocument();
  expect(screen.getByText('Đơn hàng')).toBeInTheDocument();
});

test.each([0, false, ''] as const)(
  'uses the default registry icon for an absent ReactNode value (%j)',
  (icon) => {
    render(
      <AppShell
        sidebar={[{ key: 'orders', label: 'Đơn hàng', icon }]}
        activeKey="orders"
        onNavigate={() => {}}
      >
        <div>Body</div>
      </AppShell>,
    );

    const navItem = screen.getByRole('button', { name: 'Đơn hàng' });
    expect(navItem.querySelector('[class*="icon"] svg')).toBeInTheDocument();
    expect(navItem.textContent).not.toContain('0');
    expect(navItem.textContent).not.toContain('▦');
  },
);

test('uses the default registry icon when no icon is provided', () => {
  render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng' }]}
      activeKey="orders"
      onNavigate={() => {}}
    >
      <div>Body</div>
    </AppShell>,
  );

  const navItem = screen.getByRole('button', { name: 'Đơn hàng' });
  expect(navItem.querySelector('[class*="icon"] svg')).toBeInTheDocument();
});

test('keeps supporting string icons for existing NavItem consumers', () => {
  render(
    <AppShell
      sidebar={[{ key: 'orders', label: 'Đơn hàng', icon: '★' }]}
      activeKey="orders"
      onNavigate={() => {}}
    >
      <div>Body</div>
    </AppShell>,
  );

  expect(screen.getByRole('button', { name: 'Đơn hàng' })).toHaveTextContent('★');
});

test('keeps ReactNode icons visible in the collapsed rail and supports clicking the icon', () => {
  const onNavigate = vi.fn();
  const { rerender, container } = render(
    <AppShell
      sidebar={[
        { key: 'orders', label: 'Đơn hàng', icon: <span data-testid="nav-icon">★</span> },
        { key: 'stock', label: 'Kho vận' },
      ]}
      activeKey="orders"
      onNavigate={onNavigate}
      sidebarCollapsed
    >
      <div>Body</div>
    </AppShell>,
  );

  expect(container.querySelector('[data-collapsed]')).toHaveAttribute('data-collapsed', 'true');
  const icon = screen.getByTestId('nav-icon');
  expect(icon).toBeInTheDocument();
  expect(icon.closest('[aria-hidden="true"]')).not.toBeNull();

  fireEvent.click(icon);
  expect(onNavigate).toHaveBeenCalledWith('orders');

  rerender(
    <AppShell
      sidebar={[
        { key: 'orders', label: 'Đơn hàng', icon: <span data-testid="nav-icon">★</span> },
        { key: 'stock', label: 'Kho vận' },
      ]}
      activeKey="stock"
      onNavigate={onNavigate}
      sidebarCollapsed
    >
      <div>Body</div>
    </AppShell>,
  );

  expect(screen.getByRole('button', { name: 'Kho vận' })).toHaveAttribute('aria-current', 'page');
});
