import { useState } from 'react';
import {
  Button,
  Checkbox,
  Field,
  Form,
  Input,
  ProfileForm,
  SettingsProfile,
  useToast,
} from '@enterprise-ui/components';
import type { ProfileFormValues, SettingsSection } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './SettingsPage.module.css';

const INITIAL_PROFILE: ProfileFormValues = {
  displayName: 'Nguyễn Văn A',
  email: 'an.nguyen@congty.vn',
  phone: '0901234567',
  jobTitle: 'Kế toán trưởng',
  department: 'Tài chính',
};

const settingsProps: PropDoc[] = [
  {
    name: 'sections',
    type: 'SettingsSection[]',
    description:
      '(bắt buộc) Mỗi section gồm key định danh, label (cũng là tiêu đề pane), description tuỳ chọn và content. Pane không active vẫn được mount với thuộc tính hidden, nên giá trị đang gõ dở ở section khác không mất khi chuyển qua lại.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    default: "'Cài đặt'",
    description: 'Tiêu đề trang; null hoặc chuỗi rỗng vẫn render thẻ tiêu đề rỗng theo level.',
  },
  {
    name: 'subtitle',
    type: 'ReactNode',
    description: 'Dòng mô tả dưới tiêu đề; bỏ trống thì không render đoạn văn.',
  },
  {
    name: 'actions',
    type: 'ReactNode',
    description:
      'Vùng action bên phải header (mời thành viên, xuất dữ liệu, audit log). Caller tự xử lý sự kiện.',
  },
  {
    name: 'activeKey',
    type: 'string',
    default: '—',
    description:
      'Chế độ controlled. Khi truyền, click chỉ gọi onSectionChange và pane không tự đổi. Key không khớp section nào sẽ rơi về section đầu tiên thay vì để trắng trang.',
  },
  {
    name: 'defaultActiveKey',
    type: 'string',
    default: 'sections[0].key',
    description: 'Section mở đầu khi không controlled.',
  },
  {
    name: 'onSectionChange',
    type: '(key: string) => void',
    description: 'Bắn ra khi người dùng click một mục trong nav; chạy cả ở chế độ uncontrolled.',
  },
  {
    name: 'navLabel',
    type: 'string',
    default: "'Mục cài đặt'",
    description:
      'Tên của nav landmark. Nav dùng button thay vì link vì template không điều hướng; mục active mang aria-current="page".',
  },
  {
    name: 'level',
    type: '1 | 2',
    default: '1',
    description:
      'Cấp tiêu đề trang. level={1} cho h1 + h2 cho pane; level={2} cho h2 + h3 khi template nằm dưới một h1 khác (ví dụ trang này).',
  },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ.' },
];

