export type IconName =
  | 'check'
  | 'x'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-left'
  | 'arrow-right'
  | 'plus'
  | 'minus'
  | 'search'
  | 'filter'
  | 'settings'
  | 'user'
  | 'bell'
  | 'mail'
  | 'home'
  | 'edit'
  | 'trash'
  | 'download'
  | 'upload'
  | 'copy'
  | 'check-circle'
  | 'refresh'
  | 'info'
  | 'alert-circle'
  | 'alert-triangle'
  | 'help-circle'
  | 'calendar'
  | 'clock'
  | 'eye'
  | 'eye-off'
  | 'external-link'
  | 'inbox'
  | 'lock'
  | 'menu'
  | 'more-horizontal';

export interface IconProps {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
}
