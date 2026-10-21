---
title: "TrailDesk внутри вашего Django-сайта"
description: "Проще всего поставить TrailDesk через Docker. Если у вас уже есть Django-проект, TrailDesk может стать ещё одним приложением в нём, по любому адресу — например, https://example.com/desk/."
order: 6
lang: ru
translated: true
source: "docs/ru/embed.md"
---

Проще всего поставить TrailDesk [через Docker](/ru/docs/install/). Если у вас уже есть Django-проект, TrailDesk может стать
ещё одним приложением в нём, по любому адресу — например, `https://example.com/desk/`.

## 1. Установка

```bash
pip install "traildesk @ git+https://github.com/artemii1111/traildesk@main"
```

Когда пойдёте в работу, указывайте тег релиза вместо `main` (`@v0.2.0`) и перед переходом на следующий читайте
[журнал изменений](https://github.com/artemii1111/traildesk/blob/main/CHANGELOG.md).

Python 3.12+, Django 6.1. TrailDesk сам подтянет Django REST framework, django-cors-headers, Celery, httpx и
cryptography.

## 2. Настройки

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

Всё в `TRAILDESK` необязательно — см. [полный список](/ru/docs/configuration/#настройки-traildesk). Ключ с опечаткой
покажет `manage.py check`.

## 3. Адреса

```python
urlpatterns = [
    # …
    path('desk/', include('traildesk.urls')),
]
```

Страницы, API, кука входа и вебхуки идут вслед за префиксом. Адреса проектов — `desk/<проект>/`, поэтому проект
нельзя назвать `api`, `settings`, `setup` или `health`.

## 4. База данных и первый запуск

```bash
python manage.py migrate
python manage.py runserver
```

Откройте `/desk/` — мастер первого запуска попросит код установки, он есть в логе сервера. TrailDesk хранит данные
в своих таблицах (`traildesk_*`); на одном сайте — одна команда TrailDesk и сколько угодно проектов.

## 5. Фоновые задачи

Сообщения ботов, снимок страницы из GitHub, выжимки ИИ и напоминания работают в Celery. Используйте Celery вашего
сайта и добавьте расписание и очереди TrailDesk:

```python
from traildesk.celery_schedule import BEAT_SCHEDULE, TASK_ROUTES

CELERY_BEAT_SCHEDULE = {**BEAT_SCHEDULE}   # plus your own
CELERY_TASK_ROUTES = {**TASK_ROUTES}       # long tasks go to the "heavy" queue
```

Запустите воркер на обе очереди (`celery -A yoursite worker -Q default,heavy`) и `celery beat`. Кеш должен быть
общим для процессов (Redis): в нём живут входы и ограничения частоты запросов.

Telegram: при `PUBLIC_URL` на `https://` боты получают сообщения через вебхук. Без публичного адреса укажите
`'TELEGRAM_MODE': 'polling'` и запустите `python manage.py traildesk_poll` рядом с воркером.

## 6. Файлы

Вложения хранятся в вашем `STORAGES['default']`. Если файлы на диске, раздавайте `MEDIA_URL` так же, как остальные
медиафайлы.

## Рабочий пример

[`examples/host_site/`](https://github.com/artemii1111/traildesk/tree/main/examples/host_site//) — минимальный сайт с TrailDesk по адресу `/desk/`. При каждом
изменении CI собирает пакет, ставит его туда и открывает страницы.
