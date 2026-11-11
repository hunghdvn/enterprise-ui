import { useState } from 'react';
import { Button, Progress } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function ProgressDemo() {
  const [percent, setPercent] = useState(40);
  const [step, setStep] = useState(2);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Phần trăm có kiểm soát</h4>
        <Progress value={percent} label="Đang nhập dữ liệu" showValue />
        <div className={styles.row}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setPercent((value) => Math.max(0, value - 10))}
          >
            −10%
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setPercent((value) => Math.min(100, value + 10))}
          >
            +10%
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Thang 5 bước</h4>
        <Progress value={step} max={5} label={`Bước ${step}/5`} showValue />
        <div className={styles.row}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
          >
            Bước trước
          </Button>
          <Button size="sm" onClick={() => setStep((value) => Math.min(5, value + 1))}>
            Bước tiếp
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Hai kích thước</h4>
        <Progress value={68} size="sm" label="Thanh mảnh (sm)" />
        <Progress value={68} size="md" label="Thanh dày (md)" />
      </section>
    </div>
  );
}
