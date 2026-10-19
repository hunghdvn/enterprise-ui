import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Combobox } from './Combobox';

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
];

function open(input: HTMLElement) {
  fireEvent.focus(input);
}

// ---- Task 1: control / chips ----
test('multiple shows a chip per selected value', () => {
  render(<Combobox multiple options={options} value={['a', 'c']} onChange={() => {}} />);
  expect(screen.getByText('Apple')).toBeInTheDocument();
  expect(screen.getByText('Cherry')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Xóa/i })).toHaveLength(2);
});

test('single shows one chip', () => {
  render(<Combobox options={options} value="b" onChange={() => {}} />);
  expect(screen.getByText('Banana')).toBeInTheDocument();
  expect(screen.queryByText('Apple')).toBeNull();
});

test('no value shows the placeholder and no chips', () => {
  render(<Combobox options={options} placeholder="Chọn..." onChange={() => {}} />);
  expect(screen.getByPlaceholderText('Chọn...')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Xóa/i })).toBeNull();
});

test('removing a chip calls onChange with the reduced value', () => {
  const onChange = vi.fn();
  render(<Combobox multiple options={options} value={['a', 'b']} onChange={onChange} />);
  fireEvent.click(screen.getAllByRole('button', { name: /Xóa/i })[0]);
  expect(onChange).toHaveBeenCalledWith(['b']);
});

test('controlled: value change updates chips', () => {
  const { rerender } = render(
    <Combobox multiple options={options} value={['a']} onChange={() => {}} />,
  );
  expect(screen.getByText('Apple')).toBeInTheDocument();
  rerender(<Combobox multiple options={options} value={['b']} onChange={() => {}} />);
  expect(screen.queryByText('Apple')).toBeNull();
  expect(screen.getByText('Banana')).toBeInTheDocument();
});

// ---- Task 2: popover + filter + select + keyboard + click-away ----
test('focus opens the popover showing all options', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  expect(input).not.toHaveAttribute('aria-expanded', 'true');
  open(input);
  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(3);
});

test('typing filters the option list', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.change(input, { target: { value: 'a' } });
  const opts = screen.getAllByRole('option');
  expect(opts).toHaveLength(2);
  expect(opts[0]).toHaveTextContent('Apple');
  expect(opts[1]).toHaveTextContent('Banana');
});

