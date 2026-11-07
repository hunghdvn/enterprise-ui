import { useState } from 'react';
import { Tree } from '@enterprise-ui/components';
import type { TreeNode } from '@enterprise-ui/components';
import styles from './demos.module.css';

const ORG: TreeNode[] = [
  {
    id: 'org',
    label: 'Công ty Sao Mai',
    children: [
      {
        id: 'tech',
        label: 'Khối kỹ thuật',
        children: [
          { id: 'fe', label: 'Nhóm Frontend' },
          { id: 'be', label: 'Nhóm Backend' },
          { id: 'platform', label: 'Nhóm Platform' },
        ],
      },
      {
        id: 'sales',
        label: 'Khối kinh doanh',
        children: [
          { id: 'north', label: 'Vùng miền Bắc' },
          { id: 'south', label: 'Vùng miền Nam' },
        ],
      },
      { id: 'hr', label: 'Nhân sự (đang khoá)', disabled: true },
    ],
  },
];

const LABELS: Record<string, string> = {
  org: 'Công ty Sao Mai',
  tech: 'Khối kỹ thuật',
  fe: 'Nhóm Frontend',
  be: 'Nhóm Backend',
  platform: 'Nhóm Platform',
  sales: 'Khối kinh doanh',
  north: 'Vùng miền Bắc',
  south: 'Vùng miền Nam',
  hr: 'Nhân sự (đang khoá)',
};

export function TreeDemo() {
  const [expandedIds, setExpandedIds] = useState<string[]>(['org', 'tech']);
  const [selectedId, setSelectedId] = useState<string | null>('fe');

  return (
    <div className={styles.stack}>
      <div className={styles.grid}>
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Cơ cấu tổ chức</h4>
          <Tree
            nodes={ORG}
            expandedIds={expandedIds}
            onToggleExpand={(id) =>
              setExpandedIds((current) =>
                current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
              )
            }
            selectedId={selectedId}
            onSelect={setSelectedId}
            aria-label="Cơ cấu tổ chức"
          />
          <p className={styles.helper}>
            Đang chọn: <strong>{selectedId ? (LABELS[selectedId] ?? selectedId) : '—'}</strong>.
            Node “Nhân sự” bị khoá nên không thể chọn.
          </p>
        </section>
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>Cây rỗng</h4>
          <Tree
            nodes={[]}
            expandedIds={[]}
            onToggleExpand={() => {}}
            selectedId={null}
            aria-label="Cây rỗng"
          />
          <p className={styles.helper}>
            Khi không có node nào, component hiển thị trạng thái “Không có dữ liệu”.
          </p>
        </section>
      </div>
      <p className={styles.helper}>
        Bàn phím: ↑/↓ di chuyển, → mở nhánh hoặc đi vào con, ← đóng nhánh hoặc về node cha,
        Enter/Space chọn.
      </p>
    </div>
  );
}
