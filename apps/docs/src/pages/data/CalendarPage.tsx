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
      'Gọi khi người dùng chốt một ngày: click, Enter/Space, hoặc phím mũi tên/Home/End. PageUp/PageDown không gọi.',
  },
  {
    name: 'view',
    type: 'Date',
    description:
      'Tháng đang xem (controlled). Parent phải áp onViewChange thì tháng mới đổi; ngày đang chọn giữ nguyên.',
  },
  {
    name: 'onViewChange',
    type: '(view: Date) => void',
    description:
      'Gọi với ngày đầu tháng khi người dùng đổi tháng (chevron hoặc PageUp/PageDown); không đổi ngày đang chọn.',
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
      <p>
        PageUp/PageDown chỉ đổi tháng đang xem và giữ nguyên ngày đã chọn; dùng Enter, click hoặc
        phím mũi tên để chốt ngày.
      </p>
      <h2>Keyboard</h2>
      <ul>
        <li>
          <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd>: di chuyển và chọn ngày kế tiếp, bỏ
          qua ngày bị vô hiệu hoá.
        </li>
        <li>
          <kbd>Home</kbd> / <kbd>End</kbd>: ngày đầu/cuối của tháng đang hiển thị.
        </li>
        <li>
          <kbd>PageUp</kbd> / <kbd>PageDown</kbd>: lùi/tiến một tháng, con trỏ giữ ngày tương ứng;
          không chọn ngày.
        </li>
        <li>
          <kbd>Enter</kbd> / <kbd>Space</kbd>: chọn ngày đang focus.
        </li>
      </ul>
      <h2>Code</h2>
      <CodeBlock code={code} />
      <h2>Props</h2>
      <PropsTable props={props} />
    </div>
  );
}
