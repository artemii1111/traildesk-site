---
title: "Development"
description: "See CONTRIBUTING.md for the setup, tests and pull requests. This page is a map of the code."
order: 8
lang: en
translated: true
source: "docs/development.md"
---

See [CONTRIBUTING.md](https://github.com/artemii1111/traildesk/blob/main/.github/CONTRIBUTING.md) for the setup, tests and pull requests. This page is a map of the code.

```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt
pytest                                   # server tests: SQLite, no network
node --test traildesk/tests/page/*.test.mjs        # page tests
python manage.py migrate && python manage.py runserver
```

## Layout

TrailDesk is one Django app, `traildesk`, plus a thin Django project around it (`config/`) for the Docker
installation.

```
traildesk/
├── models.py, admin.py, apps.py   # models, Django admin
├── tasks/         # Celery tasks: chat.py (Telegram messages), backlog.py (snapshot, AI, files, reminders)
├── urls.py        # every TrailDesk address; a site mounts it at '' or under a prefix like 'desk/'
├── celery_schedule.py   # beat schedule and queues for the site's Celery
├── core/          # tenancy (project isolation), conf (project settings), app_settings (TRAILDESK = {…}), crypto, …
├── workspaces/    # roles, access, invitations, Settings screen API, first-run wizard
├── bots/          # Telegram: telegram (Bot API), registry (bots, webhooks), messages (chat → task), attachments,
│                  # chat_log, digest (evening report), reports
├── backlog/       # client backlog page: views (API), page/ (auth, actions, queue, pings, snapshot),
│                  # builder/ + sync (snapshot from GitHub), files, pages
├── tracker/       # GitHub API (GitLab later — the same interface)
├── ai/            # one request to any OpenAI-compatible API, task summaries, triage
├── management/commands/   # traildesk_setup, traildesk_poll, traildesk_bots, …
├── templates/traildesk/   # the pages: backlog.html (+ backlog/: style.css and the script in parts), settings,
│                          # home, setup; the server joins the parts into one page
├── migrations/
└── tests/         # pytest; tests/page/ — Node tests of the page scripts
config/            # Django project of the Docker installation: settings from .env, urls, Celery app
examples/host_site/   # another Django site with TrailDesk under /desk/ — CI installs the wheel into it
deploy/            # backup and restore, compose for building from source
```

Project isolation: every model with project data inherits `core.tenancy.ProjectScoped`; its default manager only
sees the current project and raises `NoProject` outside of one. Use `use_project(project)` in code and
`Model.all_objects` where all projects are meant (admin, maintenance).

The pages are plain HTML/CSS/JS without a build step; the server only injects addresses and the title, the data
comes from the API after login.

Addresses: never write a path like `/api/backlog/` in code. Use `conf.path('<name>')` (path on the site),
`conf.absolute_url('<name>')` (full address for Telegram, GitHub, messages) and `CFG.base` in page scripts — so
TrailDesk works both at the site root and under a prefix (`traildesk/tests/test_embedded.py`).

Settings: installation settings come from `traildesk.core.app_settings` (the `TRAILDESK` dictionary), never from
`django.conf.settings` directly; project settings come from `conf.cfg()`. New keys go to `app_settings.DEFAULTS`,
`config/settings.py` (from `.env`) and the table in [configuration.md](/docs/configuration/#traildesk-settings).

## Documentation

`docs/` is the English original, `docs/ru/` the Russian translation with the same file names and the same headings
order. Change both in one pull request; a page missing in `docs/ru/` shows the English text on the Russian site.
The site [traildesk.space](https://traildesk.space) builds its docs pages from these folders and rebuilds itself
when `docs/` changes on `main` (`.github/workflows/docs-site.yml`).

## Old issue numbers in comments

Comments like `(#591)` refer to the tracker of the project TrailDesk was extracted from; they have nothing to do with
issues of this repository.

## Releases

1. Move the **Unreleased** notes in `CHANGELOG.md` under a new version heading and put the version into `VERSION`.
2. Merge to `main`, then tag: `git tag v0.2.0 && git push origin v0.2.0` — or create a release with the tag `v0.2.0` on GitHub (**Releases → Draft a new release**).
3. The **Release** workflow checks that the tag equals `VERSION`, builds the image for amd64 and arm64, pushes
   `ghcr.io/artemii1111/traildesk:0.2.0`, `:0.2` and `:latest`, and creates a GitHub release from the changelog.
