import styles from './TokensPage.module.css';

const GROUPS: { title: string; vars: { name: string; value: string }[] }[] = [
  {
    title: 'Primary Blue — #1E47C4 base',
    vars: [
      { name: '--color-blue-50', value: '#EFF6FF' },
      { name: '--color-blue-100', value: '#DBEAFE' },
      { name: '--color-blue-500', value: '#3B82F6' },
      { name: '--color-blue-600', value: '#1E47C4' },
      { name: '--color-blue-700', value: '#1E40AF' },
      { name: '--color-blue-800', value: '#1E3A8A' },
    ],
  },
  {
    title: 'Accent Orange — ~10%',
    vars: [
      { name: '--color-orange-50', value: '#FFF7ED' },
      { name: '--color-orange-500', value: '#F97316' },
      { name: '--color-orange-600', value: '#EA580C' },
    ],
  },
  {
    title: 'Surface / Text (theo theme)',
    vars: [
      { name: '--bg', value: 'light #F8FAFC / dark #0F172A' },
      { name: '--surface', value: 'light #FFFFFF / dark #1E293B' },
      { name: '--border', value: 'light #E2E8F0 / dark #334155' },
      { name: '--text', value: 'light #0F172A / dark #F8FAFC' },
      { name: '--text-muted', value: 'light #64748B / dark #94A3B8' },
    ],
  },
  {
    title: 'Density',
    vars: [
      { name: '--row-height', value: 'compact 32px / comfortable 44px' },
      { name: '--input-h', value: 'compact 32px / comfortable 40px' },
      { name: '--font-size', value: 'compact 13px / comfortable 14px' },
    ],
  },
];

export default function TokensPage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Tokens</h2>
      <p className={styles.subtitle}>
        Sidebar trắng chung nền · primary #1E47C4 · switch theme/density không nháy,
        persist qua reload (localStorage eui-theme / eui-density).
      </p>
      {GROUPS.map((g) => (
        <section key={g.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{g.title}</h3>
          <div className={styles.grid}>
            {g.vars.map((v) => (
              <div key={v.name} className={styles.card}>
                <span
                  className={styles.swatch}
                  style={{ background: `var(${v.name}, var(--surface-muted))` }}
                  aria-hidden="true"
                />
                <span className={styles.name}>{v.name}</span>
                <span className={styles.value}>{v.value}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
