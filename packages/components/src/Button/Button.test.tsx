import { render, screen } from '@testing-library/react';
import { Button } from './Button';
test('primary renders and accent uses orange', () => {
  const { rerender } = render(<Button variant="primary">Tạo đơn</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Tạo đơn');
  rerender(<Button variant="accent">Duyệt</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'accent');
});
