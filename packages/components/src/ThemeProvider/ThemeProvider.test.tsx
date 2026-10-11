import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './ThemeContext';

function Probe() {
  const t = useTheme();
  return (
    <button onClick={() => t.setDensity('comfortable')}>
      {t.theme}-{t.density}
    </button>
  );
}

test('defaults light-compact and switches density', () => {
  window.localStorage.removeItem('eui-theme');
  window.localStorage.removeItem('eui-density');
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(screen.getByRole('button')).toHaveTextContent('light-compact');
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('light-comfortable');
  expect(document.querySelector('[data-enterprise-ui]')).toHaveAttribute(
    'data-density',
    'comfortable',
  );
});

test('falls back to init on tampered stored values', () => {
  window.localStorage.setItem('eui-theme', 'blue');
  window.localStorage.setItem('eui-density', 'wide');
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(screen.getByRole('button')).toHaveTextContent('light-compact');
  expect(document.querySelector('[data-enterprise-ui]')).toHaveAttribute('data-theme', 'light');
  expect(document.querySelector('[data-enterprise-ui]')).toHaveAttribute('data-density', 'compact');
  window.localStorage.removeItem('eui-theme');
  window.localStorage.removeItem('eui-density');
});
