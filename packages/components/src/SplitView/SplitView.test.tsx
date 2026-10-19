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

// Flippable variant for hooks that subscribe to media-query changes
// (useIsMobile): `set(next)` updates `matches` AND fires every registered
// change listener, so an effect keyed on `isMobile` re-runs for real.
function stubMatchMediaFlippable(initial: boolean): {
  set: (next: boolean) => void;
  restore: () => void;
} {
  const original = window.matchMedia;
  const listeners: Array<(e: { matches: boolean }) => void> = [];
  const mql = {
    matches: initial,
    media: '',
    onchange: null,
    addEventListener: (_type: string, cb: (e: { matches: boolean }) => void) => {
      listeners.push(cb);
    },
    removeEventListener: (_type: string, cb: (e: { matches: boolean }) => void) => {
      const i = listeners.indexOf(cb);
      if (i >= 0) listeners.splice(i, 1);
    },
    addListener: (cb: (e: { matches: boolean }) => void) => {
      listeners.push(cb);
    },
    removeListener: (cb: (e: { matches: boolean }) => void) => {
      const i = listeners.indexOf(cb);
      if (i >= 0) listeners.splice(i, 1);
    },
    dispatchEvent: () => false,
  };
  Object.defineProperty(window, 'matchMedia', {
    value: () => mql,
    configurable: true,
    writable: true,
  });
  return {
    set(next: boolean) {
      mql.matches = next;
      for (const cb of [...listeners]) cb({ matches: next });
    },
    restore() {
      Object.defineProperty(window, 'matchMedia', {
        value: original,
        configurable: true,
        writable: true,
      });
    },
  };
}

// Shared RO stub (round-4 #7: the inline class had been copy-pasted per
// test). Returns the captured constructor callbacks (to drive re-measures)
// and the observer instances (to assert disconnect cleanup).
function stubResizeObserver() {
  const callbacks: ResizeObserverCallback[] = [];
  const observers: Array<{ disconnect: ReturnType<typeof vi.fn> }> = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      constructor(callback: ResizeObserverCallback) {
        callbacks.push(callback);
        observers.push(this as { disconnect: ReturnType<typeof vi.fn> });
      }
    },
  );
  return { callbacks, observers };
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
    fireEvent(handle, pd(100)); // origin = effectiveSize 300 (500 render-clamped)
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
  const ro = stubResizeObserver();
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
    // Width and height differ so a swapped-axis measure cannot pass (the
    // vertical twin below pins the height path the same way).
    Object.defineProperty(container, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 999, configurable: true });
    // The RO callback is what re-measures on layout change.
    await act(async () => {
      ro.callbacks[0]?.([], {} as ResizeObserver);
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
    // The NEW pointer must drive the drag after take-over — arming survived
    // the teardown (p2 origin X=200: 250 - 200 = 50 → 380 + 50 = 430).
    fireEvent(window, pm(250, 200, 2, 1));
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
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

// --- round 3 (M1/M2 + items 3–5): reconcile contract, NaN guards, blind spots ---

test('resizable={false} renders the caller size verbatim (no clamp, no ARIA)', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        resizable={false}
        masterWidth={150}
        minSize={280}
      />,
    );
    expect(screen.queryByRole('separator')).toBeNull();
    // Locked pane: the caller owns the size completely — min/max never
    // silently rewrite it (review M2; the old head clamped 150 → 280 here).
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('150px');
  } finally {
    restore();
  }
});

test('out-of-range masterWidth renders clamped: size, ARIA and keyboard origin agree', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={100}
        minSize={280}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const splitter = screen.getByRole('separator');
    // The N1 invariant, pinned: reverting `effectiveSize` back to `currentSize`
    // in any of style/ARIA/drag/keyboard origin fails this test.
    expect(splitter.getAttribute('aria-valuenow')).toBe('280');
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('280px');
    // Mount converge report, then the keyboard origin is the CLAMPED value:
    // 280 + 8 = 288 (a currentSize origin would report 108).
    expect(onWidthChange).toHaveBeenNthCalledWith(1, 280);
    fireEvent.keyDown(splitter, { key: 'ArrowRight' });
    expect(onWidthChange).toHaveBeenNthCalledWith(2, 288);
  } finally {
    restore();
  }
});

