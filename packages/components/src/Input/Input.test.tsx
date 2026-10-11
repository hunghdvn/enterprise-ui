import { render, screen } from '@testing-library/react';
import { Input } from './Input';
test('renders input and sets aria-invalid on error', () => {
  const { rerender } = render(<Input aria-label="Mã đơn" placeholder="Nhập mã" />);
  expect(screen.getByLabelText('Mã đơn')).not.toHaveAttribute('aria-invalid', 'true');
  rerender(<Input aria-label="Mã đơn" error="Bắt buộc" />);
  expect(screen.getByLabelText('Mã đơn')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Bắt buộc')).toBeInTheDocument();
});

test('links the error span id via aria-describedby and keeps explicit id', () => {
  render(<Input id="order-code" aria-label="Mã đơn" error="Bắt buộc" />);
  const input = screen.getByLabelText('Mã đơn');
  expect(input).toHaveAttribute('id', 'order-code');
  const error = screen.getByRole('alert');
  const errorId = error.getAttribute('id') ?? '';
  expect(errorId).not.toBe('');
  expect(error).toHaveTextContent('Bắt buộc');
  const describedBy = (input.getAttribute('aria-describedby') ?? '').split(' ');
  expect(describedBy).toContain(errorId);
});

test('merges existing aria-describedby with the error id, dropped without error', () => {
  const { rerender } = render(
    <Input aria-label="Mã đơn" aria-describedby="hint-1" error="Bắt buộc" />,
  );
  const input = screen.getByLabelText('Mã đơn');
  const errorId = screen.getByRole('alert').getAttribute('id') ?? '';
  const merged = (input.getAttribute('aria-describedby') ?? '').split(' ');
  expect(merged).toContain('hint-1');
  expect(merged).toContain(errorId);

  rerender(<Input aria-label="Mã đơn" aria-describedby="hint-1" />);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Mã đơn')).toHaveAttribute('aria-describedby', 'hint-1');
});

test('generates ids for control and error when none are supplied', () => {
  render(<Input aria-label="Mã đơn" error="Bắt buộc" />);
  const input = screen.getByLabelText('Mã đơn');
  const inputId = input.getAttribute('id') ?? '';
  expect(inputId).not.toBe('');
  const errorId = screen.getByRole('alert').getAttribute('id') ?? '';
  expect(errorId).not.toBe('');
  expect(errorId).not.toBe(inputId);
  expect((input.getAttribute('aria-describedby') ?? '').split(' ')).toContain(errorId);
});
