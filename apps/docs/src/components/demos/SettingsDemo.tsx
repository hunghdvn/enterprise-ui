import { useState } from 'react';
import { Button, Checkbox, ProfileForm, SettingsProfile } from '@enterprise-ui/components';
import type { ProfileFormValues, SettingsSection } from '@enterprise-ui/components';
import styles from './demos.module.css';

const INITIAL_PROFILE: ProfileFormValues = {
  displayName: 'Nguyễn Văn A',
  email: 'an.nguyen@congty.vn',
  phone: '0901 234 567',
  jobTitle: 'Trưởng nhóm vận hành',
  department: 'Vận hành',
};

const SECTION_LABEL: Record<string, string> = {
  profile: 'Hồ sơ',
  notifications: 'Thông báo',
};

export function SettingsDemo() {
  const [active, setActive] = useState('profile');
  const [profile, setProfile] = useState<ProfileFormValues>(INITIAL_PROFILE);
  // The cancel button must undo edits, not a save: this baseline moves only on submit.
  const [saved, setSaved] = useState<ProfileFormValues>(INITIAL_PROFILE);
  const [notify, setNotify] = useState({ email: true, weekly: false });
  const [message, setMessage] = useState('');

  const sections: SettingsSection[] = [
    {
      key: 'profile',
      label: 'Hồ sơ',
      description: 'Thông tin hiển thị với đồng nghiệp trong cùng tổ chức.',
      content: (
        <ProfileForm
          value={profile}
          onChange={(next) => {
            setProfile(next);
            setMessage('');
          }}
          onSubmit={(next) => {
            setProfile(next);
            setSaved(next);
            setMessage(`Đã lưu hồ sơ của ${next.displayName} (demo).`);
          }}
          onCancel={() => {
            setProfile(saved);
            setMessage('Đã huỷ các thay đổi chưa lưu (demo).');
          }}
          avatar={
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                inlineSize: 56,
                blockSize: 56,
                borderRadius: '50%',
                background: 'var(--surface-muted)',
                color: 'var(--action-text)',
                fontWeight: 700,
              }}
            >
              NA
            </span>
          }
          avatarHint="PNG hoặc JPG, tối đa 2 MB."
        />
      ),
    },
    {
      key: 'notifications',
      label: 'Thông báo',
      description: 'Kênh và tần suất nhận cập nhật.',
      content: (
        <div className={styles.stack}>
          <Checkbox
            checked={notify.email}
            onChange={(event) => setNotify({ ...notify, email: event.target.checked })}
          >
            Nhận thông báo qua email
          </Checkbox>
          <Checkbox
            checked={notify.weekly}
            onChange={(event) => setNotify({ ...notify, weekly: event.target.checked })}
          >
            Bản tin tổng hợp hằng tuần
          </Checkbox>
          <div className={styles.row}>
            <Button
              variant="secondary"
              onClick={() => setMessage('Đã lưu tuỳ chọn thông báo (demo).')}
            >
              Lưu tuỳ chọn
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.stack}>
      <div className={styles.toolbar}>
        <span className={styles.helper}>
          Mục đang mở: <strong>{SECTION_LABEL[active] ?? active}</strong>
        </span>
        <span className={styles.helper}>
          Chuyển mục rồi quay lại: giá trị đang gõ trong pane vẫn còn.
        </span>
      </div>

      <SettingsProfile
        as="div"
        level={2}
        title="Cài đặt tài khoản"
        subtitle="Thông tin cá nhân và tuỳ chọn thông báo."
        activeKey={active}
        onSectionChange={setActive}
        sections={sections}
      />

      {message && (
        <p className={styles.helper} role="status">
          {message}
        </p>
      )}
    </div>
  );
}
