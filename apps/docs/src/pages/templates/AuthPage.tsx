import { useRef, useState, type FormEvent } from 'react';
import {
  AuthLayout,
  Button,
  Checkbox,
  Field,
  Form,
  Icon,
  Input,
  LoginForm,
  Tabs,
} from '@enterprise-ui/components';
import type { LoginFormValues } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';
import styles from './AuthPage.module.css';

const authProps: PropDoc[] = [
  {
    name: 'brand',
    type: 'ReactNode',
    description: 'Logo hoặc tên sản phẩm phía trên tiêu đề.',
  },
  { name: 'title', type: 'ReactNode', description: 'Tiêu đề trang (bắt buộc).' },
  { name: 'subtitle', type: 'ReactNode', description: 'Mô tả ngắn dưới tiêu đề.' },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Form hoặc nội dung chính của màn hình.',
  },
  {
    name: 'footer',
    type: 'ReactNode',
    description: 'Liên kết phụ / điều khoản dưới nội dung, ngăn cách bằng đường kẻ.',
  },
  {
    name: 'aside',
    type: 'ReactNode',
    description:
      'Panel marketing; khi có, desktop chia hai cột. Dưới 768px panel bị ẩn và card chiếm toàn bộ chiều rộng.',
  },
  {
    name: 'asideLabel',
    type: 'string',
    description: 'Tên truy cập cho landmark complementary của panel.',
  },
  {
    name: 'level',
    type: '1 | 2',
    default: '1',
    description: 'Cấp thẻ tiêu đề; dùng 2 khi template nằm dưới một h1 khác.',
  },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ.' },
];

const loginProps: PropDoc[] = [
  {
    name: 'value',
    type: 'LoginFormValues',
    description: 'Giá trị controlled: { email, password, remember }.',
  },
  {
    name: 'onChange',
    type: '(value: LoginFormValues) => void',
    description: 'Gọi với toàn bộ giá trị kế tiếp mỗi khi một field thay đổi.',
  },
  {
    name: 'onSubmit',
    type: '(value: LoginFormValues) => void',
    description:
      'Gọi khi form được submit; component đã preventDefault và không tự validate hay gọi API.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description: 'Lỗi cấp form (sai tài khoản, tài khoản bị khoá), hiển thị role="alert".',
  },
  {
    name: 'errors',
    type: 'Record<string, string>',
    description: 'Lỗi theo field, key email/password; Field nhận aria-invalid và aria-describedby.',
  },
  { name: 'loading', type: 'boolean', description: 'Form aria-busy, nút submit quay và bị khoá.' },
  { name: 'disabled', type: 'boolean', description: 'Khoá toàn bộ control.' },
  { name: 'emailLabel', type: 'string', default: "'Email'", description: 'Nhãn field email.' },
  {
    name: 'passwordLabel',
    type: 'string',
    default: "'Mật khẩu'",
    description: 'Nhãn field mật khẩu.',
  },
  {
    name: 'rememberLabel',
    type: 'string',
    default: "'Ghi nhớ đăng nhập'",
    description: 'Nhãn checkbox ghi nhớ.',
  },
  {
    name: 'submitLabel',
    type: 'string',
    default: "'Đăng nhập'",
    description: 'Nhãn nút submit.',
  },
  {
    name: 'showRemember',
    type: 'boolean',
    default: 'true',
    description:
      'Đặt false để ẩn checkbox ghi nhớ; slot quên mật khẩu vẫn hiển thị (canh phải) nếu được truyền.',
  },
  {
    name: 'forgotPassword',
    type: 'ReactNode',
    description: 'Link/button quên mật khẩu đặt đối diện checkbox.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Nội dung sau nút submit (SSO, ghi chú pháp lý).',
  },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho <form>.' },
  {
    name: '...rest',
    type: 'FormHTMLAttributes<HTMLFormElement>',
    description:
      'Thuộc tính form gốc khác (name, id, aria-*...). aria-label mặc định là "Đăng nhập".',
  },
];

const code = `import { useState } from 'react';
import { AuthLayout, LoginForm } from '@enterprise-ui/components';
import type { LoginFormValues } from '@enterprise-ui/components';

export function LoginPage() {
  const [value, setValue] = useState<LoginFormValues>({
    email: '',
    password: '',
    remember: true,
  });

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Dùng tài khoản công ty để tiếp tục."
      brand={<strong>Enterprise</strong>}
      aside={<div>Panel marketing</div>}
    >
      <LoginForm
        value={value}
        onChange={setValue}
        onSubmit={(next) => console.log(next)}
        forgotPassword={<a href="/forgot">Quên mật khẩu?</a>}
      />
    </AuthLayout>
  );
}`;

