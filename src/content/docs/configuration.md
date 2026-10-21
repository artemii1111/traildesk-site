---
title: "Configuration"
description: "Installation-wide settings live in .env (see .env.example). Everything about the team, bots, projects, GitHub, AI and people is configured in the browser on the Settings screen and stored in the database."
order: 4
---

Installation-wide settings live in `.env` (see [.env.example](https://github.com/artemii1111/traildesk/blob/main/.env.example)). Everything about the team, bots,
projects, GitHub, AI and people is configured in the browser on the **Settings** screen and stored in the database.

The Docker installation turns `.env` into Django settings; if TrailDesk is an app in your own site
([embed.md](/docs/embed/)), set the same things in the [`TRAILDESK` dictionary](#traildesk-settings).

## Installation

| Variable | Default | Meaning |
|---|---|---|
| `TRAILDESK_IMAGE_TAG` | `latest` | image version used by `docker-compose.yml`; pin it (e.g. `0.2.0`) |
| `TRAILDESK_IMAGE` | `ghcr.io/artemii1111/traildesk` | image name — for forks |
| `SECRET_KEY` | — | **required**, long random string |
| `TRAILDESK_ENCRYPTION_KEY` | derived from `SECRET_KEY` | Fernet key for tokens and keys in the database; never change it |
| `POSTGRES_PASSWORD` | — | **required** with `docker compose` |
| `POSTGRES_DB`, `POSTGRES_USER` | `traildesk` | database name and user |
| `DEBUG` | `false` | Django debug mode — never on a public server |
| `TIME_ZONE` | `UTC` | default time zone; projects have their own |
| `LOG_LEVEL` | `INFO` | log level of all containers |
| `GUNICORN_WORKERS` | `3` | web worker processes |

## Address

| Variable | Default | Meaning |
|---|---|---|
| `TRAILDESK_DOMAIN` | — | domain of the installation; the URL, allowed hosts and CSRF origins are derived from it. Empty — local mode at `http://localhost:8000` |
| `TRAILDESK_PUBLIC_URL` | `https://TRAILDESK_DOMAIN` | public URL, if it differs (port, path) |
| `TRAILDESK_URL_SCHEME` | `https` with a domain, otherwise `http` | scheme of the public URL |
| `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` | from the domain | override the derived values |
| `TRAILDESK_BIND`, `TRAILDESK_PORT` | `0.0.0.0`, `8000` | where the app port is published; `127.0.0.1` behind Caddy |
| `TRAILDESK_TELEGRAM_MODE` | `webhook` with a domain, otherwise `polling` | how bots receive messages; `polling` needs the `poller` service (`--profile polling`) |
| `TRAILDESK_DEFAULT_PROJECT` | the only project | where `/api/backlog/…` without a project leads |
| `TRAILDESK_SOURCE_URL` | this repository | "Source code" link in the footer (AGPL) |

## Integrations

| Variable | Meaning |
|---|---|
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_PROXY`, `LLM_TIMEOUT` | installation-wide AI, used when the workspace has none — see [ai.md](/docs/ai/) |
| `TELEGRAM_API_BASE` | Bot API address if `api.telegram.org` isn't reachable |
| `TRAILDESK_S3_*` | S3-compatible storage for attachments; empty — files on the server |
| `BACKLOG_PAGE_ORIGINS` | other sites allowed to call the backlog API from a browser (CORS), e.g. a test stand |
| `BACKLOG_TRIAGE_REQUIRE_OBSERVATION` | `true` — AI triage runs in a trial mode until its quality is checked |

## TRAILDESK settings

For TrailDesk inside your own Django site. Every key is optional.

| Key | `.env` of the Docker installation | Default |
|---|---|---|
| `PUBLIC_URL` | `TRAILDESK_PUBLIC_URL` / `TRAILDESK_DOMAIN` | `http://localhost:8000` |
| `TELEGRAM_MODE` | `TRAILDESK_TELEGRAM_MODE` | `webhook` for an `https://` address, otherwise `polling` |
| `TELEGRAM_API_BASE` | `TELEGRAM_API_BASE` | `https://api.telegram.org` |
| `DEFAULT_PROJECT` | `TRAILDESK_DEFAULT_PROJECT` | the only project |
| `ENCRYPTION_KEY` | `TRAILDESK_ENCRYPTION_KEY` | derived from `SECRET_KEY` |
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_PROXY`, `LLM_TIMEOUT` | the same names | no key, OpenRouter, `openai/gpt-4o-mini`, no proxy, 60 s |
| `TRIAGE_REQUIRE_OBSERVATION` | `BACKLOG_TRIAGE_REQUIRE_OBSERVATION` | `True` |
| `PAGE_ORIGINS` | `BACKLOG_PAGE_ORIGINS` | `[]` |
| `REPORT_BLOCKS` | `TRAILDESK_REPORT_BLOCKS` | `[]` |
| `SOURCE_URL` | `TRAILDESK_SOURCE_URL` | this repository |
| `VERSION` | — | version of the installed package |

`PUBLIC_URL` is the address of the site, without the TrailDesk prefix: with `path('desk/', …)` and
`'PUBLIC_URL': 'https://example.com'` the project pages are `https://example.com/desk/<project>/`.
