import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';

const css = readFileSync(join(import.meta.dirname, 'Checkbox.module.css'), 'utf8');

test('renders label and reflects checked', () => {
  render(<Checkbox>Đồng ý</Checkbox>);
  const box = screen.getByRole('checkbox');
  expect(box).not.toBeChecked();
  expect(screen.getByText('Đồng ý')).toBeInTheDocument();
});

test('renders disabled checkbox', () => {
  render(<Checkbox disabled>Đồng ý</Checkbox>);
  expect(screen.getByRole('checkbox')).toBeDisabled();
});

test('checked prop and onChange', () => {
  const fn = vi.fn();
  render(
    <Checkbox checked onChange={fn}>
      Nhớ tôi
    </Checkbox>,
  );
  const box = screen.getByRole('checkbox');
  expect(box).toBeChecked();
  fireEvent.click(box);
  expect(fn).toHaveBeenCalled();
});

test('module CSS scopes the md control size to the label, not any ancestor', () => {
  expect(css).toMatch(/\.label\[data-size='md'\] \.box/);
  expect(css).not.toMatch(/^\[data-size='md'\] \.box \{/m);
});
