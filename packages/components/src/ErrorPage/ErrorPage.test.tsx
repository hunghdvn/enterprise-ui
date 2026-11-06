import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { ErrorPage } from './ErrorPage';

const css = readFileSync(join(import.meta.dirname, 'ErrorPage.module.css'), 'utf8');

const DEFAULTS = [
  [
    403,
    'lock',
    'Không có quyền truy cập',
    'Bạn không có quyền truy cập trang này. Liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.',
  ],
  [
    404,
    'search',
    'Không tìm thấy trang',
    'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.',
  ],
  [
    500,
    'alert-triangle',
    'Đã xảy ra lỗi',
    'Hệ thống gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại sau ít phút.',
  ],
] as const;

test.each(DEFAULTS)(
  'status %s renders the default copy and icon',
  (status, icon, title, description) => {
    const { container } = render(<ErrorPage status={status} />);

    expect(container.firstElementChild).toHaveAttribute('data-status', String(status));
    expect(screen.getByText(String(status))).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(container.querySelector(`[data-icon="${icon}"]`)).not.toBeNull();
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
);

test('a route-level error is not an alert or a live region', () => {
  render(<ErrorPage status={500} />);
  expect(screen.queryByRole('alert')).toBeNull();
});

test('overrides the copy, icon and actions and merges className', () => {
  const onClick = vi.fn();
  const { container } = render(
    <ErrorPage
      status={404}
      title="Trang đã được chuyển"
      description={<span>Thử lại từ trang chủ.</span>}
      icon={<svg data-testid="custom-icon" />}
      actions={<button onClick={onClick}>Về trang chủ</button>}
      className="custom"
    />,
  );

  expect(
    screen.getByRole('heading', { level: 1, name: 'Trang đã được chuyển' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Thử lại từ trang chủ.')).toBeInTheDocument();
  expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  expect(screen.queryByText('Không tìm thấy trang')).toBeNull();
  expect(container.querySelector('[data-icon="custom"]')).not.toBeNull();
  expect(container.firstElementChild).toHaveClass('custom');

  const action = screen.getByRole('button', { name: 'Về trang chủ' });
  fireEvent.click(action);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('description="" or null hides the paragraph and icon={null} hides the icon', () => {
  const { container, rerender } = render(<ErrorPage status={404} description="" icon={null} />);

  expect(screen.queryByText(DEFAULTS[1][3])).toBeNull();
  expect(container.querySelector('svg')).toBeNull();
  expect(screen.getByText('404')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeInTheDocument();

  // null hides too — only `undefined` means "use the status default".
  rerender(<ErrorPage status={404} description={null} />);
  expect(screen.queryByText(DEFAULTS[1][3])).toBeNull();
});

test('a null/empty title falls back to the status default', () => {
  render(<ErrorPage status={403} title={null} />);
  expect(screen.getByRole('heading', { name: 'Không có quyền truy cập' })).toBeInTheDocument();
});

test('renders the title at the requested heading level', () => {
  render(<ErrorPage status={500} level={2} />);
  expect(screen.getByRole('heading', { level: 2, name: 'Đã xảy ra lỗi' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
});

test('as="div" drops the main landmark and fill={false} opts out of the viewport height', () => {
  const { container, rerender } = render(<ErrorPage status={404} />);
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(container.firstElementChild).toHaveAttribute('data-fill', 'true');
  expect(css).toContain(".root[data-fill='true']");

  rerender(<ErrorPage status={404} as="div" fill={false} />);
  expect(screen.queryByRole('main')).toBeNull();
  expect(container.firstElementChild).toHaveAttribute('data-fill', 'false');
  expect(container.firstElementChild?.tagName).toBe('DIV');
});

test('no actions wrapper renders without actions, even for a falsy number', () => {
  const { container, rerender } = render(<ErrorPage status={404} />);
  expect(container.querySelector('[class*="actions"]')).toBeNull();

  // `0` must not fall through as text inside the wrapper.
  rerender(<ErrorPage status={404} actions={0} />);
  expect(container.querySelector('[class*="actions"]')).toBeNull();
  expect(screen.queryByText('0')).toBeNull();
});

test('the narrow layout follows the container width, not the viewport', () => {
  expect(css).toContain('container-type: inline-size');
  expect(css).toContain('@container (max-width: 480px)');
  expect(css).not.toContain('@media');
});

test('500 uses the theme-aware danger cue; 403/404 stay informational', () => {
  const icon = /\.icon\s*\{([^}]*)\}/s.exec(css)?.[1] ?? '';
  const code = /\.code\s*\{([^}]*)\}/s.exec(css)?.[1] ?? '';
  const danger = /\.root\[data-status='500'\]\s+\.icon,[\s\S]*?\{([^}]*)\}/s.exec(css)?.[1] ?? '';

  expect(icon).toContain('var(--action-text)');
  expect(code).toContain('var(--action-text)');
  expect(danger).toContain('var(--danger-emphasis)');
});
