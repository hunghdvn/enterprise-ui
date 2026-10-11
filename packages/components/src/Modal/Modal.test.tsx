import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Drawer } from '../Drawer/Drawer';
import { Modal } from './Modal';

test('renders nothing when closed', () => {
  const { container } = render(
    <Modal open={false} onClose={() => {}} title="Tạo đơn">
      <span>Nội dung</span>
    </Modal>,
  );
  expect(container).toBeEmptyDOMElement();
});

test('renders dialog, closes on Esc and overlay, returns focus', () => {
  const onClose = vi.fn();
  render(
    <>
      <button autoFocus>Trigger</button>
      <Modal open onClose={onClose} title="Tạo đơn">
        <button>Lưu</button>
      </Modal>
    </>,
  );
  expect(screen.getByRole('dialog', { name: 'Tạo đơn' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByTestId('modal-overlay'));
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('focus trap wraps, skips hidden controls, pulls outside focus inside', async () => {
  render(
    <>
      <button>Outside</button>
      <Modal open onClose={() => {}} title="Tạo đơn">
        <button>Một</button>
        <button>Hai</button>
        <button style={{ display: 'none' }}>Ẩn</button>
      </Modal>
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

test('focus trap ignores controls hidden by an ancestor wrapper', async () => {
  render(
    <>
      <button>Outside</button>
      <Modal open onClose={() => {}} title="Tạo đơn">
        <button>Lưu</button>
        <div style={{ display: 'none' }}>
          <button>Trong nhóm display none</button>
        </div>
        <div hidden>
          <button>Theo thuộc tính hidden</button>
        </div>
      </Modal>
    </>,
  );
  const close = screen.getByRole('button', { name: 'Đóng' });
  const save = screen.getByRole('button', { name: 'Lưu' });
  const outside = screen.getByRole('button', { name: 'Outside' });
  await waitFor(() => expect(close).toHaveFocus());

  // Both descendants are unreachable (their ancestors are display:none), so
  // they must not act as trap boundaries in either direction.
  close.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(save).toHaveFocus();
  save.focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(close).toHaveFocus();

  // Containment target is the last *visible* control.
  outside.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(save).toHaveFocus();
});

test('keeps focus + overflow across onClose identity change while open', async () => {
  const { rerender } = render(
    <Modal open onClose={() => {}} title="Tạo đơn">
      <button>Lưu</button>
    </Modal>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Tạo đơn' });
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  expect(document.body.style.overflow).toBe('hidden');
  // Rerender with a new inline onClose fn (new identity) while still open.
  rerender(
    <Modal
      open
      onClose={() => {
        // new identity
      }}
      title="Tạo đơn"
    >
      <button>Lưu</button>
    </Modal>,
  );
  const dialogAfter = screen.getByRole('dialog', { name: 'Tạo đơn' });
  expect(document.body.style.overflow).toBe('hidden');
  expect(dialogAfter.contains(document.activeElement)).toBe(true);
});

test('only the topmost stacked dialog closes on Escape', () => {
  const onCloseModal = vi.fn();
  const onCloseDrawer = vi.fn();
  render(
    <Modal open onClose={onCloseModal} title="Tạo đơn">
      <Drawer open onClose={onCloseDrawer} title="Bộ lọc">
        <button>Áp dụng</button>
      </Drawer>
    </Modal>,
  );
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onCloseDrawer).toHaveBeenCalledTimes(1);
  expect(onCloseModal).not.toHaveBeenCalled();
});

test('body scroll stays locked until the last stacked dialog closes', () => {
  const { rerender } = render(
    <Modal open onClose={() => {}} title="Tạo đơn">
      <Drawer open onClose={() => {}} title="Bộ lọc">
        <button>Áp dụng</button>
      </Drawer>
    </Modal>,
  );
  expect(document.body.style.overflow).toBe('hidden');

  rerender(
    <Modal open onClose={() => {}} title="Tạo đơn">
      <Drawer open={false} onClose={() => {}} title="Bộ lọc">
        <button>Áp dụng</button>
      </Drawer>
    </Modal>,
  );
  // The modal underneath is still open, so the body must stay locked.
  expect(document.body.style.overflow).toBe('hidden');

  rerender(
    <Modal open={false} onClose={() => {}} title="Tạo đơn">
      <Drawer open={false} onClose={() => {}} title="Bộ lọc">
        <button>Áp dụng</button>
      </Drawer>
    </Modal>,
  );
  expect(document.body.style.overflow).toBe('');
});
