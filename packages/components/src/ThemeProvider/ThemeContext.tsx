import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';
export type Density = 'compact' | 'comfortable';

export interface ThemeCtx {
  theme: Theme;
  density: Density;
  setTheme: (t: Theme) => void;
  setDensity: (d: Density) => void;
}

export const Ctx = createContext<ThemeCtx>({
  theme: 'light',
  density: 'compact',
  setTheme: () => {},
  setDensity: () => {},
});

export const useTheme = () => useContext(Ctx);
