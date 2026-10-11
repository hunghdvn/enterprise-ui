import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Drawer } from './Drawer';

test('focus trap ignores controls hidden by an ancestor wrapper', async () => {
  render(
    <>
      <button>Outside</button>
      <Drawer open onClose={() => {}} title="Bộ lọc">
        <button>Áp dụng</button>
        <div style={{ display: 'none' }}>
          <button>Trong nhóm display none</button>
        </div>
        <div hidden>
          <button>Theo thuộc tính hidden</button>
        </div>
      </Drawer>
    </>,
  );
  const close = screen.getByRole('button', { name: 'Đóng' });
  const apply = screen.getByRole('button', { name: 'Áp dụng' });
  const outside = screen.getByRole('button', { name: 'Outside' });
  await waitFor(() => expect(close).toHaveFocus());

  // Both descendants are unreachable (their ancestors are display:none), so
  // they must not act as trap boundaries in either direction.
  close.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(apply).toHaveFocus();
  apply.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();

  // Containment target is the last *visible* control.
  outside.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(apply).toHaveFocus();
});

test('keeps focus + overflow across onClose identity change while open', async () => {
  const { rerender } = render(
    <Drawer open onClose={() => {}} title="Bộ lọc">
      <button>Áp dụng</button>
    </Drawer>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Bộ lọc' });
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  expect(document.body.style.overflow).toBe('hidden');
  rerender(
    <Drawer
      open
      onClose={() => {
        // new identity
      }}
      title="Bộ lọc"
    >
      <button>Áp dụng</button>
    </Drawer>,
  );
  const dialogAfter = screen.getByRole('dialog', { name: 'Bộ lọc' });
  expect(document.body.style.overflow).toBe('hidden');
  expect(dialogAfter.contains(document.activeElement)).toBe(true);
});

test('focus trap wraps, skips hidden controls, pulls outside focus inside', async () => {
  render(
    <>
      <button>Outside</button>
      <Drawer open onClose={() => {}} title="Bộ lọc">
        <button>Một</button>
        <button>Hai</button>
        <button style={{ display: 'none' }}>Ẩn</button>
      </Drawer>
    </>,
  );
  const close = screen.getByRole('button', { name: 'Đóng' });
  const one = screen.getByRole('button', { name: 'Một' });
  const two = screen.getByRole('button', { name: 'Hai' });
  const outside = screen.getByRole('button', { name: 'Outside' });
  // Let the mount auto-focus timer settle so it cannot race manual focus.
  await waitFor(() => expect(close).toHaveFocus());

  // (a) Tab on last wraps to first. The trailing display:none button must not
  // count as last (old filter would leave focus stuck on Hai).
  two.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();

  // (b) Shift+Tab on first wraps to last.
  close.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(two).toHaveFocus();

  // (c) hidden control is never a wrap target in either direction.
  two.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();
  close.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(two).toHaveFocus();

  // (d) focus outside the panel is pulled inside (containment).
  outside.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();
  outside.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(two).toHaveFocus();

  // Middle Tab does not wrap.
  one.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(one).toHaveFocus();
});

test('Tab contained when the panel itself holds focus', async () => {
  render(
    <>
      <button>Outside</button>
      <Drawer open onClose={() => {}} title="Bộ lọc">
        <button>Một</button>
        <button>Hai</button>
      </Drawer>
    </>,
  );
  const panel = screen.getByRole('dialog', { name: 'Bộ lọc' });
  const close = screen.getByRole('button', { name: 'Đóng' });
  const two = screen.getByRole('button', { name: 'Hai' });
  await waitFor(() => expect(close).toHaveFocus());

  // Clicking the panel padding focuses the panel itself. It is neither the
  // first nor the last control, so only the escape check keeps Tab in.
  panel.focus();
  expect(panel).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(two).toHaveFocus();

  panel.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();
});

test('a press that starts inside the panel does not close on the overlay', () => {
  const onClose = vi.fn();
  render(
    <Drawer open onClose={onClose} title="Bộ lọc">
      <button>Áp dụng</button>
    </Drawer>,
  );
  const overlay = screen.getByTestId('drawer-overlay');
  const apply = screen.getByRole('button', { name: 'Áp dụng' });

  // Pressing a control and releasing on the overlay still fires a click whose
  // target is the overlay (its nearest common ancestor with the press target):
  // only where the press started may decide whether the dialog closes.
  fireEvent.mouseDown(apply);
  fireEvent.mouseUp(overlay);
  fireEvent.click(overlay);
  expect(onClose).not.toHaveBeenCalled();

  // A press that starts on the overlay itself does close.
  fireEvent.mouseDown(overlay);
  fireEvent.click(overlay);
  expect(onClose).toHaveBeenCalledTimes(1);
});
