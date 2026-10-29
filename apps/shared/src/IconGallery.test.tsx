import { fireEvent, render, screen } from '@testing-library/react';
import { IconGallery } from './IconGallery';

const cells = () => document.querySelectorAll('#icon-gallery > *');

test('renders the first page and reports the total', () => {
  render(<IconGallery />);
  expect(screen.getByRole('heading', { name: 'Tất cả icon', level: 2 })).toBeInTheDocument();
  expect(cells()).toHaveLength(240);
  expect(screen.getByRole('status')).toHaveTextContent('1263 / 1263 icon');
});

test('renders the requested heading level', () => {
  render(<IconGallery headingLevel={3} />);
  expect(screen.getByRole('heading', { name: 'Tất cả icon', level: 3 })).toBeInTheDocument();
});

test('filters icons by name', () => {
  render(<IconGallery />);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm icon' }), {
    target: { value: 'warehouse' },
  });
  expect(cells()).toHaveLength(1);
  expect(screen.getByRole('status')).toHaveTextContent('1 / 1263 icon');
  expect(screen.getByText('warehouse')).toBeInTheDocument();
});

test('shows the empty state when no icon matches', () => {
  render(<IconGallery />);
  fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm icon' }), {
    target: { value: 'zzzz-no-match' },
  });
  expect(cells()).toHaveLength(0);
  const [count, empty] = screen.getAllByRole('status');
  expect(count).toHaveTextContent('0 / 1263 icon');
  expect(empty).toHaveTextContent('Không tìm thấy icon phù hợp.');
});

test('keeps the more button focusable and inert after the last page', () => {
  render(<IconGallery />);
  const more = screen.getByRole('button', { name: /Hiện thêm/ });
  more.focus();
  expect(more).toHaveFocus();

  for (let index = 0; index < 5; index += 1) fireEvent.click(more);

  expect(cells()).toHaveLength(1263);
  expect(more).toHaveAttribute('aria-disabled', 'true');
  expect(more).toHaveTextContent('Đã hiển thị tất cả 1263 icon');
  expect(more).toHaveFocus();

  fireEvent.click(more);
  expect(cells()).toHaveLength(1263);
});