const profileProps: PropDoc[] = [
  {
    name: 'value',
    type: 'ProfileFormValues',
    description:
      '(bắt buộc) Năm khoá displayName, email, phone, jobTitle, department. Component thuần controlled, không tự giữ state.',
  },
  {
    name: 'onChange',
    type: '(value: ProfileFormValues) => void',
    description:
      '(bắt buộc) Nhận cả object mới sau mỗi lần sửa. Phải áp dụng ngay hoặc dùng functional update, nếu không hai lần sửa trước một render sẽ cùng spread một value cũ.',
  },
  {
    name: 'onSubmit',
    type: '(value: ProfileFormValues) => void',
    description:
      '(bắt buộc) Nhận giá trị đọc từ DOM khi submit, nên autofill không bắn onChange vẫn được gửi kèm. Nếu giá trị đọc khác value, onChange được gọi với cùng object trước onSubmit để render kế tiếp không xoá mất chữ vừa autofill.',
  },
  {
    name: 'errors',
    type: 'Partial<Record<keyof ProfileFormValues, string>>',
    description:
      'Lỗi theo từng field; caller tự validate. Field gắn aria-invalid và aria-describedby, thông báo lỗi có role="alert".',
  },
  {
    name: 'required',
    type: 'readonly (keyof ProfileFormValues)[]',
    default: "['displayName', 'email']",
    description: 'Field bắt buộc: hiện dấu hoa thị và đặt aria-required.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description:
      'Đặt aria-busy lên form, khoá nút submit và chặn cả submit bằng Enter. Nút Huỷ vẫn bấm được để thoát.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Khoá toàn bộ input và cả hai nút.',
  },
  {
    name: 'avatar',
    type: 'ReactNode',
    description: 'Khối ảnh đại diện hoặc chữ viết tắt phía trên các field; caller tự lo upload.',
  },
  {
    name: 'avatarHint',
    type: 'ReactNode',
    description: 'Gợi ý dưới avatar (định dạng, dung lượng); chỉ render khi có avatar.',
  },
  {
    name: 'onCancel',
    type: '() => void',
    description: 'Có mặt thì render thêm nút Huỷ loại secondary; không có thì chỉ còn nút submit.',
  },
  {
    name: 'displayNameLabel, emailLabel, phoneLabel, jobTitleLabel, departmentLabel',
    type: 'string',
    description: 'Nhãn từng field, mặc định theo tiếng Việt.',
  },
  {
    name: 'submitLabel, cancelLabel',
    type: 'string',
    default: "'Lưu thay đổi' / 'Huỷ'",
    description: 'Nhãn hai nút hành động.',
  },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho form.' },
];

const code = `import { useState } from 'react';
import { ProfileForm, SettingsProfile } from '@enterprise-ui/components';
import type { ProfileFormValues } from '@enterprise-ui/components';

export function AccountSettings() {
  const [active, setActive] = useState('profile');
  const [profile, setProfile] = useState<ProfileFormValues>({
    displayName: 'Nguyễn Văn A',
    email: 'an.nguyen@congty.vn',
    phone: '0901234567',
    jobTitle: 'Kế toán trưởng',
    department: 'Tài chính',
  });

  return (
    <SettingsProfile
      activeKey={active}
      onSectionChange={setActive}
      sections={[
        {
          key: 'profile',
          label: 'Thông tin cá nhân',
          description: 'Ảnh đại diện và thông tin liên hệ.',
          content: (
            <ProfileForm
              value={profile}
              onChange={setProfile}
              onSubmit={(next) => console.log('Lưu hồ sơ', next)}
              onCancel={() => setProfile(profile)}
            />
          ),
        },
        {
          key: 'notifications',
          label: 'Thông báo',
          content: <p>Nhóm checkbox do caller tự dựng.</p>,
        },
      ]}
    />
  );
}`;

