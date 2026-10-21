---
title: "Installation"
description: "TrailDesk runs as a set of Docker containers: web (pages and API), worker and beat (background jobs and schedule), Postgres, Redis and, optionally, Caddy for HTTPS and poller for Telegram without a webhook."
order: 0
lang: en
translated: true
source: "docs/install.md"
---

TrailDesk runs as a set of Docker containers: **web** (pages and API), **worker** and **beat** (background jobs
and schedule), **Postgres**, **Redis** and, optionally, **Caddy** for HTTPS and **poller** for Telegram without a
webhook.

**How long it takes:** starting the containers — about 5 minutes; setting up the first project (bots, chat,
repository, people) — another 15–20 minutes. Just want to look around first? [Try it locally](#try-it-locally) —
no server and no domain needed.

## What you need

| | For a real installation | To try it locally |
|---|---|---|
| Docker + Compose v2.23+ | on a Linux server (1 CPU, 2 GB RAM is enough to start) | on your computer |
| Domain | a domain or subdomain with an **A record** to the server; ports **80** and **443** open | not needed |
| Telegram | a **login bot** and a **project bot** from [@BotFather](https://t.me/BotFather) (one bot can do both); the project's Telegram chat where the bot is an admin | the same |
| GitHub | a repository and a fine-grained token — [github.md](/docs/github/) | the same |
| AI | optional — [ai.md](/docs/ai/) | optional |

## Try it locally

Without a domain TrailDesk switches to local mode by itself: the address is `http://localhost:8000` and Telegram
messages are fetched by the **poller** service (long polling), so neither HTTPS nor open ports are needed.

```bash
mkdir traildesk && cd traildesk
curl -fsSLO https://raw.githubusercontent.com/artemii1111/traildesk/main/docker-compose.yml
printf 'SECRET_KEY=%s\nPOSTGRES_PASSWORD=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 16)" > .env
docker compose --profile polling up -d
docker compose exec web python manage.py traildesk_setup --code
```

Open http://localhost:8000 and go through the first-run wizard. Everything works like on a server, except that
GitHub cannot reach your computer, so the backlog page is rebuilt every 20 minutes and by the refresh button instead
of instantly. The same polling mode helps on a server that Telegram can't reach: set `TRAILDESK_TELEGRAM_MODE=polling`
and start with `--profile polling`.

## 1. Get the files

Only two files are needed on the server — the image is pulled from GitHub Container Registry:

```bash
mkdir traildesk && cd traildesk
curl -fsSLO https://raw.githubusercontent.com/artemii1111/traildesk/main/docker-compose.yml
curl -fsSL https://raw.githubusercontent.com/artemii1111/traildesk/main/.env.example -o .env
```

## 2. Fill in `.env`

Every setting is described in the file itself and in [configuration.md](/docs/configuration/). The minimum:

```bash
SECRET_KEY=...                  # openssl rand -base64 48
TRAILDESK_ENCRYPTION_KEY=...    # openssl rand -base64 32 | tr '+/' '-_'
POSTGRES_PASSWORD=...           # openssl rand -hex 16
TRAILDESK_DOMAIN=desk.example.com
TRAILDESK_BIND=127.0.0.1        # with the built-in Caddy the app port stays private
TRAILDESK_IMAGE_TAG=0.2.0       # pin a version; change it when you update
```

> Keep `SECRET_KEY` and `TRAILDESK_ENCRYPTION_KEY` safe and never change them later: tokens and keys stored in
> the database are encrypted with them.

## 3. Start

```bash
docker compose --profile https up -d
docker compose ps                 # web should become "healthy" in a minute
```

Caddy gets a Let's Encrypt certificate for `TRAILDESK_DOMAIN` on the first request.

### Behind your own proxy (nginx, Traefik…)

Start without the `https` profile — the app listens on `TRAILDESK_BIND:TRAILDESK_PORT` (default `0.0.0.0:8000`):

```bash
docker compose up -d
```

Proxy to it and pass the `Host` and `X-Forwarded-Proto` headers. nginx example:

```nginx
server {
    server_name desk.example.com;
    listen 443 ssl;                     # your certificate settings here
    client_max_body_size 25m;
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 4. First run

Create a **login bot** in [@BotFather](https://t.me/BotFather) (`/newbot`) — everybody logs in to the pages through it.

Open `https://desk.example.com/`. The first-run wizard asks for:

- **installation code** — it protects a fresh installation from strangers:
  `docker compose exec web python manage.py traildesk_setup --code` (or `docker compose logs web | grep setup`);
- **team name**, **login bot token** and **your Telegram @username**.

Then press **Log in**, confirm in the bot — you are the owner.

## 5. First project

In **Settings** (`/settings/`):

1. **Workspace → Telegram bots** — add a project bot (it may be the login bot too). See [telegram.md](/docs/telegram/).
2. **+ New project** → **Bot and chat** — pick the bot and the project chat.
3. **Repository** — `org/repo`, a token and the webhook. See [github.md](/docs/github/).
4. **Workspace → AI** — optional. See [ai.md](/docs/ai/).
5. **People in the project** — invite the client and the team with their roles.

## Without the browser

Everything the wizard does is also available from the command line:

```bash
docker compose exec web python manage.py traildesk_setup \
    --workspace acme --name "Acme Studio" --owner @your_username --login-bot-token 123:AAA… \
    [--project shop --title "Shop" --bot-token 456:BBB… --chat-id -100… --repo org/repo]
```

## From source

In a clone of the repository `deploy/docker-compose.dev.yml` builds the image from your code:

```bash
git clone https://github.com/artemii1111/traildesk && cd traildesk
cp .env.example .env && nano .env
docker compose -f docker-compose.yml -f deploy/docker-compose.dev.yml --profile https up -d --build
```
