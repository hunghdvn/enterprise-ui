import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
test('renders dot+text with tone', () => {
  const { rerender } = render(<Badge tone="orange">Chờ duyệt</Badge>);
  expect(screen.getByText('Chờ duyệt')).toBeInTheDocument();
  rerender(<Badge tone="blue">Đang giao</Badge>);
  expect(screen.getByText('Đang giao')).toHaveAttribute('data-tone', 'blue');
});
