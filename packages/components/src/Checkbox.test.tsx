import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './Checkbox';
import styles from './Checkbox.module.css';

describe('Checkbox', () => {
  it('renders an accessible native checkbox with a visible label', () => {
    render(<Checkbox>Accept terms</Checkbox>);

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('supports user interaction and controlled checked state', async () => {
    const user = userEvent.setup();
    render(<Checkbox defaultChecked>Enable notifications</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Enable notifications' });

    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('forwards native form attributes and the ref target', () => {
    render(
      <Checkbox name="terms" value="accepted" required>
        Accept terms
      </Checkbox>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).toHaveAttribute('name', 'terms');
    expect(checkbox).toHaveAttribute('value', 'accepted');
    expect(checkbox).toBeRequired();
  });

  it('supports disabled state and size styling', async () => {
    const user = userEvent.setup();
    render(
      <Checkbox disabled size="sm">
        Unavailable option
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Unavailable option' });

    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass(styles.control!);
    expect(checkbox.closest('label')).toHaveClass(styles.sm!);
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
