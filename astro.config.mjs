import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://traildesk.space',
  trailingSlash: 'always',
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', ru: 'ru' } } }),
  ],
});
