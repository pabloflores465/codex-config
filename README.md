# Codex CLI Config

Codex configuration routing through OpenRouter for third-party models (Qwen, Kimi, etc.).

## Setup

1. Copy config: `cp codex/config.example.toml ~/.codex/config.toml`
2. Replace `YOUR_USERNAME` with your macOS username
3. Set env var: `export OPENROUTER_API_KEY="sk-or-v1-..."`
4. Run: `codex`

## How it works

`openai_base_url` redirects the built-in OpenAI provider to OpenRouter's API endpoint. Combined with `auth_mode: apikey` in `auth.json`, Codex bypasses the ChatGPT account model restrictions.

## Notes
- **WebSocket 404 warnings on startup are harmless** — they resolve via HTTP fallback
- `auth.json` is **never committed** (it's in `.gitignore`)
