import type { FieldsetHTMLAttributes, ReactNode } from 'react';

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange'
> {
  /** Visible group label, always rendered as the `<legend>`. Required. */
  legend: ReactNode;
  /** Muted helper text under the legend. */
  hint?: ReactNode;
  /** Error text. Wins over the `Form` `errors[name]` lookup. */
  error?: string;
  /** Key into `Form` `errors`; also the `name` shared by the radios when set. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial value when uncontrolled; seeds the matching Radio. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Default `'vertical'`; `'horizontal'` wraps. */
  orientation?: 'vertical' | 'horizontal';
  /** Cascades to descendant radios; a per-radio `size` overrides it. */
  size?: 'sm' | 'md';
  required?: boolean;
  children: ReactNode;
}
