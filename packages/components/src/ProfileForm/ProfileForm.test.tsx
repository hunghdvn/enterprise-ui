import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProfileForm } from './ProfileForm';
import type { ProfileFormValues } from './types';

const value: ProfileFormValues = {
  displayName: 'Nguyễn Văn A',
  email: 'a@example.com',
  phone: '0901234567',
  jobTitle: 'Kế toán trưởng',
  department: 'Tài chính',
};

test('renders five labelled inputs with the right name, type and autocomplete', () => {
  render(<ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} />);

  const name = screen.getByLabelText(/Họ và tên/);
  expect(name).toHaveAttribute('name', 'displayName');
  expect(name).toHaveAttribute('autocomplete', 'name');
  expect(name).toHaveValue('Nguyễn Văn A');

  const email = screen.getByLabelText(/Email/);
  expect(email).toHaveAttribute('name', 'email');
  expect(email).toHaveAttribute('type', 'email');
  expect(email).toHaveAttribute('inputmode', 'email');
  expect(email).toHaveAttribute('autocomplete', 'email');

  const phone = screen.getByLabelText(/Số điện thoại/);
  expect(phone).toHaveAttribute('name', 'phone');
  expect(phone).toHaveAttribute('type', 'tel');
  expect(phone).toHaveAttribute('inputmode', 'tel');
  expect(phone).toHaveAttribute('autocomplete', 'tel');

  const jobTitle = screen.getByLabelText(/Chức danh/);
  expect(jobTitle).toHaveAttribute('name', 'jobTitle');
  expect(jobTitle).toHaveAttribute('autocomplete', 'organization-title');

  const department = screen.getByLabelText(/Phòng ban/);
  expect(department).toHaveAttribute('name', 'department');
  expect(department).toHaveAttribute('autocomplete', 'organization');
});

test('a value typed in a field reaches the caller through onChange', () => {
  const onChange = vi.fn();
  render(<ProfileForm value={value} onChange={onChange} onSubmit={() => {}} />);

  fireEvent.change(screen.getByLabelText(/Họ và tên/), { target: { value: 'Trần Thị B' } });

  expect(onChange).toHaveBeenCalledWith({ ...value, displayName: 'Trần Thị B' });
});

test.each([
  ['Họ và tên', 'displayName', 'Trần Thị B'],
  ['Email', 'email', 'b@example.com'],
  ['Số điện thoại', 'phone', '0912345678'],
  ['Chức danh', 'jobTitle', 'Trưởng phòng'],
  ['Phòng ban', 'department', 'Kinh doanh'],
] as const)('editing %s emits the whole next value', (label, key, typed) => {
  const onChange = vi.fn();
  render(<ProfileForm value={value} onChange={onChange} onSubmit={() => {}} />);

  fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { value: typed } });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ ...value, [key]: typed });
});

test('two edits in different fields both land', () => {
  function Harness() {
    const [current, setCurrent] = useState(value);
    return (
      <ProfileForm
        value={current}
        onChange={(next) => setCurrent((previous) => ({ ...previous, ...next }))}
        onSubmit={() => {}}
      />
    );
  }
  render(<Harness />);

  fireEvent.change(screen.getByLabelText(/Họ và tên/), { target: { value: 'Trần Thị B' } });
  fireEvent.change(screen.getByLabelText(/Phòng ban/), { target: { value: 'Kinh doanh' } });

  // The second edit must build on the first, not on the value from the first render.
  expect(screen.getByLabelText(/Họ và tên/)).toHaveValue('Trần Thị B');
  expect(screen.getByLabelText(/Phòng ban/)).toHaveValue('Kinh doanh');
});

test('submit prevents default and reports the current values', () => {
  const onSubmit = vi.fn();
  const { container } = render(
    <ProfileForm value={value} onChange={() => {}} onSubmit={onSubmit} />,
  );
  const form = container.querySelector('form') as HTMLFormElement;

  const notCancelled = fireEvent.submit(form);

  expect(notCancelled).toBe(false);
  expect(onSubmit).toHaveBeenCalledWith(value);
});

