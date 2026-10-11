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

  it('marks invalid input accessibly', () => {
    render(<Input aria-label="Email" invalid />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true');
  });
});
