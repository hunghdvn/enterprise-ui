import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { SplitView } from './SplitView';

function stubMatchMedia(matches: boolean): () => void {
  const original = window.matchMedia;
  Object.defineProperty(window, 'matchMedia', {
    value: () => ({
      matches,
      media: '',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
    configurable: true,
    writable: true,
  });
  return () =>
    Object.defineProperty(window, 'matchMedia', {
      value: original,
      configurable: true,
      writable: true,
    });
}

const master = <div data-testid="master">Danh sách</div>;
const detail = (
  <div>
    <h2>Chi tiết SO-1</h2>
    <p>Nội dung</p>
  </div>
);

test('desktop shows both panes side by side', () => {
  const restore = stubMatchMedia(false);
  try {
    render(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={() => {}} />);
    expect(screen.getByTestId('master')).toBeInTheDocument();
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Quay lại/ })).toBeNull();
  } finally {
    restore();
  }
});

test('mobile shows master alone without selection', () => {
  const restore = stubMatchMedia(true);
  try {
    render(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    expect(screen.getByTestId('master')).toBeInTheDocument();
    expect(screen.queryByText('Nội dung')).toBeNull();
  } finally {
    restore();
  }
});

test('mobile shows detail with back button and moves focus to it', () => {
  const onBack = vi.fn();
  const restore = stubMatchMedia(true);
  try {
    const { rerender } = render(
      <SplitView master={master} detail={detail} selectedKey={null} onBack={onBack} />,
    );
    expect(screen.queryByText('Nội dung')).toBeNull();
    // Null → key transition (the real selection flow): focus lands on the
    // detail heading, not the bare container.
    rerender(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={onBack} />);
    expect(screen.queryByTestId('master')).toBeNull();
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    expect(document.activeElement?.tagName).toBe('H2');
    expect(document.activeElement).toHaveTextContent('Chi tiết SO-1');
    fireEvent.click(screen.getByRole('button', { name: /Quay lại/ }));
    expect(onBack).toHaveBeenCalledTimes(1);
  } finally {
    restore();
  }
});

test('mobile mount with a key does not steal focus', () => {
  const restore = stubMatchMedia(true);
  try {
    render(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={() => {}} />);
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    // Preselected on first paint — no user selection happened, so no focus jump.
    expect(document.activeElement?.tagName).toBe('BODY');
  } finally {
    restore();
  }
});

test('mobile back returns focus to the master pane', () => {
  const restore = stubMatchMedia(true);
  try {
    const { rerender } = render(
      <SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />,
    );
    rerender(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={() => {}} />);
    expect(document.activeElement?.tagName).toBe('H2');
    rerender(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    expect(screen.getByTestId('master')).toBeInTheDocument();
    expect(document.activeElement).toHaveTextContent('Danh sách');
  } finally {
    restore();
  }
});

test('master width is honored on desktop', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={420}
      />,
    );
    const masterPane = screen.getByTestId('master').parentElement!;
    expect(masterPane.style.width).toBe('420px');
  } finally {
    restore();
  }
});

test('unmatched selectedKey still renders caller-owned detail', () => {
  const restore = stubMatchMedia(true);
  try {
    // The key matches nothing in the master list — SplitView never validates
    // it, the detail is the caller's data to own.
    render(<SplitView master={master} detail={detail} selectedKey="SO-404" onBack={() => {}} />);
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
  } finally {
    restore();
  }
});

test('default master width is 380px', () => {
  const restore = stubMatchMedia(false);
  try {
    render(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('380px');
  } finally {
    restore();
  }
});

// --- SplitView drag resize (sub-project 6) ---

test('desktop renders a resize splitter with aria size attributes', () => {
  const restore = stubMatchMedia(false);
  try {
    render(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    const splitter = screen.getByRole('separator', { name: /kích thước/i });
    expect(splitter.getAttribute('aria-valuenow')).toBe('380');
    expect(splitter.getAttribute('aria-valuemin')).toBe('280');
  } finally {
    restore();
  }
});

test('resizable={false} hides the splitter', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        resizable={false}
      />,
    );
    expect(screen.queryByRole('separator')).toBeNull();
  } finally {
    restore();
  }
});

test('orientation="vertical" flips splitter to a horizontal line', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        orientation="vertical"
      />,
    );
    const splitter = screen.getByRole('separator', { name: /kích thước/i });
    expect(splitter.getAttribute('aria-orientation')).toBe('horizontal');
  } finally {
    restore();
  }
});

