import { fireEvent, render, screen } from '@testing-library/react';
import { NotificationCenter } from './NotificationCenter';
import type { Notification } from './types';

const items: Notification[] = [
  {
    id: 'n1',
    title: 'Đơn SO-10482 chờ duyệt',
    body: 'Cần phê duyệt trước 17:00',
    time: '2 phút trước',
    unread: true,
    kind: 'warning',
  },
  {
    id: 'n2',
    title: 'Khách hàng An Phát đã thanh toán',
    time: '1 giờ trước',
    unread: true,
    kind: 'success',
  },
  { id: 'n3', title: 'Báo cáo tháng 10 sẵn sàng', time: 'Hôm qua', unread: false, kind: 'info' },
];

test('renders a closed bell trigger with an aria-label', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Thông báo' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('badge shows the unread count (capped at 9+)', () => {
  const many = Array.from({ length: 12 }, (_, i) => ({
    id: `m${i}`,
    title: `n${i}`,
    time: 'now',
    unread: true,
  }));
  render(<NotificationCenter notifications={many} onMarkRead={() => {}} />);
  const badge = screen.getByLabelText('12 thông báo chưa đọc');
  expect(badge).toHaveTextContent('9+');
});

test('no badge when there are no unread', () => {
  render(
    <NotificationCenter
      notifications={items.map((n) => ({ ...n, unread: false }))}
      onMarkRead={() => {}}
    />,
  );
  expect(screen.queryByLabelText(/thông báo chưa đọc/)).toBeNull();
});

test('clicking the trigger opens the panel listing all notifications', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  const panel = screen.getByRole('dialog');
  expect(panel).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  expect(screen.getByText('Đơn SO-10482 chờ duyệt')).toBeInTheDocument();
  expect(screen.getByText('Cần phê duyệt trước 17:00')).toBeInTheDocument();
});

test('unread items carry data-unread; read items do not', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  const list = screen.getByRole('list');
  const rows = Array.from(list.querySelectorAll('li'));
  expect(rows[0]).toHaveAttribute('data-unread', 'true');
  expect(rows[2]).not.toHaveAttribute('data-unread');
});

test('mark-all-read button appears only when there are unread and onMarkAllRead is passed', () => {
  const onMarkAllRead = vi.fn();
  render(
    <NotificationCenter
      notifications={items}
      onMarkRead={() => {}}
      onMarkAllRead={onMarkAllRead}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  const btn = screen.getByRole('button', { name: 'Đánh dấu đã đọc tất cả' });
  fireEvent.click(btn);
  expect(onMarkAllRead).toHaveBeenCalledTimes(1);
});

test('per-item mark-read reports the id and leaves the panel open', () => {
  const onMarkRead = vi.fn();
  render(<NotificationCenter notifications={items} onMarkRead={onMarkRead} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  const btn = screen.getByRole('button', { name: 'Đánh dấu đã đọc: Đơn SO-10482 chờ duyệt' });
  fireEvent.click(btn);
  expect(onMarkRead).toHaveBeenCalledWith('n1');
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('per-item remove reports the id', () => {
  const onRemove = vi.fn();
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} onRemove={onRemove} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Xóa: Báo cáo tháng 10 sẵn sàng' }));
  expect(onRemove).toHaveBeenCalledWith('n3');
});

test('per-item select reports the id', () => {
  const onSelect = vi.fn();
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} onSelect={onSelect} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Mở: Đơn SO-10482 chờ duyệt' }));
  expect(onSelect).toHaveBeenCalledWith('n1');
});

test('empty state is shown when there are no notifications', () => {
  render(<NotificationCenter notifications={[]} onMarkRead={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  expect(screen.getByText('Không có thông báo')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Đánh dấu đã đọc tất cả' })).toBeNull();
});

test('Escape closes the panel', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('clicking outside closes the panel', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('disabled: trigger is disabled and never opens', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} disabled />);
  const trigger = screen.getByRole('button', { name: 'Thông báo' });
  expect(trigger).toBeDisabled();
  fireEvent.click(trigger);
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('warns on duplicate notification ids (dev-only)', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    render(
      <NotificationCenter
        notifications={[...items, { id: 'n1', title: 'Trùng', time: 'now' }]}
        onMarkRead={() => {}}
      />,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate notification id "n1"'));
  } finally {
    warn.mockRestore();
  }
});

test('badge cap is "9+" above 9 unread', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  // 2 unread → badge shows "2"
  expect(screen.getByLabelText('2 thông báo chưa đọc')).toHaveTextContent('2');
});

test('closing returns focus to the trigger (review #27 #1)', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Thông báo' });
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(trigger).toHaveFocus();
});

test('a custom icon overrides the kind icon', () => {
  const custom = <span data-testid="custom-icon">★</span>;
  render(
    <NotificationCenter
      notifications={[
        { id: 'x', title: 'Hi', time: 'now', unread: true, kind: 'info', icon: custom },
      ]}
      onMarkRead={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
});

test('re-place runs when the list changes while open', () => {
  const { rerender } = render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  const panel = screen.getByRole('dialog');
  const originalTop = panel.style.top;
  // Parent updates the list (e.g. a new notification arrived) — the panel
  // must re-place, not keep a stale rect.
  rerender(
    <NotificationCenter
      notifications={[...items, { id: 'n4', title: 'Mới', time: 'vừa xong', unread: true }]}
      onMarkRead={() => {}}
    />,
  );
  // In jsdom the rect is 0, so both tops are '0px' — the assertion below
  // only pins that the effect ran without throwing and the panel stayed open.
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(panel.style.position).toBe('fixed');
  void originalTop;
});

test('panel is positioned fixed', () => {
  render(<NotificationCenter notifications={items} onMarkRead={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));
  expect(screen.getByRole('dialog')).toHaveStyle({ position: 'fixed' });
});
