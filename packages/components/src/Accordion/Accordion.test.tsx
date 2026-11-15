import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
import { Accordion } from './Accordion';

const css = readFileSync(join(import.meta.dirname, 'Accordion.module.css'), 'utf8');

const items = [
  { id: 'general', title: 'Thông tin chung', content: <p>Nội dung chung</p> },
  { id: 'billing', title: 'Thanh toán', content: <p>Nội dung thanh toán</p> },
  { id: 'locked', title: 'Bảo mật', content: <p>Nội dung bảo mật</p>, disabled: true },
];

test('renders one trigger per item linked to a persistent region', () => {
  render(<Accordion items={items} />);
  const triggers = screen.getAllByRole('button');
  expect(triggers).toHaveLength(3);
  for (const trigger of triggers) {
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    expect(panel).toHaveAttribute('hidden');
  }
  expect(document.querySelectorAll('h3')).toHaveLength(3);
  expect(screen.getByText('Nội dung chung')).toBeInTheDocument();
});

test('clicking opens and closes a single panel', () => {
  const onChange = vi.fn();
  render(<Accordion items={items} onChange={onChange} />);
  const trigger = screen.getByRole('button', { name: 'Thông tin chung' });
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(document.getElementById(trigger.getAttribute('aria-controls')!)).not.toHaveAttribute(
    'hidden',
  );
  expect(onChange).toHaveBeenLastCalledWith('general');
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(onChange).toHaveBeenLastCalledWith(null);
});

test('single mode closes the previously open item', () => {
  render(<Accordion items={items} defaultValue="general" />);
  fireEvent.click(screen.getByRole('button', { name: 'Thanh toán' }));
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('multiple mode keeps panels open and emits item-order ids', () => {
  const onChange = vi.fn();
  render(<Accordion multiple items={items} onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thanh toán' }));
  fireEvent.click(screen.getByRole('button', { name: 'Thông tin chung' }));
  expect(onChange).toHaveBeenLastCalledWith(['general', 'billing']);
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('controlled single and multiple values win over clicks', () => {
  const onChange = vi.fn();
  const { rerender } = render(<Accordion items={items} value="general" onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thanh toán' }));
  expect(onChange).toHaveBeenCalledWith('billing');
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );

  rerender(<Accordion multiple items={items} values={['billing']} onChange={onChange} />);
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('unknown seeded ids open nothing; a controlled disabled item opens but cannot toggle', () => {
  const { rerender } = render(<Accordion items={items} defaultValue="ghost" />);
  for (const trigger of screen.getAllByRole('button')) {
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
  rerender(<Accordion items={items} value="locked" />);
  const locked = screen.getByRole('button', { name: 'Bảo mật' });
  expect(locked).toBeDisabled();
  expect(locked).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(locked);
  expect(locked).toHaveAttribute('aria-expanded', 'true');
});

test('Up/Down/Home/End move focus between enabled headers, wrap, and ignore IME', () => {
  render(<Accordion items={items} />);
  const general = screen.getByRole('button', { name: 'Thông tin chung' });
  const billing = screen.getByRole('button', { name: 'Thanh toán' });
  general.focus();
  fireEvent.keyDown(general, { key: 'ArrowDown' });
  expect(document.activeElement).toBe(billing);
  fireEvent.keyDown(billing, { key: 'ArrowDown' });
  expect(document.activeElement).toBe(general); // skips disabled 'locked' and wraps
  fireEvent.keyDown(general, { key: 'End' });
  expect(document.activeElement).toBe(billing);
  fireEvent.keyDown(billing, { key: 'Home' });
  expect(document.activeElement).toBe(general);
  fireEvent.keyDown(general, { key: 'ArrowDown', keyCode: 229 });
  expect(document.activeElement).toBe(general);
});

test('headingLevel defaults to h3 and follows the prop', () => {
  const { container, rerender } = render(<Accordion items={items} />);
  expect(container.querySelectorAll('h3')).toHaveLength(3);
  rerender(<Accordion items={items} headingLevel={2} />);
  expect(container.querySelectorAll('h2')).toHaveLength(3);
});

test('collapsing keeps panel content mounted', () => {
  render(
    <Accordion
      items={[{ id: 'note', title: 'Ghi chú', content: <input aria-label="Ghi chú" /> }]}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Ghi chú' }));
  const input = () => screen.getByRole('textbox', { name: 'Ghi chú', hidden: true });
  fireEvent.change(input(), { target: { value: 'giữ trạng thái' } });
  fireEvent.click(screen.getByRole('button', { name: 'Ghi chú' }));
  expect(input()).toHaveValue('giữ trạng thái');
});

test('items=[] renders nothing', () => {
  const { container } = render(<Accordion items={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test('className, id and rest props land on the root', () => {
  render(<Accordion items={items} id="settings" className="extra" data-testid="acc" />);
  const root = screen.getByTestId('acc');
  expect(root).toHaveAttribute('id', 'settings');
  expect(root).toHaveClass('extra');
});

test('children are rejected at the type level and never rendered', () => {
  render(
    // @ts-expect-error children are deliberately omitted from Accordion props.
    <Accordion items={items}>Thừa</Accordion>,
  );
  expect(screen.queryByText('Thừa')).toBeNull();
});

test('module CSS pins the frame, trigger states, chevron, panel and sizes', () => {
  expect(cssRule(css, '.root')).toMatch(/border:\s*1px solid var\(--border\)/);
  expect(cssRule(css, '.root')).toMatch(/border-radius:\s*var\(--radius-lg\)/);
  expect(cssRule(css, '.item + .item')).toMatch(/border-top:\s*1px solid var\(--border\)/);
  expect(cssRule(css, '.trigger:hover:not(:disabled)')).toMatch(
    /background:\s*var\(--surface-muted\)/,
  );
  expect(cssRule(css, '.trigger:focus-visible')).toMatch(
    /outline:\s*2px solid var\(--focus-ring\)/,
  );
  expect(cssRule(css, ".trigger[aria-expanded='true'] .chevron")).toMatch(
    /transform:\s*rotate\(180deg\)/,
  );
  expect(cssRule(css, '.panel[hidden]')).toMatch(/display:\s*none/);
  expect(cssRule(css, ".root[data-size='sm']")).toContain('--ac-pad-x');
  expect(cssRule(css, ".root[data-size='md']")).toContain('--ac-pad-x');
});
