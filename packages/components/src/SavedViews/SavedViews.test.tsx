import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
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
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveTextContent('Views');
});

test('trigger shows the active view label', () => {
  render(<SavedViews views={views} activeId="v2" onApply={() => {}} onSave={() => {}} />);
  expect(screen.getByRole('combobox', { name: 'Saved views' })).toHaveTextContent(
    'An Phát tháng 10',
  );
});

test('open lists all views and marks the active one', () => {
  render(<SavedViews views={views} activeId="v2" onApply={() => {}} onSave={() => {}} />);
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);
  expect(options[1]).toHaveAttribute('aria-selected', 'true');
  expect(options[0]).toHaveAttribute('aria-selected', 'false');
});

test('clicking an option applies it and closes', () => {
  const onApply = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={onApply} onSave={() => {}} />);
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
  fireEvent.click(screen.getByText('Giá trị cao'));
  expect(onApply).toHaveBeenCalledWith('v3');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('save row: typing + Enter reports onSave and closes', () => {
  const onSave = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={onSave} />);
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
  const input = screen.getByPlaceholderText('Tên view...');
  fireEvent.change(input, { target: { value: 'Q4 mới' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onSave).toHaveBeenCalledWith('Q4 mới');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('save button disabled while the draft trims empty; click saves', () => {
  const onSave = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={onSave} />);
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
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
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
  fireEvent.click(screen.getByRole('button', { name: 'Xóa An Phát tháng 10' }));
  expect(onDelete).toHaveBeenCalledWith('v2');
  expect(onApply).not.toHaveBeenCalled();
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('empty views shows a non-selectable empty state', () => {
  render(<SavedViews views={[]} activeId={null} onApply={() => {}} onSave={() => {}} />);
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
  expect(screen.queryAllByRole('option')).toHaveLength(0);
  expect(screen.getByText('Chưa có view nào')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Tên view...')).toBeInTheDocument();
});

test('keyboard: ArrowDown opens + moves highlight, Enter applies, ArrowUp wraps', () => {
  const onApply = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={onApply} onSave={() => {}} />);
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  expect(trigger).toHaveAttribute('role', 'combobox'); // APG select-only pattern (#4)
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

test('#1 deleting the highlighted-last row clamps: Enter is a safe no-op', () => {
  const onApply = vi.fn();
  function DeleteHarness() {
    const [list, setList] = useState(views);
    return (
      <SavedViews
        views={list}
        activeId={null}
        onApply={onApply}
        onSave={() => {}}
        onDelete={(id) => setList(list.filter((v) => v.id !== id))}
      />
    );
  }
  render(<DeleteHarness />);
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  fireEvent.click(trigger);
  const options = screen.getAllByRole('option');
  fireEvent.pointerEnter(options[2]); // highlight the LAST row (h=2)
  fireEvent.click(screen.getByRole('button', { name: 'Xóa Giá trị cao' })); // list → 2
  // Pre-fix: highlightedIndex stayed 2 → Enter dereferenced views[2] and
  // threw, and activedescendant dangled on option-2. The clamp fixes both —
  // asserted while the popover is still open.
  const listId = trigger.getAttribute('aria-controls');
  expect(trigger.getAttribute('aria-activedescendant')).toBe(`${listId}-option-1`);
  // Enter then applies the row now AT the clamped index (v2) and closes the
  // popover (single-apply flow) — a crash here is the regression.
  fireEvent.keyDown(trigger, { key: 'Enter' });
  expect(onApply).toHaveBeenCalledWith('v2');
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#3 Escape closes from the delete button and the save input too', () => {
  render(
    <SavedViews
      views={views}
      activeId={null}
      onApply={() => {}}
      onSave={() => {}}
      onDelete={() => {}}
    />,
  );
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  fireEvent.click(trigger);
  const remove = screen.getByRole('button', { name: 'Xóa Đơn chờ duyệt' });
  fireEvent.keyDown(remove, { key: 'Escape' }); // focus on a row action
  expect(screen.queryByRole('listbox')).toBeNull();
  fireEvent.click(trigger);
  fireEvent.change(screen.getByPlaceholderText('Tên view...'), { target: { value: 'x' } });
  fireEvent.keyDown(screen.getByPlaceholderText('Tên view...'), { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('#6 clicking non-focusable chrome keeps the popover and the draft', () => {
  const onSave = vi.fn();
  render(<SavedViews views={[]} activeId={null} onApply={() => {}} onSave={onSave} />);
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
  const input = screen.getByPlaceholderText('Tên view...');
  fireEvent.change(input, { target: { value: 'Q4' } });
  // Mousedown on the empty-state chrome (non-focusable): focus falls to body,
  // but the same-gesture guard must keep the popover and the draft alive.
  fireEvent.mouseDown(screen.getByText('Chưa có view nào'));
  fireEvent.focusOut(input);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(input).toHaveValue('Q4');
  expect(onSave).not.toHaveBeenCalled();
});

test('#7 a window resize re-places the popover from the fresh rect', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  Object.defineProperty(trigger, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 700, bottom: 732, left: 10, width: 120 }) as DOMRect,
  });
  const originalInner = window.innerHeight;
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
  try {
    fireEvent.click(trigger);
    const popover = screen.getByRole('listbox').parentElement as HTMLElement;
    expect(popover.style.top).toBe('736px'); // fresh rect: 732 + 4
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 760 });
    fireEvent.resize(window);
    // Fresh re-place at the smaller viewport flips the popover above:
    // 3 × 32 + 48 = 144 → top = 700 - 144 - 4 = 552.
    expect(popover.style.top).toBe('552px');
  } finally {
    delete (trigger as { getBoundingClientRect?: unknown }).getBoundingClientRect;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInner });
  }
});

test('#5 the highlighted option is scrolled into view', () => {
  const original = Element.prototype.scrollIntoView;
  const spy = vi.fn();
  (Element.prototype as unknown as { scrollIntoView?: unknown }).scrollIntoView = spy;
  try {
    render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
    const trigger = screen.getByRole('combobox', { name: 'Saved views' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // open, h=0
    fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // h=1
    expect(spy).toHaveBeenCalled();
    const call = spy.mock.calls[0][0] as ScrollIntoViewOptions;
    expect(call.block).toBe('nearest');
  } finally {
    if (original) {
      (Element.prototype as unknown as { scrollIntoView: unknown }).scrollIntoView = original;
    } else {
      delete (Element.prototype as unknown as { scrollIntoView?: unknown }).scrollIntoView;
    }
  }
});

test('#9 flipping disabled while open blocks apply and save', () => {
  const onApply = vi.fn();
  const onSave = vi.fn();
  function ToggleHarness() {
    const [disabled, setDisabled] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setDisabled(true)}>
          disable
        </button>
        <SavedViews
          views={views}
          activeId={null}
          onApply={onApply}
          onSave={onSave}
          disabled={disabled}
        />
      </>
    );
  }
  const { rerender } = render(<ToggleHarness />);
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  // Real browsers always precede click with mousedown — fire both so the
  // same-gesture focusout guard sees the press inside the widget.
  fireEvent.mouseDown(trigger);
  fireEvent.click(trigger); // open
  // Flipping disabled blurs the trigger and CLOSES the popover — a disabled
  // widget must not keep an interactive popover open. Either way, nothing
  // may be applied or saved afterwards (review #23 #9).
  rerender(
    <>
      <button type="button" onClick={() => setDisabled(true)}>
        disable
      </button>
      <SavedViews views={views} activeId={null} onApply={onApply} onSave={onSave} disabled />
    </>,
  );
  expect(screen.queryByRole('listbox')).toBeNull();
  expect(onApply).not.toHaveBeenCalled();
  expect(onSave).not.toHaveBeenCalled();
});

test('Escape closes the popover', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  fireEvent.click(trigger);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.keyDown(trigger, { key: 'Escape' });
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('clicking outside closes the popover', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  fireEvent.click(trigger);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  expect(screen.queryByRole('listbox')).toBeNull();
});

test('scrolling inside the popover does not close it', () => {
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={() => {}} />);
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
  fireEvent.click(trigger);
  const list = screen.getByRole('listbox');
  fireEvent.scroll(list);
  expect(screen.getByRole('listbox')).toBeInTheDocument();
});

test('IME composition does not save or close from the save input', () => {
  const onSave = vi.fn();
  render(<SavedViews views={views} activeId={null} onApply={() => {}} onSave={onSave} />);
  fireEvent.click(screen.getByRole('combobox', { name: 'Saved views' }));
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
  const trigger = screen.getByRole('combobox', { name: 'Saved views' });
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
