---
title: "Telegram bots"
description: "TrailDesk uses two kinds of bots. Both are created in @BotFather with /newbot; one bot can play both roles."
order: 1
---

TrailDesk uses two kinds of bots. Both are created in [@BotFather](https://t.me/BotFather) with `/newbot`;
one bot can play both roles.

| | Login bot | Project bot |
|---|---|---|
| What for | everybody logs in to the pages through it (a 6-digit code) | lives in the project chat: tasks, digest, reminders |
| How many | one per installation | one per project, or one for several projects |
| Where to add | wizard `/setup/` | **Settings → Workspace → Telegram bots** |

When you add a bot, TrailDesk checks the token, saves it encrypted and registers the webhook
`https://<domain>/api/telegram/<id>/webhook/` with its own secret. Telegram can only call HTTPS addresses, so the
domain must already open over HTTPS.

## The project chat

1. Add the project bot to the chat **as an administrator** — otherwise it doesn't see messages.
   The chat then appears in **Project → Bot and chat**.
2. For a forum chat, turn on **Topics** in the chat settings. TrailDesk remembers topics as people write in them;
   choose where the digest goes.
3. **Commands and markers** — turn bot commands on or off and limit them by role.

## In the chat

- `#задача <text>` or `/task` as a reply to a message — create a task; the conversation and pictures are attached.
- `/list` — open tasks, `/report` — what happened today, `/help`.
- An evening digest at the project's hour (time zone — **Project → Main**).
- Reminders when someone was asked a question and hasn't answered; only during the project's hours.

## Webhook or polling

- **Webhook** (default with a domain): Telegram calls `https://<domain>/api/telegram/<id>/webhook/`. Needs HTTPS and
  a server reachable from the internet.
- **Polling** (default without a domain): the `poller` service fetches messages of all bots itself
  (`docker compose --profile polling up -d`). No domain, HTTPS or open ports — for trying TrailDesk locally and for
  servers that Telegram can't reach. Set `TRAILDESK_TELEGRAM_MODE=polling` to use it with a domain too.

If a bot's token is revoked in @BotFather, the bot shows an error in **Settings → Telegram bots**; connect it again
with the new token. After changing the domain, re-register webhooks: `manage.py traildesk_bots --sync`.

## Telegram is blocked on your server?

Use polling (above) or set `TELEGRAM_API_BASE` to a [local Bot API server](https://github.com/tdlib/telegram-bot-api)
or another proxy for `api.telegram.org`.
