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
      'Tháng đang xem (controlled). Mặc định theo value hoặc hôm nay; parent phải áp onViewChange thì tháng mới đổi. Khi lưới đang giữ focus, tháng mới render — kể cả do parent tự điều hướng — chuyển focus sang ngày con trỏ dừng, hoặc vào grid nếu tháng đó không còn ngày nào chọn được (xem Keyboard).',
  },
  {
    name: 'onViewChange',
    type: '(view: Date) => void',
    description:
      'Gọi với ngày đầu tháng khi người dùng đổi tháng: chevron, PageUp/PageDown, hoặc mũi tên vượt ranh giới (mũi tên vượt tháng cũng chốt ngày qua onChange). view bên ngoài không phát callback này. Mỗi yêu cầu tính từ tháng đang render, như mọi input controlled: nếu parent áp view trễ (router, transition), bấm PageDown nhiều lần trước khi tháng mới render vẫn chỉ xin tháng sau, còn PageDown rồi PageUp xin tháng sau rồi tháng trước — không huỷ nhau. Phím mũi tên và Home/End cũng đi từ ngày đang hiển thị trên lưới.',
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
          <kbd>PageUp</kbd> / <kbd>PageDown</kbd>: lùi/tiến một tháng so với tháng đang hiển thị
          (parent áp view trễ: xem onViewChange). Không chốt ngày. Khi tháng mới render, con trỏ về
          ngày đang chọn nếu ngày đó nằm trong tháng mới, nếu không thì về cùng ngày trong tháng —
          kẹp theo số ngày và nhảy qua ngày bị vô hiệu hoá (chặn cuối tuần: 15/10 PageDown → 16/11).
          Con trỏ đã nằm sẵn trong tháng đó (mũi tên bấm trước khi parent render) thì giữ nguyên.
        </li>
        <li>
          Focus: khi tháng đổi lúc lưới đang giữ focus — kể cả khi ngày đang focus biến mất cùng
          tháng cũ, hoặc parent tự điều hướng — focus chuyển sang ngày con trỏ dừng; tháng bị vô
          hiệu hoá toàn bộ thì focus vào grid. Lưới chỉ thôi giữ focus theo sự kiện focus thật của
          trình duyệt: focus sang control khác (Tab, click, dialog parent mở trong onViewChange),
          hoặc trình duyệt bỏ focus về trang — kể cả click vào ô trống trong lưới. Bản thân click
          chuột phải hay việc chuyển cửa sổ rồi quay lại không làm lưới thôi giữ focus; nếu trình
          duyệt có bỏ focus khỏi ngày đang focus (ví dụ Chromium khi click phải lên vùng không focus
          được) thì tính như mọi lần blur khác.
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
