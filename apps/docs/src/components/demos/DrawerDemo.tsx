import { useState } from 'react';
import { Button, Drawer, Input, Select } from '@enterprise-ui/components';
import styles from './demos.module.css';

const STATUS_LABEL: Record<string, string> = {
  all: 'tất cả trạng thái',
  done: 'Hoàn thành',
  processing: 'Đang xử lý',
  pending: 'Chờ duyệt',
};

export function DrawerDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nội dung dài</h4>
        <div className={styles.row}>
          <Button onClick={() => setBasicOpen(true)}>Mở thông báo</Button>
        </div>
        <Drawer open={basicOpen} onClose={() => setBasicOpen(false)} title="Thông báo hệ thống">
          {Array.from({ length: 8 }, (_, index) => (
            <p key={index} className={styles.helper}>
              Mục {index + 1}. Phần thân drawer tự cuộn khi nội dung vượt chiều cao màn hình, còn
              header và nút đóng giữ nguyên vị trí.
            </p>
          ))}
          <div className={styles.actions}>
            <Button onClick={() => setBasicOpen(false)}>Đã đọc</Button>
          </div>
        </Drawer>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Xem nhanh chi tiết</h4>
        <div className={styles.row}>
          <Button variant="secondary" onClick={() => setDetailOpen(true)}>
            Xem đơn SO-1024
          </Button>
        </div>
        <Drawer open={detailOpen} onClose={() => setDetailOpen(false)} title="Đơn hàng SO-1024">
          <ul className={styles.plainList}>
            <li>
              <span>Khách hàng</span>
              <strong>Công ty Minh Phát</strong>
            </li>
            <li>
              <span>Trạng thái</span>
              <strong>Đang xử lý</strong>
            </li>
            <li>
              <span>Tổng tiền</span>
              <strong>12.400.000 ₫</strong>
            </li>
            <li>
              <span>Ngày tạo</span>
              <strong>04/11/2026</strong>
            </li>
          </ul>
          <p className={styles.helper}>
            Drawer phù hợp cho luồng xem nhanh mà không rời khỏi danh sách phía sau.
          </p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setDetailOpen(false)}>
              Đóng
            </Button>
          </div>
        </Drawer>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Bộ lọc dạng drawer</h4>
        <div className={styles.row}>
          <Button variant="secondary" onClick={() => setFilterOpen(true)}>
            Mở bộ lọc
          </Button>
          <span className={styles.helper}>
            Đang áp dụng: {STATUS_LABEL[status]}
            {search ? ` · từ khoá “${search}”` : ''}
          </span>
        </div>
        <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Bộ lọc đơn hàng">
          <div className={styles.field}>
            <label className={styles.label} htmlFor="drawer-demo-search">
              Tìm kiếm
            </label>
            <Input
              id="drawer-demo-search"
              placeholder="Mã đơn, khách hàng…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="drawer-demo-status">
              Trạng thái
            </label>
            <Select
              id="drawer-demo-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="done">Hoàn thành</option>
              <option value="processing">Đang xử lý</option>
              <option value="pending">Chờ duyệt</option>
            </Select>
          </div>
          <div className={styles.actions}>
            <Button
              variant="ghost"
              onClick={() => {
                setSearch('');
                setStatus('all');
              }}
            >
              Đặt lại
            </Button>
            <Button onClick={() => setFilterOpen(false)}>Áp dụng</Button>
          </div>
        </Drawer>
        <p className={styles.helper}>
          Bộ lọc áp dụng ngay khi thay đổi; nút “Áp dụng” chỉ đóng drawer. Trên mobile, có thể đưa
          FilterBar vào Drawer để nhường chỗ cho danh sách.
        </p>
      </section>
    </div>
  );
}
