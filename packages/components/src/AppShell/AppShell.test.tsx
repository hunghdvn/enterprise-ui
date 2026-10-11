import { fireEvent, render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';
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
