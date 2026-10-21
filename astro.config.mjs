import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://traildesk.space',
  trailingSlash: 'always',
  // Code in the docs: light theme to match the site.
  markdown: { shikiConfig: { theme: 'github-light' } },
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', ru: 'ru' } } }),
  ],
});
