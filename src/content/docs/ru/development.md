---
title: "Разработка"
description: "Как настроить окружение, запускать тесты и присылать изменения — в CONTRIBUTING.md. Эта страница — карта кода."
order: 8
lang: ru
translated: true
source: "docs/ru/development.md"
---

Как настроить окружение, запускать тесты и присылать изменения — в [CONTRIBUTING.md](https://github.com/artemii1111/traildesk/blob/main/.github/CONTRIBUTING.md).
Эта страница — карта кода.

```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt
pytest                                   # server tests: SQLite, no network
node --test traildesk/tests/page/*.test.mjs        # page tests
python manage.py migrate && python manage.py runserver
```

## Устройство

TrailDesk — одно Django-приложение `traildesk` и тонкий Django-проект вокруг него (`config/`) для установки через
Docker.

```
traildesk/
├── models.py, admin.py, apps.py   # модели, админка Django
├── tasks/         # задачи Celery: chat.py (сообщения Telegram), backlog.py (снимок, ИИ, файлы, напоминания)
├── urls.py        # все адреса TrailDesk; сайт подключает их в '' или под префикс вроде 'desk/'
├── celery_schedule.py   # расписание и очереди для Celery сайта
├── core/          # tenancy (разделение проектов), conf (настройки проекта), app_settings (TRAILDESK = {…}), crypto, …
├── workspaces/    # роли, доступ, приглашения, API экрана «Настройки», мастер первого запуска
├── bots/          # Telegram: telegram (Bot API), registry (боты, вебхуки), messages (сообщение → задача), attachments,
│                  # chat_log, digest (вечерний отчёт), reports
├── backlog/       # страница бэклога для заказчика: views (API), page/ (вход, действия, очередь, «позвать», снимок),
│                  # builder/ + sync (снимок из GitHub), files, pages
├── tracker/       # API GitHub (позже GitLab — с тем же интерфейсом)
├── ai/            # один запрос к любому OpenAI-совместимому API, выжимки задач, разбор задач
├── management/commands/   # traildesk_setup, traildesk_poll, traildesk_bots, …
├── templates/traildesk/   # страницы: backlog.html (+ backlog/: style.css и скрипт по частям), settings,
│                          # home, setup; сервер склеивает части в одну страницу
├── migrations/
└── tests/         # pytest; tests/page/ — Node-тесты скриптов страницы
config/            # Django-проект Docker-установки: настройки из .env, urls, приложение Celery
examples/host_site/   # другой Django-сайт с TrailDesk под /desk/ — CI ставит в него собранный пакет
deploy/            # бэкап и восстановление, compose для сборки из исходников
```

Разделение проектов: каждая модель с данными проекта наследует `core.tenancy.ProjectScoped`; её менеджер по
умолчанию видит только текущий проект и вне проекта выдаёт `NoProject`. В коде используйте `use_project(project)`,
а `Model.all_objects` — там, где нужны все проекты (админка, обслуживание).

Страницы — обычные HTML/CSS/JS без сборки; сервер подставляет в них только адреса и название, данные приходят
из API после входа.

Адреса: никогда не пишите в коде путь вроде `/api/backlog/`. Используйте `conf.path('<имя>')` (путь на сайте),
`conf.absolute_url('<имя>')` (полный адрес для Telegram, GitHub, сообщений) и `CFG.base` в скриптах страниц — тогда
TrailDesk работает и в корне сайта, и под префиксом (`traildesk/tests/test_embedded.py`).

Настройки: настройки установки берутся из `traildesk.core.app_settings` (словарь `TRAILDESK`), никогда напрямую из
`django.conf.settings`; настройки проекта — из `conf.cfg()`. Новые ключи добавляются в `app_settings.DEFAULTS`,
`config/settings.py` (из `.env`) и в таблицу в [настройках](/ru/docs/configuration/#настройки-traildesk).

## Документация

`docs/` — английский оригинал, `docs/ru/` — русский перевод с теми же именами файлов и тем же порядком заголовков.
Меняйте оба в одном pull request; если страницы нет в `docs/ru/`, русский сайт покажет английский текст. Сайт
[traildesk.space](https://traildesk.space) собирает страницы документации из этих папок и пересобирается сам, когда
`docs/` меняется в `main` (`.github/workflows/docs-site.yml`).

## Старые номера задач в комментариях

Комментарии вроде `(#591)` ссылаются на трекер проекта, из которого вырос TrailDesk; к задачам этого репозитория они
отношения не имеют.


## Релизы

1. Перенесите записи из **Unreleased** в `CHANGELOG.md` под заголовок новой версии и впишите версию в `VERSION`.
2. Слейте в `main`, затем поставьте тег: `git tag v0.2.0 && git push origin v0.2.0` — или создайте на GitHub релиз с тегом `v0.2.0` (**Releases → Draft a new release**).
3. Workflow **Release** проверит, что тег совпадает с `VERSION`, соберёт образ для amd64 и arm64, опубликует
   `ghcr.io/artemii1111/traildesk:0.2.0`, `:0.2` и `:latest` и создаст релиз на GitHub по журналу изменений.
