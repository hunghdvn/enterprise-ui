import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// Deployed to GitHub Pages as a project site: https://<owner>.github.io/enterprise-ui/
// Keep `base` in sync with the deploy target; Starlight prefixes its own links.
export default defineConfig({
  site: 'https://hunghdvn.github.io',
  base: '/enterprise-ui/',
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
            { label: 'Button', slug: 'components/button' },
            { label: 'Input', slug: 'components/input' },
            { label: 'Select', slug: 'components/select' },
            { label: 'Checkbox', slug: 'components/checkbox' },
            { label: 'Badge', slug: 'components/badge' },
            { label: 'Tabs', slug: 'components/tabs' },
            { label: 'Tooltip', slug: 'components/tooltip' },
            { label: 'Empty & Spin', slug: 'components/empty-spin' },
            { label: 'Table', slug: 'components/table' },
            { label: 'Modal', slug: 'components/modal' },
            { label: 'Toast', slug: 'components/toast' },
          ],
        },
        {
          label: 'Templates',
          items: [{ label: 'Tổng quan', slug: 'templates' }],
        },
      ],
    }),
    react(),
  ],
});
