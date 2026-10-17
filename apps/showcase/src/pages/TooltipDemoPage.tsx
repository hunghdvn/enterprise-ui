import { Button, Tooltip } from '@enterprise-ui/components';
import styles from './TooltipDemoPage.module.css';

export default function TooltipDemoPage() {
  const longText =
    'Đây là một đoạn văn bản rất dài và sẽ bị cắt bớt khi không đủ không gian hiển thị trong giao diện.';

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Tooltip</h2>
      <p className={styles.subtitle}>Demo các biến thể Tooltip.</p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>4 vị trí</h3>
        <div className={styles.row}>
          <Tooltip content="Tooltip phía trên" placement="top">
            <Button variant="secondary" size="sm">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="Tooltip phía dưới" placement="bottom">
            <Button variant="secondary" size="sm">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip content="Tooltip bên trái" placement="left">
            <Button variant="secondary" size="sm">
              Left
            </Button>
          </Tooltip>
          <Tooltip content="Tooltip bên phải" placement="right">
            <Button variant="secondary" size="sm">
              Right
            </Button>
          </Tooltip>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Văn bản bị cắt (truncated)</h3>
        <div className={styles.truncateWrap}>
          <Tooltip content={longText}>
            <span className={styles.truncated}>{longText}</span>
          </Tooltip>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Delay tuỳ chỉnh (1000ms)</h3>
        <Tooltip content="Hiện sau 1 giây" delay={1000}>
          <Button variant="primary" size="sm">
            Hover để xem
          </Button>
        </Tooltip>
      </section>
    </div>
  );
}
