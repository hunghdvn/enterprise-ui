import { Badge, Button, Icon, ThemeProvider, useTheme } from '@enterprise-ui/components';
import styles from './demos.module.css';
import themeStyles from './ThemeDemo.module.css';

function ThemePanel() {
  const { theme, density, setTheme, setDensity } = useTheme();

  return (
    <div className={themeStyles.panel}>
      <div className={themeStyles.header}>
        <div>
          <strong>Khu vực demo độc lập</strong>
          <p className={styles.helper}>
            Wrapper bên trong tự đổi theme, không ảnh hưởng đến trang docs bên ngoài.
          </p>
        </div>
        <div className={styles.row}>
          <Badge tone="blue">theme: {theme}</Badge>
          <Badge tone="orange">density: {density}</Badge>
        </div>
      </div>

      <div className={styles.row}>
        <Button
          variant="secondary"
          icon={<Icon name={theme === 'light' ? 'moon' : 'sun'} size={14} />}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          Đổi sang {theme === 'light' ? 'tối' : 'sáng'}
        </Button>
        <Button
          variant="secondary"
          icon={<Icon name="rows" size={14} />}
          onClick={() => setDensity(density === 'compact' ? 'comfortable' : 'compact')}
        >
          Mật độ {density === 'compact' ? 'thoáng' : 'gọn'}
        </Button>
      </div>

      <div className={themeStyles.surface}>
        <div className={styles.toolbar}>
          <span>Đơn hàng hôm nay</span>
          <Badge tone="green">128</Badge>
        </div>
        <ul className={styles.plainList}>
          <li>
            <span>SO-1024 · Cty An Phát</span>
            <Badge tone="green">Hoàn thành</Badge>
          </li>
          <li>
            <span>SO-1025 · Cty Minh Đức</span>
            <Badge tone="blue">Đang giao</Badge>
          </li>
          <li>
            <span>SO-1026 · Cty Hoà Bình</span>
            <Badge tone="orange">Chờ duyệt</Badge>
          </li>
        </ul>
        <div className={styles.row}>
          <Button size="sm">Lưu thay đổi</Button>
          <Button size="sm" variant="secondary">
            Huỷ
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ThemeDemo() {
  return (
    <ThemeProvider>
      <ThemePanel />
    </ThemeProvider>
  );
}
