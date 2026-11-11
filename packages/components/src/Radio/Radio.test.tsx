import { useState } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import { Radio } from './Radio';

const css = readFileSync(join(import.meta.dirname, 'Radio.module.css'), 'utf8');

test('label click selects the radio (uncontrolled)', () => {
  render(<Radio value="email">Email</Radio>);
  const input = screen.getByRole('radio', { name: 'Email' });
  expect(input).not.toBeChecked();
  fireEvent.click(screen.getByText('Email'));
  expect(input).toBeChecked();
});

test('controlled checked + onChange reflect the caller state', () => {
  function Wrapper() {
    const [value, setValue] = useState('email');
    return (
      <>
        <Radio value="email" checked={value === 'email'} onChange={() => setValue('email')}>
          Email
        </Radio>
        <Radio value="sms" checked={value === 'sms'} onChange={() => setValue('sms')}>
          SMS
        </Radio>
      </>
    );
  }
  render(<Wrapper />);
  const sms = screen.getByRole('radio', { name: 'SMS' });
  fireEvent.click(sms);
  expect(sms).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
});

test('defaultChecked starts checked (uncontrolled)', () => {
  render(
    <Radio value="email" defaultChecked>
      Email
    </Radio>,
  );
  expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
});

test('disabled is a native attribute and the CSS blocks the pointer', () => {
  render(
    <Radio value="email" disabled>
      Email
    </Radio>,
  );
  // The browser suppresses activation on a disabled control; jsdom does not, so
  // the disabled attribute plus its CSS is the contract testable here.
  expect(screen.getByRole('radio', { name: 'Email' })).toBeDisabled();
  expect(css).toContain('.box:disabled');
  expect(css).toContain('cursor: not-allowed');
});

test('size variants set data-size on the label', () => {
  const { container } = render(
    <>
      <Radio value="email">Email</Radio>
      <Radio value="sms" size="md">
        SMS
      </Radio>
    </>,
  );
  const labels = container.querySelectorAll('label');
  expect(labels[0]).toHaveAttribute('data-size', 'sm');
  expect(labels[1]).toHaveAttribute('data-size', 'md');
});

test('module CSS scopes the md control size to the label, not any ancestor', () => {
  // RadioGroup sets data-size on the <fieldset>, so an unscoped
  // `[data-size='md'] .box` would grow a Radio that overrides size="sm".
  expect(css).toMatch(/\.label\[data-size='md'\] \.box/);
  expect(css).not.toMatch(/^\[data-size='md'\] \.box \{/m);
});

test('inside a group it fires its own onChange before the group onChange', () => {
  const order: string[] = [];
  render(
    <RadioGroup legend="Kênh" onChange={() => order.push('group')}>
      <Radio value="email" onChange={() => order.push('radio')}>
        Email
      </Radio>
    </RadioGroup>,
  );

  fireEvent.click(screen.getByRole('radio', { name: 'Email' }));
  expect(order).toEqual(['radio', 'group']);
});

test('a controlled group value beats the radio own checked without a React warning', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <RadioGroup legend="Kênh" value="sms">
      <Radio value="email" checked>
        Email
      </Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'SMS' })).toBeChecked();
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});

test('a radio own checked beats the group defaultValue without a React warning', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <RadioGroup legend="Kênh" defaultValue="sms">
      <Radio value="email" checked>
        Email
      </Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );
  // The group default must not seed a second selection when a radio owns its
  // state, and React must not see both checked and defaultChecked on one input.
  expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'SMS' })).not.toBeChecked();
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});

test('a controlled checked={false} radio is not seeded by the group defaultValue', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <RadioGroup legend="Kênh" defaultValue="email">
      <Radio value="email" checked={false}>
        Email
      </Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );
  // checked={false} still makes this input controlled, so React must not also
  // receive a defaultChecked for it.
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'SMS' })).not.toBeChecked();
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy.mockRestore();
});
