import { render, screen, waitFor } from '@testing-library/react';
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
