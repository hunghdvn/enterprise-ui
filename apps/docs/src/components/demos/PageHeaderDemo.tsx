import { useState } from 'react';
import { Button, PageHeader } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function PageHeaderDemo() {
  const [backCount, setBackCount] = useState(0);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chỉ tiêu đề</h4>
        <div className={styles.box}>
          <PageHeader title="Danh sách đơn hàng" />
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Mô tả và hành động</h4>
        <div className={styles.box}>
          <PageHeader
            title="Đơn hàng SO-1042"
            subtitle="Công ty Minh Phát · tạo lúc 09:30, 17/10/2026"
            actions={
              <>
                <Button variant="secondary" size="sm">
                  In hoá đơn
                </Button>
                <Button variant="primary" size="sm">
                  Chỉnh sửa
                </Button>
              </>
            }
          />
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nút quay lại</h4>
        <div className={styles.box}>
          <PageHeader
            title="Chi tiết khách hàng"
            subtitle="Mã KH-204 · Hà Nội"
            onBack={() => setBackCount((count) => count + 1)}
            backLabel="Về danh sách"
          />
        </div>
        <p className={styles.helper}>
          Đã bấm quay lại: <strong>{backCount}</strong> lần. Nút chỉ render khi có{' '}
          <code>onBack</code>.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Tiêu đề dài</h4>
        <div className={styles.box}>
          <PageHeader
            title="Đơn hàng SO-1042 — Công ty TNHH Thương mại và Dịch vụ Minh Phát chi nhánh Hà Nội"
            subtitle="Danh sách dòng hàng"
            actions={
              <Button variant="secondary" size="sm">
                Xuất PDF
              </Button>
            }
          />
        </div>
        <p className={styles.helper}>
          Tiêu đề và mô tả ellipsize trên một dòng; khu vực actions giữ nguyên bên phải.
        </p>
      </section>
    </div>
  );
}
