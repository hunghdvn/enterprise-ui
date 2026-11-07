import { useState } from 'react';
import { FileUpload } from '@enterprise-ui/components';
import type { UploadedFile } from '@enterprise-ui/components';
import styles from './demos.module.css';

const MAX_BYTES = 2 * 1024 * 1024;

const initialFiles: UploadedFile[] = [
  { name: 'hop-dong-2026.pdf', size: 184_320, type: 'application/pdf' },
  { name: 'anh-san-pham.png', size: 96_400, type: 'image/png' },
];

function isAllowedType(type: string): boolean {
  return type === 'application/pdf' || type.startsWith('image/');
}

export function FileUploadDemo() {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [rejected, setRejected] = useState<string[]>([]);

  function handleSelect(picked: File[]) {
    const accepted: UploadedFile[] = [];
    const nextRejected: string[] = [];

    for (const file of picked) {
      if (file.size > MAX_BYTES) {
        nextRejected.push(`${file.name} (quá 2 MB)`);
      } else if (!isAllowedType(file.type)) {
        nextRejected.push(`${file.name} (sai định dạng)`);
      } else {
        accepted.push({ name: file.name, size: file.size, type: file.type });
      }
    }

    setRejected(nextRejected);
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
    }
  }

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kéo thả hoặc chọn nhiều file</h4>
        <FileUpload
          files={files}
          accept="image/*,.pdf"
          multiple
          onSelect={handleSelect}
          onRemove={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
        />
        <p className={styles.helper}>
          Chỉ nhận ảnh và PDF tối đa 2 MB. Danh sách bên trên do parent quản lý, không phải state
          nội bộ của component.
        </p>
        {rejected.length > 0 && (
          <p className={styles.note} role="alert">
            Đã bỏ qua: {rejected.join(', ')}.
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Vô hiệu hoá</h4>
        <FileUpload
          files={[{ name: 'bang-luong-2026.xlsx', size: 42_000, type: 'application/vnd.ms-excel' }]}
          onSelect={() => {}}
          onRemove={() => {}}
          disabled
        />
        <p className={styles.helper}>
          Vùng drop không nằm trong thứ tự tab và file đã chọn vẫn hiển thị nhưng không xoá được.
        </p>
      </section>
    </div>
  );
}
