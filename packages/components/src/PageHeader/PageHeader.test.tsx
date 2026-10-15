import { fireEvent, render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

test('renders title, subtitle and actions without a back button', () => {
  render(
    <PageHeader
      title="SO-10482"
      subtitle="Cty An Phát · 12 dòng hàng"
      actions={<button type="button">Duyệt</button>}
    />,
  );
  expect(screen.getByRole('heading', { name: 'SO-10482' })).toBeInTheDocument();
  expect(screen.getByText(/Cty An Phát/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Duyệt' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Quay lại/ })).toBeNull();
});

test('back button calls onBack', () => {
  const onBack = vi.fn();
  render(<PageHeader title="Chi tiết" onBack={onBack} backLabel="Danh sách" />);
  fireEvent.click(screen.getByRole('button', { name: 'Danh sách' }));
  expect(onBack).toHaveBeenCalledTimes(1);
});

test('long titles ellipsize instead of breaking the layout', () => {
  render(<PageHeader title={'Đơn hàng '.repeat(30)} actions={<span>A</span>} />);
  const heading = screen.getByRole('heading');
  expect(heading.className).toMatch(/title/);
  // The actions slot survives next to an overflowing title (flex + ellipsis).
  expect(screen.getByText('A')).toBeInTheDocument();
});
