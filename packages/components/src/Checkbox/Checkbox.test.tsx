import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';

test('renders label and reflects checked', () => {
  render(<Checkbox>Đồng ý</Checkbox>);
  const box = screen.getByRole('checkbox');
  expect(box).not.toBeChecked();
  expect(screen.getByText('Đồng ý')).toBeInTheDocument();
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
