// Copies the documentation from the TrailDesk repository into the site: node scripts/sync-docs.mjs ../traildesk
// English comes from docs/, Russian from docs/ru/ (same file names); a page missing in Russian falls back to English.
// Links between docs become site pages (/docs/<name>/ or /ru/docs/<name>/), other relative links point to GitHub.
// The site build (.github/workflows/deploy.yml) runs it on a fresh checkout; src/content/docs keeps the last copy.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, posix } from 'node:path';

const REPO = 'https://github.com/artemii1111/traildesk';
// Order on the site; README files are not doc pages.
const DOCS = ['install', 'telegram', 'github', 'ai', 'configuration', 'operations', 'embed', 'weekly-reports', 'development'];
const LANGS = { en: 'docs', ru: 'docs/ru' };

const src = process.argv[2];
if (!src || !existsSync(join(src, 'docs'))) {
  console.error('usage: node scripts/sync-docs.mjs <path to the traildesk repository>');
  process.exit(1);
}
const out = new URL('../src/content/docs/', import.meta.url);
rmSync(out, { recursive: true, force: true });

// A link in a file of folder `dir` (e.g. "docs/ru") → site page or GitHub address.
const link = (target, dir, lang) => {
  if (/^(https?:|mailto:|#)/.test(target)) return target;
  const [path, hash] = target.split('#');
  const anchor = hash ? '#' + hash : '';
  const repoPath = posix.normalize(posix.join(dir, path));
  const name = posix.basename(repoPath, '.md');
  if (posix.dirname(repoPath) === dir && repoPath.endsWith('.md') && DOCS.includes(name)) {
    return `${lang === 'ru' ? '/ru' : ''}/docs/${name}/${anchor}`;
  }
  const kind = path.endsWith('/') ? 'tree' : 'blob';
  return `${REPO}/${kind}/main/${repoPath}${path.endsWith('/') ? '/' : ''}${anchor}`;
};

let fallback = 0;
for (const [lang, folder] of Object.entries(LANGS)) {
  mkdirSync(new URL(`${lang}/`, out), { recursive: true });
  DOCS.forEach((name, order) => {
    let dir = folder, file = join(src, folder, `${name}.md`);
    const translated = existsSync(file);
    if (!translated) { dir = LANGS.en; file = join(src, dir, `${name}.md`); fallback++; }
    const md = readFileSync(file, 'utf8');
    const [, title, rest] = md.match(/^# (.+)\n([\s\S]*)$/) || [];
    if (!title) throw new Error(`${file}: no "# Title" on the first line`);
    const body = rest.replace(/\]\(([^)\s]+)\)/g, (_, t) => `](${link(t, dir, lang)})`).trim();
    // Description for cards and <meta>: the first paragraph of plain text.
    const para = body.split(/\n\s*\n/).find((p) => !/^(#|```|\||[-*] |\d+\. |>)/.test(p.trim())) || '';
    const description = para.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '').replace(/\s+/g, ' ').trim();
    const front = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description.slice(0, 220))}\n` +
      `order: ${order}\nlang: ${lang}\ntranslated: ${lang === 'en' || translated}\nsource: ${JSON.stringify(`${dir}/${name}.md`)}\n---\n\n`;
    writeFileSync(new URL(`${lang}/${name}.md`, out), front + body + '\n');
  });
}
console.log(`synced ${DOCS.length} docs × ${Object.keys(LANGS).length} languages from ${src}` +
  (fallback ? ` (${fallback} Russian page(s) fall back to English)` : ''));
