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

test('resolves errors from Form context via Field name', () => {
  render(
    <Form errors={{ code: 'Bắt buộc' }}>
      <Field label="Mã" name="code">
        <input aria-label="Mã" />
      </Field>
    </Form>,
  );
  expect(screen.getByText('Bắt buộc')).toBeInTheDocument();
  const input = screen.getByLabelText('Mã');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  const describedBy = input.getAttribute('aria-describedby') ?? '';
  const errorId = screen.getByRole('alert').getAttribute('id') ?? '';
  expect(errorId).not.toBe('');
  expect(describedBy.split(' ')).toContain(errorId);
});

test('explicit error prop takes precedence over context', () => {
  render(
    <Form errors={{ code: 'Lỗi context' }}>
      <Field label="Mã" name="code" error="Lỗi explicit">
        <input aria-label="Mã" />
      </Field>
    </Form>,
  );
  expect(screen.getByText('Lỗi explicit')).toBeInTheDocument();
  expect(screen.queryByText('Lỗi context')).not.toBeInTheDocument();
});

test('merges existing aria-describedby and links label htmlFor to control id', () => {
  const { container } = render(
    <Form errors={{}}>
      <Field label="Mã" error="Bắt buộc">
        <input aria-label="Mã" aria-describedby="hint-1" />
      </Field>
    </Form>,
  );
  const input = screen.getByLabelText('Mã');
  const describedBy = input.getAttribute('aria-describedby') ?? '';
  const errorId = screen.getByRole('alert').getAttribute('id') ?? '';
  expect(describedBy.split(' ')).toContain('hint-1');
  expect(describedBy.split(' ')).toContain(errorId);
  const inputId = input.getAttribute('id') ?? '';
  expect(inputId).not.toBe('');
  const label = container.querySelector('label');
  expect(label).toHaveAttribute('for', inputId);
});
