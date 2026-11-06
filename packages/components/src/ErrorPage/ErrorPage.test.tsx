import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
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

test('an unsupported status falls back to the 500 copy instead of throwing', () => {
  // Real call sites cast an API status: 502 must not take the error page down.
  render(<ErrorPage status={502 as never} />);

  expect(screen.getByText('502')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: 'Đã xảy ra lỗi' })).toBeInTheDocument();
  expect(screen.getByText(/Hệ thống gặp sự cố/)).toBeInTheDocument();
});

test('a route-level error is not an alert or a live region', () => {
  render(<ErrorPage status={500} />);
  expect(screen.queryByRole('alert')).toBeNull();
});

test('the heading is the label of the wrapper landmark', () => {
  render(<ErrorPage status={404} as="section" />);

  const region = screen.getByRole('region', { name: 'Không tìm thấy trang' });
  expect(region).toBeInTheDocument();
  expect(region.getAttribute('aria-labelledby')).toBe(
    screen.getByRole('heading').getAttribute('id'),
  );
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

test('description="" or null drops the paragraph wrapper entirely', () => {
  const { container, rerender } = render(<ErrorPage status={404} description="" icon={null} />);

  // The code is the only <p> left: no empty description paragraph, no empty icon circle.
  expect(container.querySelectorAll('p')).toHaveLength(1);
  expect(container.querySelector('[data-icon]')).toBeNull();
  expect(screen.getByText('404')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Không tìm thấy trang' })).toBeInTheDocument();

  // null hides too — only `undefined` means "use the status default".
  rerender(<ErrorPage status={404} description={null} />);
  expect(screen.queryByText(DEFAULTS[1][3])).toBeNull();
});

test('null, empty and true titles all fall back to the status default', () => {
  const { rerender } = render(<ErrorPage status={403} title={null} />);
  expect(screen.getByRole('heading', { name: 'Không có quyền truy cập' })).toBeInTheDocument();

  // A missing i18n key arrives as '' and must not render an empty <h1>.
  rerender(<ErrorPage status={403} title="" />);
  expect(screen.getByRole('heading', { name: 'Không có quyền truy cập' })).toBeInTheDocument();

  rerender(<ErrorPage status={403} title={true} />);
  expect(screen.getByRole('heading', { name: 'Không có quyền truy cập' })).toBeInTheDocument();
});

test('renders the title at the requested heading level', () => {
  const { rerender } = render(<ErrorPage status={500} level={2} />);
  expect(screen.getByRole('heading', { level: 2, name: 'Đã xảy ra lỗi' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull();

  // Inside a modal whose title is already an h2, the page title drops to h3.
  rerender(<ErrorPage status={500} level={3} />);
  expect(screen.getByRole('heading', { level: 3, name: 'Đã xảy ra lỗi' })).toBeInTheDocument();
});

test('as="div" drops the main landmark and fill={false} opts out of the viewport height', () => {
  const { container, rerender } = render(<ErrorPage status={404} />);
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(container.firstElementChild).toHaveAttribute('data-fill', 'true');

  rerender(<ErrorPage status={404} as="div" fill={false} />);
  expect(screen.queryByRole('main')).toBeNull();
  expect(container.firstElementChild).toHaveAttribute('data-fill', 'false');
  expect(container.firstElementChild?.tagName).toBe('DIV');
});

test('a falsy or empty-list actions slot renders no wrapper', () => {
  const { container, rerender } = render(<ErrorPage status={404} />);
  expect(container.querySelector('[class*="actions"]')).toBeNull();

  // `0` must not fall through as text inside the wrapper.
  rerender(<ErrorPage status={404} actions={0} />);
  expect(container.querySelector('[class*="actions"]')).toBeNull();
  expect(screen.queryByText('0')).toBeNull();

  // `options.map(...)` on an empty list is the realistic case: no stray margin row.
  rerender(<ErrorPage status={404} actions={[]} />);
  expect(container.querySelector('[class*="actions"]')).toBeNull();
});

test('the wrapper is border-box so a full-page error does not always scroll', () => {
  const root = cssRule(css, '.root');
  expect(root).toContain('box-sizing: border-box');
  expect(root).toContain('padding: 32px 20px');
});

test('fill actually sets the viewport height', () => {
  const fill = cssRule(css, ".root[data-fill='true']");
  expect(fill).toContain('min-height: 100dvh');
  expect(fill).toContain('min-height: 100vh');
});

test('the narrow layout follows the container width, not the viewport', () => {
  expect(css).toContain('container-type: inline-size');
  expect(css).toContain('@container (max-width: 480px)');
  expect(css).not.toContain('@media');
});

test('500 uses the theme-aware danger cue; 403/404 stay informational', () => {
  // Read the base rules only: cssRule returns the last match, and the container
  // query legitimately re-declares `.code`/`.title` (font-size, no colour).
  const base = css.split('@container')[0];

  expect(cssRule(base, '.icon')).toContain('var(--action-text)');
  expect(cssRule(base, '.code')).toContain('var(--action-text)');

  // Read the shared body of the 500 selector list and assert the status code is covered too —
  // the icon alone turning red would leave the number in the informational blue.
  const danger = cssRule(css, ".root[data-status='500'] .code");
  expect(danger).toContain('var(--danger-emphasis)');
  expect(cssRule(css, ".root[data-status='500'] .icon")).toBe(danger);
});