test('orientation="vertical" sizes master by height', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={<div data-testid="m">m</div>}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        orientation="vertical"
        masterHeight={300}
      />,
    );
    expect(screen.getByTestId('m').parentElement!.style.height).toBe('300px');
  } finally {
    restore();
  }
});

// --- drag resize (Task 2) ---

// `pointerId` is not part of `MouseEventInit`, so mirror the Table tests by
// stamping it onto the event after construction.
function ptr(type: string, init: Record<string, unknown>, pointerId: number) {
  const e = new window.MouseEvent(type, { ...init }) as unknown as Event & { pointerId: number };
  e.pointerId = pointerId;
  return e;
}
const pd = (clientX = 100, clientY = 0, button = 0, pointerId = 1) =>
  ptr('pointerdown', { bubbles: true, cancelable: true, button, clientX, clientY }, pointerId);
const pm = (clientX: number, clientY = 0, pointerId = 1, buttons = 1) =>
  ptr('pointermove', { bubbles: true, cancelable: true, buttons, clientX, clientY }, pointerId);
const pu = (pointerId = 1) => ptr('pointerup', { bubbles: true, cancelable: true }, pointerId);
const pc = (pointerId = 1) => ptr('pointercancel', { bubbles: true, cancelable: true }, pointerId);

test('dragging the splitter reports width changes, clamped to bounds', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={380}
        minSize={280}
        maxSize={800}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(100));
    fireEvent(window, pm(150));
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
    // beyond max -> clamp
    fireEvent(window, pm(9999));
    expect(onWidthChange).toHaveBeenLastCalledWith(800);
    // released: no further reports
    fireEvent(window, pu());
    onWidthChange.mockClear();
    fireEvent(window, pm(200));
    expect(onWidthChange).not.toHaveBeenCalled();
  } finally {
    restore();
  }
});

test('right-click does not start a resize', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(100, 0, 2));
    fireEvent(window, pm(200));
    expect(onWidthChange).not.toHaveBeenCalled();
  } finally {
    restore();
  }
});

test('pointercancel ends the drag', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(100));
    fireEvent(window, pc());
    onWidthChange.mockClear();
    fireEvent(window, pm(300));
    expect(onWidthChange).not.toHaveBeenCalled();
  } finally {
    restore();
  }
});

test('keyboard resizes width: Arrow ±8, Shift ±32, Delete resets', () => {
  // Controlled: a real parent reflects each report back as the new width.
  const Wrapper = () => {
    const [w, setW] = useState(380);
    return (
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={w}
        minSize={280}
        onMasterWidthChange={setW}
      />
    );
  };
  const restore = stubMatchMedia(false);
  try {
    render(<Wrapper />);
    const handle = screen.getByRole('separator');
    handle.focus();
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(handle.getAttribute('aria-valuenow')).toBe('388');
    fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true });
    expect(handle.getAttribute('aria-valuenow')).toBe('420');
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(handle.getAttribute('aria-valuenow')).toBe('412');
    fireEvent.keyDown(handle, { key: 'Delete' });
    expect(handle.getAttribute('aria-valuenow')).toBe('380');
  } finally {
    restore();
  }
});

test('vertical orientation reports height changes on the Y axis', () => {
  const onHeightChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        orientation="vertical"
        masterHeight={280}
        minSize={120}
        maxSize={600}
        onMasterHeightChange={onHeightChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(0, 100));
    fireEvent(window, pm(0, 150));
    expect(onHeightChange).toHaveBeenLastCalledWith(330);
    fireEvent(window, pu());
  } finally {
    restore();
  }
});

test('mobile never renders a splitter', () => {
  const restore = stubMatchMedia(true);
  try {
    render(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={() => {}} />);
    expect(screen.queryByRole('separator')).toBeNull();
  } finally {
    restore();
  }
});

test('no onMasterWidthChange keeps the splitter inert (no throw)', () => {
  const restore = stubMatchMedia(false);
  try {
    render(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    const handle = screen.getByRole('separator');
    // Drag and keyboard must not crash when the parent hasn't wired the event.
    fireEvent(handle, pd(100));
    fireEvent(window, pm(500));
    fireEvent(window, pu());
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(screen.getByRole('separator')).toBeInTheDocument();
  } finally {
    restore();
  }
});
