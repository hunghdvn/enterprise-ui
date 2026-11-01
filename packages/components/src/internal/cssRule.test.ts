import { cssRule } from './cssRule';

test('cssRule returns the body of the matching rule', () => {
  expect(cssRule('.a {\n  color: red;\n}', '.a')).toMatch(/^\s*color:\s*red;/m);
});

test('cssRule ignores a selector that is only named in a comment', () => {
  // the selector sits at a line start inside the comment, so only stripping comments hides it
  const css = '/*\n.a {\n  color: red;\n}\n*/\n.b {\n  color: blue;\n}';
  expect(() => cssRule(css, '.a')).toThrow(/missing rule/);
});

test('cssRule returns the last match so an override is the one inspected', () => {
  const css = '.a { color: red; }\n.a { color: blue; }';
  expect(cssRule(css, '.a')).toMatch(/color:\s*blue/);
});

test('cssRule balances braces inside an at-rule wrapper', () => {
  const css = '@media (forced-colors: active) { .a { outline: 2px solid CanvasText; } }';
  expect(cssRule(css, '.a')).toMatch(/outline:\s*2px solid CanvasText/);
});

test('cssRule reads a grouped selector list', () => {
  const css = '.a .num,\n.a .events {\n  opacity: 1;\n}';
  expect(cssRule(css, '.a .num')).toMatch(/opacity:\s*1\b/);
  expect(cssRule(css, '.a .events')).toMatch(/opacity:\s*1\b/);
});

test('cssRule does not match a selector that is a suffix of another', () => {
  const css = '.b.a {\n  color: red;\n}\n.a {\n  color: blue;\n}';
  expect(cssRule(css, '.a')).toMatch(/color:\s*blue/);
});
