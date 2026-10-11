import type { ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { useOptionalTheme, useTheme } from '../ThemeProvider/ThemeContext';
import styles from './FilterBar.module.css';

export interface FilterBarProps {
  searchValue: string;
  onSearch: (value: string) => void;
  filters?: ReactNode;
  onReset?: () => void;
  /**
   * Show the density toggle. Defaults to true when a ThemeProvider is present
   * and false outside one — without a provider there is nothing to toggle.
   */
  densityToggle?: boolean;
  searchPlaceholder?: string;
}

function DensityToggleButton() {
  const { density, setDensity } = useTheme();
  const next = density === 'compact' ? 'comfortable' : 'compact';
  const label = density === 'compact' ? 'Gọn' : 'Thoáng';
  return (
    <Button
      variant="secondary"
      size="sm"
      aria-label={`Mật độ: ${label}`}
      title="Chuyển mật độ hiển thị"
      onClick={() => setDensity(next)}
    >
      Mật độ: {label}
    </Button>
  );
}

export function FilterBar({
  searchValue,
  onSearch,
  filters,
  onReset,
  densityToggle,
  searchPlaceholder = 'Tìm kiếm…',
}: FilterBarProps) {
  const theme = useOptionalTheme();
  const showDensityToggle = densityToggle ?? theme !== null;
  return (
    <div className={styles.bar} role="search">
      <Input
        type="search"
        aria-label="Tìm kiếm"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
      />
      {filters && <div className={styles.filters}>{filters}</div>}
      <span className={styles.spacer} />
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Đặt lại
        </Button>
      )}
      {showDensityToggle && <DensityToggleButton />}
    </div>
  );
}
