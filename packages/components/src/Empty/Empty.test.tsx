import { render, screen } from '@testing-library/react';
import { Empty } from './Empty';

test('renders default description', () => {
  render(<Empty />);
  expect(screen.getByText('Không có dữ liệu')).toBeInTheDocument();
});

test('renders custom description', () => {
  render(<Empty description="Không tìm thấy kết quả" />);
  expect(screen.getByText('Không tìm thấy kết quả')).toBeInTheDocument();
});

test('renders action button', () => {
  render(<Empty action={<button>Tải lại</button>} />);
  expect(screen.getByText('Tải lại')).toBeInTheDocument();
});

test('renders custom icon', () => {
  render(<Empty icon={<span data-testid="custom-icon">📦</span>} />);
  expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
});
