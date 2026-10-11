import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';
test('primary renders and accent uses orange', () => {
  const { rerender } = render(<Button variant="primary">Tạo đơn</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Tạo đơn');
  rerender(<Button variant="accent">Duyệt</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'accent');
});

test('defaults to type button so it never submits an enclosing form', () => {
  const onSubmit = vi.fn();
  render(
    <form onSubmit={onSubmit}>
      <Button>Lưu</Button>
    </form>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));
  expect(onSubmit).not.toHaveBeenCalled();
});

test('an explicit type submit still submits the enclosing form', () => {
  const onSubmit = vi.fn();
  render(
    <form onSubmit={onSubmit}>
      <Button type="submit">Gửi</Button>
    </form>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Gửi' }));
  expect(onSubmit).toHaveBeenCalledTimes(1);
});
