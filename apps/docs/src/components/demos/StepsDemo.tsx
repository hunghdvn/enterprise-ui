import { useState } from 'react';
import { Button, Steps } from '@enterprise-ui/components';
import type { Step } from '@enterprise-ui/components';
import styles from './demos.module.css';

const STEPS: Step[] = [
  { id: 'info', label: 'Thông tin đơn' },
  { id: 'detail', label: 'Chi tiết', optional: true },
  { id: 'confirm', label: 'Xác nhận' },
];

export function StepsDemo() {
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Wizard tạo đơn</h4>
        <Steps steps={STEPS} currentStep={step} onChange={setStep} aria-label="Tạo đơn mới" />
        <div className={styles.box}>
          {done ? (
            <div className={styles.toolbar}>
              <p className={styles.helper}>
                Đơn SO-1031 đã được tạo. Bấm “Làm lại” để chạy lại wizard từ đầu.
              </p>
              <Button size="sm" variant="secondary" onClick={() => setStep(0)}>
                Làm lại
              </Button>
            </div>
          ) : (
            <>
              {step === 0 && (
                <p className={styles.helper}>
                  Bước 1: nhập mã đơn, khách hàng và ngày giao mong muốn.
                </p>
              )}
              {step === 1 && (
                <p className={styles.helper}>
                  Bước 2 (tuỳ chọn): thêm ghi chú giao hàng, hoặc bấm “Tiếp theo” để bỏ qua.
                </p>
              )}
              {step === 2 && (
                <p className={styles.helper}>Bước 3: kiểm tra lại thông tin rồi bấm “Hoàn tất”.</p>
              )}
              <p className={styles.helper}>
                Bấm vào một bước đã hoàn thành để quay lại; bước chưa tới bị vô hiệu hoá.
              </p>
            </>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chế độ chỉ đọc, kích thước md</h4>
        <Steps steps={STEPS} currentStep={1} size="md" disabled aria-label="Tiến độ xử lý đơn" />
        <p className={styles.helper}>
          Khi truyền <code>disabled</code>, thanh không có nút điều hướng và mọi marker đều bị vô
          hiệu hoá; dùng cho màn hình chỉ xem tiến độ.
        </p>
      </section>
    </div>
  );
}
