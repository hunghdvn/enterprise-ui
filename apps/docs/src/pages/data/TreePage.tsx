import { useState } from 'react';
import { Tabs, Tree } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import type { TreeNode } from '@enterprise-ui/components';
import styles from './TreePage.module.css';

const orgNodes: TreeNode[] = [
  {
    id: 'org',
    label: 'Công ty',
    children: [
      {
        id: 'tech',
        label: 'Khối kỹ thuật',
        children: [
          { id: 'fe', label: 'Bộ phận Frontend' },
          { id: 'be', label: 'Bộ phận Backend' },
          { id: 'qa', label: 'Bộ phận QA' },
        ],
      },
      {
        id: 'sales',
        label: 'Khối kinh doanh',
        children: [{ id: 'north', label: 'Vùng miền Bắc' }],
      },
      { id: 'hr', label: 'Nhân sự', disabled: true },
    ],
  },
];

const props: PropDoc[] = [
  {
    name: 'nodes',
    type: 'TreeNode[]',
    description: 'Dữ liệu phân cấp { id, label, children?, disabled? }.',
  },
  {
    name: 'expandedIds',
    type: 'string[]',
    description: 'Các node đang mở (controlled).',
  },
  {
    name: 'onToggleExpand',
    type: '(id: string) => void',
    description: 'Gọi khi mở/đóng một node có con.',
  },
  { name: 'selectedId', type: 'string | null', description: 'Node đang chọn (controlled).' },
  { name: 'onSelect', type: '(id: string) => void', description: 'Gọi khi chọn một node.' },
  { name: 'aria-label', type: 'string', description: 'Nhãn a11y cho cây.' },
];

const code = `import { useState } from 'react';
import { Tree } from '@enterprise-ui/components';
import type { TreeNode } from '@enterprise-ui/components';

const org: TreeNode[] = [
  {
    id: 'org',
    label: 'Công ty',
    children: [
      { id: 'tech', label: 'Khối kỹ thuật', children: [{ id: 'fe', label: 'Frontend' }] },
      { id: 'sales', label: 'Khối kinh doanh' },
    ],
  },
];

export function OrgTree() {
  const [expanded, setExpanded] = useState<string[]>(['org']);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Tree
      nodes={org}
      expandedIds={expanded}
      onToggleExpand={(id) =>
        setExpanded((list) =>
          list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
        )
      }
      selectedId={selected}
      onSelect={setSelected}
      aria-label="Cơ cấu tổ chức"
    />
  );
}`;

export default function TreePage() {
  const [expanded, setExpanded] = useState<string[]>(['org', 'tech']);
  const [selected, setSelected] = useState<string | null>('fe');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Tree</h1>
      <p className={styles.subtitle}>
        Cây phân cấp controlled: mở/đóng nhánh, chọn node, điều hướng bàn phím theo APG (↑↓→←,
        Enter/Space).
      </p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Cơ cấu tổ chức</h2>
                    <Tree
                      nodes={orgNodes}
                      expandedIds={expanded}
                      onToggleExpand={(id) =>
                        setExpanded((list) =>
                          list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
                        )
                      }
                      selectedId={selected}
                      onSelect={setSelected}
                      aria-label="Cơ cấu tổ chức"
                    />
                    <p className={styles.helper}>
                      Đang chọn: {selected ?? '—'}. Bàn phím: ↑↓ di chuyển, → mở/đi vào con, ←
                      đóng/về cha, Enter/Space chọn. Node “Nhân sự” bị khoá (disabled).
                    </p>
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
