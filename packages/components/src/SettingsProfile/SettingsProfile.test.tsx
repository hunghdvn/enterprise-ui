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
    'true',
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
    'true',
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
    'true',
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

test('a section description renders under its heading and describes the region', () => {
  render(<SettingsProfile sections={sections} />);

  const region = screen.getByRole('region', { name: 'Thông tin cá nhân' });
  const paragraph = within(region).getByText('Ảnh và thông tin liên hệ.');
  expect(paragraph).toBeInTheDocument();

  // The heading names the region; the description is supplementary context, so it
  // must reach assistive tech through aria-describedby rather than be read linearly.
  const describedBy = region.getAttribute('aria-describedby');
  expect(describedBy).toBeTruthy();
  expect(describedBy).toBe(paragraph.id);

  // A section without a description does not point at anything that is not there.
  // (The pane is inactive here, so it is out of the a11y tree — read the DOM.)
  const { container } = render(<SettingsProfile sections={sections} />);
  const withoutDescription = container.querySelectorAll('section')[2];
  expect(withoutDescription).not.toHaveAttribute('aria-describedby');
  // No stray description node of its own (its body content may still contain <p>).
  expect(withoutDescription.querySelector('[id$="-description"]')).toBeNull();
});

test('a key with whitespace still names its region', () => {
  // aria-labelledby is a space-separated id list: building the id from the raw key makes
  // `aria-labelledby=":r1:-account settings"` resolve to two ids that do not exist, which
  // costs the section its name and its `region` role.
  render(
    <SettingsProfile
      sections={[{ key: 'account settings', label: 'Cài đặt tài khoản', content: <p>x</p> }]}
    />,
  );

  const region = screen.getByRole('region', { name: 'Cài đặt tài khoản' });
  const labelledBy = region.getAttribute('aria-labelledby') as string;
  expect(labelledBy).not.toContain(' ');
  expect(document.getElementById(labelledBy)).toBe(region.querySelector('h2, h3'));
});

test('a "privacy" pane and a "privacy-description" sibling get distinct ids', () => {
  // Key-based ids share one namespace: `${paneId}-description` for `privacy` lands on the
  // same id as the pane of `privacy-description`, so one label resolves to the other's node.
  render(
    <SettingsProfile
      sections={[
        { key: 'privacy', label: 'Quyền riêng tư', description: 'Ai xem được.', content: <p>a</p> },
        { key: 'privacy-description', label: 'Mô tả', content: <p>b</p> },
      ]}
    />,
  );

  const ids = Array.from(document.querySelectorAll('[id]'), (el) => el.id);
  expect(new Set(ids).size).toBe(ids.length);

  const privacy = screen.getByRole('region', { name: 'Quyền riêng tư' });
  const descriptionId = privacy.getAttribute('aria-describedby') as string;
  expect(document.getElementById(descriptionId)).toHaveTextContent('Ai xem được.');
});

test('a removed active section resets the internal state instead of springing back', () => {
  const initial: SettingsSection[] = [
    { key: 'profile', label: 'Hồ sơ', content: <p>a</p> },
    { key: 'security', label: 'Bảo mật', content: <p>b</p> },
  ];
  const { rerender } = render(<SettingsProfile sections={initial} defaultActiveKey="security" />);
  expect(screen.getByRole('region', { name: 'Bảo mật' })).toBeInTheDocument();

  // Drop the active section: the view falls back to the first one…
  rerender(
    <SettingsProfile
      sections={[{ key: 'profile', label: 'Hồ sơ', content: <p>a</p> }]}
      defaultActiveKey="security"
    />,
  );
  expect(screen.getByRole('region', { name: 'Hồ sơ' })).toBeInTheDocument();

  // …and the state follows it, so bringing the section back does not steal the view
  // without a user action.
  rerender(<SettingsProfile sections={initial} defaultActiveKey="security" />);
  expect(screen.getByRole('region', { name: 'Hồ sơ' })).toBeInTheDocument();
});

