import { useState } from 'react';
import { FileUpload, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import type { UploadedFile } from '@enterprise-ui/components';
import styles from './FileUploadPage.module.css';

const initialFiles: UploadedFile[] = [
  { name: 'invoice-2026-01.pdf', size: 245_760, type: 'application/pdf' },
  { name: 'photo.png', size: 1_200_000, type: 'image/png' },
];

const props: PropDoc[] = [
  {
    name: 'files',
    type: 'UploadedFile[]',
    description: 'Danh sách file đã chọn { name, size, type } (controlled).',
  },
  {
    name: 'onSelect',
    type: '(files: File[]) => void',
    description: 'Gọi khi user chọn/kéo file. Parent validate accept/maxSize và lưu File[] thật.',
  },
  {
    name: 'onRemove',
    type: '(index: number) => void',
    description: 'Gọi khi xoá một file (theo index trong files).',
  },
  {
    name: 'accept',
    type: 'string',
    description: 'Filter mime type truyền xuống input (vd. "image/*", ".pdf").',
  },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Cho phép chọn nhiều file.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Vô hiệu hoá toàn bộ.' },
  {
    name: 'dragLabel',
    type: 'string',
    default: "'Kéo thả file vào đây hoặc bấm để chọn'",
    description: 'Nhãn vùng drop.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Nhãn a11y cho vùng drop (mặc định là dragLabel).',
  },
];

const code = `import { useState } from 'react';
import { FileUpload } from '@enterprise-ui/components';
import type { UploadedFile } from '@enterprise-ui/components';

export function Attachments() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  return (
    <FileUpload
      files={files}
      accept="image/*,.pdf"
      multiple
      onSelect={(picked) => {
        // Parent owns validation + the real File[].
        setFiles((prev) => [
          ...prev,
          ...picked.map((f) => ({ name: f.name, size: f.size, type: f.type })),
        ]);
      }}
      onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
    />
  );
}`;

export default function FileUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>File Upload</h1>
      <p className={styles.subtitle}>
        Vùng kéo-thả + chọn file, danh sách đã chọn với xoá từng mục. Upload thật do parent xử lý.
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
                    <h2 className={styles.sectionTitle}>Chọn/kéo file</h2>
                    <FileUpload
                      files={files}
                      accept="image/*,.pdf"
                      multiple
                      onSelect={(picked) => {
                        setFiles((prev) => [
                          ...prev,
                          ...picked.map((f) => ({ name: f.name, size: f.size, type: f.type })),
                        ]);
                      }}
                      onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
                    />
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Vô hiệu hoá</h2>
                    <FileUpload files={[]} onSelect={() => {}} onRemove={() => {}} disabled />
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
