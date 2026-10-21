// Documentation pages in both languages (en/<name>, ru/<name>) — copied from the TrailDesk repository
// by scripts/sync-docs.mjs: English from docs/, Russian from docs/ru/.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(), description: z.string(), order: z.number(),
    lang: z.enum(['en', 'ru']), translated: z.boolean(), source: z.string(),
  }),
});

export const collections = { docs };
