import { useState } from 'react';
import { Input } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function InputDemo() {
  const [query, setQuery] = useState('');

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Có nhãn và trạng thái</h4>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-email">
              Email công việc
            </label>
            <Input id="demo-email" type="email" placeholder="ten@congty.vn" />
            <span className={styles.helper}>Dùng email công ty để nhận thông báo.</span>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-error">
              Mã đơn hàng
            </label>
            <Input id="demo-error" defaultValue="SO-12" error="Mã đơn phải có 6 ký tự." />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-disabled">
              Đã khoá
            </label>
            <Input id="demo-disabled" defaultValue="SO-1024" disabled />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Tìm kiếm có kiểm soát</h4>
        <div className={styles.field}>
          <Input
            type="search"
            placeholder="Tìm khách hàng…"
            aria-label="Tìm khách hàng"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className={styles.helper}>
            Giá trị hiện tại: <strong>{query || '—'}</strong>
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kích thước md</h4>
        <div className={styles.field}>
          <Input size="md" placeholder="Ô nhập lớn hơn cho form chính" />
        </div>
      </section>
    </div>
  );
}
