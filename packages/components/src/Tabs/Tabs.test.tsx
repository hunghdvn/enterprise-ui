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
  expect(screen.getByText('Content A')).toBeVisible();
  // Panels render persistently; the inactive one is hidden via [hidden].
  expect(screen.getByText('Content B')).not.toBeVisible();
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
  expect(screen.getByText('Content B')).toBeVisible();
  expect(screen.getByText('Content A')).not.toBeVisible();
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

test('controlled mode: onChange fires but selection stays on activeKey', () => {
  const onChange = vi.fn();
  render(
    <Tabs
      items={[
        { key: 'a', label: 'Tab A', content: <div>Content A</div> },
        { key: 'b', label: 'Tab B', content: <div>Content B</div> },
      ]}
      activeKey="b"
      onChange={onChange}
    />,
  );
  fireEvent.click(screen.getByRole('tab', { name: 'Tab A' }));
  expect(onChange).toHaveBeenCalledWith('a');
  expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false');
  expect(screen.getByText('Content B')).toBeVisible();
});

test('namespaces DOM ids per instance so two Tabs never collide', () => {
  render(
    <div>
      <Tabs
        items={[
          { key: 'overview', label: 'A1 Overview', content: <div>A1 content</div> },
          { key: 'detail', label: 'A1 Detail', content: <div>A1 detail</div> },
        ]}
      />
      <Tabs
        items={[
          { key: 'overview', label: 'A2 Overview', content: <div>A2 content</div> },
          { key: 'detail', label: 'A2 Detail', content: <div>A2 detail</div> },
        ]}
      />
    </div>,
  );
  // With raw item.key ids both instances would render id="tab-overview" and
  // aria-controls would resolve to the first instance's panel.
  const tabs = screen.getAllByRole('tab', { name: 'A1 Overview' });
  const panels = screen.getAllByRole('tabpanel', { name: 'A1 Overview' });
  expect(tabs).toHaveLength(1);
  expect(panels).toHaveLength(1);
  expect(tabs[0]).toHaveAttribute('aria-controls', panels[0].id);
  expect(panels[0]).toHaveAttribute('aria-labelledby', tabs[0].id);
  expect(document.querySelectorAll('[id="tab-overview"]')).toHaveLength(0);
});

test('root carries data-variant, defaulting to line', () => {
  const { container } = render(
    <Tabs
      items={[
        { key: 'a', label: 'Tab A', content: <div>Content A</div> },
        { key: 'b', label: 'Tab B', content: <div>Content B</div> },
      ]}
    />,
  );
  expect(container.querySelector('[data-variant]')).toHaveAttribute('data-variant', 'line');
});

test.each(['segmented', 'pills', 'enclosed'] as const)(
  'variant %s renders data-variant and still switches content',
  (variant) => {
    const { container } = render(
      <Tabs
        variant={variant}
        items={[
          { key: 'a', label: 'Tab A', content: <div>Content A</div> },
          { key: 'b', label: 'Tab B', content: <div>Content B</div> },
        ]}
      />,
    );
    expect(container.querySelector('[data-variant]')).toHaveAttribute('data-variant', variant);
    fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByText('Content B')).toBeVisible();
    expect(screen.getByText('Content A')).not.toBeVisible();
  },
);
