// Tooltip.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from './Tooltip';

test('shows tooltip on hover after delay', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help text">
      <button>Hover me</button>
    </Tooltip>,
  );
  fireEvent.mouseEnter(screen.getByText('Hover me'));
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.getByRole('tooltip')).toHaveTextContent('Help text');
  vi.useRealTimers();
});

test('hides tooltip on mouse leave', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help text">
      <button>Hover me</button>
    </Tooltip>,
  );
  fireEvent.mouseEnter(screen.getByText('Hover me'));
  act(() => {
    vi.advanceTimersByTime(200);
  });
  fireEvent.mouseLeave(screen.getByText('Hover me'));
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  vi.useRealTimers();
});

test('shows tooltip on focus', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help text">
      <button>Focus me</button>
    </Tooltip>,
  );
  fireEvent.focus(screen.getByText('Focus me'));
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.getByRole('tooltip')).toHaveTextContent('Help text');
  vi.useRealTimers();
});
