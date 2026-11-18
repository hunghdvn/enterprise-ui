import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { cssBlock, cssRule } from '../internal/cssRule';
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

test('multiple mode closes an open panel when its header is clicked again', () => {
  const onChange = vi.fn();
  render(<Accordion multiple items={items} onChange={onChange} />);
  const general = screen.getByRole('button', { name: 'Thông tin chung' });
  fireEvent.click(general);
  expect(general).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(general);
  expect(general).toHaveAttribute('aria-expanded', 'false');
  expect(onChange).toHaveBeenLastCalledWith([]);
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

test('dropping the controlled prop falls back to the mount seed when controlled from mount', () => {
  const onChange = vi.fn();
  const { rerender } = render(<Accordion items={items} value="billing" onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông tin chung' }));
  expect(onChange).toHaveBeenCalledWith('general');
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );

  // The controlled click never wrote internal state, so removing `value` returns to
  // the mount seed (all closed), not to the panel the caller was last showing.
  rerender(<Accordion items={items} />);
  for (const trigger of screen.getAllByRole('button')) {
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
});

test('single mode falls back to the last internal state when value is dropped', () => {
  const { rerender } = render(<Accordion items={items} defaultValue="billing" />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông tin chung' }));
  // Internal state is now 'general', not the mount seed 'billing'.

  rerender(<Accordion items={items} value="locked" onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thanh toán' }));
  // Controlled click: no internal write (internal stays 'general').

  rerender(<Accordion items={items} />);
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(screen.getByRole('button', { name: 'Bảo mật' })).toHaveAttribute('aria-expanded', 'false');
});

test('multiple mode falls back to the last internal state when values is dropped', () => {
  const { rerender } = render(<Accordion multiple items={items} defaultValues={['billing']} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông tin chung' }));
  // Internal state is now ['general', 'billing'] — not the mount seed ['billing'].

  rerender(<Accordion multiple items={items} values={['locked']} onChange={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông tin chung' }));
  // Controlled click: the panels do not change and internal state must not be written.

  rerender(<Accordion multiple items={items} />);
  // The last internal state returns, not the controlled ['general', 'locked'].
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Bảo mật' })).toHaveAttribute('aria-expanded', 'false');
});

test('controlled multiple clicks report the next values but leave the panels alone', () => {
  const onChange = vi.fn();
  render(<Accordion multiple items={items} values={['billing']} onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Thông tin chung' }));
  expect(onChange).toHaveBeenLastCalledWith(['general', 'billing']);
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('uncontrolled seeds skip disabled and unknown items', () => {
  const single = render(<Accordion items={items} defaultValue="locked" />);
  for (const trigger of screen.getAllByRole('button')) {
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  }
  single.unmount();

  render(<Accordion multiple items={items} defaultValues={['locked', 'billing', 'ghost']} />);
  expect(screen.getByRole('button', { name: 'Bảo mật' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('an item that becomes disabled after mount keeps its open state', () => {
  const disabledGeneral = items.map((item) =>
    item.id === 'general' ? { ...item, disabled: true } : item,
  );

  const single = render(<Accordion items={items} defaultValue="general" />);
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  single.rerender(<Accordion items={disabledGeneral} />);
  const singleTrigger = screen.getByRole('button', { name: 'Thông tin chung' });
  expect(singleTrigger).toBeDisabled();
  expect(singleTrigger).toHaveAttribute('aria-expanded', 'true');
  single.unmount();

  const multi = render(<Accordion multiple items={items} defaultValues={['general']} />);
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  multi.rerender(<Accordion multiple items={disabledGeneral} />);
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('single mode prunes an open id that leaves items, even across items=[]', () => {
  const { rerender } = render(<Accordion items={items} defaultValue="billing" />);
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  rerender(<Accordion items={items.filter((item) => item.id !== 'billing')} />);
  expect(screen.queryByRole('button', { name: 'Thanh toán' })).toBeNull();
  rerender(<Accordion items={[]} />);
  rerender(<Accordion items={items} />);
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('multiple mode prunes ids that leave items and keeps the rest open', () => {
  const { rerender } = render(
    <Accordion multiple items={items} defaultValues={['general', 'billing']} />,
  );
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  rerender(<Accordion multiple items={items.filter((item) => item.id !== 'general')} />);
  rerender(<Accordion multiple items={items} />);
  expect(screen.getByRole('button', { name: 'Thông tin chung' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(screen.getByRole('button', { name: 'Thanh toán' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

test('duplicate item ids warn once per signature in development', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    const duplicateItems = [...items, { id: 'general', title: 'Trùng', content: <p>Trùng</p> }];
    const { rerender } = render(<Accordion items={duplicateItems} />);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate item id "general"'));
    rerender(<Accordion items={[...duplicateItems]} />);
    expect(warn).toHaveBeenCalledTimes(1);
  } finally {
    warn.mockRestore();
  }
});

test('duplicate item ids stay silent outside development', () => {
  vi.stubEnv('DEV', false);
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    render(
      <Accordion items={[...items, { id: 'general', title: 'Trùng', content: <p>Trùng</p> }]} />,
    );
    expect(warn).not.toHaveBeenCalled();
  } finally {
    warn.mockRestore();
    vi.unstubAllEnvs();
  }
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

test('ArrowUp moves focus up and wraps from the first to the last enabled header', () => {
  // Three enabled headers: with only two, ArrowUp and ArrowDown are indistinguishable.
  const keyboardItems = [
    { id: 'one', title: 'Một', content: <p>Một</p> },
    { id: 'two', title: 'Hai', content: <p>Hai</p> },
    { id: 'three', title: 'Ba', content: <p>Ba</p> },
  ];
  render(<Accordion items={keyboardItems} />);
  const [one, two, three] = screen.getAllByRole('button');
  three.focus();
  fireEvent.keyDown(three, { key: 'ArrowUp' });
  expect(document.activeElement).toBe(two);
  fireEvent.keyDown(two, { key: 'ArrowUp' });
  expect(document.activeElement).toBe(one);
  fireEvent.keyDown(one, { key: 'ArrowUp' });
  expect(document.activeElement).toBe(three); // wraps to the last
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

test('size lands on data-size and switches the density-driven header', () => {
  const { rerender } = render(<Accordion items={items} data-testid="acc" />);
  expect(screen.getByTestId('acc')).toHaveAttribute('data-size', 'md');
  rerender(<Accordion items={items} size="sm" data-testid="acc" />);
  expect(screen.getByTestId('acc')).toHaveAttribute('data-size', 'sm');
});

test('module CSS pins the frame, trigger states, chevron, panel, density and sizes', () => {
  expect(cssRule(css, '.root')).toMatch(/border:\s*1px solid var\(--border\)/);
  expect(cssRule(css, '.root')).toMatch(/border-radius:\s*var\(--radius-lg\)/);
  expect(cssRule(css, '.root')).toMatch(/background:\s*var\(--surface\)/);
  // `data-size` is always rendered, so the base title is a fallback — pin it anyway.
  expect(cssRule(css, '.root')).toMatch(/--ac-title:\s*var\(--font-size-md\)/);
  // Only Tooltip positions its popover absolutely; the root must not clip it.
  expect(cssRule(css, '.root')).not.toMatch(/overflow/);
  expect(cssRule(css, '.item + .item')).toMatch(/border-top:\s*1px solid var\(--border\)/);
  expect(cssRule(css, '.item:first-child .trigger')).toMatch(
    /border-top-left-radius:\s*calc\(var\(--radius-lg\) - 1px\)/,
  );
  expect(cssRule(css, ".item:last-child .trigger[aria-expanded='false']")).toMatch(
    /border-bottom-left-radius/,
  );
  expect(cssRule(css, '.item:last-child .panel')).toMatch(/border-bottom-left-radius/);
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
  // Header height tracks the density ramp instead of a fixed pixel box.
  expect(cssRule(css, '.trigger')).toMatch(/min-height:\s*var\(--input-h-lg\)/);
  expect(cssRule(css, ".root[data-size='sm'] .trigger")).toMatch(/min-height:\s*var\(--input-h\)/);
  expect(cssRule(css, ".root[data-size='md']")).toMatch(/--ac-title:\s*var\(--font-size-md\)/);
  expect(cssRule(css, ".root[data-size='sm']")).toMatch(/--ac-title:\s*var\(--font-size\)/);
  expect(cssRule(css, '.panel')).toMatch(/padding:\s*0 var\(--ac-pad-x\) var\(--ac-pad-y\)/);
  expect(cssBlock(css, '@media (prefers-reduced-motion: reduce)')).toMatch(/transition:\s*none/);
  expect(cssRule(css, ".root[data-size='sm']")).toContain('--ac-pad-x');
  expect(cssRule(css, ".root[data-size='md']")).toContain('--ac-pad-x');
});
