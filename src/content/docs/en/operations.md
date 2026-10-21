---
title: "Operations"
description: "Database migrations run automatically when the web container starts. Check docker compose ps and /health/."
order: 5
lang: en
translated: true
source: "docs/operations.md"
---

## Update

1. Read the [changelog](https://github.com/artemii1111/traildesk/blob/main/CHANGELOG.md) for the versions between yours and the new one. Until 1.0 a minor version
   may need extra steps — they are listed there.
2. Make a backup (below).
3. Change `TRAILDESK_IMAGE_TAG` in `.env` and run:

```bash
docker compose pull
docker compose --profile https up -d      # without the profile if you use your own proxy
```

Database migrations run automatically when the web container starts. Check `docker compose ps` and `/health/`.

## Backup and restore

```bash
./deploy/backup.sh                 # → backups/traildesk-<date>.sql.gz and traildesk-media-<date>.tar.gz
```

The scripts are in the repository (`deploy/`); on a server with only `docker-compose.yml`, download them next to it.
Keep backups off the server and keep `.env` too — without `TRAILDESK_ENCRYPTION_KEY` the stored tokens cannot be
decrypted.

Restore into a fresh installation:

```bash
docker compose up -d db
./deploy/restore.sh backups/traildesk-<date>.sql.gz backups/traildesk-media-<date>.tar.gz
docker compose --profile https up -d
```

## Health and logs

- `GET /health/` — `200 {"ok": true, "version": …, "db": "ok", "cache": "ok"}` or `503`. Docker uses it for the
  web container's health status; point your monitoring at it.
- Logs: `docker compose logs -f web worker beat`.
- The version is also shown in the footer of every page.

## Admin

The Django admin (`/admin/`) is for the server owner only:

```bash
docker compose exec web python manage.py createsuperuser
```

Day-to-day settings are on the **Settings** screen; the admin is for inspecting data and emergencies.

## Useful commands

```bash
docker compose exec web python manage.py traildesk_setup --code     # first-run wizard code
docker compose exec web python manage.py traildesk_bots [--sync]    # bots and webhooks; --sync after a domain change
docker compose exec web python manage.py backlog_record_deploy sha-<commit>   # record a deployment
```
