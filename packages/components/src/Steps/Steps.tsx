import { Icon } from '../Icon';
import type { StepsProps } from './types';
import styles from './Steps.module.css';

export function Steps({
  steps,
  currentStep,
  onChange,
  size = 'sm',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: StepsProps) {
  const total = steps.length;
  const safeStep = Math.max(0, Math.min(currentStep, total));
  const isDone = safeStep >= total;
  const canGoBack = safeStep > 0 && !!onChange && !disabled;
  const canGoNext = safeStep < total - 1 && !!onChange && !disabled;
  const canFinish = safeStep === total - 1 && !!onChange && !disabled;

  const goBack = () => onChange?.(safeStep - 1);
  const goNext = () => onChange?.(safeStep + 1);
  const finish = () => onChange?.(total);

  return (
    <div
      className={className ? `${styles.wrap} ${className}` : styles.wrap}
      data-disabled={disabled || undefined}
    >
      <ol className={styles.steps} aria-label={ariaLabel ?? 'Các bước'}>
        {steps.map((step, index) => {
          const state = index < safeStep ? 'done' : index === safeStep ? 'current' : 'upcoming';
          const clickable = index <= safeStep && !!onChange && !disabled;
          return (
            <li
              key={step.id}
              className={styles.step}
              data-state={state}
              data-optional={step.optional || undefined}
            >
              <button
                type="button"
                className={styles.marker}
                data-size={size}
                data-state={state}
                disabled={!clickable}
                aria-current={index === safeStep ? 'step' : undefined}
                aria-label={`${index + 1}. ${step.label}`}
                onClick={() => {
                  if (clickable) onChange?.(index);
                }}
              >
                {index < safeStep ? <Icon name="check" size={12} /> : index + 1}
              </button>
              <span className={styles.stepLabel}>{step.label}</span>
              {step.optional && <span className={styles.optional}>tuỳ chọn</span>}
            </li>
          );
        })}
      </ol>
      <div className={styles.nav}>
        {canGoBack && (
          <button type="button" className={styles.navBtn} onClick={goBack}>
            ‹ Quay lại
          </button>
        )}
        {canGoNext && (
          <button type="button" className={styles.navBtnPrimary} onClick={goNext}>
            Tiếp theo ›
          </button>
        )}
        {canFinish && (
          <button type="button" className={styles.navBtnPrimary} onClick={finish}>
            Hoàn tất
          </button>
        )}
      </div>
      {isDone && <p className={styles.done}>Hoàn tất tất cả các bước.</p>}
    </div>
  );
}