test('clicking an option selects it and closes (single)', () => {
  const onChange = vi.fn();
  render(<Combobox options={options} onChange={onChange} />);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.click(screen.getByText('Cherry'));
  expect(onChange).toHaveBeenCalledWith('c');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('Escape closes the popover', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.keyDown(input, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('ArrowDown opens then Enter selects the highlighted option', () => {
  const onChange = vi.fn();
  render(<Combobox options={options} onChange={onChange} />);
  const input = screen.getByRole('combobox');
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  // highlight on Apple (index 0); next ArrowDown moves to Banana (index 1)
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith('b');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('clicking outside closes the popover', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('option marked aria-selected for current value', () => {
  render(<Combobox options={options} value="b" onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  const list = screen.getByRole('listbox');
  const banana = within(list).getByText('Banana').closest('[role="option"]') as HTMLElement;
  expect(banana).toHaveAttribute('aria-selected', 'true');
  const apple = within(list).getByText('Apple').closest('[role="option"]') as HTMLElement;
  expect(apple).not.toHaveAttribute('aria-selected', 'true');
});

// ---- Task 3: multi-select toggle ----
function ControlledMulti({ initial }: { initial?: string[] }) {
  const [val, setVal] = useState<string[]>(initial ?? []);
  return (
    <Combobox multiple options={options} value={val} onChange={(v) => setVal(v as string[])} />
  );
}

test('multiple: selecting options adds chips', () => {
  render(<ControlledMulti initial={[]} />);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.click(within(screen.getByRole('listbox')).getByText('Apple'));
  fireEvent.click(within(screen.getByRole('listbox')).getByText('Cherry'));
  expect(screen.getAllByRole('button', { name: /Xóa/i })).toHaveLength(2);
});

test('multiple: clicking a selected option toggles it off', () => {
  render(<ControlledMulti initial={['a', 'c']} />);
  expect(screen.getAllByRole('button', { name: /Xóa/i })).toHaveLength(2);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.click(within(screen.getByRole('listbox')).getByText('Apple'));
  expect(screen.getAllByRole('button', { name: /Xóa/i })).toHaveLength(1);
});

// ---- Task 4: keyboard Backspace, disabled, scroll-close, positioning ----
test('Backspace on empty input removes the last chip', () => {
  render(<ControlledMulti initial={['a', 'b']} />);
  expect(screen.getAllByRole('button', { name: /Xóa/i })).toHaveLength(2);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.keyDown(input, { key: 'Backspace' });
  expect(screen.getAllByRole('button', { name: /Xóa/i })).toHaveLength(1);
});

test('disabled options cannot be selected', () => {
  const onChange = vi.fn();
  render(
    <Combobox
      options={[...options, { value: 'd', label: 'Disabled', disabled: true }]}
      onChange={onChange}
    />,
  );
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.click(within(screen.getByRole('listbox')).getByText('Disabled'));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeInTheDocument(); // stays open
});

test('scrolling closes the popover', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.scroll(window);
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('popover is positioned fixed below the control', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  expect(screen.getByRole('listbox')).toHaveStyle({ position: 'fixed' });
});

// ---- Round-2 regression coverage (findings #1–#15) ----

test('#1 mousedown on an option then click selects it (click-away containment)', () => {
  const onChange = vi.fn();
  render(<Combobox options={options} onChange={onChange} />);
  const input = screen.getByRole('combobox');
  open(input);
  const cherry = screen.getByText('Cherry');
  // The mousedown must NOT close the list first (it lands inside the widget
  // root) — only then does the click reach the option.
  fireEvent.mouseDown(cherry);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.click(cherry);
  expect(onChange).toHaveBeenCalledWith('c');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#2 Enter after typing selects the first filtered option', () => {
  const onChange = vi.fn();
  render(<Combobox options={options} onChange={onChange} />);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.change(input, { target: { value: 'a' } }); // [Apple, Banana], highlight 0
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith('a');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#3 scrolling inside the popover list does not close it', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  const list = screen.getByRole('listbox');
  fireEvent.scroll(list); // scroll origin is inside the widget root
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('#4 kebab class names apply: highlight uses option-highlighted', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  fireEvent.keyDown(input, { key: 'ArrowDown' }); // open, h=0
  fireEvent.keyDown(input, { key: 'ArrowDown' }); // h=1 (Banana)
  const banana = screen.getByText('Banana').closest('[role="option"]') as HTMLElement;
  expect(banana.className).toMatch(/option-highlighted/);
});

test('#5 searchable=false opens on control click (not on focus)', () => {
  render(<Combobox searchable={false} options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  fireEvent.focus(input);
  expect(screen.queryByRole('listbox')).toBeNull();
  fireEvent.mouseDown(input);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('#6 focus leaving the widget closes the popover (Tab/blur)', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.focusOut(input, { relatedTarget: document.body });
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#6 Escape from the input closes the popover', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.keyDown(input, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#8 aria-activedescendant tracks the highlight', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  fireEvent.keyDown(input, { key: 'ArrowDown' }); // open, h=0
  fireEvent.keyDown(input, { key: 'ArrowDown' }); // h=1
  const listId = input.getAttribute('aria-controls');
  expect(input.getAttribute('aria-activedescendant')).toBe(`${listId}-option-1`);
  // The referenced id must actually exist on the highlighted <li> (round-3
  // leftover: a dangling activedescendant would announce nothing).
  const active = document.getElementById(`${listId}-option-1`);
  expect(active).toHaveAttribute('role', 'option');
  expect(active).toHaveTextContent('Banana');
});

test('#8 filtering to no results shows a non-selectable empty state', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  fireEvent.change(input, { target: { value: 'zzz' } });
  expect(screen.queryAllByRole('option')).toHaveLength(0);
  expect(screen.getByText(/Không có kết quả/)).toBeInTheDocument();
});

test('#9 ArrowUp wraps from the first item to the last', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  fireEvent.keyDown(input, { key: 'ArrowDown' }); // open, h=0 (Apple)
  fireEvent.keyDown(input, { key: 'ArrowUp' }); // wraps to last (Cherry, idx 2)
  const listId = input.getAttribute('aria-controls');
  expect(input.getAttribute('aria-activedescendant')).toBe(`${listId}-option-2`);
});

test('#10 IME composition does not open the popover on ArrowDown', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  const ev = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'isComposing', { value: true });
  fireEvent(input, ev);
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#11 forwards id/name/aria-* props to the underlying input', () => {
  render(
    <Combobox
      options={options}
      id="country"
      name="country"
      aria-invalid
      aria-describedby="err"
      onChange={() => {}}
    />,
  );
  const input = screen.getByRole('combobox');
  expect(input).toHaveAttribute('id', 'country');
  expect(input).toHaveAttribute('name', 'country');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAttribute('aria-describedby', 'err');
});

test('#13 chip remove button is labeled with searchText, not [object Object]', () => {
  const richOptions = [{ value: 'a', label: <b>Apple</b>, searchText: 'apple' }];
  render(<Combobox options={richOptions} value="a" onChange={() => {}} />);
  const remove = screen.getByRole('button', { name: /Xóa/i });
  expect(remove).toHaveAttribute('aria-label', 'Xóa apple');
});

test('#14 warns on duplicate option values', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  render(<Combobox options={[...options, { value: 'a', label: 'Dup' }]} onChange={() => {}} />);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate option value'), 'Dup');
  warn.mockRestore();
});

test('#14 warns on empty-string option values', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  render(<Combobox options={[...options, { value: '', label: 'Blank' }]} onChange={() => {}} />);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('empty value'), 'Blank');
  warn.mockRestore();
});

// ---- Round-3 (New-A..E + partly-fixed follow-ups) ----

test('#A Enter with no highlight (-1) is a no-op, not a commit of the last option', () => {
  const onChange = vi.fn();
  render(<Combobox options={options} value="b" onChange={onChange} />);
  const input = screen.getByRole('combobox');
  open(input); // populated single select → openAt(-1), no highlight
  expect(input.getAttribute('aria-activedescendant')).toBeNull();
  const notCanceled = fireEvent.keyDown(input, { key: 'Enter' });
  // preventDefault still runs (no <form> submit) — the REVIEW-#2 half.
  expect(notCanceled).toBe(false);
  // safeIndex(-1) used to wrap onto the LAST option and commit it (New-A).
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeInTheDocument(); // stays open
});

test('#B consumer onFocus/onKeyDown compose with the widget handlers', () => {
  const onConsumerFocus = vi.fn();
  const onConsumerKeyDown = vi.fn();
  render(
    <Combobox
      options={options}
      onChange={() => {}}
      onFocus={onConsumerFocus}
      onKeyDown={onConsumerKeyDown}
    />,
  );
  const input = screen.getByRole('combobox');
  fireEvent.focus(input);
  expect(onConsumerFocus).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('listbox')).toBeInTheDocument(); // widget still opens
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(onConsumerKeyDown).toHaveBeenCalledTimes(1);
  // The widget still processed the key too: highlight moved to Banana.
  const listId = input.getAttribute('aria-controls');
  expect(input.getAttribute('aria-activedescendant')).toBe(`${listId}-option-1`);
});

test('#C pressing a chip remove button does not open the popover', () => {
  const onChange = vi.fn();
  render(<Combobox multiple options={options} value={['a']} onChange={onChange} />);
  const remove = screen.getByRole('button', { name: /Xóa Apple/i });
  fireEvent.mouseDown(remove);
  // Pre-fix the mousedown toggled the popover open (focus + openAt).
  expect(screen.queryByRole('listbox')).toBeNull();
  fireEvent.click(remove);
  expect(onChange).toHaveBeenCalledWith([]); // the click still removes the chip
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#E Escape closes the popover from a focused chip-remove button', () => {
  render(<Combobox multiple options={options} value={['a']} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  const remove = screen.getByRole('button', { name: /Xóa Apple/i });
  remove.focus(); // Shift+Tab lands here in real usage
  fireEvent.keyDown(remove, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#9 ArrowUp from the no-highlight state lands on the last option', () => {
  render(<Combobox options={options} value="b" onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  open(input); // openAt(-1)
  expect(input.getAttribute('aria-activedescendant')).toBeNull();
  fireEvent.keyDown(input, { key: 'ArrowUp' });
  const listId = input.getAttribute('aria-controls');
  // The reverted (i-1+n)%n from -1 lands on n-2 (Banana) — the wrap must
  // reach n-1 (Cherry).
  expect(input.getAttribute('aria-activedescendant')).toBe(`${listId}-option-2`);
});

test('#7 popover flips above when it would overflow the viewport', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  const control = input.parentElement as HTMLElement;
  Object.defineProperty(control, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 460, bottom: 500, left: 10, width: 200 }) as DOMRect,
  });
  const originalInner = window.innerHeight;
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 560 });
  try {
    open(input);
    // 3 rows × 32 + 10 chrome = 106; space below = 560 - 500 - 4 = 56 < 106
    // → flip: top = 460 - 106 - 4 = 350 (above, ONE gap, chrome counted).
    expect(screen.getByRole('listbox').style.top).toBe('350px');
  } finally {
    delete (control as { getBoundingClientRect?: unknown }).getBoundingClientRect;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInner });
  }
});

