import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Form } from '../Form/Form';
import { Radio } from '../Radio/Radio';
import { RadioGroup } from './RadioGroup';

test('renders a named radiogroup sharing one generated name', () => {
  render(
    <RadioGroup legend="Kênh nhận thông báo">
      <Radio value="email">Email</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );

  const group = screen.getByRole('radiogroup', { name: 'Kênh nhận thông báo' });
  const radios = within(group).getAllByRole('radio');
  expect(radios).toHaveLength(2);
  const name = radios[0].getAttribute('name');
  expect(name).toBeTruthy();
  expect(radios[1].getAttribute('name')).toBe(name);
});

test('a shared generated name unchecks the first radio when the second is selected', () => {
  render(
    <RadioGroup legend="Kênh nhận thông báo">
      <Radio value="email" defaultChecked>
        Email
      </Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );

  const group = screen.getByRole('radiogroup', { name: 'Kênh nhận thông báo' });
  const [first, second] = within(group).getAllByRole('radio');
  expect(first).toBeChecked();

  fireEvent.click(second);
  expect(second).toBeChecked();
  expect(first).not.toBeChecked();
});

test('controlled value marks the matching radio and reports the pick', () => {
  const onChange = vi.fn();
  function Wrapper() {
    const [value, setValue] = useState('email');
    return (
      <RadioGroup
        legend="Kênh"
        value={value}
        onChange={(next) => {
          setValue(next);
          onChange(next);
        }}
      >
        <Radio value="email">Email</Radio>
        <Radio value="sms">SMS</Radio>
      </RadioGroup>
    );
  }
  render(<Wrapper />);

  fireEvent.click(screen.getByRole('radio', { name: 'SMS' }));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('sms');
  expect(screen.getByRole('radio', { name: 'SMS' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
});

test('two groups get different generated names', () => {
  render(
    <>
      <RadioGroup legend="Một">
        <Radio value="a">A</Radio>
      </RadioGroup>
      <RadioGroup legend="Hai">
        <Radio value="b">B</Radio>
      </RadioGroup>
    </>,
  );
  const names = screen.getAllByRole('radio').map((radio) => radio.getAttribute('name'));
  expect(names[0]).toBeTruthy();
  expect(names[0]).not.toBe(names[1]);
});

test('uncontrolled defaultValue checks the matching radio', () => {
  render(
    <RadioGroup legend="Kênh" defaultValue="sms">
      <Radio value="email">Email</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );
  expect(screen.getByRole('radio', { name: 'Email' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'SMS' })).toBeChecked();
});

test('hint and error land in aria-describedby; error sets aria-invalid', () => {
  render(
    <RadioGroup legend="Kênh" hint="Chọn một kênh" error="Bắt buộc">
      <Radio value="email">Email</Radio>
    </RadioGroup>,
  );
  const group = screen.getByRole('radiogroup', { name: 'Kênh' });
  expect(group).toHaveAttribute('aria-invalid', 'true');
  const describedBy = (group.getAttribute('aria-describedby') ?? '').split(' ');
  expect(describedBy).toContain(screen.getByText('Chọn một kênh').id);
  expect(describedBy).toContain(screen.getByText('Bắt buộc').id);
  expect(screen.getByRole('alert')).toHaveTextContent('Bắt buộc');
});

test('reads the Form error map by name', () => {
  render(
    <Form errors={{ channel: 'Lỗi từ form' }}>
      <RadioGroup legend="Kênh" name="channel">
        <Radio value="email">Email</Radio>
      </RadioGroup>
    </Form>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Lỗi từ form');
});

test('an explicit error wins over the Form map', () => {
  render(
    <Form errors={{ channel: 'Lỗi từ form' }}>
      <RadioGroup legend="Kênh" name="channel" error="Lỗi explicit">
        <Radio value="email">Email</Radio>
      </RadioGroup>
    </Form>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Lỗi explicit');
  expect(screen.queryByText('Lỗi từ form')).not.toBeInTheDocument();
});

test('required renders the marker and aria-required on the radiogroup', () => {
  render(
    <RadioGroup legend="Kênh" required>
      <Radio value="email">Email</Radio>
    </RadioGroup>,
  );
  const group = screen.getByRole('radiogroup', { name: 'Kênh' });
  expect(group).toHaveAttribute('aria-required', 'true');
  expect(within(group).getByText('*')).toHaveAttribute('aria-hidden', 'true');
});

test('caller aria-required and aria-invalid survive when the props are not set', () => {
  render(
    <RadioGroup legend="Kênh" aria-required="true" aria-invalid="true">
      <Radio value="email">Email</Radio>
    </RadioGroup>,
  );
  const group = screen.getByRole('radiogroup', { name: 'Kênh' });
  expect(group).toHaveAttribute('aria-required', 'true');
  expect(group).toHaveAttribute('aria-invalid', 'true');
});

test('orientation, size and a per-radio size override land as data attributes', () => {
  const { container } = render(
    <RadioGroup legend="Kênh" orientation="horizontal" size="md">
      <Radio value="email" size="sm">
        Email
      </Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>,
  );
  const group = screen.getByRole('radiogroup', { name: 'Kênh' });
  expect(group).toHaveAttribute('data-orientation', 'horizontal');
  expect(group).toHaveAttribute('data-size', 'md');
  const labels = container.querySelectorAll('label');
  expect(labels[0]).toHaveAttribute('data-size', 'sm');
  expect(labels[1]).toHaveAttribute('data-size', 'md');
});

test('clicking a radio calls the group onChange once', () => {
  const onChange = vi.fn();
  render(
    <RadioGroup legend="Kênh" onChange={onChange}>
      <Radio value="email">Email</Radio>
    </RadioGroup>,
  );
  fireEvent.click(screen.getByRole('radio', { name: 'Email' }));
  expect(onChange).toHaveBeenCalledTimes(1);
});
