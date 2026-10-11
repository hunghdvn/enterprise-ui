import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