test('a measured cap that clamps the mounted size reports the capped value once', async () => {
  const ro = stubResizeObserver();
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900} // persisted from a wider window
        minSize={280}
        onMasterWidthChange={onWidthChange}
      />,
    );
    // No track measured yet → no cap → first paint shows 900.
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('900px');
    const container = document.querySelector('[data-orientation="horizontal"]') as HTMLDivElement;
    Object.defineProperty(container, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 900, configurable: true });
    await act(async () => {
      ro.callbacks[0]?.([], {} as ResizeObserver);
      await Promise.resolve();
    });
    // Cap = 0.8 × 500 = 400 → the pane shrinks AND the parent learns the
    // capped value exactly once; an ignoring parent never re-triggers it.
    await waitFor(() =>
      expect(screen.getByTestId('master').parentElement!.style.width).toBe('400px'),
    );
    expect(onWidthChange).toHaveBeenCalledTimes(1);
    expect(onWidthChange).toHaveBeenCalledWith(400);
  } finally {
    vi.unstubAllGlobals();
    restore();
  }
});

test('non-finite minSize/maxSize fall back to defaults instead of poisoning ARIA', () => {
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
        minSize={Number.NaN}
        maxSize={Number.NaN}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const splitter = screen.getByRole('separator');
    // NaN minSize → default floor 280; NaN maxSize → measured default (no
    // track in jsdom → no upper clamp). Nothing renders or reports "NaN".
    expect(splitter.getAttribute('aria-valuenow')).toBe('380');
    expect(splitter.getAttribute('aria-valuemin')).toBe('280');
    expect(splitter.getAttribute('aria-valuemax')).toBeNull();
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('380px');
    fireEvent(splitter, pd(100));
    fireEvent(window, pm(150));
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
    fireEvent(window, pu());
  } finally {
    restore();
  }
});

test('default maxSize on a vertical track measures the height, not the width', async () => {
  const ro = stubResizeObserver();
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
        masterHeight={380}
        minSize={280}
        onMasterHeightChange={onHeightChange}
      />,
    );
    const container = document.querySelector('[data-orientation="vertical"]') as HTMLDivElement;
    // Width and height differ so a swapped-axis measure cannot pass.
    Object.defineProperty(container, 'clientWidth', { value: 999, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 500, configurable: true });
    await act(async () => {
      ro.callbacks[0]?.([], {} as ResizeObserver);
      await Promise.resolve();
    });
    const splitter = screen.getByRole('separator');
    await waitFor(() => expect(splitter.getAttribute('aria-valuemax')).toBe('400')); // 0.8 × 500 (height)
    fireEvent(splitter, pd(0, 100));
    fireEvent(window, pm(0, 9999));
    expect(onHeightChange).toHaveBeenLastCalledWith(400);
    fireEvent(window, pu());
  } finally {
    vi.unstubAllGlobals();
    restore();
  }
});

test('pointer capture is taken and released on the handle element (N5)', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  const proto = Element.prototype as unknown as {
    setPointerCapture?: (pointerId: number) => void;
    releasePointerCapture?: (pointerId: number) => void;
  };
  const originalSet = proto.setPointerCapture;
  const originalRelease = proto.releasePointerCapture;
  const setCapture = vi.fn();
  const releaseCapture = vi.fn();
  proto.setPointerCapture = setCapture;
  proto.releasePointerCapture = releaseCapture;
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
    fireEvent(handle, pd(100)); // arm pointer 1
    expect(setCapture).toHaveBeenCalledTimes(1);
    expect(setCapture).toHaveBeenCalledWith(1);
    expect(setCapture.mock.contexts[0]).toBe(handle);
    fireEvent(window, pm(150)); // 430
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
    fireEvent(window, pu(1));
    // Released via the captured element — a revert to `ev.currentTarget`
    // inside the window listener would target `window`, not the handle.
    expect(releaseCapture).toHaveBeenCalledTimes(1);
    expect(releaseCapture).toHaveBeenCalledWith(1);
    expect(releaseCapture.mock.contexts[0]).toBe(handle);
  } finally {
    if (originalSet) proto.setPointerCapture = originalSet;
    else delete proto.setPointerCapture;
    if (originalRelease) proto.releasePointerCapture = originalRelease;
    else delete proto.releasePointerCapture;
    restore();
  }
});

