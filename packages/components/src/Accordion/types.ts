import type { HTMLAttributes, ReactNode } from 'react';

export type AccordionSize = 'sm' | 'md';
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionItem {
  /** Stable identity for `key` and the controlled value. */
  id: string;
  /** Header content; rendered inside the trigger button, so no controls. */
  title: ReactNode;
  /** Panel content; may contain controls. */
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'children' | 'defaultValue' | 'value'
> {
  items: readonly AccordionItem[];
  /** Default `'md'`. */
  size?: AccordionSize;
  /** Heading wrapper level; default `3`. */
  headingLevel?: AccordionHeadingLevel;
}

export interface AccordionSingleProps extends AccordionBaseProps {
  multiple?: false;
  /**
   * Controlled open item; `null` closes everything. Dropping the prop mid-life
   * falls back to the mount-time seed (the Tabs/SegmentedControl convention),
   * not to the last controlled value.
   */
  value?: string | null;
  /** Initial open item; default `null` (all closed). */
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  multiple: true;
  /** Controlled open items; dropping the prop falls back to the mount-time seed. */
  values?: readonly string[];
  /** Initial open items; default `[]`. */
  defaultValues?: readonly string[];
  onChange?: (values: string[]) => void;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;
