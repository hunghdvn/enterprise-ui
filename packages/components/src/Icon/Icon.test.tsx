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
