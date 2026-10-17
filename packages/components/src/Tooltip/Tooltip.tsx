import { cloneElement, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { cx } from '../internal/cx';
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
  const [actualPlacement, setActualPlacement] = useState(placement);
  const [prevPlacement, setPrevPlacement] = useState(placement);
  if (prevPlacement !== placement) {
    setPrevPlacement(placement);
    setActualPlacement(placement);
  }
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  // Timer id lives in a ref, not state: side effects (clearTimeout/setTimeout)
  // must never run inside a state updater — StrictMode double-invokes updaters,
  // which used to lose one timer id and orphan a show() timer.
  const timerRef = useRef<number | null>(null);

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

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearTimer();
    setActualPlacement(computePlacement());
    timerRef.current = window.setTimeout(() => setVisible(true), delay);
  }, [clearTimer, computePlacement, delay]);

  const hide = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  // Clear any pending show when the component unmounts.
  useEffect(() => clearTimer, [clearTimer]);

  const existingDescribedBy = childProps['aria-describedby'] as string | undefined;

  const describedBy = visible ? cx(existingDescribedBy, tooltipId) || undefined : existingDescribedBy;

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

  // `className` styles the wrapper (the positioning context) only — the child
  // keeps its own className untouched and the bubble never receives it, so
  // trigger-only utilities (truncate, transforms) cannot break the tooltip.
  const childClassName = childProps['className'];

  const cloneProps: Record<string, unknown> = {
    ...rest,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  };
  if (typeof childClassName === 'string' && childClassName.trim() !== '') {
    cloneProps.className = childClassName;
  }
  if (describedBy) cloneProps['aria-describedby'] = describedBy;

  const child = cloneElement(children, cloneProps);

  return (
    <span ref={wrapperRef} className={cx(styles.wrapper, className)}>
      {child}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={styles.tooltip}
          data-placement={actualPlacement}
        >
          {content}
        </span>
      )}
    </span>
  );
}
