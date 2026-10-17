// Spin.test.tsx
import { render, screen } from '@testing-library/react';
import { Spin } from './Spin';
import styles from './Spin.module.css';

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
  expect(screen.getByRole('status').parentElement).toHaveClass(styles.fullscreen);
});

test('fullscreen locks body scroll and releases it on unmount', () => {
  expect(document.body.style.overflow).toBe('');
  const { unmount } = render(<Spin fullscreen />);
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).toBe('');
});
