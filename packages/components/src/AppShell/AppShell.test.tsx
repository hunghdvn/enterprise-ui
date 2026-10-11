import { fireEvent, render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

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
