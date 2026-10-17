import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';

test('renders tab labels and shows first tab content by default', () => {
  render(
    <Tabs
      items={[
        { key: 'a', label: 'Tab A', content: <div>Content A</div> },
        { key: 'b', label: 'Tab B', content: <div>Content B</div> },
      ]}
    />,
  );
  expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByText('Content A')).toBeInTheDocument();
  expect(screen.queryByText('Content B')).not.toBeInTheDocument();
});

test('clicking a tab switches content', () => {
  render(
    <Tabs
      items={[
        { key: 'a', label: 'Tab A', content: <div>Content A</div> },
        { key: 'b', label: 'Tab B', content: <div>Content B</div> },
      ]}
    />,
  );
  fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
  expect(screen.getByText('Content B')).toBeInTheDocument();
  expect(screen.queryByText('Content A')).not.toBeInTheDocument();
});

test('keyboard navigation with ArrowRight and ArrowLeft', () => {
  render(
    <Tabs
      items={[
        { key: 'a', label: 'Tab A', content: <div>Content A</div> },
        { key: 'b', label: 'Tab B', content: <div>Content B</div> },
      ]}
    />,
  );
  const tabA = screen.getByRole('tab', { name: 'Tab A' });
  tabA.focus();
  fireEvent.keyDown(tabA, { key: 'ArrowRight' });
  expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true');
  fireEvent.keyDown(screen.getByRole('tab', { name: 'Tab B' }), { key: 'ArrowLeft' });
  expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
});

test('calls onChange when tab changes', () => {
  const onChange = vi.fn();
  render(
    <Tabs
      items={[
        { key: 'a', label: 'Tab A', content: <div>Content A</div> },
        { key: 'b', label: 'Tab B', content: <div>Content B</div> },
      ]}
      onChange={onChange}
    />,
  );
  fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
  expect(onChange).toHaveBeenCalledWith('b');
});
