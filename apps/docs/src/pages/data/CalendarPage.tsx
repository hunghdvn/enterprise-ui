import { useState } from 'react';
import { Calendar } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';

const props: PropDoc[] = [
  { name: 'value', type: 'Date | null', description: 'Ngày đang chọn (controlled).' },
  {
    name: 'onChange',
    type: '(date: Date) => void',
    description:
      'Gọi khi người dùng chốt một ngày: click, Enter/Space, phím mũi tên, hoặc Home/End. PageUp/PageDown không gọi.',
  },
  {
    name: 'view',
    type: 'Date',
    description:
      'Tháng đang xem (controlled). Mặc định theo value hoặc hôm nay; parent phải áp onViewChange thì tháng mới đổi.',
  },
  {
    name: 'onViewChange',
    type: '(view: Date) => void',
    description:
      'Gọi với ngày đầu tháng khi người dùng đổi tháng: chevron, PageUp/PageDown, hoặc phím mũi tên vượt ranh giới tháng. Page chỉ đổi tháng; phím mũi tên vượt tháng cũng chốt ngày qua onChange. view bên ngoài đổi tháng hiển thị nhưng không phát callback này. Một vòng PageDown/PageUp huỷ request sẽ phát lại tháng đang hiển thị để parent áp thay đổi muộn có thể huỷ.',
  },
  {
    name: 'events',
    type: 'Record<string, ReactNode>',
    description:
      'Sự kiện theo key ISO (YYYY-MM-DD). Một node → một dòng; mảng node → mỗi node một dòng. Ô sm hiện 1 dòng, md 2 dòng; toàn bộ danh sách vẫn nằm trong accessible description của ngày.',
  },
  {
    name: 'isDisabled',
    type: '(date: Date) => boolean',
    description: 'Predicate vô hiệu hoá ngày.',
  },
  { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: 'Kích thước ô ngày.' },
  { name: 'aria-label', type: 'string', description: 'Nhãn a11y cho grid.' },
  { name: 'className', type: 'string', description: 'Lớp bổ sung cho vỏ.' },
];

const code = `import { useState } from 'react';
import { Calendar } from '@enterprise-ui/components';

export function AppointmentPicker() {
  const [date, setDate] = useState<Date | null>(null);
  const [view, setView] = useState(new Date());
  return (
    <Calendar
      value={date}
      onChange={setDate}
      view={view}
      onViewChange={setView}
      events={{ '2026-10-10': <span>Khám</span> }}
    />
  );
}`;

export default function CalendarPage() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 15));
  const [view, setView] = useState(new Date(2026, 9, 1));
  return (
    <div>
      <h1>Calendar</h1>
      <p>Lịch tháng presentational, controlled.</p>
      <DemoPlayground>
        <Calendar value={date} onChange={setDate} view={view} onViewChange={setView} />
      </DemoPlayground>
      <h2>Keyboard</h2>
      <ul>
        <li>
          <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd>: di chuyển và chốt ngày kế tiếp, bỏ
          qua ngày bị vô hiệu hoá; vượt ranh giới tháng thì đổi tháng và phát onViewChange.
        </li>
        <li>
          <kbd>Home</kbd> / <kbd>End</kbd>: ngày enabled đầu/cuối của tháng đang hiển thị (bỏ qua
          ngày bị vô hiệu hoá) và chốt ngày đó.
        </li>
        <li>
          <kbd>PageUp</kbd> / <kbd>PageDown</kbd>: lùi/tiến một tháng, con trỏ giữ ngày tương ứng và
          focus theo sau; không chốt ngày. Bấm ngược lại để huỷ request đang chờ.
        </li>
        <li>
          <kbd>Enter</kbd> / <kbd>Space</kbd>: chốt ngày đang focus; khi focus ở chính grid, chỉ
          chốt con trỏ nếu nó đang ở tháng hiển thị và không bị vô hiệu hoá.
        </li>
      </ul>
      <h2>Code</h2>
      <CodeBlock code={code} />
      <h2>Props</h2>
      <PropsTable props={props} />
    </div>
  );
}
