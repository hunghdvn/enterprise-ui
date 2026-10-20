import { fireEvent, render, screen } from '@testing-library/react';
import { SavedViews } from './SavedViews';
import type { SavedView } from './types';

type Filters = { search: string; status: string };

const views: SavedView<Filters>[] = [
  { id: 'v1', label: 'Đơn chờ duyệt', value: { search: '', status: 'pending' } },
  { id: 'v2', label: 'An Phát tháng 10', value: { search: 'an phát', status: '' } },
  { id: 'v3', label: 'Giá trị cao', value: { search: '', status: 'done' } },
];

test('renders a closed trigger with the generic label', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Views' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('trigger shows the active view label', () => {
  render(<SavedViews views={views} activeId="v2" onApply={() => {}} onSave={() => {}} />);
  expect(screen.getByRole('button', { name: 'An Phát tháng 10' })).toBeInTheDocument();
});

test('open lists all views and marks the active one', () => {
  render(<SavedViews views={views} activeId="v2" onApply={() => {}} onSave={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'An Phát tháng 10' }));
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);
  expect(options[1]).toHaveAttribute('aria-selected', 'true');
  expect(options[0]).toHaveAttribute('aria-selected', 'false');
});

test('clicking an option applies it and closes', () => {
  const onApply = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={onApply} onSave={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Views' }));
  fireEvent.click(screen.getByText('Giá trị cao'));
  expect(onApply).toHaveBeenCalledWith('v3');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('save row: typing + Enter reports onSave and closes', () => {
  const onSave = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={onSave} />);
  fireEvent.click(screen.getByRole('button', { name: 'Views' }));
  const input = screen.getByPlaceholderText('Tên view...');
  fireEvent.change(input, { target: { value: 'Q4 mới' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onSave).toHaveBeenCalledWith('Q4 mới');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('save button disabled while the draft trims empty; click saves', () => {
  const onSave = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={onSave} />);
  fireEvent.click(screen.getByRole('button', { name: 'Views' }));
  const saveBtn = screen.getByRole('button', { name: 'Lưu view hiện tại' });
  expect(saveBtn).toBeDisabled();
  fireEvent.change(screen.getByPlaceholderText('Tên view...'), { target: { value: '  ' } });
  expect(saveBtn).toBeDisabled();
  fireEvent.change(screen.getByPlaceholderText('Tên view...'), { target: { value: 'Của tôi' } });
  expect(saveBtn).toBeEnabled();
  fireEvent.click(saveBtn);
  expect(onSave).toHaveBeenCalledWith('Của tôi');
});

test('delete reports onDelete without closing or applying', () => {
  const onApply = vi.fn();
  const onDelete = vi.fn();
  render(
    <SavedViews
      views={views}
      activeId={null}
      onApply={onApply}
      onSave={() => {}}
      onDelete={onDelete}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Views' }));
  fireEvent.click(screen.getByRole('button', { name: 'Xóa An Phát tháng 10' }));
  expect(onDelete).toHaveBeenCalledWith('v2');
  expect(onApply).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('empty views shows a non-selectable empty state', () => {
  render(<SavedViews views={[]} activeId={null} onApply={() => {}} onSave={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Views' }));
  expect(screen.queryAllByRole('option')).toHaveLength(0);
  expect(screen.getByText('Chưa có view nào')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Tên view...')).toBeInTheDocument();
});

test('keyboard: ArrowDown opens + moves highlight, Enter applies, ArrowUp wraps', () => {
  const onApply = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={onApply} onSave={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Views' });
  fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // open, h=0
  fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // h=1
  const listId = trigger.getAttribute('aria-controls');
  expect(trigger.getAttribute('aria-activedescendant')).toBe(`${listId}-option-1`);
  fireEvent.keyDown(trigger, { key: 'Enter' });
  expect(onApply).toHaveBeenCalledWith('v2');
  // Reopen; ArrowUp from the no-highlight start lands on the LAST option.
  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, { key: 'ArrowUp' });
  expect(trigger.getAttribute('aria-activedescendant')).toBe(`${listId}-option-2`);
});

test('Escape closes the popover', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Views' });
  fireEvent.click(trigger);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.keyDown(trigger, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('clicking outside closes the popover', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Views' });
  fireEvent.click(trigger);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('scrolling inside the popover does not close it', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Views' });
  fireEvent.click(trigger);
  const list = screen.getByRole('listbox');
  fireEvent.scroll(list);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('IME composition does not save or close from the save input', () => {
  const onSave = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={onSave} />);
  fireEvent.click(screen.getByRole('button', { name: 'Views' }));
  const input = screen.getByPlaceholderText('Tên view...');
  const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'isComposing', { value: true });
  fireEvent(input, ev);
  expect(onSave).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('disabled: trigger is disabled and never opens', () => {
  render(
    <SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} disabled />,
  );
  const trigger = screen.getByRole('button', { name: 'Views' });
  expect(trigger).toBeDisabled();
  fireEvent.click(trigger);
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('warns on duplicate view ids (dev-only)', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    render(
      <SavedViews
        views={[...views, { id: 'v1', label: 'Trùng', value: { search: '', status: '' } }]}
        activeId={null}
        onApply={() => {}}
        onSave={() => {}}
      />,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate view id "v1"'));
  } finally {
    warn.mockRestore();
  }
});

test('popover is positioned fixed and flips when it would overflow', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('button', { name: 'Views' });
  Object.defineProperty(trigger, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 700, bottom: 732, left: 10, width: 120 }) as DOMRect,
  });
  const originalInner = window.innerHeight;
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 760 });
  try {
    fireEvent.click(trigger);
    const list = screen.getByRole('listbox');
    expect(list).toHaveStyle({ position: 'fixed' });
    // 3 rows × 32 + 48 chrome = 144; space below = 760 - 732 - 4 = 24 < 144
    // → flip above: top = 700 - 144 - 4 = 552.
    expect(list.style.top).toBe('552px');
  } finally {
    delete (trigger as { getBoundingClientRect?: unknown }).getBoundingClientRect;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInner });
  }
});
