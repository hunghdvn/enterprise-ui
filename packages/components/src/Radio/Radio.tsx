import { useContext, type ChangeEvent } from 'react';
import { RadioGroupContext } from '../RadioGroup/RadioGroup';
import { cx } from '../internal/cx';
import styles from './Radio.module.css';
import type { RadioProps } from './types';

export function Radio({
  size,
  className = '',
  children,
  value,
  name,
  checked,
  defaultChecked,
  onChange,
  ...rest
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  const resolvedSize = size ?? group?.size ?? 'sm';
  // Inside a controlled group, the group's value always decides what is checked;
  // the radio's own props only matter when the group is uncontrolled.
  const controlled = group?.value !== undefined;
  const resolvedChecked = controlled ? group.value === value : checked;
  const resolvedDefaultChecked = controlled
    ? undefined
    : (defaultChecked ??
      (group?.defaultValue !== undefined ? group.defaultValue === value : undefined));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    group?.onChange?.(event.currentTarget.value);
  };

  return (
    <label data-size={resolvedSize} className={cx(styles.label, className)}>
      <input
        type="radio"
        value={value}
        name={name ?? group?.name}
        checked={resolvedChecked}
        defaultChecked={resolvedDefaultChecked}
        onChange={handleChange}
        className={styles.box}
        {...rest}
      />
      {children}
    </label>
  );
}
