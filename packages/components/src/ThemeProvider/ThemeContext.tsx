import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';
export type Density = 'compact' | 'comfortable';

export interface ThemeCtx {
  theme: Theme;
  density: Density;
  setTheme: (t: Theme) => void;
  setDensity: (d: Density) => void;
}

export const Ctx = createContext<ThemeCtx | null>(null);

/** Theme state. Throws when rendered outside a ThemeProvider. */
export const useTheme = (): ThemeCtx => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};

/** Null outside a provider — for components that adapt instead of crashing. */
export const useOptionalTheme = (): ThemeCtx | null => useContext(Ctx);
