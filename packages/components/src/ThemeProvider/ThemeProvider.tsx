import { useState, useEffect, type ReactNode } from 'react';
import { Ctx, type Theme, type Density } from './ThemeContext';

export function ThemeProvider({
  children,
  theme: init = 'light',
  density: initD = 'compact'
}: {
  children: ReactNode;
  theme?: Theme;
  density?: Density;
}) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('eui-theme') as Theme) || init);
  const [density, setDensity] = useState<Density>(
    () => (localStorage.getItem('eui-density') as Density) || initD
  );

  useEffect(() => {
    localStorage.setItem('eui-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('eui-density', density);
  }, [density]);

  return (
    <Ctx.Provider value={{ theme, density, setTheme, setDensity }}>
      <div data-enterprise-ui data-theme={theme} data-density={density}>
        {children}
      </div>
    </Ctx.Provider>
  );
}
