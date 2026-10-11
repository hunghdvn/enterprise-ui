import { fireEvent, render, screen } from '@testing-library/react';
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
