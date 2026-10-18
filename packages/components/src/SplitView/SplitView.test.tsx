import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

// --- review fix coverage (findings #4, #10, #11, #12) ---

test('aria-valuemax is rendered when maxSize is provided', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={400}
        minSize={280}
        maxSize={720}
        onMasterWidthChange={() => {}}
      />,
    );
    const splitter = screen.getByRole('separator');
    expect(splitter.getAttribute('aria-valuenow')).toBe('400');
    expect(splitter.getAttribute('aria-valuemin')).toBe('280');
    expect(splitter.getAttribute('aria-valuemax')).toBe('720');
  } finally {
    restore();
  }
});

test('dragging past the minimum clamps to it (reverse direction)', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={400}
        minSize={280}
        maxSize={800}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(400)); // start at 400
    fireEvent(window, pm(300)); // 400 - 100 = 300
    expect(onWidthChange).toHaveBeenLastCalledWith(300);
    fireEvent(window, pm(0)); // 0 → clamped to 280
    expect(onWidthChange).toHaveBeenLastCalledWith(280);
    fireEvent(window, pu());
  } finally {
    restore();
  }
});

test('maxSize below minSize falls back to min as the ceiling', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={500}
        minSize={300}
        maxSize={200}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(100)); // startSize 500
    fireEvent(window, pm(9999)); // way beyond → clamped to 300 (floor wins)
    expect(onWidthChange).toHaveBeenLastCalledWith(300);
    fireEvent(window, pu());
  } finally {
    restore();
  }
});

test('a buttons===0 pointer ends the drag', () => {
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
    fireEvent(handle, pd(100)); // arm
    fireEvent(window, pm(150)); // 380 + 50 = 430
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
    // buttons===0 mid-stream ends the drag
    fireEvent(window, pm(300, 0, 1, 0));
    onWidthChange.mockClear();
    fireEvent(window, pm(400, 0, 1, 1));
    expect(onWidthChange).not.toHaveBeenCalled();
    fireEvent(window, pu());
  } finally {
    restore();
  }
});

test('vertical keyboard resizes height: Arrow ±8, Shift ±32, Delete resets to default', () => {
  const Wrapper = () => {
    const [h, setH] = useState(280);
    return (
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        orientation="vertical"
        masterHeight={h}
        minSize={120}
        onMasterHeightChange={setH}
      />
    );
  };
  const restore = stubMatchMedia(false);
  try {
    render(<Wrapper />);
    const handle = screen.getByRole('separator');
    handle.focus();
    fireEvent.keyDown(handle, { key: 'ArrowDown' }); // 280 + 8 = 288
    expect(handle.getAttribute('aria-valuenow')).toBe('288');
    fireEvent.keyDown(handle, { key: 'ArrowDown', shiftKey: true }); // 288 + 32 = 320
    expect(handle.getAttribute('aria-valuenow')).toBe('320');
    fireEvent.keyDown(handle, { key: 'ArrowUp' }); // 320 - 8 = 312
    expect(handle.getAttribute('aria-valuenow')).toBe('312');
    fireEvent.keyDown(handle, { key: 'Delete' }); // reset to default 280
    expect(handle.getAttribute('aria-valuenow')).toBe('280');
  } finally {
    restore();
  }
});

// --- review fix coverage (round 2: N1 reconcile + N2 harness coverage) ---

// Non-vacuous guard of the measured default-max path (#1): when the track is
// laid out, `maxSize` defaults to 0.8x track and a drag past it clamps. Mirrors
// the ResizeObserver+clientHeight stub technique in Table.test.tsx:891-925.
test('default maxSize is 0.8x the measured track when laid out', async () => {
  let roCallback: ResizeObserverCallback | undefined;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(callback: ResizeObserverCallback) {
        roCallback = callback;
      }
    },
  );
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={<div data-testid="master">m</div>}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={380}
        minSize={280}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const container = document.querySelector('[data-orientation="horizontal"]') as HTMLDivElement;
    Object.defineProperty(container, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 500, configurable: true });
    // The RO callback is what re-measures on layout change.
    await act(async () => {
      roCallback?.([], {} as ResizeObserver);
      await Promise.resolve();
    });
    const splitter = screen.getByRole('separator');
    await waitFor(() => expect(splitter.getAttribute('aria-valuemax')).toBe('400')); // 0.8 * 500
    // Dragging past the measured cap now clamps instead of reporting 5000+.
    fireEvent(splitter, pd(100));
    fireEvent(window, pm(9999));
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
    fireEvent(window, pu());
  } finally {
    vi.unstubAllGlobals();
    restore();
  }
});

