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
