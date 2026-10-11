import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { FilterBar } from './FilterBar';

test('searches, resets, toggles density', () => {
  const onSearch = vi.fn();
  const onReset = vi.fn();
  render(
    <ThemeProvider>
      <FilterBar searchValue="" onSearch={onSearch} onReset={onReset} />
    </ThemeProvider>,
  );
  const search = screen.getByRole('searchbox', { name: /Tìm kiếm/i });
  fireEvent.change(search, { target: { value: 'SO-1' } });
  expect(onSearch).toHaveBeenCalledWith('SO-1');
  fireEvent.click(screen.getByRole('button', { name: /Đặt lại/i }));
  expect(onReset).toHaveBeenCalled();
  const toggle = screen.getByRole('button', { name: /Mật độ/i });
  expect(toggle).toHaveTextContent(/Gọn/i);
  fireEvent.click(toggle);
  expect(toggle).toHaveTextContent(/Thoáng/i);
});

test('renders filters slot', () => {
  render(
    <ThemeProvider>
      <FilterBar searchValue="" onSearch={() => {}} filters={<span>Bộ lọc demo</span>} />
    </ThemeProvider>,
  );
  expect(screen.getByText('Bộ lọc demo')).toBeInTheDocument();
});

test('hides density toggle when disabled', () => {
  render(
    <ThemeProvider>
      <FilterBar searchValue="" onSearch={() => {}} densityToggle={false} />
    </ThemeProvider>,
  );
  expect(screen.queryByRole('button', { name: /Mật độ/i })).not.toBeInTheDocument();
});

test('works without ThemeProvider when density toggle hidden', () => {
  render(<FilterBar searchValue="" onSearch={() => {}} densityToggle={false} />);
  expect(screen.getByRole('searchbox', { name: /Tìm kiếm/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Mật độ/i })).not.toBeInTheDocument();
});

test('hides density toggle by default outside ThemeProvider', () => {
  render(<FilterBar searchValue="" onSearch={() => {}} />);
  expect(screen.queryByRole('button', { name: /Mật độ/i })).not.toBeInTheDocument();
});

test('shows density toggle by default inside ThemeProvider', () => {
  render(
    <ThemeProvider>
      <FilterBar searchValue="" onSearch={() => {}} />
    </ThemeProvider>,
  );
  expect(screen.getByRole('button', { name: /Mật độ/i })).toBeInTheDocument();
});

test('throws when density toggle is forced outside ThemeProvider', () => {
  // Explicitly opting in without a provider is a wiring mistake: fail loudly
  // instead of rendering a button whose clicks silently do nothing.
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => render(<FilterBar searchValue="" onSearch={() => {}} densityToggle />)).toThrow(
    /ThemeProvider/,
  );
  spy.mockRestore();
});
