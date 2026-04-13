# Codex CLI Config — OpenRouter + Qwen

Codex configuration that bypasses ChatGPT account model restrictions by routing the built-in OpenAI provider through OpenRouter.

## Setup

1. `cp codex/config.example.toml ~/.codex/config.toml`
2. Replace `YOUR_USERNAME` with your macOS username
3. `cp codex/auth.example.json ~/.codex/auth.json` and add your key
4. `export OPENROUTER_API_KEY="sk-or-v1-..."`
5. Add to `~/.zshrc`:
   ```bash
   export RUST_LOG=codex=off,rmcp=off
   ```
6. Run: `codex`

## How it works

| Setting | Purpose |
|---------|---------|
| `openai_base_url` | Routes the built-in `openai` provider to OpenRouter |
| `auth_mode: apikey` | Uses API key auth instead of ChatGPT OAuth |
| `OPENAI_API_KEY` | Your OpenRouter key (Codex treats it as an OpenAI key but sends it to OpenRouter) |
| `model` | Any OpenRouter model works: `qwen/qwen3.6-plus`, `moonshotai/kimi-k2.5`, etc. |
| `RUST_LOG=codex=off,rmcp=off` | Suppresses harmless WebSocket 404 noise |

## Notes
- WebSocket 404 errors are harmless — OpenRouter doesn't support WS, Codex falls back to HTTP
- `auth.json` is **never committed** (it's in `.gitignore`)
