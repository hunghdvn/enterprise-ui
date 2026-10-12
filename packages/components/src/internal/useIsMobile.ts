import { useEffect, useState } from 'react';

/**
 * True while the viewport is at most `breakpoint` pixels wide (default 768).
 * SSR-safe: renders `false` until an effect confirms a matching media query,
 * and stays `false` when `window`/`matchMedia` are unavailable. The change
 * listener is removed when the component unmounts or the breakpoint changes.
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
