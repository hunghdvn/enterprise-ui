import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// Deployed to GitHub Pages as a project site: https://<owner>.github.io/enterprise-ui/
// Keep `base` in sync with the deploy target; Starlight prefixes its own links.
// Content uses relative links, which resolve against a trailing slash. Making
// that explicit keeps dev, preview and GitHub Pages on the same URL shape.
export default defineConfig({
  site: 'https://hunghdvn.github.io',
  base: '/enterprise-ui/',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Enterprise UI',
      description:
        'Bộ component React cho ứng dụng quản trị doanh nghiệp: token rõ ràng, theme sáng/tối, mật độ compact, không phụ thuộc runtime.',
      logo: {
        src: './src/assets/logo.svg',
        alt: 'Enterprise UI',
      },
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/hunghdvn/enterprise-ui',
        },
      ],
      locales: {
        root: { label: 'Tiếng Việt', lang: 'vi' },
      },
      defaultLocale: 'root',
      customCss: ['./src/styles/theme.css'],
      components: {
        Head: './src/components/Head.astro',
      },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: 'Bắt đầu',
          items: [
            { label: 'Giới thiệu', link: '/' },
            { label: 'Cài đặt', slug: 'getting-started' },
            { label: 'Theme & mật độ', slug: 'guides/theming' },
          ],
        },
        {
          label: 'Nền tảng',
          items: [
            { label: 'Design tokens', slug: 'foundations/tokens' },
            { label: 'Icon', slug: 'foundations/icons' },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Tổng quan', slug: 'components' },
            {
              label: 'Primitives',
              items: [
                { label: 'Button', slug: 'components/button' },
                { label: 'Input', slug: 'components/input' },
                { label: 'Select', slug: 'components/select' },
                { label: 'Combobox', slug: 'components/combobox' },
                { label: 'Checkbox', slug: 'components/checkbox' },
                { label: 'Badge', slug: 'components/badge' },
                { label: 'Tabs', slug: 'components/tabs' },
                { label: 'Tooltip', slug: 'components/tooltip' },
                { label: 'Form', slug: 'components/form' },
                { label: 'Empty & Spin', slug: 'components/empty-spin' },
              ],
            },
            {
              label: 'Layout',
              items: [
                { label: 'AppShell', slug: 'components/app-shell' },
                { label: 'PageHeader', slug: 'components/page-header' },
                { label: 'SplitView', slug: 'components/split-view' },
                { label: 'Pagination', slug: 'components/pagination' },
              ],
            },
            {
              label: 'Data',
              items: [
                { label: 'Table', slug: 'components/table' },
                { label: 'FilterBar', slug: 'components/filter-bar' },
                { label: 'KpiCard', slug: 'components/kpi-card' },
                { label: 'KpiGrid', slug: 'components/kpi-grid' },
                { label: 'Steps', slug: 'components/steps' },
                { label: 'DateRangePicker', slug: 'components/date-range-picker' },
                { label: 'Calendar', slug: 'components/calendar' },
                { label: 'Kanban', slug: 'components/kanban' },
                { label: 'Tree', slug: 'components/tree' },
                { label: 'SavedViews', slug: 'components/saved-views' },
                { label: 'FileUpload', slug: 'components/file-upload' },
              ],
            },
            {
              label: 'Feedback',
              items: [
                { label: 'Modal', slug: 'components/modal' },
                { label: 'Drawer', slug: 'components/drawer' },
                { label: 'Toast', slug: 'components/toast' },
                { label: 'NotificationCenter', slug: 'components/notification-center' },
              ],
            },
          ],
        },
        {
          label: 'Templates',
          items: [
            { label: 'Tổng quan', slug: 'templates' },
            { label: 'Auth', slug: 'templates/auth' },
            { label: 'Error page', slug: 'templates/error-page' },
            { label: 'Settings', slug: 'templates/settings' },
          ],
        },
      ],
    }),
    react(),
  ],
});