test('the measure effect re-subscribes when isMobile flips (deps pinned)', async () => {
  const ro = stubResizeObserver();
  const mq = stubMatchMediaFlippable(false);
  try {
    render(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    expect(ro.callbacks).toHaveLength(1);
    // Flip to mobile: the desktop container unmounts (no node → no observer)
    // and the previous effect run's cleanup MUST disconnect its observer
    // (a missing cleanup would leak it — round-4 #5c).
    await act(async () => {
      mq.set(true);
    });
    expect(ro.observers[0].disconnect).toHaveBeenCalledTimes(1);
    // Flip back: the effect re-runs and subscribes again — only possible
    // because the effect deps include `isMobile` (N3).
    await act(async () => {
      mq.set(false);
    });
    expect(ro.callbacks).toHaveLength(2);
  } finally {
    vi.unstubAllGlobals();
    mq.restore();
  }
});

test('keyboard steps clamp at maxSize (plan: clamped to maxSize)', () => {
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
        maxSize={400}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const handle = screen.getByRole('separator');
    handle.focus();
    // Origin sits at the ceiling: an increasing step must not exceed maxSize.
    fireEvent.keyDown(handle, { key: 'ArrowRight' }); // 400 + 8 → clamped 400
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
    fireEvent.keyDown(handle, { key: 'ArrowRight', shiftKey: true }); // +32 → still 400
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
  } finally {
    restore();
  }
});

// --- round 4: reconcile episode identity, NaN size props, mobile gate ---

test('#1 reconcile key is per-axis: an ignored width report does not swallow height', () => {
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
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={onWidthChange}
        onMasterHeightChange={onHeightChange}
      />,
    );
    expect(onWidthChange).toHaveBeenCalledTimes(1); // width episode reported
    // Flip to vertical with an equally out-of-range height: the SHARED key
    // ("900|400") used to swallow this report (round-4 #1a).
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        orientation="vertical"
        masterHeight={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={onWidthChange}
        onMasterHeightChange={onHeightChange}
      />,
    );
    expect(onHeightChange).toHaveBeenCalledTimes(1);
    expect(onHeightChange).toHaveBeenLastCalledWith(400);
  } finally {
    restore();
  }
});

test('#5 reconcile re-arms after the parent returns in range (reset branch)', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    const { rerender } = render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={onWidthChange}
      />,
    );
    // Mount: 900 > 400 → report 400 once.
    expect(onWidthChange).toHaveBeenCalledTimes(1);
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
    // Ignoring parent keeps 900; an unrelated rerender must not re-report.
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={onWidthChange}
      />,
    );
    expect(onWidthChange).toHaveBeenCalledTimes(1);
    // Parent converges to 400 → the guard re-arms...
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={400}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={onWidthChange}
      />,
    );
    expect(onWidthChange).toHaveBeenCalledTimes(1);
    // ...so restoring the stale 900 starts a NEW episode and reports again.
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={onWidthChange}
      />,
    );
    expect(onWidthChange).toHaveBeenCalledTimes(2);
    expect(onWidthChange).toHaveBeenLastCalledWith(400);
  } finally {
    restore();
  }
});

test('#5 locked pane renders above-max verbatim too', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        resizable={false}
        masterWidth={900}
        maxSize={400}
      />,
    );
    expect(screen.queryByRole('separator')).toBeNull();
    // The floor side was pinned at 150px; the ceiling side must hold equally:
    // a locked pane shows the caller's size no matter the bounds.
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('900px');
  } finally {
    restore();
  }
});

test('#2 non-finite masterWidth falls back to the axis default (no NaN anywhere)', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={Number.NaN}
        minSize={280}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const splitter = screen.getByRole('separator');
    expect(splitter.getAttribute('aria-valuenow')).toBe('380'); // axis default
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('380px');
    // The reconcile guard must never emit NaN on mount (NaN !== NaN).
    expect(onWidthChange).not.toHaveBeenCalled();
    fireEvent(splitter, pd(100));
    fireEvent(window, pm(150));
    expect(onWidthChange).toHaveBeenLastCalledWith(430);
    fireEvent(window, pu());
  } finally {
    restore();
  }
});

test('#3 reconcile does not report on mobile (no size is rendered there)', () => {
  const onWidthChange = vi.fn();
  const mq = stubMatchMediaFlippable(true); // mobile from the start
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={onWidthChange}
      />,
    );
    // Mobile renders the single-pane layout with no size style — a clamp
    // report here would be a spurious zero-interaction event (round-4 #3).
    expect(onWidthChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('separator')).toBeNull();
  } finally {
    mq.restore();
  }
});

