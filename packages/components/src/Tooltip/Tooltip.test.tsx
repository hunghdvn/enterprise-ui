// Tooltip.test.tsx
import { StrictMode } from 'react';
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

test('hides tooltip on blur', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help text">
      <button>Focus me</button>
    </Tooltip>,
  );
  const trigger = screen.getByText('Focus me');
  fireEvent.focus(trigger);
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.getByRole('tooltip')).toBeInTheDocument();
  fireEvent.blur(trigger);
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  vi.useRealTimers();
});

test('sets aria-describedby on the trigger while visible and removes it when hidden', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help text">
      <button>Focus me</button>
    </Tooltip>,
  );
  const trigger = screen.getByText('Focus me');
  expect(trigger).not.toHaveAttribute('aria-describedby');
  fireEvent.focus(trigger);
  act(() => {
    vi.advanceTimersByTime(200);
  });
  const tooltipId = screen.getByRole('tooltip').id;
  expect(trigger).toHaveAttribute('aria-describedby', tooltipId);
  fireEvent.blur(trigger);
  expect(trigger).not.toHaveAttribute('aria-describedby');
  vi.useRealTimers();
});

// Under StrictMode (apps/docs renders inside it) two show() calls batched in
// one act() used to double-invoke the setTimerId updater, losing one timer id
// and leaving an orphan timer that stuck the tooltip open after mouse leave.
test('no orphan timer when mouseenter and focus fire in one batch', () => {
  vi.useFakeTimers();
  render(
    <StrictMode>
      <Tooltip content="Help text">
        <button>Hover me</button>
      </Tooltip>
    </StrictMode>,
  );
  const trigger = screen.getByText('Hover me');
  act(() => {
    fireEvent.mouseEnter(trigger);
    fireEvent.focus(trigger);
  });
  fireEvent.mouseLeave(trigger);
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  vi.useRealTimers();
});

test('keeps className on the wrapper only, not on the bubble', () => {
  vi.useFakeTimers();
  render(
    <Tooltip content="Help text" className="truncate">
      <button>Hover me</button>
    </Tooltip>,
  );
  fireEvent.mouseEnter(screen.getByText('Hover me'));
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.getByText('Hover me').parentElement).toHaveClass('truncate');
  expect(screen.getByRole('tooltip')).not.toHaveClass('truncate');
  vi.useRealTimers();
});
