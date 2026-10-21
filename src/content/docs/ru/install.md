---
title: "Установка"
description: "TrailDesk работает как набор Docker-контейнеров: web (страницы и API), worker и beat (фоновые задачи и расписание), Postgres, Redis и, по желанию, Caddy для HTTPS и poller для Telegram без вебхука."
order: 0
lang: ru
translated: true
source: "docs/ru/install.md"
---

TrailDesk работает как набор Docker-контейнеров: **web** (страницы и API), **worker** и **beat** (фоновые задачи
и расписание), **Postgres**, **Redis** и, по желанию, **Caddy** для HTTPS и **poller** для Telegram без
вебхука.

**Сколько это занимает:** запуск контейнеров — около 5 минут; настройка первого проекта (боты, чат,
репозиторий, люди) — ещё 15–20 минут. Хотите сначала просто посмотреть? [Попробуйте локально](#попробовать-локально) —
ни сервер, ни домен не нужны.

## Что понадобится

| | Для настоящей установки | Чтобы попробовать локально |
|---|---|---|
| Docker + Compose v2.23+ | на сервере с Linux (для начала хватит 1 CPU и 2 ГБ памяти) | на вашем компьютере |
| Домен | домен или поддомен с **A-записью** на сервер; открыты порты **80** и **443** | не нужен |
| Telegram | **бот входа** и **бот проекта** от [@BotFather](https://t.me/BotFather) (один бот может быть обоими); Telegram-чат проекта, где бот — администратор | то же самое |
| GitHub | репозиторий и fine-grained токен — см. [GitHub](/ru/docs/github/) | то же самое |
| ИИ | по желанию — см. [ИИ](/ru/docs/ai/) | по желанию |

## Попробовать локально

Без домена TrailDesk сам переходит в локальный режим: адрес — `http://localhost:8000`, а сообщения Telegram
забирает сервис **poller** (long polling), поэтому не нужны ни HTTPS, ни открытые порты.

```bash
mkdir traildesk && cd traildesk
curl -fsSLO https://raw.githubusercontent.com/artemii1111/traildesk/main/docker-compose.yml
printf 'SECRET_KEY=%s\nPOSTGRES_PASSWORD=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 16)" > .env
docker compose --profile polling up -d
docker compose exec web python manage.py traildesk_setup --code
```

Откройте http://localhost:8000 и пройдите мастер первого запуска. Всё работает как на сервере, кроме одного:
GitHub не может достучаться до вашего компьютера, поэтому страница бэклога пересобирается раз в 20 минут и по кнопке
«Обновить», а не сразу. Тот же режим polling выручит и на сервере, до которого не достучаться Telegram: задайте
`TRAILDESK_TELEGRAM_MODE=polling` и запускайте с `--profile polling`.

## 1. Скачать файлы

На сервере нужны только два файла — образ скачивается из GitHub Container Registry:

```bash
mkdir traildesk && cd traildesk
curl -fsSLO https://raw.githubusercontent.com/artemii1111/traildesk/main/docker-compose.yml
curl -fsSL https://raw.githubusercontent.com/artemii1111/traildesk/main/.env.example -o .env
```

## 2. Заполнить `.env`

Каждая настройка описана в самом файле и в разделе [Настройки](/ru/docs/configuration/). Минимум:

```bash
SECRET_KEY=...                  # openssl rand -base64 48
TRAILDESK_ENCRYPTION_KEY=...    # openssl rand -base64 32 | tr '+/' '-_'
POSTGRES_PASSWORD=...           # openssl rand -hex 16
TRAILDESK_DOMAIN=desk.example.com
TRAILDESK_BIND=127.0.0.1        # with the built-in Caddy the app port stays private
TRAILDESK_IMAGE_TAG=0.2.0       # pin a version; change it when you update
```

> Храните `SECRET_KEY` и `TRAILDESK_ENCRYPTION_KEY` в надёжном месте и никогда их потом не меняйте: ими зашифрованы
> токены и ключи в базе данных.

## 3. Запустить

```bash
docker compose --profile https up -d
docker compose ps                 # web should become "healthy" in a minute
```

Caddy получит сертификат Let's Encrypt для `TRAILDESK_DOMAIN` при первом запросе.

### За своим прокси (nginx, Traefik…)

Запускайте без профиля `https` — приложение слушает `TRAILDESK_BIND:TRAILDESK_PORT` (по умолчанию `0.0.0.0:8000`):

```bash
docker compose up -d
```

Проксируйте запросы на него и передавайте заголовки `Host` и `X-Forwarded-Proto`. Пример для nginx:

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

## 4. Первый запуск

Создайте **бота входа** в [@BotFather](https://t.me/BotFather) (`/newbot`) — через него все входят на страницы.

Откройте `https://desk.example.com/`. Мастер первого запуска попросит:

- **код установки** — он защищает свежую установку от посторонних:
  `docker compose exec web python manage.py traildesk_setup --code` (или `docker compose logs web | grep setup`);
- **название команды**, **токен бота входа** и **ваш @username в Telegram**.

Затем нажмите «Войти» и подтвердите вход в боте — вы владелец.

## 5. Первый проект

В «Настройках» (`/settings/`):

1. «Пространство» → «Боты Telegram» — добавьте бота проекта (им может быть и бот входа). См. [Боты Telegram](/ru/docs/telegram/).
2. «Новый проект» → «Бот и чат» — выберите бота и чат проекта.
3. «Репозиторий» — `org/repo`, токен и вебхук. См. [GitHub](/ru/docs/github/).
4. «Пространство» → «ИИ» — по желанию. См. [ИИ](/ru/docs/ai/).
5. «Участники проекта» — пригласите заказчика и команду с их ролями.

## Без браузера

Всё, что делает мастер, доступно и из командной строки:

```bash
docker compose exec web python manage.py traildesk_setup \
    --workspace acme --name "Acme Studio" --owner @your_username --login-bot-token 123:AAA… \
    [--project shop --title "Shop" --bot-token 456:BBB… --chat-id -100… --repo org/repo]
```

## Из исходного кода

В клоне репозитория `deploy/docker-compose.dev.yml` собирает образ из вашего кода:

```bash
git clone https://github.com/artemii1111/traildesk && cd traildesk
cp .env.example .env && nano .env
docker compose -f docker-compose.yml -f deploy/docker-compose.dev.yml --profile https up -d --build
```
