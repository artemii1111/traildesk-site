// Checks of the built site (dist/): both languages, hreflang, structured data, llms.txt, links to anchors.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';

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
  try { const data = JSON.parse(ld[1]); if (!data.some((d) => d['@type'] === 'SoftwareApplication')) fail.push(`${page}: no SoftwareApplication`); }
  catch { fail.push(`${page}: JSON-LD missing or invalid`); }
  for (const [, id] of html.matchAll(/href="#([\w-]+)"/g)) if (!html.includes(`id="${id}"`)) fail.push(`${page}: broken anchor #${id}`);
}
if (!read('llms.txt').startsWith('# TrailDesk')) fail.push('llms.txt must start with "# TrailDesk"');

// Every page: section pages exist in both languages, and internal links lead to built pages.
const pages = [];
const walk = (dir) => readdirSync(dir).forEach((f) => {
  const p = `${dir}/${f}`;
  if (statSync(p).isDirectory()) walk(p); else if (f === 'index.html') pages.push(p);
});
walk(new URL('../dist', import.meta.url).pathname);
const dist = new URL('../dist', import.meta.url).pathname;
for (const need of ['how', 'install', 'docs', 'docs/install', 'ru/how', 'ru/install', 'ru/docs', 'ru/docs/install']) {
  if (!existsSync(`${dist}/${need}/index.html`)) fail.push(`missing page /${need}/`);
}
for (const p of pages) {
  const html = readFileSync(p, 'utf8');
  for (const [, url] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = url.endsWith('/') ? `${dist}${url}index.html` : `${dist}${url}`;
    if (!existsSync(target)) fail.push(`${p.slice(dist.length)}: broken link ${url}`);
  }
}
if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log('site ok');
