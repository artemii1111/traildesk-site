---
title: "TrailDesk inside your Django site"
description: "The Docker installation is the easy way. If you already run a Django project, TrailDesk can be one more app in it, at any address — for example https://example.com/desk/."
order: 6
lang: en
translated: true
source: "docs/embed.md"
---

The [Docker installation](/docs/install/) is the easy way. If you already run a Django project, TrailDesk can be one more
app in it, at any address — for example `https://example.com/desk/`.

## 1. Install

```bash
pip install "traildesk @ git+https://github.com/artemii1111/traildesk@main"
```

Pin a release tag instead of `main` (`@v0.2.0`) once you go live, and read the [changelog](https://github.com/artemii1111/traildesk/blob/main/CHANGELOG.md)
before moving to the next one.

Python 3.12+, Django 6.1. TrailDesk brings Django REST framework, django-cors-headers, Celery, httpx and
cryptography with it.

## 2. Settings

```python
INSTALLED_APPS = [
    # …your apps; django.contrib.auth, contenttypes and sessions are needed
    'rest_framework',
    'corsheaders',
    'traildesk',
]

MIDDLEWARE = [
    # …
    'corsheaders.middleware.CorsMiddleware',             # before CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    # …
    'traildesk.core.middleware.TenantMiddleware',        # only acts on TrailDesk pages
]

TRAILDESK = {
    'PUBLIC_URL': 'https://example.com',   # the site address: Telegram and GitHub call it back
}
```

Everything in `TRAILDESK` is optional — see the [full list](/docs/configuration/#traildesk-settings). `manage.py check`
reports a misspelled key.

## 3. URLs

```python
urlpatterns = [
    # …
    path('desk/', include('traildesk.urls')),
]
```

Pages, the API, the login cookie and webhooks follow the prefix. Project addresses are `desk/<project>/`, so a
project can't be named `api`, `settings`, `setup` or `health`.

## 4. Database and first run

```bash
python manage.py migrate
python manage.py runserver
```

Open `/desk/` — the first-run wizard asks for a setup code, which is printed in the server log. TrailDesk keeps its
data in its own tables (`traildesk_*`); one site has one TrailDesk team with any number of projects.

## 5. Background tasks

Bot messages, the page snapshot from GitHub, AI summaries and reminders run in Celery. Use your site's Celery app and
add TrailDesk's schedule and queues:

```python
from traildesk.celery_schedule import BEAT_SCHEDULE, TASK_ROUTES

CELERY_BEAT_SCHEDULE = {**BEAT_SCHEDULE}   # plus your own
CELERY_TASK_ROUTES = {**TASK_ROUTES}       # long tasks go to the "heavy" queue
```

Run a worker for both queues (`celery -A yoursite worker -Q default,heavy`) and `celery beat`. The cache should be
shared between processes (Redis): logins and rate limits live there.

Telegram: with an `https://` `PUBLIC_URL` bots get messages by webhook. Without a public address set
`'TELEGRAM_MODE': 'polling'` and run `python manage.py traildesk_poll` next to the worker.

## 6. Files

Attachments use your `STORAGES['default']`. With files on disk, serve `MEDIA_URL` like the rest of your media.

## A working example

[`examples/host_site/`](https://github.com/artemii1111/traildesk/tree/main/examples/host_site//) is a minimal site with TrailDesk under `/desk/`. CI builds the
package, installs it there and opens the pages on every change.
