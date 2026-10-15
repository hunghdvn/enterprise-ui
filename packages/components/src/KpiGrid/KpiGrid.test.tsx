import { render, screen } from '@testing-library/react';
import { KpiGrid } from './KpiGrid';

test('grid uses the caller min card width', () => {
  render(
    <KpiGrid minCardWidth={260}>
      <div>A</div>
      <div>B</div>
    </KpiGrid>,
  );
  const grid = screen.getByText('A').parentElement!;
  expect(grid.style.gridTemplateColumns).toContain('260px');
});

test('grid defaults to a 220px minimum card width', () => {
  render(
    <KpiGrid>
      <div>A</div>
    </KpiGrid>,
  );
  expect(screen.getByText('A').parentElement!.style.gridTemplateColumns).toContain('220px');
});
