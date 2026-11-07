import { useState } from 'react';
import { Select } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function SelectDemo() {
  const [team, setTeam] = useState('sales');

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chọn một giá trị</h4>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-team">
              Nhóm phụ trách
            </label>
            <Select id="demo-team" value={team} onChange={(event) => setTeam(event.target.value)}>
              <option value="sales">Kinh doanh</option>
              <option value="ops">Vận hành</option>
              <option value="finance">Tài chính</option>
              <option value="support">Hỗ trợ khách hàng</option>
            </Select>
            <span className={styles.helper}>
              Đang chọn: <strong>{team}</strong>
            </span>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-select-error">
              Trạng thái lỗi
            </label>
            <Select id="demo-select-error" error="Vui lòng chọn phòng ban." defaultValue="">
              <option value="" disabled>
                — Chọn phòng ban —
              </option>
              <option value="product">Sản phẩm</option>
            </Select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-select-disabled">
              Vô hiệu hoá
            </label>
            <Select id="demo-select-disabled" defaultValue="locked" disabled>
              <option value="locked">Đã chốt cấu hình</option>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}
