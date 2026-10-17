import { useState } from 'react';
import { Button, Modal, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './ModalPage.module.css';

const props: PropDoc[] = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Trạng thái mở/đóng (controlled) — khi false Modal không render gì.',
  },
  {
    name: 'onClose',
    type: '() => void',
    description: 'Gọi khi bấm nút ✕, nhấn Escape hoặc bấm vùng nền (overlay).',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Tiêu đề trên thanh header; cũng là aria-label của hộp thoại.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Nội dung thân hộp thoại — nút hành động cũng đặt ở đây vì API không có prop footer/size.',
  },
];

const terms = [
  'Điều 1. Thông tin trong hộp thoại này chỉ dùng cho mục đích minh hoạ giao diện và không phải văn bản pháp lý.',
  'Điều 2. Khi nội dung vượt quá chiều cao khung, panel tự cuộn thay vì kéo dài trang — phần header vẫn nằm trong vùng cuộn.',
  'Điều 3. Người dùng có thể đóng hộp thoại bằng nút ✕, phím Escape hoặc bấm ra vùng nền phía sau.',
  'Điều 4. Focus bị giữ trong panel khi hộp thoại mở; Tab và Shift+Tab quẩn quanh các control bên trong.',
  'Điều 5. Khi hộp thoại đóng, focus được trả về phần tử đã mở nó — quan trọng với điều hướng bàn phím.',
  'Điều 6. Nhiều hộp thoại có thể mở chồng nhau; hộp thoại trên cùng nhận Escape và Tab cho tới khi đóng.',
];

const code = `import { useState } from 'react';
import { Button, Modal } from '@enterprise-ui/components';

export function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Xoá đơn hàng
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Xoá đơn hàng?">
        <p>Đơn hàng SO-1024 sẽ bị xoá vĩnh viễn. Thao tác này không thể hoàn tác.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={() => setOpen(false)}>
            Xoá
          </Button>
        </div>
      </Modal>
    </>
  );
}`;

export default function ModalPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [longOpen, setLongOpen] = useState(false);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Modal</h1>
      <p className={styles.subtitle}>
        Hộp thoại trung tâm dạng controlled: khoá cuộn nền, trap focus, đóng bằng Escape hoặc vùng
        nền.
      </p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Cơ bản</h2>
                    <div className={styles.row}>
                      <Button onClick={() => setBasicOpen(true)}>Mở modal</Button>
                    </div>
                    <Modal open={basicOpen} onClose={() => setBasicOpen(false)} title="Thông báo">
                      <p className={styles.paragraph}>
                        Modal nhận nội dung qua <code>children</code> và không tự đóng — caller
                        quyết định trạng thái <code>open</code>.
                      </p>
                    </Modal>
                    <p className={styles.helper}>
                      Truyền <code>open</code> + <code>onClose</code>; overlay dùng position: fixed
                      nên hộp thoại nổi trên toàn trang.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Hộp thoại xác nhận</h2>
                    <div className={styles.row}>
                      <Button variant="danger" onClick={() => setActionOpen(true)}>
                        Xoá đơn hàng
                      </Button>
                    </div>
                    <Modal
                      open={actionOpen}
                      onClose={() => setActionOpen(false)}
                      title="Xoá đơn hàng?"
                    >
                      <p className={styles.paragraph}>
                        Đơn hàng SO-1024 và toàn bộ dòng chi tiết sẽ bị xoá vĩnh viễn. Thao tác này
                        không thể hoàn tác.
                      </p>
                      <div className={styles.actions}>
                        <Button variant="secondary" onClick={() => setActionOpen(false)}>
                          Huỷ
                        </Button>
                        <Button variant="danger" onClick={() => setActionOpen(false)}>
                          Xoá
                        </Button>
                      </div>
                    </Modal>
                    <p className={styles.helper}>
                      Nút hành động đặt trong <code>children</code> — Modal không có prop{' '}
                      <code>footer</code>, hàng nút do caller tự bố trí.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Nội dung dài (tự cuộn)</h2>
                    <div className={styles.row}>
                      <Button variant="secondary" onClick={() => setLongOpen(true)}>
                        Mở modal dài
                      </Button>
                    </div>
                    <Modal
                      open={longOpen}
                      onClose={() => setLongOpen(false)}
                      title="Điều khoản sử dụng"
                    >
                      {terms.map((text) => (
                        <p key={text} className={styles.paragraph}>
                          {text}
                        </p>
                      ))}
                      <div className={styles.actions}>
                        <Button onClick={() => setLongOpen(false)}>Đã đọc</Button>
                      </div>
                    </Modal>
                    <p className={styles.helper}>
                      Panel giới hạn <code>max-height: 90vh</code> kèm <code>overflow: auto</code> —
                      nội dung dài tự cuộn bên trong.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Hành vi</h2>
                    <ul className={styles.behaviors}>
                      <li>Escape và click vùng nền gọi onClose (click trong panel không đóng).</li>
                      <li>Focus được trap trong panel; Tab/Shift+Tab quẩn quanh các control.</li>
                      <li>Đóng modal, focus quay về phần tử đã mở nó.</li>
                      <li>Cuộn trang nền bị khoá trong lúc modal mở.</li>
                      <li>Modal mở chồng nhau: hộp thoại trên cùng nhận Escape và Tab.</li>
                    </ul>
                  </section>
                </div>
              </DemoPlayground>
            ),
          },
          { key: 'props', label: 'Props', content: <PropsTable props={props} /> },
          { key: 'code', label: 'Code', content: <CodeBlock code={code} /> },
        ]}
      />
    </div>
  );
}
