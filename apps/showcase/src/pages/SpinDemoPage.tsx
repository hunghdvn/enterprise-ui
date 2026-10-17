import { useState } from 'react';
import { Button, Spin } from '@enterprise-ui/components';
import styles from './SpinDemoPage.module.css';

export default function SpinDemoPage() {
  const [fullscreen, setFullscreen] = useState(false);

  const triggerFullscreen = () => {
    setFullscreen(true);
    window.setTimeout(() => setFullscreen(false), 2000);
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Spin</h2>
      <p className={styles.subtitle}>Demo các biến thể Spin.</p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>3 kích thước</h3>
        <div className={styles.row}>
          <Spin size="sm" />
          <Spin size="md" />
          <Spin size="lg" />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Với tip</h3>
        <Spin tip="Đang tải dữ liệu..." />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Fullscreen (2s)</h3>
        <Button variant="primary" size="sm" onClick={triggerFullscreen}>
          Bật fullscreen
        </Button>
        {fullscreen && <Spin fullscreen tip="Đang xử lý..." />}
      </section>
    </div>
  );
}
