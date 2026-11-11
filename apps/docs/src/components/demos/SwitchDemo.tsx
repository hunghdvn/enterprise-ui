import { useState } from 'react';
import { Switch } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function SwitchDemo() {
  const [email, setEmail] = useState(true);
  const [digest, setDigest] = useState(false);
  const active = [email && 'email', digest && 'bản tóm tắt hàng tuần'].filter(Boolean);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Công tắc có kiểm soát</h4>
        <div className={styles.field}>
          <Switch checked={email} onChange={(event) => setEmail(event.currentTarget.checked)}>
            Thông báo qua email
          </Switch>
          <Switch checked={digest} onChange={(event) => setDigest(event.currentTarget.checked)}>
            Bản tóm tắt hàng tuần
          </Switch>
          <Switch disabled>Kênh do quản trị viên khoá</Switch>
        </div>
        <p className={styles.helper}>
          Đang bật: <strong>{active.length ? active.join(', ') : 'không có'}</strong>
        </p>
      </section>
    </div>
  );
}
