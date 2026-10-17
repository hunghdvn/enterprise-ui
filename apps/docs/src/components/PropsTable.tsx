import { Table } from '@enterprise-ui/components';
import type { Column } from '@enterprise-ui/components';
import styles from './PropsTable.module.css';

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface PropsTableProps {
  props: PropDoc[];
}

const columns: Column<PropDoc>[] = [
  { key: 'name', title: 'Prop', width: 140 },
  {
    key: 'type',
    title: 'Type',
    render: (row) => <code className={styles.type}>{row.type}</code>,
  },
  {
    key: 'default',
    title: 'Default',
    render: (row) => (row.default !== undefined ? row.default : '—'),
  },
  { key: 'description', title: 'Description' },
];

export function PropsTable({ props }: PropsTableProps) {
  return <Table columns={columns} data={props} rowKey={(row) => row.name} />;
}
