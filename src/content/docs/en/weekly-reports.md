---
title: "Weekly reports"
description: "The Reports tab of a backlog page shows one report per week. The numbers of the week (closed, new, days with a release) are counted from GitHub — don't repeat them in the text."
order: 7
lang: en
translated: true
source: "docs/weekly-reports.md"
---

The **Reports** tab of a backlog page shows one report per week. The numbers of the week (closed, new, days with a
release) are counted from GitHub — don't repeat them in the text.

For the current week the AI writes a draft from the closed tasks once a day and whenever the week changes; the page
marks it "prepared automatically". Finished weeks are left alone. A week without a report shows a plain list of the
closed tasks.

## Writing a report by hand

Put a file `YYYY-MM-DD.md` (the Monday of the week) into `.traildesk/reports/` on the `main` branch of the project
repository. What the file fills in wins over the AI draft; the rest is still written by the AI.

Write for a person who has not seen the code: what changed for a customer or an employee, where to see it, what to
click. Two to four stories — the main things, not everything (the page lists all tasks itself). Only what is checked:
before writing "on the site", check in the task window that the change has been released.

```
# Headline of the week — one idea, like in a newspaper

Коротко: one line for the "Report of the week" card.

Lead — a paragraph or two: what mattered most and what it means.

## Story

A paragraph: what changed, in plain words.

1. A step to see it
2. Another step

Ссылка: https://shop.example/… — link caption
Задачи: #499 #503

## What's next

- #418 — one line about the next task
```

The keywords are Russian until the interface is translated (#13): `Коротко:` (short summary), `Ссылка:` (link),
`Задачи:` (tasks). These lines and the numbered steps are optional; anything else becomes a paragraph of the story.
