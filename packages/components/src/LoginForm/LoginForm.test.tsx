import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import type { LoginFormValues } from './types';

const EMPTY: LoginFormValues = { email: '', password: '', remember: false };
const css = readFileSync(join(import.meta.dirname, 'LoginForm.module.css'), 'utf8');

function Harness({
  initial = EMPTY,
  onSubmit = () => {},
}: {
  initial?: LoginFormValues;
  onSubmit?: (value: LoginFormValues) => void;
}) {
  const [value, setValue] = useState(initial);
  return <LoginForm value={value} onChange={setValue} onSubmit={onSubmit} />;
}

test('renders labelled fields with password-manager hints and a named form', () => {
  render(<LoginForm value={EMPTY} onChange={() => {}} onSubmit={() => {}} />);

  const email = screen.getByRole('textbox', { name: 'Email' });
  expect(email).toHaveAttribute('type', 'email');
  expect(email).toHaveAttribute('name', 'email');
  expect(email).toHaveAttribute('autocomplete', 'username');
  expect(email).toHaveAttribute('inputmode', 'email');
  expect(email).toHaveAttribute('aria-required', 'true');

  const password = screen.getByLabelText(/Mật khẩu/);
  expect(password).toHaveAttribute('type', 'password');
  expect(password).toHaveAttribute('name', 'password');
  expect(password).toHaveAttribute('autocomplete', 'current-password');
  expect(password).toHaveAttribute('aria-required', 'true');

  expect(screen.getByRole('form', { name: 'Đăng nhập' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Đăng nhập' })).toHaveAttribute('type', 'submit');
  // A template must not steal focus from the page on mount.
  expect(document.activeElement).toBe(document.body);
});

test('reflects the controlled field and remember values', () => {
  render(
    <LoginForm
      value={{ email: 'an@congty.vn', password: 'secret', remember: true }}
      onChange={() => {}}
      onSubmit={() => {}}
    />,
  );

  expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('an@congty.vn');
  expect(screen.getByLabelText(/Mật khẩu/)).toHaveValue('secret');
  expect(screen.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' })).toBeChecked();
});

test('every edit emits the whole next value', () => {
  const onChange = vi.fn();
  render(
    <LoginForm
      value={{ email: 'an@congty.vn', password: 'secret', remember: true }}
      onChange={onChange}
      onSubmit={() => {}}
    />,
  );

  fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
    target: { value: 'binh@congty.vn' },
  });
  expect(onChange).toHaveBeenLastCalledWith({
    email: 'binh@congty.vn',
    password: 'secret',
    remember: true,
  });

  fireEvent.change(screen.getByLabelText(/Mật khẩu/), { target: { value: 'doi-mat-khau' } });
  expect(onChange).toHaveBeenLastCalledWith({
    email: 'an@congty.vn',
    password: 'doi-mat-khau',
    remember: true,
  });

  fireEvent.click(screen.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' }));
  expect(onChange).toHaveBeenLastCalledWith({
    email: 'an@congty.vn',
    password: 'secret',
    remember: false,
  });
});

test('submitting prevents the native submit and emits the current values', () => {
  const onSubmit = vi.fn();
  render(
    <Harness
      initial={{ email: 'an@congty.vn', password: 'secret', remember: true }}
      onSubmit={onSubmit}
    />,
  );

  // fireEvent returns false when the handler called preventDefault.
  expect(fireEvent.submit(screen.getByRole('form'))).toBe(false);
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'an@congty.vn',
    password: 'secret',
    remember: true,
  });
});

test('submits what is in the inputs when autofill bypasses onChange', () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  render(<LoginForm value={EMPTY} onChange={onChange} onSubmit={onSubmit} />);

  // Password managers and iOS autofill can write straight to the DOM without a React event.
  const email = screen.getByRole('textbox', { name: 'Email' }) as HTMLInputElement;
  const password = screen.getByLabelText(/Mật khẩu/) as HTMLInputElement;
  email.value = 'autofill@congty.vn';
  password.value = 'autofill-secret';

  fireEvent.submit(screen.getByRole('form'));

  const filled = { email: 'autofill@congty.vn', password: 'autofill-secret', remember: false };
  expect(onSubmit).toHaveBeenCalledWith(filled);
  // The caller is told about the DOM values, so its next render cannot clear them.
  expect(onChange).toHaveBeenCalledWith(filled);
});

test('a hidden remember checkbox keeps the controlled value on submit', () => {
  const onSubmit = vi.fn();
  render(
    <LoginForm
      value={{ email: 'an@congty.vn', password: 'secret', remember: true }}
      onChange={() => {}}
      onSubmit={onSubmit}
      showRemember={false}
    />,
  );

  fireEvent.submit(screen.getByRole('form'));
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'an@congty.vn',
    password: 'secret',
    remember: true,
  });
});

test('the submit button submits the form', () => {
  const onSubmit = vi.fn();
  render(
    <Harness
      initial={{ email: 'an@congty.vn', password: 'secret', remember: false }}
      onSubmit={onSubmit}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'an@congty.vn',
    password: 'secret',
    remember: false,
  });
});

