import { cloneElement, useCallback, useEffect, useId, useMemo, useState } from 'react';
import styles from './Tooltip.module.css';
import type { TooltipProps } from './types';

export function Tooltip({ content, children, placement = 'top', delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  const tooltipId = useId();

  const childProps = useMemo(() => (children.props ?? {}) as Record<string, unknown>, [children]);

  const show = useCallback(() => {
    setTimerId((prev) => {
      if (prev !== null) window.clearTimeout(prev);
      return window.setTimeout(() => setVisible(true), delay);
    });
  }, [delay]);

  const hide = useCallback(() => {
    setTimerId((prev) => {
      if (prev !== null) window.clearTimeout(prev);
      return null;
    });
    setVisible(false);
  }, []);

  // Clear any pending show when the timer changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, [timerId]);

  const existingDescribedBy = childProps['aria-describedby'] as string | undefined;

  const describedBy = visible
    ? [existingDescribedBy, tooltipId].filter(Boolean).join(' ') || undefined
    : existingDescribedBy;

  const handleMouseEnter = useCallback(
    (event: unknown) => {
      const prev = childProps.onMouseEnter;
      if (typeof prev === 'function') (prev as (e: unknown) => void)(event);
      show();
    },
    [childProps, show],
  );

  const handleMouseLeave = useCallback(
    (event: unknown) => {
      const prev = childProps.onMouseLeave;
      if (typeof prev === 'function') (prev as (e: unknown) => void)(event);
      hide();
    },
    [childProps, hide],
  );

  const handleFocus = useCallback(
    (event: unknown) => {
      const prev = childProps.onFocus;
      if (typeof prev === 'function') (prev as (e: unknown) => void)(event);
      show();
    },
    [childProps, show],
  );

  const handleBlur = useCallback(
    (event: unknown) => {
      const prev = childProps.onBlur;
      if (typeof prev === 'function') (prev as (e: unknown) => void)(event);
      hide();
    },
    [childProps, hide],
  );

  const handleKeyDown = useCallback(
    (event: unknown) => {
      const prev = childProps.onKeyDown;
      if (typeof prev === 'function') (prev as (e: unknown) => void)(event);
      if ((event as { key?: string })?.key === 'Escape') hide();
    },
    [childProps, hide],
  );

  const cloneProps: Record<string, unknown> = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  };
  if (describedBy) cloneProps['aria-describedby'] = describedBy;

  const child = cloneElement(children, cloneProps);

  return (
    <span className={styles.wrapper}>
      {child}
      {visible && (
        <span id={tooltipId} role="tooltip" className={styles.tooltip} data-placement={placement}>
          {content}
        </span>
      )}
    </span>
  );
}
