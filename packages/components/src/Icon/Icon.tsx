import styles from './Icon.module.css';
import { ICONS } from './icons';
import type { IconProps } from './types';

export function Icon({ name, size = 16, label, className = '' }: IconProps) {
  const accessible = !!label;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={accessible ? undefined : true}
      role={accessible ? 'img' : undefined}
      aria-label={label}
      className={`${styles.icon} ${className}`.trim()}
    >
      {accessible && <title>{label}</title>}
      {ICONS[name]}
    </svg>
  );
}
