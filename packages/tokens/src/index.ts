/**
 * Typed references for the public design-token names.
 * The CSS custom properties are defined in ./tokens.css.
 */
export const designTokens = {
  color: {
    primary: 'var(--eui-color-primary)',
    primaryHover: 'var(--eui-color-primary-hover)',
    text: 'var(--eui-color-text)',
    muted: 'var(--eui-color-text-muted)',
    border: 'var(--eui-color-border)',
    surface: 'var(--eui-color-surface)',
    danger: 'var(--eui-color-danger)',
  },
  radius: {
    sm: 'var(--eui-radius-sm)',
    md: 'var(--eui-radius-md)',
    lg: 'var(--eui-radius-lg)',
  },
  spacing: {
    1: 'var(--eui-spacing-1)',
    2: 'var(--eui-spacing-2)',
    3: 'var(--eui-spacing-3)',
    4: 'var(--eui-spacing-4)',
    6: 'var(--eui-spacing-6)',
  },
} as const;

export type DesignTokens = typeof designTokens;
