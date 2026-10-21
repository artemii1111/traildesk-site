import { getCollection } from 'astro:content';

/** Documentation pages of one language, in site order; `slug` is the page name (install, telegram, …). */
export async function docsFor(lang: string) {
  return (await getCollection('docs', (d) => d.data.lang === lang))
    .sort((a, b) => a.data.order - b.data.order)
    .map((d) => ({ ...d, slug: d.id.split('/')[1] }));
}
