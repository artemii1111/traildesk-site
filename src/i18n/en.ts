// English copy of the site. ru.ts has the same shape — keep them in sync.
export default {
  lang: 'en',
  meta: {
    title: 'TrailDesk — a backlog your client actually reads',
    description:
      'Open-source, self-hosted bridge between a client and a dev team: a Telegram bot in the project chat, ' +
      'a backlog page for the client, statuses derived from GitHub. AGPL-3.0.',
  },
  nav: { how: 'How it works', features: 'Features', install: 'Install', faq: 'FAQ', github: 'GitHub' },
  hero: {
    eyebrow: 'Open source · self-hosted · AGPL-3.0',
    title: 'A backlog your client actually reads',
    lead:
      'The client writes in the Telegram chat and checks a simple backlog page. The team keeps working in GitHub. ' +
      'Nobody sets statuses by hand — TrailDesk derives them from pull requests, branches and deployments.',
    primary: 'Install in 5 minutes',
    secondary: 'View on GitHub',
    note: 'Free. Runs on your server with Docker.',
  },
  demo: {
    chatTitle: 'Project chat',
    client: 'Anna, client',
    clientMsg: '#task the "Buy" button does nothing on iPhone',
    bot: 'TrailDesk',
    botMsg: 'Task #128 created — the conversation and the screenshot are attached.',
    pageTitle: 'Backlog · Bookshop',
    rows: [
      { n: '#128', t: 'The "Buy" button does nothing on iPhone', s: 'Taken', k: 'taken' },
      { n: '#121', t: 'Delivery cost in the cart', s: 'Waiting for your decision', k: 'decide' },
      { n: '#117', t: 'New search by author', s: 'Live', k: 'done' },
    ],
    question: 'Show delivery cost before or after the address is entered?',
    answers: ['Before', 'After'],
  },
  problem: {
    title: 'Clients don’t open GitHub. Teams don’t leave it.',
    items: [
      { h: 'Status calls and “any news?”', p: 'The client asks in the chat, a manager retells GitHub by hand, and the answer is out of date by evening.' },
      { h: 'Decisions get lost in the chat', p: 'A question to the client scrolls away in a hundred messages; the task waits for weeks.' },
      { h: 'Two sources of truth', p: 'A spreadsheet for the client and issues for the team drift apart after the first week.' },
    ],
  },
  how: {
    title: 'How it works',
    steps: [
      { h: 'Write in the chat', p: 'The bot lives in the project’s Telegram chat. A message with #task or /task becomes a GitHub issue with the conversation and files attached.' },
      { h: 'The team works as usual', p: 'Branches, pull requests, reviews, deploys. TrailDesk reads these traces and moves the task: taken → done → verified → live.' },
      { h: 'The client sees the page', p: 'A clear backlog: the queue, what waits for their decision, the release calendar and weekly reports. One-click answers to questions.' },
    ],
  },
  features: {
    title: 'What’s inside',
    items: [
      { h: 'Statuses from GitHub', p: 'Derived from PRs, branches and deployments, not from someone remembering to drag a card.' },
      { h: 'Questions with one-click answers', p: 'The team asks “A or B?” — the client answers on the page or in the chat, the answer lands in the issue.' },
      { h: 'Roles and invitations', p: 'Owner, admin, manager, developer, client (decider or regular), viewer. Invite by @username or a link.' },
      { h: 'Any AI provider — optional', p: 'OpenRouter, OpenAI, Anthropic, Gemini, DeepSeek, Mistral, Groq or a local model in Ollama. Monthly spend and a budget limit.' },
      { h: 'Any number of projects', p: 'One installation per team, each client is a project with its own chat, bot, repository and page.' },
      { h: 'Your server, your data', p: 'Docker Compose with built-in HTTPS, backups, a health check. Tokens and keys are encrypted at rest.' },
    ],
  },
  install: {
    title: 'Install in 5 minutes',
    lead: 'A Linux server with Docker and a domain pointing to it. Two files — the image comes from GitHub.',
    steps: ['Download two files', 'Fill in .env', 'Start', 'Open your domain — the first-run wizard asks for this code'],
    docs: 'Step-by-step guide',
  },
  faq: {
    title: 'Questions',
    items: [
      { q: 'Is TrailDesk free?', a: 'Yes. It is open source under the GNU AGPL-3.0 license: run it, change it, fork it. If you offer a modified version to other people as a service, you share your source code under the same license.' },
      { q: 'Do my clients need a GitHub account?', a: 'No. Clients log in to the backlog page through Telegram with a 6-digit code. GitHub is only for the team.' },
      { q: 'Which AI does it use?', a: 'Any service with an OpenAI-compatible API — or none. Without AI everything works except task summaries, the question card and the weekly report text.' },
      { q: 'Where is the data stored?', a: 'On your own server: PostgreSQL for the data, Redis for background jobs, files on disk or in S3-compatible storage.' },
      { q: 'Which messengers are supported?', a: 'Telegram for now. The code is structured so that other messengers can be added later.' },
      { q: 'What language is the interface in?', a: 'The interface and bot messages are currently in Russian; English is in progress. The documentation is in English.' },
    ],
  },
  cta: { title: 'Try it on your next project', primary: 'Read the install guide', secondary: 'Ask in Discussions' },
  footer: {
    license: 'Open source under GNU AGPL-3.0',
    links: { github: 'GitHub', docs: 'Documentation', discussions: 'Discussions', releases: 'Releases', llms: 'llms.txt' },
    lang: 'По-русски',
  },
  copy: 'Copy',
  copied: 'Copied',
};
