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
