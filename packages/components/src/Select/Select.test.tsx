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

test('error wins over explicit aria-invalid and forwards describedby', () => {
  render(
    <Select aria-label="Kho" aria-invalid="false" aria-describedby="err-id" error="Bắt buộc">
      <option value="">Chọn</option>
    </Select>,
  );
  const el = screen.getByLabelText('Kho');
  expect(el).toHaveAttribute('aria-invalid', 'true');
  expect(el).toHaveAttribute('aria-describedby', 'err-id');
});
