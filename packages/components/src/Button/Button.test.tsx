import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';
test('primary renders and accent uses orange', () => {
  const { rerender } = render(<Button variant="primary">Tạo đơn</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Tạo đơn');
  rerender(<Button variant="accent">Duyệt</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'accent');
});

test('success variant renders with success data-variant', () => {
  render(<Button variant="success">Xác nhận</Button>);
  const button = screen.getByRole('button', { name: 'Xác nhận' });
  expect(button).toHaveAttribute('data-variant', 'success');
  expect(button).not.toBeDisabled();
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

test('a loading button keeps its label announced, marks busy and blocks input', () => {
  const onClick = vi.fn();
  render(
    <Button loading onClick={onClick}>
      Lưu
    </Button>,
  );
  const button = screen.getByRole('button', { name: /Lưu/ });
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toHaveTextContent('Lưu');
  expect(button).toBeDisabled();
  fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
});

test('an idle button carries no aria-busy and hides the loading glyph', () => {
  render(<Button>Lưu</Button>);
  const button = screen.getByRole('button', { name: 'Lưu' });
  expect(button).not.toHaveAttribute('aria-busy');
  expect(button.textContent).toBe('Lưu');
  expect(button).not.toBeDisabled();
});

test.each(['sm', 'md'] as const)('renders a ReactNode icon before the label at size %s', (size) => {
  render(
    <Button size={size} icon={<span data-testid="button-icon">★</span>}>
      Tạo đơn
    </Button>,
  );
  const button = screen.getByRole('button', { name: '★ Tạo đơn' });
  const icon = screen.getByTestId('button-icon');

  expect(button).toContainElement(icon);
  expect(button.textContent!.indexOf('★')).toBeLessThan(button.textContent!.indexOf('Tạo đơn'));
});

test('keeps the icon and label when loading disables the button', () => {
  render(
    <Button loading icon={<span data-testid="button-icon">★</span>}>
      Đang lưu
    </Button>,
  );
  const button = screen.getByRole('button', { name: /Đang lưu/ });

  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByTestId('button-icon')).toBeInTheDocument();
});
