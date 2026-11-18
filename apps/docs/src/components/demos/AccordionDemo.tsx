import { useState } from 'react';
import { Accordion, Button, Input } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function AccordionDemo() {
  const [open, setOpen] = useState<string | null>('notifications');

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Một mục mở, có mục bị khoá</h4>
        <Accordion
          headingLevel={5}
          defaultValue="general"
          items={[
            {
              id: 'general',
              title: 'Thông tin chung',
              content: (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="acc-company">
                    Tên công ty
                  </label>
                  <Input id="acc-company" defaultValue="Công ty Minh Phát" />
                </div>
              ),
            },
            {
              id: 'billing',
              title: 'Thanh toán',
              content: (
                <p className={styles.helper}>
                  Hoá đơn điện tử gửi tới Kế toán. Thay đổi thông tin thanh toán cần quyền quản trị.
                </p>
              ),
            },
            {
              id: 'security',
              title: 'Bảo mật',
              content: <p className={styles.helper}>Chỉ quản trị viên hệ thống mở được mục này.</p>,
              disabled: true,
            },
          ]}
        />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nhiều mục mở cùng lúc</h4>
        <Accordion
          multiple
          headingLevel={5}
          defaultValues={['general', 'billing']}
          items={[
            {
              id: 'general',
              title: 'Thông tin chung',
              content: <p className={styles.helper}>Mở sẵn cùng mục “Thanh toán”.</p>,
            },
            {
              id: 'billing',
              title: 'Thanh toán',
              content: <p className={styles.helper}>Đóng/mở độc lập với các mục còn lại.</p>,
            },
            {
              id: 'shipping',
              title: 'Vận chuyển',
              content: <p className={styles.helper}>Mặc định đóng.</p>,
            },
          ]}
        />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Controlled — nút đóng tất cả</h4>
        <Accordion
          headingLevel={5}
          value={open}
          onChange={setOpen}
          items={[
            {
              id: 'notifications',
              title: 'Thông báo',
              content: <p className={styles.helper}>Email khi có đơn mới hoặc yêu cầu duyệt.</p>,
            },
            {
              id: 'language',
              title: 'Ngôn ngữ',
              content: <p className={styles.helper}>Giao diện tiếng Việt, dữ liệu theo locale.</p>,
            },
          ]}
        />
        <Button size="sm" variant="secondary" onClick={() => setOpen(null)}>
          Đóng tất cả
        </Button>
      </section>
    </div>
  );
}
