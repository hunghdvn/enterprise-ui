import { useState } from 'react';
import { Button, Modal } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function ModalDemo() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Hộp thoại xác nhận</h4>
        <div className={styles.row}>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Xoá đơn hàng
          </Button>
        </div>
        <Modal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Xoá đơn hàng SO-1024?"
        >
          <p className={styles.helper}>
            Đơn hàng và toàn bộ dòng chi tiết sẽ bị xoá vĩnh viễn. Thao tác này không thể hoàn tác.
          </p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Huỷ
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(false)}>
              Xoá
            </Button>
          </div>
        </Modal>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nội dung dài</h4>
        <div className={styles.row}>
          <Button variant="secondary" onClick={() => setInfoOpen(true)}>
            Mở điều khoản
          </Button>
        </div>
        <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title="Điều khoản sử dụng">
          {Array.from({ length: 6 }, (_, index) => (
            <p key={index} className={styles.helper}>
              Điều {index + 1}. Nội dung dài sẽ tự cuộn trong panel. Focus được giữ bên trong hộp
              thoại và trả về nút mở khi đóng.
            </p>
          ))}
          <div className={styles.actions}>
            <Button onClick={() => setInfoOpen(false)}>Đã đọc</Button>
          </div>
        </Modal>
      </section>
    </div>
  );
}
