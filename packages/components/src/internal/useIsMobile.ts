import { useEffect, useState } from 'react';

/**
 * Synchronous read of the mobile media query (SSR-safe: `false` without a
 * DOM). `useIsMobile` is two-phase on purpose (see below), so consumers that
 * must never act on the un-confirmed first commit read this instead.
 */
export function matchesMobileMedia(breakpoint = 768): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
}

/**
 * True while the viewport is at most `breakpoint` pixels wide (default 768).
 * SSR-safe: renders `false` until an effect confirms a matching media query,
 * and stays `false` when `window`/`matchMedia` are unavailable. The change
 * listener is removed when the component unmounts or the breakpoint changes.
 *
 * Hydration caveat (round-6 #2): the two-phase start means SSR output always
 * shows the desktop layout; a client hydrate on a phone swaps to the mobile
 * tree, so an SSR hydrate would mismatch there. This package targets Vite
 * CSR — if SSR ever lands, move to `useSyncExternalStore` (getSnapshot via
 * `matchesMobileMedia`, server snapshot `false`) so hydration is stable AND
 * the first paint is correct.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setIsMobile(false);
      return;
    }
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mediaQuery.matches);
    const onChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    };
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange);
    } else {
      mediaQuery.addListener(onChange);
    }
    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', onChange);
      } else {
        mediaQuery.removeListener(onChange);
      }
    };
  }, [breakpoint]);

  return isMobile;
}
