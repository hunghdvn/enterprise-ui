import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import styles from './Button.module.css';

describe('Button', () => {
  it('renders its accessible name and responds to clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('can be reached and activated with the keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('prevents activation while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Saving' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('[aria-hidden="true"]')).toHaveClass(styles.spinner!);
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports native button attributes and variants', () => {
    render(
      <Button type="submit" variant="secondary" data-testid="submit-button">
        Submit
      </Button>,
    );
    const button = screen.getByTestId('submit-button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveClass(styles.secondary!, styles.md!);
  });

  it('applies variant and size classes', () => {
    const { rerender } = render(<Button variant="danger" size="sm">Delete</Button>);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(styles.danger!, styles.sm!);

    rerender(<Button variant="ghost" size="lg">Cancel</Button>);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(styles.ghost!, styles.lg!);
  });

  it('does not allow disabled buttons to receive focus', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Button disabled>Unavailable</Button>
        <Button>Available</Button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Available' })).toHaveFocus();
  });
});
