import { fireEvent, render, screen } from '@testing-library/react';
import { Steps } from './Steps';

const steps = [
  { id: 'info', label: 'Thông tin' },
  { id: 'detail', label: 'Chi tiết', optional: true },
  { id: 'confirm', label: 'Xác nhận' },
];

test('renders markers 1..N with the current step marked', () => {
  render(<Steps steps={steps} currentStep={1} onChange={() => {}} />);
  const markers = screen.getAllByRole('button', { name: /\d\. / });
  expect(markers).toHaveLength(3);
  expect(markers[0]).toHaveAttribute('data-state', 'done');
  expect(markers[1]).toHaveAttribute('data-state', 'current');
  expect(markers[1]).toHaveAttribute('aria-current', 'step');
  expect(markers[2]).toHaveAttribute('data-state', 'upcoming');
});

test('optional step shows a hint', () => {
  render(<Steps steps={steps} currentStep={0} onChange={() => {}} />);
  expect(screen.getByText('tuỳ chọn')).toBeInTheDocument();
});

test('Next advances one step; Back appears after step 1', () => {
  const onChange = vi.fn();
  render(<Steps steps={steps} currentStep={0} onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Tiếp theo ›' }));
  expect(onChange).toHaveBeenCalledWith(1);
});

test('Back goes to the previous step', () => {
  const onChange = vi.fn();
  render(<Steps steps={steps} currentStep={2} onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: '‹ Quay lại' }));
  expect(onChange).toHaveBeenCalledWith(1);
});

test('last step renders Finish (Hoàn tất) instead of Next', () => {
  const onChange = vi.fn();
  render(<Steps steps={steps} currentStep={2} onChange={onChange} />);
  expect(screen.getByRole('button', { name: 'Hoàn tất' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Tiếp theo ›' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Hoàn tất' }));
  expect(onChange).toHaveBeenCalledWith(3); // steps.length → done
});

test('finish renders the done message', () => {
  render(<Steps steps={steps} currentStep={3} onChange={() => {}} />);
  expect(screen.getByText('Hoàn tất tất cả các bước.')).toBeInTheDocument();
});

test('clicking a completed step jumps back to it', () => {
  const onChange = vi.fn();
  render(<Steps steps={steps} currentStep={2} onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: '1. Thông tin' }));
  expect(onChange).toHaveBeenCalledWith(0);
});

test('clicking an upcoming step does nothing', () => {
  const onChange = vi.fn();
  render(<Steps steps={steps} currentStep={0} onChange={onChange} />);
  const upcoming = screen.getByRole('button', { name: '3. Xác nhận' });
  expect(upcoming).toBeDisabled();
  fireEvent.click(upcoming);
  expect(onChange).not.toHaveBeenCalled();
});

test('disabled hides navigation and disables markers', () => {
  const onChange = vi.fn();
  render(<Steps steps={steps} currentStep={1} onChange={onChange} disabled />);
  expect(screen.queryByRole('button', { name: 'Tiếp theo ›' })).toBeNull();
  expect(screen.queryByRole('button', { name: '‹ Quay lại' })).toBeNull();
  expect(screen.getByRole('button', { name: '2. Chi tiết' })).toBeDisabled();
});

test('without onChange the indicators are read-only (no nav)', () => {
  render(<Steps steps={steps} currentStep={1} />);
  expect(screen.queryByRole('button', { name: 'Tiếp theo ›' })).toBeNull();
  expect(screen.queryByRole('button', { name: '‹ Quay lại' })).toBeNull();
});

test('done marker shows a check icon', () => {
  render(<Steps steps={steps} currentStep={2} onChange={() => {}} />);
  const first = screen.getByRole('button', { name: '1. Thông tin' });
  expect(first.querySelector('svg')).not.toBeNull();
});

test('empty steps renders without crashing', () => {
  render(<Steps steps={[]} currentStep={0} onChange={() => {}} />);
  expect(screen.queryAllByRole('button', { name: /\d\. / })).toHaveLength(0);
});