test('a removed active section notifies a controlled caller', () => {
  const onSectionChange = vi.fn();
  const { rerender } = render(
    <SettingsProfile
      sections={[
        { key: 'profile', label: 'Hồ sơ', content: <p>a</p> },
        { key: 'security', label: 'Bảo mật', content: <p>b</p> },
      ]}
      activeKey="security"
      onSectionChange={onSectionChange}
    />,
  );

  rerender(
    <SettingsProfile
      sections={[{ key: 'profile', label: 'Hồ sơ', content: <p>a</p> }]}
      activeKey="security"
      onSectionChange={onSectionChange}
    />,
  );

  // Otherwise the caller's activeKey (URL sync, save-on-leave) keeps pointing at a
  // section that is not on screen.
  expect(onSectionChange).toHaveBeenCalledWith('profile');
});

test('the nav centres the active item even when it sits away from the page edge', () => {
  const proto = HTMLElement.prototype;
  const saved = Object.fromEntries(
    ['scrollWidth', 'clientWidth', 'scrollLeft', 'offsetLeft', 'offsetWidth'].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(proto, key),
    ]),
  );
  const savedRect = Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect');

  // jsdom has no layout, so supply the numbers the effect reads. The nav sits 293px from
  // the page edge (the docs frame) and is already scrolled 100px, so the active item's
  // body-relative `offsetLeft` is 713 while its rect left is 293 + 420 - 100 = 613.
  //
  // Reading offsets instead of rects mixes coordinate systems: `offsetLeft` counts from
  // the offsetParent (<body>, since nothing positions the nav), so a 160px nav scrolled
  // to its maximum and left the button at -1px in the browser.
  let scrollLeft = 100;
  const rect = (left: number, width: number) =>
    ({ left, width, right: left + width, top: 0, height: 0, bottom: 0, x: left, y: 0 }) as DOMRect;
  Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: Element) {
      if (this.tagName === 'NAV') return rect(293, 200);
      if (this.getAttribute('aria-current') === 'true') return rect(293 + 420 - scrollLeft, 120);
      return rect(0, 0);
    },
  });
  Object.defineProperty(proto, 'scrollWidth', { configurable: true, get: () => 600 });
  Object.defineProperty(proto, 'clientWidth', { configurable: true, get: () => 200 });
  Object.defineProperty(proto, 'offsetLeft', { configurable: true, get: () => 713 });
  Object.defineProperty(proto, 'offsetWidth', { configurable: true, get: () => 120 });
  Object.defineProperty(proto, 'scrollLeft', {
    configurable: true,
    get: () => scrollLeft,
    set: (value: number) => {
      scrollLeft = value;
    },
  });
  try {
    render(
      <SettingsProfile
        sections={[
          { key: 'a', label: 'A', content: <p>a</p> },
          { key: 'b', label: 'B', content: <p>b</p> },
        ]}
        defaultActiveKey="b"
      />,
    );

    // Target: the item (420px into the content, 120px wide) centred in a 200px viewport
    // → 420 - (200 - 120) / 2 = 380. The offsetLeft read produced 673, and assigning the
    // delta instead of adding it produced 280.
    expect(screen.getByRole('navigation', { name: 'Mục cài đặt' }).scrollLeft).toBe(380);
  } finally {
    if (savedRect) Object.defineProperty(Element.prototype, 'getBoundingClientRect', savedRect);
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(proto, key, descriptor);
      else delete (proto as unknown as Record<string, unknown>)[key];
    }
  }
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

test('renders a custom title, subtitle and header actions', () => {
  render(
    <SettingsProfile
      title="Tài khoản"
      subtitle="Quản lý hồ sơ và bảo mật."
      actions={<button type="button">Xuất dữ liệu</button>}
      sections={sections}
    />,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Tài khoản' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Cài đặt' })).toBeNull();
  expect(screen.getByText('Quản lý hồ sơ và bảo mật.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Xuất dữ liệu' })).toBeInTheDocument();
});

