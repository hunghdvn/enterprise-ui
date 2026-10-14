import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { act, cleanup, renderHook } from '@testing-library/react';
import { useIsMobile } from './useIsMobile';

type ChangeListener = (event: { matches: boolean }) => void;

interface MqlStub {
  query: string;
  listeners: Set<ChangeListener>;
  /** Present only when the modern listener API is exercised. */
  addEventListener?: ReturnType<typeof vi.fn>;
  removeEventListener?: ReturnType<typeof vi.fn>;
  addListener: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
}

interface InstallOptions {
  /** Initial `matches` reported by every created MediaQueryList. */
  matches?: boolean;
  /** When false the stub omits add/removeEventListener (legacy API only). */
  withAddEventListener?: boolean;
}

function installMatchMedia(options: InstallOptions = {}): MqlStub[] {
  const created: MqlStub[] = [];
  const matchMedia = (query: string): MediaQueryList => {
    const listeners = new Set<ChangeListener>();
    const mql: MqlStub = {
      query,
      listeners,
      addListener: vi.fn((listener: ChangeListener) => {
        listeners.add(listener);
      }),
      removeListener: vi.fn((listener: ChangeListener) => {
        listeners.delete(listener);
      }),
    };
    if (options.withAddEventListener !== false) {
      mql.addEventListener = vi.fn((type: string, listener: ChangeListener) => {
        if (type === 'change') listeners.add(listener);
      });
      mql.removeEventListener = vi.fn((type: string, listener: ChangeListener) => {
        if (type === 'change') listeners.delete(listener);
      });
    }
    Object.defineProperty(mql, 'matches', { value: options.matches ?? false, configurable: true });
    created.push(mql);
    return mql as unknown as MediaQueryList;
  };
  Object.defineProperty(window, 'matchMedia', {
    value: matchMedia,
    configurable: true,
    writable: true,
  });
  return created;
}

let savedMatchMedia: unknown;

beforeEach(() => {
  savedMatchMedia = window.matchMedia;
});

afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(window, 'matchMedia', {
    value: savedMatchMedia,
    configurable: true,
    writable: true,
  });
  cleanup();
});

test('reports mobile when the query matches at the default breakpoint', () => {
  const mqls = installMatchMedia({ matches: true });
  const { result } = renderHook(() => useIsMobile());
  expect(mqls).toHaveLength(1);
  expect(mqls[0].query).toBe('(max-width: 768px)');
  expect(result.current).toBe(true);
});

test('reports desktop when the query does not match', () => {
  installMatchMedia({ matches: false });
  const { result } = renderHook(() => useIsMobile());
  expect(result.current).toBe(false);
});

test('accepts a custom breakpoint', () => {
  const mqls = installMatchMedia({ matches: true });
  const { result } = renderHook(() => useIsMobile(480));
  expect(mqls[0].query).toBe('(max-width: 480px)');
  expect(result.current).toBe(true);
});

test('tracks media changes until unmounted, then unsubscribes', () => {
  const mqls = installMatchMedia({ matches: false });
  const { result, unmount } = renderHook(() => useIsMobile());
  expect(result.current).toBe(false);
  act(() => {
    for (const listener of mqls[0].listeners) listener({ matches: true });
  });
  expect(result.current).toBe(true);
  unmount();
  expect(mqls[0].removeEventListener).toHaveBeenCalledTimes(1);
  expect(mqls[0].removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  expect(mqls[0].listeners.size).toBe(0);
});

test('re-subscribes when the breakpoint changes', () => {
  const mqls = installMatchMedia({ matches: true });
  const { rerender } = renderHook((breakpoint: number) => useIsMobile(breakpoint), {
    initialProps: 768,
  });
  expect(mqls).toHaveLength(1);
  expect(mqls[0].query).toBe('(max-width: 768px)');
  rerender(480);
  expect(mqls).toHaveLength(2);
  expect(mqls[1].query).toBe('(max-width: 480px)');
  expect(mqls[0].removeEventListener).toHaveBeenCalledTimes(1);
  expect(mqls[0].listeners.size).toBe(0);
});

test('falls back to the legacy addListener API', () => {
  const mqls = installMatchMedia({ matches: false, withAddEventListener: false });
  const { result, unmount } = renderHook(() => useIsMobile());
  expect(result.current).toBe(false);
  act(() => {
    for (const listener of mqls[0].listeners) listener({ matches: true });
  });
  expect(result.current).toBe(true);
  unmount();
  expect(mqls[0].removeListener).toHaveBeenCalledTimes(1);
  expect(mqls[0].listeners.size).toBe(0);
});

test('is false when matchMedia is unsupported', () => {
  Object.defineProperty(window, 'matchMedia', {
    value: undefined,
    configurable: true,
    writable: true,
  });
  const { result } = renderHook(() => useIsMobile());
  expect(result.current).toBe(false);
});

test('renders false during SSR when window is unavailable', () => {
  vi.stubGlobal('window', undefined);
  const html = renderToString(createElement(() => String(useIsMobile())));
  expect(html).toBe('false');
});
