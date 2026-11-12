import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { cssRule } from '../internal/cssRule';
import { Avatar } from './Avatar';

const css = readFileSync(join(import.meta.dirname, 'Avatar.module.css'), 'utf8');

test('renders the image with the name as its accessible label', () => {
  const { container } = render(<Avatar name="Nguyễn An" src="/an.jpg" />);
  expect(screen.getByRole('img', { name: 'Nguyễn An' })).toHaveAttribute('data-size', 'md');
  const img = container.querySelector('img')!;
  expect(img).toHaveAttribute('src', '/an.jpg');
  expect(img).toHaveAttribute('alt', '');
  expect(img).toHaveAttribute('aria-hidden', 'true');
});

test('derives two initials from a multi-word Vietnamese name', () => {
  render(<Avatar name="nguyễn văn an" />);
  expect(screen.getByText('NA')).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByRole('img', { name: 'nguyễn văn an' })).toBeInTheDocument();
});

test('a single-word name yields one initial', () => {
  render(<Avatar name="An" />);
  expect(screen.getByText('A')).toBeInTheDocument();
});

test('a whitespace-only name still has an accessible label and initial', () => {
  render(<Avatar name="   " />);
  expect(screen.getByRole('img', { name: '?' })).toBeInTheDocument();
  expect(screen.getByText('?')).toBeInTheDocument();
});

test('falls back to initials when the image fails, and a new src retries', () => {
  const { container, rerender } = render(<Avatar name="Nguyễn An" src="/broken.jpg" />);
  fireEvent.error(container.querySelector('img')!);
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('NA')).toBeInTheDocument();

  rerender(<Avatar name="Nguyễn An" src="/an.jpg" />);
  expect(container.querySelector('img')).toHaveAttribute('src', '/an.jpg');
});

test('reconciles an image that failed before hydration', () => {
  const complete = vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true);
  const naturalWidth = vi
    .spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get')
    .mockReturnValue(0);
  try {
    const { container } = render(<Avatar name="Nguyễn An" src="/broken.jpg" />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('NA')).toBeInTheDocument();
  } finally {
    complete.mockRestore();
    naturalWidth.mockRestore();
  }
});

test('alt overrides the accessible label', () => {
  render(<Avatar name="Nguyễn An" src="/an.jpg" alt="Ảnh hồ sơ của An" />);
  expect(screen.getByRole('img', { name: 'Ảnh hồ sơ của An' })).toBeInTheDocument();
});

test('alt="" makes the avatar decorative', () => {
  const { container } = render(<Avatar name="Nguyễn An" src="/an.jpg" alt="" />);
  const root = container.firstElementChild!;
  expect(root).toHaveAttribute('aria-hidden', 'true');
  expect(root).not.toHaveAttribute('role');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test('size variants set data-size and rest lands on the root', () => {
  const { container } = render(
    <>
      <Avatar name="An" />
      <Avatar name="Bình" size="sm" className="custom" data-testid="sm-avatar" />
      <Avatar name="Chi" size="lg" />
    </>,
  );
  const sizes = [...container.querySelectorAll('[data-size]')].map((el) =>
    el.getAttribute('data-size'),
  );
  expect(sizes).toEqual(['md', 'sm', 'lg']);
  expect(screen.getByTestId('sm-avatar')).toHaveClass('custom');
});

test('module CSS pins three scoped sizes, the ring and image cover', () => {
  expect(cssRule(css, ".avatar[data-size='sm']")).toMatch(/width:\s*24px/);
  expect(cssRule(css, ".avatar[data-size='md']")).toMatch(/width:\s*32px/);
  expect(cssRule(css, ".avatar[data-size='lg']")).toMatch(/width:\s*48px/);
  expect(cssRule(css, '.avatar')).toMatch(/border-radius:\s*50%/);
  expect(cssRule(css, '.avatar')).toMatch(/box-shadow:\s*inset 0 0 0 1px var\(--border\)/);
  expect(cssRule(css, '.image')).toMatch(/object-fit:\s*cover/);
  expect(css).not.toMatch(/^\[data-size='(sm|md|lg)'\]/m);
});
