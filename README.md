# traildesk.space

Website of [TrailDesk](https://github.com/artemii1111/traildesk) — a backlog your client actually reads.
English at `/`, Russian at `/ru/`.

Built with [Astro](https://astro.build) into plain HTML: no client-side rendering, so search engines and AI assistants
read the full text. Also published: [`/llms.txt`](https://traildesk.space/llms.txt) and
[`/llms-full.txt`](https://traildesk.space/llms-full.txt), Schema.org data (SoftwareApplication, FAQPage), sitemap and
a `robots.txt` that welcomes AI crawlers.

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build && npm run check
```

- Texts: `src/i18n/en.ts` and `src/i18n/ru.ts` (same structure — change both).
- Page: `src/components/Home.astro`, styles: `src/styles/site.css` (the palette of the product).
- `llms.txt` is generated from the same texts: `src/llms.ts`.

Every push to `main` deploys to GitHub Pages. License: [GNU AGPL-3.0](LICENSE), like TrailDesk.
