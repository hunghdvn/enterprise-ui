import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('supports accessible labels and user input', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Project name" />);
    const input = screen.getByRole('textbox', { name: 'Project name' });
    await user.type(input, 'Enterprise UI');
    expect(input).toHaveValue('Enterprise UI');
  });

  it('marks invalid input accessibly and links its error message', () => {
    render(
      <>
        <Input aria-label="Email" aria-describedby="email-error" invalid />
        <p id="email-error">Enter a valid email address.</p>
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  });

  it('does not mark valid input as invalid', () => {
    render(<Input aria-label="Account ID" />);
    expect(screen.getByRole('textbox', { name: 'Account ID' })).not.toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('supports the native disabled state', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Read-only field" disabled />);
    const input = screen.getByRole('textbox', { name: 'Read-only field' });

    expect(input).toBeDisabled();
    await user.type(input, 'ignored');
    expect(input).toHaveValue('');
  });
});
