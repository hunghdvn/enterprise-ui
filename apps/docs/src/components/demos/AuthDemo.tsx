import { useState } from 'react';
import { AuthLayout, Button, Icon, LoginForm } from '@enterprise-ui/components';
import type { LoginFormValues } from '@enterprise-ui/components';
import styles from './demos.module.css';

type FieldKey = 'email' | 'password';

const INITIAL: LoginFormValues = {
  email: 'an.nguyen@congty.vn',
  password: '',
  remember: true,
};

/** Drops one field error without allocating a new object when the key is absent. */
function withoutKey(
  errors: Partial<Record<FieldKey, string>>,
  key: FieldKey,
): Partial<Record<FieldKey, string>> {
  if (!(key in errors)) return errors;
  const next = { ...errors };
  delete next[key];
  return next;
}

export function AuthDemo() {
  const [value, setValue] = useState<LoginFormValues>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [signedIn, setSignedIn] = useState(false);

  const handleChange = (next: LoginFormValues) => {
    setValue(next);
    if (next.email !== value.email) setErrors((prev) => withoutKey(prev, 'email'));
    if (next.password !== value.password) setErrors((prev) => withoutKey(prev, 'password'));
  };

  const handleSubmit = (next: LoginFormValues) => {
    const fieldErrors: Partial<Record<FieldKey, string>> = {};

    if (!next.email.trim()) fieldErrors.email = 'Vui lòng nhập email công ty.';
    else if (!next.email.includes('@')) fieldErrors.email = 'Email không hợp lệ.';
    if (next.password.length < 6) fieldErrors.password = 'Mật khẩu cần ít nhất 6 ký tự.';

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length === 0) {
      setValue(next);
      setSignedIn(true);
    }
  };

  const brand = (
    <span className={styles.row}>
      <Icon name="layout-grid" size={18} />
      Enterprise UI
    </span>
  );

  if (signedIn) {
    return (
      <AuthLayout
        as="div"
        fill={false}
        level={2}
        brand={brand}
        title="Đăng nhập thành công"
        subtitle={`Phiên demo đã được tạo cho ${value.email}.`}
        footer={<span>Đây là demo — không có API, token hay phiên thật nào được tạo.</span>}
      >
        <div className={styles.box}>
          <div className={styles.row}>
            <Icon name="check-circle" size={20} />
            <strong>Form đã trả giá trị hợp lệ qua onSubmit.</strong>
          </div>
          <p className={styles.helper}>
            Trong ứng dụng thật, đây là lúc chuyển route hoặc mở AppShell. Template không tự điều
            hướng và không gọi API.
          </p>
          <div className={styles.actions}>
            <Button
              variant="secondary"
              onClick={() => {
                setSignedIn(false);
                setValue({ ...INITIAL, email: value.email });
              }}
            >
              Đăng nhập lại
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      as="div"
      fill={false}
      level={2}
      brand={brand}
      title="Đăng nhập"
      subtitle="Dùng tài khoản công ty để tiếp tục."
      footer={<span>Chưa có tài khoản? Liên hệ quản trị viên để được cấp quyền.</span>}
    >
      <LoginForm
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
        errors={errors}
        forgotPassword={<span className={styles.helper}>Liên hệ IT để đặt lại</span>}
      >
        <p className={styles.helper}>
          Demo: mật khẩu từ 6 ký tự. Dữ liệu chỉ nằm trong bộ nhớ trình duyệt.
        </p>
      </LoginForm>
    </AuthLayout>
  );
}
