import { useState, type FormEvent } from 'react';
import { Button, Checkbox, Field, Form, Input, Select, Tabs } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './FormPage.module.css';

const formProps: PropDoc[] = [
  {
    name: 'errors',
    type: 'Record<string, string>',
    description:
      'Map lỗi theo tên field; Field có name khớp sẽ tự hiển thị lỗi và gắn aria-invalid.',
  },
  {
    name: 'onSubmit',
    type: '(e: FormEvent<HTMLFormElement>) => void',
    description:
      'Chuẩn HTML. Form đặt noValidate nên trình duyệt không chặn submit — caller tự kiểm tra dữ liệu.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Gộp vào class của <form> — dùng để đổi bố cục lưới cho cả form.',
  },
  {
    name: '...rest',
    type: 'FormHTMLAttributes<HTMLFormElement>',
    description:
      'Mọi thuộc tính form gốc khác (action, method, aria-*, ref...) được spread xuống DOM.',
  },
];

const fieldProps: PropDoc[] = [
  {
    name: 'label',
    type: 'string',
    description: 'Nhãn phía trên control (bắt buộc) — gắn htmlFor vào id của control.',
  },
  {
    name: 'children',
    type: 'ReactElement',
    description:
      'Một control duy nhất (Input, Select, Checkbox...); Field nhân bản để gắn id và các thuộc tính aria.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Khoá tra trong errors của Form — nguồn lỗi từ context (error tường minh thắng).',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Lỗi tường minh cho riêng field; ưu tiên hơn lỗi cùng tên từ Form errors.',
  },
  {
    name: 'hint',
    type: 'string',
    description:
      'Chú thích dưới control, nối vào aria-describedby (không lẫn vào tên truy cập của control).',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Hiện dấu * và gắn aria-required (trừ khi control đã tự khai báo).',
  },
];

const code = `import { useState, type FormEvent } from 'react';
import { Button, Field, Form, Input } from '@enterprise-ui/components';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrors({ email: 'Email không hợp lệ' });
      return;
    }
    setErrors({});
  };

  return (
    <Form errors={errors} onSubmit={handleSubmit}>
      <Field label="Email" name="email" required>
        <Input
          type="email"
          placeholder="ban@congty.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Button type="submit">Đăng nhập</Button>
    </Form>
  );
}`;

export default function FormPage() {
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

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = 'Vui lòng nhập email';
    else if (!email.includes('@')) next.email = 'Email không hợp lệ';
    if (!password) next.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6) next.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(next);
    setStatus(
      Object.keys(next).length === 0
        ? 'Đăng nhập thành công (demo) — không gọi API thật.'
        : 'Vui lòng sửa các lỗi được đánh dấu.',
    );
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Form</h1>
      <p className={styles.subtitle}>
        Form + Field: bọc control, nối nhãn/aria tự động và phân phối lỗi từ map errors của Form.
      </p>
      <Tabs
        items={[
          {
            key: 'demo',
            label: 'Demo',
            content: (
              <DemoPlayground>
                <div className={styles.demo}>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Đăng nhập có kiểm tra</h2>
                    <div className={styles.formWrap}>
                      <Form errors={errors} onSubmit={handleLogin}>
                        <Field label="Email" name="email" required>
                          <Input
                            type="email"
                            placeholder="ban@congty.vn"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              clearError('email');
                            }}
                          />
                        </Field>
                        <Field label="Mật khẩu" name="password" required>
                          <Input
                            type="password"
                            placeholder="Tối thiểu 6 ký tự"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              clearError('password');
                            }}
                          />
                        </Field>
                        <div className={styles.formActions}>
                          <Button type="submit">Đăng nhập</Button>
                        </div>
                      </Form>
                      {status && (
                        <p className={styles.status} role="status">
                          {status}
                        </p>
                      )}
                    </div>
                    <p className={styles.helper}>
                      Lỗi được trả qua <code>Form errors</code> và Field khớp theo <code>name</code>{' '}
                      — không cần truyền <code>error</code> cho từng Field. Gõ lại thì lỗi của field
                      đó được xoá.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Bố cục lưới 2 cột</h2>
                    <div className={styles.formWrapWide}>
                      <Form
                        className={styles.grid}
                        onSubmit={(e) => {
                          e.preventDefault();
                          setProfileSaved(true);
                        }}
                      >
                        <div className={styles.spanTwo}>
                          <Field label="Họ và tên" required>
                            <Input defaultValue="Nguyễn Minh Anh" />
                          </Field>
                        </div>
                        <Field label="Email liên hệ" hint="Dùng để nhận thông báo đơn hàng">
                          <Input type="email" defaultValue="minhanh@congty.vn" />
                        </Field>
                        <Field label="Số điện thoại">
                          <Input defaultValue="090 123 4567" />
                        </Field>
                        <Field label="Phòng ban">
                          <Select defaultValue="sales">
                            <option value="sales">Kinh doanh</option>
                            <option value="ops">Vận hành</option>
                            <option value="support">Hỗ trợ</option>
                          </Select>
                        </Field>
                        <Field label="Mã nhân viên">
                          <Input defaultValue="NV-2048" disabled />
                        </Field>
                        <div className={styles.formActions}>
                          <Button type="submit">Lưu hồ sơ</Button>
                          {profileSaved && (
                            <span className={styles.status} role="status">
                              Đã lưu hồ sơ (demo).
                            </span>
                          )}
                        </div>
                      </Form>
                    </div>
                    <p className={styles.helper}>
                      Form là lưới 1 cột mặc định; truyền <code>className</code> để đổi sang lưới 2
                      cột — Field không tự chia cột.
                    </p>
                  </section>
                  <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Lỗi, gợi ý và required</h2>
                    <div className={styles.formWrap}>
                      <Form onSubmit={(e) => e.preventDefault()}>
                        <Field label="Email" hint="Định dạng ban@congty.vn">
                          <Input defaultValue="minhanh@congty.vn" />
                        </Field>
                        <Field label="Mã đơn hàng" error="Mã đơn hàng không tồn tại">
                          <Input defaultValue="SO-9999" />
                        </Field>
                        <Field
                          label="Mã số thuế"
                          hint="10 hoặc 13 chữ số"
                          error="Mã số thuế không hợp lệ"
                          required
                        >
                          <Input defaultValue="123" />
                        </Field>
                        <Field label="Điều khoản" hint="Bắt buộc để tiếp tục" required>
                          <Checkbox>Tôi đồng ý với điều khoản sử dụng</Checkbox>
                        </Field>
                      </Form>
                    </div>
                    <p className={styles.helper}>
                      Khi field vừa có lỗi vừa có gợi ý, cả hai được nối vào{' '}
                      <code>aria-describedby</code>; control thêm <code>aria-invalid</code>. Với
                      Checkbox (tự render label), Field chuyển nhãn thành văn bản để không nhân đôi
                      tên truy cập.
                    </p>
                  </section>
                </div>
              </DemoPlayground>
            ),
          },
          {
            key: 'props',
            label: 'Props',
            content: (
              <div className={styles.propsGroups}>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Form</h2>
                  <PropsTable props={formProps} />
                </section>
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Field</h2>
                  <PropsTable props={fieldProps} />
                </section>
              </div>
            ),
          },
          { key: 'code', label: 'Code', content: <CodeBlock code={code} /> },
        ]}
      />
    </div>
  );
}
