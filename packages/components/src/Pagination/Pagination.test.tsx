import { fireEvent, render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

test('renders range and navigates pages', () => {
  const onChange = vi.fn();
  render(<Pagination page={1} pageSize={20} total={95} onChange={onChange} />);
  expect(screen.getByText('1-20 / 95')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Trang 2' }));
  expect(onChange).toHaveBeenCalledWith(2);
  expect(screen.getByRole('button', { name: 'Trang trước' })).toBeDisabled();
});

test('disables next on last page and clamps range', () => {
  const onChange = vi.fn();
  render(<Pagination page={5} pageSize={20} total={95} onChange={onChange} />);
  expect(screen.getByText('81-95 / 95')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Trang sau' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Trang 5' })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(screen.getByRole('button', { name: 'Trang 5' }));
  expect(onChange).not.toHaveBeenCalled();
});

test('handles empty data without crashing', () => {
  render(<Pagination page={1} pageSize={20} total={0} onChange={() => {}} />);
  expect(screen.getByText('0-0 / 0')).toBeInTheDocument();
});

test('jumps via jumper with clamping and Enter', () => {
  const onChange = vi.fn();
  const { rerender } = render(<Pagination page={1} pageSize={20} total={95} onChange={onChange} />);
  expect(screen.getByText('/ 5 trang')).toBeInTheDocument();
  const input = screen.getByLabelText(/Đi tới trang/i) as HTMLInputElement;
  fireEvent.change(input, { target: { value: '999' } });
  fireEvent.click(screen.getByRole('button', { name: 'Đi' }));
  expect(onChange).toHaveBeenCalledWith(5);

  onChange.mockClear();
  rerender(<Pagination page={3} pageSize={20} total={95} onChange={onChange} />);
  const input2 = screen.getByLabelText(/Đi tới trang/i) as HTMLInputElement;
  expect(input2.value).toBe('3');
  fireEvent.change(input2, { target: { value: '0' } });
  const form = input2.closest('form');
  expect(form).not.toBeNull();
  fireEvent.submit(form!);
  expect(onChange).toHaveBeenCalledWith(1);
});
