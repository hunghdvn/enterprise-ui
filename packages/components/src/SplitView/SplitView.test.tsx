import { fireEvent, render, screen } from '@testing-library/react';
import { SplitView } from './SplitView';

function stubMatchMedia(matches: boolean): () => void {
  const original = window.matchMedia;
  Object.defineProperty(window, 'matchMedia', {
    value: () => ({
      matches,
      media: '',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
    configurable: true,
    writable: true,
  });
  return () =>
    Object.defineProperty(window, 'matchMedia', {
      value: original,
      configurable: true,
      writable: true,
    });
}

const master = <div data-testid="master">Danh sách</div>;
const detail = (
  <div>
    <h2>Chi tiết SO-1</h2>
    <p>Nội dung</p>
  </div>
);

test('desktop shows both panes side by side', () => {
  const restore = stubMatchMedia(false);
  try {
    render(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={() => {}} />);
    expect(screen.getByTestId('master')).toBeInTheDocument();
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Quay lại/ })).toBeNull();
  } finally {
    restore();
  }
});

test('mobile shows master alone without selection', () => {
  const restore = stubMatchMedia(true);
  try {
    render(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    expect(screen.getByTestId('master')).toBeInTheDocument();
    expect(screen.queryByText('Nội dung')).toBeNull();
  } finally {
    restore();
  }
});

test('mobile shows detail with back button and moves focus to it', () => {
  const onBack = vi.fn();
  const restore = stubMatchMedia(true);
  try {
    const { rerender } = render(
      <SplitView master={master} detail={detail} selectedKey={null} onBack={onBack} />,
    );
    expect(screen.queryByText('Nội dung')).toBeNull();
    // Null → key transition (the real selection flow): focus lands on the
    // detail heading, not the bare container.
    rerender(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={onBack} />);
    expect(screen.queryByTestId('master')).toBeNull();
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    expect(document.activeElement?.tagName).toBe('H2');
    expect(document.activeElement).toHaveTextContent('Chi tiết SO-1');
    fireEvent.click(screen.getByRole('button', { name: /Quay lại/ }));
    expect(onBack).toHaveBeenCalledTimes(1);
  } finally {
    restore();
  }
});

test('mobile mount with a key does not steal focus', () => {
  const restore = stubMatchMedia(true);
  try {
    render(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={() => {}} />);
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    // Preselected on first paint — no user selection happened, so no focus jump.
    expect(document.activeElement?.tagName).toBe('BODY');
  } finally {
    restore();
  }
});

test('mobile back returns focus to the master pane', () => {
  const restore = stubMatchMedia(true);
  try {
    const { rerender } = render(
      <SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />,
    );
    rerender(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={() => {}} />);
    expect(document.activeElement?.tagName).toBe('H2');
    rerender(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    expect(screen.getByTestId('master')).toBeInTheDocument();
    expect(document.activeElement).toHaveTextContent('Danh sách');
  } finally {
    restore();
  }
});

test('master width is honored on desktop', () => {
  const restore = stubMatchMedia(false);
  try {
    render(
      <SplitView
        master={master}
        detail={detail}
        selectedKey={null}
        onBack={() => {}}
        masterWidth={420}
      />,
    );
    const masterPane = screen.getByTestId('master').parentElement!;
    expect(masterPane.style.width).toBe('420px');
  } finally {
    restore();
  }
});

test('unmatched selectedKey still renders caller-owned detail', () => {
  const restore = stubMatchMedia(true);
  try {
    // The key matches nothing in the master list — SplitView never validates
    // it, the detail is the caller's data to own.
    render(<SplitView master={master} detail={detail} selectedKey="SO-404" onBack={() => {}} />);
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
  } finally {
    restore();
  }
});

test('default master width is 380px', () => {
  const restore = stubMatchMedia(false);
  try {
    render(<SplitView master={master} detail={detail} selectedKey={null} onBack={() => {}} />);
    expect(screen.getByTestId('master').parentElement!.style.width).toBe('380px');
  } finally {
    restore();
  }
});
