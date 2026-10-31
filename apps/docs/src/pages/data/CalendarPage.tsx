import { useState } from 'react';
import { Calendar, CALENDAR_EVENT_LINES } from '@enterprise-ui/components';
import { CodeBlock } from '../../components/CodeBlock';
import { DemoPlayground } from '../../components/DemoPlayground';
import { PropsTable } from '../../components/PropsTable';
import type { PropDoc } from '../../components/PropsTable';

const props: PropDoc[] = [
  { name: 'value', type: 'Date | null', description: 'Ngày đang chọn (controlled).' },
  { name: 'onChange', type: '(date: Date) => void', description: 'Báo khi chọn ngày.' },
  { name: 'view', type: 'Date', description: 'Tháng đang xem (controlled).' },
  { name: 'onViewChange', type: '(view: Date) => void', description: 'Báo khi đổi tháng.' },
  {
    name: 'events',
    type: 'Record<string, ReactNode>',
    description: `Sự kiện theo key ISO (YYYY-MM-DD). Một node → một dòng; mảng node → mỗi node một dòng. Ô sm hiện ${CALENDAR_EVENT_LINES.sm} dòng, md ${CALENDAR_EVENT_LINES.md} dòng; toàn bộ danh sách vẫn nằm trong accessible description của ngày.`,
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
      <h2>Code</h2>
      <CodeBlock code={code} />
      <h2>Props</h2>
      <PropsTable props={props} />
    </div>
  );
}
