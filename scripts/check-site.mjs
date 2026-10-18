// Checks of the built site (dist/): both languages, hreflang, structured data, llms.txt, links to anchors.
import { readFileSync, existsSync } from 'node:fs';

const fail = [];
const read = (p) => readFileSync(new URL(`../dist/${p}`, import.meta.url), 'utf8');
for (const f of ['index.html', 'ru/index.html', 'llms.txt', 'llms-full.txt', 'robots.txt', 'sitemap-index.xml', 'CNAME', 'og.png']) {
  if (!existsSync(new URL(`../dist/${f}`, import.meta.url))) fail.push(`missing dist/${f}`);
}
for (const [page, lang] of [['index.html', 'en'], ['ru/index.html', 'ru']]) {
  const html = read(page);
  if (!html.includes(`<html lang="${lang}"`)) fail.push(`${page}: lang is not ${lang}`);
  for (const h of ['en', 'ru', 'x-default']) if (!html.includes(`hreflang="${h}"`)) fail.push(`${page}: no hreflang ${h}`);
  const ld = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  try { const data = JSON.parse(ld[1]); if (!data.some((d) => d['@type'] === 'FAQPage')) fail.push(`${page}: no FAQPage`); }
  catch { fail.push(`${page}: JSON-LD missing or invalid`); }
  for (const [, id] of html.matchAll(/href="#([\w-]+)"/g)) if (!html.includes(`id="${id}"`)) fail.push(`${page}: broken anchor #${id}`);
}
if (!read('llms.txt').startsWith('# TrailDesk')) fail.push('llms.txt must start with "# TrailDesk"');
if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log('site ok');
