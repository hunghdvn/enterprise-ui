import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { SettingsProfile } from './SettingsProfile';
import type { SettingsSection } from './types';

const css = readFileSync(join(import.meta.dirname, 'SettingsProfile.module.css'), 'utf8');

const sections: SettingsSection[] = [
  {
    key: 'profile',
    label: 'Thông tin cá nhân',
    description: 'Ảnh và thông tin liên hệ.',
    content: <p>Pane profile</p>,
  },
  { key: 'notifications', label: 'Thông báo', content: <p>Pane notifications</p> },
  { key: 'security', label: 'Bảo mật', content: <p>Pane security</p> },
];

test('renders the default title, the nav and the first pane', () => {
  render(<SettingsProfile sections={sections} />);

  expect(screen.getByRole('heading', { level: 1, name: 'Cài đặt' })).toBeInTheDocument();
  const nav = screen.getByRole('navigation', { name: 'Mục cài đặt' });
  expect(
    within(nav)
      .getAllByRole('button')
      .map((b) => b.textContent),
  ).toEqual(['Thông tin cá nhân', 'Thông báo', 'Bảo mật']);
  expect(within(nav).getByRole('button', { name: 'Thông tin cá nhân' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(screen.getByRole('region', { name: 'Thông tin cá nhân' })).toBeInTheDocument();
  expect(screen.getByText('Pane profile')).toBeVisible();
});

test('inactive panes stay mounted but hidden', () => {
  const { container } = render(<SettingsProfile sections={sections} />);

  const panes = container.querySelectorAll('section');
  expect(panes).toHaveLength(3);
  expect(panes[0]).not.toHaveAttribute('hidden');
  expect(panes[1]).toHaveAttribute('hidden');
  expect(panes[2]).toHaveAttribute('hidden');
  // Still mounted, so a half-typed value in it survives…
  expect(panes[1].textContent).toContain('Pane notifications');
  // …but out of the accessibility tree, so it is not a second region.
  expect(screen.queryByRole('region', { name: 'Thông báo' })).toBeNull();
  expect(screen.getAllByRole('region')).toHaveLength(1);
});

test('the hidden rule is real CSS, not just an attribute', () => {
  expect(css).toMatch(/\[hidden\]\s*\{\s*display:\s*none;?\s*\}/);
});

test('clicking a section switches the pane and moves aria-current', () => {
  render(<SettingsProfile sections={sections} />);

  fireEvent.click(screen.getByRole('button', { name: 'Bảo mật' }));

  expect(screen.getByRole('region', { name: 'Bảo mật' })).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'Thông tin cá nhân' })).toBeNull();
  const nav = screen.getByRole('navigation', { name: 'Mục cài đặt' });
  expect(within(nav).getByRole('button', { name: 'Bảo mật' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(
    within(nav)
      .getAllByRole('button')
      .filter((b) => b.hasAttribute('aria-current')),
  ).toHaveLength(1);
});

test('defaultActiveKey selects the opening section', () => {
  render(<SettingsProfile sections={sections} defaultActiveKey="security" />);

  expect(screen.getByRole('region', { name: 'Bảo mật' })).toBeInTheDocument();
  const nav = screen.getByRole('navigation', { name: 'Mục cài đặt' });
  expect(within(nav).getByRole('button', { name: 'Bảo mật' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('activeKey is controlled: clicking reports but does not switch', () => {
  const onSectionChange = vi.fn();
  // Start on a section that is NOT the uncontrolled default, or the assertion
  // cannot tell the prop apart from the internal state.
  render(
    <SettingsProfile sections={sections} activeKey="security" onSectionChange={onSectionChange} />,
  );

  expect(screen.getByRole('region', { name: 'Bảo mật' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Thông báo' }));

  expect(onSectionChange).toHaveBeenCalledWith('notifications');
  // The caller owns the switch: at this render the pane must not move on its own.
  expect(screen.getByRole('region', { name: 'Bảo mật' })).toBeInTheDocument();
});

test('a section description renders under its heading', () => {
  render(<SettingsProfile sections={sections} />);

  expect(
    within(screen.getByRole('region', { name: 'Thông tin cá nhân' })).getByText(
      'Ảnh và thông tin liên hệ.',
    ),
  ).toBeInTheDocument();
});

test('a value typed in one pane survives a section switch', () => {
  const withInput: SettingsSection[] = [
    { key: 'profile', label: 'Hồ sơ', content: <input aria-label="Tên hiển thị" /> },
    { key: 'other', label: 'Khác', content: <p>Khác</p> },
  ];
  render(<SettingsProfile sections={withInput} />);

  fireEvent.change(screen.getByLabelText('Tên hiển thị'), { target: { value: 'Nguyễn' } });
  fireEvent.click(screen.getByRole('button', { name: 'Khác' }));
  fireEvent.click(screen.getByRole('button', { name: 'Hồ sơ' }));

  expect(screen.getByLabelText('Tên hiển thị')).toHaveValue('Nguyễn');
});

test('an unknown activeKey falls back to the first section', () => {
  render(<SettingsProfile sections={sections} activeKey="missing" />);

  expect(screen.getByRole('region', { name: 'Thông tin cá nhân' })).toBeInTheDocument();
  expect(screen.queryByRole('region', { name: 'missing' })).toBeNull();
});

test('empty sections renders no nav and no pane', () => {
  const { container } = render(<SettingsProfile sections={[]} />);

  expect(screen.getByRole('heading', { level: 1, name: 'Cài đặt' })).toBeInTheDocument();
  expect(screen.queryByRole('navigation')).toBeNull();
  expect(screen.queryAllByRole('region')).toHaveLength(0);
  expect(container.querySelectorAll('section')).toHaveLength(0);
});

test('level={2} shifts the page and pane headings down one level', () => {
  render(<SettingsProfile sections={sections} level={2} />);

  expect(screen.getByRole('heading', { level: 2, name: 'Cài đặt' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 3, name: 'Thông tin cá nhân' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
});

test('navLabel renames the nav landmark and className merges', () => {
  const { container } = render(
    <SettingsProfile sections={sections} navLabel="Khu vực" className="custom" />,
  );

  expect(screen.getByRole('navigation', { name: 'Khu vực' })).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: 'Mục cài đặt' })).toBeNull();
  expect(container.firstElementChild).toHaveClass('custom');
});

test('the template renders no main landmark', () => {
  render(<SettingsProfile sections={sections} />);
  expect(screen.queryByRole('main')).toBeNull();
});

test('the layout is a container query, never a media query', () => {
  expect(css).toContain('container-type: inline-size');
  expect(css).toContain('@container (min-width: 768px)');
  expect(css).not.toContain('@media');
});