const TAB_KEYS = ['login', 'forgot', 'register'] as const;
type TabKey = (typeof TAB_KEYS)[number];

function AuthAside() {
  return (
    <div className={styles.aside}>
      <div className={styles.asideBrand}>
        <span className={styles.logo} aria-hidden="true">
          E
        </span>
        <span>Enterprise</span>
      </div>
      <div className={styles.asideBody}>
        <h2 className={styles.asideTitle}>Một màn hình cho mọi đơn hàng.</h2>
        <p className={styles.asideText}>
          Theo dõi, duyệt và đối soát đơn hàng với dữ liệu luôn mới — không cần chuyển tab.
        </p>
        <ul className={styles.asideList}>
          <li>
            <Icon name="check-circle" size={16} /> Bảng điều khiển theo vai trò
          </li>
          <li>
            <Icon name="check-circle" size={16} /> Kiểm soát tồn kho theo thời gian thực
          </li>
          <li>
            <Icon name="check-circle" size={16} /> Nhật ký thao tác đầy đủ
          </li>
        </ul>
      </div>
      <p className={styles.asideFoot}>© 2026 Enterprise UI</p>
    </div>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState<TabKey>('login');
  const tabsRef = useRef<HTMLDivElement>(null);

  const [login, setLogin] = useState<LoginFormValues>({
    email: 'an@congty.vn',
    password: '',
    remember: true,
  });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [loginMessage, setLoginMessage] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const [register, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    terms: false,
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [registerMessage, setRegisterMessage] = useState('');

  // A footer link lives inside the panel that is about to hide; move focus to
  // the tab that replaced it so keyboard users do not land on <body>.
  const goTo = (key: TabKey) => {
    setTab(key);
    const index = TAB_KEYS.indexOf(key);
    requestAnimationFrame(() => {
      tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus();
    });
  };

  const handleLoginChange = (next: LoginFormValues) => {
    setLogin(next);
    setLoginErrors((prev) => {
      const updated = { ...prev };
      if (next.email !== login.email) delete updated.email;
      if (next.password !== login.password) delete updated.password;
      return updated;
    });
    setLoginMessage('');
  };

  const handleLogin = (values: LoginFormValues) => {
    const next: Record<string, string> = {};
    if (!values.email.trim()) next.email = 'Vui lòng nhập email';
    else if (!values.email.includes('@')) next.email = 'Email không hợp lệ';
    if (!values.password) next.password = 'Vui lòng nhập mật khẩu';
    setLoginErrors(next);
    setLoginMessage(
      Object.keys(next).length === 0 ? 'Đăng nhập thành công (demo) — không gọi API thật.' : '',
    );
  };

  const handleForgot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!forgotEmail.includes('@')) {
      setForgotError('Email không hợp lệ');
      setForgotMessage('');
      return;
    }
    setForgotError('');
    setForgotMessage('Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi (demo).');
  };

  const clearRegisterError = (key: string) => {
    setRegisterErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!register.name.trim()) next.name = 'Vui lòng nhập họ tên';
    if (!register.email.includes('@')) next.email = 'Email không hợp lệ';
    if (register.password.length < 6) next.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (!register.terms) next.terms = 'Bạn cần đồng ý điều khoản';
    setRegisterErrors(next);
    setRegisterMessage(
      Object.keys(next).length === 0 ? 'Tạo tài khoản thành công (demo) — không gọi API thật.' : '',
    );
  };

  const brand = (
    <>
      <span className={styles.logoSmall} aria-hidden="true">
        E
      </span>{' '}
      <span>Enterprise</span>
    </>
  );

  const items = [
    {
      key: 'login',
      label: 'Đăng nhập',
      content: (
        <AuthLayout
          level={2}
          className={styles.preview}
          brand={brand}
          title="Đăng nhập"
          subtitle="Dùng tài khoản công ty để tiếp tục."
          aside={<AuthAside />}
          asideLabel="Giới thiệu Enterprise"
          footer={
            <span>
              Chưa có tài khoản?{' '}
              <button type="button" className={styles.linkButton} onClick={() => goTo('register')}>
                Đăng ký
              </button>
            </span>
          }
        >
          <LoginForm
            value={login}
            onChange={handleLoginChange}
            onSubmit={handleLogin}
            errors={loginErrors}
            forgotPassword={
              <button type="button" className={styles.linkButton} onClick={() => goTo('forgot')}>
                Quên mật khẩu?
              </button>
            }
          >
            {loginMessage && (
              <p className={styles.status} role="status">
                {loginMessage}
              </p>
            )}
          </LoginForm>
        </AuthLayout>
      ),
    },
    {
      key: 'forgot',
      label: 'Quên mật khẩu',
      content: (
        <AuthLayout
          level={2}
          className={styles.preview}
          brand={brand}
          title="Quên mật khẩu"
          subtitle="Nhập email công ty, chúng tôi sẽ gửi hướng dẫn đặt lại."
          footer={
            <span>
              Nhớ mật khẩu?{' '}
              <button type="button" className={styles.linkButton} onClick={() => goTo('login')}>
                Quay lại đăng nhập
              </button>
            </span>
          }
        >
          <Form aria-label="Quên mật khẩu" onSubmit={handleForgot}>
            <Field label="Email" name="email" error={forgotError} required>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={forgotEmail}
                onChange={(event) => {
                  setForgotEmail(event.target.value);
                  setForgotError('');
                  setForgotMessage('');
                }}
              />
            </Field>
            <Button type="submit" className={styles.submit}>
              Gửi hướng dẫn
            </Button>
            {forgotMessage && (
              <p className={styles.status} role="status">
                {forgotMessage}
              </p>
            )}
          </Form>
        </AuthLayout>
      ),
    },
    {
      key: 'register',
      label: 'Đăng ký',
      content: (
        <AuthLayout
          level={2}
          className={styles.preview}
          brand={brand}
          title="Tạo tài khoản"
          subtitle="Bắt đầu với tài khoản công ty của bạn."
          footer={
            <span>
              Đã có tài khoản?{' '}
              <button type="button" className={styles.linkButton} onClick={() => goTo('login')}>
                Đăng nhập
              </button>
            </span>
          }
        >
          <Form aria-label="Đăng ký" errors={registerErrors} onSubmit={handleRegister}>
            <Field label="Họ và tên" name="name" required>
              <Input
                name="name"
                autoComplete="name"
                value={register.name}
                onChange={(event) => {
                  setRegister({ ...register, name: event.target.value });
                  clearRegisterError('name');
                  setRegisterMessage('');
                }}
              />
            </Field>
            <Field label="Email" name="email" required>
              <Input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={register.email}
                onChange={(event) => {
                  setRegister({ ...register, email: event.target.value });
                  clearRegisterError('email');
                  setRegisterMessage('');
                }}
              />
            </Field>
            <Field label="Mật khẩu" name="password" hint="Tối thiểu 6 ký tự" required>
              <Input
                type="password"
                name="password"
                autoComplete="new-password"
                value={register.password}
                onChange={(event) => {
                  setRegister({ ...register, password: event.target.value });
                  clearRegisterError('password');
                  setRegisterMessage('');
                }}
              />
            </Field>
            <Field label="Điều khoản" name="terms" required>
              <Checkbox
                name="terms"
                checked={register.terms}
                onChange={(event) => {
                  setRegister({ ...register, terms: event.target.checked });
                  clearRegisterError('terms');
                  setRegisterMessage('');
                }}
              >
                Tôi đồng ý với điều khoản sử dụng
              </Checkbox>
            </Field>
            <Button type="submit" className={styles.submit}>
              Tạo tài khoản
            </Button>
            {registerMessage && (
              <p className={styles.status} role="status">
                {registerMessage}
              </p>
            )}
          </Form>
        </AuthLayout>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Auth (Login)</h1>
      <p className={styles.subtitle}>
        AuthLayout + LoginForm: một khung đăng nhập dùng lại cho đăng nhập, quên mật khẩu và đăng
        ký; component không validate hay gọi API.
      </p>
      <DemoPlayground>
        <div className={styles.frame} ref={tabsRef}>
          <Tabs
            items={items}
            activeKey={tab}
            onChange={(key) => setTab(key as TabKey)}
            variant="pills"
          />
        </div>
      </DemoPlayground>
      <h2 className={styles.sectionTitle}>Code</h2>
      <CodeBlock code={code} />
      <h2 className={styles.sectionTitle}>Props</h2>
      <div className={styles.propsGroups}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>AuthLayout</h3>
          <PropsTable props={authProps} />
        </section>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>LoginForm</h3>
          <PropsTable props={loginProps} />
        </section>
      </div>
    </div>
  );
}
