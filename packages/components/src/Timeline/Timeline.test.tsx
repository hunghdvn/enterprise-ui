import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
import { Timeline } from './Timeline';

const css = readFileSync(join(import.meta.dirname, 'Timeline.module.css'), 'utf8');

const items = [
  {
    id: 'created',
    title: 'Tạo đơn',
    description: 'Nguyễn An tạo đơn hàng.',
    time: '12/11/2026 · 09:15',
    dateTime: '2026-11-12T09:15:00+07:00',
    tone: 'blue' as const,
    icon: 'file-plus' as const,
  },
  {
    id: 'shipped',
    title: 'Đã giao',
    time: '13/11/2026 · 14:30',
    tone: 'green' as const,
  },
];

test('renders a named ordered list with one item per event', () => {
  render(<Timeline items={items} />);
  expect(screen.getByRole('list', { name: 'Dòng thời gian' })).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByText('Tạo đơn')).toBeInTheDocument();
  expect(screen.getByText('Nguyễn An tạo đơn hàng.')).toBeInTheDocument();
});

test('time renders a real <time> with dateTime; ISO alone is not dumped', () => {
  const { container } = render(
    <>
      <Timeline items={[items[0]]} />
      <Timeline items={[{ id: 'x', title: 'Không giờ', dateTime: '2026-11-12T09:15:00+07:00' }]} />
    </>,
  );
  const time = screen.getByText('12/11/2026 · 09:15').closest('time')!;
  expect(time).toHaveAttribute('datetime', '2026-11-12T09:15:00+07:00');
  expect(container.textContent).not.toContain('2026-11-12T09:15:00+07:00');
  expect(container.querySelectorAll('time')).toHaveLength(1);
});

test('tone and icon land on the item; markers are decorative', () => {
  const { container } = render(<Timeline items={items} />);
  const [first, second] = screen.getAllByRole('listitem');
  expect(first).toHaveAttribute('data-tone', 'blue');
  expect(second).toHaveAttribute('data-tone', 'green');
  const firstMarker = first.querySelector('[aria-hidden="true"]')!;
  const secondMarker = second.querySelector('[aria-hidden="true"]')!;
  expect(firstMarker.tagName).toBe('SPAN');
  expect(firstMarker.querySelector('svg')).not.toBeNull();
  expect(secondMarker.tagName).toBe('SPAN');
  expect(secondMarker.querySelector('svg')).toBeNull();
  expect(container.querySelectorAll('li > [aria-hidden="true"]')).toHaveLength(2);
});

test('defaults to neutral and md, and rest/className land on the root', () => {
  const { container } = render(
    <Timeline items={[{ id: 'a', title: 'A' }]} className="custom" id="history" />,
  );
  const list = container.querySelector('ol')!;
  expect(list).toHaveAttribute('data-size', 'md');
  expect(list).not.toHaveAttribute('data-tone');
  expect(list).toHaveClass('custom');
  expect(list).toHaveAttribute('id', 'history');
  expect(screen.getByRole('listitem')).toHaveAttribute('data-tone', 'neutral');
});

test('size and custom aria-label apply to the list', () => {
  render(<Timeline items={items} size="sm" aria-label="Nhật ký" />);
  expect(screen.getByRole('list', { name: 'Nhật ký' })).toHaveAttribute('data-size', 'sm');
});

test('ReactNode title and description render; empty items renders nothing', () => {
  render(
    <Timeline
      items={[
        {
          id: 'a',
          title: <strong>Tiêu đề</strong>,
          description: <em>Mô tả</em>,
        },
      ]}
    />,
  );
  expect(screen.getByText('Tiêu đề').tagName).toBe('STRONG');
  expect(screen.getByText('Mô tả').tagName).toBe('EM');

  const { container } = render(<Timeline items={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('module CSS pins the list, connector, marker, wrapping and tone/size rules', () => {
  expect(cssRule(css, '.root')).toMatch(/list-style:\s*none/);
  expect(cssRule(css, '.item')).toMatch(/grid-template-columns/);
  expect(cssRule(css, '.item:not(:last-child)::before')).toMatch(/background:\s*var\(--border\)/);
  expect(cssRule(css, '.marker')).toMatch(/border-radius:\s*9999px/);
  expect(cssRule(css, '.marker')).toMatch(/border:\s*1px solid currentColor/);
  expect(cssRule(css, '.heading')).toMatch(/flex-wrap:\s*wrap/);
  expect(cssRule(css, '.title')).toMatch(/overflow-wrap:\s*anywhere/);
  for (const tone of ['blue', 'green', 'orange', 'red']) {
    expect(cssRule(css, `.item[data-tone='${tone}'] .marker`)).toMatch(/color:/);
  }
  expect(cssRule(css, ".root[data-size='sm']")).toContain('--tl-marker');
  expect(cssRule(css, ".root[data-size='md']")).toContain('--tl-marker');
});