export default function SettingsPage() {
  const { toast } = useToast();
  const [active, setActive] = useState('profile');
  const [profile, setProfile] = useState<ProfileFormValues>(INITIAL_PROFILE);
  const [notify, setNotify] = useState({ email: true, daily: false, weekly: true });
  const [password, setPassword] = useState('');
  const [confirmingDisable, setConfirmingDisable] = useState(false);

  const sections: SettingsSection[] = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      description: 'Ảnh đại diện và thông tin liên hệ hiển thị với đồng nghiệp.',
      content: (
        <ProfileForm
          value={profile}
          onChange={setProfile}
          onSubmit={(next) => toast.show(`Đã lưu hồ sơ của ${next.displayName}.`, 'success')}
          onCancel={() => {
            setProfile(INITIAL_PROFILE);
            toast.show('Đã huỷ thay đổi (demo).', 'info');
          }}
          avatar={<span className={styles.avatar}>NA</span>}
          avatarHint="PNG hoặc JPG, tối đa 2 MB."
        />
      ),
    },
    {
      key: 'notifications',
      label: 'Thông báo',
      description: 'Chọn kênh và tần suất nhận thông báo.',
      content: (
        <div className={styles.toggles}>
          <Checkbox
            checked={notify.email}
            onChange={(event) => setNotify({ ...notify, email: event.target.checked })}
          >
            Nhận thông báo qua email
          </Checkbox>
          <Checkbox
            checked={notify.daily}
            onChange={(event) => setNotify({ ...notify, daily: event.target.checked })}
          >
            Bản tin tổng hợp hằng ngày
          </Checkbox>
          <Checkbox
            checked={notify.weekly}
            onChange={(event) => setNotify({ ...notify, weekly: event.target.checked })}
          >
            Báo cáo hiệu suất hằng tuần
          </Checkbox>
          <div className={styles.row}>
            <Button onClick={() => toast.show('Đã lưu tuỳ chọn thông báo (demo).', 'success')}>
              Lưu tuỳ chọn
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: 'security',
      label: 'Bảo mật',
      description: 'Đổi mật khẩu và quản lý quyền truy cập tài khoản.',
      content: (
        <Form
          aria-label="Đổi mật khẩu"
          onSubmit={(event) => {
            event.preventDefault();
            setPassword('');
            toast.show('Đã cập nhật mật khẩu (demo).', 'success');
          }}
          className={styles.security}
        >
          {/* A password input outside a form trips a browser warning and leaves password
              managers nothing to hook into, so this pane is its own form. */}
          <Field label="Mật khẩu mới" hint="Tối thiểu 8 ký tự.">
            <Input
              type="password"
              name="newPassword"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <div className={styles.row}>
            <Button type="submit" variant="secondary">
              Đổi mật khẩu
            </Button>
          </div>
          <div className={styles.danger}>
            <p className={styles.dangerText}>
              Vô hiệu hoá tài khoản sẽ chặn mọi lần đăng nhập cho tới khi quản trị viên mở lại.
            </p>
            {confirmingDisable ? (
              <div className={styles.row}>
                <Button
                  variant="danger"
                  onClick={() => {
                    setConfirmingDisable(false);
                    toast.show('Đã vô hiệu hoá tài khoản (demo).', 'error');
                  }}
                >
                  Xác nhận vô hiệu hoá
                </Button>
                <Button variant="secondary" onClick={() => setConfirmingDisable(false)}>
                  Huỷ
                </Button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setConfirmingDisable(true)}>
                Vô hiệu hoá tài khoản
              </Button>
            )}
          </div>
        </Form>
      ),
    },
  ];

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>SettingsProfile và ProfileForm</h1>
      <p className={styles.subtitle}>
        Template trang cài đặt: header dùng chung, nav section và mỗi section là một vùng có tên
        riêng. Pane không active vẫn mount với hidden nên chữ đang gõ dở không mất khi chuyển
        section.
      </p>
      <DemoPlayground>
        <div className={styles.frame}>
          <SettingsProfile
            title="Cài đặt tài khoản"
            subtitle="Thông tin cá nhân, thông báo và bảo mật."
            level={2}
            sections={sections}
            activeKey={active}
            onSectionChange={setActive}
          />
        </div>
      </DemoPlayground>
      <p className={styles.note}>
        Demo chạy ở chế độ controlled (activeKey + onSectionChange) và mount template với level=
        &#123;2&#125; vì trang docs đã có h1 riêng. Nav ở đây là nav landmark với button, không phải
        tablist: chuyển section là chuyển giữa các form độc lập, không phải chuyển tab trong cùng
        một widget, nên không cần roving tabindex hay điều hướng bằng phím mũi tên. Security dùng
        xác nhận hai bước ngay trong pane thay vì Modal.
      </p>
      <h2 className={styles.sectionTitle}>Code</h2>
      <CodeBlock code={code} />
      <h2 className={styles.sectionTitle}>Props — SettingsProfile</h2>
      <PropsTable props={settingsProps} />
      <h2 className={styles.sectionTitle}>Props — ProfileForm</h2>
      <PropsTable props={profileProps} />
    </main>
  );
}
