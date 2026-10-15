import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard';

test('renders label, value and delta with dot and text per tone', () => {
  const { rerender } = render(
    <KpiCard label="Doanh thu" value="₫ 1,2T" delta="+12% so với tháng trước" deltaTone="green" />,
  );
  expect(screen.getByText('Doanh thu')).toBeInTheDocument();
  expect(screen.getByText('₫ 1,2T')).toBeInTheDocument();
  const delta = screen.getByText('+12% so với tháng trước');
  expect(delta.closest('[data-tone="green"]')).not.toBeNull();
  // Color is never the only channel: a dot accompanies the text.
  expect(delta.parentElement?.querySelector('[aria-hidden="true"]')).not.toBeNull();
  rerender(
    <KpiCard label="Tồn đọng" value="38" delta="-5% so với tháng trước" deltaTone="red" />,
  );
  expect(screen.getByText('-5% so với tháng trước').closest('[data-tone="red"]')).not.toBeNull();
});

test('icon and chart slots render', () => {
  render(
    <KpiCard label="Đơn" value="1.024" icon={<span data-testid="icon">▦</span>}>
      <svg data-testid="spark" />
    </KpiCard>,
  );
  expect(screen.getByTestId('icon')).toBeInTheDocument();
  expect(screen.getByTestId('spark')).toBeInTheDocument();
});
