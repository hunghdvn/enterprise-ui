import { render, screen } from '@testing-library/react';
import { ICONS } from './icons';
import { Icon } from './Icon';
import type { IconName } from './types';

test('renders an svg for a valid name', () => {
  render(<Icon name="check" />);
  const svg = document.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveAttribute('aria-hidden', 'true');
});

test('size prop sets width and height', () => {
  render(<Icon name="x" size={24} />);
  const svg = document.querySelector('svg')!;
  expect(svg).toHaveAttribute('width', '24');
  expect(svg).toHaveAttribute('height', '24');
});

test('label makes it accessible (role=img + title)', () => {
  render(<Icon name="check" label="Đã chọn" />);
  const svg = screen.getByRole('img', { name: 'Đã chọn' });
  expect(svg).toBeInTheDocument();
  expect(svg.querySelector('title')).toHaveTextContent('Đã chọn');
});

test('className is applied', () => {
  render(<Icon name="check" className="my-icon" />);
  expect(document.querySelector('svg')).toHaveClass('my-icon');
});

test('all registered icons render without error', () => {
  for (const name of Object.keys(ICONS)) {
    const { unmount } = render(<Icon name={name as IconName} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
    unmount();
  }
});

test('settings icon includes the center hub circle', () => {
  const { container } = render(<Icon name="settings" />);
  expect(container.querySelector('circle[cx="12"][cy="12"]')).not.toBeNull();
});

const EXPANDED_ICON_NAMES = [
  'arrow-up',
  'arrow-down',
  'arrow-up-right',
  'chevrons-left',
  'chevrons-right',
  'chevrons-up',
  'chevrons-down',
  'move',
  'maximize',
  'minimize',
  'layout-grid',
  'layout-list',
  'table',
  'columns-3',
  'rows-3',
  'panel-left',
  'panel-right',
  'app-window',
  'expand',
  'shrink',
  'file',
  'file-text',
  'file-plus',
  'file-check',
  'folder',
  'folder-open',
  'folder-plus',
  'save',
  'archive',
  'paperclip',
  'link',
  'unlink',
  'database',
  'server',
  'hard-drive',
  'cloud',
  'image',
  'package',
  'bar-chart-3',
  'line-chart',
  'pie-chart',
  'trending-up',
  'trending-down',
  'activity',
  'gauge',
  'users',
  'user-plus',
  'user-check',
  'user-circle',
  'building',
  'briefcase',
  'id-card',
  'shield',
  'shield-check',
  'shield-alert',
  'key',
  'log-in',
  'log-out',
  'lock-open',
  'message-circle',
  'message-square',
  'send',
  'phone',
  'video',
  'at-sign',
  'share-2',
  'megaphone',
  'shopping-cart',
  'shopping-bag',
  'credit-card',
  'dollar-sign',
  'receipt',
  'truck',
  'percent',
  'gift',
  'wallet',
  'tag',
  'bookmark',
  'star',
  'heart',
  'flag',
  'thumbs-up',
  'thumbs-down',
  'timer',
  'alarm-clock',
  'history',
  'hourglass',
  'play',
  'pause',
  'volume-2',
  'volume-x',
  'mic',
  'mic-off',
  'camera',
  'sun',
  'moon',
  'monitor',
  'smartphone',
  'laptop',
  'wifi',
  'bluetooth',
  'battery-full',
  'globe',
  'map-pin',
  'map',
  'zap',
  'target',
  'award',
  'sparkles',
  'terminal',
  'code',
  'git-branch',
  'cpu',
  'layers',
  'scissors',
  'undo-2',
  'redo-2',
  'sliders-horizontal',
  'type',
  'bold',
  'italic',
  'underline',
  'align-left',
  'align-center',
  'align-right',
  'palette',
] as const;

test.each(EXPANDED_ICON_NAMES)('registers the expanded icon %s', (name) => {
  expect(ICONS[name as IconName]).toBeDefined();
});

test('does not register the numbered building-2 alias', () => {
  expect(ICONS).not.toHaveProperty('building-2');
});

test('every registered icon draws at least one shape', () => {
  for (const name of Object.keys(ICONS)) {
    const { container, unmount } = render(<Icon name={name as IconName} />);
    const svg = container.querySelector('svg');
    expect(svg, `${name} should render an svg`).not.toBeNull();
    expect(svg!.children.length, `${name} should contain geometry`).toBeGreaterThan(0);
    unmount();
  }
});
