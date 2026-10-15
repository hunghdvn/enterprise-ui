export type OrderStatus = 'Chờ duyệt' | 'Đang giao' | 'Hoàn thành';

export interface Order {
  code: string;
  customer: string;
  total: string;
  status: OrderStatus;
}

export const ORDERS: Order[] = [
  { code: 'SO-10482', customer: 'Cty An Phát', total: '₫ 245M', status: 'Chờ duyệt' },
  { code: 'SO-10481', customer: 'Cty Minh Đức', total: '₫ 89M', status: 'Đang giao' },
  { code: 'SO-10480', customer: 'Cty Hòa Bình', total: '₫ 132M', status: 'Hoàn thành' },
  { code: 'SO-10479', customer: 'Cty Sao Mai', total: '₫ 57M', status: 'Chờ duyệt' },
  { code: 'SO-10478', customer: 'Cty Trường Hải', total: '₫ 310M', status: 'Đang giao' },
  { code: 'SO-10477', customer: 'Cty Việt Tiến', total: '₫ 76M', status: 'Hoàn thành' },
  { code: 'SO-10476', customer: 'Cty Nam Sơn', total: '₫ 198M', status: 'Chờ duyệt' },
  { code: 'SO-10475', customer: 'Cty Đại Nam', total: '₫ 64M', status: 'Đang giao' },
];

export function toneFor(status: OrderStatus): 'orange' | 'blue' | 'green' {
  if (status === 'Chờ duyệt') return 'orange';
  if (status === 'Đang giao') return 'blue';
  return 'green';
}
