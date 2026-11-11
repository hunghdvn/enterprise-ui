import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

test('renders a textarea with three rows by default', () => {
  render(<Textarea aria-label="Ghi chú" />);
  const field = screen.getByRole('textbox', { name: 'Ghi chú' });
  expect(field.tagName).toBe('TEXTAREA');
  expect(field).toHaveAttribute('rows', '3');
});

test('error sets aria-invalid, links its id and announces', () => {
  render(<Textarea aria-label="Ghi chú" aria-describedby="hint-1" error="Bắt buộc" />);
  const field = screen.getByRole('textbox', { name: 'Ghi chú' });
  const describedBy = field.getAttribute('aria-describedby') ?? '';
  expect(field).toHaveAttribute('aria-invalid', 'true');

  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Bắt buộc');
  // caller id first, generated error id appended
  expect(describedBy.split(' ')[0]).toBe('hint-1');
  expect(describedBy.split(' ')).toContain(alert.id);
});

test('controlled value + onChange round-trip', () => {
  function Wrapper() {
    const [value, setValue] = useState('đầu');
    return (
      <Textarea
        aria-label="Ghi chú"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    );
  }
  render(<Wrapper />);
  const field = screen.getByRole('textbox', { name: 'Ghi chú' });
  expect(field).toHaveValue('đầu');
  fireEvent.change(field, { target: { value: 'cuối' } });
  expect(field).toHaveValue('cuối');
});

test('a caller rows wins over the default', () => {
  render(<Textarea aria-label="Ghi chú" rows={6} />);
  expect(screen.getByRole('textbox', { name: 'Ghi chú' })).toHaveAttribute('rows', '6');
});

test('disabled passes through to the textarea', () => {
  render(<Textarea aria-label="Ghi chú" disabled />);
  expect(screen.getByRole('textbox', { name: 'Ghi chú' })).toBeDisabled();
});

test('a caller className merges with the module class', () => {
  render(<Textarea aria-label="Ghi chú" className="my-class" />);
  const field = screen.getByRole('textbox', { name: 'Ghi chú' });
  expect(field.className).toContain('my-class');
  expect(field.className.trim().split(/\s+/).length).toBeGreaterThan(1);
});
