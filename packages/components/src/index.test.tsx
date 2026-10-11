import { describe, expect, it } from 'vitest';
import * as components from './index';

describe('public component exports', () => {
  it('exports the foundation components', () => {
    expect(components.Button).toBeDefined();
    expect(components.Checkbox).toBeDefined();
    expect(components.Input).toBeDefined();
  });
});
