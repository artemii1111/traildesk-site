---
title: "GitHub"
description: "The team works in a GitHub repository as usual. TrailDesk reads issues, pull requests, branches and deployments, and writes issues, comments and labels when the client acts on the page or in the chat."
order: 2
lang: en
translated: true
source: "docs/github.md"
---

The team works in a GitHub repository as usual. TrailDesk reads issues, pull requests, branches and deployments,
and writes issues, comments and labels when the client acts on the page or in the chat.

## Token

Create a **fine-grained personal access token** (GitHub → Settings → Developer settings → Fine-grained tokens)
for the repositories of your projects:

| Permission | Access |
|---|---|
| Issues | Read and write |
| Pull requests | Read and write |
| Contents | Read |
| Metadata | Read (always on) |

Put it into **Workspace → GitHub access** (shared by all projects) or into a project's **Repository** section.

## Webhook

**Project → Repository** shows the webhook address and secret. In the repository: **Settings → Webhooks →
Add webhook**:

- Payload URL — the address from the settings (`https://<domain>/<project>/api/backlog/github-hook/`);
- Content type — `application/json`;
- Secret — the secret from the settings;
- Events — *Issues, Issue comments, Labels, Milestones, Pull requests, Pull request reviews, Pushes, Branch or tag
  creation, Branch or tag deletion* (or "Send me everything" — other events are ignored).

Without a webhook the page is still rebuilt every 20 minutes and on the refresh button.

## Labels

The page shows issues with the `бэклог` label and derives their status from labels and traces in GitHub.
The service labels are fixed for now (configurable labels in other languages — [issue #18](https://github.com/artemii1111/traildesk/issues/18)):

| Label | Meaning |
|---|---|
| `бэклог` | the task is visible on the client's page |
| `решение` | waiting for the client's decision |
| `ждём` | waiting for a third party |
| `взята`, `проверить`, `проверено` | stages when the work isn't visible in code |
| `срочно`, `важно`, `после-запуска` | urgency |
| `bug`, `enhancement`, `дизайн`, `контент` | task type |

Areas (sections), hashtags, bot commands and a special "from the boss" label are configured per project in
**Settings**.

## How a status is derived

Nobody sets a status by hand — buttons on the page change the same labels. Rules are checked top to bottom, the
first one that matches wins:

| Status | When |
|---|---|
| Waiting for decision · Waiting for others | label `решение` or `ждём` — stronger than anything else |
| Live | the issue is closed and its commits are in a production deployment |
| Verified | someone pressed "Verified", or the issue is closed but not deployed yet |
| Done | the code is in `main`, the issue is still open ("not verified for N days" after two days) |
| Taken | an open PR or a branch with the issue number ("stuck" after 3 days without commits) |
| In queue · New | no traces of work ("new" — created within 2 days) |

The page shows the same table under "How the status is calculated".

## Deployments ("Live")

To know what is in production, TrailDesk currently looks at, in this order:

- successful runs of a GitHub Actions workflow named **`Deploy`** whose job is named like `prod ← sha-<commit>`;
- the deployment journal (`manage.py backlog_record_deploy sha-<commit>` on the TrailDesk server);
- the head of the newest `release/*` branch — move it to the deployed commit after each deployment.

Without any of them tasks stop at "Verified"/"Done". A simpler, generic way to report deployments (GitHub
Deployments, releases or a webhook) is planned — [issue #22](https://github.com/artemii1111/traildesk/issues/22).
