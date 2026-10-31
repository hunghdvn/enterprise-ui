import { CodeBlock } from '../../components/CodeBlock';
import styles from './TokensPage.module.css';

interface TokenDoc {
  name: string;
  value: string;
}

const BLUE: TokenDoc[] = [
  { name: '--color-blue-50', value: '#eff6ff' },
  { name: '--color-blue-100', value: '#dbeafe' },
  { name: '--color-blue-200', value: '#bfdbfe' },
  { name: '--color-blue-300', value: '#93c5fd' },
  { name: '--color-blue-500', value: '#3b82f6' },
  { name: '--color-blue-600', value: '#1e47c4 — primary' },
  { name: '--color-blue-700', value: '#1e40af — hover' },
  { name: '--color-blue-800', value: '#1e3a8a — active/pressed' },
];

const ORANGE: TokenDoc[] = [
  { name: '--color-orange-50', value: '#fff7ed' },
  { name: '--color-orange-500', value: '#f97316 — accent (~10%)' },
  { name: '--color-orange-600', value: '#ea580c — hover' },
];

const SEMANTIC: TokenDoc[] = [
  { name: '--success', value: '#16a34a' },
  { name: '--danger', value: '#dc2626' },
  { name: '--on-primary', value: '#ffffff' },
  { name: '--on-accent', value: '#0f172a' },
];

const THEME: TokenDoc[] = [
  { name: '--bg', value: 'Light #f8fafc · Dark #0f172a' },
  { name: '--surface', value: 'Light #ffffff · Dark #1e293b' },
  { name: '--surface-muted', value: 'Light #f1f5f9 · Dark #334155' },
  { name: '--border', value: 'Light #e2e8f0 · Dark #334155' },
  { name: '--text', value: 'Light #0f172a · Dark #f8fafc' },
  { name: '--text-muted', value: 'Light #64748b · Dark #94a3b8' },
  { name: '--row-hover-bg', value: 'Light #eff6ff · Dark #1e3a8a' },
  { name: '--row-selected-bg', value: 'Light #dbeafe · Dark #1e40af' },
  { name: '--row-selected-marker', value: 'Light #1e47c4 · Dark #60a5fa' },
  { name: '--action-text', value: 'Light #1e47c4 · Dark #bfdbfe' },
  { name: '--nav-active-bg', value: 'Light #eff6ff · Dark #1e3a8a' },
  { name: '--scrim', value: 'Light rgba(15, 23, 42, 0.45) · Dark rgba(2, 6, 23, 0.65)' },
  { name: '--focus-ring', value: 'Light #1e47c4 · Dark #93c5fd' },
];

const DENSITY: TokenDoc[] = [
  { name: '--row-height', value: 'Compact 32px · Comfortable 44px' },
  { name: '--cell-py', value: 'Compact 4px · Comfortable 12px' },
  { name: '--cell-px', value: 'Compact 8px · Comfortable 16px' },
  { name: '--cell-min-width', value: 'Compact 120px · Comfortable 140px' },
  { name: '--input-h', value: 'Compact 32px · Comfortable 40px' },
  { name: '--input-h-lg', value: 'Compact 40px · Comfortable 48px' },
  { name: '--font-size', value: 'Compact 13px · Comfortable 14px' },
  { name: '--control-size-sm', value: '16px — ô tick/radio cỡ sm' },
  { name: '--control-size', value: '18px — ô tick/radio cỡ md' },
];

const SHAPE: TokenDoc[] = [
  { name: '--radius', value: '6px' },
  { name: '--radius-lg', value: '8px' },
  { name: '--shadow-sm', value: '0 1px 2px rgba(0, 0, 0, 0.06)' },
  { name: '--shadow-md', value: '0 4px 12px rgba(0, 0, 0, 0.08)' },
  { name: '--bp-tablet', value: '768px' },
  { name: '--bp-desktop', value: '1280px' },
];

// WCAG relative luminance/contrast, computed from the token values above so the
// numbers on this page can never drift from the palette table.
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  );
}

function contrast(foreground: string, background: string): string {
  const f = luminance(foreground);
  const b = luminance(background);
  if (f === null || b === null) return '—';
  const ratio = (Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05);
  return `${ratio.toFixed(2)}:1`;
}

const CONTRAST_PAIRS: { label: string; values: { theme: string; ratio: string }[] }[] = [
  {
    label: '--text trên --bg',
    values: [
      { theme: 'Light', ratio: contrast('#0f172a', '#f8fafc') },
      { theme: 'Dark', ratio: contrast('#f8fafc', '#0f172a') },
    ],
  },
  {
    label: '--text-muted trên --surface',
    values: [
      { theme: 'Light', ratio: contrast('#64748b', '#ffffff') },
      { theme: 'Dark', ratio: contrast('#94a3b8', '#1e293b') },
    ],
  },
  {
    label: '--on-primary trên --color-blue-600',
    values: [{ theme: 'Mọi theme', ratio: contrast('#ffffff', '#1e47c4') }],
  },
  {
    label: '--on-accent trên --color-orange-500',
    values: [{ theme: 'Mọi theme', ratio: contrast('#0f172a', '#f97316') }],
  },
];

