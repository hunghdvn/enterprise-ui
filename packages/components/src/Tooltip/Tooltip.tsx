import { cloneElement, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './Tooltip.module.css';
import type { TooltipProps } from './types';

const FLIP_THRESHOLD = 40;

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 200,
  className,
  ...rest
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);
  const [actualPlacement, setActualPlacement] = useState(placement);
  const [prevPlacement, setPrevPlacement] = useState(placement);
  if (prevPlacement !== placement) {
    setPrevPlacement(placement);
    setActualPlacement(placement);
  }
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const childProps = useMemo(() => (children.props ?? {}) as Record<string, unknown>, [children]);

  const computePlacement = useCallback(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) return placement;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const space = {
      top: rect.top,
      bottom: vh - rect.bottom,
      left: rect.left,
      right: vw - rect.right,
    };
    if (placement === 'top' && space.top < FLIP_THRESHOLD && space.bottom >= space.top) {
      return 'bottom';
    }
    if (placement === 'bottom' && space.bottom < FLIP_THRESHOLD && space.top >= space.bottom) {
      return 'top';
    }
    if (placement === 'left' && space.left < FLIP_THRESHOLD && space.right >= space.left) {
      return 'right';
    }
    if (placement === 'right' && space.right < FLIP_THRESHOLD && space.left >= space.right) {
      return 'left';
    }
    return placement;
  }, [placement]);

  const show = useCallback(() => {
    setTimerId((prev) => {
      if (prev !== null) window.clearTimeout(prev);
      setActualPlacement(computePlacement());
      return window.setTimeout(() => setVisible(true), delay);
    });
  }, [computePlacement, delay]);

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

  const mergedClassName = [childProps['className'], className]
    .filter((v) => typeof v === 'string' && v.trim() !== '')
    .join(' ')
    .trim();

  const cloneProps: Record<string, unknown> = {
    ...rest,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  };
  if (mergedClassName) cloneProps.className = mergedClassName;
  if (describedBy) cloneProps['aria-describedby'] = describedBy;

  const child = cloneElement(children, cloneProps);

  const wrapperClassName = [styles.wrapper, className].filter(Boolean).join(' ').trim();

  return (
    <span ref={wrapperRef} className={wrapperClassName || styles.wrapper}>
      {child}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={[styles.tooltip, className].filter(Boolean).join(' ').trim()}
          data-placement={actualPlacement}
        >
          {content}
        </span>
      )}
    </span>
  );
}
