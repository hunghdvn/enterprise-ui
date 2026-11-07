import { useState, type FormEvent } from 'react';
import { Button, Checkbox, Field, Form, Input, Select } from '@enterprise-ui/components';
import styles from './demos.module.css';

export function FormDemo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  function clearError(key: string) {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};

    if (!email.trim()) next.email = 'Vui lòng nhập email.';
    else if (!email.includes('@')) next.email = 'Email không hợp lệ.';

    if (!password) next.password = 'Vui lòng nhập mật khẩu.';
    else if (password.length < 6) next.password = 'Mật khẩu tối thiểu 6 ký tự.';

    setErrors(next);
    setStatus(
      Object.keys(next).length === 0
        ? 'Đăng nhập thành công (demo) — không gọi API thật.'
        : 'Vui lòng sửa các lỗi được đánh dấu.',
    );
  }

  function handleProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileSaved(true);
  }

  return (
    <div className={styles.stack}>
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Kiểm tra khi submit</h4>
        <Form errors={errors} onSubmit={handleLogin}>
          <Field label="Email" name="email" required>
            <Input
              type="email"
              autoComplete="email"
              placeholder="ban@congty.vn"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError('email');
              }}
            />
          </Field>
          <Field label="Mật khẩu" name="password" hint="Tối thiểu 6 ký tự." required>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError('password');
              }}
            />
          </Field>
          <div className={styles.row}>
            <Button type="submit">Đăng nhập</Button>
            <span className={styles.helper}>
              Lỗi nằm trong map <code>errors</code>; Field khớp theo <code>name</code>.
            </span>
          </div>
        </Form>
        {status && (
          <p className={styles.helper} role="status">
            {status}
          </p>
        )}
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Lỗi, gợi ý và required</h4>
        <Form onSubmit={(event) => event.preventDefault()}>
          <Field label="Email liên hệ" hint="Dùng để nhận thông báo đơn hàng.">
            <Input type="email" defaultValue="minhanh@congty.vn" />
          </Field>
          <Field label="Mã đơn hàng" error="Mã đơn hàng không tồn tại.">
            <Input defaultValue="SO-9999" />
          </Field>
          <Field
            label="Mã số thuế"
            hint="10 hoặc 13 chữ số."
            error="Mã số thuế không hợp lệ."
            required
          >
            <Input defaultValue="123" />
          </Field>
          <Field label="Điều khoản" hint="Bắt buộc để tiếp tục." required>
            <Checkbox>Tôi đồng ý với điều khoản sử dụng</Checkbox>
          </Field>
        </Form>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Bố cục lưới bằng className</h4>
        <Form className={styles.grid} onSubmit={handleProfile}>
          <Field label="Họ và tên" required>
            <Input defaultValue="Nguyễn Minh Anh" />
          </Field>
          <Field label="Phòng ban">
            <Select defaultValue="sales">
              <option value="sales">Kinh doanh</option>
              <option value="ops">Vận hành</option>
              <option value="support">Hỗ trợ khách hàng</option>
            </Select>
          </Field>
          <Field label="Email liên hệ" hint="Nhận thông báo đơn hàng.">
            <Input type="email" defaultValue="minhanh@congty.vn" />
          </Field>
          <Field label="Mã nhân viên">
            <Input defaultValue="NV-2048" disabled />
          </Field>
          <div className={styles.row}>
            <Button type="submit">Lưu hồ sơ</Button>
            {profileSaved && (
              <span className={styles.helper} role="status">
                Đã lưu hồ sơ (demo).
              </span>
            )}
          </div>
        </Form>
      </section>
    </div>
  );
}
