import { useState } from 'react';
import { cx } from '../internal/cx';
import styles from './Avatar.module.css';
import type { AvatarProps } from './types';

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = Array.from(words[0])[0] ?? '';
  const last = words.length > 1 ? (Array.from(words[words.length - 1])[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

export function Avatar({ name, src, alt, size = 'md', className = '', ...rest }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const decorative = alt === '';
  const label = alt ?? (name.trim() ? name : '?');
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <span
      className={cx(styles.avatar, className)}
      data-size={size}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt=""
          aria-hidden="true"
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initials(name)}
        </span>
      )}
    </span>
  );
}
