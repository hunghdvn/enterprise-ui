import { useState } from 'react';
import { Combobox } from '@enterprise-ui/components';
import type { ComboboxOption } from '@enterprise-ui/components';
import styles from './demos.module.css';

const people: ComboboxOption[] = [
  {
    value: 'an',
    label: 'Nguyễn Minh Anh',
    searchText: 'Nguyễn Minh Anh nguyen minh anh',
  },
  {
    value: 'binh',
    label: 'Trần Quốc Bình',
    searchText: 'Trần Quốc Bình tran quoc binh',
  },
  {
    value: 'chi',
    label: 'Lê Thu Chi',
    searchText: 'Lê Thu Chi le thu chi',
  },
  {
    value: 'dung',
    label: 'Phạm Tiến Dũng',
    searchText: 'Phạm Tiến Dũng pham tien dung',
  },
  {
    value: 'ha',
    label: 'Vũ Thanh Hà',
    searchText: 'Vũ Thanh Hà vu thanh ha',
  },
  {
    value: 'khanh',
    label: 'Đỗ Gia Khánh',
    searchText: 'Đỗ Gia Khánh do gia khanh',
  },
  {
    value: 'ngoc',
    label: 'Hoàng Mai Ngọc',
    searchText: 'Hoàng Mai Ngọc hoang mai ngoc',
    disabled: true,
  },
];

function optionLabel(options: ComboboxOption[], value: string): string {
  const label = options.find((option) => option.value === value)?.label;
  return typeof label === 'string' ? label : value;
}

export function ComboboxDemo() {
  const [owner, setOwner] = useState('an');
  const [members, setMembers] = useState<string[]>(['an', 'chi']);

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-combobox-owner">
              Người phụ trách
            </label>
            <Combobox
              id="demo-combobox-owner"
              options={people}
              value={owner}
              onChange={(next) => setOwner(Array.isArray(next) ? (next[0] ?? '') : next)}
              placeholder="Chọn người phụ trách..."
              searchPlaceholder="Tìm người phụ trách..."
            />
            <span className={styles.helper}>
              Đang chọn: <strong>{optionLabel(people, owner)}</strong>
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-combobox-members">
              Thành viên theo dõi
            </label>
            <Combobox
              id="demo-combobox-members"
              multiple
              options={people}
              value={members}
              onChange={(next) => setMembers(Array.isArray(next) ? next : [])}
              placeholder="Thêm thành viên..."
              searchPlaceholder="Tìm thành viên..."
            />
            <span className={styles.helper}>
              Đã chọn {members.length} thành viên; xoá chip hoặc nhấn Backspace để bỏ.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="demo-combobox-disabled">
              Nhóm đã khoá
            </label>
            <Combobox
              id="demo-combobox-disabled"
              options={people}
              defaultValue="an"
              disabled
              placeholder="Không thể thay đổi"
            />
            <span className={styles.helper}>
              Không thể mở danh sách hoặc xoá chip khi component bị vô hiệu hoá.
            </span>
          </div>
        </div>
      </section>

      <p className={styles.helper}>
        Gõ không dấu vẫn tìm được nhờ <code>searchText</code>; mục “Hoàng Mai Ngọc” bị vô hiệu hoá ở
        cấp option.
      </p>
    </div>
  );
}
