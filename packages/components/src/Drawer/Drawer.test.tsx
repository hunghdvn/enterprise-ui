import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Drawer } from './Drawer';

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