test('ignores a submit while loading or disabled', () => {
  const onSubmit = vi.fn();
  const { rerender } = render(
    <LoginForm value={EMPTY} onChange={() => {}} onSubmit={onSubmit} loading />,
  );
  fireEvent.submit(screen.getByRole('form'));
  expect(onSubmit).not.toHaveBeenCalled();

  rerender(<LoginForm value={EMPTY} onChange={() => {}} onSubmit={onSubmit} disabled />);
  fireEvent.submit(screen.getByRole('form'));
  expect(onSubmit).not.toHaveBeenCalled();
});

test('shows a form-level error as an alert above the fields', () => {
  render(
    <LoginForm
      value={EMPTY}
      onChange={() => {}}
      onSubmit={() => {}}
      error="Email hoặc mật khẩu không đúng"
    />,
  );
  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Email hoặc mật khẩu không đúng');
  expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveAttribute('aria-invalid');
});

test('field errors wire aria-invalid and aria-describedby', () => {
  render(
    <LoginForm
      value={EMPTY}
      onChange={() => {}}
      onSubmit={() => {}}
      errors={{ email: 'Email không hợp lệ' }}
    />,
  );

  const email = screen.getByRole('textbox', { name: 'Email' });
  expect(email).toHaveAttribute('aria-invalid', 'true');
  const describedBy = email.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  expect(document.getElementById(describedBy as string)).toHaveTextContent('Email không hợp lệ');
  expect(screen.getByLabelText(/Mật khẩu/)).not.toHaveAttribute('aria-invalid');
});

test('loading marks the form and submit button busy and disables them', () => {
  render(<LoginForm value={EMPTY} onChange={() => {}} onSubmit={() => {}} loading />);

  expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'true');
  const button = screen.getByRole('button', { name: 'Đăng nhập' });
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toBeDisabled();
});

test('disabled disables every control without claiming to be busy', () => {
  render(<LoginForm value={EMPTY} onChange={() => {}} onSubmit={() => {}} disabled />);

  expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  expect(screen.getByLabelText(/Mật khẩu/)).toBeDisabled();
  expect(screen.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Đăng nhập' })).toBeDisabled();
  expect(screen.getByRole('form')).not.toHaveAttribute('aria-busy');
});

test('renders custom labels, an aria-label override and the forgot-password slot', () => {
  render(
    <LoginForm
      value={EMPTY}
      onChange={() => {}}
      onSubmit={() => {}}
      aria-label="Đăng nhập quản trị"
      emailLabel="Email công ty"
      passwordLabel="Mật khẩu công ty"
      rememberLabel="Duy trì đăng nhập"
      submitLabel="Vào hệ thống"
      forgotPassword={<a href="/forgot">Quên mật khẩu?</a>}
    />,
  );

  expect(screen.getByRole('form', { name: 'Đăng nhập quản trị' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Email công ty' })).toBeInTheDocument();
  expect(screen.getByLabelText(/Mật khẩu công ty/)).toBeInTheDocument();
  expect(screen.getByRole('checkbox', { name: 'Duy trì đăng nhập' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Vào hệ thống' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Quên mật khẩu?' })).toBeInTheDocument();
});

test('showRemember=false hides only the checkbox and keeps the forgot-password slot', () => {
  render(
    <LoginForm
      value={EMPTY}
      onChange={() => {}}
      onSubmit={() => {}}
      showRemember={false}
      forgotPassword={<a href="/forgot">Quên mật khẩu?</a>}
    />,
  );

  expect(screen.queryByRole('checkbox')).toBeNull();
  expect(screen.getByRole('link', { name: 'Quên mật khẩu?' })).toBeInTheDocument();
});

test('no remember row renders when both the checkbox and the forgot slot are absent', () => {
  const { container } = render(
    <LoginForm value={EMPTY} onChange={() => {}} onSubmit={() => {}} showRemember={false} />,
  );
  expect(container.querySelector('[class*="meta"]')).toBeNull();
});

test('children render after the form, so a plain SSO button cannot submit it', () => {
  const onSubmit = vi.fn();
  const startSso = vi.fn();
  render(
    <LoginForm value={EMPTY} onChange={() => {}} onSubmit={onSubmit}>
      <button onClick={startSso}>Đăng nhập bằng SSO</button>
    </LoginForm>,
  );

  const sso = screen.getByRole('button', { name: 'Đăng nhập bằng SSO' });
  expect(screen.getByRole('form')).not.toContainElement(sso);
  fireEvent.click(sso);
  expect(startSso).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
});

test('the forgot-password slot styles links and buttons alike', () => {
  expect(css).toContain('.forgot :is(a, button)');
  expect(css).toContain('font: inherit');
  expect(css).toContain('outline: 2px solid var(--focus-ring)');
});

test('error borders and icons use the theme-aware danger emphasis token', () => {
  expect(css).toContain('border: 1px solid var(--danger-emphasis)');
  expect(css).toMatch(/\.errorIcon\s*\{[^}]*color:\s*var\(--danger-emphasis\)/s);
});