test('submit reads autofilled DOM values and syncs them back first', () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  const { container } = render(
    <ProfileForm value={{ ...value, email: '' }} onChange={onChange} onSubmit={onSubmit} />,
  );

  // Autofill writes straight into the input without firing a React change event.
  const email = screen.getByLabelText(/Email/) as HTMLInputElement;
  email.value = 'autofilled@example.com';

  fireEvent.submit(container.querySelector('form') as HTMLFormElement);

  const expected = { ...value, email: 'autofilled@example.com' };
  expect(onChange).toHaveBeenCalledWith(expected);
  expect(onSubmit).toHaveBeenCalledWith(expected);
  // The same object, so the caller cannot diverge between the two calls.
  expect(onChange.mock.calls[0][0]).toBe(onSubmit.mock.calls[0][0]);
  expect(onChange.mock.invocationCallOrder[0]).toBeLessThan(onSubmit.mock.invocationCallOrder[0]);
});

test('submit does not re-emit onChange when the DOM matches the value', () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  const { container } = render(
    <ProfileForm value={value} onChange={onChange} onSubmit={onSubmit} />,
  );

  fireEvent.submit(container.querySelector('form') as HTMLFormElement);

  expect(onChange).not.toHaveBeenCalled();
  expect(onSubmit).toHaveBeenCalledWith(value);
});

test('required defaults to displayName and email only', () => {
  render(<ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} />);

  expect(screen.getByLabelText(/Họ và tên/)).toHaveAttribute('aria-required', 'true');
  expect(screen.getByLabelText(/Email/)).toHaveAttribute('aria-required', 'true');
  expect(screen.getByLabelText(/Số điện thoại/)).not.toHaveAttribute('aria-required');
  expect(screen.getByLabelText(/Chức danh/)).not.toHaveAttribute('aria-required');
  expect(screen.getByLabelText(/Phòng ban/)).not.toHaveAttribute('aria-required');
});

test('a custom required list moves the marks', () => {
  render(
    <ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} required={['phone']} />,
  );

  expect(screen.getByLabelText(/Số điện thoại/)).toHaveAttribute('aria-required', 'true');
  expect(screen.getByLabelText(/Họ và tên/)).not.toHaveAttribute('aria-required');
  expect(screen.getByLabelText(/Email/)).not.toHaveAttribute('aria-required');
});

test('while loading only the submit is frozen, so cancelling stays possible', () => {
  const onCancel = vi.fn();
  render(
    <ProfileForm
      value={value}
      onChange={() => {}}
      onSubmit={() => {}}
      loading
      onCancel={onCancel}
    />,
  );

  expect(screen.getByRole('button', { name: /Lưu thay đổi/ })).toBeDisabled();
  const cancel = screen.getByRole('button', { name: 'Huỷ' });
  expect(cancel).toBeEnabled();
  fireEvent.click(cancel);
  expect(onCancel).toHaveBeenCalledTimes(1);
});

test('errors reach the matching field only', () => {
  render(
    <ProfileForm
      value={value}
      onChange={() => {}}
      onSubmit={() => {}}
      errors={{ email: 'Email không hợp lệ' }}
    />,
  );

  const email = screen.getByLabelText(/Email/);
  expect(email).toHaveAttribute('aria-invalid', 'true');
  const describedBy = email.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Email không hợp lệ');
  expect(describedBy).toContain(alert.id);
  expect(screen.getByLabelText(/Chức danh/)).not.toHaveAttribute('aria-invalid');
});