test('#7 popover sits one gap below when it fits, and re-places on resize', () => {
  render(<Combobox options={options} onChange={() => {}} />);
  const input = screen.getByRole('combobox');
  const control = input.parentElement as HTMLElement;
  Object.defineProperty(control, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 460, bottom: 500, left: 10, width: 200 }) as DOMRect,
  });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });
  try {
    open(input);
    expect(screen.getByRole('listbox').style.top).toBe('504px'); // 500 + 4
    // Resize while open → re-placed from the fresh rect (review #7).
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 560 });
    fireEvent(window, new Event('resize'));
    expect(screen.getByRole('listbox').style.top).toBe('350px'); // now above
  } finally {
    delete (control as { getBoundingClientRect?: unknown }).getBoundingClientRect;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });
  }
});

test('#10 IME composition does not close or select on Enter/Escape', () => {
  const onChange = vi.fn();
  render(<Combobox options={options} value="b" onChange={onChange} />);
  const input = screen.getByRole('combobox');
  open(input); // openAt(-1)
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  const enterEv = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  Object.defineProperty(enterEv, 'isComposing', { value: true });
  fireEvent(input, enterEv);
  const escEv = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  Object.defineProperty(escEv, 'isComposing', { value: true });
  fireEvent(input, escEv);
  // Composition wins: nothing committed, popover stays open.
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});