test('#4 maxSize={Infinity} is an explicit no-cap (no clamp, no aria-valuemax)', async () => {
  const ro = stubResizeObserver();
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={Infinity}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const container = document.querySelector('[data-orientation="horizontal"]') as HTMLDivElement;
    Object.defineProperty(container, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 900, configurable: true });
    await act(async () => {
      ro.callbacks[0]?.([], {} as ResizeObserver);
      await Promise.resolve();
    });
    const splitter = screen.getByRole('separator');
    // Even after the track measures, an explicit Infinity must not remap to
    // the 0.8× measured cap (round-4 #4: `hasLimit ? limit : Infinity`).
    expect(splitter.getAttribute('aria-valuemax')).toBeNull();
    expect(splitter.getAttribute('aria-valuenow')).toBe('900');
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('900px');
    expect(onWidthChange).not.toHaveBeenCalled(); // nothing was clamped
  } finally {
    vi.unstubAllGlobals();
    restore();
  }
});

// --- round 5: episode identity vs dep churn, raw-input keys, NaN-vs-Infinity ---

test('#1 inline-handler churn does not cause a report storm (episode guard)', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    const { rerender } = render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={(v) => onWidthChange(v)} // inline → new identity
      />,
    );
    expect(onWidthChange).toHaveBeenCalledTimes(1);
    // Every rerender passes a FRESH inline handler, so the effect re-runs
    // each time — only the episode key keeps it from re-reporting 400 on
    // every render (round-5 #1a; a reverted guard fires 4 times).
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={(v) => onWidthChange(v)}
      />,
    );
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={(v) => onWidthChange(v)}
      />,
    );
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={400}
        onMasterWidthChange={(v) => onWidthChange(v)}
      />,
    );
    expect(onWidthChange).toHaveBeenCalledTimes(1);
  } finally {
    restore();
  }
});

test('#1 the episode key follows the RAW caller input (NaN mount vs 380 mount)', () => {
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    const { rerender } = render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={Number.NaN}
        minSize={500}
        onMasterWidthChange={onWidthChange}
      />,
    );
    // NaN sanitizes to 380, below the 500 floor → report 500 once.
    expect(onWidthChange).toHaveBeenCalledTimes(1);
    expect(onWidthChange).toHaveBeenLastCalledWith(500);
    // Parent ignores it and passes 380 instead — a DIFFERENT raw input that
    // renders the same clamped 500, so it is a new episode and must report
    // again (keying on the sanitized value aliased the two, round-5 #1b).
    rerender(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={380}
        minSize={500}
        onMasterWidthChange={onWidthChange}
      />,
    );
    expect(onWidthChange).toHaveBeenCalledTimes(2);
    expect(onWidthChange).toHaveBeenLastCalledWith(500);
  } finally {
    restore();
  }
});

test('#4 maxSize={NaN} falls back to the measured cap (not a no-cap)', async () => {
  const ro = stubResizeObserver();
  const onWidthChange = vi.fn();
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={900}
        minSize={280}
        maxSize={Number.NaN}
        onMasterWidthChange={onWidthChange}
      />,
    );
    const container = document.querySelector('[data-orientation="horizontal"]') as HTMLDivElement;
    Object.defineProperty(container, 'clientWidth', { value: 500, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 900, configurable: true });
    await act(async () => {
      ro.callbacks[0]?.([], {} as ResizeObserver);
      await Promise.resolve();
    });
    const splitter = screen.getByRole('separator');
    // NaN is NOT an explicit no-cap: the measured 0.8×track ceiling applies
    // (a regression conflating `!Number.isFinite` with `=== Infinity` would
    // leave the pane at 900 with no valuemax).
    await waitFor(() => expect(splitter.getAttribute('aria-valuemax')).toBe('400'));
    expect(splitter.getAttribute('aria-valuenow')).toBe('400');
    expect(onWidthChange).toHaveBeenLastCalledWith(400); // reconcile reported
  } finally {
    vi.unstubAllGlobals();
    restore();
  }
});

test('#4 vertical sanitize leg: non-finite masterHeight falls back to 280', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        orientation="vertical"
        masterHeight={Number.NaN}
      />,
    );
    expect(screen.getByTestId('master').parentElement!.style.height).toBe('280px');
  } finally {
    restore();
  }
});

test('#4 non-finite masterWidth={Infinity} falls back to the axis default', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={Infinity}
        minSize={280}
      />,
    );
    // Size-PROP Infinity is a plain non-finite value (unlike maxSize, where
    // Infinity means "explicitly no cap"): it falls back to 380.
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('380px');
  } finally {
    restore();
  }
});
