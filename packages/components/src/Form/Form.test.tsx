import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from '../Checkbox/Checkbox';
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

test('marks required controls for assistive tech', () => {
  render(
    <Form>
      <Field label="Mã đơn" required>
        <input aria-label="Mã đơn" />
      </Field>
    </Form>,
  );
  expect(screen.getByLabelText('Mã đơn')).toHaveAttribute('aria-required', 'true');
});

test('keeps a required child that already declares it', () => {
  render(
    <Form>
      <Field label="Mã đơn" required>
        <input aria-label="Mã đơn" aria-required="true" />
      </Field>
    </Form>,
  );
  expect(screen.getByLabelText('Mã đơn')).toHaveAttribute('aria-required', 'true');
});

test('does not nest labels when the child renders its own', () => {
  const { container } = render(
    <Form>
      <Field label="Đồng ý điều khoản">
        <Checkbox>Tôi đồng ý</Checkbox>
      </Field>
    </Form>,
  );
  // One label only: the Checkbox's own. Field falls back to plain text.
  expect(container.querySelectorAll('label')).toHaveLength(1);
  expect(screen.getByRole('checkbox', { name: 'Tôi đồng ý' })).toBeInTheDocument();
  expect(screen.getByText('Đồng ý điều khoản')).toBeInTheDocument();
});

test('exposes the hint as the control description and keeps it out of the label', () => {
  render(
    <Form>
      <Field label="Mã đơn" hint="Định dạng SO-2024-0001">
        <input />
      </Field>
    </Form>,
  );
  // The label element no longer wraps the control, so its accessible name is
  // the label text alone — the hint cannot leak into it.
  const input = screen.getByLabelText('Mã đơn');
  expect(input.tagName).toBe('INPUT');
  const hint = screen.getByText('Định dạng SO-2024-0001');
  expect(hint.id).not.toBe('');
  const describedBy = input.getAttribute('aria-describedby') ?? '';
  expect(describedBy.split(' ')).toContain(hint.id);
});

test('shows the hint alongside an error, both described by the control', () => {
  render(
    <Form>
      <Field label="Mã đơn" error="Bắt buộc" hint="Định dạng SO-2024-0001">
        <input />
      </Field>
    </Form>,
  );
  const input = screen.getByLabelText('Mã đơn');
  const hint = screen.getByText('Định dạng SO-2024-0001');
  const error = screen.getByRole('alert');
  expect(hint.id).not.toBe('');
  expect(error.id).not.toBe('');
  const describedBy = (input.getAttribute('aria-describedby') ?? '').split(' ');
  expect(describedBy).toContain(hint.id);
  expect(describedBy).toContain(error.id);
  expect(input).toHaveAttribute('aria-invalid', 'true');
});

test('announces a hint on a control that renders its own label', () => {
  render(
    <Form>
      <Field label="Điều khoản" hint="Bắt buộc để tiếp tục">
        <Checkbox>Tôi đồng ý</Checkbox>
      </Field>
    </Form>,
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Tôi đồng ý' });
  const hint = screen.getByText('Bắt buộc để tiếp tục');
  expect(hint.id).not.toBe('');
  const describedBy = (checkbox.getAttribute('aria-describedby') ?? '').split(' ');
  expect(describedBy).toContain(hint.id);
});

// Regression guard: every id a control is described by must exist in the DOM,
// otherwise assistive tech announces a dangling reference.
function expectDescribedIdsResolve(control: HTMLElement) {
  const ids = (control.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
  for (const id of ids) {
    expect(document.getElementById(id)).not.toBeNull();
  }
  return ids;
}

test('sets no aria-describedby when the field has neither error nor hint', () => {
  render(
    <Form>
      <Field label="Mã đơn">
        <input aria-label="Mã đơn" />
      </Field>
    </Form>,
  );
  const input = screen.getByLabelText('Mã đơn');
  expect(input).not.toHaveAttribute('aria-describedby');
  expectDescribedIdsResolve(input);
});

test('a hint-only field describes the control with the existing hint element', () => {
  render(
    <Form>
      <Field label="Mã đơn" hint="Định dạng SO-2024-0001">
        <input aria-label="Mã đơn" />
      </Field>
    </Form>,
  );
  const input = screen.getByLabelText('Mã đơn');
  const hint = screen.getByText('Định dạng SO-2024-0001');
  const ids = expectDescribedIdsResolve(input);
  expect(ids).toEqual([hint.id]);
});

test('an error-only field describes the control with the existing error element', () => {
  render(
    <Form>
      <Field label="Mã đơn" error="Bắt buộc">
        <input aria-label="Mã đơn" />
      </Field>
    </Form>,
  );
  const input = screen.getByLabelText('Mã đơn');
  const error = screen.getByRole('alert');
  const ids = expectDescribedIdsResolve(input);
  expect(ids).toEqual([error.id]);
});

test('an error and a hint together both resolve to rendered elements', () => {
  render(
    <Form>
      <Field label="Mã đơn" error="Bắt buộc" hint="Định dạng SO-2024-0001">
        <input aria-label="Mã đơn" />
      </Field>
    </Form>,
  );
  const input = screen.getByLabelText('Mã đơn');
  const hint = screen.getByText('Định dạng SO-2024-0001');
  const error = screen.getByRole('alert');
  const ids = expectDescribedIdsResolve(input);
  expect(ids).toContain(hint.id);
  expect(ids).toContain(error.id);
  expect(input).toHaveAttribute('aria-invalid', 'true');
});
