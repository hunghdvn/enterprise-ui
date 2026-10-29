import type { ReactNode } from 'react';
import type { IconName } from './types';

// Icon geometry from Lucide 0.545.0 (ISC), including portions derived from
// Feather (MIT). See THIRD_PARTY_NOTICES.md for the full license texts.

export const ICONS: Record<IconName, ReactNode> = {
  check: <path d="M20 6 9 17l-5-5" />,
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-up': <path d="m18 15-6-6-6 6" />,
  'chevron-left': <path d="m15 18-6-6 6-6" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'arrow-left': (
    <>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </>
  ),
  filter: (
    <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
  ),
  settings: (
    <>
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  bell: (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </>
  ),
  mail: (
    <>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </>
  ),
  home: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  edit: (
    <>
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </>
  ),
  trash: (
    <>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  download: (
    <>
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 3v12" />
      <path d="m17 8-5-5-5 5" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </>
  ),
  copy: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  'check-circle': (
    <>
      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
      <path d="m9 11 3 3L22 4" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </>
  ),
  'circle-alert': (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </>
  ),
  'alert-triangle': (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  'help-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  'circle-help': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  clock: (
    <>
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  eye: (
    <>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </>
  ),
  'external-link': (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  inbox: (
    <>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </>
  ),
  'more-horizontal': (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  ellipsis: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  'arrow-up': (
    <>
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </>
  ),
  'arrow-down': (
    <>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
  'chevrons-left': (
    <>
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" />
    </>
  ),
  'chevrons-right': (
    <>
      <path d="m6 17 5-5-5-5" />
      <path d="m13 17 5-5-5-5" />
    </>
  ),
  'chevrons-up': (
    <>
      <path d="m17 11-5-5-5 5" />
      <path d="m17 18-5-5-5 5" />
    </>
  ),
  'chevrons-down': (
    <>
      <path d="m7 6 5 5 5-5" />
      <path d="m7 13 5 5 5-5" />
    </>
  ),
  move: (
    <>
      <path d="M12 2v20" />
      <path d="m15 19-3 3-3-3" />
      <path d="m19 9 3 3-3 3" />
      <path d="M2 12h20" />
      <path d="m5 9-3 3 3 3" />
      <path d="m9 5 3-3 3 3" />
    </>
  ),
  maximize: (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </>
  ),
  minimize: (
    <>
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </>
  ),
  'layout-grid': (
    <>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </>
  ),
  'layout-list': (
    <>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <path d="M14 4h7" />
      <path d="M14 9h7" />
      <path d="M14 15h7" />
      <path d="M14 20h7" />
    </>
  ),
  table: (
    <>
      <path d="M12 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </>
  ),
  columns: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 3v18" />
    </>
  ),
  rows: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 12h18" />
    </>
  ),
  'panel-left': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </>
  ),
  'panel-right': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 3v18" />
    </>
  ),
  'app-window': (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M10 4v4" />
      <path d="M2 8h20" />
      <path d="M6 4v4" />
    </>
  ),
  expand: (
    <>
      <path d="m15 15 6 6" />
      <path d="m15 9 6-6" />
      <path d="M21 16v5h-5" />
      <path d="M21 8V3h-5" />
      <path d="M3 16v5h5" />
      <path d="m3 21 6-6" />
      <path d="M3 8V3h5" />
      <path d="M9 9 3 3" />
    </>
  ),
  shrink: (
    <>
      <path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" />
      <path d="M9 19.8V15m0 0H4.2M9 15l-6 6" />
      <path d="M15 4.2V9m0 0h4.8M15 9l6-6" />
      <path d="M9 4.2V9m0 0H4.2M9 9 3 3" />
    </>
  ),
  file: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </>
  ),
  'file-text': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </>
  ),
  'file-plus': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 15h6" />
      <path d="M12 18v-6" />
    </>
  ),
  'file-check': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  folder: (
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  ),
  'folder-open': (
    <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
  ),
  'folder-plus': (
    <>
      <path d="M12 10v6" />
      <path d="M9 13h6" />
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </>
  ),
  save: (
    <>
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </>
  ),
  archive: (
    <>
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </>
  ),
  paperclip: (
    <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  unlink: (
    <>
      <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" />
      <path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" />
      <line x1="8" x2="8" y1="2" y2="5" />
      <line x1="2" x2="5" y1="8" y2="8" />
      <line x1="16" x2="16" y1="19" y2="22" />
      <line x1="19" x2="22" y1="16" y2="16" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </>
  ),
  server: (
    <>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </>
  ),
  'hard-drive': (
    <>
      <line x1="22" x2="2" y1="12" y2="12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" x2="6.01" y1="16" y2="16" />
      <line x1="10" x2="10.01" y1="16" y2="16" />
    </>
  ),
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </>
  ),
  package: (
    <>
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <path d="m7.5 4.27 9 5.15" />
    </>
  ),
  'bar-chart': (
    <>
      <path d="M5 21v-6" />
      <path d="M12 21V9" />
      <path d="M19 21V3" />
    </>
  ),
  'chart-column': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  'chart-no-axes-column-increasing': (
    <>
      <path d="M5 21v-6" />
      <path d="M12 21V9" />
      <path d="M19 21V3" />
    </>
  ),
  'line-chart': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>
  ),
  'chart-line': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>
  ),
  'pie-chart': (
    <>
      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    </>
  ),
  'chart-pie': (
    <>
      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </>
  ),
  'trending-down': (
    <>
      <path d="M16 17h6v-6" />
      <path d="m22 17-8.5-8.5-5 5L2 7" />
    </>
  ),
  activity: (
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  ),
  gauge: (
    <>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  'user-plus': (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </>
  ),
  'user-check': (
    <>
      <path d="m16 11 2 2 4-4" />
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  'user-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </>
  ),
  'circle-user': (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </>
  ),
  building: (
    <>
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M12 6h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
      <path d="M8 6h.01" />
      <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <rect x="4" y="2" width="16" height="20" rx="2" />
    </>
  ),
  briefcase: (
    <>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </>
  ),
  'id-card': (
    <>
      <path d="M16 10h2" />
      <path d="M16 14h2" />
      <path d="M6.17 15a3 3 0 0 1 5.66 0" />
      <circle cx="9" cy="11" r="2" />
      <rect x="2" y="5" width="20" height="14" rx="2" />
    </>
  ),
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  ),
  'shield-check': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'shield-alert': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  key: (
    <>
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </>
  ),
  'log-in': (
    <>
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </>
  ),
  'log-out': (
    <>
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </>
  ),
  'lock-open': (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </>
  ),
  'message-circle': (
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  ),
  'message-square': (
    <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
  ),
  send: (
    <>
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </>
  ),
  phone: (
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  ),
  video: (
    <>
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  'at-sign': (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </>
  ),
  share: (
    <>
      <path d="M12 2v13" />
      <path d="m16 6-4-4-4 4" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    </>
  ),
  megaphone: (
    <>
      <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
      <path d="M8 6v8" />
    </>
  ),
  'shopping-cart': (
    <>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </>
  ),
  'shopping-bag': (
    <>
      <path d="M16 10a4 4 0 0 1-8 0" />
      <path d="M3.103 6.034h17.794" />
      <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
    </>
  ),
  'credit-card': (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </>
  ),
  'dollar-sign': (
    <>
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  receipt: (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </>
  ),
  truck: (
    <>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </>
  ),
  percent: (
    <>
      <line x1="19" x2="5" y1="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  wallet: (
    <>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </>
  ),
  tag: (
    <>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />,
  star: (
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  ),
  heart: (
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
  ),
  flag: (
    <path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
  ),
  'thumbs-up': (
    <>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </>
  ),
  'thumbs-down': (
    <>
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </>
  ),
  timer: (
    <>
      <line x1="10" x2="14" y1="2" y2="2" />
      <line x1="12" x2="15" y1="14" y2="11" />
      <circle cx="12" cy="14" r="8" />
    </>
  ),
  'alarm-clock': (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2" />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <path d="M6.38 18.7 4 21" />
      <path d="M17.64 18.67 20 21" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </>
  ),
  hourglass: (
    <>
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </>
  ),
  play: (
    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
  ),
  pause: (
    <>
      <rect x="14" y="3" width="5" height="18" rx="1" />
      <rect x="5" y="3" width="5" height="18" rx="1" />
    </>
  ),
  volume: (
    <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
  ),
  'volume-x': (
    <>
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </>
  ),
  mic: (
    <>
      <path d="M12 19v3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <rect x="9" y="2" width="6" height="13" rx="3" />
    </>
  ),
  'mic-off': (
    <>
      <path d="M12 19v3" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M16.95 16.95A7 7 0 0 1 5 12v-2" />
      <path d="M18.89 13.23A7 7 0 0 0 19 12v-2" />
      <path d="m2 2 20 20" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
    </>
  ),
  camera: (
    <>
      <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </>
  ),
  moon: (
    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
  ),
  monitor: (
    <>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </>
  ),
  smartphone: (
    <>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </>
  ),
  laptop: (
    <>
      <path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" />
      <path d="M20.054 15.987H3.946" />
    </>
  ),
  wifi: (
    <>
      <path d="M12 20h.01" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M5 12.859a10 10 0 0 1 14 0" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
    </>
  ),
  bluetooth: <path d="m7 7 10 10-5 5V2l5 5L7 17" />,
  'battery-full': (
    <>
      <path d="M10 10v4" />
      <path d="M14 10v4" />
      <path d="M22 14v-4" />
      <path d="M6 10v4" />
      <rect x="2" y="6" width="16" height="12" rx="2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  map: (
    <>
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </>
  ),
  zap: (
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  award: (
    <>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </>
  ),
  terminal: (
    <>
      <path d="M12 19h8" />
      <path d="m4 17 6-6-6-6" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </>
  ),
  'git-branch': (
    <>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  cpu: (
    <>
      <path d="M12 20v2" />
      <path d="M12 2v2" />
      <path d="M17 20v2" />
      <path d="M17 2v2" />
      <path d="M2 12h2" />
      <path d="M2 17h2" />
      <path d="M2 7h2" />
      <path d="M20 12h2" />
      <path d="M20 17h2" />
      <path d="M20 7h2" />
      <path d="M7 20v2" />
      <path d="M7 2v2" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </>
  ),
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <path d="M8.12 8.12 12 12" />
      <path d="M20 4 8.12 15.88" />
      <circle cx="6" cy="18" r="3" />
      <path d="M14.8 14.8 20 20" />
    </>
  ),
  undo: (
    <>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </>
  ),
  redo: (
    <>
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </>
  ),
  'sliders-horizontal': (
    <>
      <path d="M10 5H3" />
      <path d="M12 19H3" />
      <path d="M14 3v4" />
      <path d="M16 17v4" />
      <path d="M21 12h-9" />
      <path d="M21 19h-5" />
      <path d="M21 5h-7" />
      <path d="M8 10v4" />
      <path d="M8 12H3" />
    </>
  ),
  type: (
    <>
      <path d="M12 4v16" />
      <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
      <path d="M9 20h6" />
    </>
  ),
  bold: <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />,
  italic: (
    <>
      <line x1="19" x2="10" y1="4" y2="4" />
      <line x1="14" x2="5" y1="20" y2="20" />
      <line x1="15" x2="9" y1="4" y2="20" />
    </>
  ),
  underline: (
    <>
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <line x1="4" x2="20" y1="20" y2="20" />
    </>
  ),
  'align-left': (
    <>
      <path d="M21 5H3" />
      <path d="M15 12H3" />
      <path d="M17 19H3" />
    </>
  ),
  'text-align-start': (
    <>
      <path d="M21 5H3" />
      <path d="M15 12H3" />
      <path d="M17 19H3" />
    </>
  ),
  'align-center': (
    <>
      <path d="M21 5H3" />
      <path d="M17 12H7" />
      <path d="M19 19H5" />
    </>
  ),
  'text-align-center': (
    <>
      <path d="M21 5H3" />
      <path d="M17 12H7" />
      <path d="M19 19H5" />
    </>
  ),
  'align-right': (
    <>
      <path d="M21 5H3" />
      <path d="M21 12H9" />
      <path d="M21 19H7" />
    </>
  ),
  'text-align-end': (
    <>
      <path d="M21 5H3" />
      <path d="M21 12H9" />
      <path d="M21 19H7" />
    </>
  ),
  palette: (
    <>
      <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  'a-arrow-down': (
    <>
      <path d="m14 12 4 4 4-4" />
      <path d="M18 16V7" />
      <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
      <path d="M3.304 13h6.392" />
    </>
  ),
  'a-arrow-up': (
    <>
      <path d="m14 11 4-4 4 4" />
      <path d="M18 16V7" />
      <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
      <path d="M3.304 13h6.392" />
    </>
  ),
  'a-large-small': (
    <>
      <path d="m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16" />
      <path d="M15.697 14h5.606" />
      <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
      <path d="M3.304 13h6.392" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="16" cy="4" r="1" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </>
  ),
  airplay: (
    <>
      <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
      <path d="m12 15 5 6H7Z" />
    </>
  ),
  'alarm-clock-check': (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <path d="M6.38 18.7 4 21" />
      <path d="M17.64 18.67 20 21" />
      <path d="m9 13 2 2 4-4" />
    </>
  ),
  'alarm-clock-minus': (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <path d="M6.38 18.7 4 21" />
      <path d="M17.64 18.67 20 21" />
      <path d="M9 13h6" />
    </>
  ),
  'alarm-clock-off': (
    <>
      <path d="M6.87 6.87a8 8 0 1 0 11.26 11.26" />
      <path d="M19.9 14.25a8 8 0 0 0-9.15-9.15" />
      <path d="m22 6-3-3" />
      <path d="M6.26 18.67 4 21" />
      <path d="m2 2 20 20" />
      <path d="M4 4 2 6" />
    </>
  ),
  'alarm-clock-plus': (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <path d="M6.38 18.7 4 21" />
      <path d="M17.64 18.67 20 21" />
      <path d="M12 10v6" />
      <path d="M9 13h6" />
    </>
  ),
  'alarm-smoke': (
    <>
      <path d="M11 21c0-2.5 2-2.5 2-5" />
      <path d="M16 21c0-2.5 2-2.5 2-5" />
      <path d="m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8" />
      <path d="M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z" />
      <path d="M6 21c0-2.5 2-2.5 2-5" />
    </>
  ),
  'align-center-horizontal': (
    <>
      <path d="M2 12h20" />
      <path d="M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
      <path d="M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" />
      <path d="M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1" />
      <path d="M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1" />
    </>
  ),
  'align-center-vertical': (
    <>
      <path d="M12 2v20" />
      <path d="M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4" />
      <path d="M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4" />
      <path d="M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1" />
      <path d="M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" />
    </>
  ),
  'align-end-horizontal': (
    <>
      <rect width="6" height="16" x="4" y="2" rx="2" />
      <rect width="6" height="9" x="14" y="9" rx="2" />
      <path d="M22 22H2" />
    </>
  ),
  'align-end-vertical': (
    <>
      <rect width="16" height="6" x="2" y="4" rx="2" />
      <rect width="9" height="6" x="9" y="14" rx="2" />
      <path d="M22 22V2" />
    </>
  ),
  'align-horizontal-distribute-center': (
    <>
      <rect width="6" height="14" x="4" y="5" rx="2" />
      <rect width="6" height="10" x="14" y="7" rx="2" />
      <path d="M17 22v-5" />
      <path d="M17 7V2" />
      <path d="M7 22v-3" />
      <path d="M7 5V2" />
    </>
  ),
  'align-horizontal-distribute-end': (
    <>
      <rect width="6" height="14" x="4" y="5" rx="2" />
      <rect width="6" height="10" x="14" y="7" rx="2" />
      <path d="M10 2v20" />
      <path d="M20 2v20" />
    </>
  ),
  'align-horizontal-distribute-start': (
    <>
      <rect width="6" height="14" x="4" y="5" rx="2" />
      <rect width="6" height="10" x="14" y="7" rx="2" />
      <path d="M4 2v20" />
      <path d="M14 2v20" />
    </>
  ),
  'align-horizontal-justify-center': (
    <>
      <rect width="6" height="14" x="2" y="5" rx="2" />
      <rect width="6" height="10" x="16" y="7" rx="2" />
      <path d="M12 2v20" />
    </>
  ),
  'align-horizontal-justify-end': (
    <>
      <rect width="6" height="14" x="2" y="5" rx="2" />
      <rect width="6" height="10" x="12" y="7" rx="2" />
      <path d="M22 2v20" />
    </>
  ),
  'align-horizontal-justify-start': (
    <>
      <rect width="6" height="14" x="6" y="5" rx="2" />
      <rect width="6" height="10" x="16" y="7" rx="2" />
      <path d="M2 2v20" />
    </>
  ),
  'align-horizontal-space-around': (
    <>
      <rect width="6" height="10" x="9" y="7" rx="2" />
      <path d="M4 22V2" />
      <path d="M20 22V2" />
    </>
  ),
  'align-horizontal-space-between': (
    <>
      <rect width="6" height="14" x="3" y="5" rx="2" />
      <rect width="6" height="10" x="15" y="7" rx="2" />
      <path d="M3 2v20" />
      <path d="M21 2v20" />
    </>
  ),
  'align-start-horizontal': (
    <>
      <rect width="6" height="16" x="4" y="6" rx="2" />
      <rect width="6" height="9" x="14" y="6" rx="2" />
      <path d="M22 2H2" />
    </>
  ),
  'align-start-vertical': (
    <>
      <rect width="9" height="6" x="6" y="14" rx="2" />
      <rect width="16" height="6" x="6" y="4" rx="2" />
      <path d="M2 2v20" />
    </>
  ),
  'align-vertical-distribute-center': (
    <>
      <path d="M22 17h-3" />
      <path d="M22 7h-5" />
      <path d="M5 17H2" />
      <path d="M7 7H2" />
      <rect x="5" y="14" width="14" height="6" rx="2" />
      <rect x="7" y="4" width="10" height="6" rx="2" />
    </>
  ),
  'align-vertical-distribute-end': (
    <>
      <rect width="14" height="6" x="5" y="14" rx="2" />
      <rect width="10" height="6" x="7" y="4" rx="2" />
      <path d="M2 20h20" />
      <path d="M2 10h20" />
    </>
  ),
  'align-vertical-distribute-start': (
    <>
      <rect width="14" height="6" x="5" y="14" rx="2" />
      <rect width="10" height="6" x="7" y="4" rx="2" />
      <path d="M2 14h20" />
      <path d="M2 4h20" />
    </>
  ),
  'align-vertical-justify-center': (
    <>
      <rect width="14" height="6" x="5" y="16" rx="2" />
      <rect width="10" height="6" x="7" y="2" rx="2" />
      <path d="M2 12h20" />
    </>
  ),
  'align-vertical-justify-end': (
    <>
      <rect width="14" height="6" x="5" y="12" rx="2" />
      <rect width="10" height="6" x="7" y="2" rx="2" />
      <path d="M2 22h20" />
    </>
  ),
  'align-vertical-justify-start': (
    <>
      <rect width="14" height="6" x="5" y="16" rx="2" />
      <rect width="10" height="6" x="7" y="6" rx="2" />
      <path d="M2 2h20" />
    </>
  ),
  'align-vertical-space-around': (
    <>
      <rect width="10" height="6" x="7" y="9" rx="2" />
      <path d="M22 20H2" />
      <path d="M22 4H2" />
    </>
  ),
  'align-vertical-space-between': (
    <>
      <rect width="14" height="6" x="5" y="15" rx="2" />
      <rect width="10" height="6" x="7" y="3" rx="2" />
      <path d="M2 21h20" />
      <path d="M2 3h20" />
    </>
  ),
  ampersand: (
    <>
      <path d="M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13" />
      <path d="M16 12h3" />
    </>
  ),
  ampersands: (
    <>
      <path d="M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5" />
      <path d="M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5" />
    </>
  ),
  anchor: (
    <>
      <path d="M12 22V8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
      <circle cx="12" cy="5" r="3" />
    </>
  ),
  antenna: (
    <>
      <path d="M2 12 7 2" />
      <path d="m7 12 5-10" />
      <path d="m12 12 5-10" />
      <path d="m17 12 5-10" />
      <path d="M4.5 7h15" />
      <path d="M12 16v6" />
    </>
  ),
  aperture: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m14.31 8 5.74 9.94" />
      <path d="M9.69 8h11.48" />
      <path d="m7.38 12 5.74-9.94" />
      <path d="M9.69 16 3.95 6.06" />
      <path d="M14.31 16H2.83" />
      <path d="m16.62 12-5.74 9.94" />
    </>
  ),
  'app-window-mac': (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 8h.01" />
      <path d="M10 8h.01" />
      <path d="M14 8h.01" />
    </>
  ),
  'archive-restore': (
    <>
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h2" />
      <path d="M20 8v11a2 2 0 0 1-2 2h-2" />
      <path d="m9 15 3-3 3 3" />
      <path d="M12 12v9" />
    </>
  ),
  'archive-x': (
    <>
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="m9.5 17 5-5" />
      <path d="m9.5 12 5 5" />
    </>
  ),
  'arrow-big-down': (
    <path d="M15 11a1 1 0 0 0 1 1h2.939a1 1 0 0 1 .75 1.811l-6.835 6.836a1.207 1.207 0 0 1-1.707 0L4.31 13.81a1 1 0 0 1 .75-1.811H8a1 1 0 0 0 1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1z" />
  ),
  'arrow-big-down-dash': (
    <>
      <path d="M15 11a1 1 0 0 0 1 1h2.939a1 1 0 0 1 .75 1.811l-6.835 6.836a1.207 1.207 0 0 1-1.707 0L4.31 13.81a1 1 0 0 1 .75-1.811H8a1 1 0 0 0 1-1V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1z" />
      <path d="M9 4h6" />
    </>
  ),
  'arrow-big-left': (
    <path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" />
  ),
  'arrow-big-left-dash': (
    <>
      <path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" />
      <path d="M20 9v6" />
    </>
  ),
  'arrow-big-right': (
    <path d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
  ),
  'arrow-big-right-dash': (
    <>
      <path d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
      <path d="M4 9v6" />
    </>
  ),
  'arrow-big-up': (
    <path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
  ),
  'arrow-big-up-dash': (
    <>
      <path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
      <path d="M9 20h6" />
    </>
  ),
  'arrow-down-a-z': (
    <>
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="M20 8h-5" />
      <path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10" />
      <path d="M15 14h5l-5 6h5" />
    </>
  ),
  'arrow-down-from-line': (
    <>
      <path d="M19 3H5" />
      <path d="M12 21V7" />
      <path d="m6 15 6 6 6-6" />
    </>
  ),
  'arrow-down-left': (
    <>
      <path d="M17 7 7 17" />
      <path d="M17 17H7V7" />
    </>
  ),
  'arrow-down-left-square': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m16 8-8 8" />
      <path d="M16 16H8V8" />
    </>
  ),
  'square-arrow-down-left': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m16 8-8 8" />
      <path d="M16 16H8V8" />
    </>
  ),
  'arrow-down-narrow-wide': (
    <>
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="M11 4h4" />
      <path d="M11 8h7" />
      <path d="M11 12h10" />
    </>
  ),
  'arrow-down-right': (
    <>
      <path d="m7 7 10 10" />
      <path d="M17 7v10H7" />
    </>
  ),
  'arrow-down-right-square': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m8 8 8 8" />
      <path d="M16 8v8H8" />
    </>
  ),
  'square-arrow-down-right': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m8 8 8 8" />
      <path d="M16 8v8H8" />
    </>
  ),
  'arrow-down-square': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 8v8" />
      <path d="m8 12 4 4 4-4" />
    </>
  ),
  'square-arrow-down': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 8v8" />
      <path d="m8 12 4 4 4-4" />
    </>
  ),
  'arrow-down-to-dot': (
    <>
      <path d="M12 2v14" />
      <path d="m19 9-7 7-7-7" />
      <circle cx="12" cy="21" r="1" />
    </>
  ),
  'arrow-down-to-line': (
    <>
      <path d="M12 17V3" />
      <path d="m6 11 6 6 6-6" />
      <path d="M19 21H5" />
    </>
  ),
  'arrow-down-up': (
    <>
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </>
  ),
  'arrow-down-wide-narrow': (
    <>
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="M11 4h10" />
      <path d="M11 8h7" />
      <path d="M11 12h4" />
    </>
  ),
  'arrow-down-z-a': (
    <>
      <path d="m3 16 4 4 4-4" />
      <path d="M7 4v16" />
      <path d="M15 4h5l-5 6h5" />
      <path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" />
      <path d="M20 18h-5" />
    </>
  ),
  'arrow-left-from-line': (
    <>
      <path d="m9 6-6 6 6 6" />
      <path d="M3 12h14" />
      <path d="M21 19V5" />
    </>
  ),
  'arrow-left-right': (
    <>
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </>
  ),
  'arrow-left-to-line': (
    <>
      <path d="M3 19V5" />
      <path d="m13 6-6 6 6 6" />
      <path d="M7 12h14" />
    </>
  ),
  'arrow-right-from-line': (
    <>
      <path d="M3 5v14" />
      <path d="M21 12H7" />
      <path d="m15 18 6-6-6-6" />
    </>
  ),
  'arrow-right-left': (
    <>
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </>
  ),
  'arrow-right-to-line': (
    <>
      <path d="M17 12H3" />
      <path d="m11 18 6-6-6-6" />
      <path d="M21 5v14" />
    </>
  ),
  'arrow-up-a-z': (
    <>
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
      <path d="M20 8h-5" />
      <path d="M15 10V6.5a2.5 2.5 0 0 1 5 0V10" />
      <path d="M15 14h5l-5 6h5" />
    </>
  ),
  'arrow-up-down': (
    <>
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </>
  ),
  'arrow-up-from-dot': (
    <>
      <path d="m5 9 7-7 7 7" />
      <path d="M12 16V2" />
      <circle cx="12" cy="21" r="1" />
    </>
  ),
  'arrow-up-from-line': (
    <>
      <path d="m18 9-6-6-6 6" />
      <path d="M12 3v14" />
      <path d="M5 21h14" />
    </>
  ),
  'arrow-up-left': (
    <>
      <path d="M7 17V7h10" />
      <path d="M17 17 7 7" />
    </>
  ),
  'arrow-up-narrow-wide': (
    <>
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
      <path d="M11 12h4" />
      <path d="M11 16h7" />
      <path d="M11 20h10" />
    </>
  ),
  'arrow-up-to-line': (
    <>
      <path d="M5 3h14" />
      <path d="m18 13-6-6-6 6" />
      <path d="M12 7v14" />
    </>
  ),
  'arrow-up-wide-narrow': (
    <>
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
      <path d="M11 12h10" />
      <path d="M11 16h7" />
      <path d="M11 20h4" />
    </>
  ),
  'arrow-up-z-a': (
    <>
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
      <path d="M15 4h5l-5 6h5" />
      <path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" />
      <path d="M20 18h-5" />
    </>
  ),
  'arrows-up-from-line': (
    <>
      <path d="m4 6 3-3 3 3" />
      <path d="M7 17V3" />
      <path d="m14 6 3-3 3 3" />
      <path d="M17 17V3" />
      <path d="M4 21h16" />
    </>
  ),
  asterisk: (
    <>
      <path d="M12 6v12" />
      <path d="M17.196 9 6.804 15" />
      <path d="m6.804 9 10.392 6" />
    </>
  ),
  'axis-3d': (
    <>
      <path d="M13.5 10.5 15 9" />
      <path d="M4 4v15a1 1 0 0 0 1 1h15" />
      <path d="M4.293 19.707 6 18" />
      <path d="m9 15 1.5-1.5" />
    </>
  ),
  badge: (
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
  ),
  'badge-alert': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </>
  ),
  'badge-cent': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M12 7v10" />
      <path d="M15.4 10a4 4 0 1 0 0 4" />
    </>
  ),
  'badge-check': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'badge-dollar-sign': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </>
  ),
  'badge-euro': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M7 12h5" />
      <path d="M15 9.4a4 4 0 1 0 0 5.2" />
    </>
  ),
  'badge-indian-rupee': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="m13 17-5-1h1a4 4 0 0 0 0-8" />
    </>
  ),
  'badge-info': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="12" x2="12" y1="16" y2="12" />
      <line x1="12" x2="12.01" y1="8" y2="8" />
    </>
  ),
  'badge-japanese-yen': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 8 3 3v7" />
      <path d="m12 11 3-3" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </>
  ),
  'badge-minus': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </>
  ),
  'badge-percent': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m15 9-6 6" />
      <path d="M9 9h.01" />
      <path d="M15 15h.01" />
    </>
  ),
  'badge-plus': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="12" x2="12" y1="8" y2="16" />
      <line x1="8" x2="16" y1="12" y2="12" />
    </>
  ),
  'badge-pound-sterling': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M8 12h4" />
      <path d="M10 16V9.5a2.5 2.5 0 0 1 5 0" />
      <path d="M8 16h7" />
    </>
  ),
  'badge-question-mark': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
    </>
  ),
  'badge-russian-ruble': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M9 16h5" />
      <path d="M9 12h5a2 2 0 1 0 0-4h-3v9" />
    </>
  ),
  'badge-swiss-franc': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="M11 17V8h4" />
      <path d="M11 12h3" />
      <path d="M9 16h4" />
    </>
  ),
  'badge-turkish-lira': (
    <>
      <path d="M11 7v10a5 5 0 0 0 5-5" />
      <path d="m15 8-6 3" />
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" />
    </>
  ),
  'badge-x': (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <line x1="15" x2="9" y1="9" y2="15" />
      <line x1="9" x2="15" y1="9" y2="15" />
    </>
  ),
  ban: (
    <>
      <path d="M4.929 4.929 19.07 19.071" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  banknote: (
    <>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  'banknote-arrow-down': (
    <>
      <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="m16 19 3 3 3-3" />
      <path d="M18 12h.01" />
      <path d="M19 16v6" />
      <path d="M6 12h.01" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  'banknote-arrow-up': (
    <>
      <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="M18 12h.01" />
      <path d="M19 22v-6" />
      <path d="m22 19-3-3-3 3" />
      <path d="M6 12h.01" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  'banknote-x': (
    <>
      <path d="M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="m17 17 5 5" />
      <path d="M18 12h.01" />
      <path d="m22 17-5 5" />
      <path d="M6 12h.01" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  barcode: (
    <>
      <path d="M3 5v14" />
      <path d="M8 5v14" />
      <path d="M12 5v14" />
      <path d="M17 5v14" />
      <path d="M21 5v14" />
    </>
  ),
  baseline: (
    <>
      <path d="M4 20h16" />
      <path d="m6 16 6-12 6 12" />
      <path d="M8 12h8" />
    </>
  ),
  battery: (
    <>
      <path d="M 22 14 L 22 10" />
      <rect x="2" y="6" width="16" height="12" rx="2" />
    </>
  ),
  'battery-charging': (
    <>
      <path d="m11 7-3 5h4l-3 5" />
      <path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935" />
      <path d="M22 14v-4" />
      <path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936" />
    </>
  ),
  'battery-low': (
    <>
      <path d="M22 14v-4" />
      <path d="M6 14v-4" />
      <rect x="2" y="6" width="16" height="12" rx="2" />
    </>
  ),
  'battery-medium': (
    <>
      <path d="M10 14v-4" />
      <path d="M22 14v-4" />
      <path d="M6 14v-4" />
      <rect x="2" y="6" width="16" height="12" rx="2" />
    </>
  ),
  'battery-plus': (
    <>
      <path d="M10 9v6" />
      <path d="M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605" />
      <path d="M22 14v-4" />
      <path d="M7 12h6" />
      <path d="M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606" />
    </>
  ),
  'battery-warning': (
    <>
      <path d="M10 17h.01" />
      <path d="M10 7v6" />
      <path d="M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" />
      <path d="M22 14v-4" />
      <path d="M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
    </>
  ),
  'bell-dot': (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665" />
      <circle cx="18" cy="8" r="3" />
    </>
  ),
  'bell-electric': (
    <>
      <path d="M18.518 17.347A7 7 0 0 1 14 19" />
      <path d="M18.8 4A11 11 0 0 1 20 9" />
      <path d="M9 9h.01" />
      <circle cx="20" cy="16" r="2" />
      <circle cx="9" cy="9" r="7" />
      <rect x="4" y="16" width="10" height="6" rx="2" />
    </>
  ),
  'bell-minus': (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M15 8h6" />
      <path d="M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12" />
    </>
  ),
  'bell-off': (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742" />
      <path d="m2 2 20 20" />
      <path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05" />
    </>
  ),
  'bell-plus': (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M15 8h6" />
      <path d="M18 5v6" />
      <path d="M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332" />
    </>
  ),
  'bell-ring': (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M22 8c0-2.3-.8-4.3-2-6" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
      <path d="M4 2C2.8 3.7 2 5.7 2 8" />
    </>
  ),
  'between-horizontal-end': (
    <>
      <rect width="13" height="7" x="3" y="3" rx="1" />
      <path d="m22 15-3-3 3-3" />
      <rect width="13" height="7" x="3" y="14" rx="1" />
    </>
  ),
  'between-horizontal-start': (
    <>
      <rect width="13" height="7" x="8" y="3" rx="1" />
      <path d="m2 9 3 3-3 3" />
      <rect width="13" height="7" x="8" y="14" rx="1" />
    </>
  ),
  'between-vertical-end': (
    <>
      <rect width="7" height="13" x="3" y="3" rx="1" />
      <path d="m9 22 3-3 3 3" />
      <rect width="7" height="13" x="14" y="3" rx="1" />
    </>
  ),
  'between-vertical-start': (
    <>
      <rect width="7" height="13" x="3" y="8" rx="1" />
      <path d="m15 2-3 3-3-3" />
      <rect width="7" height="13" x="14" y="8" rx="1" />
    </>
  ),
  binary: (
    <>
      <rect x="14" y="14" width="4" height="6" rx="2" />
      <rect x="6" y="4" width="4" height="6" rx="2" />
      <path d="M6 20h4" />
      <path d="M14 10h4" />
      <path d="M6 14h2v6" />
      <path d="M14 4h2v6" />
    </>
  ),
  bitcoin: (
    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
  ),
  blend: (
    <>
      <circle cx="9" cy="9" r="7" />
      <circle cx="15" cy="15" r="7" />
    </>
  ),
  blocks: (
    <>
      <path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" />
      <rect x="14" y="2" width="8" height="8" rx="1" />
    </>
  ),
  'bluetooth-connected': (
    <>
      <path d="m7 7 10 10-5 5V2l5 5L7 17" />
      <line x1="18" x2="21" y1="12" y2="12" />
      <line x1="3" x2="6" y1="12" y2="12" />
    </>
  ),
  'bluetooth-off': (
    <>
      <path d="m17 17-5 5V12l-5 5" />
      <path d="m2 2 20 20" />
      <path d="M14.5 9.5 17 7l-5-5v4.5" />
    </>
  ),
  'bluetooth-searching': (
    <>
      <path d="m7 7 10 10-5 5V2l5 5L7 17" />
      <path d="M20.83 14.83a4 4 0 0 0 0-5.66" />
      <path d="M18 12h.01" />
    </>
  ),
  bolt: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  bomb: (
    <>
      <circle cx="11" cy="13" r="9" />
      <path d="M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95" />
      <path d="m22 2-1.5 1.5" />
    </>
  ),
  book: (
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
  ),
  'book-a': (
    <>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="m8 13 4-7 4 7" />
      <path d="M9.1 11h5.7" />
    </>
  ),
  'book-alert': (
    <>
      <path d="M12 13h.01" />
      <path d="M12 6v3" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </>
  ),
  'book-check': (
    <>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="m9 9.5 2 2 4-4" />
    </>
  ),
  'book-copy': (
    <>
      <path d="M5 7a2 2 0 0 0-2 2v11" />
      <path d="M5.803 18H5a2 2 0 0 0 0 4h9.5a.5.5 0 0 0 .5-.5V21" />
      <path d="M9 15V4a2 2 0 0 1 2-2h9.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5H11a2 2 0 0 1 0-4h10" />
    </>
  ),
  'book-dashed': (
    <>
      <path d="M12 17h1.5" />
      <path d="M12 22h1.5" />
      <path d="M12 2h1.5" />
      <path d="M17.5 22H19a1 1 0 0 0 1-1" />
      <path d="M17.5 2H19a1 1 0 0 1 1 1v1.5" />
      <path d="M20 14v3h-2.5" />
      <path d="M20 8.5V10" />
      <path d="M4 10V8.5" />
      <path d="M4 19.5V14" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H8" />
      <path d="M8 22H6.5a1 1 0 0 1 0-5H8" />
    </>
  ),
  'book-down': (
    <>
      <path d="M12 13V7" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="m9 10 3 3 3-3" />
    </>
  ),
  'book-heart': (
    <>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="M8.62 9.8A2.25 2.25 0 1 1 12 6.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
    </>
  ),
  'book-image': (
    <>
      <path d="m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <circle cx="10" cy="8" r="2" />
    </>
  ),
  'book-key': (
    <>
      <path d="m19 3 1 1" />
      <path d="m20 2-4.5 4.5" />
      <path d="M20 7.898V21a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2h7.844" />
      <circle cx="14" cy="8" r="2" />
    </>
  ),
  'book-lock': (
    <>
      <path d="M18 6V4a2 2 0 1 0-4 0v2" />
      <path d="M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10" />
      <rect x="12" y="6" width="8" height="5" rx="1" />
    </>
  ),
  'book-marked': (
    <>
      <path d="M10 2v8l3-3 3 3V2" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </>
  ),
  'book-minus': (
    <>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="M9 10h6" />
    </>
  ),
  'book-open': (
    <>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </>
  ),
  'book-open-check': (
    <>
      <path d="M12 21V7" />
      <path d="m16 12 2 2 4-4" />
      <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" />
    </>
  ),
  'book-open-text': (
    <>
      <path d="M12 7v14" />
      <path d="M16 12h2" />
      <path d="M16 8h2" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      <path d="M6 12h2" />
      <path d="M6 8h2" />
    </>
  ),
  'book-plus': (
    <>
      <path d="M12 7v6" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="M9 10h6" />
    </>
  ),
  'book-text': (
    <>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="M8 11h8" />
      <path d="M8 7h6" />
    </>
  ),
  'book-type': (
    <>
      <path d="M10 13h4" />
      <path d="M12 6v7" />
      <path d="M16 8V6H8v2" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </>
  ),
  'book-up': (
    <>
      <path d="M12 13V7" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="m9 10 3-3 3 3" />
    </>
  ),
  'book-user': (
    <>
      <path d="M15 13a3 3 0 1 0-6 0" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <circle cx="12" cy="8" r="2" />
    </>
  ),
  'book-x': (
    <>
      <path d="m14.5 7-5 5" />
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      <path d="m9.5 7 5 5" />
    </>
  ),
  'bookmark-check': (
    <>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
      <path d="m9 10 2 2 4-4" />
    </>
  ),
  'bookmark-minus': (
    <>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      <line x1="15" x2="9" y1="10" y2="10" />
    </>
  ),
  'bookmark-plus': (
    <>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      <line x1="12" x2="12" y1="7" y2="13" />
      <line x1="15" x2="9" y1="10" y2="10" />
    </>
  ),
  'bookmark-x': (
    <>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
      <path d="m14.5 7.5-5 5" />
      <path d="m9.5 7.5 5 5" />
    </>
  ),
  bot: (
    <>
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </>
  ),
  'bot-message-square': (
    <>
      <path d="M12 6V2H8" />
      <path d="M15 11v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
      <path d="M9 11v2" />
    </>
  ),
  'bot-off': (
    <>
      <path d="M13.67 8H18a2 2 0 0 1 2 2v4.33" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M22 22 2 2" />
      <path d="M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586" />
      <path d="M9 13v2" />
      <path d="M9.67 4H12v2.33" />
    </>
  ),
  box: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  boxes: (
    <>
      <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
      <path d="m7 16.5-4.74-2.85" />
      <path d="m7 16.5 5-3" />
      <path d="M7 16.5v5.17" />
      <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
      <path d="m17 16.5-5-3" />
      <path d="m17 16.5 4.74-2.85" />
      <path d="M17 16.5v5.17" />
      <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
      <path d="M12 8 7.26 5.15" />
      <path d="m12 8 4.74-2.85" />
      <path d="M12 13.5V8" />
    </>
  ),
  braces: (
    <>
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </>
  ),
  brackets: (
    <>
      <path d="M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3" />
      <path d="M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3" />
    </>
  ),
  brain: (
    <>
      <path d="M12 18V5" />
      <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
      <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
      <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
      <path d="M18 18a4 4 0 0 0 2-7.464" />
      <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
      <path d="M6 18a4 4 0 0 1-2-7.464" />
      <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
    </>
  ),
  'brain-circuit': (
    <>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M12 8h8" />
      <path d="M16 8V5a2 2 0 0 1 2-2" />
      <circle cx="16" cy="13" r=".5" />
      <circle cx="18" cy="3" r=".5" />
      <circle cx="20" cy="21" r=".5" />
      <circle cx="20" cy="8" r=".5" />
    </>
  ),
  'brain-cog': (
    <>
      <path d="m10.852 14.772-.383.923" />
      <path d="m10.852 9.228-.383-.923" />
      <path d="m13.148 14.772.382.924" />
      <path d="m13.531 8.305-.383.923" />
      <path d="m14.772 10.852.923-.383" />
      <path d="m14.772 13.148.923.383" />
      <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771" />
      <path d="M17.998 5.125a4 4 0 0 1 2.525 5.771" />
      <path d="M19.505 10.294a4 4 0 0 1-1.5 7.706" />
      <path d="M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516" />
      <path d="M4.5 10.291A4 4 0 0 0 6 18" />
      <path d="M6.002 5.125a3 3 0 0 0 .4 1.375" />
      <path d="m9.228 10.852-.923-.383" />
      <path d="m9.228 13.148-.923.383" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'brick-wall': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 9v6" />
      <path d="M16 15v6" />
      <path d="M16 3v6" />
      <path d="M3 15h18" />
      <path d="M3 9h18" />
      <path d="M8 15v6" />
      <path d="M8 3v6" />
    </>
  ),
  'brick-wall-fire': (
    <>
      <path d="M16 3v2.107" />
      <path d="M17 9c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 22 17a5 5 0 0 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C13 11.5 16 9 17 9" />
      <path d="M21 8.274V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.938" />
      <path d="M3 15h5.253" />
      <path d="M3 9h8.228" />
      <path d="M8 15v6" />
      <path d="M8 3v6" />
    </>
  ),
  'brick-wall-shield': (
    <>
      <path d="M12 9v1.258" />
      <path d="M16 3v5.46" />
      <path d="M21 9.118V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5.75" />
      <path d="M22 17.5c0 2.499-1.75 3.749-3.83 4.474a.5.5 0 0 1-.335-.005c-2.085-.72-3.835-1.97-3.835-4.47V14a.5.5 0 0 1 .5-.499c1 0 2.25-.6 3.12-1.36a.6.6 0 0 1 .76-.001c.875.765 2.12 1.36 3.12 1.36a.5.5 0 0 1 .5.5z" />
      <path d="M3 15h7" />
      <path d="M3 9h12.142" />
      <path d="M8 15v6" />
      <path d="M8 3v6" />
    </>
  ),
  'briefcase-business': (
    <>
      <path d="M12 12h.01" />
      <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M22 13a18.15 18.15 0 0 1-20 0" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </>
  ),
  'briefcase-conveyor-belt': (
    <>
      <path d="M10 20v2" />
      <path d="M14 20v2" />
      <path d="M18 20v2" />
      <path d="M21 20H3" />
      <path d="M6 20v2" />
      <path d="M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12" />
      <rect x="4" y="6" width="16" height="10" rx="2" />
    </>
  ),
  'bring-to-front': (
    <>
      <rect x="8" y="8" width="8" height="8" rx="2" />
      <path d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" />
      <path d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" />
    </>
  ),
  brush: (
    <>
      <path d="m11 10 3 3" />
      <path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" />
      <path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" />
    </>
  ),
  'brush-cleaning': (
    <>
      <path d="m16 22-1-4" />
      <path d="M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1" />
      <path d="M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z" />
      <path d="m8 22 1-4" />
    </>
  ),
  bug: (
    <>
      <path d="M12 20v-9" />
      <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" />
      <path d="M14.12 3.88 16 2" />
      <path d="M21 21a4 4 0 0 0-3.81-4" />
      <path d="M21 5a4 4 0 0 1-3.55 3.97" />
      <path d="M22 13h-4" />
      <path d="M3 21a4 4 0 0 1 3.81-4" />
      <path d="M3 5a4 4 0 0 0 3.55 3.97" />
      <path d="M6 13H2" />
      <path d="m8 2 1.88 1.88" />
      <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
    </>
  ),
  cable: (
    <>
      <path d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z" />
      <path d="M17 21v-2" />
      <path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10" />
      <path d="M21 21v-2" />
      <path d="M3 5V3" />
      <path d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z" />
      <path d="M7 5V3" />
    </>
  ),
  calculator: (
    <>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </>
  ),
  'calendar-arrow-down': (
    <>
      <path d="m14 18 4 4 4-4" />
      <path d="M16 2v4" />
      <path d="M18 14v8" />
      <path d="M21 11.354V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.343" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
    </>
  ),
  'calendar-arrow-up': (
    <>
      <path d="m14 18 4-4 4 4" />
      <path d="M16 2v4" />
      <path d="M18 22v-8" />
      <path d="M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
    </>
  ),
  'calendar-check': (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  'calendar-clock': (
    <>
      <path d="M16 14v2.2l1.6 1" />
      <path d="M16 2v4" />
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M3 10h5" />
      <path d="M8 2v4" />
      <circle cx="16" cy="16" r="6" />
    </>
  ),
  'calendar-cog': (
    <>
      <path d="m15.228 16.852-.923-.383" />
      <path d="m15.228 19.148-.923.383" />
      <path d="M16 2v4" />
      <path d="m16.47 14.305.382.923" />
      <path d="m16.852 20.772-.383.924" />
      <path d="m19.148 15.228.383-.923" />
      <path d="m19.53 21.696-.382-.924" />
      <path d="m20.772 16.852.924-.383" />
      <path d="m20.772 19.148.924.383" />
      <path d="M21 10.592V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  'calendar-days': (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </>
  ),
  'calendar-fold': (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z" />
      <path d="M3 10h18" />
      <path d="M15 22v-4a2 2 0 0 1 2-2h4" />
    </>
  ),
  'calendar-heart': (
    <>
      <path d="M12.127 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.125" />
      <path d="M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
    </>
  ),
  'calendar-minus': (
    <>
      <path d="M16 19h6" />
      <path d="M16 2v4" />
      <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
    </>
  ),
  'calendar-off': (
    <>
      <path d="M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18" />
      <path d="M21 15.5V6a2 2 0 0 0-2-2H9.5" />
      <path d="M16 2v4" />
      <path d="M3 10h7" />
      <path d="M21 10h-5.5" />
      <path d="m2 2 20 20" />
    </>
  ),
  'calendar-plus': (
    <>
      <path d="M16 19h6" />
      <path d="M16 2v4" />
      <path d="M19 16v6" />
      <path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
    </>
  ),
  'calendar-range': (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
      <path d="M17 14h-6" />
      <path d="M13 18H7" />
      <path d="M7 14h.01" />
      <path d="M17 18h.01" />
    </>
  ),
  'calendar-search': (
    <>
      <path d="M16 2v4" />
      <path d="M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25" />
      <path d="m22 22-1.875-1.875" />
      <path d="M3 10h18" />
      <path d="M8 2v4" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  'calendar-sync': (
    <>
      <path d="M11 10v4h4" />
      <path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5" />
      <path d="M16 2v4" />
      <path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5" />
      <path d="M21 22v-4h-4" />
      <path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" />
      <path d="M3 10h4" />
      <path d="M8 2v4" />
    </>
  ),
  'calendar-x': (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m14 14-4 4" />
      <path d="m10 14 4 4" />
    </>
  ),
  'camera-off': (
    <>
      <path d="M14.564 14.558a3 3 0 1 1-4.122-4.121" />
      <path d="m2 2 20 20" />
      <path d="M20 20H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 .819-.175" />
      <path d="M9.695 4.024A2 2 0 0 1 10.004 4h3.993a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v7.344" />
    </>
  ),
  captions: (
    <>
      <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
      <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
    </>
  ),
  'captions-off': (
    <>
      <path d="M10.5 5H19a2 2 0 0 1 2 2v8.5" />
      <path d="M17 11h-.5" />
      <path d="M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" />
      <path d="m2 2 20 20" />
      <path d="M7 11h4" />
      <path d="M7 15h2.5" />
    </>
  ),
  'card-sim': (
    <>
      <path d="M12 14v4" />
      <path d="M14.172 2a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 20 7.828V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M8 14h8" />
      <rect x="8" y="10" width="8" height="8" rx="1" />
    </>
  ),
  'case-lower': (
    <>
      <path d="M10 9v7" />
      <path d="M14 6v10" />
      <circle cx="17.5" cy="12.5" r="3.5" />
      <circle cx="6.5" cy="12.5" r="3.5" />
    </>
  ),
  'case-sensitive': (
    <>
      <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
      <path d="M22 9v7" />
      <path d="M3.304 13h6.392" />
      <circle cx="18.5" cy="12.5" r="3.5" />
    </>
  ),
  'case-upper': (
    <>
      <path d="M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5" />
      <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
      <path d="M3.304 13h6.392" />
    </>
  ),
  cast: (
    <>
      <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
      <path d="M2 12a9 9 0 0 1 8 8" />
      <path d="M2 16a5 5 0 0 1 4 4" />
      <line x1="2" x2="2.01" y1="20" y2="20" />
    </>
  ),
  cctv: (
    <>
      <path d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97" />
      <path d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z" />
      <path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" />
      <path d="M2 21v-4" />
      <path d="M7 9h.01" />
    </>
  ),
  'chart-area': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
    </>
  ),
  'chart-bar': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16h8" />
      <path d="M7 11h12" />
      <path d="M7 6h3" />
    </>
  ),
  'chart-bar-big': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <rect x="7" y="13" width="9" height="4" rx="1" />
      <rect x="7" y="5" width="12" height="4" rx="1" />
    </>
  ),
  'chart-bar-decreasing': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 11h8" />
      <path d="M7 16h3" />
      <path d="M7 6h12" />
    </>
  ),
  'chart-bar-increasing': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 11h8" />
      <path d="M7 16h12" />
      <path d="M7 6h3" />
    </>
  ),
  'chart-bar-stacked': (
    <>
      <path d="M11 13v4" />
      <path d="M15 5v4" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <rect x="7" y="13" width="9" height="4" rx="1" />
      <rect x="7" y="5" width="12" height="4" rx="1" />
    </>
  ),
  'chart-candlestick': (
    <>
      <path d="M9 5v4" />
      <rect width="4" height="6" x="7" y="9" rx="1" />
      <path d="M9 15v2" />
      <path d="M17 3v2" />
      <rect width="4" height="8" x="15" y="5" rx="1" />
      <path d="M17 13v3" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    </>
  ),
  'chart-column-big': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <rect x="15" y="5" width="4" height="12" rx="1" />
      <rect x="7" y="8" width="4" height="9" rx="1" />
    </>
  ),
  'chart-column-decreasing': (
    <>
      <path d="M13 17V9" />
      <path d="M18 17v-3" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M8 17V5" />
    </>
  ),
  'chart-column-increasing': (
    <>
      <path d="M13 17V9" />
      <path d="M18 17V5" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M8 17v-3" />
    </>
  ),
  'chart-column-stacked': (
    <>
      <path d="M11 13H7" />
      <path d="M19 9h-4" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <rect x="15" y="5" width="4" height="12" rx="1" />
      <rect x="7" y="8" width="4" height="9" rx="1" />
    </>
  ),
  'chart-gantt': (
    <>
      <path d="M10 6h8" />
      <path d="M12 16h6" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M8 11h7" />
    </>
  ),
  'chart-network': (
    <>
      <path d="m13.11 7.664 1.78 2.672" />
      <path d="m14.162 12.788-3.324 1.424" />
      <path d="m20 4-6.06 1.515" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="16" cy="12" r="2" />
      <circle cx="9" cy="15" r="2" />
    </>
  ),
  'chart-no-axes-column': (
    <>
      <path d="M5 21v-6" />
      <path d="M12 21V3" />
      <path d="M19 21V9" />
    </>
  ),
  'chart-no-axes-column-decreasing': (
    <>
      <path d="M5 21V3" />
      <path d="M12 21V9" />
      <path d="M19 21v-6" />
    </>
  ),
  'chart-no-axes-combined': (
    <>
      <path d="M12 16v5" />
      <path d="M16 14v7" />
      <path d="M20 10v11" />
      <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
      <path d="M4 18v3" />
      <path d="M8 14v7" />
    </>
  ),
  'chart-no-axes-gantt': (
    <>
      <path d="M6 5h12" />
      <path d="M4 12h10" />
      <path d="M12 19h8" />
    </>
  ),
  'chart-scatter': (
    <>
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="18.5" cy="5.5" r=".5" fill="currentColor" />
      <circle cx="11.5" cy="11.5" r=".5" fill="currentColor" />
      <circle cx="7.5" cy="16.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="14.5" r=".5" fill="currentColor" />
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
    </>
  ),
  'chart-spline': (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
    </>
  ),
  'check-check': (
    <>
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </>
  ),
  'check-line': (
    <>
      <path d="M20 4L9 15" />
      <path d="M21 19L3 19" />
      <path d="M9 15L4 10" />
    </>
  ),
  'chevron-first': (
    <>
      <path d="m17 18-6-6 6-6" />
      <path d="M7 6v12" />
    </>
  ),
  'chevron-last': (
    <>
      <path d="m7 18 6-6-6-6" />
      <path d="M17 6v12" />
    </>
  ),
  'chevrons-down-up': (
    <>
      <path d="m7 20 5-5 5 5" />
      <path d="m7 4 5 5 5-5" />
    </>
  ),
  'chevrons-left-right': (
    <>
      <path d="m9 7-5 5 5 5" />
      <path d="m15 7 5 5-5 5" />
    </>
  ),
  'chevrons-left-right-ellipsis': (
    <>
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
      <path d="m17 7 5 5-5 5" />
      <path d="m7 7-5 5 5 5" />
      <path d="M8 12h.01" />
    </>
  ),
  'chevrons-right-left': (
    <>
      <path d="m20 17-5-5 5-5" />
      <path d="m4 17 5-5-5-5" />
    </>
  ),
  'chevrons-up-down': (
    <>
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </>
  ),
  church: (
    <>
      <path d="M10 9h4" />
      <path d="M12 7v5" />
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9" />
      <path d="M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14" />
    </>
  ),
  circle: <circle cx="12" cy="12" r="10" />,
  'circle-arrow-down': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="m8 12 4 4 4-4" />
    </>
  ),
  'circle-arrow-left': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m12 8-4 4 4 4" />
      <path d="M16 12H8" />
    </>
  ),
  'circle-arrow-out-down-left': (
    <>
      <path d="M2 12a10 10 0 1 1 10 10" />
      <path d="m2 22 10-10" />
      <path d="M8 22H2v-6" />
    </>
  ),
  'circle-arrow-out-down-right': (
    <>
      <path d="M12 22a10 10 0 1 1 10-10" />
      <path d="M22 22 12 12" />
      <path d="M22 16v6h-6" />
    </>
  ),
  'circle-arrow-out-up-left': (
    <>
      <path d="M2 8V2h6" />
      <path d="m2 2 10 10" />
      <path d="M12 2A10 10 0 1 1 2 12" />
    </>
  ),
  'circle-arrow-out-up-right': (
    <>
      <path d="M22 12A10 10 0 1 1 12 2" />
      <path d="M22 2 12 12" />
      <path d="M16 2h6v6" />
    </>
  ),
  'circle-arrow-right': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m12 16 4-4-4-4" />
      <path d="M8 12h8" />
    </>
  ),
  'circle-arrow-up': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 12-4-4-4 4" />
      <path d="M12 16V8" />
    </>
  ),
  'circle-check': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'circle-check-big': (
    <>
      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
      <path d="m9 11 3 3L22 4" />
    </>
  ),
  'circle-chevron-down': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 10-4 4-4-4" />
    </>
  ),
  'circle-chevron-left': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m14 16-4-4 4-4" />
    </>
  ),
  'circle-chevron-right': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 4 4-4 4" />
    </>
  ),
  'circle-chevron-up': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 14 4-4 4 4" />
    </>
  ),
  'circle-dashed': (
    <>
      <path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
      <path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
      <path d="M17.609 3.721a10 10 0 0 1 2.69 2.7" />
      <path d="M2.182 13.9a10 10 0 0 1 0-3.8" />
      <path d="M20.279 17.609a10 10 0 0 1-2.7 2.69" />
      <path d="M21.818 10.1a10 10 0 0 1 0 3.8" />
      <path d="M3.721 6.391a10 10 0 0 1 2.7-2.69" />
      <path d="M6.391 20.279a10 10 0 0 1-2.69-2.7" />
    </>
  ),
  'circle-divide': (
    <>
      <line x1="8" x2="16" y1="12" y2="12" />
      <line x1="12" x2="12" y1="16" y2="16" />
      <line x1="12" x2="12" y1="8" y2="8" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-dollar-sign': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </>
  ),
  'circle-dot': (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  'circle-dot-dashed': (
    <>
      <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
      <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
      <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
      <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
      <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
      <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
      <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
      <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  'circle-ellipsis': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M17 12h.01" />
      <path d="M12 12h.01" />
      <path d="M7 12h.01" />
    </>
  ),
  'circle-equal': (
    <>
      <path d="M7 10h10" />
      <path d="M7 14h10" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-fading-arrow-up': (
    <>
      <path d="M12 2a10 10 0 0 1 7.38 16.75" />
      <path d="m16 12-4-4-4 4" />
      <path d="M12 16V8" />
      <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
      <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
      <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
      <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
    </>
  ),
  'circle-fading-plus': (
    <>
      <path d="M12 2a10 10 0 0 1 7.38 16.75" />
      <path d="M12 8v8" />
      <path d="M16 12H8" />
      <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
      <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
      <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
      <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
    </>
  ),
  'circle-minus': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
    </>
  ),
  'circle-off': (
    <>
      <path d="m2 2 20 20" />
      <path d="M8.35 2.69A10 10 0 0 1 21.3 15.65" />
      <path d="M19.08 19.08A10 10 0 1 1 4.92 4.92" />
    </>
  ),
  'circle-parking': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  'circle-parking-off': (
    <>
      <path d="M12.656 7H13a3 3 0 0 1 2.984 3.307" />
      <path d="M13 13H9" />
      <path d="M19.071 19.071A1 1 0 0 1 4.93 4.93" />
      <path d="m2 2 20 20" />
      <path d="M8.357 2.687a10 10 0 0 1 12.956 12.956" />
      <path d="M9 17V9" />
    </>
  ),
  'circle-pause': (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="10" x2="10" y1="15" y2="9" />
      <line x1="14" x2="14" y1="15" y2="9" />
    </>
  ),
  'circle-percent': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="M9 9h.01" />
      <path d="M15 15h.01" />
    </>
  ),
  'circle-play': (
    <>
      <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-plus': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </>
  ),
  'circle-pound-sterling': (
    <>
      <path d="M10 16V9.5a1 1 0 0 1 5 0" />
      <path d="M8 12h4" />
      <path d="M8 16h7" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-power': (
    <>
      <path d="M12 7v4" />
      <path d="M7.998 9.003a5 5 0 1 0 8-.005" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-question-mark': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  'circle-slash': (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="9" x2="15" y1="15" y2="9" />
    </>
  ),
  'circle-slashed': (
    <>
      <path d="M22 2 2 22" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-small': <circle cx="12" cy="12" r="6" />,
  'circle-star': (
    <>
      <path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-stop': (
    <>
      <circle cx="12" cy="12" r="10" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </>
  ),
  'circle-user-round': (
    <>
      <path d="M18 20a6 6 0 0 0-12 0" />
      <circle cx="12" cy="10" r="4" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'circle-x': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
  'circuit-board': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M11 9h4a2 2 0 0 0 2-2V3" />
      <circle cx="9" cy="9" r="2" />
      <path d="M7 21v-4a2 2 0 0 1 2-2h4" />
      <circle cx="15" cy="15" r="2" />
    </>
  ),
  clipboard: (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </>
  ),
  'clipboard-check': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  'clipboard-clock': (
    <>
      <path d="M16 14v2.2l1.6 1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v.832" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
      <circle cx="16" cy="16" r="6" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </>
  ),
  'clipboard-copy': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      <path d="M16 4h2a2 2 0 0 1 2 2v4" />
      <path d="M21 14H11" />
      <path d="m15 10-4 4 4 4" />
    </>
  ),
  'clipboard-list': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </>
  ),
  'clipboard-minus': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 14h6" />
    </>
  ),
  'clipboard-paste': (
    <>
      <path d="M11 14h10" />
      <path d="M16 4h2a2 2 0 0 1 2 2v1.344" />
      <path d="m17 18 4-4-4-4" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </>
  ),
  'clipboard-pen': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5" />
      <path d="M4 13.5V6a2 2 0 0 1 2-2h2" />
      <path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </>
  ),
  'clipboard-pen-line': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" />
      <path d="M16 4h2a2 2 0 0 1 1.73 1" />
      <path d="M8 18h1" />
      <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </>
  ),
  'clipboard-plus': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 14h6" />
      <path d="M12 17v-6" />
    </>
  ),
  'clipboard-type': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12v-1h6v1" />
      <path d="M11 17h2" />
      <path d="M12 11v6" />
    </>
  ),
  'clipboard-x': (
    <>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m15 11-6 6" />
      <path d="m9 11 6 6" />
    </>
  ),
  'clock-alert': (
    <>
      <path d="M12 6v6l4 2" />
      <path d="M20 12v5" />
      <path d="M20 21h.01" />
      <path d="M21.25 8.2A10 10 0 1 0 16 21.16" />
    </>
  ),
  'clock-arrow-down': (
    <>
      <path d="M12 6v6l2 1" />
      <path d="M12.337 21.994a10 10 0 1 1 9.588-8.767" />
      <path d="m14 18 4 4 4-4" />
      <path d="M18 14v8" />
    </>
  ),
  'clock-arrow-up': (
    <>
      <path d="M12 6v6l1.56.78" />
      <path d="M13.227 21.925a10 10 0 1 1 8.767-9.588" />
      <path d="m14 18 4-4 4 4" />
      <path d="M18 22v-8" />
    </>
  ),
  'clock-fading': (
    <>
      <path d="M12 2a10 10 0 0 1 7.38 16.75" />
      <path d="M12 6v6l4 2" />
      <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
      <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
      <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
      <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
    </>
  ),
  'clock-plus': (
    <>
      <path d="M12 6v6l3.644 1.822" />
      <path d="M16 19h6" />
      <path d="M19 16v6" />
      <path d="M21.92 13.267a10 10 0 1 0-8.653 8.653" />
    </>
  ),
  'closed-caption': (
    <>
      <path d="M10 9.17a3 3 0 1 0 0 5.66" />
      <path d="M17 9.17a3 3 0 1 0 0 5.66" />
      <rect x="2" y="5" width="20" height="14" rx="2" />
    </>
  ),
  'cloud-alert': (
    <>
      <path d="M12 12v4" />
      <path d="M12 20h.01" />
      <path d="M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708" />
    </>
  ),
  'cloud-check': (
    <>
      <path d="m17 15-5.5 5.5L9 18" />
      <path d="M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742" />
    </>
  ),
  'cloud-cog': (
    <>
      <path d="m10.852 19.772-.383.924" />
      <path d="m13.148 14.228.383-.923" />
      <path d="M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923" />
      <path d="m13.53 20.696-.382-.924a3 3 0 1 1-2.296-5.544" />
      <path d="m14.772 15.852.923-.383" />
      <path d="m14.772 18.148.923.383" />
      <path d="M4.2 15.1a7 7 0 1 1 9.93-9.858A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" />
      <path d="m9.228 15.852-.923-.383" />
      <path d="m9.228 18.148-.923.383" />
    </>
  ),
  'cloud-download': (
    <>
      <path d="M12 13v8l-4-4" />
      <path d="m12 21 4-4" />
      <path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" />
    </>
  ),
  'cloud-upload': (
    <>
      <path d="M12 13v8" />
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="m8 17 4-4 4 4" />
    </>
  ),
  'code-xml': (
    <>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </>
  ),
  cog: (
    <>
      <path d="M11 10.27 7 3.34" />
      <path d="m11 13.73-4 6.93" />
      <path d="M12 22v-2" />
      <path d="M12 2v2" />
      <path d="M14 12h8" />
      <path d="m17 20.66-1-1.73" />
      <path d="m17 3.34-1 1.73" />
      <path d="M2 12h2" />
      <path d="m20.66 17-1.73-1" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="12" r="8" />
    </>
  ),
  coins: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </>
  ),
  'columns-3-cog': (
    <>
      <path d="M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" />
      <path d="m14.3 19.6 1-.4" />
      <path d="M15 3v7.5" />
      <path d="m15.2 16.9-.9-.3" />
      <path d="m16.6 21.7.3-.9" />
      <path d="m16.8 15.3-.4-1" />
      <path d="m19.1 15.2.3-.9" />
      <path d="m19.6 21.7-.4-1" />
      <path d="m20.7 16.8 1-.4" />
      <path d="m21.7 19.4-.9-.3" />
      <path d="M9 3v18" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  combine: (
    <>
      <path d="M14 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" />
      <path d="M19 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" />
      <path d="m7 15 3 3" />
      <path d="m7 21 3-3H5a2 2 0 0 1-2-2v-2" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="3" width="7" height="7" rx="1" />
    </>
  ),
  command: <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />,
  compass: (
    <>
      <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  component: (
    <>
      <path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
      <path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z" />
      <path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z" />
      <path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z" />
    </>
  ),
  computer: (
    <>
      <rect width="14" height="8" x="5" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h2" />
      <path d="M12 18h6" />
    </>
  ),
  'concierge-bell': (
    <>
      <path d="M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z" />
      <path d="M20 16a8 8 0 1 0-16 0" />
      <path d="M12 4v4" />
      <path d="M10 4h4" />
    </>
  ),
  cone: (
    <>
      <path d="m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98" />
      <ellipse cx="12" cy="19" rx="9" ry="3" />
    </>
  ),
  construction: (
    <>
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10 14 2.3 6.3" />
      <path d="m14 6 7.7 7.7" />
      <path d="m8 6 8 8" />
    </>
  ),
  contact: (
    <>
      <path d="M16 2v2" />
      <path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
      <path d="M8 2v2" />
      <circle cx="12" cy="11" r="3" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
    </>
  ),
  'contact-round': (
    <>
      <path d="M16 2v2" />
      <path d="M17.915 22a6 6 0 0 0-12 0" />
      <path d="M8 2v2" />
      <circle cx="12" cy="12" r="4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
    </>
  ),
  container: (
    <>
      <path d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z" />
      <path d="M10 21.9V14L2.1 9.1" />
      <path d="m10 14 11.9-6.9" />
      <path d="M14 19.8v-8.1" />
      <path d="M18 17.5V9.4" />
    </>
  ),
  contrast: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 18a6 6 0 0 0 0-12v12z" />
    </>
  ),
  'copy-check': (
    <>
      <path d="m12 15 2 2 4-4" />
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  'copy-minus': (
    <>
      <line x1="12" x2="18" y1="15" y2="15" />
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  'copy-plus': (
    <>
      <line x1="15" x2="15" y1="12" y2="18" />
      <line x1="12" x2="18" y1="15" y2="15" />
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  'copy-slash': (
    <>
      <line x1="12" x2="18" y1="18" y2="12" />
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  'copy-x': (
    <>
      <line x1="12" x2="18" y1="12" y2="18" />
      <line x1="12" x2="18" y1="18" y2="12" />
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  copyleft: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.17 14.83a4 4 0 1 0 0-5.66" />
    </>
  ),
  copyright: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
    </>
  ),
  'corner-down-left': (
    <>
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
      <path d="m9 10-5 5 5 5" />
    </>
  ),
  'corner-down-right': (
    <>
      <path d="m15 10 5 5-5 5" />
      <path d="M4 4v7a4 4 0 0 0 4 4h12" />
    </>
  ),
  'corner-left-down': (
    <>
      <path d="m14 15-5 5-5-5" />
      <path d="M20 4h-7a4 4 0 0 0-4 4v12" />
    </>
  ),
  'corner-left-up': (
    <>
      <path d="M14 9 9 4 4 9" />
      <path d="M20 20h-7a4 4 0 0 1-4-4V4" />
    </>
  ),
  'corner-right-down': (
    <>
      <path d="m10 15 5 5 5-5" />
      <path d="M4 4h7a4 4 0 0 1 4 4v12" />
    </>
  ),
  'corner-right-up': (
    <>
      <path d="m10 9 5-5 5 5" />
      <path d="M4 20h7a4 4 0 0 0 4-4V4" />
    </>
  ),
  'corner-up-left': (
    <>
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
      <path d="M9 14 4 9l5-5" />
    </>
  ),
  'corner-up-right': (
    <>
      <path d="m15 14 5-5-5-5" />
      <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
    </>
  ),
  'creative-commons': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1" />
      <path d="M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1" />
    </>
  ),
  crop: (
    <>
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </>
  ),
  cross: (
    <path d="M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z" />
  ),
  crosshair: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="18" y1="12" y2="12" />
      <line x1="6" x2="2" y1="12" y2="12" />
      <line x1="12" x2="12" y1="6" y2="2" />
      <line x1="12" x2="12" y1="22" y2="18" />
    </>
  ),
  currency: (
    <>
      <circle cx="12" cy="12" r="8" />
      <line x1="3" x2="6" y1="3" y2="6" />
      <line x1="21" x2="18" y1="3" y2="6" />
      <line x1="3" x2="6" y1="21" y2="18" />
      <line x1="21" x2="18" y1="21" y2="18" />
    </>
  ),
  cylinder: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
    </>
  ),
  dam: (
    <>
      <path d="M11 11.31c1.17.56 1.54 1.69 3.5 1.69 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M11.75 18c.35.5 1.45 1 2.75 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <path d="M2 6h4" />
      <path d="M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L10 4a1 1 0 0 0-1-1z" />
    </>
  ),
  'database-backup': (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 12a9 3 0 0 0 5 2.69" />
      <path d="M21 9.3V5" />
      <path d="M3 5v14a9 3 0 0 0 6.47 2.88" />
      <path d="M12 12v4h4" />
      <path d="M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" />
    </>
  ),
  'database-zap': (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 15 21.84" />
      <path d="M21 5V8" />
      <path d="M21 12L18 17H22L19 22" />
      <path d="M3 12A9 3 0 0 0 14.59 14.87" />
    </>
  ),
  'decimals-arrow-left': (
    <>
      <path d="m13 21-3-3 3-3" />
      <path d="M20 18H10" />
      <path d="M3 11h.01" />
      <rect x="6" y="3" width="5" height="8" rx="2.5" />
    </>
  ),
  'decimals-arrow-right': (
    <>
      <path d="M10 18h10" />
      <path d="m17 21 3-3-3-3" />
      <path d="M3 11h.01" />
      <rect x="15" y="3" width="5" height="8" rx="2.5" />
      <rect x="6" y="3" width="5" height="8" rx="2.5" />
    </>
  ),
  delete: (
    <>
      <path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
      <path d="m12 9 6 6" />
      <path d="m18 9-6 6" />
    </>
  ),
  diameter: (
    <>
      <circle cx="19" cy="19" r="2" />
      <circle cx="5" cy="5" r="2" />
      <path d="M6.48 3.66a10 10 0 0 1 13.86 13.86" />
      <path d="m6.41 6.41 11.18 11.18" />
      <path d="M3.66 6.48a10 10 0 0 0 13.86 13.86" />
    </>
  ),
  'diamond-minus': (
    <>
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z" />
      <path d="M8 12h8" />
    </>
  ),
  'diamond-percent': (
    <>
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z" />
      <path d="M9.2 9.2h.01" />
      <path d="m14.5 9.5-5 5" />
      <path d="M14.7 14.8h.01" />
    </>
  ),
  'diamond-plus': (
    <>
      <path d="M12 8v8" />
      <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z" />
      <path d="M8 12h8" />
    </>
  ),
  diff: (
    <>
      <path d="M12 3v14" />
      <path d="M5 10h14" />
      <path d="M5 21h14" />
    </>
  ),
  divide: (
    <>
      <circle cx="12" cy="6" r="1" />
      <line x1="5" x2="19" y1="12" y2="12" />
      <circle cx="12" cy="18" r="1" />
    </>
  ),
  dock: (
    <>
      <path d="M2 8h20" />
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 16h12" />
    </>
  ),
  'door-closed': (
    <>
      <path d="M10 12h.01" />
      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
      <path d="M2 20h20" />
    </>
  ),
  'door-closed-locked': (
    <>
      <path d="M10 12h.01" />
      <path d="M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
      <path d="M2 20h8" />
      <path d="M20 17v-2a2 2 0 1 0-4 0v2" />
      <rect x="14" y="17" width="8" height="5" rx="1" />
    </>
  ),
  'door-open': (
    <>
      <path d="M11 20H2" />
      <path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z" />
      <path d="M11 4H8a2 2 0 0 0-2 2v14" />
      <path d="M14 12h.01" />
      <path d="M22 20h-3" />
    </>
  ),
  dot: <circle cx="12.1" cy="12.1" r="1" />,
  'drafting-compass': (
    <>
      <path d="m12.99 6.74 1.93 3.44" />
      <path d="M19.136 12a10 10 0 0 1-14.271 0" />
      <path d="m21 21-2.16-3.84" />
      <path d="m3 21 8.02-14.26" />
      <circle cx="12" cy="5" r="2" />
    </>
  ),
  drill: (
    <>
      <path d="M10 18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3 1 1 0 0 1 1-1z" />
      <path d="M13 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1l-.81 3.242a1 1 0 0 1-.97.758H8" />
      <path d="M14 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3" />
      <path d="M18 6h4" />
      <path d="m5 10-2 8" />
      <path d="m7 18 2-8" />
    </>
  ),
  drone: (
    <>
      <path d="M10 10 7 7" />
      <path d="m10 14-3 3" />
      <path d="m14 10 3-3" />
      <path d="m14 14 3 3" />
      <path d="M14.205 4.139a4 4 0 1 1 5.439 5.863" />
      <path d="M19.637 14a4 4 0 1 1-5.432 5.868" />
      <path d="M4.367 10a4 4 0 1 1 5.438-5.862" />
      <path d="M9.795 19.862a4 4 0 1 1-5.429-5.873" />
      <rect x="10" y="8" width="4" height="8" rx="1" />
    </>
  ),
  earth: (
    <>
      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
      <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
      <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  'earth-lock': (
    <>
      <path d="M7 3.34V5a3 3 0 0 0 3 3" />
      <path d="M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
      <path d="M12 2a10 10 0 1 0 9.54 13" />
      <path d="M20 6V4a2 2 0 1 0-4 0v2" />
      <rect width="8" height="5" x="14" y="6" rx="1" />
    </>
  ),
  'ellipsis-vertical': (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  equal: (
    <>
      <line x1="5" x2="19" y1="9" y2="9" />
      <line x1="5" x2="19" y1="15" y2="15" />
    </>
  ),
  'equal-approximately': (
    <>
      <path d="M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" />
      <path d="M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" />
    </>
  ),
  'equal-not': (
    <>
      <line x1="5" x2="19" y1="9" y2="9" />
      <line x1="5" x2="19" y1="15" y2="15" />
      <line x1="19" x2="5" y1="5" y2="19" />
    </>
  ),
  eraser: (
    <>
      <path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21" />
      <path d="m5.082 11.09 8.828 8.828" />
    </>
  ),
  'ethernet-port': (
    <>
      <path d="m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z" />
      <path d="M6 8v1" />
      <path d="M10 8v1" />
      <path d="M14 8v1" />
      <path d="M18 8v1" />
    </>
  ),
  euro: (
    <>
      <path d="M4 10h12" />
      <path d="M4 14h9" />
      <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
    </>
  ),
  'ev-charger': (
    <>
      <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5" />
      <path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" />
      <path d="M2 21h13" />
      <path d="M3 7h11" />
      <path d="m9 11-2 3h3l-2 3" />
    </>
  ),
  'eye-closed': (
    <>
      <path d="m15 18-.722-3.25" />
      <path d="M2 8a10.645 10.645 0 0 0 20 0" />
      <path d="m20 15-1.726-2.05" />
      <path d="m4 15 1.726-2.05" />
      <path d="m9 18 .722-3.25" />
    </>
  ),
  factory: (
    <>
      <path d="M12 16h.01" />
      <path d="M16 16h.01" />
      <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
      <path d="M8 16h.01" />
    </>
  ),
  'fast-forward': (
    <>
      <path d="M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z" />
      <path d="M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z" />
    </>
  ),
  fence: (
    <>
      <path d="M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" />
      <path d="M6 8h4" />
      <path d="M6 18h4" />
      <path d="m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" />
      <path d="M14 8h4" />
      <path d="M14 18h4" />
      <path d="m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" />
    </>
  ),
  'file-archive': (
    <>
      <path d="M10 12v-1" />
      <path d="M10 18v-2" />
      <path d="M10 7V6" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01" />
      <circle cx="10" cy="20" r="2" />
    </>
  ),
  'file-audio': (
    <>
      <path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0" />
    </>
  ),
  'file-axis-3d': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m8 18 4-4" />
      <path d="M8 10v8h8" />
    </>
  ),
  'file-badge': (
    <>
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.072" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m6.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.88.001l-1.846.85a.5.5 0 0 1-.693-.593l1.29-4.88" />
      <circle cx="5" cy="14" r="3" />
    </>
  ),
  'file-box': (
    <>
      <path d="M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01Z" />
      <path d="M7 17v5" />
      <path d="M11.7 14.2 7 17l-4.7-2.8" />
    </>
  ),
  'file-chart-column': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 18v-1" />
      <path d="M12 18v-6" />
      <path d="M16 18v-3" />
    </>
  ),
  'file-chart-column-increasing': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 18v-2" />
      <path d="M12 18v-4" />
      <path d="M16 18v-6" />
    </>
  ),
  'file-chart-line': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m16 13-3.5 3.5-2-2L8 17" />
    </>
  ),
  'file-chart-pie': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5" />
      <path d="M4.017 11.512a6 6 0 1 0 8.466 8.475" />
      <path d="M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z" />
    </>
  ),
  'file-clock': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
      <path d="M8 14v2.2l1.6 1" />
      <circle cx="8" cy="16" r="6" />
    </>
  ),
  'file-code': (
    <>
      <path d="M10 12.5 8 15l2 2.5" />
      <path d="m14 12.5 2 2.5-2 2.5" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    </>
  ),
  'file-cog': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m2.305 15.53.923-.382" />
      <path d="m3.228 12.852-.924-.383" />
      <path d="M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5" />
      <path d="m4.852 11.228-.383-.923" />
      <path d="m4.852 16.772-.383.924" />
      <path d="m7.148 11.228.383-.923" />
      <path d="m7.53 17.696-.382-.924" />
      <path d="m8.772 12.852.923-.383" />
      <path d="m8.772 15.148.923.383" />
      <circle cx="6" cy="14" r="3" />
    </>
  ),
  'file-diff': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M9 10h6" />
      <path d="M12 13V7" />
      <path d="M9 17h6" />
    </>
  ),
  'file-digit': (
    <>
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <rect width="4" height="6" x="2" y="12" rx="2" />
      <path d="M10 12h2v6" />
      <path d="M10 18h4" />
    </>
  ),
  'file-down': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 18v-6" />
      <path d="m9 15 3 3 3-3" />
    </>
  ),
  'file-heart': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M2.62 13.8A2.25 2.25 0 1 1 6 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
      <path d="M4 6.005V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-1.9-1.376" />
    </>
  ),
  'file-image': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <circle cx="10" cy="12" r="2" />
      <path d="m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" />
    </>
  ),
  'file-input': (
    <>
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M2 15h10" />
      <path d="m9 18 3-3-3-3" />
    </>
  ),
  'file-json': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" />
      <path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
    </>
  ),
  'file-key': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <circle cx="10" cy="16" r="2" />
      <path d="m16 10-4.5 4.5" />
      <path d="m15 11 1 1" />
    </>
  ),
  'file-lock': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <rect width="8" height="6" x="8" y="12" rx="1" />
      <path d="M10 12v-2a2 2 0 1 1 4 0v2" />
    </>
  ),
  'file-minus': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 15h6" />
    </>
  ),
  'file-output': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2" />
      <path d="M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6" />
      <path d="m5 11-3 3" />
      <path d="m5 17-3-3h10" />
    </>
  ),
  'file-pen': (
    <>
      <path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </>
  ),
  'file-pen-line': (
    <>
      <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
      <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
      <path d="M8 18h1" />
    </>
  ),
  'file-play': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M15.033 13.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56v-4.704a.645.645 0 0 1 .967-.56z" />
    </>
  ),
  'file-question-mark': (
    <>
      <path d="M12 17h.01" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
    </>
  ),
  'file-scan': (
    <>
      <path d="M20 10V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M16 14a2 2 0 0 0-2 2" />
      <path d="M20 14a2 2 0 0 1 2 2" />
      <path d="M20 22a2 2 0 0 0 2-2" />
      <path d="M16 22a2 2 0 0 1-2-2" />
    </>
  ),
  'file-search': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
      <path d="m9 18-1.5-1.5" />
      <circle cx="5" cy="14" r="3" />
    </>
  ),
  'file-sliders': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 12h8" />
      <path d="M10 11v2" />
      <path d="M8 17h8" />
      <path d="M14 16v2" />
    </>
  ),
  'file-spreadsheet': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </>
  ),
  'file-stack': (
    <>
      <path d="M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1" />
      <path d="M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1" />
      <path d="M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z" />
    </>
  ),
  'file-symlink': (
    <>
      <path d="m10 18 3-3-3-3" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7" />
    </>
  ),
  'file-terminal': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m8 16 2-2-2-2" />
      <path d="M12 18h4" />
    </>
  ),
  'file-type': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 13v-1h6v1" />
      <path d="M12 12v6" />
      <path d="M11 18h2" />
    </>
  ),
  'file-up': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M12 12v6" />
      <path d="m15 15-3-3-3 3" />
    </>
  ),
  'file-user': (
    <>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M15 18a3 3 0 1 0-6 0" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <circle cx="12" cy="13" r="2" />
    </>
  ),
  'file-video-camera': (
    <>
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="6" x="2" y="12" rx="1" />
      <path d="m10 13.843 3.033-1.755a.645.645 0 0 1 .967.56v4.704a.645.645 0 0 1-.967.56L10 16.157" />
    </>
  ),
  'file-volume': (
    <>
      <path d="M11 11a5 5 0 0 1 0 6" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M4 6.765V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-.93-.23" />
      <path d="M7 10.51a.5.5 0 0 0-.826-.38l-1.893 1.628A1 1 0 0 1 3.63 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1.129a1 1 0 0 1 .652.242l1.893 1.63a.5.5 0 0 0 .826-.38z" />
    </>
  ),
  'file-warning': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  'file-x': (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="m14.5 12.5-5 5" />
      <path d="m9.5 12.5 5 5" />
    </>
  ),
  files: (
    <>
      <path d="M15 2a2 2 0 0 1 1.414.586l4 4A2 2 0 0 1 21 8v7a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M15 2v4a2 2 0 0 0 2 2h4" />
      <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M2 12a10 10 0 0 1 18-6" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
    </>
  ),
  'fire-extinguisher': (
    <>
      <path d="M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5" />
      <path d="M9 18h8" />
      <path d="M18 3h-3" />
      <path d="M11 3a6 6 0 0 0-6 6v11" />
      <path d="M5 13h4" />
      <path d="M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z" />
    </>
  ),
  'flag-off': (
    <>
      <path d="M16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" />
      <path d="m2 2 20 20" />
      <path d="M4 22V4" />
      <path d="M7.656 2H8c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10.347" />
    </>
  ),
  'flag-triangle-left': (
    <path d="M18 22V2.8a.8.8 0 0 0-1.17-.71L5.45 7.78a.8.8 0 0 0 0 1.44L18 15.5" />
  ),
  'flag-triangle-right': (
    <path d="M6 22V2.8a.8.8 0 0 1 1.17-.71l11.38 5.69a.8.8 0 0 1 0 1.44L6 15.5" />
  ),
  flashlight: (
    <>
      <path d="M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z" />
      <line x1="6" x2="18" y1="6" y2="6" />
      <line x1="12" x2="12" y1="12" y2="12" />
    </>
  ),
  'flashlight-off': (
    <>
      <path d="M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4" />
      <path d="M7 2h11v4c0 2-2 2-2 4v1" />
      <line x1="11" x2="18" y1="6" y2="6" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </>
  ),
  'flip-horizontal': (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M12 20v2" />
      <path d="M12 14v2" />
      <path d="M12 8v2" />
      <path d="M12 2v2" />
    </>
  ),
  'flip-vertical': (
    <>
      <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
      <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
      <path d="M4 12H2" />
      <path d="M10 12H8" />
      <path d="M16 12h-2" />
      <path d="M22 12h-2" />
    </>
  ),
  focus: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </>
  ),
  'fold-horizontal': (
    <>
      <path d="M2 12h6" />
      <path d="M22 12h-6" />
      <path d="M12 2v2" />
      <path d="M12 8v2" />
      <path d="M12 14v2" />
      <path d="M12 20v2" />
      <path d="m19 9-3 3 3 3" />
      <path d="m5 15 3-3-3-3" />
    </>
  ),
  'fold-vertical': (
    <>
      <path d="M12 22v-6" />
      <path d="M12 8V2" />
      <path d="M4 12H2" />
      <path d="M10 12H8" />
      <path d="M16 12h-2" />
      <path d="M22 12h-2" />
      <path d="m15 19-3-3-3 3" />
      <path d="m15 5-3 3-3-3" />
    </>
  ),
  'folder-archive': (
    <>
      <circle cx="15" cy="19" r="2" />
      <path d="M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1" />
      <path d="M15 11v-1" />
      <path d="M15 17v-2" />
    </>
  ),
  'folder-check': (
    <>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="m9 13 2 2 4-4" />
    </>
  ),
  'folder-clock': (
    <>
      <path d="M16 14v2.2l1.6 1" />
      <path d="M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2" />
      <circle cx="16" cy="16" r="6" />
    </>
  ),
  'folder-closed': (
    <>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="M2 10h20" />
    </>
  ),
  'folder-code': (
    <>
      <path d="M10 10.5 8 13l2 2.5" />
      <path d="m14 10.5 2 2.5-2 2.5" />
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
    </>
  ),
  'folder-cog': (
    <>
      <path d="M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3" />
      <path d="m14.305 19.53.923-.382" />
      <path d="m15.228 16.852-.923-.383" />
      <path d="m16.852 15.228-.383-.923" />
      <path d="m16.852 20.772-.383.924" />
      <path d="m19.148 15.228.383-.923" />
      <path d="m19.53 21.696-.382-.924" />
      <path d="m20.772 16.852.924-.383" />
      <path d="m20.772 19.148.924.383" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  'folder-dot': (
    <>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <circle cx="12" cy="13" r="1" />
    </>
  ),
  'folder-down': (
    <>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="M12 10v6" />
      <path d="m15 13-3 3-3-3" />
    </>
  ),
  'folder-git': (
    <>
      <circle cx="12" cy="13" r="2" />
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="M14 13h3" />
      <path d="M7 13h3" />
    </>
  ),
  'folder-heart': (
    <>
      <path d="M10.638 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.417" />
      <path d="M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
    </>
  ),
  'folder-input': (
    <>
      <path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" />
      <path d="M2 13h10" />
      <path d="m9 16 3-3-3-3" />
    </>
  ),
  'folder-kanban': (
    <>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </>
  ),
  'folder-key': (
    <>
      <circle cx="16" cy="20" r="2" />
      <path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2" />
      <path d="m22 14-4.5 4.5" />
      <path d="m21 15 1 1" />
    </>
  ),
  'folder-lock': (
    <>
      <rect width="8" height="5" x="14" y="17" rx="1" />
      <path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5" />
      <path d="M20 17v-2a2 2 0 1 0-4 0v2" />
    </>
  ),
  'folder-minus': (
    <>
      <path d="M9 13h6" />
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </>
  ),
  'folder-open-dot': (
    <>
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
      <circle cx="14" cy="15" r="1" />
    </>
  ),
  'folder-output': (
    <>
      <path d="M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5" />
      <path d="M2 13h10" />
      <path d="m5 10-3 3 3 3" />
    </>
  ),
  'folder-pen': (
    <>
      <path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5" />
      <path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </>
  ),
  'folder-root': (
    <>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <circle cx="12" cy="13" r="2" />
      <path d="M12 15v5" />
    </>
  ),
  'folder-search': (
    <>
      <path d="M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1" />
      <path d="m21 21-1.9-1.9" />
      <circle cx="17" cy="17" r="3" />
    </>
  ),
  'folder-symlink': (
    <>
      <path d="M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7" />
      <path d="m8 16 3-3-3-3" />
    </>
  ),
  'folder-sync': (
    <>
      <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5" />
      <path d="M12 10v4h4" />
      <path d="m12 14 1.535-1.605a5 5 0 0 1 8 1.5" />
      <path d="M22 22v-4h-4" />
      <path d="m22 18-1.535 1.605a5 5 0 0 1-8-1.5" />
    </>
  ),
  'folder-tree': (
    <>
      <path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
      <path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z" />
      <path d="M3 5a2 2 0 0 0 2 2h3" />
      <path d="M3 3v13a2 2 0 0 0 2 2h3" />
    </>
  ),
  'folder-up': (
    <>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="M12 10v6" />
      <path d="m9 13 3-3 3 3" />
    </>
  ),
  'folder-x': (
    <>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="m9.5 10.5 5 5" />
      <path d="m14.5 10.5-5 5" />
    </>
  ),
  folders: (
    <>
      <path d="M20 5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a1.5 1.5 0 0 1 1.2.6l.6.8a1.5 1.5 0 0 0 1.2.6z" />
      <path d="M3 8.268a2 2 0 0 0-1 1.738V19a2 2 0 0 0 2 2h11a2 2 0 0 0 1.732-1" />
    </>
  ),
  footprints: (
    <>
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
      <path d="M16 17h4" />
      <path d="M4 13h4" />
    </>
  ),
  forklift: (
    <>
      <path d="M12 12H5a2 2 0 0 0-2 2v5" />
      <circle cx="13" cy="19" r="2" />
      <circle cx="5" cy="19" r="2" />
      <path d="M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5" />
    </>
  ),
  forward: (
    <>
      <path d="m15 17 5-5-5-5" />
      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
    </>
  ),
  frame: (
    <>
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </>
  ),
  fuel: (
    <>
      <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5" />
      <path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" />
      <path d="M2 21h13" />
      <path d="M3 9h11" />
    </>
  ),
  fullscreen: (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect width="10" height="8" x="7" y="8" rx="1" />
    </>
  ),
  funnel: (
    <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
  ),
  'funnel-plus': (
    <>
      <path d="M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348" />
      <path d="M16 6h6" />
      <path d="M19 3v6" />
    </>
  ),
  'funnel-x': (
    <>
      <path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473" />
      <path d="m16.5 3.5 5 5" />
      <path d="m21.5 3.5-5 5" />
    </>
  ),
  'gallery-horizontal': (
    <>
      <path d="M2 3v18" />
      <rect width="12" height="18" x="6" y="3" rx="2" />
      <path d="M22 3v18" />
    </>
  ),
  'gallery-horizontal-end': (
    <>
      <path d="M2 7v10" />
      <path d="M6 5v14" />
      <rect width="12" height="18" x="10" y="3" rx="2" />
    </>
  ),
  'gallery-thumbnails': (
    <>
      <rect width="18" height="14" x="3" y="3" rx="2" />
      <path d="M4 21h1" />
      <path d="M9 21h1" />
      <path d="M14 21h1" />
      <path d="M19 21h1" />
    </>
  ),
  'gallery-vertical': (
    <>
      <path d="M3 2h18" />
      <rect width="18" height="12" x="3" y="6" rx="2" />
      <path d="M3 22h18" />
    </>
  ),
  'gallery-vertical-end': (
    <>
      <path d="M7 2h10" />
      <path d="M5 6h14" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
    </>
  ),
  'gauge-circle': (
    <>
      <path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M13.4 10.6 19 5" />
    </>
  ),
  'circle-gauge': (
    <>
      <path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M13.4 10.6 19 5" />
    </>
  ),
  gavel: (
    <>
      <path d="m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" />
      <path d="m16 16 6-6" />
      <path d="m21.5 10.5-8-8" />
      <path d="m8 8 6-6" />
      <path d="m8.5 7.5 8 8" />
    </>
  ),
  'georgian-lari': (
    <>
      <path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" />
      <path d="M13 12V3" />
      <path d="M4 21h16" />
      <path d="M9 12V3" />
    </>
  ),
  'git-branch-plus': (
    <>
      <path d="M6 3v12" />
      <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M15 6a9 9 0 0 0-9 9" />
      <path d="M18 15v6" />
      <path d="M21 18h-6" />
    </>
  ),
  'git-commit-horizontal': (
    <>
      <circle cx="12" cy="12" r="3" />
      <line x1="3" x2="9" y1="12" y2="12" />
      <line x1="15" x2="21" y1="12" y2="12" />
    </>
  ),
  'git-commit-vertical': (
    <>
      <path d="M12 3v6" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 15v6" />
    </>
  ),
  'git-compare': (
    <>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <path d="M11 18H8a2 2 0 0 1-2-2V9" />
    </>
  ),
  'git-compare-arrows': (
    <>
      <circle cx="5" cy="6" r="3" />
      <path d="M12 6h5a2 2 0 0 1 2 2v7" />
      <path d="m15 9-3-3 3-3" />
      <circle cx="19" cy="18" r="3" />
      <path d="M12 18H7a2 2 0 0 1-2-2V9" />
      <path d="m9 15 3 3-3 3" />
    </>
  ),
  'git-fork': (
    <>
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
      <path d="M12 12v3" />
    </>
  ),
  'git-graph': (
    <>
      <circle cx="5" cy="6" r="3" />
      <path d="M5 9v6" />
      <circle cx="5" cy="18" r="3" />
      <path d="M12 3v18" />
      <circle cx="19" cy="6" r="3" />
      <path d="M16 15.7A9 9 0 0 0 19 9" />
    </>
  ),
  'git-merge': (
    <>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </>
  ),
  'git-pull-request': (
    <>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <line x1="6" x2="6" y1="9" y2="21" />
    </>
  ),
  'git-pull-request-arrow': (
    <>
      <circle cx="5" cy="6" r="3" />
      <path d="M5 9v12" />
      <circle cx="19" cy="18" r="3" />
      <path d="m15 9-3-3 3-3" />
      <path d="M12 6h5a2 2 0 0 1 2 2v7" />
    </>
  ),
  'git-pull-request-closed': (
    <>
      <circle cx="6" cy="6" r="3" />
      <path d="M6 9v12" />
      <path d="m21 3-6 6" />
      <path d="m21 9-6-6" />
      <path d="M18 11.5V15" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  'git-pull-request-create': (
    <>
      <circle cx="6" cy="6" r="3" />
      <path d="M6 9v12" />
      <path d="M13 6h3a2 2 0 0 1 2 2v3" />
      <path d="M18 15v6" />
      <path d="M21 18h-6" />
    </>
  ),
  'git-pull-request-create-arrow': (
    <>
      <circle cx="5" cy="6" r="3" />
      <path d="M5 9v12" />
      <path d="m15 9-3-3 3-3" />
      <path d="M12 6h5a2 2 0 0 1 2 2v3" />
      <path d="M19 15v6" />
      <path d="M22 18h-6" />
    </>
  ),
  'git-pull-request-draft': (
    <>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M18 6V5" />
      <path d="M18 11v-1" />
      <line x1="6" x2="6" y1="9" y2="21" />
    </>
  ),
  glasses: (
    <>
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
      <path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" />
      <path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />
    </>
  ),
  'globe-lock': (
    <>
      <path d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13" />
      <path d="M2 12h8.5" />
      <path d="M20 6V4a2 2 0 1 0-4 0v2" />
      <rect width="8" height="5" x="14" y="6" rx="1" />
    </>
  ),
  gpu: (
    <>
      <path d="M2 21V3" />
      <path d="M2 5h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2.26" />
      <path d="M7 17v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3" />
      <circle cx="16" cy="11" r="2" />
      <circle cx="8" cy="11" r="2" />
    </>
  ),
  'graduation-cap': (
    <>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </>
  ),
  'grid-2x2': (
    <>
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'grid-2x2-check': (
    <>
      <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
      <path d="m16 19 2 2 4-4" />
    </>
  ),
  'grid-2x2-plus': (
    <>
      <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
      <path d="M16 19h6" />
      <path d="M19 22v-6" />
    </>
  ),
  'grid-2x2-x': (
    <>
      <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
      <path d="m16 16 5 5" />
      <path d="m16 21 5-5" />
    </>
  ),
  'grid-3x2': (
    <>
      <path d="M15 3v18" />
      <path d="M3 12h18" />
      <path d="M9 3v18" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'grid-3x3': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </>
  ),
  grip: (
    <>
      <circle cx="12" cy="5" r="1" />
      <circle cx="19" cy="5" r="1" />
      <circle cx="5" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
      <circle cx="19" cy="19" r="1" />
      <circle cx="5" cy="19" r="1" />
    </>
  ),
  'grip-horizontal': (
    <>
      <circle cx="12" cy="9" r="1" />
      <circle cx="19" cy="9" r="1" />
      <circle cx="5" cy="9" r="1" />
      <circle cx="12" cy="15" r="1" />
      <circle cx="19" cy="15" r="1" />
      <circle cx="5" cy="15" r="1" />
    </>
  ),
  'grip-vertical': (
    <>
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </>
  ),
  group: (
    <>
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </>
  ),
  hammer: (
    <>
      <path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" />
      <path d="m18 15 4-4" />
      <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5" />
    </>
  ),
  hand: (
    <>
      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </>
  ),
  'hand-coins': (
    <>
      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 16 6 6" />
      <circle cx="16" cy="9" r="2.9" />
      <circle cx="6" cy="5" r="3" />
    </>
  ),
  'hand-grab': (
    <>
      <path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" />
      <path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
      <path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5" />
      <path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0" />
    </>
  ),
  'hand-heart': (
    <>
      <path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
      <path d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95" />
      <path d="m2 15 6 6" />
      <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91" />
    </>
  ),
  handbag: (
    <>
      <path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z" />
      <path d="M8 11V6a4 4 0 0 1 8 0v5" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
  'hard-drive-download': (
    <>
      <path d="M12 2v8" />
      <path d="m16 6-4 4-4-4" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h.01" />
      <path d="M10 18h.01" />
    </>
  ),
  'hard-drive-upload': (
    <>
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v8" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h.01" />
      <path d="M10 18h.01" />
    </>
  ),
  'hard-hat': (
    <>
      <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
      <path d="M14 6a6 6 0 0 1 6 6v3" />
      <path d="M4 15v-3a6 6 0 0 1 6-6" />
      <rect x="2" y="15" width="20" height="4" rx="1" />
    </>
  ),
  hash: (
    <>
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </>
  ),
  'hat-glasses': (
    <>
      <path d="M14 18a2 2 0 0 0-4 0" />
      <path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11" />
      <path d="M2 11h20" />
      <circle cx="17" cy="18" r="3" />
      <circle cx="7" cy="18" r="3" />
    </>
  ),
  'hdmi-port': (
    <>
      <path d="M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z" />
      <path d="M7.5 12h9" />
    </>
  ),
  heading: (
    <>
      <path d="M6 12h12" />
      <path d="M6 20V4" />
      <path d="M18 20V4" />
    </>
  ),
  'headphone-off': (
    <>
      <path d="M21 14h-1.343" />
      <path d="M9.128 3.47A9 9 0 0 1 21 12v3.343" />
      <path d="m2 2 20 20" />
      <path d="M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3" />
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364" />
    </>
  ),
  headphones: (
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  ),
  headset: (
    <>
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
    </>
  ),
  'heart-handshake': (
    <path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" />
  ),
  'heart-minus': (
    <>
      <path d="m14.876 18.99-1.368 1.323a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.244 1.572" />
      <path d="M15 15h6" />
    </>
  ),
  'heart-off': (
    <>
      <path d="M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655" />
      <path d="m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761" />
      <path d="m2 2 20 20" />
    </>
  ),
  'heart-plus': (
    <>
      <path d="m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49" />
      <path d="M15 15h6" />
      <path d="M18 12v6" />
    </>
  ),
  'helping-hand': (
    <>
      <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
      <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 13 6 6" />
    </>
  ),
  'hand-helping': (
    <>
      <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" />
      <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 13 6 6" />
    </>
  ),
  hexagon: (
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  ),
  highlighter: (
    <>
      <path d="m9 11-6 6v3h9l3-3" />
      <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
    </>
  ),
  house: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  'house-plug': (
    <>
      <path d="M10 12V8.964" />
      <path d="M14 12V8.964" />
      <path d="M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z" />
      <path d="M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2" />
    </>
  ),
  'house-wifi': (
    <>
      <path d="M9.5 13.866a4 4 0 0 1 5 .01" />
      <path d="M12 17h.01" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M7 10.754a8 8 0 0 1 10 0" />
    </>
  ),
  'id-card-lanyard': (
    <>
      <path d="M13.5 8h-3" />
      <path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
      <path d="M16.899 22A5 5 0 0 0 7.1 22" />
      <path d="m9 2 3 6" />
      <circle cx="12" cy="15" r="3" />
    </>
  ),
  'image-down': (
    <>
      <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
      <path d="m14 19 3 3v-5.5" />
      <path d="m17 22 3-3" />
      <circle cx="9" cy="9" r="2" />
    </>
  ),
  'image-minus': (
    <>
      <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
      <line x1="16" x2="22" y1="5" y2="5" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </>
  ),
  'image-off': (
    <>
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" />
      <line x1="13.5" x2="6" y1="13.5" y2="21" />
      <line x1="18" x2="21" y1="12" y2="15" />
      <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" />
      <path d="M21 15V5a2 2 0 0 0-2-2H9" />
    </>
  ),
  'image-play': (
    <>
      <path d="M15 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" />
      <path d="M21 12.17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <path d="m6 21 5-5" />
      <circle cx="9" cy="9" r="2" />
    </>
  ),
  'image-plus': (
    <>
      <path d="M16 5h6" />
      <path d="M19 2v6" />
      <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      <circle cx="9" cy="9" r="2" />
    </>
  ),
  'image-up': (
    <>
      <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
      <path d="m14 19.5 3-3 3 3" />
      <path d="M17 22v-5.5" />
      <circle cx="9" cy="9" r="2" />
    </>
  ),
  'image-upscale': (
    <>
      <path d="M16 3h5v5" />
      <path d="M17 21h2a2 2 0 0 0 2-2" />
      <path d="M21 12v3" />
      <path d="m21 3-5 5" />
      <path d="M3 7V5a2 2 0 0 1 2-2" />
      <path d="m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19" />
      <path d="M9 3h3" />
      <rect x="3" y="11" width="10" height="10" rx="1" />
    </>
  ),
  images: (
    <>
      <path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" />
      <path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
      <circle cx="13" cy="7" r="1" fill="currentColor" />
      <rect x="8" y="2" width="14" height="14" rx="2" />
    </>
  ),
  import: (
    <>
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
    </>
  ),
  'indian-rupee': (
    <>
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </>
  ),
  infinity: <path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" />,
  'inspection-panel': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h.01" />
      <path d="M17 7h.01" />
      <path d="M7 17h.01" />
      <path d="M17 17h.01" />
    </>
  ),
  'iteration-ccw': (
    <>
      <path d="m16 14 4 4-4 4" />
      <path d="M20 10a8 8 0 1 0-8 8h8" />
    </>
  ),
  'iteration-cw': (
    <>
      <path d="M4 10a8 8 0 1 1 8 8H4" />
      <path d="m8 22-4-4 4-4" />
    </>
  ),
  'japanese-yen': (
    <>
      <path d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" />
      <path d="M6 15h12" />
      <path d="M6 11h12" />
    </>
  ),
  kanban: (
    <>
      <path d="M5 3v14" />
      <path d="M12 3v8" />
      <path d="M19 3v18" />
    </>
  ),
  'key-round': (
    <>
      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </>
  ),
  'key-square': (
    <>
      <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
      <path d="m14 7 3 3" />
      <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
    </>
  ),
  keyboard: (
    <>
      <path d="M10 8h.01" />
      <path d="M12 12h.01" />
      <path d="M14 8h.01" />
      <path d="M16 12h.01" />
      <path d="M18 8h.01" />
      <path d="M6 8h.01" />
      <path d="M7 16h10" />
      <path d="M8 12h.01" />
      <rect width="20" height="16" x="2" y="4" rx="2" />
    </>
  ),
  'keyboard-off': (
    <>
      <path d="M 20 4 A2 2 0 0 1 22 6" />
      <path d="M 22 6 L 22 16.41" />
      <path d="M 7 16 L 16 16" />
      <path d="M 9.69 4 L 20 4" />
      <path d="M14 8h.01" />
      <path d="M18 8h.01" />
      <path d="m2 2 20 20" />
      <path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" />
      <path d="M6 8h.01" />
      <path d="M8 12h.01" />
    </>
  ),
  'land-plot': (
    <>
      <path d="m12 8 6-3-6-3v10" />
      <path d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12" />
      <path d="m6.49 12.85 11.02 6.3" />
      <path d="M17.51 12.85 6.5 19.15" />
    </>
  ),
  landmark: (
    <>
      <path d="M10 18v-7" />
      <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />
      <path d="M14 18v-7" />
      <path d="M18 18v-7" />
      <path d="M3 22h18" />
      <path d="M6 18v-7" />
    </>
  ),
  languages: (
    <>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </>
  ),
  'laptop-minimal': (
    <>
      <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
      <line x1="2" x2="22" y1="20" y2="20" />
    </>
  ),
  'laptop-minimal-check': (
    <>
      <path d="M2 20h20" />
      <path d="m9 10 2 2 4-4" />
      <rect x="3" y="4" width="18" height="12" rx="2" />
    </>
  ),
  lasso: (
    <>
      <path d="M3.704 14.467A10 8 0 0 1 2 10a10 8 0 0 1 20 0 10 8 0 0 1-10 8 10 8 0 0 1-5.181-1.158" />
      <path d="M7 22a5 5 0 0 1-2-3.994" />
      <circle cx="5" cy="16" r="2" />
    </>
  ),
  'lasso-select': (
    <>
      <path d="M7 22a5 5 0 0 1-2-4" />
      <path d="M7 16.93c.96.43 1.96.74 2.99.91" />
      <path d="M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2" />
      <path d="M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14z" />
    </>
  ),
  'layout-dashboard': (
    <>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </>
  ),
  'layout-panel-left': (
    <>
      <rect width="7" height="18" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
    </>
  ),
  'layout-panel-top': (
    <>
      <rect width="18" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
    </>
  ),
  'layout-template': (
    <>
      <rect width="18" height="7" x="3" y="3" rx="1" />
      <rect width="9" height="7" x="3" y="14" rx="1" />
      <rect width="5" height="7" x="16" y="14" rx="1" />
    </>
  ),
  lectern: (
    <>
      <path d="M16 12h3a2 2 0 0 0 1.902-1.38l1.056-3.333A1 1 0 0 0 21 6H3a1 1 0 0 0-.958 1.287l1.056 3.334A2 2 0 0 0 5 12h3" />
      <path d="M18 6V3a1 1 0 0 0-1-1h-3" />
      <rect width="8" height="12" x="8" y="10" rx="1" />
    </>
  ),
  library: (
    <>
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </>
  ),
  'library-big': (
    <>
      <rect width="8" height="18" x="3" y="3" rx="1" />
      <path d="M7 3v18" />
      <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
    </>
  ),
  'life-buoy': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 4.24 4.24" />
      <path d="m14.83 9.17 4.24-4.24" />
      <path d="m14.83 14.83 4.24 4.24" />
      <path d="m9.17 14.83-4.24 4.24" />
      <circle cx="12" cy="12" r="4" />
    </>
  ),
  ligature: (
    <>
      <path d="M14 12h2v8" />
      <path d="M14 20h4" />
      <path d="M6 12h4" />
      <path d="M6 20h4" />
      <path d="M8 20V8a4 4 0 0 1 7.464-2" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  'lightbulb-off': (
    <>
      <path d="M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5" />
      <path d="m2 2 20 20" />
      <path d="M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  'line-squiggle': (
    <path d="M7 3.5c5-2 7 2.5 3 4C1.5 10 2 15 5 16c5 2 9-10 14-7s.5 13.5-4 12c-5-2.5.5-11 6-2" />
  ),
  'link-2-off': (
    <>
      <path d="M9 17H7A5 5 0 0 1 7 7" />
      <path d="M15 7h2a5 5 0 0 1 4 8" />
      <line x1="8" x2="12" y1="12" y2="12" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </>
  ),
  list: (
    <>
      <path d="M3 5h.01" />
      <path d="M3 12h.01" />
      <path d="M3 19h.01" />
      <path d="M8 5h13" />
      <path d="M8 12h13" />
      <path d="M8 19h13" />
    </>
  ),
  'list-check': (
    <>
      <path d="M16 5H3" />
      <path d="M16 12H3" />
      <path d="M11 19H3" />
      <path d="m15 18 2 2 4-4" />
    </>
  ),
  'list-checks': (
    <>
      <path d="M13 5h8" />
      <path d="M13 12h8" />
      <path d="M13 19h8" />
      <path d="m3 17 2 2 4-4" />
      <path d="m3 7 2 2 4-4" />
    </>
  ),
  'list-chevrons-down-up': (
    <>
      <path d="M3 5h8" />
      <path d="M3 12h8" />
      <path d="M3 19h8" />
      <path d="m15 5 3 3 3-3" />
      <path d="m15 19 3-3 3 3" />
    </>
  ),
  'list-chevrons-up-down': (
    <>
      <path d="M3 5h8" />
      <path d="M3 12h8" />
      <path d="M3 19h8" />
      <path d="m15 8 3-3 3 3" />
      <path d="m15 16 3 3 3-3" />
    </>
  ),
  'list-collapse': (
    <>
      <path d="M10 5h11" />
      <path d="M10 12h11" />
      <path d="M10 19h11" />
      <path d="m3 10 3-3-3-3" />
      <path d="m3 20 3-3-3-3" />
    </>
  ),
  'list-end': (
    <>
      <path d="M16 5H3" />
      <path d="M16 12H3" />
      <path d="M9 19H3" />
      <path d="m16 16-3 3 3 3" />
      <path d="M21 5v12a2 2 0 0 1-2 2h-6" />
    </>
  ),
  'list-filter': (
    <>
      <path d="M2 5h20" />
      <path d="M6 12h12" />
      <path d="M9 19h6" />
    </>
  ),
  'list-filter-plus': (
    <>
      <path d="M12 5H2" />
      <path d="M6 12h12" />
      <path d="M9 19h6" />
      <path d="M16 5h6" />
      <path d="M19 8V2" />
    </>
  ),
  'list-indent-decrease': (
    <>
      <path d="M21 5H11" />
      <path d="M21 12H11" />
      <path d="M21 19H11" />
      <path d="m7 8-4 4 4 4" />
    </>
  ),
  'list-indent-increase': (
    <>
      <path d="M21 5H11" />
      <path d="M21 12H11" />
      <path d="M21 19H11" />
      <path d="m3 8 4 4-4 4" />
    </>
  ),
  'list-minus': (
    <>
      <path d="M16 5H3" />
      <path d="M11 12H3" />
      <path d="M16 19H3" />
      <path d="M21 12h-6" />
    </>
  ),
  'list-ordered': (
    <>
      <path d="M11 5h10" />
      <path d="M11 12h10" />
      <path d="M11 19h10" />
      <path d="M4 4h1v5" />
      <path d="M4 9h2" />
      <path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
    </>
  ),
  'list-plus': (
    <>
      <path d="M16 5H3" />
      <path d="M11 12H3" />
      <path d="M16 19H3" />
      <path d="M18 9v6" />
      <path d="M21 12h-6" />
    </>
  ),
  'list-restart': (
    <>
      <path d="M21 5H3" />
      <path d="M7 12H3" />
      <path d="M7 19H3" />
      <path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" />
      <path d="M11 10v4h4" />
    </>
  ),
  'list-start': (
    <>
      <path d="M3 5h6" />
      <path d="M3 12h13" />
      <path d="M3 19h13" />
      <path d="m16 8-3-3 3-3" />
      <path d="M21 19V7a2 2 0 0 0-2-2h-6" />
    </>
  ),
  'list-todo': (
    <>
      <path d="M13 5h8" />
      <path d="M13 12h8" />
      <path d="M13 19h8" />
      <path d="m3 17 2 2 4-4" />
      <rect x="3" y="4" width="6" height="6" rx="1" />
    </>
  ),
  'list-tree': (
    <>
      <path d="M8 5h13" />
      <path d="M13 12h8" />
      <path d="M13 19h8" />
      <path d="M3 10a2 2 0 0 0 2 2h3" />
      <path d="M3 5v12a2 2 0 0 0 2 2h3" />
    </>
  ),
  'list-video': (
    <>
      <path d="M21 5H3" />
      <path d="M10 12H3" />
      <path d="M10 19H3" />
      <path d="M15 12.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" />
    </>
  ),
  'list-x': (
    <>
      <path d="M16 5H3" />
      <path d="M11 12H3" />
      <path d="M16 19H3" />
      <path d="m15.5 9.5 5 5" />
      <path d="m20.5 9.5-5 5" />
    </>
  ),
  loader: (
    <>
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </>
  ),
  'loader-circle': <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
  'loader-pinwheel': (
    <>
      <path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" />
      <path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
      <path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
  locate: (
    <>
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </>
  ),
  'locate-fixed': (
    <>
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'locate-off': (
    <>
      <path d="M12 19v3" />
      <path d="M12 2v3" />
      <path d="M18.89 13.24a7 7 0 0 0-8.13-8.13" />
      <path d="M19 12h3" />
      <path d="M2 12h3" />
      <path d="m2 2 20 20" />
      <path d="M7.05 7.05a7 7 0 0 0 9.9 9.9" />
    </>
  ),
  'lock-keyhole': (
    <>
      <circle cx="12" cy="16" r="1" />
      <rect x="3" y="10" width="18" height="12" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </>
  ),
  'lock-keyhole-open': (
    <>
      <circle cx="12" cy="16" r="1" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 9.33-2.5" />
    </>
  ),
  logs: (
    <>
      <path d="M3 5h1" />
      <path d="M3 12h1" />
      <path d="M3 19h1" />
      <path d="M8 5h1" />
      <path d="M8 12h1" />
      <path d="M8 19h1" />
      <path d="M13 5h8" />
      <path d="M13 12h8" />
      <path d="M13 19h8" />
    </>
  ),
  'm-square': (
    <>
      <path d="M8 16V8.5a.5.5 0 0 1 .9-.3l2.7 3.599a.5.5 0 0 0 .8 0l2.7-3.6a.5.5 0 0 1 .9.3V16" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'square-m': (
    <>
      <path d="M8 16V8.5a.5.5 0 0 1 .9-.3l2.7 3.599a.5.5 0 0 0 .8 0l2.7-3.6a.5.5 0 0 1 .9.3V16" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  magnet: (
    <>
      <path d="m12 15 4 4" />
      <path d="M2.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.029-6.029a1 1 0 1 1 3 3l-6.029 6.029a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.365-6.367A1 1 0 0 0 8.716 4.282z" />
      <path d="m5 8 4 4" />
    </>
  ),
  'mail-check': (
    <>
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="m16 19 2 2 4-4" />
    </>
  ),
  'mail-minus': (
    <>
      <path d="M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="M16 19h6" />
    </>
  ),
  'mail-open': (
    <>
      <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
    </>
  ),
  'mail-plus': (
    <>
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="M19 16v6" />
      <path d="M16 19h6" />
    </>
  ),
  'mail-question-mark': (
    <>
      <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" />
      <path d="M20 22v.01" />
    </>
  ),
  'mail-search': (
    <>
      <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <circle cx="18" cy="18" r="3" />
      <path d="m22 22-1.5-1.5" />
    </>
  ),
  'mail-warning': (
    <>
      <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="M20 14v4" />
      <path d="M20 22v.01" />
    </>
  ),
  'mail-x': (
    <>
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="m17 17 4 4" />
      <path d="m21 17-4 4" />
    </>
  ),
  mailbox: (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
      <polyline points="15,9 18,9 18,11" />
      <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" />
      <line x1="6" x2="7" y1="10" y2="10" />
    </>
  ),
  mails: (
    <>
      <path d="M17 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.732" />
      <path d="m22 5.5-6.419 4.179a2 2 0 0 1-2.162 0L7 5.5" />
      <rect x="7" y="3" width="15" height="12" rx="2" />
    </>
  ),
  'map-minus': (
    <>
      <path d="m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V14" />
      <path d="M15 5.764V14" />
      <path d="M21 18h-6" />
      <path d="M9 3.236v15" />
    </>
  ),
  'map-pin-check': (
    <>
      <path d="M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728" />
      <circle cx="12" cy="10" r="3" />
      <path d="m16 18 2 2 4-4" />
    </>
  ),
  'map-pin-check-inside': (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <path d="m9 10 2 2 4-4" />
    </>
  ),
  'map-pin-house': (
    <>
      <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z" />
      <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" />
      <path d="M18 22v-3" />
      <circle cx="10" cy="10" r="3" />
    </>
  ),
  'map-pin-minus': (
    <>
      <path d="M18.977 14C19.6 12.701 20 11.343 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738" />
      <circle cx="12" cy="10" r="3" />
      <path d="M16 18h6" />
    </>
  ),
  'map-pin-minus-inside': (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <path d="M9 10h6" />
    </>
  ),
  'map-pin-off': (
    <>
      <path d="M12.75 7.09a3 3 0 0 1 2.16 2.16" />
      <path d="M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568" />
      <path d="m2 2 20 20" />
      <path d="M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533" />
      <path d="M9.13 9.13a3 3 0 0 0 3.74 3.74" />
    </>
  ),
  'map-pin-pen': (
    <>
      <path d="M17.97 9.304A8 8 0 0 0 2 10c0 4.69 4.887 9.562 7.022 11.468" />
      <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
      <circle cx="10" cy="10" r="3" />
    </>
  ),
  'map-pin-plus': (
    <>
      <path d="M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738" />
      <circle cx="12" cy="10" r="3" />
      <path d="M16 18h6" />
      <path d="M19 15v6" />
    </>
  ),
  'map-pin-plus-inside': (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <path d="M12 7v6" />
      <path d="M9 10h6" />
    </>
  ),
  'map-pin-x': (
    <>
      <path d="M19.752 11.901A7.78 7.78 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 19 19 0 0 0 .09-.077" />
      <circle cx="12" cy="10" r="3" />
      <path d="m21.5 15.5-5 5" />
      <path d="m21.5 20.5-5-5" />
    </>
  ),
  'map-pin-x-inside': (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <path d="m14.5 7.5-5 5" />
      <path d="m9.5 7.5 5 5" />
    </>
  ),
  'map-pinned': (
    <>
      <path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0" />
      <circle cx="12" cy="8" r="2" />
      <path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712" />
    </>
  ),
  'map-plus': (
    <>
      <path d="m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V12" />
      <path d="M15 5.764V12" />
      <path d="M18 15v6" />
      <path d="M21 18h-6" />
      <path d="M9 3.236v15" />
    </>
  ),
  'megaphone-off': (
    <>
      <path d="M11.636 6A13 13 0 0 0 19.4 3.2 1 1 0 0 1 21 4v11.344" />
      <path d="M14.378 14.357A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1" />
      <path d="m2 2 20 20" />
      <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
      <path d="M8 8v6" />
    </>
  ),
  'memory-stick': (
    <>
      <path d="M6 19v-3" />
      <path d="M10 19v-3" />
      <path d="M14 19v-3" />
      <path d="M18 19v-3" />
      <path d="M8 11V9" />
      <path d="M16 11V9" />
      <path d="M12 11V9" />
      <path d="M2 15h20" />
      <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z" />
    </>
  ),
  merge: (
    <>
      <path d="m8 6 4-4 4 4" />
      <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
      <path d="m20 22-5-5" />
    </>
  ),
  'message-circle-code': (
    <>
      <path d="m10 9-3 3 3 3" />
      <path d="m14 15 3-3-3-3" />
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
    </>
  ),
  'message-circle-dashed': (
    <>
      <path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
      <path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
      <path d="M17.609 3.72a10 10 0 0 1 2.69 2.7" />
      <path d="M2.182 13.9a10 10 0 0 1 0-3.8" />
      <path d="M20.28 17.61a10 10 0 0 1-2.7 2.69" />
      <path d="M21.818 10.1a10 10 0 0 1 0 3.8" />
      <path d="M3.721 6.391a10 10 0 0 1 2.7-2.69" />
      <path d="m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98" />
    </>
  ),
  'message-circle-heart': (
    <>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z" />
    </>
  ),
  'message-circle-more': (
    <>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </>
  ),
  'message-circle-off': (
    <>
      <path d="m2 2 20 20" />
      <path d="M4.93 4.929a10 10 0 0 0-1.938 11.412 2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 0 0 11.302-1.989" />
      <path d="M8.35 2.69A10 10 0 0 1 21.3 15.65" />
    </>
  ),
  'message-circle-plus': (
    <>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </>
  ),
  'message-circle-question-mark': (
    <>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  'message-circle-reply': (
    <>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="m10 15-3-3 3-3" />
      <path d="M7 12h8a2 2 0 0 1 2 2v1" />
    </>
  ),
  'message-circle-warning': (
    <>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  'message-circle-x': (
    <>
      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
  'message-square-code': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="m10 8-3 3 3 3" />
      <path d="m14 14 3-3-3-3" />
    </>
  ),
  'message-square-dashed': (
    <>
      <path d="M12 19h.01" />
      <path d="M12 3h.01" />
      <path d="M16 19h.01" />
      <path d="M16 3h.01" />
      <path d="M2 13h.01" />
      <path d="M2 17v4.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H8" />
      <path d="M2 5a2 2 0 0 1 2-2" />
      <path d="M2 9h.01" />
      <path d="M20 3a2 2 0 0 1 2 2" />
      <path d="M22 13h.01" />
      <path d="M22 17a2 2 0 0 1-2 2" />
      <path d="M22 9h.01" />
      <path d="M8 3h.01" />
    </>
  ),
  'message-square-diff': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M10 15h4" />
      <path d="M10 9h4" />
      <path d="M12 7v4" />
    </>
  ),
  'message-square-dot': (
    <>
      <path d="M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7" />
      <circle cx="19" cy="6" r="3" />
    </>
  ),
  'message-square-heart': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M7.5 9.5c0 .687.265 1.383.697 1.844l3.009 3.264a1.14 1.14 0 0 0 .407.314 1 1 0 0 0 .783-.004 1.14 1.14 0 0 0 .398-.31l3.008-3.264A2.77 2.77 0 0 0 16.5 9.5 2.5 2.5 0 0 0 12 8a2.5 2.5 0 0 0-4.5 1.5" />
    </>
  ),
  'message-square-lock': (
    <>
      <path d="M22 8.5V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H10" />
      <path d="M20 15v-2a2 2 0 0 0-4 0v2" />
      <rect x="14" y="15" width="8" height="5" rx="1" />
    </>
  ),
  'message-square-more': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
      <path d="M8 11h.01" />
    </>
  ),
  'message-square-off': (
    <>
      <path d="M19 19H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 1.184-1.826" />
      <path d="m2 2 20 20" />
      <path d="M8.656 3H20a2 2 0 0 1 2 2v11.344" />
    </>
  ),
  'message-square-plus': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M12 8v6" />
      <path d="M9 11h6" />
    </>
  ),
  'message-square-quote': (
    <>
      <path d="M14 14a2 2 0 0 0 2-2V8h-2" />
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M8 14a2 2 0 0 0 2-2V8H8" />
    </>
  ),
  'message-square-reply': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="m10 8-3 3 3 3" />
      <path d="M17 14v-1a2 2 0 0 0-2-2H7" />
    </>
  ),
  'message-square-share': (
    <>
      <path d="M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4" />
      <path d="M16 3h6v6" />
      <path d="m16 9 6-6" />
    </>
  ),
  'message-square-text': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M7 11h10" />
      <path d="M7 15h6" />
      <path d="M7 7h8" />
    </>
  ),
  'message-square-warning': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="M12 15h.01" />
      <path d="M12 7v4" />
    </>
  ),
  'message-square-x': (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <path d="m14.5 8.5-5 5" />
      <path d="m9.5 8.5 5 5" />
    </>
  ),
  'messages-square': (
    <>
      <path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      <path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1" />
    </>
  ),
  microchip: (
    <>
      <path d="M18 12h2" />
      <path d="M18 16h2" />
      <path d="M18 20h2" />
      <path d="M18 4h2" />
      <path d="M18 8h2" />
      <path d="M4 12h2" />
      <path d="M4 16h2" />
      <path d="M4 20h2" />
      <path d="M4 4h2" />
      <path d="M4 8h2" />
      <path d="M8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1.5c-.276 0-.494.227-.562.495a2 2 0 0 1-3.876 0C9.994 2.227 9.776 2 9.5 2z" />
    </>
  ),
  milestone: (
    <>
      <path d="M12 13v8" />
      <path d="M12 3v3" />
      <path d="M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z" />
    </>
  ),
  'monitor-check': (
    <>
      <path d="m9 10 2 2 4-4" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </>
  ),
  'monitor-cog': (
    <>
      <path d="M12 17v4" />
      <path d="m14.305 7.53.923-.382" />
      <path d="m15.228 4.852-.923-.383" />
      <path d="m16.852 3.228-.383-.924" />
      <path d="m16.852 8.772-.383.923" />
      <path d="m19.148 3.228.383-.924" />
      <path d="m19.53 9.696-.382-.924" />
      <path d="m20.772 4.852.924-.383" />
      <path d="m20.772 7.148.924.383" />
      <path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
      <path d="M8 21h8" />
      <circle cx="18" cy="6" r="3" />
    </>
  ),
  'monitor-dot': (
    <>
      <path d="M12 17v4" />
      <path d="M22 12.307V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8.693" />
      <path d="M8 21h8" />
      <circle cx="19" cy="6" r="3" />
    </>
  ),
  'monitor-down': (
    <>
      <path d="M12 13V7" />
      <path d="m15 10-3 3-3-3" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </>
  ),
  'monitor-off': (
    <>
      <path d="M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2" />
      <path d="M22 15V5a2 2 0 0 0-2-2H9" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m2 2 20 20" />
    </>
  ),
  'monitor-pause': (
    <>
      <path d="M10 13V7" />
      <path d="M14 13V7" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </>
  ),
  'monitor-play': (
    <>
      <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <rect x="2" y="3" width="20" height="14" rx="2" />
    </>
  ),
  'monitor-smartphone': (
    <>
      <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
      <path d="M10 19v-3.96 3.15" />
      <path d="M7 19h5" />
      <rect width="6" height="10" x="16" y="12" rx="2" />
    </>
  ),
  'monitor-speaker': (
    <>
      <path d="M5.5 20H8" />
      <path d="M17 9h.01" />
      <rect width="10" height="16" x="12" y="4" rx="2" />
      <path d="M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4" />
      <circle cx="17" cy="15" r="1" />
    </>
  ),
  'monitor-stop': (
    <>
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <rect x="9" y="7" width="6" height="6" rx="1" />
    </>
  ),
  'monitor-up': (
    <>
      <path d="m9 10 3-3 3 3" />
      <path d="M12 13V7" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </>
  ),
  'monitor-x': (
    <>
      <path d="m14.5 12.5-5-5" />
      <path d="m9.5 12.5 5-5" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </>
  ),
  mouse: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="7" />
      <path d="M12 6v4" />
    </>
  ),
  'mouse-off': (
    <>
      <path d="M12 6v.343" />
      <path d="M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218" />
      <path d="M19 13.343V9A7 7 0 0 0 8.56 2.902" />
      <path d="M22 22 2 2" />
    </>
  ),
  'mouse-pointer': (
    <>
      <path d="M12.586 12.586 19 19" />
      <path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z" />
    </>
  ),
  'mouse-pointer-ban': (
    <>
      <path d="M2.034 2.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.944L8.204 7.545a1 1 0 0 0-.66.66l-1.066 3.443a.5.5 0 0 1-.944.033z" />
      <circle cx="16" cy="16" r="6" />
      <path d="m11.8 11.8 8.4 8.4" />
    </>
  ),
  'mouse-pointer-click': (
    <>
      <path d="M14 4.1 12 6" />
      <path d="m5.1 8-2.9-.8" />
      <path d="m6 12-1.9 2" />
      <path d="M7.2 2.2 8 5.1" />
      <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
    </>
  ),
  'move-3d': (
    <>
      <path d="M5 3v16h16" />
      <path d="m5 19 6-6" />
      <path d="m2 6 3-3 3 3" />
      <path d="m18 16 3 3-3 3" />
    </>
  ),
  'move-diagonal': (
    <>
      <path d="M11 19H5v-6" />
      <path d="M13 5h6v6" />
      <path d="M19 5 5 19" />
    </>
  ),
  'move-down': (
    <>
      <path d="M8 18L12 22L16 18" />
      <path d="M12 2V22" />
    </>
  ),
  'move-down-left': (
    <>
      <path d="M11 19H5V13" />
      <path d="M19 5L5 19" />
    </>
  ),
  'move-down-right': (
    <>
      <path d="M19 13V19H13" />
      <path d="M5 5L19 19" />
    </>
  ),
  'move-horizontal': (
    <>
      <path d="m18 8 4 4-4 4" />
      <path d="M2 12h20" />
      <path d="m6 8-4 4 4 4" />
    </>
  ),
  'move-left': (
    <>
      <path d="M6 8L2 12L6 16" />
      <path d="M2 12H22" />
    </>
  ),
  'move-right': (
    <>
      <path d="M18 8L22 12L18 16" />
      <path d="M2 12H22" />
    </>
  ),
  'move-up': (
    <>
      <path d="M8 6L12 2L16 6" />
      <path d="M12 2V22" />
    </>
  ),
  'move-up-left': (
    <>
      <path d="M5 11V5H11" />
      <path d="M5 5L19 19" />
    </>
  ),
  'move-up-right': (
    <>
      <path d="M13 5H19V11" />
      <path d="M19 5L5 19" />
    </>
  ),
  'move-vertical': (
    <>
      <path d="M12 2v20" />
      <path d="m8 18 4 4 4-4" />
      <path d="m8 6 4-4 4 4" />
    </>
  ),
  navigation: <polygon points="3 11 22 2 13 21 11 13 3 11" />,
  'navigation-2-off': (
    <>
      <path d="M9.31 9.31 5 21l7-4 7 4-1.17-3.17" />
      <path d="M14.53 8.88 12 2l-1.17 3.17" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </>
  ),
  'navigation-off': (
    <>
      <path d="M8.43 8.43 3 11l8 2 2 8 2.57-5.43" />
      <path d="M17.39 11.73 22 2l-9.73 4.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </>
  ),
  network: (
    <>
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </>
  ),
  newspaper: (
    <>
      <path d="M15 18h-5" />
      <path d="M18 14h-8" />
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
      <rect width="8" height="4" x="10" y="6" rx="1" />
    </>
  ),
  nfc: (
    <>
      <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
      <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
      <path d="M16.37 2a20.16 20.16 0 0 1 0 20" />
    </>
  ),
  notebook: (
    <>
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M16 2v20" />
    </>
  ),
  'notebook-pen': (
    <>
      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
    </>
  ),
  'notebook-tabs': (
    <>
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M15 2v20" />
      <path d="M15 7h5" />
      <path d="M15 12h5" />
      <path d="M15 17h5" />
    </>
  ),
  'notebook-text': (
    <>
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12H16" />
      <path d="M9.5 16H14" />
    </>
  ),
  'notepad-text': (
    <>
      <path d="M8 2v4" />
      <path d="M12 2v4" />
      <path d="M16 2v4" />
      <rect width="16" height="18" x="4" y="4" rx="2" />
      <path d="M8 10h6" />
      <path d="M8 14h8" />
      <path d="M8 18h5" />
    </>
  ),
  'notepad-text-dashed': (
    <>
      <path d="M8 2v4" />
      <path d="M12 2v4" />
      <path d="M16 2v4" />
      <path d="M16 4h2a2 2 0 0 1 2 2v2" />
      <path d="M20 12v2" />
      <path d="M20 18v2a2 2 0 0 1-2 2h-1" />
      <path d="M13 22h-2" />
      <path d="M7 22H6a2 2 0 0 1-2-2v-2" />
      <path d="M4 14v-2" />
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M8 10h6" />
      <path d="M8 14h8" />
      <path d="M8 18h5" />
    </>
  ),
  octagon: (
    <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" />
  ),
  'octagon-alert': (
    <>
      <path d="M12 16h.01" />
      <path d="M12 8v4" />
      <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
    </>
  ),
  'octagon-minus': (
    <>
      <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" />
      <path d="M8 12h8" />
    </>
  ),
  'octagon-pause': (
    <>
      <path d="M10 15V9" />
      <path d="M14 15V9" />
      <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" />
    </>
  ),
  'octagon-x': (
    <>
      <path d="m15 9-6 6" />
      <path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" />
      <path d="m9 9 6 6" />
    </>
  ),
  option: (
    <>
      <path d="M3 3h6l6 18h6" />
      <path d="M14 3h7" />
    </>
  ),
  'package-check': (
    <>
      <path d="m16 16 2 2 4-4" />
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="m7.5 4.27 9 5.15" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </>
  ),
  'package-minus': (
    <>
      <path d="M16 16h6" />
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="m7.5 4.27 9 5.15" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </>
  ),
  'package-open': (
    <>
      <path d="M12 22v-9" />
      <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
      <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
      <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
    </>
  ),
  'package-plus': (
    <>
      <path d="M16 16h6" />
      <path d="M19 13v6" />
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="m7.5 4.27 9 5.15" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </>
  ),
  'package-search': (
    <>
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="m7.5 4.27 9 5.15" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
      <circle cx="18.5" cy="15.5" r="2.5" />
      <path d="M20.27 17.27 22 19" />
    </>
  ),
  'package-x': (
    <>
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
      <path d="m7.5 4.27 9 5.15" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
      <path d="m17 13 5 5m-5 0 5-5" />
    </>
  ),
  'paint-bucket': (
    <>
      <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
      <path d="m5 2 5 5" />
      <path d="M2 13h15" />
      <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
    </>
  ),
  'paint-roller': (
    <>
      <rect width="16" height="6" x="2" y="2" rx="2" />
      <path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect width="4" height="6" x="8" y="16" rx="1" />
    </>
  ),
  paintbrush: (
    <>
      <path d="m14.622 17.897-10.68-2.913" />
      <path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" />
      <path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" />
    </>
  ),
  'paintbrush-vertical': (
    <>
      <path d="M10 2v2" />
      <path d="M14 2v4" />
      <path d="M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z" />
      <path d="M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1" />
    </>
  ),
  'panel-bottom': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 15h18" />
    </>
  ),
  'panel-bottom-close': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 15h18" />
      <path d="m15 8-3 3-3-3" />
    </>
  ),
  'panel-bottom-dashed': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M14 15h1" />
      <path d="M19 15h2" />
      <path d="M3 15h2" />
      <path d="M9 15h1" />
    </>
  ),
  'panel-bottom-open': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 15h18" />
      <path d="m9 10 3-3 3 3" />
    </>
  ),
  'panel-left-close': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </>
  ),
  'panel-left-dashed': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 14v1" />
      <path d="M9 19v2" />
      <path d="M9 3v2" />
      <path d="M9 9v1" />
    </>
  ),
  'panel-left-open': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </>
  ),
  'panel-left-right-dashed': (
    <>
      <path d="M15 10V9" />
      <path d="M15 15v-1" />
      <path d="M15 21v-2" />
      <path d="M15 5V3" />
      <path d="M9 10V9" />
      <path d="M9 15v-1" />
      <path d="M9 21v-2" />
      <path d="M9 5V3" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'panel-right-close': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 3v18" />
      <path d="m8 9 3 3-3 3" />
    </>
  ),
  'panel-right-dashed': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 14v1" />
      <path d="M15 19v2" />
      <path d="M15 3v2" />
      <path d="M15 9v1" />
    </>
  ),
  'panel-right-open': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M15 3v18" />
      <path d="m10 15-3-3 3-3" />
    </>
  ),
  'panel-top': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  'panel-top-bottom-dashed': (
    <>
      <path d="M14 15h1" />
      <path d="M14 9h1" />
      <path d="M19 15h2" />
      <path d="M19 9h2" />
      <path d="M3 15h2" />
      <path d="M3 9h2" />
      <path d="M9 15h1" />
      <path d="M9 9h1" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'panel-top-close': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="m9 16 3-3 3 3" />
    </>
  ),
  'panel-top-dashed': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M14 9h1" />
      <path d="M19 9h2" />
      <path d="M3 9h2" />
      <path d="M9 9h1" />
    </>
  ),
  'panel-top-open': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="m15 14-3 3-3-3" />
    </>
  ),
  'panels-left-bottom': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="M9 15h12" />
    </>
  ),
  'panels-right-bottom': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 15h12" />
      <path d="M15 3v18" />
    </>
  ),
  'panels-top-left': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </>
  ),
  parentheses: (
    <>
      <path d="M8 21s-4-3-4-9 4-9 4-9" />
      <path d="M16 3s4 3 4 9-4 9-4 9" />
    </>
  ),
  'parking-meter': (
    <>
      <path d="M11 15h2" />
      <path d="M12 12v3" />
      <path d="M12 19v3" />
      <path d="M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z" />
      <path d="M9 9a3 3 0 1 1 6 0" />
    </>
  ),
  'parking-square': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  'square-parking': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  'parking-square-off': (
    <>
      <path d="M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41" />
      <path d="M3 8.7V19a2 2 0 0 0 2 2h10.3" />
      <path d="m2 2 20 20" />
      <path d="M13 13a3 3 0 1 0 0-6H9v2" />
      <path d="M9 17v-2.3" />
    </>
  ),
  'square-parking-off': (
    <>
      <path d="M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41" />
      <path d="M3 8.7V19a2 2 0 0 0 2 2h10.3" />
      <path d="m2 2 20 20" />
      <path d="M13 13a3 3 0 1 0 0-6H9v2" />
      <path d="M9 17v-2.3" />
    </>
  ),
  'pc-case': (
    <>
      <rect width="14" height="20" x="5" y="2" rx="2" />
      <path d="M15 14h.01" />
      <path d="M9 6h6" />
      <path d="M9 10h6" />
    </>
  ),
  pen: (
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
  ),
  'pen-line': (
    <>
      <path d="M13 21h8" />
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </>
  ),
  'pen-off': (
    <>
      <path d="m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982" />
      <path d="m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" />
      <path d="m2 2 20 20" />
    </>
  ),
  'pen-tool': (
    <>
      <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
      <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
      <path d="m2.3 2.3 7.286 7.286" />
      <circle cx="11" cy="11" r="2" />
    </>
  ),
  pencil: (
    <>
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </>
  ),
  'pencil-line': (
    <>
      <path d="M13 21h8" />
      <path d="m15 5 4 4" />
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    </>
  ),
  'pencil-off': (
    <>
      <path d="m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982" />
      <path d="m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" />
      <path d="m15 5 4 4" />
      <path d="m2 2 20 20" />
    </>
  ),
  'pencil-ruler': (
    <>
      <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" />
      <path d="m8 6 2-2" />
      <path d="m18 16 2-2" />
      <path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17" />
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </>
  ),
  pentagon: (
    <path d="M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z" />
  ),
  'person-standing': (
    <>
      <circle cx="12" cy="5" r="1" />
      <path d="m9 20 3-6 3 6" />
      <path d="m6 8 6 2 6-2" />
      <path d="M12 10v4" />
    </>
  ),
  'philippine-peso': (
    <>
      <path d="M20 11H4" />
      <path d="M20 7H4" />
      <path d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" />
    </>
  ),
  'phone-call': (
    <>
      <path d="M13 2a9 9 0 0 1 9 9" />
      <path d="M13 6a5 5 0 0 1 5 5" />
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </>
  ),
  'phone-forwarded': (
    <>
      <path d="M14 6h8" />
      <path d="m18 2 4 4-4 4" />
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </>
  ),
  'phone-incoming': (
    <>
      <path d="M16 2v6h6" />
      <path d="m22 2-6 6" />
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </>
  ),
  'phone-missed': (
    <>
      <path d="m16 2 6 6" />
      <path d="m22 2-6 6" />
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </>
  ),
  'phone-off': (
    <>
      <path d="M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272" />
      <path d="M22 2 2 22" />
      <path d="M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473" />
    </>
  ),
  'phone-outgoing': (
    <>
      <path d="m16 8 6-6" />
      <path d="M22 8V2h-6" />
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    </>
  ),
  pi: (
    <>
      <line x1="9" x2="9" y1="4" y2="20" />
      <path d="M4 7c0-1.7 1.3-3 3-3h13" />
      <path d="M18 20c-1.7 0-3-1.3-3-3V4" />
    </>
  ),
  'picture-in-picture': (
    <>
      <path d="M2 10h6V4" />
      <path d="m2 4 6 6" />
      <path d="M21 10V7a2 2 0 0 0-2-2h-7" />
      <path d="M3 14v2a2 2 0 0 0 2 2h3" />
      <rect x="12" y="14" width="10" height="7" rx="1" />
    </>
  ),
  'piggy-bank': (
    <>
      <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" />
      <path d="M16 10h.01" />
      <path d="M2 8v1a2 2 0 0 0 2 2h1" />
    </>
  ),
  pilcrow: (
    <>
      <path d="M13 4v16" />
      <path d="M17 4v16" />
      <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />
    </>
  ),
  'pilcrow-left': (
    <>
      <path d="M14 3v11" />
      <path d="M14 9h-3a3 3 0 0 1 0-6h9" />
      <path d="M18 3v11" />
      <path d="M22 18H2l4-4" />
      <path d="m6 22-4-4" />
    </>
  ),
  'pilcrow-right': (
    <>
      <path d="M10 3v11" />
      <path d="M10 9H7a1 1 0 0 1 0-6h8" />
      <path d="M14 3v11" />
      <path d="m18 14 4 4H2" />
      <path d="m22 18-4 4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </>
  ),
  'pin-off': (
    <>
      <path d="M12 17v5" />
      <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" />
      <path d="m2 2 20 20" />
      <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" />
    </>
  ),
  plane: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  ),
  'plane-landing': (
    <>
      <path d="M2 22h20" />
      <path d="M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z" />
    </>
  ),
  'plane-takeoff': (
    <>
      <path d="M2 22h20" />
      <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
    </>
  ),
  plug: (
    <>
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </>
  ),
  'plug-zap': (
    <>
      <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
      <path d="m2 22 3-3" />
      <path d="M7.5 13.5 10 11" />
      <path d="M10.5 16.5 13 14" />
      <path d="m18 3-4 4h6l-4 4" />
    </>
  ),
  pocket: (
    <>
      <path d="M20 3a2 2 0 0 1 2 2v6a1 1 0 0 1-20 0V5a2 2 0 0 1 2-2z" />
      <path d="m8 10 4 4 4-4" />
    </>
  ),
  'pocket-knife': (
    <>
      <path d="M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2" />
      <path d="M18 6h.01" />
      <path d="M6 18h.01" />
      <path d="M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z" />
      <path d="M18 11.66V22a4 4 0 0 0 4-4V6" />
    </>
  ),
  podcast: (
    <>
      <path d="M13 17a1 1 0 1 0-2 0l.5 4.5a0.5 0.5 0 0 0 1 0z" fill="currentColor" />
      <path d="M16.85 18.58a9 9 0 1 0-9.7 0" />
      <path d="M8 14a5 5 0 1 1 8 0" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
    </>
  ),
  pointer: (
    <>
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
      <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </>
  ),
  'pointer-off': (
    <>
      <path d="M10 4.5V4a2 2 0 0 0-2.41-1.957" />
      <path d="M13.9 8.4a2 2 0 0 0-1.26-1.295" />
      <path d="M21.7 16.2A8 8 0 0 0 22 14v-3a2 2 0 1 0-4 0v-1a2 2 0 0 0-3.63-1.158" />
      <path d="m7 15-1.8-1.8a2 2 0 0 0-2.79 2.86L6 19.7a7.74 7.74 0 0 0 6 2.3h2a8 8 0 0 0 5.657-2.343" />
      <path d="M6 6v8" />
      <path d="m2 2 20 20" />
    </>
  ),
  'pound-sterling': (
    <>
      <path d="M18 7c0-5.333-8-5.333-8 0" />
      <path d="M10 7v14" />
      <path d="M6 21h12" />
      <path d="M6 13h10" />
    </>
  ),
  power: (
    <>
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </>
  ),
  'power-off': (
    <>
      <path d="M18.36 6.64A9 9 0 0 1 20.77 15" />
      <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68" />
      <path d="M12 2v4" />
      <path d="m2 2 20 20" />
    </>
  ),
  presentation: (
    <>
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </>
  ),
  printer: (
    <>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </>
  ),
  'printer-check': (
    <>
      <path d="M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5" />
      <path d="m16 19 2 2 4-4" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
      <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
    </>
  ),
  projector: (
    <>
      <path d="M5 7 3 5" />
      <path d="M9 6V3" />
      <path d="m13 7 2-2" />
      <circle cx="9" cy="13" r="3" />
      <path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17" />
      <path d="M16 16h2" />
    </>
  ),
  proportions: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M12 9v11" />
      <path d="M2 9h13a2 2 0 0 1 2 2v9" />
    </>
  ),
  pyramid: (
    <>
      <path d="M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z" />
      <path d="M12 2v20" />
    </>
  ),
  'qr-code': (
    <>
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </>
  ),
  quote: (
    <>
      <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
      <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
    </>
  ),
  radar: (
    <>
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" />
      <path d="M4 6h.01" />
      <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" />
      <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" />
      <path d="M12 18h.01" />
      <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" />
      <circle cx="12" cy="12" r="2" />
      <path d="m13.41 10.59 5.66-5.66" />
    </>
  ),
  radical: (
    <path d="M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21" />
  ),
  'radio-tower': (
    <>
      <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" />
      <path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" />
      <circle cx="12" cy="9" r="2" />
      <path d="M16.2 4.8c2 2 2.26 5.11.8 7.47" />
      <path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1" />
      <path d="M9.5 18h5" />
      <path d="m8 22 4-11 4 11" />
    </>
  ),
  radius: (
    <>
      <path d="M20.34 17.52a10 10 0 1 0-2.82 2.82" />
      <circle cx="19" cy="19" r="2" />
      <path d="m13.41 13.41 4.18 4.18" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  'rail-symbol': (
    <>
      <path d="M5 15h14" />
      <path d="M5 9h14" />
      <path d="m14 20-5-5 6-6-5-5" />
    </>
  ),
  ratio: (
    <>
      <rect width="12" height="20" x="6" y="2" rx="2" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </>
  ),
  'receipt-cent': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M12 6.5v11" />
      <path d="M15 9.4a4 4 0 1 0 0 5.2" />
    </>
  ),
  'receipt-euro': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 12h5" />
      <path d="M16 9.5a4 4 0 1 0 0 5.2" />
    </>
  ),
  'receipt-indian-rupee': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 7h8" />
      <path d="M12 17.5 8 15h1a4 4 0 0 0 0-8" />
      <path d="M8 11h8" />
    </>
  ),
  'receipt-japanese-yen': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="m12 10 3-3" />
      <path d="m9 7 3 3v7.5" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </>
  ),
  'receipt-pound-sterling': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 13h5" />
      <path d="M10 17V9.5a2.5 2.5 0 0 1 5 0" />
      <path d="M8 17h7" />
    </>
  ),
  'receipt-russian-ruble': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 15h5" />
      <path d="M8 11h5a2 2 0 1 0 0-4h-3v10" />
    </>
  ),
  'receipt-swiss-franc': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M10 17V7h5" />
      <path d="M10 11h4" />
      <path d="M8 15h5" />
    </>
  ),
  'receipt-text': (
    <>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M14 8H8" />
      <path d="M16 12H8" />
      <path d="M13 16H8" />
    </>
  ),
  'receipt-turkish-lira': (
    <>
      <path d="M10 6.5v11a5.5 5.5 0 0 0 5.5-5.5" />
      <path d="m14 8-6 3" />
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
    </>
  ),
  'rectangle-circle': (
    <>
      <path d="M14 4v16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <circle cx="14" cy="12" r="8" />
    </>
  ),
  'rectangle-ellipsis': (
    <>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <path d="M12 12h.01" />
      <path d="M17 12h.01" />
      <path d="M7 12h.01" />
    </>
  ),
  'rectangle-horizontal': <rect width="20" height="12" x="2" y="6" rx="2" />,
  'rectangle-vertical': <rect width="12" height="20" x="6" y="2" rx="2" />,
  recycle: (
    <>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </>
  ),
  'redo-dot': (
    <>
      <circle cx="12" cy="17" r="1" />
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </>
  ),
  'refresh-ccw': (
    <>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </>
  ),
  'refresh-ccw-dot': (
    <>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  'refresh-cw': (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  'refresh-cw-off': (
    <>
      <path d="M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47" />
      <path d="M8 16H3v5" />
      <path d="M3 12C3 9.51 4 7.26 5.64 5.64" />
      <path d="m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64" />
      <path d="M21 12c0 1-.16 1.97-.47 2.87" />
      <path d="M21 3v5h-5" />
      <path d="M22 22 2 2" />
    </>
  ),
  regex: (
    <>
      <path d="M17 3v10" />
      <path d="m12.67 5.5 8.66 5" />
      <path d="m12.67 10.5 8.66-5" />
      <path d="M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z" />
    </>
  ),
  'remove-formatting': (
    <>
      <path d="M4 7V4h16v3" />
      <path d="M5 20h6" />
      <path d="M13 4 8 20" />
      <path d="m15 15 5 5" />
      <path d="m20 15-5 5" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  replace: (
    <>
      <path d="M14 4a1 1 0 0 1 1-1" />
      <path d="M15 10a1 1 0 0 1-1-1" />
      <path d="M21 4a1 1 0 0 0-1-1" />
      <path d="M21 9a1 1 0 0 1-1 1" />
      <path d="m3 7 3 3 3-3" />
      <path d="M6 10V5a2 2 0 0 1 2-2h2" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  'replace-all': (
    <>
      <path d="M14 14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" />
      <path d="M14 4a1 1 0 0 1 1-1" />
      <path d="M15 10a1 1 0 0 1-1-1" />
      <path d="M19 14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" />
      <path d="M21 4a1 1 0 0 0-1-1" />
      <path d="M21 9a1 1 0 0 1-1 1" />
      <path d="m3 7 3 3 3-3" />
      <path d="M6 10V5a2 2 0 0 1 2-2h2" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  reply: (
    <>
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
      <path d="m9 17-5-5 5-5" />
    </>
  ),
  'reply-all': (
    <>
      <path d="m12 17-5-5 5-5" />
      <path d="M22 18v-2a4 4 0 0 0-4-4H7" />
      <path d="m7 17-5-5 5-5" />
    </>
  ),
  rewind: (
    <>
      <path d="M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z" />
      <path d="M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z" />
    </>
  ),
  'rotate-3d': (
    <>
      <path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2" />
      <path d="m15.194 13.707 3.814 1.86-1.86 3.814" />
      <path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4" />
    </>
  ),
  'rotate-ccw': (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </>
  ),
  'rotate-ccw-key': (
    <>
      <path d="m14.5 9.5 1 1" />
      <path d="m15.5 8.5-4 4" />
      <path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <circle cx="10" cy="14" r="2" />
    </>
  ),
  'rotate-ccw-square': (
    <>
      <path d="M20 9V7a2 2 0 0 0-2-2h-6" />
      <path d="m15 2-3 3 3 3" />
      <path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
    </>
  ),
  'rotate-cw': (
    <>
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </>
  ),
  'rotate-cw-square': (
    <>
      <path d="M12 5H6a2 2 0 0 0-2 2v3" />
      <path d="m9 8 3-3-3-3" />
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </>
  ),
  'route-off': (
    <>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5c.4 0 .9-.1 1.3-.2" />
      <path d="M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12" />
      <path d="m2 2 20 20" />
      <path d="M21 15.3a3.5 3.5 0 0 0-3.3-3.3" />
      <path d="M15 5h-4.3" />
      <circle cx="18" cy="5" r="3" />
    </>
  ),
  router: (
    <>
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6.01 18H6" />
      <path d="M10.01 18H10" />
      <path d="M15 10v4" />
      <path d="M17.84 7.17a4 4 0 0 0-5.66 0" />
      <path d="M20.66 4.34a8 8 0 0 0-11.31 0" />
    </>
  ),
  rss: (
    <>
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </>
  ),
  ruler: (
    <>
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
      <path d="m17.5 15.5 2-2" />
    </>
  ),
  'ruler-dimension-line': (
    <>
      <path d="M12 15v-3.014" />
      <path d="M16 15v-3.014" />
      <path d="M20 6H4" />
      <path d="M20 8V4" />
      <path d="M4 8V4" />
      <path d="M8 15v-3.014" />
      <rect x="3" y="12" width="18" height="7" rx="1" />
    </>
  ),
  'russian-ruble': (
    <>
      <path d="M6 11h8a4 4 0 0 0 0-8H9v18" />
      <path d="M6 15h8" />
    </>
  ),
  'satellite-dish': (
    <>
      <path d="M4 10a7.31 7.31 0 0 0 10 10Z" />
      <path d="m9 15 3-3" />
      <path d="M17 13a6 6 0 0 0-6-6" />
      <path d="M21 13A10 10 0 0 0 11 3" />
    </>
  ),
  'saudi-riyal': (
    <>
      <path d="m20 19.5-5.5 1.2" />
      <path d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" />
      <path d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" />
      <path d="M20 10 4 13.5" />
    </>
  ),
  'save-all': (
    <>
      <path d="M10 2v3a1 1 0 0 0 1 1h5" />
      <path d="M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6" />
      <path d="M18 22H4a2 2 0 0 1-2-2V6" />
      <path d="M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z" />
    </>
  ),
  'save-off': (
    <>
      <path d="M13 13H8a1 1 0 0 0-1 1v7" />
      <path d="M14 8h1" />
      <path d="M17 21v-4" />
      <path d="m2 2 20 20" />
      <path d="M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41" />
      <path d="M29.5 11.5s5 5 4 5" />
      <path d="M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15" />
    </>
  ),
  scale: (
    <>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </>
  ),
  'scale-3d': (
    <>
      <path d="M5 7v11a1 1 0 0 0 1 1h11" />
      <path d="M5.293 18.707 11 13" />
      <circle cx="19" cy="19" r="2" />
      <circle cx="5" cy="5" r="2" />
    </>
  ),
  scaling: (
    <>
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M14 15H9v-5" />
      <path d="M16 3h5v5" />
      <path d="M21 3 9 15" />
    </>
  ),
  scan: (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </>
  ),
  'scan-barcode': (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M8 7v10" />
      <path d="M12 7v10" />
      <path d="M17 7v10" />
    </>
  ),
  'scan-eye': (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="1" />
      <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
    </>
  ),
  'scan-face': (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </>
  ),
  'scan-line': (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </>
  ),
  'scan-qr-code': (
    <>
      <path d="M17 12v4a1 1 0 0 1-1 1h-4" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M17 8V7" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M7 17h.01" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="5" height="5" rx="1" />
    </>
  ),
  'scan-search': (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
      <path d="m16 16-1.9-1.9" />
    </>
  ),
  'scan-text': (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 8h8" />
      <path d="M7 12h10" />
      <path d="M7 16h6" />
    </>
  ),
  school: (
    <>
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="M18 5v16" />
      <path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" />
      <path d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11" />
      <path d="M6 5v16" />
      <circle cx="12" cy="9" r="2" />
    </>
  ),
  'scissors-line-dashed': (
    <>
      <path d="M5.42 9.42 8 12" />
      <circle cx="4" cy="8" r="2" />
      <path d="m14 6-8.58 8.58" />
      <circle cx="4" cy="16" r="2" />
      <path d="M10.8 14.8 14 18" />
      <path d="M16 12h-2" />
      <path d="M22 12h-2" />
    </>
  ),
  'screen-share': (
    <>
      <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m17 8 5-5" />
      <path d="M17 3h5v5" />
    </>
  ),
  'screen-share-off': (
    <>
      <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m22 3-5 5" />
      <path d="m17 3 5 5" />
    </>
  ),
  scroll: (
    <>
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
    </>
  ),
  'scroll-text': (
    <>
      <path d="M15 12h-5" />
      <path d="M15 8h-5" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
    </>
  ),
  'search-check': (
    <>
      <path d="m8 11 2 2 4-4" />
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  'search-code': (
    <>
      <path d="m13 13.5 2-2.5-2-2.5" />
      <path d="m21 21-4.3-4.3" />
      <path d="M9 8.5 7 11l2 2.5" />
      <circle cx="11" cy="11" r="8" />
    </>
  ),
  'search-slash': (
    <>
      <path d="m13.5 8.5-5 5" />
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  'search-x': (
    <>
      <path d="m13.5 8.5-5 5" />
      <path d="m8.5 8.5 5 5" />
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  section: (
    <>
      <path d="M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0" />
      <path d="M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0" />
    </>
  ),
  'send-horizontal': (
    <>
      <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
      <path d="M6 12h16" />
    </>
  ),
  'send-to-back': (
    <>
      <rect x="14" y="14" width="8" height="8" rx="2" />
      <rect x="2" y="2" width="8" height="8" rx="2" />
      <path d="M7 14v1a2 2 0 0 0 2 2h1" />
      <path d="M14 7h1a2 2 0 0 1 2 2v1" />
    </>
  ),
  'separator-horizontal': (
    <>
      <path d="m16 16-4 4-4-4" />
      <path d="M3 12h18" />
      <path d="m8 8 4-4 4 4" />
    </>
  ),
  'separator-vertical': (
    <>
      <path d="M12 3v18" />
      <path d="m16 16 4-4-4-4" />
      <path d="m8 8-4 4 4 4" />
    </>
  ),
  'server-cog': (
    <>
      <path d="m10.852 14.772-.383.923" />
      <path d="M13.148 14.772a3 3 0 1 0-2.296-5.544l-.383-.923" />
      <path d="m13.148 9.228.383-.923" />
      <path d="m13.53 15.696-.382-.924a3 3 0 1 1-2.296-5.544" />
      <path d="m14.772 10.852.923-.383" />
      <path d="m14.772 13.148.923.383" />
      <path d="M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5" />
      <path d="M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5" />
      <path d="M6 18h.01" />
      <path d="M6 6h.01" />
      <path d="m9.228 10.852-.923-.383" />
      <path d="m9.228 13.148-.923.383" />
    </>
  ),
  'server-crash': (
    <>
      <path d="M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <path d="M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
      <path d="M6 6h.01" />
      <path d="M6 18h.01" />
      <path d="m13 6-4 6h6l-4 6" />
    </>
  ),
  'server-off': (
    <>
      <path d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
      <path d="M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z" />
      <path d="M22 17v-1a2 2 0 0 0-2-2h-1" />
      <path d="M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z" />
      <path d="M6 18h.01" />
      <path d="m2 2 20 20" />
    </>
  ),
  shapes: (
    <>
      <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <circle cx="17.5" cy="17.5" r="3.5" />
    </>
  ),
  sheet: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="3" x2="21" y1="15" y2="15" />
      <line x1="9" x2="9" y1="9" y2="21" />
      <line x1="15" x2="15" y1="9" y2="21" />
    </>
  ),
  'shield-ban': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m4.243 5.21 14.39 12.472" />
    </>
  ),
  'shield-ellipsis': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M8 12h.01" />
      <path d="M12 12h.01" />
      <path d="M16 12h.01" />
    </>
  ),
  'shield-half': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 22V2" />
    </>
  ),
  'shield-minus': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M9 12h6" />
    </>
  ),
  'shield-off': (
    <>
      <path d="m2 2 20 20" />
      <path d="M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71" />
      <path d="M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264" />
    </>
  ),
  'shield-plus': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </>
  ),
  'shield-question-mark': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  'shield-user': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M6.376 18.91a6 6 0 0 1 11.249.003" />
      <circle cx="12" cy="11" r="4" />
    </>
  ),
  'shield-x': (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m14.5 9.5-5 5" />
      <path d="m9.5 9.5 5 5" />
    </>
  ),
  ship: (
    <>
      <path d="M12 10.189V14" />
      <path d="M12 2v3" />
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76" />
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </>
  ),
  shirt: (
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  ),
  'shopping-basket': (
    <>
      <path d="m15 11-1 9" />
      <path d="m19 11-4-7" />
      <path d="M2 11h20" />
      <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
      <path d="M4.5 15.5h15" />
      <path d="m5 11 4-7" />
      <path d="m9 11 1 9" />
    </>
  ),
  shredder: (
    <>
      <path d="M10 22v-5" />
      <path d="M14 19v-2" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M18 20v-3" />
      <path d="M2 13h20" />
      <path d="M20 13V7l-5-5H6a2 2 0 0 0-2 2v9" />
      <path d="M6 20v-3" />
    </>
  ),
  shuffle: (
    <>
      <path d="m18 14 4 4-4 4" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
      <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
      <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
    </>
  ),
  signal: (
    <>
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </>
  ),
  'signal-high': (
    <>
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
    </>
  ),
  'signal-low': (
    <>
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
    </>
  ),
  'signal-medium': (
    <>
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
    </>
  ),
  'signal-zero': <path d="M2 20h.01" />,
  signature: (
    <>
      <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284" />
      <path d="M3 21h18" />
    </>
  ),
  signpost: (
    <>
      <path d="M12 13v8" />
      <path d="M12 3v3" />
      <path d="M18 6a2 2 0 0 1 1.387.56l2.307 2.22a1 1 0 0 1 0 1.44l-2.307 2.22A2 2 0 0 1 18 13H6a2 2 0 0 1-1.387-.56l-2.306-2.22a1 1 0 0 1 0-1.44l2.306-2.22A2 2 0 0 1 6 6z" />
    </>
  ),
  'signpost-big': (
    <>
      <path d="M10 9H4L2 7l2-2h6" />
      <path d="M14 5h6l2 2-2 2h-6" />
      <path d="M10 22V4a2 2 0 1 1 4 0v18" />
      <path d="M8 22h8" />
    </>
  ),
  siren: (
    <>
      <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
      <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
      <path d="M21 12h1" />
      <path d="M18.5 4.5 18 5" />
      <path d="M2 12h1" />
      <path d="M12 2v1" />
      <path d="m4.929 4.929.707.707" />
      <path d="M12 12v6" />
    </>
  ),
  'skip-back': (
    <>
      <path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" />
      <path d="M3 20V4" />
    </>
  ),
  'skip-forward': (
    <>
      <path d="M21 4v16" />
      <path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" />
    </>
  ),
  slash: <path d="M22 2 2 22" />,
  slice: (
    <path d="M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14" />
  ),
  'sliders-vertical': (
    <>
      <path d="M10 8h4" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M17 16h4" />
      <path d="M19 12V3" />
      <path d="M19 21v-5" />
      <path d="M3 14h4" />
      <path d="M5 10V3" />
      <path d="M5 21v-7" />
    </>
  ),
  'smartphone-charging': (
    <>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12.667 8 10 12h4l-2.667 4" />
    </>
  ),
  'smartphone-nfc': (
    <>
      <rect width="7" height="12" x="2" y="6" rx="1" />
      <path d="M13 8.32a7.43 7.43 0 0 1 0 7.36" />
      <path d="M16.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M19.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
    </>
  ),
  space: <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />,
  sparkle: (
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
  ),
  speaker: (
    <>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M12 6h.01" />
      <circle cx="12" cy="14" r="4" />
      <path d="M12 14h.01" />
    </>
  ),
  speech: (
    <>
      <path d="M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20" />
      <path d="M19.8 17.8a7.5 7.5 0 0 0 .003-10.603" />
      <path d="M17 15a3.5 3.5 0 0 0-.025-4.975" />
    </>
  ),
  'spell-check': (
    <>
      <path d="m6 16 6-12 6 12" />
      <path d="M8 12h8" />
      <path d="m16 20 2 2 4-4" />
    </>
  ),
  spline: (
    <>
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <path d="M5 17A12 12 0 0 1 17 5" />
    </>
  ),
  'spline-pointer': (
    <>
      <path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" />
      <path d="M5 17A12 12 0 0 1 17 5" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
    </>
  ),
  split: (
    <>
      <path d="M16 3h5v5" />
      <path d="M8 3H3v5" />
      <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
      <path d="m15 9 6-6" />
    </>
  ),
  spool: (
    <>
      <path d="M17 13.44 4.442 17.082A2 2 0 0 0 4.982 21H19a2 2 0 0 0 .558-3.921l-1.115-.32A2 2 0 0 1 17 14.837V7.66" />
      <path d="m7 10.56 12.558-3.642A2 2 0 0 0 19.018 3H5a2 2 0 0 0-.558 3.921l1.115.32A2 2 0 0 1 7 9.163v7.178" />
    </>
  ),
  spotlight: (
    <>
      <path d="M15.295 19.562 16 22" />
      <path d="m17 16 3.758 2.098" />
      <path d="m19 12.5 3.026-.598" />
      <path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z" />
      <path d="M8 9V2" />
    </>
  ),
  'spray-can': (
    <>
      <path d="M3 3h.01" />
      <path d="M7 5h.01" />
      <path d="M11 7h.01" />
      <path d="M3 7h.01" />
      <path d="M7 9h.01" />
      <path d="M3 11h.01" />
      <rect width="4" height="4" x="15" y="5" />
      <path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" />
      <path d="m13 14 8-2" />
      <path d="m13 19 8-2" />
    </>
  ),
  square: <rect width="18" height="18" x="3" y="3" rx="2" />,
  'square-activity': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M17 12h-2l-2 5-2-10-2 5H7" />
    </>
  ),
  'square-arrow-left': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m12 8-4 4 4 4" />
      <path d="M16 12H8" />
    </>
  ),
  'square-arrow-out-down-left': (
    <>
      <path d="M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6" />
      <path d="m3 21 9-9" />
      <path d="M9 21H3v-6" />
    </>
  ),
  'square-arrow-out-down-right': (
    <>
      <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <path d="m21 21-9-9" />
      <path d="M21 15v6h-6" />
    </>
  ),
  'square-arrow-out-up-left': (
    <>
      <path d="M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" />
      <path d="m3 3 9 9" />
      <path d="M3 9V3h6" />
    </>
  ),
  'square-arrow-out-up-right': (
    <>
      <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
      <path d="m21 3-9 9" />
      <path d="M15 3h6v6" />
    </>
  ),
  'square-arrow-right': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 12h8" />
      <path d="m12 16 4-4-4-4" />
    </>
  ),
  'square-arrow-up': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m16 12-4-4-4 4" />
      <path d="M12 16V8" />
    </>
  ),
  'square-arrow-up-left': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 16V8h8" />
      <path d="M16 16 8 8" />
    </>
  ),
  'square-arrow-up-right': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 8h8v8" />
      <path d="m8 16 8-8" />
    </>
  ),
  'square-asterisk': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 8v8" />
      <path d="m8.5 14 7-4" />
      <path d="m8.5 10 7 4" />
    </>
  ),
  'square-bottom-dashed-scissors': (
    <>
      <path d="M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2" />
      <path d="M10 22H8" />
      <path d="M16 22h-2" />
      <circle cx="8" cy="8" r="2" />
      <path d="M9.414 9.414 12 12" />
      <path d="M14.8 14.8 18 18" />
      <circle cx="8" cy="16" r="2" />
      <path d="m18 6-8.586 8.586" />
    </>
  ),
  'square-chart-gantt': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 8h7" />
      <path d="M8 12h6" />
      <path d="M11 16h5" />
    </>
  ),
  'square-check': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'square-check-big': (
    <>
      <path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" />
      <path d="m9 11 3 3L22 4" />
    </>
  ),
  'square-chevron-down': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m16 10-4 4-4-4" />
    </>
  ),
  'square-chevron-left': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m14 16-4-4 4-4" />
    </>
  ),
  'square-chevron-right': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m10 8 4 4-4 4" />
    </>
  ),
  'square-chevron-up': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m8 14 4-4 4 4" />
    </>
  ),
  'square-code': (
    <>
      <path d="m10 9-3 3 3 3" />
      <path d="m14 15 3-3-3-3" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'square-dashed': (
    <>
      <path d="M5 3a2 2 0 0 0-2 2" />
      <path d="M19 3a2 2 0 0 1 2 2" />
      <path d="M21 19a2 2 0 0 1-2 2" />
      <path d="M5 21a2 2 0 0 1-2-2" />
      <path d="M9 3h1" />
      <path d="M9 21h1" />
      <path d="M14 3h1" />
      <path d="M14 21h1" />
      <path d="M3 9v1" />
      <path d="M21 9v1" />
      <path d="M3 14v1" />
      <path d="M21 14v1" />
    </>
  ),
  'square-dashed-bottom': (
    <>
      <path d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2" />
      <path d="M9 21h1" />
      <path d="M14 21h1" />
    </>
  ),
  'square-dashed-bottom-code': (
    <>
      <path d="M10 9.5 8 12l2 2.5" />
      <path d="M14 21h1" />
      <path d="m14 9.5 2 2.5-2 2.5" />
      <path d="M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2" />
      <path d="M9 21h1" />
    </>
  ),
  'square-dashed-kanban': (
    <>
      <path d="M8 7v7" />
      <path d="M12 7v4" />
      <path d="M16 7v9" />
      <path d="M5 3a2 2 0 0 0-2 2" />
      <path d="M9 3h1" />
      <path d="M14 3h1" />
      <path d="M19 3a2 2 0 0 1 2 2" />
      <path d="M21 9v1" />
      <path d="M21 14v1" />
      <path d="M21 19a2 2 0 0 1-2 2" />
      <path d="M14 21h1" />
      <path d="M9 21h1" />
      <path d="M5 21a2 2 0 0 1-2-2" />
      <path d="M3 14v1" />
      <path d="M3 9v1" />
    </>
  ),
  'square-dashed-mouse-pointer': (
    <>
      <path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" />
      <path d="M5 3a2 2 0 0 0-2 2" />
      <path d="M19 3a2 2 0 0 1 2 2" />
      <path d="M5 21a2 2 0 0 1-2-2" />
      <path d="M9 3h1" />
      <path d="M9 21h2" />
      <path d="M14 3h1" />
      <path d="M3 9v1" />
      <path d="M21 9v2" />
      <path d="M3 14v1" />
    </>
  ),
  'square-dashed-top-solid': (
    <>
      <path d="M14 21h1" />
      <path d="M21 14v1" />
      <path d="M21 19a2 2 0 0 1-2 2" />
      <path d="M21 9v1" />
      <path d="M3 14v1" />
      <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
      <path d="M3 9v1" />
      <path d="M5 21a2 2 0 0 1-2-2" />
      <path d="M9 21h1" />
    </>
  ),
  'square-divide': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="8" x2="16" y1="12" y2="12" />
      <line x1="12" x2="12" y1="16" y2="16" />
      <line x1="12" x2="12" y1="8" y2="8" />
    </>
  ),
  'square-dot': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  'square-equal': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 10h10" />
      <path d="M7 14h10" />
    </>
  ),
  'square-function': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" />
      <path d="M9 11.2h5.7" />
    </>
  ),
  'square-kanban': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 7v7" />
      <path d="M12 7v4" />
      <path d="M16 7v9" />
    </>
  ),
  'square-library': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7v10" />
      <path d="M11 7v10" />
      <path d="m15 7 2 10" />
    </>
  ),
  'square-menu': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 8h10" />
      <path d="M7 12h10" />
      <path d="M7 16h10" />
    </>
  ),
  'square-minus': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 12h8" />
    </>
  ),
  'square-mouse-pointer': (
    <>
      <path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" />
      <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
    </>
  ),
  'square-pause': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="10" x2="10" y1="15" y2="9" />
      <line x1="14" x2="14" y1="15" y2="9" />
    </>
  ),
  'square-pen': (
    <>
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </>
  ),
  'square-percent': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m15 9-6 6" />
      <path d="M9 9h.01" />
      <path d="M15 15h.01" />
    </>
  ),
  'square-pi': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h10" />
      <path d="M10 7v10" />
      <path d="M16 17a2 2 0 0 1-2-2V7" />
    </>
  ),
  'square-pilcrow': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 12H9.5a2.5 2.5 0 0 1 0-5H17" />
      <path d="M12 7v10" />
      <path d="M16 7v10" />
    </>
  ),
  'square-play': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
    </>
  ),
  'square-plus': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </>
  ),
  'square-power': (
    <>
      <path d="M12 7v4" />
      <path d="M7.998 9.003a5 5 0 1 0 8-.005" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'square-radical': (
    <>
      <path d="M7 12h2l2 5 2-10h4" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'square-round-corner': (
    <>
      <path d="M21 11a8 8 0 0 0-8-8" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </>
  ),
  'square-scissors': (
    <>
      <rect width="20" height="20" x="2" y="2" rx="2" />
      <circle cx="8" cy="8" r="2" />
      <path d="M9.414 9.414 12 12" />
      <path d="M14.8 14.8 18 18" />
      <circle cx="8" cy="16" r="2" />
      <path d="m18 6-8.586 8.586" />
    </>
  ),
  'square-sigma': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M16 8.9V7H8l4 5-4 5h8v-1.9" />
    </>
  ),
  'square-slash': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <line x1="9" x2="15" y1="15" y2="9" />
    </>
  ),
  'square-split-horizontal': (
    <>
      <path d="M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3" />
      <path d="M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3" />
      <line x1="12" x2="12" y1="4" y2="20" />
    </>
  ),
  'square-split-vertical': (
    <>
      <path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" />
      <path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" />
      <line x1="4" x2="20" y1="12" y2="12" />
    </>
  ),
  'square-square': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </>
  ),
  'square-stack': (
    <>
      <path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
      <path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" />
      <rect width="8" height="8" x="14" y="14" rx="2" />
    </>
  ),
  'square-star': (
    <>
      <path d="M11.035 7.69a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </>
  ),
  'square-stop': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </>
  ),
  'square-terminal': (
    <>
      <path d="m7 11 2-2-2-2" />
      <path d="M11 13h4" />
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    </>
  ),
  'square-user': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </>
  ),
  'square-user-round': (
    <>
      <path d="M18 21a6 6 0 0 0-12 0" />
      <circle cx="12" cy="11" r="4" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </>
  ),
  'square-x': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
  'squares-exclude': (
    <>
      <path d="M16 12v2a2 2 0 0 1-2 2H9a1 1 0 0 0-1 1v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h0" />
      <path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-5a2 2 0 0 0-2 2v2" />
    </>
  ),
  'squares-intersect': (
    <>
      <path d="M10 22a2 2 0 0 1-2-2" />
      <path d="M14 2a2 2 0 0 1 2 2" />
      <path d="M16 22h-2" />
      <path d="M2 10V8" />
      <path d="M2 4a2 2 0 0 1 2-2" />
      <path d="M20 8a2 2 0 0 1 2 2" />
      <path d="M22 14v2" />
      <path d="M22 20a2 2 0 0 1-2 2" />
      <path d="M4 16a2 2 0 0 1-2-2" />
      <path d="M8 10a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H9a1 1 0 0 1-1-1z" />
      <path d="M8 2h2" />
    </>
  ),
  'squares-subtract': (
    <>
      <path d="M10 22a2 2 0 0 1-2-2" />
      <path d="M16 22h-2" />
      <path d="M16 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-5a2 2 0 0 1 2-2h5a1 1 0 0 0 1-1z" />
      <path d="M20 8a2 2 0 0 1 2 2" />
      <path d="M22 14v2" />
      <path d="M22 20a2 2 0 0 1-2 2" />
    </>
  ),
  'squares-unite': (
    <path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3a1 1 0 0 0-1-1z" />
  ),
  squircle: <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" />,
  'squircle-dashed': (
    <>
      <path d="M13.77 3.043a34 34 0 0 0-3.54 0" />
      <path d="M13.771 20.956a33 33 0 0 1-3.541.001" />
      <path d="M20.18 17.74c-.51 1.15-1.29 1.93-2.439 2.44" />
      <path d="M20.18 6.259c-.51-1.148-1.291-1.929-2.44-2.438" />
      <path d="M20.957 10.23a33 33 0 0 1 0 3.54" />
      <path d="M3.043 10.23a34 34 0 0 0 .001 3.541" />
      <path d="M6.26 20.179c-1.15-.508-1.93-1.29-2.44-2.438" />
      <path d="M6.26 3.82c-1.149.51-1.93 1.291-2.44 2.44" />
    </>
  ),
  stamp: (
    <>
      <path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13" />
      <path d="M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z" />
      <path d="M5 22h14" />
    </>
  ),
  'star-half': (
    <path d="M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2" />
  ),
  'star-off': (
    <>
      <path d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43" />
      <path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </>
  ),
  'step-back': (
    <>
      <path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" />
      <path d="M21 20V4" />
    </>
  ),
  'step-forward': (
    <>
      <path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" />
      <path d="M3 4v16" />
    </>
  ),
  sticker: (
    <>
      <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
      <path d="M14 3v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h.01" />
      <path d="M16 13h.01" />
      <path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" />
    </>
  ),
  'sticky-note': (
    <>
      <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
      <path d="M15 3v4a2 2 0 0 0 2 2h4" />
    </>
  ),
  store: (
    <>
      <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
      <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
      <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
    </>
  ),
  'stretch-horizontal': (
    <>
      <rect width="20" height="6" x="2" y="4" rx="2" />
      <rect width="20" height="6" x="2" y="14" rx="2" />
    </>
  ),
  'stretch-vertical': (
    <>
      <rect width="6" height="20" x="4" y="2" rx="2" />
      <rect width="6" height="20" x="14" y="2" rx="2" />
    </>
  ),
  strikethrough: (
    <>
      <path d="M16 4H9a3 3 0 0 0-2.83 4" />
      <path d="M14 12a4 4 0 0 1 0 8H6" />
      <line x1="4" x2="20" y1="12" y2="12" />
    </>
  ),
  subscript: (
    <>
      <path d="m4 5 8 8" />
      <path d="m12 5-8 8" />
      <path d="M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07" />
    </>
  ),
  'sun-moon': (
    <>
      <path d="M12 2v2" />
      <path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715" />
      <path d="M16 12a4 4 0 0 0-4-4" />
      <path d="m19 5-1.256 1.256" />
      <path d="M20 12h2" />
    </>
  ),
  superscript: (
    <>
      <path d="m4 19 8-8" />
      <path d="m12 19-8-8" />
      <path d="M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06" />
    </>
  ),
  'swatch-book': (
    <>
      <path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" />
      <path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" />
      <path d="M 7 17h.01" />
      <path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8" />
    </>
  ),
  'swiss-franc': (
    <>
      <path d="M10 21V3h8" />
      <path d="M6 16h9" />
      <path d="M10 9.5h7" />
    </>
  ),
  'switch-camera': (
    <>
      <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
      <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
      <circle cx="12" cy="12" r="3" />
      <path d="m18 22-3-3 3-3" />
      <path d="m6 2 3 3-3 3" />
    </>
  ),
  'table-cells-merge': (
    <>
      <path d="M12 21v-6" />
      <path d="M12 9V3" />
      <path d="M3 15h18" />
      <path d="M3 9h18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </>
  ),
  'table-cells-split': (
    <>
      <path d="M12 15V9" />
      <path d="M3 15h18" />
      <path d="M3 9h18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </>
  ),
  'table-columns-split': (
    <>
      <path d="M14 14v2" />
      <path d="M14 20v2" />
      <path d="M14 2v2" />
      <path d="M14 8v2" />
      <path d="M2 15h8" />
      <path d="M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2" />
      <path d="M2 9h8" />
      <path d="M22 15h-4" />
      <path d="M22 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
      <path d="M22 9h-4" />
      <path d="M5 3v18" />
    </>
  ),
  'table-of-contents': (
    <>
      <path d="M16 5H3" />
      <path d="M16 12H3" />
      <path d="M16 19H3" />
      <path d="M21 5h.01" />
      <path d="M21 12h.01" />
      <path d="M21 19h.01" />
    </>
  ),
  'table-properties': (
    <>
      <path d="M15 3v18" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M21 9H3" />
      <path d="M21 15H3" />
    </>
  ),
  'table-rows-split': (
    <>
      <path d="M14 10h2" />
      <path d="M15 22v-8" />
      <path d="M15 2v4" />
      <path d="M2 10h2" />
      <path d="M20 10h2" />
      <path d="M3 19h18" />
      <path d="M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6" />
      <path d="M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2" />
      <path d="M8 10h2" />
      <path d="M9 22v-8" />
      <path d="M9 2v4" />
    </>
  ),
  tablet: (
    <>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <line x1="12" x2="12.01" y1="18" y2="18" />
    </>
  ),
  'tablet-smartphone': (
    <>
      <rect width="10" height="14" x="3" y="8" rx="2" />
      <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" />
      <path d="M8 18h.01" />
    </>
  ),
  tags: (
    <>
      <path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z" />
      <path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193" />
      <circle cx="10.5" cy="6.5" r=".5" fill="currentColor" />
    </>
  ),
  tangent: (
    <>
      <circle cx="17" cy="4" r="2" />
      <path d="M15.59 5.41 5.41 15.59" />
      <circle cx="4" cy="17" r="2" />
      <path d="M12 22s-4-9-1.5-11.5S22 12 22 12" />
    </>
  ),
  'text-align-justify': (
    <>
      <path d="M3 5h18" />
      <path d="M3 12h18" />
      <path d="M3 19h18" />
    </>
  ),
  'text-cursor': (
    <>
      <path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1" />
      <path d="M7 22h1a4 4 0 0 0 4-4v-1" />
      <path d="M7 2h1a4 4 0 0 1 4 4v1" />
    </>
  ),
  'text-cursor-input': (
    <>
      <path d="M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6" />
      <path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" />
      <path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
      <path d="M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1" />
      <path d="M9 6v12" />
    </>
  ),
  'text-initial': (
    <>
      <path d="M15 5h6" />
      <path d="M15 12h6" />
      <path d="M3 19h18" />
      <path d="m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12" />
      <path d="M3.92 10h6.16" />
    </>
  ),
  'text-quote': (
    <>
      <path d="M17 5H3" />
      <path d="M21 12H8" />
      <path d="M21 19H8" />
      <path d="M3 12v7" />
    </>
  ),
  'text-search': (
    <>
      <path d="M21 5H3" />
      <path d="M10 12H3" />
      <path d="M10 19H3" />
      <circle cx="17" cy="15" r="3" />
      <path d="m21 19-1.9-1.9" />
    </>
  ),
  'text-select': (
    <>
      <path d="M14 21h1" />
      <path d="M14 3h1" />
      <path d="M19 3a2 2 0 0 1 2 2" />
      <path d="M21 14v1" />
      <path d="M21 19a2 2 0 0 1-2 2" />
      <path d="M21 9v1" />
      <path d="M3 14v1" />
      <path d="M3 9v1" />
      <path d="M5 21a2 2 0 0 1-2-2" />
      <path d="M5 3a2 2 0 0 0-2 2" />
      <path d="M7 12h10" />
      <path d="M7 16h6" />
      <path d="M7 8h8" />
      <path d="M9 21h1" />
      <path d="M9 3h1" />
    </>
  ),
  'text-wrap': (
    <>
      <path d="m16 16-3 3 3 3" />
      <path d="M3 12h14.5a1 1 0 0 1 0 7H13" />
      <path d="M3 19h6" />
      <path d="M3 5h18" />
    </>
  ),
  ticket: (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </>
  ),
  'ticket-check': (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  'ticket-minus': (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 12h6" />
    </>
  ),
  'ticket-percent': (
    <>
      <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 9h.01" />
      <path d="m15 9-6 6" />
      <path d="M15 15h.01" />
    </>
  ),
  'ticket-plus': (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </>
  ),
  'ticket-slash': (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="m9.5 14.5 5-5" />
    </>
  ),
  'ticket-x': (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="m9.5 14.5 5-5" />
      <path d="m9.5 9.5 5 5" />
    </>
  ),
  tickets: (
    <>
      <path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" />
      <path d="M6 10V8" />
      <path d="M6 14v1" />
      <path d="M6 19v2" />
      <rect x="2" y="8" width="20" height="13" rx="2" />
    </>
  ),
  'timer-off': (
    <>
      <path d="M10 2h4" />
      <path d="M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" />
      <path d="M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" />
      <path d="m2 2 20 20" />
      <path d="M12 12v-2" />
    </>
  ),
  'timer-reset': (
    <>
      <path d="M10 2h4" />
      <path d="M12 14v-4" />
      <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
      <path d="M9 17H4v5" />
    </>
  ),
  'toggle-left': (
    <>
      <circle cx="9" cy="12" r="3" />
      <rect width="20" height="14" x="2" y="5" rx="7" />
    </>
  ),
  'toggle-right': (
    <>
      <circle cx="15" cy="12" r="3" />
      <rect width="20" height="14" x="2" y="5" rx="7" />
    </>
  ),
  'tool-case': (
    <>
      <path d="M10 15h4" />
      <path d="m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27" />
      <path d="m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122" />
      <path d="M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </>
  ),
  touchpad: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M2 14h20" />
      <path d="M12 20v-6" />
    </>
  ),
  'touchpad-off': (
    <>
      <path d="M12 20v-6" />
      <path d="M19.656 14H22" />
      <path d="M2 14h12" />
      <path d="m2 2 20 20" />
      <path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" />
      <path d="M9.656 4H20a2 2 0 0 1 2 2v10.344" />
    </>
  ),
  'traffic-cone': (
    <>
      <path d="M16.05 10.966a5 2.5 0 0 1-8.1 0" />
      <path d="m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04" />
      <path d="M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z" />
      <path d="M9.194 6.57a5 2.5 0 0 0 5.61 0" />
    </>
  ),
  'train-front': (
    <>
      <path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" />
      <path d="m9 15-1-1" />
      <path d="m15 15 1-1" />
      <path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" />
      <path d="m8 19-2 3" />
      <path d="m16 19 2 3" />
    </>
  ),
  'train-front-tunnel': (
    <>
      <path d="M2 22V12a10 10 0 1 1 20 0v10" />
      <path d="M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8" />
      <path d="M10 15h.01" />
      <path d="M14 15h.01" />
      <path d="M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z" />
      <path d="m9 19-2 3" />
      <path d="m15 19 2 3" />
    </>
  ),
  'train-track': (
    <>
      <path d="M2 17 17 2" />
      <path d="m2 14 8 8" />
      <path d="m5 11 8 8" />
      <path d="m8 8 8 8" />
      <path d="m11 5 8 8" />
      <path d="m14 2 8 8" />
      <path d="M7 22 22 7" />
    </>
  ),
  'trending-up-down': (
    <>
      <path d="M14.828 14.828 21 21" />
      <path d="M21 16v5h-5" />
      <path d="m21 3-9 9-4-4-6 6" />
      <path d="M21 8V3h-5" />
    </>
  ),
  triangle: <path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />,
  'triangle-alert': (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  'triangle-dashed': (
    <>
      <path d="M10.17 4.193a2 2 0 0 1 3.666.013" />
      <path d="M14 21h2" />
      <path d="m15.874 7.743 1 1.732" />
      <path d="m18.849 12.952 1 1.732" />
      <path d="M21.824 18.18a2 2 0 0 1-1.835 2.824" />
      <path d="M4.024 21a2 2 0 0 1-1.839-2.839" />
      <path d="m5.136 12.952-1 1.732" />
      <path d="M8 21h2" />
      <path d="m8.102 7.743-1 1.732" />
    </>
  ),
  'triangle-right': (
    <path d="M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z" />
  ),
  'truck-electric': (
    <>
      <path d="M14 19V7a2 2 0 0 0-2-2H9" />
      <path d="M15 19H9" />
      <path d="M19 19h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14" />
      <path d="M2 13v5a1 1 0 0 0 1 1h2" />
      <path d="M4 3 2.15 5.15a.495.495 0 0 0 .35.86h2.15a.47.47 0 0 1 .35.86L3 9.02" />
      <circle cx="17" cy="19" r="2" />
      <circle cx="7" cy="19" r="2" />
    </>
  ),
  'turkish-lira': (
    <>
      <path d="M15 4 5 9" />
      <path d="m15 8.5-10 5" />
      <path d="M18 12a9 9 0 0 1-9 9V3" />
    </>
  ),
  tv: (
    <>
      <path d="m17 2-5 5-5-5" />
      <rect width="20" height="15" x="2" y="7" rx="2" />
    </>
  ),
  'tv-minimal': (
    <>
      <path d="M7 21h10" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
    </>
  ),
  'tv-minimal-play': (
    <>
      <path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z" />
      <path d="M7 21h10" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
    </>
  ),
  'type-outline': (
    <path d="M14 16.5a.5.5 0 0 0 .5.5h.5a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4h.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V8a2 2 0 0 1-4 0V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5Z" />
  ),
  'undo-dot': (
    <>
      <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
      <path d="M3 7v6h6" />
      <circle cx="12" cy="17" r="1" />
    </>
  ),
  'unfold-horizontal': (
    <>
      <path d="M16 12h6" />
      <path d="M8 12H2" />
      <path d="M12 2v2" />
      <path d="M12 8v2" />
      <path d="M12 14v2" />
      <path d="M12 20v2" />
      <path d="m19 15 3-3-3-3" />
      <path d="m5 9-3 3 3 3" />
    </>
  ),
  'unfold-vertical': (
    <>
      <path d="M12 22v-6" />
      <path d="M12 8V2" />
      <path d="M4 12H2" />
      <path d="M10 12H8" />
      <path d="M16 12h-2" />
      <path d="M22 12h-2" />
      <path d="m15 19-3 3-3-3" />
      <path d="m15 5-3-3-3 3" />
    </>
  ),
  ungroup: (
    <>
      <rect width="8" height="6" x="5" y="4" rx="1" />
      <rect width="8" height="6" x="11" y="14" rx="1" />
    </>
  ),
  university: (
    <>
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="M18 12h.01" />
      <path d="M18 16h.01" />
      <path d="M22 7a1 1 0 0 0-1-1h-2a2 2 0 0 1-1.143-.359L13.143 2.36a2 2 0 0 0-2.286-.001L6.143 5.64A2 2 0 0 1 5 6H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z" />
      <path d="M6 12h.01" />
      <path d="M6 16h.01" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  unplug: (
    <>
      <path d="m19 5 3-3" />
      <path d="m2 22 3-3" />
      <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
      <path d="M7.5 13.5 10 11" />
      <path d="M10.5 16.5 13 14" />
      <path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" />
    </>
  ),
  usb: (
    <>
      <circle cx="10" cy="7" r="1" />
      <circle cx="4" cy="20" r="1" />
      <path d="M4.7 19.3 19 5" />
      <path d="m21 3-3 1 2 2Z" />
      <path d="M9.26 7.68 5 12l2 5" />
      <path d="m10 14 5 2 3.5-3.5" />
      <path d="m18 12 1-1 1 1-1 1Z" />
    </>
  ),
  'user-cog': (
    <>
      <path d="M10 15H6a4 4 0 0 0-4 4v2" />
      <path d="m14.305 16.53.923-.382" />
      <path d="m15.228 13.852-.923-.383" />
      <path d="m16.852 12.228-.383-.923" />
      <path d="m16.852 17.772-.383.924" />
      <path d="m19.148 12.228.383-.923" />
      <path d="m19.53 18.696-.382-.924" />
      <path d="m20.772 13.852.924-.383" />
      <path d="m20.772 16.148.924.383" />
      <circle cx="18" cy="15" r="3" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  'user-lock': (
    <>
      <circle cx="10" cy="7" r="4" />
      <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
      <path d="M15 15.5V14a2 2 0 0 1 4 0v1.5" />
      <rect width="8" height="5" x="13" y="16" rx=".899" />
    </>
  ),
  'user-minus': (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </>
  ),
  'user-pen': (
    <>
      <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
      <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
      <circle cx="10" cy="7" r="4" />
    </>
  ),
  'user-round': (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </>
  ),
  'user-round-check': (
    <>
      <path d="M2 21a8 8 0 0 1 13.292-6" />
      <circle cx="10" cy="8" r="5" />
      <path d="m16 19 2 2 4-4" />
    </>
  ),
  'user-round-cog': (
    <>
      <path d="m14.305 19.53.923-.382" />
      <path d="m15.228 16.852-.923-.383" />
      <path d="m16.852 15.228-.383-.923" />
      <path d="m16.852 20.772-.383.924" />
      <path d="m19.148 15.228.383-.923" />
      <path d="m19.53 21.696-.382-.924" />
      <path d="M2 21a8 8 0 0 1 10.434-7.62" />
      <path d="m20.772 16.852.924-.383" />
      <path d="m20.772 19.148.924.383" />
      <circle cx="10" cy="8" r="5" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  'user-round-minus': (
    <>
      <path d="M2 21a8 8 0 0 1 13.292-6" />
      <circle cx="10" cy="8" r="5" />
      <path d="M22 19h-6" />
    </>
  ),
  'user-round-pen': (
    <>
      <path d="M2 21a8 8 0 0 1 10.821-7.487" />
      <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
      <circle cx="10" cy="8" r="5" />
    </>
  ),
  'user-round-plus': (
    <>
      <path d="M2 21a8 8 0 0 1 13.292-6" />
      <circle cx="10" cy="8" r="5" />
      <path d="M19 16v6" />
      <path d="M22 19h-6" />
    </>
  ),
  'user-round-search': (
    <>
      <circle cx="10" cy="8" r="5" />
      <path d="M2 21a8 8 0 0 1 10.434-7.62" />
      <circle cx="18" cy="18" r="3" />
      <path d="m22 22-1.9-1.9" />
    </>
  ),
  'user-round-x': (
    <>
      <path d="M2 21a8 8 0 0 1 11.873-7" />
      <circle cx="10" cy="8" r="5" />
      <path d="m17 17 5 5" />
      <path d="m22 17-5 5" />
    </>
  ),
  'user-search': (
    <>
      <circle cx="10" cy="7" r="4" />
      <path d="M10.3 15H7a4 4 0 0 0-4 4v2" />
      <circle cx="17" cy="17" r="3" />
      <path d="m21 21-1.9-1.9" />
    </>
  ),
  'user-star': (
    <>
      <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
      <path d="M8 15H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
    </>
  ),
  'user-x': (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="17" x2="22" y1="8" y2="13" />
      <line x1="22" x2="17" y1="8" y2="13" />
    </>
  ),
  'users-round': (
    <>
      <path d="M18 21a8 8 0 0 0-16 0" />
      <circle cx="10" cy="8" r="5" />
      <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
    </>
  ),
  'utility-pole': (
    <>
      <path d="M12 2v20" />
      <path d="M2 5h20" />
      <path d="M3 3v2" />
      <path d="M7 3v2" />
      <path d="M17 3v2" />
      <path d="M21 3v2" />
      <path d="m19 5-7 7-7-7" />
    </>
  ),
  variable: (
    <>
      <path d="M8 21s-4-3-4-9 4-9 4-9" />
      <path d="M16 3s4 3 4 9-4 9-4 9" />
      <line x1="15" x2="9" y1="9" y2="15" />
      <line x1="9" x2="15" y1="9" y2="15" />
    </>
  ),
  vault: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
      <path d="m7.9 7.9 2.7 2.7" />
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
      <path d="m13.4 10.6 2.7-2.7" />
      <circle cx="7.5" cy="16.5" r=".5" fill="currentColor" />
      <path d="m7.9 16.1 2.7-2.7" />
      <circle cx="16.5" cy="16.5" r=".5" fill="currentColor" />
      <path d="m13.4 13.4 2.7 2.7" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  'vector-square': (
    <>
      <path d="M19.5 7a24 24 0 0 1 0 10" />
      <path d="M4.5 7a24 24 0 0 0 0 10" />
      <path d="M7 19.5a24 24 0 0 0 10 0" />
      <path d="M7 4.5a24 24 0 0 1 10 0" />
      <rect x="17" y="17" width="5" height="5" rx="1" />
      <rect x="17" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="17" width="5" height="5" rx="1" />
      <rect x="2" y="2" width="5" height="5" rx="1" />
    </>
  ),
  vibrate: (
    <>
      <path d="m2 8 2 2-2 2 2 2-2 2" />
      <path d="m22 8-2 2 2 2-2 2 2 2" />
      <rect width="8" height="14" x="8" y="5" rx="1" />
    </>
  ),
  'vibrate-off': (
    <>
      <path d="m2 8 2 2-2 2 2 2-2 2" />
      <path d="m22 8-2 2 2 2-2 2 2 2" />
      <path d="M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2" />
      <path d="M16 10.34V6c0-.55-.45-1-1-1h-4.34" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </>
  ),
  'video-off': (
    <>
      <path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196" />
      <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
      <path d="m2 2 20 20" />
    </>
  ),
  view: (
    <>
      <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
      <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
      <circle cx="12" cy="12" r="1" />
      <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
    </>
  ),
  voicemail: (
    <>
      <circle cx="6" cy="12" r="4" />
      <circle cx="18" cy="12" r="4" />
      <line x1="6" x2="18" y1="16" y2="16" />
    </>
  ),
  'volume-off': (
    <>
      <path d="M16 9a5 5 0 0 1 .95 2.293" />
      <path d="M19.364 5.636a9 9 0 0 1 1.889 9.96" />
      <path d="m2 2 20 20" />
      <path d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11" />
      <path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686" />
    </>
  ),
  vote: (
    <>
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M22 19H2" />
    </>
  ),
  'wallet-cards': (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
      <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" />
    </>
  ),
  'wallet-minimal': (
    <>
      <path d="M17 14h.01" />
      <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" />
    </>
  ),
  wallpaper: (
    <>
      <path d="M12 17v4" />
      <path d="M8 21h8" />
      <path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15" />
      <circle cx="8" cy="9" r="2" />
      <rect x="2" y="3" width="20" height="14" rx="2" />
    </>
  ),
  warehouse: (
    <>
      <path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11" />
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z" />
      <path d="M6 13h12" />
      <path d="M6 17h12" />
    </>
  ),
  watch: (
    <>
      <path d="M12 10v2.2l1.6 1" />
      <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
      <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
      <circle cx="12" cy="12" r="6" />
    </>
  ),
  waves: (
    <>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </>
  ),
  waypoints: (
    <>
      <circle cx="12" cy="4.5" r="2.5" />
      <path d="m10.2 6.3-3.9 3.9" />
      <circle cx="4.5" cy="12" r="2.5" />
      <path d="M7 12h10" />
      <circle cx="19.5" cy="12" r="2.5" />
      <path d="m13.8 17.7 3.9-3.9" />
      <circle cx="12" cy="19.5" r="2.5" />
    </>
  ),
  webcam: (
    <>
      <circle cx="12" cy="10" r="8" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 22h10" />
      <path d="M12 22v-4" />
    </>
  ),
  webhook: (
    <>
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </>
  ),
  'webhook-off': (
    <>
      <path d="M17 17h-5c-1.09-.02-1.94.92-2.5 1.9A3 3 0 1 1 2.57 15" />
      <path d="M9 3.4a4 4 0 0 1 6.52.66" />
      <path d="m6 17 3.1-5.8a2.5 2.5 0 0 0 .057-2.05" />
      <path d="M20.3 20.3a4 4 0 0 1-2.3.7" />
      <path d="M18.6 13a4 4 0 0 1 3.357 3.414" />
      <path d="m12 6 .6 1" />
      <path d="m2 2 20 20" />
    </>
  ),
  weight: (
    <>
      <circle cx="12" cy="5" r="3" />
      <path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />
    </>
  ),
  'whole-word': (
    <>
      <circle cx="7" cy="12" r="3" />
      <path d="M10 9v6" />
      <circle cx="17" cy="12" r="3" />
      <path d="M14 7v8" />
      <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
    </>
  ),
  'wifi-cog': (
    <>
      <path d="m14.305 19.53.923-.382" />
      <path d="m15.228 16.852-.923-.383" />
      <path d="m16.852 15.228-.383-.923" />
      <path d="m16.852 20.772-.383.924" />
      <path d="m19.148 15.228.383-.923" />
      <path d="m19.53 21.696-.382-.924" />
      <path d="M2 7.82a15 15 0 0 1 20 0" />
      <path d="m20.772 16.852.924-.383" />
      <path d="m20.772 19.148.924.383" />
      <path d="M5 11.858a10 10 0 0 1 11.5-1.785" />
      <path d="M8.5 15.429a5 5 0 0 1 2.413-1.31" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  'wifi-high': (
    <>
      <path d="M12 20h.01" />
      <path d="M5 12.859a10 10 0 0 1 14 0" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
    </>
  ),
  'wifi-low': (
    <>
      <path d="M12 20h.01" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
    </>
  ),
  'wifi-off': (
    <>
      <path d="M12 20h.01" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
      <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
      <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
      <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
      <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
      <path d="m2 2 20 20" />
    </>
  ),
  'wifi-pen': (
    <>
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
      <path d="M5 12.859a10 10 0 0 1 10.5-2.222" />
      <path d="M8.5 16.429a5 5 0 0 1 3-1.406" />
    </>
  ),
  'wifi-sync': (
    <>
      <path d="M11.965 10.105v4L13.5 12.5a5 5 0 0 1 8 1.5" />
      <path d="M11.965 14.105h4" />
      <path d="M17.965 18.105h4L20.43 19.71a5 5 0 0 1-8-1.5" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M21.965 22.105v-4" />
      <path d="M5 12.86a10 10 0 0 1 3-2.032" />
      <path d="M8.5 16.429h.01" />
    </>
  ),
  'wifi-zero': <path d="M12 20h.01" />,
  workflow: (
    <>
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
  ),
  'zoom-in': (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
      <line x1="11" x2="11" y1="8" y2="14" />
      <line x1="8" x2="14" y1="11" y2="11" />
    </>
  ),
  'zoom-out': (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
      <line x1="8" x2="14" y1="11" y2="11" />
    </>
  ),
};
