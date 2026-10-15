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
    render(<SplitView master={master} detail={detail} selectedKey="SO-1" onBack={onBack} />);
    expect(screen.queryByTestId('master')).toBeNull();
    expect(screen.getByText('Nội dung')).toBeInTheDocument();
    expect(document.activeElement).toHaveTextContent('Chi tiết SO-1');
    fireEvent.click(screen.getByRole('button', { name: /Quay lại/ }));
    expect(onBack).toHaveBeenCalledTimes(1);
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
