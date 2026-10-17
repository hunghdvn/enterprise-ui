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

const TOKEN_REGEX =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`)|((?<![\w)])<\/?[A-Za-z][\w.-]*)|(\b[A-Za-z_]\w*\b)|(\b\d+(?:\.\d+)?\b)/g;

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
      tokens.push({ type: 'jsx', value: full });
    } else if (match[5]) {
      tokens.push({ type: 'number', value: full });
    } else if (match[4]) {
      const word = full;
      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: full });
      } else {
        tokens.push({ type: 'plain', value: full });
      }
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
    try {
      await navigator.clipboard?.writeText(code);
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
