import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { cssBlock, cssRule } from '../internal/cssRule';
import { Descriptions } from './Descriptions';

const css = readFileSync(join(import.meta.dirname, 'Descriptions.module.css'), 'utf8');

test('renders one term/definition pair per item', () => {
  render(
    <Descriptions
      items={[
        { label: 'Email', value: 'an@example.com' },
        { label: 'Vai trò', value: 'Quản trị' },
      ]}
    />,
  );
  const list = document.querySelector('dl')!;
  expect(list.querySelectorAll('dt')).toHaveLength(2);
  expect(list.querySelectorAll('dd')).toHaveLength(2);
  expect(screen.getByText('Email').tagName).toBe('DT');
  expect(screen.getByText('an@example.com').tagName).toBe('DD');
});

test('defaults to two columns, horizontal layout and md size', () => {
  const { container } = render(<Descriptions items={[{ label: 'A', value: 'B' }]} />);
  const root = container.firstElementChild!;
  const list = container.querySelector('dl')!;
  expect(root).toHaveAttribute('data-size', 'md');
  expect(list).toHaveAttribute('data-columns', '2');
  expect(list).toHaveAttribute('data-layout', 'horizontal');
  expect(list).not.toHaveAttribute('data-bordered');
});

test('renders explicit columns, layout, borders and size', () => {
  const { container } = render(
    <Descriptions
      items={[{ label: 'A', value: 'B' }]}
      columns={3}
      layout="vertical"
      bordered
      size="sm"
    />,
  );
  expect(container.firstElementChild).toHaveAttribute('data-size', 'sm');
  const list = container.querySelector('dl')!;
  expect(list).toHaveAttribute('data-columns', '3');
  expect(list).toHaveAttribute('data-layout', 'vertical');
  expect(list).toHaveAttribute('data-bordered', 'true');
});

test('span sets a custom property and clamps to the column count', () => {
  const { container } = render(
    <Descriptions
      columns={2}
      items={[
        { label: 'A', value: '1', span: 2 },
        { label: 'B', value: '2', span: 9 },
        { label: 'C', value: '3', span: 0 },
        { label: 'D', value: '4', span: Number.NaN },
      ]}
    />,
  );
  const items = [...container.querySelectorAll('dl > div')] as HTMLElement[];
  expect(items.map((el) => el.style.getPropertyValue('--desc-span'))).toEqual(['2', '2', '1', '1']);
});

test('renders nothing when items is empty', () => {
  const { container } = render(<Descriptions items={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('exposes an aria name on role="group" only when labelled', () => {
  const { container, unmount } = render(
    <Descriptions items={[{ label: 'A', value: 'B' }]} aria-label="Thông tin khách hàng" />,
  );
  expect(screen.getByRole('group', { name: 'Thông tin khách hàng' })).toBeInTheDocument();
  expect(container.querySelector('dl')).not.toHaveAttribute('role');
  unmount();

  const labelledBy = render(
    <Descriptions items={[{ label: 'A', value: 'B' }]} aria-labelledby="customer-heading" />,
  );
  expect(labelledBy.container.firstElementChild).toHaveAttribute('role', 'group');
  expect(labelledBy.container.firstElementChild).toHaveAttribute(
    'aria-labelledby',
    'customer-heading',
  );
  labelledBy.unmount();

  const plain = render(<Descriptions items={[{ label: 'A', value: 'B' }]} />);
  expect(plain.container.firstElementChild).not.toHaveAttribute('role');
});

test('keeps row identity when items are inserted using keys', () => {
  const email = { key: 'email', label: 'Email', value: <input aria-label="email" /> };
  const name = { key: 'name', label: 'Tên', value: 'An' };
  const { rerender } = render(<Descriptions items={[email, name]} />);
  fireEvent.change(screen.getByLabelText('email'), { target: { value: 'a@b.c' } });

  rerender(<Descriptions items={[{ key: 'id', label: 'Mã', value: '1' }, email, name]} />);
  expect(screen.getByLabelText('email')).toHaveValue('a@b.c');
});

test('accepts a readonly items array', () => {
  const fields = [{ label: 'A', value: 'B' }] as const;
  render(<Descriptions items={fields} />);
  expect(screen.getByText('A')).toBeInTheDocument();
});

test('className and rest land on the root', () => {
  const { container } = render(
    <Descriptions items={[{ label: 'A', value: 'B' }]} className="pane" id="detail" />,
  );
  const root = container.firstElementChild!;
  expect(root).toHaveClass('pane');
  expect(root).toHaveAttribute('id', 'detail');
});

test('module CSS pins columns, container collapse, scoped sizes and borders', () => {
  const desktop = css.slice(0, css.indexOf('@container (max-width: 480px)'));
  expect(cssRule(css, ".list[data-columns='1']")).toMatch(
    /grid-template-columns:\s*minmax\(0, 1fr\)/,
  );
  expect(cssRule(css, ".list[data-columns='2']")).toMatch(/repeat\(2, minmax\(0, 1fr\)\)/);
  expect(cssRule(css, ".list[data-columns='3']")).toMatch(/repeat\(3, minmax\(0, 1fr\)\)/);
  expect(cssRule(desktop, '.item')).toMatch(/grid-column:\s*span var\(--desc-span, 1\)/);
  expect(cssRule(desktop, ".list[data-layout='horizontal'] > .item")).toMatch(
    /grid-template-columns:\s*minmax\(96px, 140px\) minmax\(0, 1fr\)/,
  );
  expect(cssRule(css, ".root[data-size='sm']")).toMatch(/--desc-label-size:\s*11px/);
  expect(cssRule(css, ".root[data-size='sm']")).toMatch(/--desc-value-size:\s*12px/);
  expect(cssRule(css, ".root[data-size='md']")).toMatch(/--desc-label-size:\s*12px/);
  expect(cssRule(css, ".root[data-size='md']")).toMatch(/--desc-value-size:\s*var\(--font-size\)/);
  expect(cssRule(css, '.label')).toMatch(/font-size:\s*var\(--desc-label-size\)/);
  expect(cssRule(css, '.value')).toMatch(/font-size:\s*var\(--desc-value-size\)/);
  expect(cssRule(css, ".list[data-bordered='true'] > .item")).toMatch(/border-right:/);
  expect(cssRule(css, '.root')).toMatch(/container-type:\s*inline-size/);
  expect(cssRule(css, '.root')).toMatch(/width:\s*100%/);
  const mobile = cssBlock(css, '@container (max-width: 480px)');
  expect(cssRule(mobile, '.list[data-columns]')).toMatch(
    /grid-template-columns:\s*minmax\(0, 1fr\)/,
  );
  expect(cssRule(mobile, ".list[data-layout='horizontal'] > .item")).toMatch(
    /grid-template-columns:\s*minmax\(0, 1fr\)/,
  );
  expect(cssRule(mobile, '.item')).toMatch(/grid-column:\s*auto/);
  expect(css).not.toMatch(/@media \(max-width: 480px\)/);
  expect(css).not.toMatch(/\.list\[data-layout='horizontal'\]\s+\.item/);
  expect(css).not.toMatch(/\.list\[data-bordered='true'\]\s+\.item/);
  expect(css).not.toMatch(/\.root\[data-size='(sm|md)'\]\s+\.(label|value)/);
  expect(css).not.toMatch(/^\[data-size='(sm|md)'\]/m);
});
