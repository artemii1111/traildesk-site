// Documentation pages — copied from the TrailDesk repository by scripts/sync-docs.mjs.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/docs' }),
  schema: z.object({ title: z.string(), description: z.string(), order: z.number() }),
});

export const collections = { docs };