test('loading marks the form busy, disables submit and blocks Enter', () => {
  const onSubmit = vi.fn();
  const { container } = render(
    <ProfileForm value={value} onChange={() => {}} onSubmit={onSubmit} loading />,
  );

  const form = container.querySelector('form') as HTMLFormElement;
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('button', { name: /Lưu thay đổi/ })).toBeDisabled();

  // Enter in a field still submits natively; a disabled button must not let it through.
  fireEvent.submit(form);
  expect(onSubmit).not.toHaveBeenCalled();
});

test('disabled disables every control', () => {
  render(
    <ProfileForm
      value={value}
      onChange={() => {}}
      onSubmit={() => {}}
      disabled
      onCancel={() => {}}
    />,
  );

  for (const label of [/Họ và tên/, /Email/, /Số điện thoại/, /Chức danh/, /Phòng ban/]) {
    expect(screen.getByLabelText(label)).toBeDisabled();
  }
  expect(screen.getByRole('button', { name: /Lưu thay đổi/ })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Huỷ' })).toBeDisabled();
});

test('custom labels and onCancel', () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(
    <ProfileForm
      value={value}
      onChange={() => {}}
      onSubmit={onSubmit}
      onCancel={onCancel}
      displayNameLabel="Tên"
      emailLabel="Thư điện tử"
      phoneLabel="Điện thoại"
      jobTitleLabel="Vị trí"
      departmentLabel="Bộ phận"
      submitLabel="Cập nhật"
      cancelLabel="Bỏ"
    />,
  );

  for (const label of [/Tên/, /Thư điện tử/, /Điện thoại/, /Vị trí/, /Bộ phận/]) {
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  }

  fireEvent.click(screen.getByRole('button', { name: 'Bỏ' }));

  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
});

test('no onCancel renders no cancel button', () => {
  render(<ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} />);

  expect(screen.queryByRole('button', { name: 'Huỷ' })).toBeNull();
  expect(screen.getAllByRole('button')).toHaveLength(1);
});

test('avatar and avatarHint render, and an omitted avatar leaves no wrapper', () => {
  const { container, rerender } = render(
    <ProfileForm
      value={value}
      onChange={() => {}}
      onSubmit={() => {}}
      avatar={<span data-testid="avatar">NA</span>}
      avatarHint="PNG hoặc JPG, tối đa 2 MB."
    />,
  );

  expect(screen.getByTestId('avatar')).toBeVisible();
  expect(screen.getByText('PNG hoặc JPG, tối đa 2 MB.')).toBeInTheDocument();
  const form = container.querySelector('form') as HTMLFormElement;
  expect(form.children).toHaveLength(3); // avatar + grid + footer

  rerender(<ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} />);

  expect(screen.queryByTestId('avatar')).toBeNull();
  expect(screen.queryByText('PNG hoặc JPG, tối đa 2 MB.')).toBeNull();
  // The avatar wrapper goes with it instead of leaving an empty box behind.
  expect(form.children).toHaveLength(2); // grid + footer
});

test('className merges on the form and the form is named', () => {
  const { container } = render(
    <ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} className="custom" />,
  );

  const form = container.querySelector('form');
  expect(form).toHaveClass('custom');
  expect(form).toHaveAttribute('aria-label', 'Hồ sơ cá nhân');
  expect(screen.getByRole('form', { name: 'Hồ sơ cá nhân' })).toBe(form);
});

test('a caller-supplied aria-label renames the form', () => {
  render(
    <ProfileForm
      value={value}
      onChange={() => {}}
      onSubmit={() => {}}
      aria-label="Thông tin nhân sự"
    />,
  );

  expect(screen.getByRole('form', { name: 'Thông tin nhân sự' })).toBeInTheDocument();
  expect(screen.queryByRole('form', { name: 'Hồ sơ cá nhân' })).toBeNull();
});

test('an empty error message renders no alert', () => {
  render(
    <ProfileForm value={value} onChange={() => {}} onSubmit={() => {}} errors={{ email: '' }} />,
  );

  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByLabelText(/Email/)).not.toHaveAttribute('aria-invalid');
});
