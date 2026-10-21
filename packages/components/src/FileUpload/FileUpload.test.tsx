import { fireEvent, render, screen } from '@testing-library/react';
import { FileUpload } from './FileUpload';
import type { UploadedFile } from './types';

const files: UploadedFile[] = [
  { name: 'report.pdf', size: 1024, type: 'application/pdf' },
  { name: 'photo.png', size: 500_000, type: 'image/png' },
];

test('renders the drop zone with a button role', () => {
  render(<FileUpload files={[]} onSelect={() => {}} onRemove={() => {}} />);
  const zone = screen.getByRole('button', { name: /Kéo thả file vào đây/i });
  expect(zone).toBeInTheDocument();
  expect(screen.queryByRole('list')).toBeNull();
});

test('renders selected files with name, size and a remove button', () => {
  render(<FileUpload files={files} onSelect={() => {}} onRemove={() => {}} />);
  expect(screen.getByText('report.pdf')).toBeInTheDocument();
  expect(screen.getByText('1.0 KB · application/pdf')).toBeInTheDocument();
  expect(screen.getByText('photo.png')).toBeInTheDocument();
  expect(screen.getByText('488.3 KB · image/png')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Xóa/i })).toHaveLength(2);
});

test('clicking the zone opens the hidden file input', () => {
  render(<FileUpload files={[]} onSelect={() => {}} onRemove={() => {}} />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const click = vi.spyOn(input, 'click');
  fireEvent.click(screen.getByRole('button', { name: /Kéo thả file vào đây/i }));
  expect(click).toHaveBeenCalled();
  click.mockRestore();
});

test('selecting files reports them via onSelect', () => {
  const onSelect = vi.fn();
  render(<FileUpload files={[]} onSelect={onSelect} onRemove={() => {}} />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['x'], 'a.txt', { type: 'text/plain' });
  fireEvent.change(input, { target: { files: [file] } });
  expect(onSelect).toHaveBeenCalledWith([file]);
});

test('the same file can be selected twice (input resets)', () => {
  const onSelect = vi.fn();
  render(<FileUpload files={[]} onSelect={onSelect} onRemove={() => {}} />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['x'], 'a.txt', { type: 'text/plain' });
  fireEvent.change(input, { target: { files: [file] } });
  fireEvent.change(input, { target: { files: [file] } });
  expect(onSelect).toHaveBeenCalledTimes(2);
});

test('dropping files reports them via onSelect', () => {
  const onSelect = vi.fn();
  render(<FileUpload files={[]} onSelect={onSelect} onRemove={() => {}} />);
  const zone = screen.getByRole('button', { name: /Kéo thả file vào đây/i });
  const file = new File(['x'], 'b.pdf', { type: 'application/pdf' });
  fireEvent.drop(zone, { dataTransfer: { files: [file] } });
  expect(onSelect).toHaveBeenCalledWith([file]);
});

test('drag-over toggles the highlight and dragleave resets it', () => {
  render(<FileUpload files={[]} onSelect={() => {}} onRemove={() => {}} />);
  const zone = screen.getByRole('button', { name: /Kéo thả file vào đây/i });
  fireEvent.dragOver(zone);
  expect(zone.className).toMatch(/zone-active/);
  fireEvent.dragLeave(zone);
  expect(zone.className).not.toMatch(/zone-active/);
});

test('removing a file reports its index', () => {
  const onRemove = vi.fn();
  render(<FileUpload files={files} onSelect={() => {}} onRemove={onRemove} />);
  const remove = screen.getAllByRole('button', { name: /Xóa/i })[1];
  fireEvent.click(remove);
  expect(onRemove).toHaveBeenCalledWith(1);
});

test('disabled: zone is not activatable and does not report', () => {
  const onSelect = vi.fn();
  render(<FileUpload files={[]} onSelect={onSelect} onRemove={() => {}} disabled />);
  const zone = screen.getByRole('button', { name: /Kéo thả file vào đây/i });
  expect(zone).toHaveAttribute('aria-disabled', 'true');
  fireEvent.click(zone);
  fireEvent.drop(zone, { dataTransfer: { files: [new File(['x'], 'a.txt')] } });
  expect(onSelect).not.toHaveBeenCalled();
});

test('accept hint is shown when accept is provided', () => {
  render(<FileUpload files={[]} accept="image/*" onSelect={() => {}} onRemove={() => {}} />);
  expect(screen.getByText('Định dạng: image/*')).toBeInTheDocument();
});

test('the input carries accept and multiple attributes', () => {
  render(<FileUpload files={[]} accept=".pdf" multiple onSelect={() => {}} onRemove={() => {}} />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  expect(input.accept).toBe('.pdf');
  expect(input.multiple).toBe(true);
});

test('warns on duplicate file names (dev-only)', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    render(
      <FileUpload
        files={[...files, { name: 'report.pdf', size: 1, type: 'application/pdf' }]}
        onSelect={() => {}}
        onRemove={() => {}}
      />,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('duplicate file name "report.pdf"'));
  } finally {
    warn.mockRestore();
  }
});
