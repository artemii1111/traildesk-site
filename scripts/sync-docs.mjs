// Copies the documentation from the TrailDesk repository into the site: node scripts/sync-docs.mjs ../traildesk
// Links between docs become site pages (/docs/<name>/), other relative links point to the repository on GitHub.
// The site build (.github/workflows/deploy.yml) runs it on a fresh checkout; src/content/docs keeps the last copy.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'https://github.com/artemii1111/traildesk';
// Order on the site; README.ru.md is the Russian README, not a doc page.
const DOCS = ['install', 'telegram', 'github', 'ai', 'configuration', 'operations', 'embed', 'weekly-reports', 'development'];

const src = process.argv[2];
if (!src || !existsSync(join(src, 'docs'))) {
  console.error('usage: node scripts/sync-docs.mjs <path to the traildesk repository>');
  process.exit(1);
}
const out = new URL('../src/content/docs/', import.meta.url);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const link = (target) => {
  if (/^(https?:|mailto:|#)/.test(target)) return target;
  const [path, hash] = target.split('#');
  const name = path.replace(/^\.\//, '').replace(/\.md$/, '');
  if (!path.includes('/') && DOCS.includes(name)) return `/docs/${name}/${hash ? '#' + hash : ''}`;
  const repoPath = path.replace(/^(\.\.\/)+/, '');
  const kind = repoPath.endsWith('/') ? 'tree' : 'blob';
  return `${REPO}/${kind}/main/${repoPath}${hash ? '#' + hash : ''}`;
};

DOCS.forEach((name, order) => {
  const md = readFileSync(join(src, 'docs', `${name}.md`), 'utf8');
  const [, title, rest] = md.match(/^# (.+)\n([\s\S]*)$/) || [];
  if (!title) throw new Error(`${name}.md: no "# Title" on the first line`);
  const body = rest.replace(/\]\(([^)\s]+)\)/g, (_, t) => `](${link(t)})`).trim();
  // Description for cards and <meta>: the first paragraph of plain text.
  const para = body.split(/\n\s*\n/).find((p) => !/^(#|```|\||[-*] |\d+\. |>)/.test(p.trim())) || '';
  const description = para.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`]/g, '').replace(/\s+/g, ' ').trim();
  const front = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description.slice(0, 220))}\norder: ${order}\n---\n\n`;
  writeFileSync(new URL(`${name}.md`, out), front + body + '\n');
});
console.log(`synced ${DOCS.length} docs from ${src}`);
