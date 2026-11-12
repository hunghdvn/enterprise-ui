import type { HTMLAttributes } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Person's display name; required. Drives the initials fallback. */
  name: string;
  /** Image URL. When absent or the image fails, initials render instead. */
  src?: string;
  /**
   * Accessible name for the image. Defaults to `name`.
   * Pass `''` when the name is already visible next to the avatar: the whole
   * mark becomes decorative (`aria-hidden`, no `role`).
   */
  alt?: string;
  /** Diameter. Default `'md'`. */
  size?: AvatarSize;
}
