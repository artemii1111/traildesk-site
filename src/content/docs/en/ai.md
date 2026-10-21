---
title: "AI"
description: "AI is optional — without it everything works except task summaries, the question card, task triage (type and area) and the text of the weekly report."
order: 3
lang: en
translated: true
source: "docs/ai.md"
---

AI is optional — without it everything works except task summaries, the question card, task triage (type and area)
and the text of the weekly report.

## Provider

**Settings → Workspace → AI**: choose a provider — the API address and an example model are filled in — then paste
the key and press **Check**. Any service with an OpenAI-compatible Chat Completions API works:

| Provider | API address | Example model |
|---|---|---|
| OpenRouter (hundreds of models) | `https://openrouter.ai/api/v1` | `openai/gpt-4o-mini` |
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| Anthropic | `https://api.anthropic.com/v1` | `claude-haiku-5-5` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` | `gemini-2.5-flash` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` |
| Mistral | `https://api.mistral.ai/v1` | `mistral-small-latest` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| Ollama (your own server) | `http://ollama:11434/v1` | `llama3.1` — no key needed |

A project can use its own model for each feature (**Project → AI in the project**). If the provider isn't reachable
from the server directly, set a proxy.

Prefer fast, non-reasoning models: summaries are short, and reasoning models spend the answer budget on thinking.

## Spend and budget

Every request is recorded with its tokens and cost. **Workspace → AI** shows this month's spend per project.

- OpenRouter reports the cost of each request itself.
- For other providers enter the model's **price per 1M tokens** (input and output) — otherwise the cost is unknown.
- **Monthly limit, $** — when the spend reaches it, AI stops until the next month; everything else keeps working.

## Privacy

Task texts and chat fragments are sent to the provider you choose. Phone numbers and e-mail addresses are removed
before sending. Text from tasks is treated as untrusted data in the prompts. For full control, run a local model
in Ollama.
