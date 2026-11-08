import { useState } from 'react';
import { FilterBar, Input, Select } from '@enterprise-ui/components';
import styles from './demos.module.css';

const STATUS_LABEL: Record<string, string> = {
  '': 'tất cả',
  open: 'Chờ duyệt',
  shipping: 'Đang giao',
  done: 'Hoàn thành',
};

export function FilterBarDemo() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [quickSearch, setQuickSearch] = useState('');

  const resetAll = () => {
    setSearch('');
    setStatus('');
    setFrom('');
  };

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Tìm kiếm, bộ lọc và đặt lại</h4>
        <FilterBar
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Tìm mã đơn, khách hàng…"
          densityToggle={false}
          filters={
            <>
              <Select
                aria-label="Trạng thái"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="open">Chờ duyệt</option>
                <option value="shipping">Đang giao</option>
                <option value="done">Hoàn thành</option>
              </Select>
              <Input
                type="date"
                aria-label="Từ ngày"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />
            </>
          }
          onReset={resetAll}
        />
        <p className={styles.helper}>
          Từ khoá: <strong>{search || '—'}</strong> · Trạng thái:{' '}
          <strong>{STATUS_LABEL[status]}</strong> · Từ ngày: <strong>{from || '—'}</strong>
        </p>
        <p className={styles.helper}>
          Nút mật độ chỉ hiện khi <code>FilterBar</code> nằm trong <code>ThemeProvider</code>; demo
          này tắt nút để không ghi đè theme/mật độ của trang docs. Trạng thái lọc vẫn nằm ở
          component cha.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Chỉ tìm kiếm, tắt nút mật độ</h4>
        <FilterBar
          searchValue={quickSearch}
          onSearch={setQuickSearch}
          densityToggle={false}
          searchPlaceholder="Tìm nhanh…"
        />
        <p className={styles.helper}>
          Không truyền <code>filters</code> hay <code>onReset</code>; thanh chỉ còn ô tìm kiếm. Giá
          trị hiện tại: <strong>{quickSearch || '—'}</strong>
        </p>
      </section>
    </div>
  );
}
