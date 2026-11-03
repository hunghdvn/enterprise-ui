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
      'Gọi với ngày đầu tháng khi người dùng đổi tháng: chevron, PageUp/PageDown, hoặc mũi tên vượt ranh giới (mũi tên vượt tháng cũng chốt ngày qua onChange). view bên ngoài không phát callback này. Parent render đúng tháng đã xin — kể cả Date được tạo lại — là ack request; render tháng khác sẽ huỷ. Một vòng PageDown/PageUp huỷ request phát lại tháng đang hiển thị, nên parent mirror route/analytics sẽ nhận thêm callback cho tháng không đổi.',
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
          <kbd>←</kbd> <kbd>→</kbd>: chốt ngày trước/sau; <kbd>↑</kbd> <kbd>↓</kbd>: chốt ngày cách
          một tuần (7 ngày), bỏ qua ngày bị vô hiệu hoá. Vượt ranh giới tháng thì đổi tháng và phát
          onViewChange.
        </li>
        <li>
          <kbd>Home</kbd> / <kbd>End</kbd>: ngày enabled đầu/cuối của tháng đang hiển thị (bỏ qua
          ngày bị vô hiệu hoá) và chốt ngày đó.
        </li>
        <li>
          <kbd>PageUp</kbd> / <kbd>PageDown</kbd>: lùi/tiến một tháng; con trỏ giữ ngày tương ứng
          nhưng nhảy qua ngày bị vô hiệu hoá (chặn cuối tuần: 15/10 PageDown → 16/11). Focus theo
          ngày đó khi tháng render; nếu tháng đích bị vô hiệu hoá toàn bộ, focus vào grid — trừ khi
          parent đã tự focus chỗ khác trong onViewChange. Không chốt ngày. Khi request còn chờ, các
          lần bấm cộng dồn từ tháng đã xin; sau khi parent render một tháng hoặc request bị huỷ, lần
          bấm tính từ tháng đang hiển thị. Bấm ngược lại huỷ request với parent last-wins; parent
          xếp hàng FIFO vẫn render các tháng đã phát theo thứ tự hàng đợi.
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
