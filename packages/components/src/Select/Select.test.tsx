import { render, screen } from '@testing-library/react';
import { Select } from './Select';

test('renders options', () => {
  render(
    <Select aria-label="Kho">
      <option value="a">A</option>
      <option value="b">B</option>
    </Select>,
  );
  expect(screen.getByLabelText('Kho')).toBeInTheDocument();
  expect(screen.getByText('A')).toBeInTheDocument();
});

test('sets aria-invalid and shows error', () => {
  render(
    <Select aria-label="Kho" error="Bắt buộc">
      <option value="">Chọn</option>
    </Select>,
  );
  expect(screen.getByLabelText('Kho')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Bắt buộc')).toBeInTheDocument();
});

test('error wins over explicit aria-invalid and merges describedby with error id', () => {
  render(
    <Select aria-label="Kho" aria-invalid="false" aria-describedby="err-id" error="Bắt buộc">
      <option value="">Chọn</option>
    </Select>,
  );
  const el = screen.getByLabelText('Kho');
  expect(el).toHaveAttribute('aria-invalid', 'true');
  const errorId = screen.getByRole('alert').getAttribute('id') ?? '';
  const describedBy = (el.getAttribute('aria-describedby') ?? '').split(' ');
  expect(describedBy).toContain('err-id');
  expect(describedBy).toContain(errorId);
});

test('links the error span id via aria-describedby and keeps explicit id', () => {
  render(
    <Select id="warehouse" aria-label="Kho" error="Bắt buộc">
      <option value="">Chọn</option>
    </Select>,
  );
  const el = screen.getByLabelText('Kho');
  expect(el).toHaveAttribute('id', 'warehouse');
  const error = screen.getByRole('alert');
  expect(error).toHaveTextContent('Bắt buộc');
  const errorId = error.getAttribute('id') ?? '';
  expect(errorId).not.toBe('');
  expect((el.getAttribute('aria-describedby') ?? '').split(' ')).toContain(errorId);
});

test('keeps describedby untouched without error', () => {
  const { rerender } = render(
    <Select aria-label="Kho" aria-describedby="hint-1">
      <option value="">Chọn</option>
    </Select>,
  );
  expect(screen.getByLabelText('Kho')).toHaveAttribute('aria-describedby', 'hint-1');
  rerender(
    <Select aria-label="Kho" aria-describedby="hint-1" error="Bắt buộc">
      <option value="">Chọn</option>
    </Select>,
  );
  const describedBy = (screen.getByLabelText('Kho').getAttribute('aria-describedby') ?? '').split(
    ' ',
  );
  const errorId = screen.getByRole('alert').getAttribute('id') ?? '';
  expect(describedBy).toContain('hint-1');
  expect(describedBy).toContain(errorId);
});
