import { useState } from 'react';
import { Pagination } from '@enterprise-ui/components';
import styles from './demos.module.css';

const CUSTOMERS = ['Công ty Minh Phát', 'Nhà máy Đông Á', 'Siêu thị An Khang', 'Công ty Hoà Bình'];

const ORDERS = Array.from({ length: 42 }, (_, index) => ({
  code: `SO-${1042 - index}`,
  customer: CUSTOMERS[index % CUSTOMERS.length],
}));

export function PaginationDemo() {
  const [page, setPage] = useState(2);
  const [manyPage, setManyPage] = useState(1);
  const [sizePage, setSizePage] = useState(2);

  const pageSize = 5;
  const start = (page - 1) * pageSize;
  const rows = ORDERS.slice(start, start + pageSize);
  const end = Math.min(start + pageSize, ORDERS.length);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Dữ liệu theo trang</h4>
        <ul className={styles.plainList}>
          {rows.map((order) => (
            <li key={order.code}>
              <span>{order.code}</span>
              <span className={styles.muted}>{order.customer}</span>
            </li>
          ))}
        </ul>
        <Pagination page={page} pageSize={pageSize} total={ORDERS.length} onChange={setPage} />
        <p className={styles.helper}>
          Trang {page} — hiển thị dòng {start + 1}–{end} trên {ORDERS.length} dòng.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Nhiều trang</h4>
        <Pagination page={manyPage} pageSize={10} total={487} onChange={setManyPage} />
        <p className={styles.helper}>
          49 trang — cửa sổ chỉ hiển thị 5 số quanh trang hiện tại; các trang xa hơn truy cập qua ô
          “Đi tới”.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kích thước trang tuỳ chỉnh</h4>
        <Pagination page={sizePage} pageSize={25} total={95} onChange={setSizePage} />
        <p className={styles.helper}>
          pageSize 25 — 95 dòng chia thành 4 trang. Trang hiện tại: {sizePage}.
        </p>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Không có dữ liệu</h4>
        <Pagination page={1} pageSize={10} total={0} />
        <p className={styles.helper}>
          total 0 — khoảng hiển thị “0-0 / 0”, chỉ còn một trang và hai nút điều hướng bị vô hiệu
          hoá.
        </p>
      </section>
    </div>
  );
}
