import type { ReactNode } from 'react';
import { cx } from '../internal/cx';
import styles from './Divider.module.css';
import type { DividerProps } from './types';

export function Divider({
  orientation = 'horizontal',
  label,
  spacing = 'md',
  align = 'center',
  className = '',
  ...rest
}: DividerProps) {
  // Drop children if a JS caller bypasses the type: <hr> is a void element and
  // would otherwise throw when the extra key reaches it.
  const { children: _children, ...rootProps } = rest as typeof rest & { children?: ReactNode };
  // A whitespace-only label has no accessible name after trimming, so it takes the
  // same path as `label=""` (plain `<hr>`) instead of rendering a nameless separator.
  // The `typeof` guard keeps a JS caller that bypasses the type (null, number) from
  // crashing on `.trim()`.
  const labelled = orientation === 'horizontal' && typeof label === 'string' && label.trim() !== '';
  const shared = {
    ...rootProps,
    'data-orientation': orientation,
    'data-spacing': spacing,
    'data-align': labelled ? align : undefined,
    'data-labelled': labelled ? '' : undefined,
    className: cx(styles.root, className),
  };

  if (orientation === 'vertical') {
    return <div {...shared} role="separator" aria-orientation="vertical" />;
  }
  if (labelled) {
    return (
      <div {...shared} role="separator" aria-orientation="horizontal" aria-label={label}>
        <span className={styles.label} aria-hidden="true">
          {label}
        </span>
      </div>
    );
  }
  return <hr {...shared} />;
}