test('an omitted subtitle and actions leave no empty wrapper', () => {
  const { container } = render(<SettingsProfile sections={sections} />);

  const header = container.querySelector('header') as HTMLElement;
  // heading only: no stray subtitle paragraph, no margin-only action row
  expect(header.children).toHaveLength(1);
  expect(header.querySelector('p')).toBeNull();
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

test('the root is a main landmark by default, because AppShell renders a div', () => {
  // Spec §4.1 used to claim AppShell already renders <main>; AppShell.tsx renders
  // <div className={styles.main}> / <div className={styles.body}>. A template dropped in
  // there must therefore supply the landmark itself, or skip-to-main finds nothing.
  render(<SettingsProfile sections={sections} />);

  const main = screen.getByRole('main');
  expect(main).toHaveAccessibleName('Cài đặt');
});

test('the template header sits inside the main landmark, not at the top level', () => {
  const { container } = render(<SettingsProfile sections={sections} />);

  // HTML-AAM: a <header> whose nearest ancestor is `main` maps to generic, not `banner`,
  // so it cannot collide with AppShell's own site header (axe
  // landmark-no-duplicate-banner). jsdom maps every <header> to `banner` regardless of
  // scope, so pin the structure that produces the mapping rather than the role.
  const header = container.querySelector('header') as HTMLElement;
  expect(header.parentElement?.tagName).toBe('MAIN');
  expect(container.querySelectorAll(':scope > header')).toHaveLength(0);
});

test('as="div" renders no landmark, for a page that already has a main', () => {
  const { container } = render(
    <main>
      <SettingsProfile as="div" sections={sections} />
    </main>,
  );

  // Exactly the caller's main: nesting a second one would be invalid HTML.
  expect(screen.getAllByRole('main')).toHaveLength(1);
  // A bare div has role=generic, and ARIA 1.2 forbids aria-labelledby on it.
  const root = container.querySelector('main')?.firstElementChild as HTMLElement;
  expect(root).not.toHaveAttribute('aria-labelledby');
  expect(root.tagName).toBe('DIV');
});

test('as="section" is a named region', () => {
  render(<SettingsProfile as="section" sections={sections} />);

  expect(screen.getByRole('region', { name: 'Cài đặt' })).toBeInTheDocument();
  expect(screen.queryByRole('main')).toBeNull();
});

test('the layout is a container query, never a media query', () => {
  expect(css).toContain('container-type: inline-size');
  expect(css).toContain('@container (min-width: 768px)');
  expect(css).not.toContain('@media');
});

test('the root is border-box, so it cannot overflow a padded shell', () => {
  // §4.2: the template must not force a horizontal scrollbar inside AppShell's body.
  expect(css).toMatch(/\.root\s*\{[^}]*box-sizing:\s*border-box/);
  expect(css).toMatch(/\.root\s*\{[^}]*min-width:\s*0/);
});

test('the narrow nav keeps a reachable overflow affordance', () => {
  // Hiding the bar entirely left clipped sections unreachable for a vertical-only wheel.
  expect(css).toMatch(/\.nav\s*\{[^}]*scrollbar-width:\s*thin/);
  expect(css).not.toContain('.nav::-webkit-scrollbar');
});

test('long labels wrap in the wide rail instead of spilling over the pane', () => {
  expect(css).toMatch(/\.navItem\s*\{[^}]*white-space:\s*nowrap/);
  // The 220px column re-enables wrapping and breaks long words.
  expect(css).toMatch(/@container[^{]*\{[\s\S]*\.navItem\s*\{[^}]*white-space:\s*normal/);
  expect(css).toMatch(/@container[^{]*\{[\s\S]*\.navItem\s*\{[^}]*overflow-wrap:\s*anywhere/);
});

test('the active cue follows the nav orientation', () => {
  // Narrow row: an underline. Wide rail: a left bar. A left border in the row would
  // butt against the previous item instead of reading as "selected".
  expect(css).toMatch(/\.navItem\s*\{[^}]*border-bottom:\s*3px solid transparent/);
  expect(css).toMatch(/\.navItem\[data-active='true'\]\s*\{[^}]*border-bottom-color/);
  expect(css).toMatch(
    /@container[^{]*\{[\s\S]*\.navItem\s*\{[^}]*border-left:\s*3px solid transparent/,
  );
  expect(css).toMatch(
    /@container[^{]*\{[\s\S]*\.navItem\[data-active='true'\]\s*\{[^}]*border-left-color/,
  );
});
