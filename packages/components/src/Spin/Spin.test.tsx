// Spin.test.tsx
import { render, screen } from '@testing-library/react';
import { Spin } from './Spin';

test('renders spinner with role=status', () => {
  render(<Spin />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('renders tip text', () => {
  render(<Spin tip="Đang tải..." />);
  expect(screen.getByText('Đang tải...')).toBeInTheDocument();
});

test('renders fullscreen overlay', () => {
  render(<Spin fullscreen />);
  expect(screen.getByRole('status').parentElement).toHaveClass('fullscreen');
});
