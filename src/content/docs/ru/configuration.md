---
title: "Настройки"
description: "Настройки установки целиком хранятся в .env (см. .env.example). Всё, что касается команды, ботов, проектов, GitHub, ИИ и людей, настраивается в браузере на экране Настройки и хранится в базе данных."
order: 4
lang: ru
translated: true
source: "docs/ru/configuration.md"
---

Настройки установки целиком хранятся в `.env` (см. [.env.example](https://github.com/artemii1111/traildesk/blob/main/.env.example)). Всё, что касается команды,
ботов, проектов, GitHub, ИИ и людей, настраивается в браузере на экране **Настройки** и хранится в базе данных.

Docker-установка превращает `.env` в настройки Django; если TrailDesk — приложение внутри вашего сайта
([TrailDesk в своём Django-сайте](/ru/docs/embed/)), задайте то же самое в [словаре `TRAILDESK`](#настройки-traildesk).

## Установка

| Переменная | По умолчанию | Что это |
|---|---|---|
| `TRAILDESK_IMAGE_TAG` | `latest` | версия образа, которую использует `docker-compose.yml`; закрепите её (например, `0.2.0`) |
| `TRAILDESK_IMAGE` | `ghcr.io/artemii1111/traildesk` | имя образа — для форков |
| `SECRET_KEY` | — | **обязательно**, длинная случайная строка |
| `TRAILDESK_ENCRYPTION_KEY` | выводится из `SECRET_KEY` | ключ Fernet для токенов и ключей в базе; никогда его не меняйте |
| `POSTGRES_PASSWORD` | — | **обязательно** при `docker compose` |
| `POSTGRES_DB`, `POSTGRES_USER` | `traildesk` | имя базы и пользователь |
| `DEBUG` | `false` | режим отладки Django — никогда на публичном сервере |
| `TIME_ZONE` | `UTC` | часовой пояс по умолчанию; у проектов — свой |
| `LOG_LEVEL` | `INFO` | уровень логов всех контейнеров |
| `GUNICORN_WORKERS` | `3` | число веб-процессов |

## Адрес

| Переменная | По умолчанию | Что это |
|---|---|---|
| `TRAILDESK_DOMAIN` | — | домен установки; из него выводятся адрес, разрешённые хосты и источники CSRF. Пусто — локальный режим на `http://localhost:8000` |
| `TRAILDESK_PUBLIC_URL` | `https://TRAILDESK_DOMAIN` | публичный адрес, если он другой (порт, путь) |
| `TRAILDESK_URL_SCHEME` | `https` с доменом, иначе `http` | схема публичного адреса |
| `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS` | из домена | заменяют выведенные значения |
| `TRAILDESK_BIND`, `TRAILDESK_PORT` | `0.0.0.0`, `8000` | где открыт порт приложения; `127.0.0.1` за Caddy |
| `TRAILDESK_TELEGRAM_MODE` | `webhook` с доменом, иначе `polling` | как боты получают сообщения; для `polling` нужен сервис `poller` (`--profile polling`) |
| `TRAILDESK_DEFAULT_PROJECT` | единственный проект | куда ведут адреса `/api/backlog/…` без проекта |
| `TRAILDESK_SOURCE_URL` | этот репозиторий | ссылка «Исходный код» в подвале (AGPL) |

## Интеграции

| Переменная | Что это |
|---|---|
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_PROXY`, `LLM_TIMEOUT` | ИИ установки — используется, если у пространства своего нет, см. [ИИ](/ru/docs/ai/) |
| `TELEGRAM_API_BASE` | адрес Bot API, если `api.telegram.org` недоступен |
| `TRAILDESK_S3_*` | S3-совместимое хранилище для вложений; пусто — файлы на сервере |
| `BACKLOG_PAGE_ORIGINS` | другие сайты, которым можно обращаться к API бэклога из браузера (CORS), например тестовый стенд |
| `BACKLOG_TRIAGE_REQUIRE_OBSERVATION` | `true` — ИИ-разбор задач работает в пробном режиме, пока его качество не проверено |

## Настройки TRAILDESK

Для TrailDesk внутри вашего Django-сайта. Каждый ключ необязателен.

| Ключ | `.env` Docker-установки | По умолчанию |
|---|---|---|
| `PUBLIC_URL` | `TRAILDESK_PUBLIC_URL` / `TRAILDESK_DOMAIN` | `http://localhost:8000` |
| `TELEGRAM_MODE` | `TRAILDESK_TELEGRAM_MODE` | `webhook` для адреса `https://`, иначе `polling` |
| `TELEGRAM_API_BASE` | `TELEGRAM_API_BASE` | `https://api.telegram.org` |
| `DEFAULT_PROJECT` | `TRAILDESK_DEFAULT_PROJECT` | единственный проект |
| `ENCRYPTION_KEY` | `TRAILDESK_ENCRYPTION_KEY` | выводится из `SECRET_KEY` |
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_PROXY`, `LLM_TIMEOUT` | те же имена | без ключа, OpenRouter, `openai/gpt-4o-mini`, без прокси, 60 с |
| `TRIAGE_REQUIRE_OBSERVATION` | `BACKLOG_TRIAGE_REQUIRE_OBSERVATION` | `True` |
| `PAGE_ORIGINS` | `BACKLOG_PAGE_ORIGINS` | `[]` |
| `REPORT_BLOCKS` | `TRAILDESK_REPORT_BLOCKS` | `[]` |
| `SOURCE_URL` | `TRAILDESK_SOURCE_URL` | этот репозиторий |
| `VERSION` | — | версия установленного пакета |

`PUBLIC_URL` — адрес сайта без префикса TrailDesk: при `path('desk/', …)` и
`'PUBLIC_URL': 'https://example.com'` страницы проектов будут на `https://example.com/desk/<project>/`.