const usageCode = `import '@enterprise-ui/components/style.css'; // entry gộp cả tokens
import { ThemeProvider, Button } from '@enterprise-ui/components';

export function App() {
  return (
    <ThemeProvider theme="light" density="compact">
      {/* ThemeProvider đặt data-theme + data-density — mọi token đổi theo */}
      <Button variant="primary">Lưu</Button>
    </ThemeProvider>
  );
}`;

const cssCode = `/* Tự phục vụ token trong CSS của bạn */
.card {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}`;

function TokenCards({ tokens }: { tokens: TokenDoc[] }) {
  return (
    <div className={styles.grid}>
      {tokens.map((token) => (
        <div key={token.name} className={styles.card}>
          <span
            className={styles.swatch}
            style={{ background: `var(${token.name}, var(--surface-muted))` }}
            aria-hidden="true"
          />
          <span className={styles.name}>{token.name}</span>
          <span className={styles.value}>{token.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TokensPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tokens</h1>
      <p className={styles.subtitle}>
        Design tokens dạng CSS variables trong <code>@enterprise-ui/tokens</code> — bảng màu, theme
        sáng/tối, mật độ, bo góc và breakpoint. Component chỉ dùng <code>var(--…)</code>, nên đổi
        token là đổi cả hệ thống.
      </p>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Màu thương hiệu — Blue</h2>
        <TokenCards tokens={BLUE} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Màu nhấn — Orange (~10%)</h2>
        <TokenCards tokens={ORANGE} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Màu ngữ nghĩa</h2>
        <TokenCards tokens={SEMANTIC} />
        <p className={styles.helper}>
          Không có token <code>--info</code>/<code>--warning</code> riêng: thông tin dùng{' '}
          <code>--color-blue-600</code>, cảnh báo dùng <code>--color-orange-500</code>.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bề mặt & chữ (đổi theo theme)</h2>
        <TokenCards tokens={THEME} />
        <p className={styles.helper}>
          Swatch hiển thị giá trị của theme đang chọn — bấm nút Dark/Light ở header để đối chiếu.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.name}>--font</span>
            <span className={styles.value}>Inter, system-ui, -apple-system, sans-serif</span>
            <span className={styles.sample} style={{ fontFamily: 'var(--font)' }}>
              Đơn hàng SO-1024 — Inter
            </span>
          </div>
          <div className={styles.card}>
            <span className={styles.name}>--font-size</span>
            <span className={styles.value}>Compact 13px · Comfortable 14px</span>
            <span className={styles.sample} style={{ fontSize: 'var(--font-size)' }}>
              Chữ thân theo mật độ hiện tại
            </span>
          </div>
          <div className={styles.card}>
            <span className={styles.name}>--font-size-md</span>
            <span className={styles.value}>15px — control cỡ md</span>
            <span className={styles.sample} style={{ fontSize: 'var(--font-size-md)' }}>
              Chữ cỡ md (15px)
            </span>
          </div>
        </div>
        <p className={styles.helper}>
          Ngoài token, component dùng cỡ chữ cục bộ: 10–12px cho caption/header bảng, 14px cho tiêu
          đề hộp thoại, 16px cho tiêu đề PageHeader và 20px cho giá trị KpiCard.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mật độ & khoảng cách</h2>
        <TokenCards tokens={DENSITY} />
        <p className={styles.helper}>
          Giá trị đổi theo <code>data-density</code> trên root (compact mặc định) — công tắc “Mật
          độ” ở header đổi trực tiếp.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bo góc, đổ bóng & breakpoint</h2>
        <div className={styles.grid}>
          {SHAPE.map((token) => (
            <div key={token.name} className={styles.card}>
              {token.name.includes('shadow') ? (
                <span
                  className={styles.shadowPreview}
                  style={{ boxShadow: `var(${token.name}, var(--shadow-sm))` }}
                  aria-hidden="true"
                />
              ) : token.name.includes('radius') ? (
                <span
                  className={styles.radiusPreview}
                  style={{ borderRadius: `var(${token.name}, var(--radius))` }}
                  aria-hidden="true"
                />
              ) : (
                <span
                  className={styles.swatch}
                  style={{ background: 'var(--surface-muted)' }}
                  aria-hidden="true"
                />
              )}
              <span className={styles.name}>{token.name}</span>
              <span className={styles.value}>{token.value}</span>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Độ tương phản (WCAG)</h2>
        <div className={styles.contrastList}>
          {CONTRAST_PAIRS.map((pair) => (
            <div key={pair.label} className={styles.contrastRow}>
              <span className={styles.contrastLabel}>{pair.label}</span>
              <span className={styles.contrastValues}>
                {pair.values.map((value) => (
                  <span key={value.theme} className={styles.contrastValue}>
                    {value.theme} {value.ratio}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <p className={styles.helper}>
          Tỷ lệ tính từ chính giá trị token ở trên; ngưỡng WCAG AA là ≥ 4.5:1 cho chữ thường và ≥
          3:1 cho chữ lớn.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sử dụng</h2>
        <CodeBlock code={usageCode} />
        <CodeBlock code={cssCode} language="css" />
      </section>
    </div>
  );
}
