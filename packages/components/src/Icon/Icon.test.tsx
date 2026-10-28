import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ICONS } from './icons';
import manifest from './icons.manifest.json';
import removed from './icons.removed.json';
import { Icon } from './Icon';
import type { IconName } from './types';

// Keep this in sync with the same helper in scripts/gen-icon-manifest.ts.
const geometryHash = (name: IconName) => {
  const markup = renderToStaticMarkup(ICONS[name]).replace(/\s+/g, ' ').trim();
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < markup.length; index += 1) {
    hash ^= BigInt(markup.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
};

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
  const hub = container.querySelector('circle[cx="12"][cy="12"]');
  expect(hub).not.toBeNull();
  expect(hub).toHaveAttribute('r', '3');
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
  'columns',
  'rows',
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
  'bar-chart',
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
  'share',
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
  'volume',
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
  'undo',
  'redo',
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

test('uses clean names without numeric suffixes', () => {
  const names = Object.keys(ICONS);
  expect(names.filter((name) => /-\d+$/.test(name))).toEqual([]);
});

test('catalog matches the checked-in manifest', () => {
  const names = Object.keys(ICONS).sort();
  expect(manifest.algorithm).toBe('fnv1a-64');
  expect(manifest.count).toBe(Object.keys(manifest.icons).length);
  expect(names).toHaveLength(manifest.count);
  expect(names).toEqual(Object.keys(manifest.icons).sort());
  for (const name of names) {
    expect(geometryHash(name as IconName), `${name} geometry changed`).toBe(
      (manifest.icons as Record<string, string>)[name],
    );
  }
});

test('does not re-add icons removed from the catalog', () => {
  expect(removed.count).toBe(removed.icons.length);
  for (const name of removed.icons) {
    expect(ICONS, `${name} was removed and must not return`).not.toHaveProperty(name);
  }
});

const ALIASES = {
  house: 'home',
  'triangle-alert': 'alert-triangle',
  'circle-question-mark': 'help-circle',
  funnel: 'filter',
  ellipsis: 'more-horizontal',
  'circle-alert': 'alert-circle',
  'circle-help': 'help-circle',
  'circle-user': 'user-circle',
  refresh: 'refresh-cw',
  edit: 'square-pen',
  'bar-chart': 'chart-no-axes-column-increasing',
  'check-circle': 'circle-check-big',
  'chart-line': 'line-chart',
  'chart-pie': 'pie-chart',
  'text-align-start': 'align-left',
  'text-align-center': 'align-center',
  'text-align-end': 'align-right',
  'square-arrow-down-left': 'arrow-down-left-square',
  'square-arrow-down-right': 'arrow-down-right-square',
  'square-arrow-down': 'arrow-down-square',
  'circle-gauge': 'gauge-circle',
  'hand-helping': 'helping-hand',
  'square-m': 'm-square',
  'square-parking': 'parking-square',
  'square-parking-off': 'parking-square-off',
} as const;

test.each(Object.entries(ALIASES))('%s shares the canonical %s geometry', (alias, canonical) => {
  expect(ICONS[alias as IconName], `${alias} must be registered`).toBeDefined();
  expect(ICONS[canonical as IconName], `${canonical} must be registered`).toBeDefined();
  const aliasHash = geometryHash(alias as IconName);
  expect(aliasHash, `${alias} must draw geometry`).not.toBe('');
  expect(aliasHash).toBe(geometryHash(canonical as IconName));
});

const CANONICAL_GLYPHS = {
  columns: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 3v18" />
    </>
  ),
  rows: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 12h18" />
    </>
  ),
  share: (
    <>
      <path d="M12 2v13" />
      <path d="m16 6-4-4-4 4" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    </>
  ),
  building: (
    <>
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M12 6h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
      <path d="M8 6h.01" />
      <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <rect x="4" y="2" width="16" height="20" rx="2" />
    </>
  ),
  volume: (
    <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
  ),
  undo: (
    <>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </>
  ),
  redo: (
    <>
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </>
  ),
  'bar-chart': (
    <>
      <path d="M5 21v-6" />
      <path d="M12 21V9" />
      <path d="M19 21V3" />
    </>
  ),
};

test.each(Object.entries(CANONICAL_GLYPHS))(
  '%s uses the canonical Lucide 0.545.0 glyph',
  (name, glyph) => {
    expect(renderToStaticMarkup(ICONS[name as IconName])).toBe(renderToStaticMarkup(glyph));
  },
);

test('every registered icon draws at least one shape', () => {
  for (const name of Object.keys(ICONS)) {
    const { container, unmount } = render(<Icon name={name as IconName} />);
    const svg = container.querySelector('svg');
    expect(svg, `${name} should render an svg`).not.toBeNull();
    expect(svg!.children.length, `${name} should contain geometry`).toBeGreaterThan(0);
    unmount();
  }
});
