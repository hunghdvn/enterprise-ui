import { useState } from 'react';
import styles from './CodeBlock.module.css';

export interface CodeBlockProps {
  code: string;
  language?: string;
}

interface Token {
  type: 'plain' | 'comment' | 'string' | 'keyword' | 'number' | 'jsx';
  value: string;
}

const KEYWORDS = new Set([
  'import',
  'export',
  'const',
  'let',
  'var',
  'function',
  'return',
  'interface',
  'type',
  'from',
  'default',
  'new',
  'if',
  'else',
  'for',
  'while',
  'class',
  'extends',
  'implements',
  'as',
  'true',
  'false',
  'null',
  'undefined',
  'async',
  'await',
  'of',
  'in',
  'typeof',
  'keyof',
  'readonly',
]);

// The jsx alternative captures the character before a tag (group 4) instead of
// using a `(?<![\w)])` lookbehind: lookbehind throws a SyntaxError at module
// parse on Safari <16.4 and esbuild does not transpile regex features. The
// captured character is re-emitted before the jsx token in tokenize().
const TOKEN_REGEX =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|(([\w)]?)<\/?[A-Za-z][\w.-]*)|(\b[A-Za-z_]\w*\b)|(\b\d+(?:\.\d+)?\b)/g;

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'plain', value: code.slice(lastIndex, match.index) });
    }
    const full = match[0];
    if (match[1]) {
      tokens.push({ type: 'comment', value: full });
    } else if (match[2]) {
      tokens.push({ type: 'string', value: full });
    } else if (match[3]) {
      // Re-emit the captured character (if any) so nothing is dropped or
      // double-counted; the tag token itself starts at the '<'.
      const lead = match[4] ?? '';
      // Restore the original lookbehind semantics: a tag must not be matched
      // when it immediately follows an identifier/`)` (e.g. `useState<string>`).
      // In that case the preceding character is not captured, so treat the
      // whole match as plain text instead of JSX.
      const prevChar = match.index > 0 ? code[match.index - 1] : '';
      const suppress = lead === '' && /[\w)]/.test(prevChar);
      if (suppress) {
        tokens.push({ type: 'plain', value: full });
      } else {
        if (lead) tokens.push({ type: 'plain', value: lead });
        tokens.push({ type: 'jsx', value: full.slice(lead ? lead.length : 0) });
      }
    } else if (match[5]) {
      const word = full;
      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: full });
      } else {
        tokens.push({ type: 'plain', value: full });
      }
    } else if (match[6]) {
      tokens.push({ type: 'number', value: full });
    } else {
      tokens.push({ type: 'plain', value: full });
    }
    lastIndex = TOKEN_REGEX.lastIndex;
    if (TOKEN_REGEX.lastIndex === match.index) {
      TOKEN_REGEX.lastIndex += 1;
    }
  }
  if (lastIndex < code.length) {
    tokens.push({ type: 'plain', value: code.slice(lastIndex) });
  }
  return tokens;
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Without the Clipboard API (insecure context, older browsers) fall
    // through to "Đã sao chép" — bail out before touching any state.
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const tokens = tokenize(code);

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.lang}>{language}</span>
        <button type="button" className={styles.copy} onClick={handleCopy} aria-label="Sao chép mã">
          {copied ? 'Đã sao chép' : 'Sao chép'}
        </button>
      </div>
      <pre className={styles.pre}>
        <code>
          {tokens.map((token, index) =>
            token.type === 'plain' ? (
              <span key={index}>{token.value}</span>
            ) : (
              <span key={index} className={styles[token.type]}>
                {token.value}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
