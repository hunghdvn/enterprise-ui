import { useState } from 'react';
import { SegmentedControl } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function SegmentedControlDemo() {
  const [view, setView] = useState('list');

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chuyển chế độ xem</h4>
        <SegmentedControl
          aria-label="Chế độ xem danh sách"
          value={view}
          onChange={setView}
          items={[
            { value: 'list', label: 'Danh sách', icon: 'layout-list' },
            { value: 'grid', label: 'Lưới', icon: 'layout-grid' },
            { value: 'table', label: 'Bảng', icon: 'table' },
          ]}
        />
        <p className={styles.helper}>
          Đang chọn: <strong>{view}</strong>. Dùng phím mũi tên để đổi lựa chọn.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kích thước và trạng thái</h4>
        <div className={styles.row}>
          <SegmentedControl
            aria-label="Khoảng thời gian"
            size="sm"
            defaultValue="week"
            items={[
              { value: 'day', label: 'Ngày' },
              { value: 'week', label: 'Tuần' },
              { value: 'month', label: 'Tháng' },
            ]}
          />
          <SegmentedControl
            aria-label="Chế độ hiển thị"
            size="md"
            defaultValue="comfortable"
            items={[
              { value: 'compact', label: 'Gọn' },
              { value: 'comfortable', label: 'Thoải mái' },
              { value: 'wide', label: 'Rộng', disabled: true },
            ]}
          />
        </div>
        <p className={styles.helper}>
          Mức <code>sm</code> thẳng hàng với input compact; mức <code>md</code> dùng cho toolbar
          thoáng hơn. Mục bị vô hiệu hoá sẽ bị bỏ qua khi dùng phím mũi tên.
        </p>
      </section>
    </div>
  );
}