test('minSize=0 still floors the master at 1px', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={280}
        minSize={0}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(100)); // startSize 280
    fireEvent(window, pm(0)); // 280 - 100 = 180
    expect(onWidthChange).toHaveBeenLastCalledWith(180);
    fireEvent(window, pm(-9999)); // floored to 1, not 0 / negative
    expect(onWidthChange).toHaveBeenLastCalledWith(1);
    fireEvent(window, pu());
  } finally {
    restore();
  }
});

test('a foreign pointer neither drives nor ends the active drag', () => {
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
    fireEvent(handle, pd(100, 100, 0, 1)); // arm pointer 1
    fireEvent(window, pm(120, 100, 2, 1)); // pointerId 2 → ignored
    expect(onWidthChange).not.toHaveBeenCalled();
    fireEvent(window, pu(2)); // foreign release → must not end the p1 drag
    fireEvent(window, pm(150, 100, 1, 1)); // p1 still drives
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
    fireEvent(window, pu(1));
  } finally {
    restore();
  }
});

test('a second pointerdown cancels the first drag (take-over)', () => {
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
    fireEvent(handle, pd(100, 100, 0, 1)); // arm pointer 1
    fireEvent(window, pm(120, 100, 1, 1)); // p1 -> 400
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
    const callsBefore = onWidthChange.mock.calls.length;
    // New pointerdown takes over and tears the old drag's listeners down.
    fireEvent(handle, pd(200, 200, 0, 2));
    // The old pointer (id 1) must no longer drive the drag after take-over.
    fireEvent(window, pm(130, 100, 1, 1));
    expect(onWidthChange.mock.calls.length).toBe(callsBefore);
    fireEvent(window, pu(1));
    fireEvent(window, pu(2));
  } finally {
    restore();
  }
});

test('unmounting mid-drag tears down window listeners', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    const { unmount } = render(
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
    fireEvent(handle, pd(100)); // arm
    fireEvent(window, pm(150)); // 430
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
    onWidthChange.mockClear();
    unmount();
    // After unmount the window listeners are gone: a stray move must neither
    // report to the (now-dead) callback nor throw.
    expect(() => fireEvent(window, pm(200))).not.toThrow();
    expect(onWidthChange).not.toHaveBeenCalled();
  } finally {
    restore();
  }
});

test('orientation change mid-drag switches the active axis live', () => {
  const onWidthChange = vi.fn();
  const onHeightChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    const { rerender } = render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={380}
        minSize={280}
        onMasterWidthChange={onWidthChange}
        onMasterHeightChange={onHeightChange}
      />,
    );
    const handle = screen.getByRole('separator');
    fireEvent(handle, pd(100, 100)); // arm horizontal (X origin at 100)
    fireEvent(window, pm(120, 100)); // 380 + 20 = 400 on X axis
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
    // Switch axis while the drag is armed; the live axis (Y) must take over.
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        orientation="vertical"
        masterHeight={280}
        minSize={120}
        onMasterWidthChange={onWidthChange}
        onMasterHeightChange={onHeightChange}
      />,
    );
    fireEvent(window, pm(100, 140)); // Y delta = 40 -> onHeightChange(380 + 40)
    expect(onHeightChange).toHaveBeenLastCalledWith(420);
    expect(onWidthChange).toHaveBeenLastCalledWith(400); // unchanged by Y move
    fireEvent(window, pu());
  } finally {
    restore();
  }
});
