// llms.txt (https://llmstxt.org) and llms-full.txt — a plain-Markdown map of the site for AI assistants.
// Built from the same copy as the pages, so they never drift apart.
import en from './i18n/en';
import ru from './i18n/ru';
import { SITE, REPO, DISCUSSIONS, RELEASES, IMAGE, VERSION, INSTALL } from './consts';

const docs = (p: string) => `${REPO}/blob/main/docs/${p}`;

export function llms(): string {
  return `# TrailDesk

> ${en.meta.description}

TrailDesk ${VERSION} is a Django application (Celery, PostgreSQL, Redis) shipped as the Docker image \`${IMAGE}\`.
One installation serves one team and any number of projects; every project is one client with its own Telegram chat,
bot, GitHub repository and backlog page. The interface and bot messages are currently in Russian; English is in progress.

## Docs

- [Installation](${docs('install.md')}): server, DNS, .env, HTTPS, own proxy, first-run wizard
- [Telegram bots](${docs('telegram.md')}): login bot and project bots, chat, forum topics
- [GitHub](${docs('github.md')}): token, webhook, labels, how statuses are derived
- [AI](${docs('ai.md')}): any OpenAI-compatible provider, spend and monthly budget, privacy
- [Configuration](${docs('configuration.md')}): every .env setting
- [Operations](${docs('operations.md')}): updates, backups, logs, health check

## Project

- [Source code](${REPO}): GNU AGPL-3.0
- [Releases](${RELEASES})
- [Discussions](${DISCUSSIONS}): questions and feedback
- [Full text of this site](${SITE}/llms-full.txt)

## Optional

- [Русская версия сайта](${SITE}/ru/)
`;
}

function page(t: typeof en): string {
  const list = (items: { h: string; p: string }[]) => items.map((i) => `- **${i.h}.** ${i.p}`).join('\n');
  return `## ${t.hero.title}

${t.hero.lead}

### ${t.problem.title}

${list(t.problem.items)}

### ${t.how.title}

${t.how.steps.map((s, i) => `${i + 1}. **${s.h}.** ${s.p}`).join('\n')}

### ${t.features.title}

${list(t.features.items)}

### ${t.install.title}

${t.install.lead}

${INSTALL.map((c, i) => `${i + 1}. ${t.install.steps[i]}:\n\n\`\`\`bash\n${c}\n\`\`\``).join('\n\n')}

### ${t.faq.title}

${t.faq.items.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}
`;
}

export function llmsFull(): string {
  return `# TrailDesk — ${SITE}

> ${en.meta.description}

Source: ${REPO} · License: GNU AGPL-3.0 · Version: ${VERSION}

${page(en)}
---

# TrailDesk — ${SITE}/ru/ (по-русски)

${page(ru)}`;
}
