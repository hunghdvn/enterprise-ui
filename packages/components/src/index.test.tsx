import { describe, expect, it } from 'vitest';
import * as components from './index';

describe('public component exports', () => {
  it('exports the initial foundation components', () => {
    expect(components.Button).toBeDefined();
    expect(components.Input).toBeDefined();
  });
});
