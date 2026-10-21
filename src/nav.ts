// Site sections in menu order: the order also decides which way pages slide (left or right).
export const SECTIONS = ['home', 'how', 'install', 'docs'] as const;
export type Section = (typeof SECTIONS)[number];

/** Address of a section: href('ru', 'docs', 'telegram') → '/ru/docs/telegram/'. */
export const href = (lang: string, section: Section, slug = '') =>
  (lang === 'ru' ? '/ru' : '') + (section === 'home' ? '/' : `/${section}/`) + (slug ? `${slug}/` : '');
