import { Icon, ICONS, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import { IconGallery } from '../../../../shared/IconGallery';
import styles from './IconPage.module.css';

const props: PropDoc[] = [
  {
    name: 'name',
    type: 'IconName',
    description: 'Tên icon trong registry.',
  },
  {
    name: 'size',
    type: 'number',
    default: '16',
    description: 'Kích thước (px) của icon.',
  },
  {
    name: 'label',
    type: 'string',
    description:
      'Nếu có, icon trở thành có ý nghĩa (role="img" + <title>); nếu không, icon là trang trí (aria-hidden).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Class thêm vào phần tử svg.',
  },
];

const code = `import { Icon } from '@enterprise-ui/components';

export function Actions() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Icon name="check" size={16} />
      <Icon name="search" size={20} />
      <Icon name="alert-triangle" size={20} label="Cảnh báo" />
      <button type="button">
        <Icon name="download" size={16} /> Tải xuống
      </button>
    </div>
  );
}`;

const names = Object.keys(ICONS) as (keyof typeof ICONS)[];

export default function IconPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Icon</h1>
      <p className={styles.subtitle}>
        Bộ icon inline SVG (~{names.length} icon), stroke-based 24×24, màu theo currentColor. Không
        có runtime dependency.
      </p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <IconGallery headingLevel={2} />
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Kích thước & màu</h2>
                    <div className={styles.row}>
                      <Icon name="check" size={16} />
                      <Icon name="check" size={20} />
                      <Icon name="check" size={24} />
                      <Icon name="check" size={32} />
                      <span style={{ color: 'var(--color-blue-600)' }}>
                        <Icon name="bell" size={20} />
                      </span>
                      <span style={{ color: 'var(--color-orange-500)' }}>
                        <Icon name="alert-triangle" size={20} />
                      </span>
                    </div>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Có label (accessible)</h2>
                    <Icon name="search" size={20} label="Tìm kiếm" />
                  </section>
                </div>
              </DemoPlayground>
            ),
          },
          { key: 'props', label: 'Props', content: <PropsTable props={props} /> },
          { key: 'code', label: 'Code', content: <CodeBlock code={code} /> },
        ]}
      />
    </div>
  );
}
