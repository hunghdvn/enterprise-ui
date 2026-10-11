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

test('toast.success renders and auto-dismisses', () => {
  vi.useFakeTimers();
  try {
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
  } finally {
    vi.useRealTimers();
  }
});

test('toast.error uses alert role', () => {
  vi.useFakeTimers();
  try {
    render(
      <ToastProvider duration={3000}>
        <Probe />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'fail' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Lưu thất bại');
  } finally {
    vi.useRealTimers();
  }
});
