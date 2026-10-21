---
title: "Обслуживание"
description: "Миграции базы данных выполняются сами при запуске веб-контейнера. Проверьте docker compose ps и /health/."
order: 5
lang: ru
translated: true
source: "docs/ru/operations.md"
---

## Обновление

1. Прочитайте [журнал изменений](https://github.com/artemii1111/traildesk/blob/main/CHANGELOG.md) для версий между вашей и новой. До 1.0 минорная версия может
   требовать дополнительных шагов — они перечислены там.
2. Сделайте резервную копию (ниже).
3. Поменяйте `TRAILDESK_IMAGE_TAG` в `.env` и выполните:

```bash
docker compose pull
docker compose --profile https up -d      # without the profile if you use your own proxy
```

Миграции базы данных выполняются сами при запуске веб-контейнера. Проверьте `docker compose ps` и `/health/`.

## Резервная копия и восстановление

```bash
./deploy/backup.sh                 # → backups/traildesk-<date>.sql.gz and traildesk-media-<date>.tar.gz
```

Скрипты лежат в репозитории (`deploy/`); на сервере, где есть только `docker-compose.yml`, скачайте их рядом с ним.
Храните копии не на сервере и сохраните `.env` — без `TRAILDESK_ENCRYPTION_KEY` сохранённые токены не расшифровать.

Восстановление в новую установку:

```bash
docker compose up -d db
./deploy/restore.sh backups/traildesk-<date>.sql.gz backups/traildesk-media-<date>.tar.gz
docker compose --profile https up -d
```

## Состояние и логи

- `GET /health/` — `200 {"ok": true, "version": …, "db": "ok", "cache": "ok"}` или `503`. По нему Docker определяет
  состояние веб-контейнера; направьте на него свой мониторинг.
- Логи: `docker compose logs -f web worker beat`.
- Версия также видна в подвале каждой страницы.

## Админка

Админка Django (`/admin/`) — только для владельца сервера:

```bash
docker compose exec web python manage.py createsuperuser
```

Повседневные настройки — на экране **Настройки**; админка нужна, чтобы посмотреть данные, и на крайний случай.

## Полезные команды

```bash
docker compose exec web python manage.py traildesk_setup --code     # first-run wizard code
docker compose exec web python manage.py traildesk_bots [--sync]    # bots and webhooks; --sync after a domain change
docker compose exec web python manage.py backlog_record_deploy sha-<commit>   # record a deployment
```
