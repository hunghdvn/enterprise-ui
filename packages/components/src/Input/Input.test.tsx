import { render, screen } from '@testing-library/react';
import { Input } from './Input';
test('renders input and sets aria-invalid on error', () => {
  const { rerender } = render(<Input aria-label="Mã đơn" placeholder="Nhập mã" />);
  expect(screen.getByLabelText('Mã đơn')).not.toHaveAttribute('aria-invalid', 'true');
  rerender(<Input aria-label="Mã đơn" error="Bắt buộc" />);
  expect(screen.getByLabelText('Mã đơn')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Bắt buộc')).toBeInTheDocument();
});
