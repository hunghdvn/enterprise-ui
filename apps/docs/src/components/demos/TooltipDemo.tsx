import { Button, Icon, Tooltip } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function TooltipDemo() {
  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Bốn hướng</h4>
        <div className={styles.tooltipStage}>
          <Tooltip content="Hiện phía trên" placement="top">
            <Button variant="secondary">Top</Button>
          </Tooltip>
          <Tooltip content="Hiện bên phải" placement="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>
          <Tooltip content="Hiện bên trái" placement="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>
          <Tooltip content="Hiện phía dưới" placement="bottom">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
        </div>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Icon button và nội dung dài</h4>
        <div className={styles.row}>
          <Tooltip content="Tải xuống báo cáo tháng 10">
            <Button
              variant="ghost"
              aria-label="Tải xuống"
              icon={<Icon name="download" size={16} />}
            />
          </Tooltip>
          <Tooltip
            content="Tooltip tự xuống dòng khi nội dung dài, tối đa 240px và không che mất control đang focus."
            delay={400}
          >
            <Button variant="secondary">Delay 400ms</Button>
          </Tooltip>
        </div>
      </section>
    </div>
  );
}
