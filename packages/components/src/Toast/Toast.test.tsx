import { act, fireEvent, render, screen } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastProvider';

function Probe() {
  const { toast } = useToast();
  return (
    <>
      <button onClick={() => toast.success('Lưu thành công')}>ok</button>
      <button onClick={() => toast.error('Lưu thất bại')}>fail</button>
    </>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('toast.success renders and auto-dismisses', () => {
  render(
    <ToastProvider duration={3000}>
      <Probe />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'ok' }));
  expect(screen.getByText('Lưu thành công')).toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(3000);
  });
  expect(screen.queryByText('Lưu thành công')).not.toBeInTheDocument();
});

test('toast.error uses alert role', () => {
  render(
    <ToastProvider duration={3000}>
      <Probe />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'fail' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Lưu thất bại');
});

test('toast still renders before its duration elapses', () => {
  render(
    <ToastProvider duration={3000}>
      <Probe />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'ok' }));
  act(() => {
    vi.advanceTimersByTime(2999);
  });
  expect(screen.getByText('Lưu thành công')).toBeInTheDocument();
});

test('timer handle is released once the toast has fired', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    render(
      <ToastProvider duration={3000}>
        <Probe />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'ok' }));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByText('Lưu thành công')).not.toBeInTheDocument();
    // Far past the duration: the fired handle must not touch state again.
    vi.advanceTimersByTime(120000);
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});

test('manually dismissed toast clears its timer and fires nothing', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const { unmount } = render(
      <ToastProvider duration={3000}>
        <Probe />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'ok' }));
    fireEvent.click(screen.getByRole('button', { name: 'Đóng thông báo' }));
    expect(screen.queryByText('Lưu thành công')).not.toBeInTheDocument();

    // Unwrapped on purpose: a leaked handle would update state out of act().
    vi.advanceTimersByTime(120000);
    expect(screen.queryByText('Lưu thành công')).not.toBeInTheDocument();
    expect(error).not.toHaveBeenCalled();

    unmount();
    act(() => {
      vi.advanceTimersByTime(120000);
    });
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});
