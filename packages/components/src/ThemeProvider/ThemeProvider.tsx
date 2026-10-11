import { useState, useEffect, type ReactNode } from 'react';
import { Ctx, type Theme, type Density } from './ThemeContext';

export { useTheme } from './ThemeContext';

function readTheme(init: Theme): Theme {
  try {
    if (typeof window === 'undefined') return init;
    const v = window.localStorage.getItem('eui-theme');
    return v === 'light' || v === 'dark' ? v : init;
  } catch {
    return init;
  }
}

function readDensity(init: Density): Density {
  try {
    if (typeof window === 'undefined') return init;
    const v = window.localStorage.getItem('eui-density');
    return v === 'compact' || v === 'comfortable' ? v : init;
  } catch {
    return init;
  }
}

export function ThemeProvider({
  children,
  theme: init = 'light',
  density: initD = 'compact'
}: {
  children: ReactNode;
  theme?: Theme;
  density?: Density;
}) {
  const [theme, setTheme] = useState<Theme>(() => readTheme(init));
  const [density, setDensity] = useState<Density>(() => readDensity(initD));

  useEffect(() => {
    try {
      window.localStorage.setItem('eui-theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem('eui-density', density);
    } catch {
      /* ignore */
    }
  }, [density]);

  return (
    <Ctx.Provider value={{ theme, density, setTheme, setDensity }}>
      <div data-enterprise-ui data-theme={theme} data-density={density}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
