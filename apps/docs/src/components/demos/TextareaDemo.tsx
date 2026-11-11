import { useState } from 'react';
import { Textarea } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function TextareaDemo() {
  const [note, setNote] = useState('');

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Có kiểm soát</h4>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="demo-note">
            Ghi chú đơn hàng
          </label>
          <Textarea
            id="demo-note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.currentTarget.value)}
            placeholder="Nhập ghi chú…"
          />
          <span className={styles.helper}>
            Số ký tự: <strong>{note.length}</strong>
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Trạng thái lỗi</h4>
        <div className={styles.field}>
          <Textarea
            aria-label="Ghi chú lỗi"
            defaultValue="Nội dung quá ngắn"
            error="Ghi chú cần ít nhất 20 ký tự."
          />
        </div>
      </section>
    </div>
  );
}
