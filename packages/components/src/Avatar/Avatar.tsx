import { useEffect, useRef, useState } from 'react';
import { cx } from '../internal/cx';
import styles from './Avatar.module.css';
import type { AvatarProps } from './types';

function initial(word: string): string {
  const first = Array.from(word.normalize('NFC'))[0] ?? '';
  return Array.from(first.toUpperCase())[0] ?? '';
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = initial(words[0]);
  const last = words.length > 1 ? initial(words[words.length - 1]) : '';
  return `${first}${last}`;
}

export function Avatar({ name, src, alt, size = 'md', className = '', ...rest }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [prevSrc, setPrevSrc] = useState(src);
  const imageRef = useRef<HTMLImageElement>(null);
  const trimmedAlt = alt?.trim() ?? '';
  const decorative = alt === '';
  const label = trimmedAlt || (name.trim() ? name : '?');
  const showImage = Boolean(src) && failedSrc !== src;

  // A URL that failed once must not stay failed after the caller switches away
  // and back. Reset during render (React's prop-change pattern) so the retry
  // renders the <img> immediately instead of waiting for an effect.
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailedSrc(null);
  }

  // SSR sends the <img> in the HTML; the browser can fail it before the island
  // hydrates, and React does not replay load/error events on hydration. Reconcile
  // once on mount and on every src change so a pre-failed URL still falls back.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      setFailedSrc(src ?? null);
    }
  }, [src]);

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
          ref={imageRef}
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
