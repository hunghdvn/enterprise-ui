import { useState } from 'react';
import { Steps, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './StepsPage.module.css';

const steps = [
  { id: 'info', label: 'Thông tin đơn' },
  { id: 'detail', label: 'Chi tiết' },
  { id: 'confirm', label: 'Xác nhận' },
];

const props: PropDoc[] = [
  {
    name: 'steps',
    type: 'Step[]',
    description: 'Danh sách bước { id, label, description?, optional? }.',
  },
  {
    name: 'currentStep',
    type: 'number',
    description: 'Index bước hiện tại (0-based); = steps.length nghĩa là hoàn tất.',
  },
  {
    name: 'onChange',
    type: '(index: number) => void',
    description: 'Báo bước mới; index === steps.length = bấm Hoàn tất.',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Kích thước marker.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Vô hiệu hoá toàn bộ.' },
  { name: 'aria-label', type: 'string', description: 'Nhãn a11y cho danh sách bước.' },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ.' },
];

const code = `import { useState } from 'react';
import { Steps } from '@enterprise-ui/components';

const steps = [
  { id: 'info', label: 'Thông tin đơn' },
  { id: 'detail', label: 'Chi tiết' },
  { id: 'confirm', label: 'Xác nhận' },
];

export function NewOrderWizard() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if (done) return <p>Đã tạo đơn thành công.</p>;

  return (
    <>
      <Steps steps={steps} currentStep={step} onChange={(i) => (i === steps.length ? setDone(true) : setStep(i))} />
      {step === 0 && <p>Bước 1: nhập thông tin đơn.</p>}
      {step === 1 && <p>Bước 2: nhập chi tiết.</p>}
      {step === 2 && <p>Bước 3: xác nhận và bấm Hoàn tất.</p>}
    </>
  );
}`;

export default function StepsPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [note, setNote] = useState('');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Steps</h1>
      <p className={styles.subtitle}>Thanh tiến trình có thể điều hướng cho wizard nhiều bước.</p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Wizard tạo đơn</h2>
                    <Steps
                      steps={steps}
                      currentStep={step}
                      onChange={(i) => (i === steps.length ? setDone(true) : setStep(i))}
                      aria-label="Tạo đơn mới"
                    />
                    {!done && (
                      <div className={styles.body}>
                        {step === 0 && (
                          <p>Bước 1: nhập thông tin đơn hàng (mã, khách hàng, ngày giao).</p>
                        )}
                        {step === 1 && (
                          <div className={styles.field}>
                            <label htmlFor="step-note" className={styles.label}>
                              Ghi chú đơn
                            </label>
                            <textarea
                              id="step-note"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              placeholder="Nhập ghi chú..."
                              className={styles.textarea}
                            />
                          </div>
                        )}
                        {step === 2 && <p>Bước 3: xác nhận và bấm Hoàn tất.</p>}
                      </div>
                    )}
                    {done && <p className={styles.done}>Đã tạo đơn thành công.</p>}
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
