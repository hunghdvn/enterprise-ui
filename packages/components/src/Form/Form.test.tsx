import { fireEvent, render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Form } from './Form';

test('shows inline error', () => {
  render(
    <Form errors={{ code: 'Bắt buộc' }} onSubmit={(e) => e.preventDefault()}>
      <Field label="Mã đơn" error="Bắt buộc">
        <input aria-label="Mã đơn" />
      </Field>
    </Form>,
  );
  expect(screen.getByText('Bắt buộc')).toBeInTheDocument();
  expect(screen.getByLabelText('Mã đơn')).toHaveAttribute('aria-invalid', 'true');
});

test('submits via onSubmit without page reload', () => {
  const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
  render(
    <Form onSubmit={onSubmit}>
      <Field label="Mã đơn">
        <input aria-label="Mã đơn" />
      </Field>
      <button type="submit">Lưu</button>
    </Form>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));
  expect(onSubmit).toHaveBeenCalledTimes(1);
});
